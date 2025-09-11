import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class PositionService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'group-org-position', httpClient, helperService);
  }

  public saveMappingGroup(data: any): Observable<any> {
    const url = `${this.serviceUrl}/save-mapping-group`;
    return this.postRequest(url, CommonUtils.convertData(data));
  }
}
