import {Injectable} from '@angular/core';
import {BasicService} from '../basic.service';
import {HttpClient} from '@angular/common/http';
import {HelperService} from '@app/shared/services/helper.service';
import {Observable} from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';

@Injectable({
    providedIn: 'root'
})

export class AssessmentPartyOrganizationService extends BasicService {
    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('assessment', 'assessmentPartyOrganization', httpClient, helperService);
    }

    public getInfo(assessmentPartyOrganizationId: number): Observable<any> {
        const url = `${this.serviceUrl}/get-info/${assessmentPartyOrganizationId}`;
        return this.getRequest(url);
    }

    public getInfoEmp(assessmentPeriodId: number, partyOrganizationId: number): Observable<any> {
        const url = `${this.serviceUrl}/get-info-emp/${assessmentPeriodId}/${partyOrganizationId}`;
        return this.getRequest(url);
    }

    public downloadTemplateImport(formImport: any): Observable<any> {
        const url = `${this.serviceUrl}/download-template-import`;
        return this.getRequest(url, {
            params: {
                assessmentPeriodId: formImport.assessmentPeriodId,
                assessmentPartyOrganizationId: formImport.partyOrganizationId,
                assessmentOrder: formImport.assessmentLevel
            }, responseType: 'blob'
        });
    }

    public processImport(data: any): Observable<any> {
        const url = `${this.serviceUrl}/import`;
        const formdata = CommonUtils.convertFormFile(data);
        return this.postRequest(url, formdata);
    }

    public getAssessmentLevelOrderList(form: any): Observable<any> {
        const buildParams = CommonUtils.buildParams(form);
        const url = `${this.serviceUrl}/get-assessment-level-order-list`;
        return this.getRequest(url, {params: buildParams});
    }

    public processSearchSumUp(data?: any, event?: any): Observable<any> {
        if (!event) {
            this.credentials = Object.assign({}, data);
        }
        const searchData = CommonUtils.convertData(this.credentials);
        if (event) {
            searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
        }
        const buildParams = CommonUtils.buildParams(searchData);
        const url = `${this.serviceUrl}/search-sum-up?`;
        return this.getRequest(url, {params: buildParams});
    }

    public processSearchDetail(data?: any, event?: any): Observable<any> {
        if (!event) {
            this.credentials = Object.assign({}, data);
        }
        const searchData = CommonUtils.convertData(this.credentials);
        if (event) {
            searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
        }
        const buildParams = CommonUtils.buildParams(searchData);
        const url = `${this.serviceUrl}/search-detail?`;
        return this.getRequest(url, {params: buildParams});
    }

    public getCriteriaKeyByPeriodIdAndAssessmentOrder(data: any): Observable<any> {
        const buildParams = CommonUtils.buildParams(data);
        const url = `${this.serviceUrl}/get-criteria-key`;
        return this.getRequest(url, {params: buildParams});
    }

    public makeSignFileAttachmentFile(form): Observable<any> {
        const url = `${this.serviceUrl}/make-sign-file-attachment-file`;
        return this.postRequest(url, CommonUtils.convertData(form));
    }

    public processUpdateAndCloseResult(data): Observable<any> {
        const url = `${this.serviceUrl}/update-and-close-result`;
        return this.postRequest(url, CommonUtils.convertData(data));
    }


    public getBaseInforDetail(assessmentPartyOrganizationId: number): Observable<any> {
        const url = `${this.serviceUrl}/get-base-infor-detail/${assessmentPartyOrganizationId}`;
        return this.getRequest(url);
    }

    public getSignFileInformation(assessmentPartyOrganizationId: number): Observable<any> {
        const url = `${this.serviceUrl}/get-sign-file-information/${assessmentPartyOrganizationId}`;
        return this.getRequest(url);
    }

    public downloadSignFileApproved(data: any): Observable<any> {
        const url = `${this.serviceUrl}/download-sign-file-approved`;
        return this.getRequest(url, {params: data, responseType: 'blob'});
    }

    public downloadFile(transCode: string): Observable<any> {
        const url = `${this.serviceUrl}/download-file/${transCode}`;
        return this.getRequest(url, {responseType: 'blob'});
    }

    public processExportSumUp(formData): Observable<any> {
        const url = `${this.serviceUrl}/export-sum-up`;
        return this.getRequest(url, {params: formData, responseType: 'blob'});
    }

    public getNextAssessmentOrder(formData): Observable<any> {
        const buildParams = CommonUtils.buildParams(formData);
        const url = `${this.serviceUrl}/get-next-assessment-order`;
        return this.getRequest(url, {params: buildParams});
    }

    public processAssessmentRequestAgain(formData): Observable<any> {
        const url = `${this.serviceUrl}/assessment-request-again`;
        return this.postRequest(url, CommonUtils.convertData(formData));
    }
}
