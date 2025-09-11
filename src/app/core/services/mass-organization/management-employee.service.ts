import { CommonUtils } from '@app/shared/services';
import { Observable } from 'rxjs';
import { HelperService } from '../../../shared/services/helper.service';
import { HttpClient } from '@angular/common/http';
import { BasicService } from '@app/core/services/basic.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ManagementEmployeeService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'employeeMembers', httpClient, helperService);
  }

  public getEmployee(employeeId: number): Observable<any> { // gen data when choose employee
    const url = `${this.serviceUrl}/search-employee/${employeeId}`;
    return this.getRequest(url);
  }
  public getLstEmployeeType(): Observable<any> {
    const url = `${this.serviceUrl}/get-list-employee-type`;
    return this.getRequest(url);
  }
  public getLstEmpType(empTypeId: number): Observable<any> {
    const url = `${this.serviceUrl}/get-list-employee-type/${empTypeId}`;
    return this.getRequest(url);
  }
  public export(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, { params: data, responseType: 'blob' });
  }
  public downloadTemplateImport(data): Observable<any> {
    const url = `${this.serviceUrl}/export-template`;
    return this.getRequest(url, { params: data, responseType: 'blob' });
  }
  public processImport(data): Observable<any> {
    const url = `${this.serviceUrl}/import`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }
  public saveMassMemberList(data): Observable<any> {
    const url = `${this.serviceUrl}/save-mass-member-list`;
    return this.postRequest(url, CommonUtils.convertData(data));
  }
  public saveMassMember(data): Observable<any> {
    const url = `${this.serviceUrl}/save-mass-member`;
    return this.postRequest(url, CommonUtils.convertData(data));
  }
  public getDataDetail(branch:number, employeeId: number): Observable<any> {
    const url = `${this.serviceUrl}/get-data-detail/${branch}/${employeeId}`;
    return this.getRequest(url);
  }
  public deleteByEmployeeId(branch:number, employeeId: number): Observable<any> {
    const url = `${this.serviceUrl}/delete-by-employee-id/${branch}/${employeeId}`;
    return this.getRequest(url);
  }
}
