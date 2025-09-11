import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class EmpThoroughContentService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'emp-thorough-content', httpClient, helperService);
  }

  search(data, event?) : Observable<any>{
    let param = {...data};
    const url = `${this.serviceUrl}/search?`;
    param.status = param.status ? param.status.id : '';
    if (event){
      param._search = CryptoService.encrAesEcb(JSON.stringify(event));
    }
    return this.getRequest(url,{params: CommonUtils.buildParams(param)})
  }

  public sendReminder(data: any): Observable<any> {
    const url = `${this.serviceUrl}/send-reminder`;
    return this.postRequest(url, CommonUtils.convertData(data));
  }

  public export(data: any, type): Observable<any> {
    const url = `${this.serviceUrl}/export/${type}`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }
}
