import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {CommonUtils, CryptoService} from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class AdSchedulerService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'adScheduler', httpClient, helperService);
  }

  public confirmRunJob(data: any): Observable<any> {
    const url = `${this.serviceUrl}/confirmRunJob`;
    return this.postRequest(url, data);
  }
  public confirmKillJob(data: any): Observable<any> {
    const url = `${this.serviceUrl}/confirmKillJob`;
    return this.postRequest(url, data);
  }  
  public downloadLogFile(data: any): Observable<any> {   
    const url = `${this.serviceUrl}/downloadLogFile`;
    return this.getRequest(url,{params:data, responseType: 'blob' });
  }
  
}
