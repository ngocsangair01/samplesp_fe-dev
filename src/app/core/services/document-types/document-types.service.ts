import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypesService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'document-types', httpClient, helperService);
  }

  public export(data): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.postRequestFile(url, data);
  }
  public getByBranchId(branch:any): Observable<any> {
    const url = `${this.serviceUrl}/getAll/${branch}`;
    return this.getRequest(url);
  }

  public getAll(): Observable<any> {
    const url = `${this.serviceUrl}/getAll`;
    return this.getRequest(url);
  }

  public getHasPermissionBranchList(): Observable<any> {
    const url = `${this.serviceUrl}/get-has-permission-branch-list`;
    return this.getRequest(url);
  }
}
