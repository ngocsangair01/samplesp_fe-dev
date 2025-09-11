
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class TransferPartyMemberService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'transferPartyMember', httpClient, helperService);
  }

  public export(data): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.postRequestFile(url, data);
  }

  public getDataFormValue(employeeId): Observable<any> {
    const url = `${this.serviceUrl}/get-tpm-form-data/` + CommonUtils.convertData(employeeId);
    return this.getRequest(url);
  }

  public findProcessLast(partyMemberId: number): Observable<any> {
    const url = `${this.serviceUrl}/find-process-last/` + partyMemberId;
    return this.getRequest(url);
  }
  public viewDataFormValue(transferPartyMemberId): Observable<any> {
    const url = `${this.serviceUrl}/view-tpm-form-data/` + CommonUtils.convertData(transferPartyMemberId);
    return this.getRequest(url);
  }
  public showHistoryTransferPartySigner(data?: any, event?: any): Observable<any> {
    if (!event) {
      this.credentials = Object.assign({}, data);
    }
    const searchData = CommonUtils.convertData(this.credentials);
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/tranfer-history`;
    return this.getRequest(url, { params: buildParams });
  }

  public approved(item: any): Observable<any> {
    const url = `${this.serviceUrl}/approved`;
    return this.postRequest(url, CommonUtils.convertData(item));
  }
  public actionAccept(item: any): Observable<any> {
    const url = `${this.serviceUrl}/accept`;
    return this.postRequest(url, CommonUtils.convertData(item));
  }

  // public unApprove(item:any): Observable<any> {
  //   const url = `${this.serviceUrl}/unapprove`;
  //   return this.postRequest(url, CommonUtils.convertData(item));
  // }

  public retired(item: any): Observable<any> {
    const url = `${this.serviceUrl}/retired`;
    return this.postRequest(url, CommonUtils.convertData(item));
  }

  public reasonUnApprove(item: any): Observable<any> {
    const url = `${this.serviceUrl}/unapprove`;
    return this.postRequest(url, CommonUtils.convertData(item));
  }

  // cancel stream
  public reasonCancelStream(item: any): Observable<any> {
    const url = `${this.serviceUrl}/cancel-stream`;
    return this.postRequest(url, CommonUtils.convertData(item));
  }

  /**
   * findOne
   * param id
   */
  public findOneIsView(id: number): Observable<any> {
    const url = `${this.serviceUrl}/view/${id}`;
    return this.getRequest(url);
  }

  public partyApprovalAccept(item: any) {
    const url = `${this.serviceUrl}/party-approval-accept`;
    return this.postRequest(url, CommonUtils.convertData(item));
  }

  public getPartyOrg(item: number): Observable<any> {
    const url = `${this.serviceUrl}/get-party-org/${item}`;
    return this.getRequest(url);
  }

  public exportSignTemplate(signDocumentId: number): Observable<any> {
    const url = `${this.serviceUrl}/export-sign-template/${signDocumentId}`;
    return this.getRequest(url, {responseType: 'blob'});
  }

  public checkJobActive(): Observable<any>{
    const url = `${this.serviceUrl}/check-job-active`;
    return this.getRequest(url);
  }

  public callJobTransfer(): Observable<any>{
    const url = `${this.serviceUrl}/call-job-transfer`;
    return this.getRequest(url);
  }
}
