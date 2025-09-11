import { BasicService } from './../basic.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HelperService } from '@app/shared/services/helper.service';

@Injectable({
  providedIn: 'root'
})
export class PartyOrgSelectorService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'partyOrgSelector', httpClient, helperService);
  }
  /**
   * action load org tree
   */
  public actionInitAjax(params: any): Observable<any> {
    const url = `${this.serviceUrl}/action-init-ajax`;
    return this.postRequest(url, params);
  }
  /**
   * action load org tree
   */
  public actionLazyRead(params: any): Observable<any> {
    const url = `${this.serviceUrl}/action-lazy-read`;
    return this.postRequest(url, params);
  }
    /**
   * action load org tree by line org
   */
  public actionInitAjaxByLineOrg(params: any): Observable<any> {
    const url = `${this.serviceUrl}/action-init-ajax-by-line-org`;
    return this.postRequest(url, params);
  }
  /**
   * action load org tree by line org
   */
  public actionLazyReadByLineOrg(params: any): Observable<any> {
    const url = `${this.serviceUrl}/action-lazy-read-by-line-org`;
    return this.postRequest(url, params);
  }
   /**
   * action load org tree
   */
  public actionInitAjaxAll(params: any): Observable<any> {
    const url = `${this.serviceUrl}/action-init-ajax-all`;
    return this.postRequest(url, params);
  }
}
