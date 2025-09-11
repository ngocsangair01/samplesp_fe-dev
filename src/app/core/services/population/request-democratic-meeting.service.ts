import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class RequestDemocraticMeetingService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'requestDemocraticMeeting', httpClient, helperService);
  }
  public prepareSave(id: number): Observable<any> {
    const url = `${this.serviceUrl}/` +'prepare-save/'+ CommonUtils.convertData(id);
    return this.getRequest(url);
  }

  public sendRequest(item: any): Observable<any> {
    const url = `${this.serviceUrl}/` +'send-request/';
    return this.postRequest(url, CommonUtils.convertData(item));  
  }

  public export(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public findBeanById(requestResolutionsMonthId: number): Observable<any>{
    const url = `${this.serviceUrl}/find-bean-by-id/${requestResolutionsMonthId}`;
    return this.getRequest(url, CommonUtils.convertData(requestResolutionsMonthId));
  }

   public sendRejectResponse(data: any): Observable<any> {
    const url = `${this.serviceUrl}/reject-response`;
    return this.getRequest(url, {params: data});
  }

  public checkOrgLeaf(data: any): Observable<any> {
    const url = `${this.serviceUrl}/check-org-leaf`;
    return this.getRequest(url, {params: data});
  }

}
