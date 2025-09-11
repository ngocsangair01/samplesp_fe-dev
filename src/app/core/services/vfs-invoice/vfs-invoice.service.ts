import { HttpClient, HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class VfsInvoiceService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'vfs-invoice', httpClient, helperService);
  }

  public searchByReimbursementId(id): Observable<any> {
    const url = `${this.serviceUrl}/search-by-reimbursement-id/${id}`
    return this.getRequest(url)
  }

  public export(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export/`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public exportErrorInvoiceAfterPay(rewardProposeSignId: any): Observable<any> {
    const url = `${this.serviceUrl}/exportErrorInvoice/`;
    let params = new HttpParams();
    params = params.append('rewardProposeSignId', rewardProposeSignId);
    return this.getRequest(url,{params: params, responseType: 'blob'});
  }

  public exportErrorInvoiceAfterPayV2(allowanceProposalSignId: any): Observable<any> {
    const url = `${this.serviceUrl}/exportErrorInvoiceV2/`;
    let params = new HttpParams();
    params = params.append('allowanceProposalSignId', allowanceProposalSignId);
    return this.getRequest(url,{params: params, responseType: 'blob'});
  }
}
