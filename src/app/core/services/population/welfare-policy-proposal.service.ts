import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';

@Injectable({
    providedIn: 'root'
})
export class WelfarePolicyProposalService extends BasicService {


    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'welfare-policy-proposal', httpClient, helperService);
    }

    public listRequestByRule(data: any): Observable<any> {
        const url = `${this.serviceUrl}/list-request-in-object`;
        return this.getRequest(url,{params: data});
    }

    public listRequestByRuleNotIn(data: any): Observable<any> {
        const url = `${this.serviceUrl}/list-request-not-in-object`;
        return this.getRequest(url,{params: data});
    }

    public listRequestInTableObject(data: any): Observable<any> {
        const url = `${this.serviceUrl}/list-request-in-table-object`;
        return this.getRequest(url,{params: data});
    }

    public downloadTemplateImport(data): Observable<any> {
        const url = `${this.serviceUrl}/export-template`;
        return this.getRequest(url, {params: data, responseType: 'blob'});
    }

    public downloadDataInList(welfarePolicyProposalId: number) {
        const id = CommonUtils.nvl(welfarePolicyProposalId);
        const url = `${this.serviceUrl}/export-data/${id}`;
        return this.getRequest(url, { responseType: 'blob' });
    }

    public processImport(data): Observable<any> {
        const url = `${this.serviceUrl}/import`;
        const formdata = CommonUtils.convertFormFile(data);
        return this.postRequest(url, formdata);
    }

    public cancelProposal(item: any): Observable<any> {
        const url = `${this.serviceUrl}/cancel-proposal/${item}`;
        return this.postRequest(url);
    }

    public transferPayment(item: any): Observable<any> {
        const url = `${this.serviceUrl}/transfer-payment/${item}`;
        return this.postRequest(url);
    }
    public createPayment(item: any): Observable<any> {
        const url = `${this.serviceUrl}/sys-statement/${item}`;
        return this.postRequest(url);
    }
    public cancelPayment(id: number): Observable<any> {
        const url = `${this.serviceUrl}/cancel-payment/${id}`;
        return this.postRequest(url, {});
    }
    public transferFileAttach(item: any): Observable<any> {
        const url = `${this.serviceUrl}/transfer-file-attach/${item}`;
        return this.postRequest(url);
    }

    public getOrganizationByMassOrganization(data: any): Observable<any> {
        const url = `${this.serviceUrl}/list-org-by-masOrg`;
        return this.getRequest(url,{params: data});
    }
}
