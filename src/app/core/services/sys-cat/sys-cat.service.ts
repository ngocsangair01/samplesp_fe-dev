import { Observable } from 'rxjs/Observable';
import { CommonUtils } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class SysCatService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'sys-cat', httpClient, helperService);
  }

  public findBySysCatTypeId(sysCatTypeId: any): Observable<any> {
    const id = CommonUtils.nvl(sysCatTypeId);
    const url = `${this.serviceUrl}/find-by-sys-cat-type-id/${id}`;
    return this.getRequest(url);
  }

  public findBySysCatTypeIdActive(sysCatTypeId: any): Observable<any> {
    const id = CommonUtils.nvl(sysCatTypeId);
    const url = `${this.serviceUrl}/find-by-sys-cat-type-id-active/${id}`;
    return this.getRequest(url);
  }

  public getListSysCatFamilyRelationShip(): Observable<any> {
    const url = `${this.serviceUrl}/family-relationship`;
    return this.getRequest(url);
  }

  public getSysCatListBySysCatTypeIdSortOrderOrName(sysCatTypeId: any): Observable<any> {
    const id = CommonUtils.nvl(sysCatTypeId);
    const url = `${this.serviceUrl}/by-sys-cat-type-sort-order-or-name/${id}`;
    return this.getRequest(url);
  }

  public getAllBySysCatTypeCode(code: string): Observable<any> {
    const url = `${this.serviceUrl}/by-sys-cat-types/${code}`;
    return this.getRequest(url);
  }

  public getGroupRequirement(): Observable<any> {
    const url = `${this.serviceUrl}/group-requirement`;
    return this.getRequest(url);
  }

  public findBySysCatTypeIds(ids: string): Observable<any> {
    const url = `${this.serviceUrl}/find-by-sys-cat-type-ids/${ids}`;
    return this.getRequest(url);
  }

  public findById(ids: any): Observable<any> {
    const url = `${this.serviceUrl}/get-description/${ids}`;
    return this.getRequest(url);
  }

}
