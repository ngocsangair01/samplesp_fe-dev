import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class VfsPitAppendixService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'vfs-pit-appendix', httpClient, helperService);
  }

  public searchByReimbursementId(id): Observable<any> {
    const url = `${this.serviceUrl}/search-by-reimbursement-id/${id}`
    return this.getRequest(url, {})
  }
}
