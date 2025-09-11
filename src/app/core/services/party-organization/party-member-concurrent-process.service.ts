import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HelperService } from '@app/shared/services/helper.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class PartyMemberConcurrentProcessService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'partyMemberConcurrentProcess', httpClient, helperService);
  }

  public findProcessByEmployeeId(employeeId: number): Observable<any> {
    const url = `${this.serviceUrl}/search?employeeId=${employeeId}`;
    return this.getRequest(url);
  }
}
