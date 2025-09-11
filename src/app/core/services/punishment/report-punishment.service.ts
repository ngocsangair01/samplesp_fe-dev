import { BasicService } from '@app/core/services/basic.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';

import { CommonUtils } from '@app/shared/services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportPunishmentService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'reportPunishment', httpClient, helperService);
  }
  public reportPunishmentYear(data) {
    const url = `${this.serviceUrl}/report-year`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }
  /**
   * Bao cao so sanh du lieu cung ky truoc, cung ky sau
   * @param data 
   */
  public processExportCompare(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export-compare-period`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  /**
   * Bao cao so sanh so lieu giua 2 thoi diem
   * @param data 
   */
  public processExportCompareProcess(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export-compare-process-report`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }
}
