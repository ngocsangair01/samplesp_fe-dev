import { BasicService } from '@app/core/services/basic.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class MassGroupService extends BasicService {

  constructor(
    public httpClient: HttpClient,
    public helperService: HelperService
  ) {
    super('political', 'massGroup', httpClient, helperService);
  }

  /**
   * findOne
   * param id
   */
  public findAllInfo(id: number): Observable<any> {
    const url = `${this.serviceUrl}/info/${id}`;
    return this.getRequest(url);
  }

  public export(formData): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, {params: formData, responseType: 'blob'});
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
