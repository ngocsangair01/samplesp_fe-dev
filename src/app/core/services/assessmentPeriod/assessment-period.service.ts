import {Injectable} from '@angular/core';
import {BasicService} from '../basic.service';
import {HttpClient} from '@angular/common/http';
import {HelperService} from '@app/shared/services/helper.service';
import {Observable} from 'rxjs';
import {CommonUtils} from '@app/shared/services';

@Injectable({
    providedIn: 'root'
})

export class AssessmentPeriodService extends BasicService {
    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('assessment', 'assessmentPeriod', httpClient, helperService);
    }

    public export(data: any): Observable<any> {
        const url = `${this.serviceUrl}/export`;
        return this.getRequest(url, {params: data, responseType: 'blob'});
    }

    public findAllInformationByAssessmentPeriodId(assessmentPeriodId: number): Observable<any> {
        const url = `${this.serviceUrl}/all-information/${assessmentPeriodId}`;
        return this.getRequest(url);
    }

    public processDeleteEmployeeMapping(assessmentPeriodId: number): Observable<any> {
        const url = `${this.serviceUrl}/delete-employee-mapping/${assessmentPeriodId}`;
        return this.getRequest(url);
    }

    public processDeleteEmployeeMappingByEmpId(assessmentPeriodId: number, assessmentEmployeeId): Observable<any> {
        const url = `${this.serviceUrl}/delete-employee-mapping-by-empId/${assessmentPeriodId}/${assessmentEmployeeId}`;
        return this.getRequest(url);
    }


    public getStaffMapping(formData: any) {
        const url = `${this.serviceUrl}/get-staff-mapping`;
        return this.getRequest(url, {params: formData});
    }

    public getStaffMappingV2(formData: any) {
        const url = `${this.serviceUrl}/get-staff-mapping-v2`;
        return this.getRequest(url, {params: formData});
    }

    public processPromulgate(assessmentPeriodId: number): Observable<any> {
        const url = `${this.serviceUrl}/promulgate/${assessmentPeriodId}`;
        return this.postRequest(url);
    }

    public processLock(assessmentPeriodId: number): Observable<any> {
        const url = `${this.serviceUrl}/lock/${assessmentPeriodId}`;
        return this.postRequest(url);
    }

    public processExportEmployeeAssessment(data: any): Observable<any> {
        const url = `${this.serviceUrl}/employee-assessment-export`;
        return this.getRequest(url, {params: data, responseType: 'blob'});
    }

    public processExportEmployeeAssessmentRs(data: any): Observable<any> {
        const url = `${this.serviceUrl}/employee-assessment-result-export`;
        return this.getRequest(url, {params: data, responseType: 'blob'});
    }

    public downloadTemplateImport(data) {
        const url = `${this.serviceUrl}/download-template-import`;
        return this.getRequest(url, {params: data, responseType: 'blob'});
    }

    public downloadTemplateImportNew(data) {
        const url = `${this.serviceUrl}/download-template-import-new`;
        return this.getRequest(url, {params: data, responseType: 'blob'});
    }

    public processImport(data): Observable<any> {
        const url = `${this.serviceUrl}/import-data-assessment`;
        const formData = CommonUtils.convertFormFile(data);
        return this.postRequest(url, formData);
    }

    public processImportNew(data): Observable<any> {
        const url = `${this.serviceUrl}/import-data-assessment-new`;
        const formData = CommonUtils.convertFormFile(data);
        return this.postRequest(url, formData);
    }

    public getAllAssessmentPeriodList(): Observable<any> {
        const url = `${this.serviceUrl}/assessment-period-list`;
        return this.getRequest(url);
    }

    public getStaffMappingAssessmentLevelList(data: any): Observable<any> {
        const url = `${this.serviceUrl}/get-staff-mapping-assessment-level-list`;
        return this.getRequest(url, {params: data});
    }

    public updateAssessmentEmployeeMapping(item: any): Observable<any> {
        const url = `${this.serviceUrl}/update-assessment-employee-mapping`;
        return this.postRequest(url, CommonUtils.convertData(item));
    }
  public updateAssessmentEmployeeMapping2(item: any): Observable<any> {
    const url = `${this.serviceUrl}/update-assessment-employee-mapping2`;
    return this.postRequest(url, CommonUtils.convertData(item));
    }

    public getAssessmentLevelList(data: any): Observable<any> {
        const url = `${this.serviceUrl}/get-assessment-level-list`;
        return this.getRequest(url, {params: data});
    }

    public getAssessmentHistory(param, assessmentPeriodId: any, employeeId:any): Observable<any> {
        const url = this.serviceUrl + `/get-assessment-history/${assessmentPeriodId}/${employeeId}`;
        return this.getRequest(url, {params: param});
    }

    public getAssessmentHistoryByAssessmentPeriodIdAndEmployeeId(data: any): Observable<any> {
        return this.getRequest(this.serviceUrl + `/get-assessment-history-by-assessment-period-id-and-employee-id`,{params: data});
    }

    public getAssessmentLevelListV2(data: any): Observable<any> {
        const url = `${this.serviceUrl}/get-assessment-level-list-v2`;
        return this.getRequestNoEndSpin(url, {params: data});
    }

    public makeListForPartyOrganization(data: any): Observable<any> {
        const url = `${this.serviceUrl}/make-list-for-party-organization`;
        return this.postRequest(url, CommonUtils.convertData(data));
    }

    public getAssessmentPeriodListPromulgated(): Observable<any> {
        const url = `${this.serviceUrl}/get-period-list-promulgated`;
        return this.getRequest(url);
    }

    public processAddStaffAssessment(data): Observable<any> {
        const url = `${this.serviceUrl}/add-staff-assessment`;
        return this.postRequest(url, CommonUtils.convertData(data));
    }

    public resetAssessmentRessult(assessmentPeriodId): Observable<any> {
        const url = `${this.serviceUrl}/reset-assessment-ressult/${assessmentPeriodId}`;
        this.helperService.isProcessing(true);
        return this.deleteRequest(url);
    }

    public deleteAssessmentEmpByPartyOrganization(data: any): Observable<any> {
        const url = `${this.serviceUrl}/delete-assessment-emp-by-party-organization`;
        return this.postRequest(url, CommonUtils.convertData(data));
    }

    public getEmployeeInfoById(employeeId: number) {
        const url = `${this.serviceUrl}/get-employee-info-by-id/${employeeId}`;
        return this.getRequest(url);
    }

    public getAssessmentPeriodList() {
        const url = `${this.serviceUrl}/get-assessment-period-list`;
        return this.getRequest(url);
    }

    public getAssessmentPeriodListByIsLock() {
        const url = `${this.serviceUrl}/get-assessment-period-list_by_is_lock`;
        return this.getRequest(url);
    }
    public makeList(data): Observable<any> {
        const url = `${this.serviceUrl}/make-list`;
        return this.postRequest(url, CommonUtils.convertData(data));
    }

    public processExportEmployeeAssessmentV2(data: any): Observable<any> {
        const url = `${this.serviceUrl}/employee-assessment-export-v2`;
        return this.getRequest(url, {params: data, responseType: 'blob'});
    }

    public findPreviousAssessmentPeriod(assessmentPeriodId: number): Observable<any> {
        const url = `${this.serviceUrl}/find-previous-assessment/${assessmentPeriodId}`;
        return this.getRequest(url);
    }
    public getPreviousPartyAssessmentPeriod(): Observable<any> {
        const url = `${this.serviceUrl}/find-previous-party-assessment`;
        return this.getRequest(url);
      }
}
