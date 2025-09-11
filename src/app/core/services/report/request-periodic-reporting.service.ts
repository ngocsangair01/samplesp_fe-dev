import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import {Observable} from "rxjs";
import {CommonUtils} from "@app/shared/services";

@Injectable({
    providedIn: 'root'
})
export class RequestPeriodicReportingService extends BasicService {


    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'request-periodic-reporting', httpClient, helperService);
    }

    search(data, event?) : Observable<any>{
        let param = {...data};
        const url = `${this.serviceUrl}/search?`;
        param.businessType = param.businessType ? param.businessType.parValue : '';
        if (event){
            param._search = event;
        }
        return this.getRequest(url,{params: CommonUtils.buildParams(param)})
    }

    findByRequestReportingIdDynamic(requestReportingId) : Observable<any>{
        const url = `${this.serviceUrl}/find_by_request_reporting_id/${requestReportingId}`;
        return this.getRequest(url)
    }

}
