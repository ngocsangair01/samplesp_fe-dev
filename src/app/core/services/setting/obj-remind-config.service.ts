import { Observable } from 'rxjs/Observable';
import { CommonUtils } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class ObjRemindConfigService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'objRemindConfig', httpClient, helperService);
  }
  public findListType() {
    const url = `${this.serviceUrl}/find-list-type`;
    return this.getRequest(url);
  }

}
