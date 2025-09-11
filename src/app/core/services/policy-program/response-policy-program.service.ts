import { Observable } from 'rxjs/Observable';
import { HelperService } from '@app/shared/services/helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class ResponsePolicyProgramService extends BasicService{

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'responsePolicyProgram', httpClient, helperService);
  }
  public export(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }
}
