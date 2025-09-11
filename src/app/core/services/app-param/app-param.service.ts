import { Observable } from 'rxjs/Observable';
import { CommonUtils } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class AppParamService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'app-params', httpClient, helperService);
  }

  public appParams(item: any) {
    return this.getRequest(`${this.serviceUrl}/` + CommonUtils.convertData(item));
  }

  public getValueByCode(code: string): Observable<any> {
    const url = `${this.serviceUrl}/get-value-by-code/${code}`;
    return this.getRequest(url);
  }

  public findAllByParType(type: string): Observable<any> {
    const url = `${this.serviceUrl}/find-by-par-type/${type}`;
    return this.getRequest(url);
  }

  public findByName(name: string): Observable<any> {
    const url = `${this.serviceUrl}/name/${name}`;
    return this.getRequest(url);
  }
  
  public listParamUsed(): Observable<any> {
    const url = `${this.serviceUrl}/paramUsed`;
    return this.getRequest(url);
  }

  public findEffectiveParamByName(name: string): Observable<any> {
    const url = `${this.serviceUrl}/effective-sys-param/${name}`;
    return this.getRequest(url);
  }

  public saveTranferSetrvice(item: any): Observable<any> {
    const url = `${this.serviceUrl}/save-tranfer-service`;
    return this.postRequest(url, CommonUtils.convertData(item));
  }

  public getListBranchCode(branchCode: string): Observable<any> {
    const url = `${this.serviceUrl}/getListBranchCode/${branchCode}`;
    return this.getRequest(url);
  }

  public getAllParType() : Observable<any> {
    const url = `${this.serviceUrl}/get-all-par-type`;
    return this.getRequest(url);
  }
}
