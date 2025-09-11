
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class PartyCongressEmployeeService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'partyCongress', httpClient, helperService);
  }

  public downloadTemplate(data?: any): Observable<any> {
    const url = `${this.serviceUrl}/download-template`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public processImport(data): Observable<any> {
    const url = `${this.serviceUrl}/import`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }

  public exportListPartyCongressEmployee(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export-party-congress-employee`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }
  public export(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public processConfirm(data): Observable<any> {
    const url = `${this.serviceUrl}/process-confirm`;
    return this.postRequest(url, data);
  }

  public exportListPartyCongressEmployeeExcerpt(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export-party-congress-employee-excerpt`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }
}
