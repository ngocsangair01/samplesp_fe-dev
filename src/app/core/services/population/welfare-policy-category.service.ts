
import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';

@Injectable({
    providedIn: 'root'
})
export class WelfarePolicyCategoryService extends BasicService {


    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'welfare-policy-category', httpClient, helperService);
    }

    public findAllByType(type: number): Observable<any> {
        const url = `${this.serviceUrl}/find-all/${type}`;
        return this.getRequest(url);
    }

    public findBirthdayActive(): Observable<any> {
        const url = `${this.serviceUrl}/find-birthday-active`;
        return this.getRequest(url);
    }

    public getPolicyDesease(welfarePolicyCategoryId: number): Observable<any> {
        const url = `${this.serviceUrl}/get-policy-desease/${welfarePolicyCategoryId}`;
        return this.getRequest(url);
    }

    public findOptionBean(id: number): Observable<any> {
        const url = `${this.serviceUrl}/option/${id}`;
        return this.getRequest(url);
    }

    public findWelfarePolicyNormById(id: number, level: number): Observable<any> {
        const url = `${this.serviceUrl}/find-by-id-norm/${id}/${level}`;
        return this.getRequest(url);
    }

    public searchDisease(data:any, event?: any): Observable<any> {
        if (!event) {
            this.credentials = Object.assign({}, data);
        }

        const searchData = CommonUtils.convertData(this.credentials);

        if (event) {
            // console.log(JSON.stringify(event), CryptoService.encrAesEcb(event))
            searchData._search = CryptoService.encrAesEcb(JSON.stringify(event));
        }
        const buildParams = CommonUtils.buildParams(searchData);
        const url = `${this.serviceUrl}/search-policy-disease`;
        return this.getRequest(url,{params: buildParams});
    }
}
