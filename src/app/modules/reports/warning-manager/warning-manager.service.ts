import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { BasicService } from '../../../core/services/basic.service';

@Injectable({
  providedIn: 'root'
})
export class WarningManagerService extends BasicService{

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('report', 'warningManager', httpClient, helperService);
  }

  public getListBranchCode(): Observable<any> {
    const getListBranchCode = `${this.serviceUrl}/getListBranchCode`;
    return this.getRequest(getListBranchCode);
  }

  public getWarning(warningType: String): Observable<any>{
    const url = `${this.serviceUrl}/getWarning/${warningType}`;
    return this.getRequest(url);
  }

  public getColumn(params: any): Observable<any>{
    const url = `${this.serviceUrl}/get-column-return`;
    return this.getRequest(url, {params: params});
  }

  public getListBranchCodeOrderPartValue(): Observable<any> {
    const getListBranchCodeOrderPartValue = `${this.serviceUrl}/getListBranchCodeOrderPartValue`;
    return this.getRequest(getListBranchCodeOrderPartValue);
  }

  public export(data: any): Observable<any>{
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url,{params: data, responseType: 'blob'});
  }

}

