import { environment } from '../../../../environments/environment';
import { CONFIG } from '../../app-config';
import { Constants } from '@env/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { CommonUtils } from '@app/shared/services';


@Injectable({
  providedIn: 'root'
})
export class DistrictService extends BasicService {

  private API_URL: string = environment.serverUrl.sys;

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'district', httpClient, helperService);
  }

  /**
   * Lay danh sach tinh thanh
   * getProvinceList
   */
  public getDistrictList(): Observable<any> {
    const url = `${this.serviceUrl}/districtWardList`;
    return this.getRequest(url);
  }

  public getDistrictByProvinceId(provinceId: number): Observable<any> {
    const id = CommonUtils.nvl(provinceId);
    const url = `${this.serviceUrl}/districtList/${id}`;
    return this.getRequest(url);   
  }

  public getDistrictByParentId(districtId: number): Observable<any> {
    const id = CommonUtils.nvl(districtId);
    const url = `${this.serviceUrl}/wardList/parent/${id}`;
    return this.getRequest(url);   
  }     
}