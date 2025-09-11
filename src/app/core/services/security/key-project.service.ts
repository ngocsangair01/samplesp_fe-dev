import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BasicService } from '@app/core/services/basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import {CommonUtils, CryptoService} from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class KeyProjectService extends BasicService {

    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'keyProject', httpClient, helperService);
    }

  /**
   * Lấy danh sách dự án trọng điểm còn hiệu lực
   */
  public getAllValidityKeyProjectsForm(): Observable<any> {
    const url = `${this.serviceUrl}/get-all-validity`;
    return this.getRequest(url);
  }
  
  public approved(item: any): Observable<any> {
    const url = `${this.serviceUrl}/approved`;
    return this.postRequest(url, CommonUtils.convertData(item));
  }

  public cancel(item: any): Observable<any> {
    const url = `${this.serviceUrl}/cancel`;
    return this.postRequest(url, CommonUtils.convertData(item));
  }

  public reasonUnApprove(item: any): Observable<any> {
    const url = `${this.serviceUrl}/unApproved`;
    return this.postRequest(url, CommonUtils.convertData(item));
  }
  /**
   * Lấy ra toàn bộ danh sách dự án trọng điểm
   */
  public getAllKeyProjectsForm(): Observable<any> {
    const url = `${this.serviceUrl}/get-all`;
    return this.getRequest(url);
  }
  public export(data): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public processSearchKeyProjectForEmployee(employeeId, event?: any) {
    if (!event) {
      this.credentials = Object.assign({}, employeeId);
    }
    const searchData = CommonUtils.convertData(this.credentials);
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/key-project-info/${employeeId}`;
    return this.getRequest(url, {params: buildParams});
  }

  public exportDashboardWarning(): Observable<any> {
    const url = `${this.serviceUrl}/export-dashboard-warning`;
    return this.getRequest(url, {responseType: 'blob'});
  }
}
