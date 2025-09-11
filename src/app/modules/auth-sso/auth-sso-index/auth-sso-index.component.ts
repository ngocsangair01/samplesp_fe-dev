import { Component, OnInit } from '@angular/core';
import { HrStorage } from '@app/core/services/HrStorage';
import { UrlConfig, Constants } from '@env/environment';

@Component({
  selector: 'auth-sso-index',
  templateUrl: './auth-sso-index.component.html',
  styles: []
})
export class AuthSsoIndexComponent implements OnInit {
  // https://localhost:6443/cas/login?service=http%3A%2F%2Flocalhost%3A4200%2Fauth-sso%2Flogin
  URL = UrlConfig.ssoAddress + '/login?service=';
  serviceUrl = UrlConfig.clientAddress + '/auth-sso/login';
  constructor() {
    window.location.href = this.URL + encodeURIComponent(this.serviceUrl) + '&appCode=' + encodeURIComponent(Constants.applicationCode);
  }
  ngOnInit() {
  }

}
