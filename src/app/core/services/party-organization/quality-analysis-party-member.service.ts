import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';


@Injectable({
  providedIn: 'root'
})
export class QualityAnalysisPartyMemberService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'qualityAnalysisPartyMember', httpClient, helperService);
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

  /**
   * Xuất file danh sách chất lượng đảng viên
   * @param data 
   */
  public exportQualityAnalysisPartyMember(formData): Observable<any> {
    const url = `${this.serviceUrl}/export-quality-analysis-party-member`;
    return this.getRequest(url, {params: formData, responseType: 'blob'});
  }

    /**
   * Xuất file danh sách chất lượng đảng viên
   * @param data 
   */
  public exportListImportQualityAnalysisPartyMember(formData): Observable<any> {
    const url = `${this.serviceUrl}/export-list-import-quality-analysis-party-member`;
    return this.getRequest(url, {params: formData, responseType: 'blob'});
  }

    /**
   * getListQualityAnalysisPartyMember
   * param id
   */
  public getListQualityAnalysisPartyMember(data?: any, event?: any): Observable<any> {
    if (!event) {
      this.credentials = Object.assign({}, data);
    }
    const searchData = CommonUtils.convertData(this.credentials);
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/get-list-quality-party-member`;
    return this.getRequest(url, { params: buildParams });
  }

  /**
   * findOne
   * param id
   */
  public findImportQualityAnalysisPartyMemberById(id: number): Observable<any> {
    const url = `${this.serviceUrl}/import-quality-analysis-party-member/${id}`;
    return this.getRequest(url);
  }
}
