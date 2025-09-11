import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class TemplateNotifyService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'template-notify', httpClient, helperService);
  }

  public saveOrUpdate(item: any): Observable<any> {
    const url = `${this.serviceUrl}/admin/template-notify`;
    return this.postRequest(url, CommonUtils.convertData(item));  
  }
}
