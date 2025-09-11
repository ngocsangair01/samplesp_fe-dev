import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AssessmentFormulaService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('assessment', 'assessmentFormula', httpClient, helperService);
  }

  public export(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  // get criteria group mapping
  public getCriteriaMappingInfoByAssessmentFormulaId(assessmentFormulaId: number): Observable<any> {
    const url = `${this.serviceUrl}/get-info-criteria-group-mapping/${assessmentFormulaId}`;
    return this.getRequest(url);
  }
}
