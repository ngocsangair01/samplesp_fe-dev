import { environment } from '../../../../environments/environment';
import { CONFIG } from '../../app-config';
import { Constants } from '@env/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';

@Injectable({
    providedIn: 'root'
})
export class DisciplineViolationReportService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
      super('political', 'disciplineViolationReport', httpClient, helperService);
  }

  public findRootOrgPunishment(params): Observable<any> {
    const url = `${this.serviceUrl}/find-root-organization-punishment`;
    return this.getRequest(url, { params: params })
  }

  public export(params): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, {params: params, responseType: 'blob' })
  }
}
