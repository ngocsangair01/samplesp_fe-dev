import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})

export class AssessmentSumaryService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('assessment', 'assessmentSumary', httpClient, helperService );
  }

  /**
   * Hàm xuất dữ liệu
   * @param data 
   * @returns 
   */
  public export(data): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, { params: data, responseType: 'blob' });
  }

  public downloadTemplateImport(data): Observable<any> {
    const url = `${this.serviceUrl}/export-template`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public processImport(data): Observable<any> {
    const url = `${this.serviceUrl}/import`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }

}
