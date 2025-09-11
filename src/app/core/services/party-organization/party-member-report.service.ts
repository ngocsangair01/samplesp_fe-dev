import { Observable } from 'rxjs/Observable';
import { CommonUtils } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class PartyMemberReportService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'partyMemberReport', httpClient, helperService);
  }

  public exportPartyMemberDetails(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export-party-member-details`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }
  public exportPartyMemberTotal(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export-party-member-total`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public exportCommitteesReport(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export-committees-report`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public exportNotYetTransferPartyMember(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export-not-yet-transfer-party-member`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public exportNotYetTransferPartyMemberHaveSynthetic(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export-not-yet-transfer-party-member-synthetic`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }
}
