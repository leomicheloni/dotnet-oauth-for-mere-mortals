import { TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { mockClass } from '../../test/auto-mock';
import { CallbackContext } from './callback-context';
import { CodeFlowCallbackHandlerService } from './callback-handling/code-flow-callback-handler.service';
import { HistoryJwtKeysCallbackHandlerService } from './callback-handling/history-jwt-keys-callback-handler.service';
import { ImplicitFlowCallbackHandlerService } from './callback-handling/implicit-flow-callback-handler.service';
import { RefreshSessionCallbackHandlerService } from './callback-handling/refresh-session-callback-handler.service';
import { RefreshTokenCallbackHandlerService } from './callback-handling/refresh-token-callback-handler.service';
import { StateValidationCallbackHandlerService } from './callback-handling/state-validation-callback-handler.service';
import { UserCallbackHandlerService } from './callback-handling/user-callback-handler.service';
import { FlowsService } from './flows.service';

describe('Flows Service', () => {
  let service: FlowsService;
  let codeFlowCallbackHandlerService: CodeFlowCallbackHandlerService;
  let implicitFlowCallbackHandlerService: ImplicitFlowCallbackHandlerService;
  let historyJwtKeysCallbackHandlerService: HistoryJwtKeysCallbackHandlerService;
  let userCallbackHandlerService: UserCallbackHandlerService;
  let stateValidationCallbackHandlerService: StateValidationCallbackHandlerService;
  let refreshSessionCallbackHandlerService: RefreshSessionCallbackHandlerService;
  let refreshTokenCallbackHandlerService: RefreshTokenCallbackHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FlowsService,
        {
          provide: CodeFlowCallbackHandlerService,
          useClass: mockClass(CodeFlowCallbackHandlerService),
        },
        {
          provide: ImplicitFlowCallbackHandlerService,
          useClass: mockClass(ImplicitFlowCallbackHandlerService),
        },
        {
          provide: HistoryJwtKeysCallbackHandlerService,
          useClass: mockClass(HistoryJwtKeysCallbackHandlerService),
        },
        {
          provide: UserCallbackHandlerService,
          useClass: mockClass(UserCallbackHandlerService),
        },
        {
          provide: StateValidationCallbackHandlerService,
          useClass: mockClass(StateValidationCallbackHandlerService),
        },
        {
          provide: RefreshSessionCallbackHandlerService,
          useClass: mockClass(RefreshSessionCallbackHandlerService),
        },
        {
          provide: RefreshTokenCallbackHandlerService,
          useClass: mockClass(RefreshTokenCallbackHandlerService),
        },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(FlowsService);
    codeFlowCallbackHandlerService = TestBed.inject(
      CodeFlowCallbackHandlerService
    );
    implicitFlowCallbackHandlerService = TestBed.inject(
      ImplicitFlowCallbackHandlerService
    );
    historyJwtKeysCallbackHandlerService = TestBed.inject(
      HistoryJwtKeysCallbackHandlerService
    );
    userCallbackHandlerService = TestBed.inject(UserCallbackHandlerService);
    stateValidationCallbackHandlerService = TestBed.inject(
      StateValidationCallbackHandlerService
    );
    refreshSessionCallbackHandlerService = TestBed.inject(
      RefreshSessionCallbackHandlerService
    );
    refreshTokenCallbackHandlerService = TestBed.inject(
      RefreshTokenCallbackHandlerService
    );
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('processCodeFlowCallback', () => {
    it('calls all methods correctly', waitForAsync(() => {
      const codeFlowCallbackSpy = spyOn(
        codeFlowCallbackHandlerService,
        'codeFlowCallback'
      ).and.returnValue(of(null));
      const codeFlowCodeRequestSpy = spyOn(
        codeFlowCallbackHandlerService,
        'codeFlowCodeRequest'
      ).and.returnValue(of(null));
      const callbackHistoryAndResetJwtKeysSpy = spyOn(
        historyJwtKeysCallbackHandlerService,
        'callbackHistoryAndResetJwtKeys'
      ).and.returnValue(of(null));
      const callbackStateValidationSpy = spyOn(
        stateValidationCallbackHandlerService,
        'callbackStateValidation'
      ).and.returnValue(of(null));
      const callbackUserSpy = spyOn(
        userCallbackHandlerService,
        'callbackUser'
      ).and.returnValue(of(null));
      const allConfigs = [
        {
          configId: 'configId1',
        },
      ];

      service
        .processCodeFlowCallback('some-url1234', allConfigs[0], allConfigs)
        .subscribe((value) => {
          expect(value).toBeNull();
          expect(codeFlowCallbackSpy).toHaveBeenCalledOnceWith(
            'some-url1234',
            allConfigs[0]
          );
          expect(codeFlowCodeRequestSpy).toHaveBeenCalledTimes(1);
          expect(callbackHistoryAndResetJwtKeysSpy).toHaveBeenCalledTimes(1);
          expect(callbackStateValidationSpy).toHaveBeenCalledTimes(1);
          expect(callbackUserSpy).toHaveBeenCalledTimes(1);
        });
    }));
  });

  describe('processSilentRenewCodeFlowCallback', () => {
    it('calls all methods correctly', waitForAsync(() => {
      const codeFlowCodeRequestSpy = spyOn(
        codeFlowCallbackHandlerService,
        'codeFlowCodeRequest'
      ).and.returnValue(of(null));
      const callbackHistoryAndResetJwtKeysSpy = spyOn(
        historyJwtKeysCallbackHandlerService,
        'callbackHistoryAndResetJwtKeys'
      ).and.returnValue(of(null));
      const callbackStateValidationSpy = spyOn(
        stateValidationCallbackHandlerService,
        'callbackStateValidation'
      ).and.returnValue(of(null));
      const callbackUserSpy = spyOn(
        userCallbackHandlerService,
        'callbackUser'
      ).and.returnValue(of(null));
      const allConfigs = [
        {
          configId: 'configId1',
        },
      ];

      service
        .processSilentRenewCodeFlowCallback(
          {} as CallbackContext,
          allConfigs[0],
          allConfigs
        )
        .subscribe((value) => {
          expect(value).toBeNull();
          expect(codeFlowCodeRequestSpy).toHaveBeenCalled();
          expect(callbackHistoryAndResetJwtKeysSpy).toHaveBeenCalled();
          expect(callbackStateValidationSpy).toHaveBeenCalled();
          expect(callbackUserSpy).toHaveBeenCalled();
        });
    }));
  });

  describe('processImplicitFlowCallback', () => {
    it('calls all methods correctly', waitForAsync(() => {
      const implicitFlowCallbackSpy = spyOn(
        implicitFlowCallbackHandlerService,
        'implicitFlowCallback'
      ).and.returnValue(of(null));
      const callbackHistoryAndResetJwtKeysSpy = spyOn(
        historyJwtKeysCallbackHandlerService,
        'callbackHistoryAndResetJwtKeys'
      ).and.returnValue(of(null));
      const callbackStateValidationSpy = spyOn(
        stateValidationCallbackHandlerService,
        'callbackStateValidation'
      ).and.returnValue(of(null));
      const callbackUserSpy = spyOn(
        userCallbackHandlerService,
        'callbackUser'
      ).and.returnValue(of(null));
      const allConfigs = [
        {
          configId: 'configId1',
        },
      ];

      service
        .processImplicitFlowCallback(allConfigs[0], allConfigs, 'any-hash')
        .subscribe((value) => {
          expect(value).toBeNull();
          expect(implicitFlowCallbackSpy).toHaveBeenCalled();
          expect(callbackHistoryAndResetJwtKeysSpy).toHaveBeenCalled();
          expect(callbackStateValidationSpy).toHaveBeenCalled();
          expect(callbackUserSpy).toHaveBeenCalled();
        });
    }));
  });

  describe('processRefreshToken', () => {
    it('calls all methods correctly', waitForAsync(() => {
      const refreshSessionWithRefreshTokensSpy = spyOn(
        refreshSessionCallbackHandlerService,
        'refreshSessionWithRefreshTokens'
      ).and.returnValue(of(null));
      const refreshTokensRequestTokensSpy = spyOn(
        refreshTokenCallbackHandlerService,
        'refreshTokensRequestTokens'
      ).and.returnValue(of(null));
      const callbackHistoryAndResetJwtKeysSpy = spyOn(
        historyJwtKeysCallbackHandlerService,
        'callbackHistoryAndResetJwtKeys'
      ).and.returnValue(of(null));
      const callbackStateValidationSpy = spyOn(
        stateValidationCallbackHandlerService,
        'callbackStateValidation'
      ).and.returnValue(of(null));
      const callbackUserSpy = spyOn(
        userCallbackHandlerService,
        'callbackUser'
      ).and.returnValue(of(null));
      const allConfigs = [
        {
          configId: 'configId1',
        },
      ];

      service
        .processRefreshToken(allConfigs[0], allConfigs)
        .subscribe((value) => {
          expect(value).toBeNull();
          expect(refreshSessionWithRefreshTokensSpy).toHaveBeenCalled();
          expect(refreshTokensRequestTokensSpy).toHaveBeenCalled();
          expect(callbackHistoryAndResetJwtKeysSpy).toHaveBeenCalled();
          expect(callbackStateValidationSpy).toHaveBeenCalled();
          expect(callbackUserSpy).toHaveBeenCalled();
        });
    }));
  });
});
