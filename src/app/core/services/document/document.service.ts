import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HelperService } from '@app/shared/services/helper.service';
import { CommonUtils } from '@app/shared/services';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'document', httpClient, helperService);
  }
  public export(data): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.postRequestFile(url, data);
  }
  public findByNumber(item: any) {
    return this.getRequest(`${this.serviceUrl}/` +'find-by-number/'+ CommonUtils.convertData(item));
  }
  public findDocumentLevelById(item: any) {
    return this.getRequest(`${this.serviceUrl}` +'/get-document-level/' + CommonUtils.convertData(item));
  }
  public getListCongress(): Observable<any> {
    const url = `${this.serviceUrl}/get-list-file-congress`;
    return this.getRequest(url);
  }
  
  public findOneDocument(data: any): Observable<any> {
    const buildParams = CommonUtils.buildParams(data);
    const url = `${this.serviceUrl}/find-one?`;
    return this.getRequest(url,{params: buildParams});
  }
}
