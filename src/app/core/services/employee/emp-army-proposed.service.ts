import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class EmpArmyProposedService extends BasicService {


  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'empArmyProposed', httpClient, helperService);
  }

  public findById(empArmyProposedId: any): Observable<any> {
    const url = `${this.serviceUrl}/${empArmyProposedId}`;
    return this.getRequest(url);
  }

  public updateSignOrganizationId(data: any) : Observable<any> {
    const url = `${this.serviceUrl}/update-sign-organization-id`;
    return this.postRequest(url, CommonUtils.convertData(data));
  }

  public getDocumentSignID(data: any) :Observable<any> {
    const url = `${this.serviceUrl}/get_document_sign`;
    return this.postRequest(url, CommonUtils.convertData(data));
  }

  public getListType(): Observable<any> {
    const url = `${this.serviceUrl}/getType`;
    return this.getRequest(url);
  }

  public getListStatus(): Observable<any> {
    const url = `${this.serviceUrl}/getStatus`;
    return this.getRequest(url);
  }
  
  public saveAll(data: any): Observable<any> {
    const url = `${this.serviceUrl}/saveAll`;
    return this.postRequest(url, CommonUtils.convertData(data));  
  }

  public checkTypeDownloadFile(data: any): Observable<any> {
    const url = `${this.serviceUrl}/report/type-download-file`;
    return this.postRequest(url, data);
  }
  
  public processSign(data?: any, event?: any): Observable<any> {
    if (!event) {
      this.credentials = Object.assign({}, data);
    }
    
    const signData = CommonUtils.convertData(this.credentials);
    const buildParams = CommonUtils.buildParams(signData);
    const url = `${this.serviceUrl}/process-sign?`;
    return this.getRequest(url, {params: buildParams});
  }

  public processLatch(empArmyProposedId: any): Observable<any> {
    const url = `${this.serviceUrl}/process-latch/${empArmyProposedId}`;
    return this.getRequest(url);
  }

  public cancelLatch(empArmyProposedId: any): Observable<any> {
    const url = `${this.serviceUrl}/cancel-latch/${empArmyProposedId}`;
    return this.getRequest(url);
  }

  public reEvaluate(empArmyProposedId: any): Observable<any> {
    const url = `${this.serviceUrl}/re-evaluate/${empArmyProposedId}`;
    return this.getRequest(url);
  }

  public checkSign(organizationId: any): Observable<any> {
    const url = `${this.serviceUrl}/${organizationId}/count-emp-not-latch`;
    return this.getRequest(url);
  }

  public processLatchList(data?: any): Observable<any> {
    this.credentials = Object.assign({}, data);
    const signData = CommonUtils.convertData(this.credentials);
    const buildParams = CommonUtils.buildParams(signData);
    const url = `${this.serviceUrl}/process-latch-list?`;
    return this.getRequest(url, {params: buildParams});
  }

  public cancelLatchList(data?: any): Observable<any> {
    this.credentials = Object.assign({}, data);
    const signData = CommonUtils.convertData(this.credentials);
    const buildParams = CommonUtils.buildParams(signData);
    const url = `${this.serviceUrl}/cancel-latch-list?`;
    return this.getRequest(url, {params: buildParams});
  }

  public systemSearch(data?: any, event?: any): Observable<any> {
    const formdata = CommonUtils.convertFormFile(data);
    const url = `${this.serviceUrl}/system-search?`;
    return this.postRequest(url, formdata);
  }

  public getSoldierLevel(): Observable<any> {
    const url = `${this.serviceUrl}/get-soldier-level`;
    return this.getRequest(url);
  }
}
