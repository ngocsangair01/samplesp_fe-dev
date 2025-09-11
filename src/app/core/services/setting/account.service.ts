import { Observable } from 'rxjs/Observable';
import { CommonUtils } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'account', httpClient, helperService);
  }

  public findById(id: number): Observable<any> {
    const url = `${this.serviceUrl}/findById/${id}`;
    return this.getRequest(url);
  }

}
