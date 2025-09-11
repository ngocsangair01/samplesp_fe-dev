import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {HelperService} from '@app/shared/services/helper.service';
import {BasicService} from '../basic.service';
import {Observable} from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';
import {catchError, tap} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class EmployeesRegistrationListService extends BasicService {

    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'accepted-employee', httpClient, helperService);
    }

    public sendMail(item: any): Observable<any> {
        const url = `${this.serviceUrl}/send/mail`;
        return this.postRequest(url, CommonUtils.convertData(item));
    }

    public sendSms(item: any): Observable<any> {
        const url = `${this.serviceUrl}/send/sms`;
        return this.postRequest(url, CommonUtils.convertData(item));
    }

    public sendListEmployeeChecked(item: any): Observable<any> {
        const url = `${this.serviceUrl}/list-employee-checked`;
        return this.postRequest(url, CommonUtils.convertData(item), true, true);
    }

    public search(data?: any, event?: any): Observable<any> {

        const url = `${this.serviceUrl}/search-2?`;

        if (event) {
            const searchData = CommonUtils.convertData({});
            searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))

            const buildParams = CommonUtils.buildParams(searchData);

            return this.postRequest2(url, CommonUtils.convertData(data), {params: buildParams});

        } else {
            return this.postRequest(url, CommonUtils.convertData(data));
        }
    }

    public postRequest2(url: string, data?: any, options?: any): Observable<any> {
        this.helperService.isProcessing(true);
        return this.httpClient.post(url, data, options)
            .pipe(
                tap( // Log the result or error
                    res => {
                        this.helperService.APP_TOAST_MESSAGE.next(res);
                        this.helperService.isProcessing(false);
                    },
                    error => {
                        this.helperService.APP_TOAST_MESSAGE.next(error);
                        this.helperService.isProcessing(false);
                    }
                ),
                catchError(this.handleError)
            );
    }
}
