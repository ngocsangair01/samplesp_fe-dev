import { CommonUtils } from '@app/shared/services/common-utils.service';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BasicService } from './../basic.service';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';

@Injectable({
  providedIn: 'root'
})
export class ReceiveNotificationGroupService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'receiveNotificationGroup', httpClient, helperService);
  }

  /**
   * get list group
   */
  public getListGroup(): Observable<any> {
    const url = `${this.serviceUrl}/get-list-group`;
    return this.getRequest(url);
  }

  public downloadTemplateImport(data): Observable<any> {
    const url = `${this.serviceUrl}/export-template`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public processImport(data): Observable<any> {
    const url = `${this.serviceUrl}/import`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }

  public getBlackList(): Observable<any> {
    const url = `${this.serviceUrl}/get-black-list`;
    return this.getRequest(url);
  }

}
