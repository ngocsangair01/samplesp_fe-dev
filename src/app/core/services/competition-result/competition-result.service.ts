import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {HelperService} from '@app/shared/services/helper.service';
import {BasicService} from '../basic.service';
import {Observable} from 'rxjs';
import {CommonUtils} from '@app/shared/services';

@Injectable({
    providedIn: 'root'
})
export class CompetitionResultService extends BasicService {

    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'competition-result', httpClient, helperService);
    }

    public searchList(param: any): Observable<any> {
        const url = `${this.serviceUrl}`;
        return this.getRequest(url, {params: param});
    }

    public deleteById(id: number): Observable<any> {
        const url = `${this.serviceUrl}/${id}`;
        return this.deleteRequest(url);
    }

    public saveCompetitionResult(item: any): Observable<any> {
        const url = `${this.serviceUrl}/save`;
        return this.postRequest(url, CommonUtils.convertData(item));
    }

    public saveResult(item: any): Observable<any> {
        const url = `${this.serviceUrl}`;
        return this.postRequest(url, CommonUtils.convertData(item));
    }

    public findOne(id: number): Observable<any> {
        const url = `${this.serviceUrl}/final/${id}`;
        return super.getRequest(url);
    }

    public getResultDetail(param: any): Observable<any> {
        const url = `${this.serviceUrl}/detail`;
        return this.getRequest(url, {params: param});
    }

    public findAllResultById(param: any): Observable<any> {
        const url = `${this.serviceUrl}`;
        return this.getRequest(url, {params: param});
    }
}
