import { Observable } from 'rxjs/Observable';
import { CommonUtils } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class EmpManagementVerticalService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'empManagementVertical', httpClient, helperService);
  }

  public export(params): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, {params: params, responseType: 'blob' })
  }

  public downloadTemplateImport(data): Observable<any> {
    const url = `${this.serviceUrl}/download-template`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public processImport(data): Observable<any> {
    const url = `${this.serviceUrl}/import`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }
}
