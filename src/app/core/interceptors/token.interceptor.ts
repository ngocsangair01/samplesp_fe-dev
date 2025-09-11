import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HrStorage } from '../services/HrStorage';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CommonUtils } from '@app/shared/services';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public router: Router) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        'Authorization': `Bearer ${this.getAccessToken()}`,
        // 'sangnn-api-key': `c9f55dab-d44a-43c0-a922-d7133efdb28d`,
        'Current-Language':  this.getCurrentLanguageCode(),
        'Current-Market':  this.getCurrentMarket(),
        'sso-two-factor-ticket': this.getTwoFactorTicket(),
      }
    });
    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {

        }
      }, error => {
        if (error.status === 401) {
          // Do later: set currentUrl when redirect from SSO
          // HrStorage.setCurrentUrl(this.router.url);
          // this.router.navigate(['/auth-sso']);
          //them xử lý xem logout như thế nào?
          CommonUtils.logoutAction();
        }
      })
    );
  }
  getCurrentLanguageCode(): string {
    const selectedLang = HrStorage.getSelectedLang();
    if (selectedLang == null) {
      return 'en';
    } else {
      return selectedLang.code;
    }
  }
  getCurrentMarket(): string {
    const selectedMarket = HrStorage.getSelectedMarket();
    if (selectedMarket == null) {
      return '';
    } else {
      return selectedMarket.marketCompanyId;
    }
  }
  getAccessToken() {
    const userToken = HrStorage.getUserToken();

    if (userToken == null) {
      return '';
    } else {
      return userToken.access_token;
    }
  }
  getTwoFactorTicket() {
    if (window.TwoFactor && window.TwoFactor.getTicket()) {
      return window.TwoFactor.getTicket();
    }
    return '';
  }
}
