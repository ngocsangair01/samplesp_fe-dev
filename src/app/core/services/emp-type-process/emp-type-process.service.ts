import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class EmpTypeProcessService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'empTypeProcess', httpClient, helperService);
  }

  public findFileById(empTypeProcessId: number): Observable<any> {
    const url = `${this.serviceUrl}/${empTypeProcessId}/file`;
    return this.getRequest(url);
  }

  public checkContinuousProcess(item: any): Observable<any> {
    const formdata = CommonUtils.convertFormFile(item);
    const url = `${this.serviceUrl}/check-continuous-process`;
    return this.postRequest(url, formdata);
  }

  public validateBeforeSave(item: any): Observable<any> {
    const formdata = CommonUtils.convertFormFile(item);
    const url = `${this.serviceUrl}/validate-before-save`;
    return this.postRequest(url, formdata);
  }

  /**
   * getMainProcessByEmployeeId
   */
  public getMainProcessByEmployeeId(employeeId: number) {
    const url = `${this.serviceUrl}/main-process-by-employee/${employeeId}`;
    return this.getRequest(url);
  }
}
