import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class EmpArmyProposedDetailService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'empArmyProposedDetail', httpClient, helperService);
  }

  public getListDetail(data: any): Observable<any> {
    const url = `${this.serviceUrl}/getListDetail`;
    return this.getRequest(url,{params: CommonUtils.buildParams(CommonUtils.convertData(data))});
  }

  public updateConditionCheck(data: any): Observable<any> {
    const url = `${this.serviceUrl}/updateConditionCheck`;
    return this.postRequest(url,CommonUtils.convertData(data), true, true);
  }
}
