import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BasicService } from './basic.service';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeWarningService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('report', 'homeWarning', httpClient, helperService);
  }
  /**
   * getWarningByType
   * param id
   */
  public getWarningByType(warningType: string): Observable<any> {
    const url = `${this.serviceUrl}/${warningType}`;
    return this.httpClient.get(url);
  }
}
