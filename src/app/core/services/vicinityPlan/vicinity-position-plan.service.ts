import { Observable } from 'rxjs/Observable';
import { CommonUtils } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class VicinityPositionPlanService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'vicinityPositionPlan', httpClient, helperService);
  }

  public exportListVicinityPositionPlan(data): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, { params: data, responseType: 'blob' });
  }

  public downloadTemplate(data: any): Observable<any> {
    const url = `${this.serviceUrl}/download-template`;
    return this.getRequest(url, { params: data, responseType: 'blob' });
  }

  public processImport(data): Observable<any> {
    const url = `${this.serviceUrl}/import`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }

  public getVicinityPlanReport(data: any): Observable<any> {
    const url = `${this.serviceUrl}/get-vicinity-plan-report`;
    return this.getRequest(url, { params: data, responseType: 'blob' });
  }

  public findEffectivePositionByOrgId(organizationId: number, vicinityPositionPlanId: number): Observable<any> {
    const orgId = CommonUtils.nvl(organizationId);
    const planId = CommonUtils.nvl(vicinityPositionPlanId);
    const url = `${this.serviceUrl}/position/${orgId}/${planId}`;
    return this.getRequest(url);
  }
  //dunglv add
  public getDetailEmployeeById(emPloyeeId: number): Observable<any> {
    const empId = CommonUtils.nvl(emPloyeeId);
    const url = `${this.serviceUrl}/position/${empId}`;
    return this.getRequest(url);
  }

  public getDetaiLById(vicinID: number): Observable<any> {
    const vicinityPositionPlanId = CommonUtils.nvl(vicinID);
    const url = `${this.serviceUrl}/detail/${vicinityPositionPlanId}`;
    return this.getRequest(url)
  }

  public updateRotation(data: any): Observable<any> {
    const url = `${this.serviceUrl}/vicinityPlanMapping`;
    const formdata = CommonUtils.convertData(data);
    return this.postRequest(url, formdata)
  }

  public transferTime(): Observable<any> {
    const url = `${this.serviceUrl}/transferTime`;
    return this.getRequest(url);
  }

  public getDetailPostion(vicinID: number, posId: number) {
    const vicinityPositionPlanId = CommonUtils.nvl(vicinID);
    const positionId = CommonUtils.nvl(posId);
    const url = `${this.serviceUrl}/detail/${vicinityPositionPlanId}/${positionId}`;
    return this.getRequest(url);
  }

  public getDetailRotation(idVMP: number) {
    const idVMPs = CommonUtils.nvl(idVMP);
    const url = `${this.serviceUrl}/vicinityPlanMapping/${idVMPs}`;
    return this.getRequest(url);
  }

  public getEmployeeAssessmentByEmployeeId(employeeId: number) {
    const id = CommonUtils.nvl(employeeId);
    const url = `${this.serviceUrl}/find-employee-assessment/${id}`;
    return this.getRequest(url);
  }

  public removeRotation(vicinityPlanMappingId: number) {
    const id = CommonUtils.nvl(vicinityPlanMappingId);
    const url = `${this.serviceUrl}/vicinity-plan-mapping/delete/${id}`;
    return this.deleteRequest(url)
  }

  public exportBM2A(organizationId: number) {
    const id = CommonUtils.nvl(organizationId);
    const url = `${this.serviceUrl}/export-bm-2a/${id}`;
    return this.getRequest(url, { responseType: 'blob' });
  }

}
