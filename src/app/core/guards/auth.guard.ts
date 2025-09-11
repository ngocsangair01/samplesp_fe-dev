import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Constants, UrlConfig } from '@env/environment';
import { HrStorage } from '../services/HrStorage';
import {CommonUtils} from "@app/shared/services";

@Injectable()
export class AuthGuard implements CanActivate {
    URL = UrlConfig.ssoAddress + '/login?service=';
    serviceUrl = UrlConfig.clientAddress + '/auth-sso/login';
    constructor(
        private router: Router
    ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
          const userToken = HrStorage.getUserToken();
        // const tokenExpires = Number(CommonUtils.getTokenExpiresIn());
        // console.log('tokenExpires', tokenExpires);
        // if (!tokenExpires || tokenExpires < new Date().getTime()
        if (!userToken) {
            const currentUrl = location.href;
            if (currentUrl.indexOf('assessment/detail/') >= 0) {
                window.location.href = this.URL + encodeURIComponent(this.serviceUrl + '?url=' + encodeURIComponent(currentUrl)) + '&appCode=' + encodeURIComponent(Constants.applicationCode);
            } else {
                window.location.href = this.URL + encodeURIComponent(this.serviceUrl + state.url) + '&appCode=' + encodeURIComponent(Constants.applicationCode);
            }
            return false;
        }
        return true;
      }

}
