import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class PolicyReportService extends BasicService{

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'employeePolicy', httpClient, helperService);
  }

  public ethnicReport(params: any): Observable<any> {
    const url = `${this.serviceUrl}/ethnic-export`;
    return this.getRequest(url, {params: params, responseType: 'blob'});
  }

  
  public ethnicSyntheticReport(params: any): Observable<any> {
    const url = `${this.serviceUrl}/minority-ethnic-export`;
    return this.getRequest(url, {params: params, responseType: 'blob'});
  }

  public reportSynthesisSoldier(params: any): Observable<any> {
    const url = `${this.serviceUrl}/synthesis-soldier-export`;
    return this.getRequest(url, {params: params, responseType: 'blob'});
  }

  public reportListEmpHaveParentSoldier(params: any): Observable<any> {
    const url = `${this.serviceUrl}/emp-have-parent-soldier`;
    return this.getRequest(url, {params: params, responseType: 'blob'});
  }
}
