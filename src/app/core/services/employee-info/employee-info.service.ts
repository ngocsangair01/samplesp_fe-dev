import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { CommonUtils } from '@app/shared/services';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeInfoService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'employeeInfo', httpClient, helperService);
  }

  public updateEmployeeInfo(data: any): Observable<any> {
    const url = `${this.serviceUrl}/update-personal-information`;
    return this.httpClient.post(url, CommonUtils.convertData(data))
      .pipe(
        tap( // Log the result or error
          res => this.helperService.APP_TOAST_MESSAGE.next(res),
          error => {
            this.helperService.APP_TOAST_MESSAGE.next(error);
          }
        ),
        catchError(this.handleError)
      );
    }

  public getEmployeeInfo(id: number): Observable<any> {
    const employeeId = CommonUtils.nvl(id);
    const url = `${this.serviceUrl}/${employeeId}/emp-info`;
    return this.getRequest(url);
  }
  public findByPositionId(id: number): Observable<any> {
    const positionId = CommonUtils.nvl(id);
    const url = `${this.serviceUrl}/position/${positionId}`;
    return this.getRequest(url);
  }
  public findByEmployeeCode(employeeCode: string): Observable<any> {
    const url = `${this.serviceUrl}/employee-code/${employeeCode}`;
    return this.getRequest(url);
  }
  public updateAvatar(id: number, file): Observable<any> {
    const employeeId = CommonUtils.nvl(id);
    const url = `${this.serviceUrl}/${employeeId}/update-avatar`;
    const data = {file: file};
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }
  public getListDOBEmployee(): Observable<any> {
    const url = `${this.serviceUrl}/emp-dob`;
    return this.getRequest(url);
  }
  public getListOnOffEmployee(dateId: number): Observable<any> {
    const id = CommonUtils.nvl(dateId);
    const url = `${this.serviceUrl}/emp-on-off/${id}`;
    return this.getRequest(url);
  }

  public getListEmpByCon(dateId: number): Observable<any> {
    const id = CommonUtils.nvl(dateId);
    const url = `${this.serviceUrl}/emp-con/${id}`;
    return this.getRequest(url);
  }

  public getOrgManagerByOrgId(id: number): Observable<any> {
    const organizationId = CommonUtils.nvl(id);
    const url = `${this.serviceUrl}/org-manager/${organizationId}`;
    return this.getRequest(url);
  }

  public checkEmailAddress(emailAddress: string): Observable<any> {
    const url = `${this.serviceUrl}/existing-email-address`;
    const params = new HttpParams().set('emailAddress', emailAddress);
    params.append('emailAddress', emailAddress);
    return this.getRequest(url, { params: params });
  }

  public sendWelcomeEmail(id: number, data: any): Observable<any> {
    const employeeId = CommonUtils.nvl(id);
    const url = `${this.serviceUrl}/emp-warning-email/${employeeId}`;
    return this.postRequest(url, data.value);
  }

  public validateBeforeDelete(id: number): Observable<any> {
    const employeeId = CommonUtils.nvl(id);
    const url = `${this.serviceUrl}/validate-before-delete/${employeeId}`;
    return this.getRequest(url);
  }
  public getJoinCompanyDate(id: number): Observable<any> {
    const employeeId = CommonUtils.nvl(id);
    const url = `${this.serviceUrl}/get-join-company-date/${employeeId}`;
    return this.getRequest(url);
  }
}
