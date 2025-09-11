import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})

export class AssessmentEmployeeLevelService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('assessment', 'assessmentEmployeeLevel', httpClient, helperService );
  }
  public prepareData(data): Observable<any> {
    const url = `${this.serviceUrl}/prepare-sign`;
    return this.postRequest(url, CommonUtils.convertData(data));
  }
  public save(data): Observable<any> {
    const url = `${this.serviceUrl}/save`;
    return this.postRequest(url, CommonUtils.convertData(data));
  }
  public sign(data): Observable<any> {
    const url = `${this.serviceUrl}/sign`;
    return this.postRequest(url, CommonUtils.convertData(data));
  }
  public getFile(listIds): Observable<any> {
    const url = `${this.serviceUrl}/get-file`;
    return this.getRequest(url, {
      params: { ids: listIds}
    });

  }

  public downloadTemplateImport(formImport: any): Observable<any> {
    const url = `${this.serviceUrl}/download-template-import`;
    return this.getRequest(url, {
      params: {
        assessmentPeriodId: formImport.assessmentPeriodId,
        partyOrganizationId: formImport.partyOrganizationId,
        assessmentOrder: formImport.assessmentOrder
      }, responseType: 'blob'
    });
  }

  public processImport(data: any): Observable<any> {
    const url = `${this.serviceUrl}/import`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }
  public viewListFileAssessmentLevel(formData): Observable<any> {
    const url = `${this.serviceUrl}/view-list-file-assessment-level`;
    return this.getRequest(url, {params: formData});
  }

  public exportFile(formData): Observable<any> {
    const url = `${this.serviceUrl}/view-detail-file-assessment-level`;
    return this.getRequest(url, { params: formData, responseType: 'blob' });
  }

  public getFileByAssessmentLevel(data: any): Observable<any> {
    const url = `${this.serviceUrl}/get-file-by-assessment-level`;
    return this.getRequest(url, {
      params: {
        assessmentPeriodId: data.assessmentPeriodId,
        employeeId: data.employeeId
      }
    });
  }

  public cancelSign(signType, item): Observable<any> {
    const formdata = {
      signDocumentId: item.signDocumentId,
      employeeId: item.employeeId,
      assessmentPeriodId: item.assessmentPeriodId,
      assessmentOrder: item.assessmentOrder2
    }
    const url = `${this.serviceUrl}/cancel-sign/${signType}`;
    return this.postRequest(url, formdata);
  }

  public getStaffMapping(formData: any) {
    const url = `${this.serviceUrl}/search`;
    return this.getRequest(url, {params: formData});
  }

  public processExportEmployeeAssessment(data: any): Observable<any> {
    const url = `${this.serviceUrl}/employee-assessment-monitor-export`;
    return this.getRequest(url, {params: data, responseType: 'blob' });
  }

  public processExportEmployeeAssessmentSynthesis(data: any): Observable<any> {
    const url = `${this.serviceUrl}/assessment-monitor-export-synthesis`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public searchIncomplete(data?: any, event?: any): Observable<any> {
    if (!event) {
      this.credentials = Object.assign({}, data);
    }
    const searchData = CommonUtils.convertData(this.credentials);
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/search-incomplete`;
    return this.getRequest(url, {params: buildParams});
  }

  sendSMS(param: any): Observable<any>{
    const url = `${this.serviceUrl}/send-sms`;
    return this.postRequest(url, param);
  }

  exportSignSynthetic(formData: any): Observable<any> {
    const url = `${this.serviceUrl}/export-sign-synthetic`;
    return this.getRequest(url, { params: formData, observe: 'response', responseType: 'blob' });
  }

  public processExportSumUp(formData): Observable<any> {
    const url = `${this.serviceUrl}/export-sum-up`;
    return this.getRequest(url, {params: formData, responseType: 'blob'});
  }
  public processSignAll(data): Observable<any> {
    const url = `${this.serviceUrl}/process-sign-all`;
    return this.postRequest(url, CommonUtils.convertData(data));
  }
  /**
   * download all file trình ký Đánh giá cán bộ: trình ký tổng hợp 
   * @param formData 
   * @returns 
   */
  exportAllFile(formData: any): Observable<any> {
    const url = `${this.serviceUrl}/export-all-file`;
    return this.getRequest(url, { params: formData, responseType: 'blob' });
  }
}
