import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { CommonUtils } from '@app/shared/services';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class NotificationService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'notification', httpClient, helperService );
  }

  public export(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public getHomeNotification(): Observable<any> {
    const url = `${this.serviceUrl}/home-notification`;
    return this.getRequest(url);
  }

  /**
   * request
   */
  public request(item: any): Observable<any> {
    const url = `${this.serviceUrl}/request`;
    return this.postRequest(url, CommonUtils.convertData(item));  
  }

  /**
   * sendNotification
   */
  public sendNotification(item: any): Observable<any> {
    const url = `${this.serviceUrl}/send-notification`;
    return this.postRequest(url, CommonUtils.convertData(item));  
  }
}
