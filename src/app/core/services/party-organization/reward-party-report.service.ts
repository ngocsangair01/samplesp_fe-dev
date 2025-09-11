import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class RewardPartyReportService extends BasicService{

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'rewardPartyReport', httpClient, helperService);
  }

  public exportRewardYearPartyOrganization(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export-reward-year-party-organization`;
    const buildParams = CommonUtils.buildParams(data);
    return this.getRequest(url, {params: buildParams, responseType: 'blob'});
  }
  public exportRewardYearPartyMember(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export-reward-year-party-member`;
    const buildParams = CommonUtils.buildParams(data);
    return this.getRequest(url, {params: buildParams, responseType: 'blob'});
  }
  public exportTotalRewardParty(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export-total-reward-party`;
    const buildParams = CommonUtils.buildParams(data);
    return this.getRequest(url, {params: buildParams, responseType: 'blob'});
  }
}
