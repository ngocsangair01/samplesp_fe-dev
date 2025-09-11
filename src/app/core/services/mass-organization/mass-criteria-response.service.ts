import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class MassCriteriaResponseService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'massCriteriaResponse', httpClient, helperService);
  }
  /**
   * Lưu cây tiêu chí
   */
  public saveTreeMassCriteriaPlanById(id: number, treeNode) {
    const massRequestId = CommonUtils.nvl(id);
    const url = `${this.serviceUrl}/${massRequestId}/mass-criteria-plan-tree`;
    return this.postRequest(url, treeNode);
  }
  /**
    * find tree criteria
    */
  public findTreeMassCriteriaById(id: number) {
    const massRequestId = CommonUtils.nvl(id);
    const url = `${this.serviceUrl}/${massRequestId}/mass-criteria-tree`;
    return this.getRequest(url);
  }
  /**
    * findTreeCriteriaByDomainIds
    */
  public findMassCriteriaTreeByMassCriteriaId(id: number, otherId: number) {
    const massRequestId = CommonUtils.nvl(id);
    const massCriteriaId = CommonUtils.nvl(otherId);
    const url = `${this.serviceUrl}/${massRequestId}/mass-criteria-tree/${massCriteriaId}`;
    return this.getRequest(url);
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
    return this.getRequest(url, params);
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

  /**
   * Hoàn thành tiêu chí
   */
  public finishMassCriteria(item: any) {
    const url = `${this.serviceUrl}/finish-mass-criteria`;
    return this.postRequest(url, CommonUtils.convertData(item));
  }

  public processSearchDetailCriteria(data: any, event?: any) {
    const searchData = CommonUtils.convertData(Object.assign({}, data));
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/search-detail-criteria`;
    return this.getRequest(url, {params: buildParams});
  }

  
  public export(data) : Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, {params: data, responseType: 'blob'})
  }

  public findMassRequestByMassCriteriaResponseId(massCriteriaResponseId):Observable<any> {
    const url = `${this.serviceUrl}/find-mass-request-by-mass-criteria-response-id/${massCriteriaResponseId}`;
    return this.getRequest(url)
  }
}
