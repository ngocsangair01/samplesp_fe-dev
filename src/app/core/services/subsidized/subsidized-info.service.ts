import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {CommonUtils, CryptoService} from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class SubsidizedInfoService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'subsidizedInfo', httpClient, helperService);
  }

  /**
   * Them moi
   * getRewardGeneralList
   */
  public updateStatus(data: any): Observable<any> {
    const dataToSave = CommonUtils.convertData(data);
    const url = `${this.serviceUrl}/update-status`;
    return this.postRequest(url, dataToSave);
  }

  /**
  * Them moi
  * getRewardGeneralList
  */
  public updateStatusMultiple(data: any): Observable<any> {
    const dataToSave = CommonUtils.convertFormFile(data);
    const url = `${this.serviceUrl}/update-status-multiple`;
    return this.postRequest(url, dataToSave);
  }

  // load danh sach nguoi than theo employeeId
  public getListRelationship(employeeId: number): Observable<any> {
    const url = `${this.serviceUrl}/relationship/${employeeId}`;
    return this.getRequest(url);
  }

  public exportSubsidized(data): Observable<any> {
    const url = `${this.serviceUrl}/export-subsidized`
    return this.getRequest(url, { params: data, responseType: 'blob' })
  }

  public exportSubsidizedApprove(data): Observable<any> {
    const url = `${this.serviceUrl}/export-subsidized-approve`
    return this.getRequest(url, { params: data, responseType: 'blob' })
  }

  /**
  * download template
  * param rewardObjectType
  */
  public downloadTemplateImport(data): Observable<any> {
    const url = `${this.serviceUrl}/export-template`;
    return this.getRequest(url, { params: data, responseType: 'blob' });
  }

  public processImport(data): Observable<any> {
    const url = `${this.serviceUrl}/import`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }

  public processImportApprove(data): Observable<any> {
    const url = `${this.serviceUrl}/import-approve`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }

  // load danh sach nguoi than theo dot ho tro
  public getListRelationshipByPeriodId(subsidizedPeriodId: number): Observable<any> {
    const url = `${this.serviceUrl}/relationship/subsidizedPeriod/${subsidizedPeriodId}`;
    return this.getRequest(url);
  }

  /**
  * download template
  * param rewardObjectType
  */
  public downloadTemplateApproveImport(data): Observable<any> {
    const url = `${this.serviceUrl}/export-template-approve`;
    return this.getRequest(url, { params: data, responseType: 'blob' });
  }

  public getEmployeeInfo(id: number): Observable<any> {
    const employeeId = CommonUtils.nvl(id);
    const url = `${this.serviceUrl}/employee-info/${employeeId}`;
    return this.getRequest(url);
  }

  public search(data?: any, event?: any): Observable<any> {
    if (!event) {
      this.credentials = Object.assign({}, data);
    }

    const searchData = CommonUtils.convertData(this.credentials);
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/search?`;
    return this.getRequest(url, { params: buildParams });
  }

  /**
 * findOne
 * param id
 */
  public findDetailByIdAndKeyword(data: any, keyword?: string): Observable<any> {
    const searchKeyWord = (keyword && typeof keyword !== 'undefined') ? keyword : '';
    const url = `${this.serviceUrl}/findDetailByIdAndKeyword/${data}&searchKeyword=${searchKeyWord}`;
    return this.getRequest(url);
  }
}
