import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class PoliticsQualityService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
      super('political', 'politicsQuality', httpClient, helperService);
  }

  public downloadTemplate(data: any): Observable<any> {
    const url = `${this.serviceUrl}/download-template`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public processImport(data: any): Observable<any> {
    const url = `${this.serviceUrl}/import`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }

  public processExport(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    // const buildParams = CommonUtils.buildParams(data);
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  /**
   * bao cao tong hop chat luong chinh tri noi bo
   */
  public processExportQualityTotal(data: any): Observable<any> {
    const buildParams = CommonUtils.buildParams(data);
    const url = `${this.serviceUrl}/export-quality-total`;
    return this.getRequest(url, {params: buildParams, responseType: 'blob'});
  }

  /**
  * Báo cáo chi tiết chất lượng chính trị nội bộ
  */
  public processExportQualityDetail(data: any): Observable<any> {
    const buildParams = CommonUtils.buildParams(data);
    const url = `${this.serviceUrl}/export-quality-detail`;
    return this.getRequest(url, {params: buildParams, responseType: 'blob'});
  }

  public exportOrgNotYetClassifyEmp(): Observable<any> {
    const url = `${this.serviceUrl}/export-organization-not-yet-classify`;
    return this.getRequest(url, {responseType: 'blob'});
  }

  public test15(): Observable<any> {
    const url = `${this.serviceUrl}/test-15`;
    return this.getRequest(url);
  }
  public test23(): Observable<any> {
    const url = `${this.serviceUrl}/test-23`;
    return this.getRequest(url);
  }
  public test1(): Observable<any> {
    const url = `${this.serviceUrl}/test-1`;
    return this.getRequest(url);
  }
  public test2(): Observable<any> {
    const url = `${this.serviceUrl}/test-2`;
    return this.getRequest(url);
  }
  public test3(): Observable<any> {
    const url = `${this.serviceUrl}/test-3`;
    return this.getRequest(url);
  }
}
