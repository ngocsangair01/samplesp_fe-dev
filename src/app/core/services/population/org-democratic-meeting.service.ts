import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrgDemocraticMeetingService extends BasicService{

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'orgDemocraticMeetingReport', httpClient, helperService);
  }
  public orgDemocraticMeetingReport(data): Observable<any> {
    const url = `${this.serviceUrl}/report`;
    return this.postRequestFile(url, data);
  }

  // public orgDemocraticMeetingReportData(data): Observable<any> {
  //   const url = `${this.serviceUrl}/report-data`;
  //   return this.postRequest(url,data);
    
  // }
}
