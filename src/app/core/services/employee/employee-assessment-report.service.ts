import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class EmployeeAssessmentReportService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'employeeAssessmentReport', httpClient, helperService);
  }

  public getAssessmentPeriodList() {
    const url = `${this.serviceUrl}/get-assessment-period-list`;
    return this.getRequest(url);
  }

  public exportDetailReport(data: any) {
    const url = `${this.serviceUrl}/export-detail-report`;
    const buildParam = CommonUtils.convertData(data);
    return this.getRequest(url, {params: buildParam, responseType: 'blob'});
  }

  public exportTotalReport(data: any) {
    const url = `${this.serviceUrl}/export-total-report`;
    const buildParam = CommonUtils.convertData(data);
    return this.getRequest(url, {params: buildParam, responseType: 'blob'});
  }
}
