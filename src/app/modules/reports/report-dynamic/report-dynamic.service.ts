import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BasicService } from '@app/core/services/basic.service';
import {CommonUtils, CryptoService} from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportDynamicService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('report', 'reportDynamic', httpClient, helperService);
  }
  public export(data): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.postRequestFile(url, data);
  }
  public exportTables(data, event?: any): Observable<any> {
    if (!event) {
      this.credentials = Object.assign({}, data);
    }

    const searchData = CommonUtils.convertData(this.credentials);
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/export-tables?`;
    return this.getRequest(url, { params: buildParams });
  }
  public getSelectData(reportParameterId): Observable<any> {
    const url = `${this.serviceUrl}/select-query/${reportParameterId}`;
    return this.httpClient.get(url).pipe();
  }

  public findSelectDataByCode(): Observable<any> {
    const url = `${this.serviceUrl}/select-by-code`;
    return this.getRequest(url);
  }

  public findSelectDataRepostSqlByReportDynamicId(reportDynamicId, sortOrder): Observable<any> {
    const url = `${this.serviceUrl}/select-by-id-report-dynamic`;
    let param = {reportDynamicId: reportDynamicId, sortOrder:sortOrder};
    return this.getRequest(url,{params: CommonUtils.buildParams(param)})
  }
  // kien start
  public exportSpecial(data, specialUrl): Observable<any> {
    const url = `${this.serviceUrl}/report-dynamic-special/${specialUrl}`;
    return this.postRequestFile(url, data);
  }
  // kien end

  public getColumnReturn(data) {
    const url = `${this.serviceUrl}/get-column-return`;
    return this.postRequest(url, data);
  }

  public convertDocxToPDF(data): Observable<any> {
    var formData = new FormData();
    formData.append('file', data)
    const url = `${this.serviceUrl}/convert-word-pdf`;
    return this.httpClient.post(url, formData, { responseType: 'blob' });
  }

  public convertExcelToPDF(data): Observable<any> {
    var formData = new FormData();
    formData.append('file', data)
    const url = `${this.serviceUrl}/convert-excel-pdf`;
    return this.httpClient.post(url, formData, { responseType: 'blob' });
  }

  public getListExport() {
    const url = `${this.serviceUrl}/list-export`;
    return this.getRequest(url);
  }

  public getListReportVicinity() {
    const url = `${this.serviceUrl}/getListReportVicinity`;
    return this.getRequest(url);
  }

  public clone(reportDynamicId: number) {
    const url = `${this.serviceUrl}/clone/${reportDynamicId}`;
    return this.getRequest(url);
  }

  changePriority(param): Observable<any>{
    const url = `${this.serviceUrl}/update`;
    return this.postRequest(url, param, true, true);
  }
}