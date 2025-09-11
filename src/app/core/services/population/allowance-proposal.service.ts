
import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AllowanceProposalService extends BasicService {


    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'allowance-proposal', httpClient, helperService);
    }

    public getAllowanceProposalTableBean(data: any): Observable<any> {
        const url = `${this.serviceUrl}/get-allowance-proposal-table`;
        return this.getRequest(url, {params: data});
    }

    public sendApproveAllowanceProposal(id: number): Observable<any> {
        const url = `${this.serviceUrl}/update-status/${id}`;
        return this.postRequest(url);
    }

    public export(data: any): Observable<any> {
        const url = `${this.serviceUrl}/export-data/${data}`;
        return this.getRequest(url, {responseType: 'blob'});
    }

}
