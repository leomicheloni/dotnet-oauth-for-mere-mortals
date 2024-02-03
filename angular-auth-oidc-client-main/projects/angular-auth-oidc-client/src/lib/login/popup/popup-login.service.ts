import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { AuthOptions } from '../../auth-options';
import { CheckAuthService } from '../../auth-state/check-auth.service';
import { AuthWellKnownService } from '../../config/auth-well-known/auth-well-known.service';
import { OpenIdConfiguration } from '../../config/openid-configuration';
import { LoggerService } from '../../logging/logger.service';
import { UrlService } from '../../utils/url/url.service';
import { LoginResponse } from '../login-response';
import { PopupOptions } from './popup-options';
import { PopUpService } from './popup.service';
import { ResponseTypeValidationService } from '../response-type-validation/response-type-validation.service';
import { PopupResultReceivedUrl } from './popup-result';

@Injectable({ providedIn: 'root' })
export class PopUpLoginService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly responseTypeValidationService: ResponseTypeValidationService,
    private readonly urlService: UrlService,
    private readonly authWellKnownService: AuthWellKnownService,
    private readonly popupService: PopUpService,
    private readonly checkAuthService: CheckAuthService
  ) {}

  loginWithPopUpStandard(
    configuration: OpenIdConfiguration,
    allConfigs: OpenIdConfiguration[],
    authOptions?: AuthOptions,
    popupOptions?: PopupOptions
  ): Observable<LoginResponse> {
    const { configId } = configuration;

    if (
      !this.responseTypeValidationService.hasConfigValidResponseType(
        configuration
      )
    ) {
      const errorMessage = 'Invalid response type!';

      this.loggerService.logError(configuration, errorMessage);

      return throwError(() => new Error(errorMessage));
    }

    this.loggerService.logDebug(
      configuration,
      'BEGIN Authorize OIDC Flow with popup, no auth data'
    );

    return this.authWellKnownService
      .queryAndStoreAuthWellKnownEndPoints(configuration)
      .pipe(
        switchMap(() =>
          this.urlService.getAuthorizeUrl(configuration, authOptions)
        ),
        tap((authUrl: string) =>
          this.popupService.openPopUp(authUrl, popupOptions, configuration)
        ),
        switchMap(() => {
          return this.popupService.result$.pipe(
            take(1),
            switchMap((result: PopupResultReceivedUrl) => {
              const { userClosed, receivedUrl } = result;

              if (userClosed) {
                return of({
                  isAuthenticated: false,
                  errorMessage: 'User closed popup',
                  userData: null,
                  idToken: null,
                  accessToken: null,
                  configId,
                });
              }

              return this.checkAuthService.checkAuth(
                configuration,
                allConfigs,
                receivedUrl
              );
            })
          );
        })
      );
  }
}
