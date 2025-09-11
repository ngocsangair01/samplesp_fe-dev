import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BasicService } from '@app/core/services/basic.service';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class IdeologicalExpressionReportService extends BasicService {

    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'ideologicalExpressionReport', httpClient, helperService);
    }

    public report(params: any): Observable<any> {
        const url = `${this.serviceUrl}/report`;
        return this.postRequest(url, params);
      }

}
