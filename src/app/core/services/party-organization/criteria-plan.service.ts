import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';


@Injectable({
  providedIn: 'root'
})
export class CriteriaPlanService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'criteriaPlan', httpClient, helperService);
  }

  /**
   * Lưu cây tiêu chí
   */
  public saveTreeCriteriaPlanById(id: number, treeNode) {
    const requestResolutionsId = CommonUtils.nvl(id);
    const url = `${this.serviceUrl}/${requestResolutionsId}/criteria-plan-tree`;
    return this.postRequest(url, treeNode);
  }

  /**
  * find tree criteria
  */
  public findTreeCriteriaById(id: number) {
    const requestResolutionsId = CommonUtils.nvl(id);
    const url = `${this.serviceUrl}/${requestResolutionsId}/criteria-tree`;
    return this.getRequest(url);
  }

  /**
  * findTreeCriteriaByDomainIds
  */
  public findCriteriaTreeByCriteriaId(id: number, otherId: number) {
    const requestResolutionsId = CommonUtils.nvl(id);
    const cateCriteriaId = CommonUtils.nvl(otherId);
    const url = `${this.serviceUrl}/${requestResolutionsId}/criteria-tree/${cateCriteriaId}`;
    return this.getRequest(url);
  }

  /**
  * findTreeCriteriaByDomainIds
  */
  public findTreeCriteriaByDomainIds(id: number) {
    const requestResolutionsId = CommonUtils.nvl(id);
    const url = `${this.serviceUrl}/${requestResolutionsId}/criteria-tree-by-domain`;
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

    
  public showHistoryCriteria(data?: any, event?: any): Observable<any> {
    if (!event) {
      this.credentials = Object.assign({}, data);
    }
    const searchData = CommonUtils.convertData(this.credentials);
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/criteria-history`;
    return this.getRequest(url, {params: buildParams});
  }
}
