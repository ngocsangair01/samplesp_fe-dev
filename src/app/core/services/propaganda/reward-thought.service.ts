import { Observable } from 'rxjs/Observable';
import { HelperService } from '@app/shared/services/helper.service';
import { HttpClient } from '@angular/common/http';
import { BasicService } from '@app/core/services/basic.service';
import { Injectable } from '@angular/core';
import { CommonUtils } from '@app/shared/services';
@Injectable({
  providedIn: 'root'
})
export class RewardThoughtService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'rewardThought', httpClient, helperService);
  }

  public getTypeOfExpression(): Observable<any> {
    const url = `${this.serviceUrl}/getTypeOfExpression`;
    return this.getRequest(url);
  }
  public downloadTemplateImport(): Observable<any> {
    const url = `${this.serviceUrl}/export-template`;
    return this.getRequest(url, {responseType: 'blob'});
  }
  public processImport(data): Observable<any> {
    const url = `${this.serviceUrl}/import`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }
  // public findById(usecaseTypeId?: number): Observable<any> {
  //   const url = `${this.serviceUrl}/${usecaseTypeId}`;
  //   return this.getRequest(url);
  // }
}
