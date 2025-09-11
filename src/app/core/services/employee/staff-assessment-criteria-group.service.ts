import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class StaffAssessmentCriteriaGroupService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('assessment', 'staffAssessmentCriteriaGroup', httpClient, helperService);
  }

  public export(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }
}
