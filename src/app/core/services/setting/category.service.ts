import { Observable } from 'rxjs/Observable';
import { CommonUtils } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'category', httpClient, helperService);
  }

  public findByCategoryTypeId(sysCatTypeId: number): Observable<any> {
    const url = `${this.serviceUrl}/find-by-category-type-id/${sysCatTypeId}`;
    return this.getRequest(url);
  }

  public findByCategoryTypeCode(code: string): Observable<any> {
    const url = `${this.serviceUrl}/find-by-category-type-code/${code}`;
    return this.getRequest(url);
  }

  public findByGroupId(groupId: number): Observable<any> {
    const url = `${this.serviceUrl}/find-by-group-id/${groupId}`;
    return this.getRequest(url);
  }

}
