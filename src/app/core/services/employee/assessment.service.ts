import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'assessment', httpClient, helperService);
  }

  public processDownloadFile(vtCriticalId : string): Observable<any> {
    const url = `${this.serviceUrl}/download-file/${vtCriticalId}`;
    return this.getRequest(url, {responseType: 'blob'});
  }

  public getEvaluationProcess(employeeId: number) {
    const url = `${this.serviceUrl}/get-envaluation-process/${employeeId}`;
    return this.getRequest(url);
  }

  public getEvaluationPartyMemberResults(employeeId: number) {
    const url = `${this.serviceUrl}/get-evaluation-party-member-results/${employeeId}`;
    return this.getRequest(url);
  }

  public getAssessmentEmployeeResult(employeeId: number, objectType:number) {
    const url = `${this.serviceUrl}/get-assessment-employee-result/${employeeId}/${objectType}`;
    return this.getRequest(url);
  }
}
