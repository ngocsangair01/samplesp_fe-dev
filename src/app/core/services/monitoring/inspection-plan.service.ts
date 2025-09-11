import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonUtils } from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { BasicService } from '../basic.service';

@Injectable({
    providedIn: 'root'
})
export class InspectionPlanService extends BasicService {

    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'inspectionPlan', httpClient, helperService);
    }

    public generateInspectionPlanCode(partyOrganizationId: number, year: number): Observable<any> {
        const url = `${this.serviceUrl}/generate-inspection-plan-code/${partyOrganizationId}/${year}`;
        return this.getRequest(url, { responseType: 'text' });
    }

    public downloadTemplateImport(): Observable<any> {
        const url = `${this.serviceUrl}/export-template`;
        return this.getRequest(url, { responseType: 'blob' });
    }

    public readFileImport(item: any): Observable<any> {
        const formdata = CommonUtils.convertFormFile(item);
        const url = `${this.serviceUrl}/readfile-import`;
        return this.postRequest(url, formdata);
    }

}
