import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class KeyProjectEmployeeService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'keyProjectEmployee', httpClient, helperService);
  }
  public export(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }
  /**
   * Import process political manage
   * @param data
   */
  public processImport(data): Observable<any> {
    const url = `${this.serviceUrl}/import`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }
  public downloadTemplateImport(data): Observable<any> {
    const url = `${this.serviceUrl}/export-template`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public deleteList(data): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'});
    const options = { headers: headers };
    const listRemove = CommonUtils.convertData(data);
    let url = `${this.serviceUrl}/removeList`;
    return this.postRequest(url, listRemove);
  }

  public exportDashboardWarning(): Observable<any> {
    const url = `${this.serviceUrl}/export-dashboard-warning`;
    return this.getRequest(url, {responseType: 'blob'});
  }
}
