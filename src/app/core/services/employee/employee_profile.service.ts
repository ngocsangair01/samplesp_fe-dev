import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class EmployeeProfileService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'employee-profile', httpClient, helperService);
  }

  public getListEmpFileType() {
    const url = `${this.serviceUrl}/get-list-emp-file-type`;
    return this.getRequest(url);
  }

  public getListRequireEmpFileType(data): Observable<any> {
    const url = `${this.serviceUrl}/get-list-require-emp-file-type`;
    return this.getRequest(url, {params: data});
  }

  public downloadFileFromTTNS(attachmentFileId) {
    const url = `${this.serviceUrl}/download-file-form-ttns/${attachmentFileId}`;
    return this.getRequest(url, {responseType: 'blob'});
  } 

  public export(employeeId) {
    const url = `${this.serviceUrl}/export-profile/${employeeId}`;
    return this.getRequest(url, {responseType: 'blob'});
  }

  public downloadTemplateImport(employeeId: number): Observable<any> {
    const url = `${this.serviceUrl}/export-template/${employeeId}`;
    return this.getRequest(url, {responseType: 'blob'});
  }

  public processImport(data): Observable<any> {
    const url = `${this.serviceUrl}/import`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }

  public getPositionInfoByEmployeeId(employeeId: number): Observable<any> {
    const url = `${this.serviceUrl}/position-info/${employeeId}`;
    return this.getRequest(url);
  }

}
