import { Component, OnInit } from '@angular/core';
import {
  OidcClientNotification,
  OidcSecurityService,
  OpenIdConfiguration,
  UserDataResult,
} from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit {
  configuration$: Observable<OpenIdConfiguration>;
  userDataChanged$: Observable<OidcClientNotification<any>>;
  userData$: Observable<UserDataResult>;
  isAuthenticated = false;
  checkSessionChanged$: Observable<boolean>;
  checkSessionChanged: any;

  constructor(public oidcSecurityService: OidcSecurityService) {}
  ngOnInit() {
    this.configuration$ = this.oidcSecurityService.getConfiguration();
    this.userData$ = this.oidcSecurityService.userData$;
    this.checkSessionChanged$ = this.oidcSecurityService.checkSessionChanged$;

    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({ isAuthenticated }) => {
        this.isAuthenticated = isAuthenticated;

        console.warn('isAuthenticated: ', isAuthenticated);
      }
    );
  }
  login() {
    console.log('start login');
    this.oidcSecurityService.authorize();
  }

  refreshSessionCheckSession() {
    console.log('start refreshSession');
    this.oidcSecurityService.authorize();
  }

  forceRefreshSession() {
    this.oidcSecurityService
      .forceRefreshSession()
      .subscribe((result) => console.log(result));
  }

  logout() {
    console.log('start logoff');
    this.oidcSecurityService
      .logoff()
      .subscribe((result) => console.log(result));
  }
}
