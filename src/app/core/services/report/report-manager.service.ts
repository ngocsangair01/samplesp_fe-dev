import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class ReportManagerService extends BasicService {


  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'report-manager', httpClient, helperService);
  }

  search(param, event?) : Observable<any>{
    const url = `${this.serviceUrl}/search?`;
    if (event){
      // param._search = event;
      param._search = CryptoService.encrAesEcb(JSON.stringify(event));
    }
    return this.getRequest(url,{params: CommonUtils.buildParams(param)})
  }
  updateStatusReport(param): Observable<any>{
    const url = `${this.serviceUrl}/status`;
    return this.postRequest(url, param);
  }

  sendSMS(param): Observable<any>{
    const url = `${this.serviceUrl}/send-notify`;
    return this.postRequest(url, param);
  }

  reject(param): Observable<any>{
    const url = `${this.serviceUrl}/reject`;
    return this.postRequest(url, param);
  }
  public showSubmissionHistory(data?: any, event?: any): Observable<any> {
    if (!event) {
      this.credentials = Object.assign({}, data);
    }
    const searchData = CommonUtils.convertData(this.credentials);
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/submission-history`;
    return this.getRequest(url, { params: buildParams });
  }

}
