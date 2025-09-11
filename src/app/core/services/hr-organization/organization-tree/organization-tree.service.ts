import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../../basic.service';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class OrganizationTreeService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'organization-tree', httpClient, helperService);
  }

  public findData(item: any) {
    return this.getRequest(`${this.serviceUrl}/` + CommonUtils.convertData(item));
  }
}
