
import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import {Observable} from "rxjs";
import {CommonUtils} from "@app/shared/services";

@Injectable({
    providedIn: 'root'
})
export class AllowanceProposalSignService extends BasicService {


    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'allowance-proposal-sign', httpClient, helperService);
    }

    public downloadDataInList(allowanceProposalSignId: number) {
        const id = CommonUtils.nvl(allowanceProposalSignId);
        const url = `${this.serviceUrl}/export-data/${id}`;
        return this.getRequest(url, { responseType: 'blob' });
    }

    public processSynStatement(id: number): Observable<any> {
        const url = `${this.serviceUrl}/sys-statement/${id}`;
        return this.postRequest(url);
    }

    public processTransferPayment(id: number): Observable<any> {
        const url = `${this.serviceUrl}/transfer-payment/${id}`;
        return this.postRequest(url);
    }

    public sysnFileAttach(id: number): Observable<any> {
        const url = `${this.serviceUrl}/transfer-file-attach/${id}`;
        return this.postRequest(url);
    }

    public processRejectStatement(id: number): Observable<any> {
        const url = `${this.serviceUrl}/reject-statement/${id}`;
        return this.postRequest(url);
    }

    public processCompleteStatement(id: number): Observable<any> {
        const url = `${this.serviceUrl}/complete-statement/${id}`;
        return this.postRequest(url);
    }
}
