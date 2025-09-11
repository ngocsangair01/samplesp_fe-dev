import { Observable } from 'rxjs/Observable';

import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { CommonUtils } from '@app/shared/services';

@Injectable({
    providedIn: 'root'
})
export class RewardProposalService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
      super('political', 'rewardProposal', httpClient, helperService);
  }

  /**
   * saveOrUpdateFormFile
   */
  public readFileImport(item: any): Observable<any> {
    const formdata = CommonUtils.convertFormFile(item);
    const url = `${this.serviceUrl}/readfile-import`;
    return this.postRequest(url, formdata);
  }

  public downloadTemplateImport(data: any): Observable<any> {
    const url = `${this.serviceUrl}/template-import`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public getRewardProposalCode(params: any): Observable<any> {
    const url = `${this.serviceUrl}/get-rewardproposal-code`;
    return this.getRequest(url, {params: params});
  }

  public getEmpInfo(employeeId: Number): Observable<any> {
    const url = `${this.serviceUrl}/emp-info/${employeeId}`;
    return this.getRequest(url);
  }

  public checkingOrgDomainToGetRewardProposalType(organizationId: any): Observable<any> {
    const url = `${this.serviceUrl}/check-get-reward-proposal-type/${organizationId}`;
    return this.getRequest(url);
  }
  public export(data) : Observable<any> {
    const url = `${this.serviceUrl}/export`
    return this.getRequest(url, {params: data, responseType: 'blob'})
  }

  /**
   * Lay danh sach ma don vi tai chinh
   */
  public getOrgCodeList(): Observable<any> {
    const url = `${this.serviceUrl}/get-org-code-list`;
    return this.getRequest(url);
  }

  /**
   * Lay danh sach ma phong/ban tai chinh
   */
  public getDeptCodeListByOrgCode(orgCode: string): Observable<any> {
    const url = `${this.serviceUrl}/get-dept-code-list-by-org-code/${orgCode}`;
    return this.getRequest(url);
  }
}
