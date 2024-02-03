import { NgModule } from '@angular/core';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';

@NgModule({
  imports: [
    AuthModule.forRoot({
      config: {
        authority: 'http://localhost:8088/realms/master',
        redirectUrl: window.location.origin,
        clientId:
          'implicit',
        responseType: 'id_token token',
        scope: 'openid',
        triggerAuthorizationResultEvent: true,
        postLogoutRedirectUri: window.location.origin + '/unauthorized',
        startCheckSession: false,
        silentRenew: false,
        silentRenewUrl: window.location.origin + '/silent-renew.html',
        postLoginRoute: '/home',
        forbiddenRoute: '/forbidden',
        unauthorizedRoute: '/unauthorized',
        logLevel: LogLevel.Debug,
        historyCleanupOff: true,
        autoUserInfo: false,
        // iss_validation_off: false
        // disable_iat_offset_validation: true
      },
    }),
  ],
  exports: [AuthModule],
})
export class AuthConfigModule {}
