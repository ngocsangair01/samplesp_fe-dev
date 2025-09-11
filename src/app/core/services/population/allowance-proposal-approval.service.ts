import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import {Observable} from "rxjs";
import {CommonUtils} from "@app/shared/services";

@Injectable({
    providedIn: 'root'
})
export class AllowanceProposalApprovalService extends BasicService {


    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'allowance-proposal-approval', httpClient, helperService);
    }

    public saveOrUpdateReject(data: any): Observable<any> {
        const dataToSave = CommonUtils.convertFormFile(data);
        const url = `${this.serviceUrl}/update-status`;
        return this.postRequest(url, dataToSave);
    }

    public export(data: any): Observable<any> {
        const url = `${this.serviceUrl}/export/${data}`;
        return this.getRequest(url, {responseType: 'blob'});
    }

    public updateStatus(id: number): Observable<any> {
        const url = `${this.serviceUrl}/update-status-reject/${id}`;
        return this.postRequest(url);
    }
}
