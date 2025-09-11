import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from './../basic.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class TransferEmployeeService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'transferEmployee', httpClient, helperService);
  }

  private _isPartyMember: boolean = false;

  get isPartyMember(): boolean {
    return this._isPartyMember;
  }

  set isPartyMember(value: boolean) {
    this._isPartyMember = value;
  }

  /**
   * báo cáo điều động cán bộ
   */
  public processExport(params: any): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, { params: params, responseType: 'blob' });
  }

  public evaluate(item: any): Observable<any> {
    const url = `${this.serviceUrl}/evaluate`;
    return this.postRequest(url, CommonUtils.convertData(item));  
  }

  public autogenousCode(params: any): Observable<any> {
    const url = `${this.serviceUrl}/auto-gen-code`;
    return this.getRequest(url, { params: params });
  }

  public findPositionByOrgId(params: any): Observable<any> {
    const url = `${this.serviceUrl}/find-positions`;
    return this.getRequest(url, { params: params });
  }

  public request(item: any): Observable<any> {
    const url = `${this.serviceUrl}/request`;
    return this.postRequest(url, CommonUtils.convertData(item));  
  }

  public complete(item: any): Observable<any> {
    const url = `${this.serviceUrl}/complete`;
    return this.postRequest(url, CommonUtils.convertData(item));  
  }

  public approval(item: any): Observable<any> {
    const url = `${this.serviceUrl}/approval`;
    return this.postRequest(url, CommonUtils.convertData(item));  
  }


  public unApproval(item: any): Observable<any> {
    const url = `${this.serviceUrl}/un-approval`;
    return this.postRequest(url, CommonUtils.convertData(item));  
  }

  public searchDetail(data?: any, event?: any): Observable<any> {
    const searchData = CommonUtils.convertData(Object.assign({}, data));
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/search-detail?`;
    return this.getRequest(url, {params: buildParams});
  }

  public assessmentDetail(data?: any, event?: any): Observable<any> {
    const searchData = CommonUtils.convertData(Object.assign({}, data));
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/assessment-search?`;
    return this.getRequest(url, {params: buildParams});
  }
}
