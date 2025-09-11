import { environment } from './../../../../environments/environment';
import { CONFIG } from './../../app-config';
import { Constants } from '@env/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';

@Injectable({
    providedIn: 'root'
})
export class NationService extends BasicService {

  private API_URL: string = environment.serverUrl.sys;

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
      super('political', 'nation', httpClient, helperService);
  }

  /**
   * Lay danh sach nation Order theo isDefault & name
   * getNationList
   */
  public getNationList(): Observable<any> {
    const url = `${this.serviceUrl}/nationList`;
    return this.getRequest(url);
  }
}
