import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthStateService } from '../../auth-state/auth-state.service';
import { OpenIdConfiguration } from '../../config/openid-configuration';
import { LoggerService } from '../../logging/logger.service';
import { UserService } from '../../user-data/user.service';
import { StateValidationResult } from '../../validation/state-validation-result';
import { CallbackContext } from '../callback-context';
import { FlowsDataService } from '../flows-data.service';
import { ResetAuthDataService } from '../reset-auth-data.service';

@Injectable({ providedIn: 'root' })
export class UserCallbackHandlerService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly authStateService: AuthStateService,
    private readonly flowsDataService: FlowsDataService,
    private readonly userService: UserService,
    private readonly resetAuthDataService: ResetAuthDataService
  ) {}

  // STEP 5 userData
  callbackUser(
    callbackContext: CallbackContext,
    configuration: OpenIdConfiguration,
    allConfigs: OpenIdConfiguration[]
  ): Observable<CallbackContext> {
    const { isRenewProcess, validationResult, authResult, refreshToken } =
      callbackContext;
    const { autoUserInfo, renewUserInfoAfterTokenRenew } = configuration;

    if (!autoUserInfo) {
      if (!isRenewProcess || renewUserInfoAfterTokenRenew) {
        // userData is set to the id_token decoded, auto get user data set to false
        if (validationResult.decodedIdToken) {
          this.userService.setUserDataToStore(
            validationResult.decodedIdToken,
            configuration,
            allConfigs
          );
        }
      }

      if (!isRenewProcess && !refreshToken) {
        this.flowsDataService.setSessionState(
          authResult.session_state,
          configuration
        );
      }

      this.publishAuthState(validationResult, isRenewProcess);

      return of(callbackContext);
    }

    return this.userService
      .getAndPersistUserDataInStore(
        configuration,
        allConfigs,
        isRenewProcess,
        validationResult.idToken,
        validationResult.decodedIdToken
      )
      .pipe(
        switchMap((userData) => {
          if (!!userData) {
            if (!refreshToken) {
              this.flowsDataService.setSessionState(
                authResult.session_state,
                configuration
              );
            }

            this.publishAuthState(validationResult, isRenewProcess);

            return of(callbackContext);
          } else {
            this.resetAuthDataService.resetAuthorizationData(
              configuration,
              allConfigs
            );
            this.publishUnauthenticatedState(validationResult, isRenewProcess);
            const errorMessage = `Called for userData but they were ${userData}`;

            this.loggerService.logWarning(configuration, errorMessage);

            return throwError(() => new Error(errorMessage));
          }
        }),
        catchError((err) => {
          const errorMessage = `Failed to retrieve user info with error:  ${err}`;

          this.loggerService.logWarning(configuration, errorMessage);

          return throwError(() => new Error(errorMessage));
        })
      );
  }

  private publishAuthState(
    stateValidationResult: StateValidationResult,
    isRenewProcess: boolean
  ): void {
    this.authStateService.updateAndPublishAuthState({
      isAuthenticated: true,
      validationResult: stateValidationResult.state,
      isRenewProcess,
    });
  }

  private publishUnauthenticatedState(
    stateValidationResult: StateValidationResult,
    isRenewProcess: boolean
  ): void {
    this.authStateService.updateAndPublishAuthState({
      isAuthenticated: false,
      validationResult: stateValidationResult.state,
      isRenewProcess,
    });
  }
}
