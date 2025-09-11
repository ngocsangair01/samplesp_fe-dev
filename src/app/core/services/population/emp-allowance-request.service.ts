
import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import {Observable} from "rxjs";
import {CommonUtils, CryptoService} from "@app/shared/services";

@Injectable({
    providedIn: 'root'
})
export class EmpAllowanceRequestService extends BasicService {


    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'emp-allowance-request', httpClient, helperService);
    }

    public updateStatus(data: any): Observable<any> {
        const dataToSave = CommonUtils.convertFormFile(data);
        const url = `${this.serviceUrl}/update-status`;
        return this.postRequest(url, dataToSave);
    }

    public getEmpAllowanceRequestTableBean(data: any): Observable<any> {
        const url = `${this.serviceUrl}/get-emp-allowance-request-table`;
        return this.getRequest(url, {params: data});
    }

    public downloadTemplateImport(id: number): Observable<any> {
        const url = `${this.serviceUrl}/export-BM/${id}`;
        return this.getRequest(url, { responseType: 'blob' });
    }

    public processSearchObjectType2(data?: any, event?: any): Observable<any> {
        if (!event) {
            this.credentials = Object.assign({}, data);
        }

        const searchData = CommonUtils.convertData(this.credentials);
        if (event) {
            searchData._search = CryptoService.encrAesEcb(JSON.stringify(event));
        }
        const buildParams = CommonUtils.buildParams(searchData);
        const url = `${this.serviceUrl}/search-object-type-2?`;
        return this.getRequest(url, {params: buildParams});
    }
}
