import { Injectable, ViewChild } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class WorkProcessService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'workProcess', httpClient, helperService);
  }

  public processSearchSynchronized(data: any, event?: any) {
    if (!event) {
      this.credentials = Object.assign({}, data);
    }

    const searchData = CommonUtils.convertData(this.credentials);
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/process-search/${data}`;
    return this.getRequest(url, {params: buildParams});
  }

  public processChangeKeyPosition(workProcessIdList) {
    const url = `${this.serviceUrl}/change-key-position`;
    return this.postRequest(url, workProcessIdList);
  }

  public processExportKeyPositionNotEnoughFile(data?: any) {
    const url = `${this.serviceUrl}/export/key_position_not_enough_file`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }
}
