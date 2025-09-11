import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
    providedIn: 'root'
})
export class ReportConfigService extends BasicService {


    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'report-config', httpClient, helperService);
    }

    public findTemplateActive(item: String) : Observable<any>{
        const url = `${this.serviceUrl}/find-template-active/${item}`;
        return this.getRequest(url)
    }

    public clone(adReportTemplateId: number) {
        const url = `${this.serviceUrl}/clone/${adReportTemplateId}`;
        return this.getRequest(url);
    }
}
