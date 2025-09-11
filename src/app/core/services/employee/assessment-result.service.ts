import { Observable } from 'rxjs';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '@app/core/services/basic.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {CommonUtils, CryptoService} from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class AssessmentResultService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('assessment', 'assessmentResult', httpClient, helperService);
  }

  /**
   * saveOrUpdate
   */
  public saveOrUpdateAssessmentResult(item: any, isAutoSaveAssessmentResult?: boolean): Observable<any> {
    const url = `${this.serviceUrl}`;
    return this.postRequest(url, CommonUtils.convertData(item), isAutoSaveAssessmentResult, isAutoSaveAssessmentResult);
  }
  public prepareSignManager(item: any, isAutoSaveAssessmentResult?: boolean): Observable<any> {
    const url = `${this.serviceUrl}`;
    return this.postRequest(url, CommonUtils.convertData(item));
  }
  

  public getAssessmentEmployeeInfo(form): Observable<any> {
    const url = `${this.serviceUrl}/detail`;
    return this.getRequest(url, { params: CommonUtils.convertData(form) });
  }

  public getListAssessmentResult(assessmentPeriodId: number) {
    const url = `${this.serviceUrl}/get-list-assessment-result/${assessmentPeriodId}`;
    return this.getRequestNoEndSpin(url);
  }

  public getAssessmentLevelList(formRequest): Observable<any> {
    const url = `${this.serviceUrl}/get-assessment-level-can-be-again`;
    return this.getRequest(url, { params: formRequest });
  }

  public reEvaluation(form): Observable<any> {
    const url = `${this.serviceUrl}/re-evaluation`;
    return this.postRequest(url, CommonUtils.convertData(form));
  }

  public unlatch(form): Observable<any> {
    const url = `${this.serviceUrl}/unlatch`;
    return this.postRequest(url, CommonUtils.convertData(form));
  }

  public calculateAssessment(form): Observable<any> {
    const url = `${this.serviceUrl}/calculate-assessment`;
    return this.postRequest(url, CommonUtils.convertData(form), true);
  }

  public exportAssessmentResult(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export-assessment-result`;
    return this.getRequest(url, { params: data, responseType: 'blob' });
  }

  public exportOtherFormResult(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export-other-form-result`;
    return this.getRequest(url, { params: data, responseType: 'blob' });
  }

  public exportAssessmentResultFromVoffice(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export-assessment-result-from-voffice`;
    return this.getRequest(url, { params: data, responseType: 'blob' });
  }

  public saveSignature(item: any): Observable<any> {
    const formData = CommonUtils.convertFormFile(item);
    const url = `${this.serviceUrl}/save-signature`;
    return this.postRequest(url, formData);
  }
  public getListSigned(formRequest): Observable<any> {
    const url = `${this.serviceUrl}/get-list-signed`
    return this.getRequest(url, { params: CommonUtils.convertData(formRequest) });
  }

  public sendNotification(form): Observable<any> {
    const url = `${this.serviceUrl}/send-notification`;
    return this.postRequest(url, CommonUtils.convertData(form));
  }

  public getListAssessmentPeriodName(data: any, event?: any): Observable<any> {
    const searchData = CommonUtils.convertData(Object.assign({}, data))
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/get-list-assessment-period-by-employee-id`;
    return this.getRequest(url, { params: buildParams });
  }

  public deleteEmployeeId(employeeId: number, assessmentPeriodId: number): Observable<any> {
    const url = `${this.serviceUrl}/${employeeId}/${assessmentPeriodId}`;
    this.helperService.isProcessing(true);
    return this.deleteRequest(url);
  }

  public getListFileSigned(employeeId: number): Observable<any> {
    const url = `${this.serviceUrl}/get-list-file-signed/${employeeId}`;
    return this.getRequest(url);
  }

  public downloadFile(transCode: string): Observable<any> {
    const url = `${this.serviceUrl}/download-file/${transCode}`;
    return this.getRequest(url, { responseType: 'blob' });
  }

  public getAssessmentLevelListV2(formRequest): Observable<any> {
    const url = `${this.serviceUrl}/get-assessment-level-can-be-again-v2`;
    return this.getRequest(url, { params: formRequest });
  }

  public getPreviousResult(formRequest): Observable<any> {
    const url = `${this.serviceUrl}/searchPreviousResult`;
    return this.getRequest(url, { params: formRequest });
  }

}
