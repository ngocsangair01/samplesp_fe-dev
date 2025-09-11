import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecurityPermissionService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'securityPermisstion', httpClient, helperService);
  }

  public processExport(): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, {responseType: 'blob'});
  }
}
