import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PartyTermiationService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'partyTermination', httpClient, helperService);
  }

  public export(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public findByPartyOrganizationId(partyOrganizationId: number): Observable<any> {
    const url = `${this.serviceUrl}/find-by-party-organization-id/${partyOrganizationId}`;
    return this.getRequest(url);
  }
}
