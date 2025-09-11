import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class ResponseResolutionMonthService extends BasicService{

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'responseResolutionMonth', httpClient, helperService);
  }

  public findBeanById(responseResolutionsMonthId: number): Observable<any>{
    const url = `${this.serviceUrl}/find-bean-by-id/${responseResolutionsMonthId}`;
    return this.getRequest(url, CommonUtils.convertData(responseResolutionsMonthId));
  }
  public downloadFile(transCode: string): Observable<any> {
    const url = `${this.serviceUrl}/download-file/${transCode}`;
    return this.getRequest(url, { responseType: 'blob' });
  }

  public getEmployeeBySelectThorough(data?: any): Observable<any>{
    const searchData = CommonUtils.convertData(Object.assign({}, data));
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/get-employee-by-thorough?`;
    return this.getRequest(url, {params: buildParams});
  }

  public searchEmployeeByThorough(data?: any): Observable<any>{
    const searchData = CommonUtils.convertData(Object.assign({}, data));
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/search-employee-by-thorough?`;
    return this.getRequest(url, {params: buildParams});
  }

  public processThorough(form): Observable<any> {
    const url = `${this.serviceUrl}/process-thorough`;
    return this.postRequest(url, CommonUtils.convertData(form));
  }

  public saveOrUpdateContent(form): Observable<any> {
    const url = `${this.serviceUrl}/save-content`;
    return this.postRequest(url, CommonUtils.convertData(form));
  }
}
