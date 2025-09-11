import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import {Observable} from "rxjs";
import {CommonUtils, CryptoService} from "@app/shared/services";

@Injectable({
    providedIn: 'root'
})
export class EmailSmsHistoryService extends BasicService {

    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'email-sms-history', httpClient, helperService);
    }
    public updateStatusCancel(id: number): Observable<any> {
        const url = `${this.serviceUrl}/update-status/${id}`;
        return this.postRequest(url);
    }

    public updateStatusCancelAllChoose(data): Observable<any> {
        const url = `${this.serviceUrl}/update-status-all-choose`;
        const formdata = CommonUtils.convertFormFile(data);
        return this.postRequest(url, formdata);
    }

    public updateStatusQuickCancel(data): Observable<any> {
        const url = `${this.serviceUrl}/quick-cancel`;
        const formdata = CommonUtils.convertFormFile(data);
        return this.postRequest(url, formdata);
    }

    public approved(data): Observable<any> {
        const url = `${this.serviceUrl}/approved`;
        const formdata = CommonUtils.convertFormFile(data);
        return this.postRequest(url, formdata);
    }

    public sendSmsEmail(data): Observable<any> {
        const url = `${this.serviceUrl}/send-email-sms/${data}`;
        return this.getRequest(url);
    }

    public sendEmailSmsAll(data?: any, event?: any): Observable<any> {
        if (!event) {
            this.credentials = Object.assign({}, data);
        }

        const searchData = CommonUtils.convertData(this.credentials);
        if (event) {
            searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
        }
        const buildParams = CommonUtils.buildParams(searchData);
        const url = `${this.serviceUrl}/send-email-sms-all?`;
        return this.getRequest(url, {params: buildParams});
    }
}
