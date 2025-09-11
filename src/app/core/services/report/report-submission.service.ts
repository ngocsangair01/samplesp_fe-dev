import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class ReportSubmissionService extends BasicService {


  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'report-submission', httpClient, helperService);
  }

  search(param, event?) : Observable<any>{
    const url = `${this.serviceUrl}/search?`;
    if (event){
      // param._search = event;
      param._search = CryptoService.encrAesEcb(JSON.stringify(event));

    }
    return this.getRequest(url,{params: CommonUtils.buildParams(param)})
  }

  searchDataImport(param?: any, event?: any): Observable<any> {
    let url = `${this.serviceUrl}/search-ad-report-data-rewarding-student?`;
    if(param.nameTable === "ad_report_data_matrix"){
      url = `${this.serviceUrl}/search-ad-report-data-matrix?`;
    }
    if(param.nameTable === "ad_report_data_one_row"){
      url = `${this.serviceUrl}/search-ethnicity-and-religion?`;
    }
    if(param.nameTable === "ad_report_multi_row"){
      url = `${this.serviceUrl}/search-ad-report-multi-row?`;
    }
    if (!event) {
      this.credentials = Object.assign({}, param);
    }
    const searchData = CommonUtils.convertData(this.credentials);
    if (event) {
      searchData._search = CryptoService.encrAesEcb(JSON.stringify(event))
      // searchData._search = event
    }
    return this.getRequest(url,{params: CommonUtils.buildParams(searchData)})
  }

  getDetailSubmissionId(reportSubmissionId): Observable<any>{
    const url = `${this.serviceUrl}/detail`;
    let param = {reportSubmissionId: reportSubmissionId};
    return this.getRequest(url,{params: CommonUtils.buildParams(param)})
  }

  submit(reportSubmissionId): Observable<any>{
    const url = `${this.serviceUrl}/submit`;
    return this.postRequest(url, reportSubmissionId);
  }

  updateEmpSubmit(param){
    const url = `${this.serviceUrl}/emp-submit`;
    return this.postRequest(url, param);
  }

  getListEmployeeReport(organizationId) {
    const url = `${this.serviceUrl}/get-employee/${organizationId}`;
    return this.getRequest(url)
  }

  saveOrUpdateProcess(formData: any): Observable<any> {
    formData = CommonUtils.convertFormFile(formData);
    return this.postRequest(this.serviceUrl, formData);
  }

  saveFileImportData(formData: any): Observable<any> {
    formData = CommonUtils.convertFormFile(formData);
    const url = `${this.serviceUrl}/save-file-import`;
    return this.postRequest(url, formData);
  }

  public export(data): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, { params: data, responseType: 'blob' });
  }
}
