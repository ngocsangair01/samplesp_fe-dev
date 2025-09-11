import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs/Observable';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class StaffAssessmentCriteriaService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('assessment', 'staffAssessmentCriteria', httpClient, helperService);
  }
  public export(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }
  public getListCriteriaByCriteriaGroupId(assessmentCriteriaGroupId: number) {
    const url = `${this.serviceUrl}/get-list-assessment-criteria/${assessmentCriteriaGroupId}`;
    return this.getRequest(url);
  }
}
