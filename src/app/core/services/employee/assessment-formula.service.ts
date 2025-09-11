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

  public findDataByFormulaId(assessmentFormulaId: number) {
    const url = `${this.serviceUrl}/get-data-criteria-group/${assessmentFormulaId}`;
    return this.getRequest(url);
  }
}
