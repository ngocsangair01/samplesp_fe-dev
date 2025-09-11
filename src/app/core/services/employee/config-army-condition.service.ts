import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class ConfigArmyConditionService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'configArmyCondition', httpClient, helperService);
  }

  public getDataTypeList(): Observable<any> {
    const url = `${this.serviceUrl}/getDataType`;
    return this.getRequest(url);
  }

  public findByType(type? :any): Observable<any> {
    const url = `${this.serviceUrl}/get-list-by-type/${type}`;
    return this.getRequest(url);
  }
}
