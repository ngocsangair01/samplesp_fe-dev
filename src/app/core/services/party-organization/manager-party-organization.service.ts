import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';


@Injectable({
  providedIn: 'root'
})
export class ManagerPartyOrganizationService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'managerPartyOrg', httpClient, helperService);
  }

  public prepareSave(id: number): Observable<any> {
    const url = `${this.serviceUrl}/` +'prepare-save/'+ CommonUtils.convertData(id);
    return this.getRequest(url);
  }

  public export(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }
}
