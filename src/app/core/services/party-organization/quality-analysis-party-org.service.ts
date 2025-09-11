import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';


@Injectable({
  providedIn: 'root'
})
export class QualityAnalysisPartyOrgService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'qualityAnalysisPartyOrg', httpClient, helperService);
  }

  public downloadTemplateImport(data): Observable<any> {
    const url = `${this.serviceUrl}/export-template`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public processImport(data): Observable<any> {
    const url = `${this.serviceUrl}/import`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }

  /**
   * getQualityRating
   * param id
   */
  public getQualityRating(partyOrganizationId: number): Observable<any> {
    const url = `${this.serviceUrl}/get-list-quality-rating/${partyOrganizationId}`;
    return this.getRequest(url);
  }

  public exportImportQualityAnalysisPartyOrganization(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export-import-quality-analysis-party-organization`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public exportQualityAnalysisPartyOrganization(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export-quality-analysis-party-organization`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public searchQualityAnalysisPartyOrganization(data?: any, event?: any): Observable<any> {
    const searchData = CommonUtils.convertData(Object.assign({}, data));
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/search-quality-analysis-party-org?`;
    return this.getRequest(url, {params: buildParams});
  }

  
  public getPartyOrganizationNameByImportQualityAnalysisPartyOrgId(importQualityAnalysisPartyOrgId){
    const url = `${this.serviceUrl}/party-org-name/${importQualityAnalysisPartyOrgId}`;
    return this.getRequest(url);
  }
}
