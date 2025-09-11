import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class PartyPunishmentService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'partyPunishment', httpClient, helperService);
  }

  public export(params): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, {params: params, responseType: 'blob' })
  }

  public downloadTemplateImport(): Observable<any> {
    const url = `${this.serviceUrl}/download-template`;
    return this.getRequest(url, {responseType: 'blob'});
  }

  public processImport(data): Observable<any> {
    const url = `${this.serviceUrl}/import`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }
}
