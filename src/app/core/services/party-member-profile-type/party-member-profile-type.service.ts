import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class PartyMemberProfileTypeService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'partyMemberProfileType', httpClient, helperService);
  }

  public getProfileTypeHardCopy(employeeId) {
    const url = `${this.serviceUrl}/get-profile-type-hard-copy/${employeeId}`;
    return this.getRequest(url);
  }
}
