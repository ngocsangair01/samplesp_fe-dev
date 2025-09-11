import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
    providedIn: 'root'
})
export class WelfarePolicyRequestService extends BasicService {
    refreshList: Subject<any> = new BehaviorSubject<any>(null);

    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'welfare-policy-request', httpClient, helperService);
    }

    public export(data: any): Observable<any> {
        const url = `${this.serviceUrl}/export`;
        return this.getRequest(url, {params: data, responseType: 'blob'});
    }

    public makeListBirthday(params: any): Observable<any> {
        const url = `${this.serviceUrl}/make-list-birthday`;
        return this.postRequest(url, params);
    }

    public getObjectNameList(relationshipId: any, employeeId: any): Observable<any> {
        const url = `${this.serviceUrl}/family-relationship/${relationshipId}/${employeeId}`;
        return this.getRequest(url);
    }

    public saveListRequest(params: any): Observable<any> {
        const url = `${this.serviceUrl}/save-list-request`;
        return this.postRequest(url, params);
    }
}
