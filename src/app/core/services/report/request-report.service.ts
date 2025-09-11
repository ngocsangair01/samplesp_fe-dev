import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class RequestReportService extends BasicService {


  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'request-report', httpClient, helperService);
  }

  search(data, event?) : Observable<any>{
    let param = {...data};
    const url = `${this.serviceUrl}/search?`;
    param.businessType = param.businessType ? param.businessType.parValue : '';
    param.typeOfReport = param.typeOfReport ? param.typeOfReport.parValue : '';
    if (event){
      param._search = CryptoService.encrAesEcb(JSON.stringify(event));
    }
    return this.getRequest(url,{params: CommonUtils.buildParams(param)})
  }

  addActivityProgram(activity) : Observable<any>{
    const url = `${this.serviceUrl}/activity-program`;
    return this.postRequest(url, activity)
  }
  getBusinessType() : Observable<any>{
    const url = `${this.serviceUrl}/business-types`;
    return this.getRequest(url)
  }

  processSaveOrUpdate(formData: any): Observable<any> {
    formData = CommonUtils.convertFormFile(formData);
    return this.postRequest(this.serviceUrl, formData);
  }

  processClone(formData: any): Observable<any> {
    formData = CommonUtils.convertFormFile(formData);
    return this.postRequest(`${this.serviceUrl}/clone`, formData);
  }

  isExistsReportSubmission(requestReportId) : Observable<any>{
    const url = `${this.serviceUrl}/is_exists_report_submission/${requestReportId}`;
    return this.getRequest(url)
  }
}
