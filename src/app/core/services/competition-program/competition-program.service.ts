import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {HelperService} from '@app/shared/services/helper.service';
import {BasicService} from '../basic.service';
import {Observable} from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';

@Injectable({
    providedIn: 'root'
})
export class CompetitionProgramService extends BasicService {

    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'competition-program', httpClient, helperService);
    }

    public deleteById(id: number): Observable<any> {
        const url = `${this.serviceUrl}/delete?competitionId=${id}`;
        return this.deleteRequest(url);
    }

    public saveOrUpdate(item: any): Observable<any> {
        const url = `${this.serviceUrl}`;
        return this.postRequest(url, CommonUtils.convertData(item));
    }

    public findOne(id: number): Observable<any> {
        const url = `${this.serviceUrl}/detail?competitionId=${id}`;
        return super.getRequest(url);
    }

    public getEmpByType(param: any, event?: any): Observable<any>{
        if (!event) {
            this.credentials = Object.assign({}, param);
        }

        const searchData = CommonUtils.convertData(this.credentials);
        if (event) {
            searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
        }
        const buildParams = CommonUtils.buildParams(searchData);
        const url = `${this.serviceUrl}/employee-by-type`;
        return this.getRequest(url, {params: buildParams});
    }

    downloadTemplate() : Observable<any>{
        const url = `${this.serviceUrl}/import/template`;
        return this.getRequest(url, {responseType: 'blob'})
    }

    public getAllEmpTypeSelection(): Observable<any> {
        const url = `${this.serviceUrl}/emp-type/selection`;
        return this.getRequest(url);
    }

    public processImport(data): Observable<any> {
        const url = `${this.serviceUrl}/import`;
        const formdata = CommonUtils.convertFormFile(data);
        return this.postRequest(url, formdata);
    }

    public getListAllCompetitionRegistrationByUnit(): Observable<any> {
        return this.getRequest(`${this.serviceUrl}/list-competition-program-active`);
    }
}
