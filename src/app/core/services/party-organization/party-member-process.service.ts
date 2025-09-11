import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HelperService } from '@app/shared/services/helper.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PartyMemberProcessService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'partyMemberProcess', httpClient, helperService);
  }
}
