import { Injectable } from '@angular/core';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BasicService } from './basic.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Constants } from '@env/environment';
import { UserToken } from '@app/core/models';
import { HelperService } from '@app/shared/services/helper.service';
export class ILoginContext {
  username: string;
  password: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BasicService {
  accessToken: string;
  expiresAt: number;
  userProfile: any;
  authenticated: boolean;

  constructor(public httpClient: HttpClient,
              public helperService: HelperService) {
    super('oauth', 'oauthToken', httpClient, helperService);
  }

  extractTokenData(token: any): any {
    // const helper = new JwtHelperService();
    // const decodedToken = helper.decodeToken(token.access_token);
    const expireDate = new Date().getTime() + (1000 * token.expires_in);
    const loginUser = {
      access_token: token.access_token,
      email: token.email,
      employeeCode: token.employeeCode,
      expires_in: token.expires_in,
      fullName: token.fullName,
      loginName: token.loginName,
      phoneNumber: token.phoneNumber,
      userId: token.userId,
      loginTime: new Date().getTime(),
      tokenExpiresIn: expireDate
    };

    return loginUser;
  }

  /**
   * action request token
   */
  public actionRequestToken(params: any): Observable<any> {
    const url = `${this.serviceUrl}oauth/token`;
    return this.postRequest(url, params.toString());
  }
  /**
   * action request authorities
   */
  public actionRequestAuthorities(appCode: string): Observable<any> {
    const url = `${this.serviceUrl}vps-authorities?appCode=${appCode}`;
    return this.getRequest(url);
  }
  /**
   * findAllMenus: get all menus for WorkFlows
   */
  public findAllMenus(): Observable<any> {
    const url = `${this.serviceUrl}menus?appCode=${Constants.applicationCode}`;
    return this.getRequest(url);
  }
  public tokenInfos(): Observable<any> {
    const url = `${this.serviceUrl}token-infos`;
    return this.getRequest(url);
  }
  logout(): Observable<boolean> {
    return of(false);
  }

  get isLoggedIn(): boolean {
    // Check if current date is before token
    // expiration and user is signed in locally
    return this.authenticated;
  }

}
