import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from './../basic.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupOrgPositionReportService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'groupOrgPositionReport', httpClient, helperService);
  }
  /**
   * báo cáo nhóm chức danh theo đơn vị
   */
  public groupOrgPositionReport(params: any): Observable<any> {
    const url = `${this.serviceUrl}/group-org-position`;
    return this.getRequest(url, { params: params, responseType: 'blob' });
  }

  /**
   * báo cáo chi tiết nhóm chức danh theo đơn vị
   */
  public detailGroupOrgPositionReport(params: any): Observable<any> {
    const url = `${this.serviceUrl}/export-detail-group-org-positions`;
    return this.getRequest(url, { params: params, responseType: 'blob' });
  }
}
