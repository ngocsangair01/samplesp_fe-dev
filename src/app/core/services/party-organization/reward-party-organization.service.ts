import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class RewardPartyOrganizationService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'rewardPartyOrganization', httpClient, helperService);
  }

  public downloadTemplate(data: any): Observable<any> {
    const url = `${this.serviceUrl}/download-template`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public processImport(data): Observable<any> {
    const url = `${this.serviceUrl}/import`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }

  public exportRewardYearTable(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export-reward-year-table`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public exportRewardYear(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export-reward-year`;
    const buildParams = CommonUtils.buildParams(data);
    return this.getRequest(url, {params: buildParams, responseType: 'blob'});
  }

  public exportImportRewardPartyOrg(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export-import-reward-party-org`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }


  public searchRewardPartyOrg(data?: any, event?: any): Observable<any> {
    const searchData = CommonUtils.convertData(Object.assign({}, data));
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/search-reward-party-org?`;
    return this.getRequest(url, {params: buildParams});
  }

  public getPartyOrganizationNameByImportRewardPartyOrgId(importRewardPartyOrganizationId): Observable<any> {
    const url = `${this.serviceUrl}/party-org-name/${importRewardPartyOrganizationId}`;
    return this.getRequest(url);
  }
}
