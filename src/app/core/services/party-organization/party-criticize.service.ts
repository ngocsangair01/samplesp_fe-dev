import { CommonUtils } from './../../../shared/services/common-utils.service';
import { Observable } from 'rxjs';
import { HelperService } from './../../../shared/services/helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class PartyCriticizeService extends BasicService{

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'partyCriticize', httpClient, helperService);
  }
  public downloadTemplateImport(): Observable<any> {
    const url = `${this.serviceUrl}/export-template`;
    return this.getRequest(url, {responseType: 'blob'});
  }
  public processImport(data): Observable<any> {
    const url = `${this.serviceUrl}/import`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }
  public export(params): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, {params: params, responseType: 'blob' })
  }
  public exportListPartyCriticize(params): Observable<any> {
    const url = `${this.serviceUrl}/export-list-party-criticize`;
    return this.getRequest(url, {params: params, responseType: 'blob' })
  }
}
