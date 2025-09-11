import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from './../basic.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class PartyOrganizationService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'managerPartyOrg', httpClient, helperService);
  }

  public isLeafPartyOrg(id: number): Observable<any> {
    const partyOrganizationId = CommonUtils.nvl(id);
    const url = `${this.serviceUrl}/${partyOrganizationId}/is-leaf-party-organization`;
    return this.getRequest(url);
  }

  public findByOrgId(defaultDomain): Observable<any> {
    const url = `${this.serviceUrl}/find-by-orgId/${defaultDomain}`;
    return this.getRequest(url);
  }

  public findAllByDomain(defaultDomain): Observable<any> {
    const url = `${this.serviceUrl}/find-all-by-domain/${defaultDomain}`;
    return this.getRequest(url);
  }

  public findChildByPartyOrgId(parentId, defaultDomain): Observable<any> {
    const url = `${this.serviceUrl}/find-child-by-orgId/${parentId}/${defaultDomain}`;
    return this.getRequest(url);
  }

  public findChildByThoroughLevel(parentId, defaultDomain): Observable<any> {
    const url = `${this.serviceUrl}/find-child-by-party-org-id/${parentId}/${defaultDomain}`;
    return this.getRequest(url);
  }
}
