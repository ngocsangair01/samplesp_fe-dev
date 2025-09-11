import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class DemocraticMeetingService extends BasicService{

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'democraticMeeting', httpClient, helperService);
  }

  public findBeanById(democraticMeetingId: number): Observable<any>{
    const url = `${this.serviceUrl}/find-bean-by-id/${democraticMeetingId}`;
    return this.getRequest(url, CommonUtils.convertData(democraticMeetingId));
  }

  public export(data): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.postRequestFile(url, data);
  }

  
  public exportDocument(democraticMeetingId: number): Observable<any> {
    const url = `${this.serviceUrl}/export-document/${democraticMeetingId}`;
    return this.getRequest(url, {params: democraticMeetingId, responseType: 'blob'});
  }

  public downloadTemplateImport(): Observable<any> {
    const url = `${this.serviceUrl}/export-template`;
    return this.getRequest(url, {responseType: 'blob'});
  }
}
