import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BasicService } from '@app/core/services/basic.service';
import { catchError, tap } from 'rxjs/operators';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExportDynamicService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('report', 'export-dynamic', httpClient, helperService);
  }


  public export(data): Observable<any> {
    const url = `${this.serviceUrl}`;
    return this.postRequest(url, data)
   
  }
  public preview(data): Observable<any> {
    const url = `${this.serviceUrl}/preview`;
    return this.postRequest(url, data)

  }
}
