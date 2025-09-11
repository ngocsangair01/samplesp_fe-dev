import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class VfsReimbursementService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'vfs-reimbursement', httpClient, helperService);
  }
  public findById(id): Observable<any> {
    const url = `${this.serviceUrl}/${id}`
    return this.getRequest(url, {})
  }
  public transferReimbursementToSap(id): Observable<any> {
    const url = `${this.serviceUrl}/transferReimbursementToSap/${id}`
    return this.getRequest(url, {})
  }
}
