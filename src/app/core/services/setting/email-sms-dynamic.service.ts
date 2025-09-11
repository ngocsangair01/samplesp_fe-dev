import { HttpClient } from '@angular/common/http';
import { BasicService } from './../basic.service';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import {Observable} from "rxjs/Observable";
import {CommonUtils} from "../../../shared/services";

@Injectable({
  providedIn: 'root'
})
export class EmailSmsDynamicService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'emailSmsDynamic', httpClient, helperService);
  }

  public sendNotification(data): Observable<any> {
    const formdata = CommonUtils.convertFormFile(data);
    const url = `${this.serviceUrl}/send-notification`;
    return this.postRequest(url, formdata)

  }

  public searchPopUp(data: any): Observable<any> {
    const url = `${this.serviceUrl}/search-popup`;
    return this.getRequest(url, {params: data});
  }

  public processCheckSQL(data: any): Observable<any> {
    const url = `${this.serviceUrl}/check-sql`;
    return this.getRequest(url, {params: data});
  }
  
}
