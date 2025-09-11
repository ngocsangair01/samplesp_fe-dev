
import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import {Observable} from "rxjs";
import {CommonUtils} from "@app/shared/services";

@Injectable({
    providedIn: 'root'
})
export class AllowancePeriodService extends BasicService {


    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'allowance-period', httpClient, helperService);
    }

    public updateStatus(data: any): Observable<any> {
        const dataToSave = CommonUtils.convertFormFile(data);
        const url = `${this.serviceUrl}/update-status`;
        return this.postRequest(url, dataToSave);
    }

    public getAllowancePeriod(): Observable<any>{
        const url = `${this.serviceUrl}/get-all-allowance-period`;
        return this.getRequest(url);
    }

    public getAllAllowancePeriodSearch(): Observable<any>{
        const url = `${this.serviceUrl}/get-all-allowance-period-search`;
        return this.getRequest(url);
    }

    public getAll(): Observable<any>{
        const url = `${this.serviceUrl}/get-all`;
        return this.getRequest(url);
    }

    public checkPermissionAllowance(): Observable<any>{
        const url = `${this.serviceUrl}/check-permission-allowance`;
        return this.getRequest(url);
    }

}
