import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
    providedIn: 'root'
})
export class WorkedAbroadService extends BasicService {
    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'workedAbroad', httpClient, helperService);
    }

    public export(data: any): Observable<any> {
        const url = `${this.serviceUrl}/export`;
        return this.getRequest(url, {params: data, responseType: 'blob'});
    }
    /**
     * Import process political manage
     * @param data
     */
    public processImport(data): Observable<any> {
        const url = `${this.serviceUrl}/import`;
        const formdata = CommonUtils.convertFormFile(data);
        return this.postRequest(url, formdata);
    }
    public downloadTemplateImport(data): Observable<any> {
        const url = `${this.serviceUrl}/export-template`;
        return this.getRequest(url, {params: data, responseType: 'blob'});
    }

    public getListWorkedAbroad(employeeId: number) {
        const empId = CommonUtils.nvl(employeeId);
        const url = `${this.serviceUrl}/${empId}/worked-abroad`;
        return this.getRequest(url);
    }

}
