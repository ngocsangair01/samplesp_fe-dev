import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
    providedIn: 'root'
})
export class PersonnelKeyService extends BasicService {
    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'personnelKey', httpClient, helperService);
    }

    public export(data): Observable<any> {
        const url = `${this.serviceUrl}/export`;
        return this.getRequest(url, {params: data, responseType: 'blob'});
    }

    public downloadTemplate(data: any): Observable<any> {
        const url = `${this.serviceUrl}/download-template`;
        return this.getRequest(url, {params: data, responseType: 'blob'});
    }

    public processImport(data: any): Observable<any> {
        const url = `${this.serviceUrl}/import`;
        const formdata = CommonUtils.convertFormFile(data);
        return this.postRequest(url, formdata);
    }
}
