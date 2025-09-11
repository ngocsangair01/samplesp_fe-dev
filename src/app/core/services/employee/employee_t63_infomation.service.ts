import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class EmployeeT63InfomationService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'employee-t63-infomation', httpClient, helperService);
  }

  public export(data): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    const params = CommonUtils.buildParams(data);
    return this.getRequest(url, {params: params, responseType: 'blob'});
  }
}
