import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class MassRequestService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'massRequest', httpClient, helperService);
  }

  /**
   * Ra yêu cầu
   */
  public setRequest(id: number) {
    const massRequestId = CommonUtils.nvl(id);
    const url = `${this.serviceUrl}/${massRequestId}/request`;
    return this.postRequest(url, massRequestId);
  }

}
