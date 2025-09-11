import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from './../basic.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReligionReportService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'religionReport', httpClient, helperService);
  }

  /** bao cao chi tiet CBCNV theo ton giao  */
  public processReligionReportDetail(params: any): Observable<any> {
    const url = `${this.serviceUrl}/religion-report-detail`;
    return this.getRequest(url, {params: params, responseType: 'blob'});
  }

  public processReligionReportGeneral(params: any): Observable<any> {
    const url = `${this.serviceUrl}/religion-report-general`;
    return this.getRequest(url, {params: params, responseType: 'blob'});
  }

  
}
