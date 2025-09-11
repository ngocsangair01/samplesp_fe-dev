import { CommonUtils } from '@app/shared/services/common-utils.service';
import { Observable } from 'rxjs';
import { HelperService } from '@app/shared/services/helper.service';
import { HttpClient } from '@angular/common/http';
import { BasicService } from '../basic.service';
import { Injectable } from '@angular/core';
import {CryptoService} from "@app/shared/services";

@Injectable({
  providedIn: 'root'
})
export class AssessmentEmployeeService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('assessment', 'assessmentEmployee', httpClient, helperService);
  }

  public getAssessmentEmployees(formSearch): Observable<any> {
    const url = `${this.serviceUrl}/get-assessment-employees`;
    return this.getRequest(url, CommonUtils.convertData(formSearch));
  }
  public getAssessmentStatusStatistics(assessmentPeriodId: number, organziationId: number) {
    if(organziationId){
      const url = `${this.serviceUrl}/get-assessment-status-statistics/${assessmentPeriodId}/${organziationId}`;
      return this.getRequest(url);
    }
    const url = `${this.serviceUrl}/get-assessment-status-statistics/${assessmentPeriodId}`;
    return this.getRequest(url);
  }
  public getResultOfAssessment(assessmentPeriodId: number, organziationId: number) {
    if(organziationId){
      const url = `${this.serviceUrl}/get-result-of-assessment/${assessmentPeriodId}/${organziationId}`;
      return this.getRequest(url);
    }
    const url = `${this.serviceUrl}/get-result-of-assessment/${assessmentPeriodId}`;
    return this.getRequest(url);
  }
  // public getUnitListAssessmentStatistics(assessmentPeriodId: number) {
  //   const url = `${this.serviceUrl}/get-unit-list-assessment-statistics/${assessmentPeriodId}`;
  //   return this.getRequest(url);
  // }
  public getUnitListAssessmentStatistics(assessmentPeriodId?: any, event?: any): Observable<any> {
    if (!event) {
      this.credentials = Object.assign({}, assessmentPeriodId);
    }

    const searchData = CommonUtils.convertData(this.credentials);
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/get-unit-list-assessment-statistics/${assessmentPeriodId}`;
    return this.getRequest(url, {params: buildParams});
  }
  public exportAssessmentStatistic(data: any): Observable<any> {
    const url = `${this.serviceUrl}/exportAssessmentStatistic`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public getAssessmentRankings(data: any, event?: any): Observable<any> {
    const searchData = CommonUtils.convertData(Object.assign({}, data))
    if (event) {
      searchData._search = event
    }
    const buildParams = CommonUtils.buildParams(searchData)
    const url = `${this.serviceUrl}/get-list-assessment-employee-ranking`
    return this.getRequest(url, {params: buildParams})
  }
}
