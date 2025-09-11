import { CommonUtils } from '@app/shared/services/common-utils.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class PartyMemberDecisionService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'partyMemberDecision', httpClient, helperService);
  }

  public exportDecision(signDocumentId: number): Observable<any> {
    const url = `${this.serviceUrl}/export-decision/${signDocumentId}`;
    return this.getRequest(url, {responseType: 'blob'});
  }

  public exportSignTemplate(signDocumentId: number, fileTypeId: number): Observable<any> {
    const url = `${this.serviceUrl}/export-sign-template/${signDocumentId}/${fileTypeId}`;
    return this.getRequest(url, {responseType: 'blob'});
  }

  public findBySignDocumentId(id: number): Observable<any> {
    const url = `${this.serviceUrl}/find-by-sign-document/${id}`;
    return this.getRequest(url);
  }
}
