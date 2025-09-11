import { CommonUtils } from '@app/shared/services/common-utils.service';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BasicService } from './../basic.service';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryTypeService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'cateType', httpClient, helperService);
  }

  public listParamUsed(): Observable<any> {
    const url = `${this.serviceUrl}/paramUsed`;
    return this.getRequest(url);
  }

  public findByGroupId(groupId: number): Observable<any> {
    const url = `${this.serviceUrl}/find-by-group-id/${groupId}`;
    return this.getRequest(url);
  }
  
}
