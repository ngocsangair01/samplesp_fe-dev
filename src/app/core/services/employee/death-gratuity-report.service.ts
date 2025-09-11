import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeathGratuityService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'deathGratuityReport', httpClient, helperService);
  }
  
   public processReportDeathGratuity(params: any): Observable<any> {
    const url = `${this.serviceUrl}/export-report`;
    return this.getRequest(url, {params: params, responseType: 'blob'});
  }
}
