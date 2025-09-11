import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BasicService } from '@app/core/services/basic.service';
import { CommonUtils, CryptoService } from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportDynamicImportService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'partyReportDetail', httpClient, helperService);
  }
 
  importOfficers(data): Observable<any> {
    const url = `${this.serviceUrl}/import`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }
  public downloadTemplateImport(): Observable<any> {
    const url = `${this.serviceUrl}/export-template`;
    return this.getRequest(url, {responseType: 'blob'});
  }
}
