import { HelperService } from '@app/shared/services/helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import {CommonUtils, CryptoService} from '@app/shared/services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportResponsePolicyProgramService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'importResponsePolicyProgram', httpClient, helperService);
  }

  // public processSearchByImportResponsePolicyProgramBean(id) {
  //   const responsePolicyProgramId = CommonUtils.nvl(id);
  //   const url = `${this.serviceUrl}/search-by-response-policy-program/${responsePolicyProgramId}`;
  //   return this.getRequest(url);
  // }

  public processSearchByImportResponsePolicyProgramBean(data?: any, event?: any): Observable<any> {
    if (!event) {
      this.credentials = Object.assign({}, data);
    }
    const searchData = CommonUtils.convertData(this.credentials);
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/search-by-response-policy-program?`;
    return this.getRequest(url, {params: buildParams});
  }

  public findBeanById(requestPolicyProgramId: number): Observable<any>{
    const url = `${this.serviceUrl}/find-bean-by-id/${requestPolicyProgramId}`;
    return this.getRequest(url, CommonUtils.convertData(requestPolicyProgramId));
  }

  public downloadTemplateImport(responsePolicyProgramId: number): Observable<any> {
    const url = `${this.serviceUrl}/template-import/${responsePolicyProgramId}`;
    return this.getRequest(url, {responseType: 'blob'});
  }

  public processImport(data): Observable<any> {
    const url = `${this.serviceUrl}/import`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }
}
