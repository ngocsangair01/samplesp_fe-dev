import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from './../basic.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RetirementReportService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'retirementReport', httpClient, helperService);
  }
  /**
   * báo cáo nghỉ chờ hưu
   */
  public retirementReport(params: any): Observable<any> {
    const url = `${this.serviceUrl}/retirement-reports`;
    return this.getRequest(url, { params: params, responseType: 'blob' });
  }
  /**
   * báo cáo nghỉ chờ hưu trong ky
   */
  public inRetirementReport(params: any): Observable<any> {
    const url = `${this.serviceUrl}/in-retirement-reports`;
    return this.getRequest(url, { params: params, responseType: 'blob' });
  }

}
