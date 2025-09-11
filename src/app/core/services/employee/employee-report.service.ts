import { HelperService } from '@app/shared/services/helper.service';
import { CommonUtils } from '@app/shared/services';
import { BasicService } from './../basic.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeReportService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'employeeReport', httpClient, helperService);
  }
  public export(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public downloadTemplateImport(): Observable<any> {
    const url = `${this.serviceUrl}/export-template`;
    return this.getRequest(url, {responseType: 'blob'});
  }

  public processImport(data): Observable<any> {
    const url = `${this.serviceUrl}/import`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }

  public downloadTemplateImportWithData(data): Observable<any> {
    const url = `${this.serviceUrl}/export-template-with-data`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }
}
