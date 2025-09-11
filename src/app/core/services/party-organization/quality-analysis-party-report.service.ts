import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QualityAnalysisPartyReportService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'qualityAnalysisPartyReport', httpClient, helperService);
  }

  /** bao cao danh gia, xep loai to chuc dang  */
  public processPartyQualityReport(params: any): Observable<any> {
    const url = `${this.serviceUrl}/quality-analysis-party-org-report`;
    return this, this.getRequest(url, {params: params, responseType: 'blob'})
  }

  /** bao cao danh gia, xep loai dang vien */
  public processPartyMemberQualityReport(params: any): Observable<any> {
    const url = `${this.serviceUrl}/quality-analysis-party-member-report`;
    return this, this.getRequest(url, {params: params, responseType: 'blob'})
  }

  /** tong hop xep loai to chuc Dang */
  public partyClassificationReport(params: any): Observable<any> {
    const url = `${this.serviceUrl}/party-classification-report`;
    return this, this.getRequest(url, {params: params, responseType: 'blob'})
  }

  /** bao cao tong hop danh gia, xep loai dang vien */
  public processTotalPartyMemberQualityReport(params: any): Observable<any> {
    const url = `${this.serviceUrl}/total-quality-analysis-party-member-report`;
    return this, this.getRequest(url, {params: params, responseType: 'blob'})
  }

  /** bao cao tong hop danh gia, xep loai dang, dang vien */
  public processTotalPartyOrgMemberQualityReport(params: any): Observable<any> {
    const url = `${this.serviceUrl}/total-quality-analysis-party-org-member-report`;
    return this, this.getRequest(url, {params: params, responseType: 'blob'})
  }
}
