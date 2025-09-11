import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from './../basic.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeLongLeaveReportService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'employeeLongLeaveReport', httpClient, helperService);
  }
  /**
   * Báo cáo chi tiết nghỉ dài ngày đối với Cán bộ Quản lý
   */
  public export(): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, { responseType: 'blob' });
  }

}
