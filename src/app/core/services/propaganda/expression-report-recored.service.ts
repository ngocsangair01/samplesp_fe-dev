import { Observable } from 'rxjs/Observable';
import { HelperService } from '@app/shared/services/helper.service';
import { HttpClient } from '@angular/common/http';
import { BasicService } from '@app/core/services/basic.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExpressionReportRequestService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'expressionReportRecored', httpClient, helperService);
  }

  exportExpressionReportRecoded(expressionReportRecordedId) : Observable<any>{
    const url = `${this.serviceUrl}/export-expression-report/${expressionReportRecordedId}`;
    return this.getRequest(url, {responseType: 'blob'});
  }
  exportPdf(expressionReportRecordedId) : Observable<any>{
    const url = `${this.serviceUrl}/export-pdf/${expressionReportRecordedId}`;
    return this.getRequest(url, {responseType: 'blob'});
  }
}
