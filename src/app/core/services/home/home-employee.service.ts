import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import {EmployeeInfoService} from '../employee-info/employee-info.service';

@Injectable({
  providedIn: 'root'
})
export class HomeEmployeeService extends BasicService {
  constructor(public httpClient: HttpClient
    , public helperService: HelperService
    , public employeeInfoService: EmployeeInfoService
    ) {
    super('political', 'homeEmployee', httpClient, helperService);
  }
  public getEmployeeInfo(employeeCode: string): Observable<any> {
    const url = `${this.serviceUrl}/login-info/${employeeCode}`;
    return this.getRequest(url);
  }
}
