import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';


@Injectable({
  providedIn: 'root'
})
export class RequestResolutionMonthService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'requestResolutionMonth', httpClient, helperService);
  }

  public prepareSave(id: number): Observable<any> {
    const url = `${this.serviceUrl}/` +'prepare-save/'+ CommonUtils.convertData(id);
    return this.getRequest(url);
  }

  public sendRequest(id: number): Observable<any> {
    const url = `${this.serviceUrl}/send-request/${CommonUtils.convertData(id)}`;
    return this.getRequest(url);
  }

  public export(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public findBeanById(requestResolutionsMonthId: number): Observable<any>{
    const url = `${this.serviceUrl}/find-bean-by-id/${requestResolutionsMonthId}`;
    return this.getRequest(url, CommonUtils.convertData(requestResolutionsMonthId));
  }

  public sendRejectResponse(data: any): Observable<any> {
    const url = `${this.serviceUrl}/reject-response`;
    return this.getRequest(url, {params: data});
  }

  public revokeRequest(requestResolutionsMonthId: number): Observable<any> {
    const url = `${this.serviceUrl}/revoke-request/${requestResolutionsMonthId}`;
    return this.getRequest(url,  CommonUtils.convertData(requestResolutionsMonthId));
  }

  public exportReportProgressManage(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export-report-manage-progress`;
    return this.getRequest(url, {params: data, responseType: 'blob'} );
  }

  /**
   * 
   * @param data Hàm bổ sung đơn vị ban hành
   */
  public addPartyExcute(data: any): Observable<any> {
    const formdata = CommonUtils.convertFormFile(data);
    const url = `${this.serviceUrl}/add-party-excute`;
    return this.postRequest(url, formdata);
  }

/**
 * Hàm tìm kiếm danh sách tổ chức thực thi theo yêu cầu
 * @param requestResolutionsMonthId
 */
public searchDetailList(data: any, event: any): Observable<any>{
  if (!event) {
    this.credentials = Object.assign({}, data);
  }

  const searchData = CommonUtils.convertData(this.credentials);
  if (event) {
    searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
  }
  const buildParams = CommonUtils.buildParams(searchData);
  const url = `${this.serviceUrl}/search-detail-list?`;
  return this.getRequest(url, {params: buildParams});
  }

  /**
   * Hàm export tiến độ yêu cầu chi tiết
   * @param requestResolutionsMonthId 
   */
  public exportDetail(requestResolutionsMonthId: number): Observable<any> {
    const url = `${this.serviceUrl}/export-request-detail/${requestResolutionsMonthId}`;
    return this.getRequest(url, {responseType: 'blob'});
  }

  /**
   * Hàm export tiến độ yêu cầu tổng hợp
   * @param requestResolutionsMonthId 
   */
  public exportSummary(_requestResolutionsMonthId: number): Observable<any> {
    const url = `${this.serviceUrl}/export-request-summary/${_requestResolutionsMonthId}`;
    return this.getRequest(url, {responseType: 'blob'});
  }

  /**
   * Hàm lấy file hướng dẫn mặc định
   * @param idDefault 
   */
  public getDefaultFileAttach(idDefault: number): Observable<any> {
    const url = `${this.serviceUrl}/get-default-attach-file/${idDefault}`;
    return this.getRequest(url, {responseType: 'blob'});
  }

  public testRequestResolutions(month: number): Observable<any> {
    const url = `${this.serviceUrl}/test-request-resolutions/${month}`;
    return this.getRequest(url, CommonUtils.convertData(month));
  }

  public processSendWarningResponseResolution(data: any): Observable<any> {
    const formdata = CommonUtils.convertFormFile(data);
    const url = `${this.serviceUrl}/process-send-warning`;
    return this.postRequest(url, formdata);
  }

  public processSendNoticeResolutionsMonth(data: any): Observable<any> {
    const url = `${this.serviceUrl}/test-notice-resolutions`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }
}
