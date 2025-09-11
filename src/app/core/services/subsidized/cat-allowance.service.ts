import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonUtils } from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class CatAllowanceService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'catAllowance', httpClient, helperService);
  }

  public getDataForDropdownCatAllowance(data: any): Observable<any> {
    const buildParams = CommonUtils.buildParams(data);
    const url = `${this.serviceUrl}/find-subsidized-type-list`;
    return this.getRequest(url, { params: buildParams });
  }
}
