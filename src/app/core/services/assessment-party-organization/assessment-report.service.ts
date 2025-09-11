import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})

export class AssessmentReportService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('assessment', 'assessmentReport', httpClient, helperService );
  }

  public makeSignFileAttachmentFile(form): Observable<any> {
    const url = `${this.serviceUrl}/make-sign-file-attachment-file`;
    return this.postRequest(url, CommonUtils.convertData(form));
  }

  public makeSignerFileAttachmentFile(form): Observable<any> {
    const url = `${this.serviceUrl}/make-signer-file-attachment-file`;
    return this.postRequest(url, CommonUtils.convertData(form));
  }

  public exportAssessmentResult(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export-assessment-result`;
    return this.getRequest(url, { params: data, responseType: 'blob' });
  }
  public exportAssessmentResultV1(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export-assessment-result-v1`;
    return this.getRequest(url, { params: data, responseType: 'blob' });
  }
}
