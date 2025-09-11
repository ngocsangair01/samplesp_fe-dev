import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportWorkWarningSecurityService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'reportWorkWarningSecurity', httpClient, helperService);
  }
  public reportEmployeeChangeWork(params: any): Observable<any> {
    const url = `${this.serviceUrl}/report-employee-change-work`;
    return this.getRequest(url, { params: params, responseType: 'blob' });
  }
}