import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from './../basic.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartyReportService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'partyReport', httpClient, helperService);
  }
  /**
   * báo cáo cơ cấu
   */
  public processPartyStructureReport(params: any): Observable<any> {
    const url = `${this.serviceUrl}/party-structure`;
    return this.getRequest(url, {params: params, responseType: 'blob'});
  }
    /**
   * báo cáo chi tiết cơ cấu
   */
  public processPartyStructureReportDetail(params: any): Observable<any> {
    const url = `${this.serviceUrl}/party-structure-detail`;
    return this.getRequest(url, {params: params, responseType: 'blob'});
  }
  /**
   * báo cáo niên hạn
   */
  public processPartyExpiredReport(params: any): Observable<any> {
    const url = `${this.serviceUrl}/party-expired`;
    return this.getRequest(url, {params: params, responseType: 'blob'});
  }
  
  /** bao cao chi tiet nien han  */
  public processPartyExpiredReportDetail(params: any): Observable<any> {
    const url = `${this.serviceUrl}/party-expired-detail`;
    return this,this.getRequest(url, {params: params, responseType: 'blob'})
  }

  /** Báo cáo chi tiết tuổi PVTN của Sĩ quan  */
  public exportServeArmyAgeDetailReport(params: any): Observable<any> {
    const url = `${this.serviceUrl}/export-serve-army-age-detail-report`;
    return this,this.getRequest(url, {params: params, responseType: 'blob'})
  }

  /** Báo cáo chi tiết cán bộ quản lý  */
  public exportDetailOfManagersReport(params: any): Observable<any> {
    const url = `${this.serviceUrl}/details-of-managers`;
    return this,this.getRequest(url, {params: params, responseType: 'blob'})
  }

  /** Báo cáo chi tiết niên hạn cán bộ  */
  public exportDetailPartyExpiredReport(params: any): Observable<any> {
    const url = `${this.serviceUrl}/export-party-expired-detail-report`;
    return this,this.getRequest(url, {params: params, responseType: 'blob'})
  }
}
