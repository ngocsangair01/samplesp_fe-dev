import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';
;


@Injectable({
  providedIn: 'root'
})
export class EmpArmyProposedReportService extends BasicService {



  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'empArmyProposedReport', httpClient, helperService);
  }


  public getListType(): Observable<any> {
    const url = `${this.serviceUrl}/getType`;
    return this.getRequest(url);
  }

  public getListStatus(): Observable<any> {
    const url = `${this.serviceUrl}/getStatus`;
    return this.getRequest(url);
  }

  public saveAll(data: any): Observable<any> {
    const url = `${this.serviceUrl}/saveAll`;
    return this.postRequest(url, CommonUtils.convertData(data));
  }

  public processSign(data?: any, event?: any): Observable<any> {
    if (!event) {
      this.credentials = Object.assign({}, data);
    }

    const signData = CommonUtils.convertData(this.credentials);
    const buildParams = CommonUtils.buildParams(signData);
    const url = `${this.serviceUrl}/process-sign?`;
    return this.getRequest(url, {params: buildParams});
  }

  public processLatch(empArmyProposedId: any): Observable<any> {
    const url = `${this.serviceUrl}/process-latch/${empArmyProposedId}`;
    return this.getRequest(url);
  }

  public cancelLatch(empArmyProposedId: any): Observable<any> {
    const url = `${this.serviceUrl}/cancel-latch/${empArmyProposedId}`;
    return this.getRequest(url);
  }

  public checkSign(organizationId: any): Observable<any> {
    const url = `${this.serviceUrl}/${organizationId}/count-emp-not-latch`;
    return this.getRequest(url);
  }

  public processExportFile(subUrl:string, data?: any, event?: any): Observable<any> {
    if (!event) {
      this.credentials = Object.assign({}, data);
    }
    const formData = CommonUtils.convertData(this.credentials);
    const buildParams = CommonUtils.buildParams(formData);
    const url = `${this.serviceUrl}/` + subUrl + `?`;
    return this.getRequest(url, {params: buildParams});
  }

  public exportConfigTemplate(data?: any): void {
    // this.credentials = Object.assign({}, data);
    // const formData = CommonUtils.convertData(this.credentials);
    // const buildParams = CommonUtils.buildParams(formData);
    const url = `${this.serviceUrl}/appendix?`;
    this.postRequestFile(url, data).subscribe(res => {
      saveAs(res, 'Phu luc.zip');
    });
  }
}
