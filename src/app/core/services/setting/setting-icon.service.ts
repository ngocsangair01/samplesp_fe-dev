import { Observable } from 'rxjs/Observable';
import { CommonUtils } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class SettingIconService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('assessment', 'settingIcon', httpClient, helperService);
  }
  public findSettingIconListByIconType(iconTypeCode: string) {
    const url = `${this.serviceUrl}/get-setting-icons-by-type/${iconTypeCode}`;
    return this.getRequest(url);
  }
}
