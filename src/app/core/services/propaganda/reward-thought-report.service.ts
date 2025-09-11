import { Observable } from 'rxjs/Observable';
import { HelperService } from '@app/shared/services/helper.service';
import { HttpClient } from '@angular/common/http';
import { BasicService } from '@app/core/services/basic.service';
import { Injectable } from '@angular/core';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class RewardThoughtReportService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'rewardThoughtReport', httpClient, helperService);
  }

  public getDetailById(Id: number): Observable<any> {
    const id = CommonUtils.nvl(Id);
    const url = `${this.serviceUrl}/getDetail/${id}`;
    return this.getRequest(url)
  }

  public processDownloadFile(vtCriticalId: string): Observable<any> {
    const url = `${this.serviceUrl}/download-file/${vtCriticalId}`;
    return this.getRequest(url, { responseType: 'blob' });
  }

  public getTypeOfExpression(params: any): Observable<any> {
    const url = `${this.serviceUrl}/getStyle`;
    return this.getRequest(url, { params: params });
  }

  public getHandle(params: any): Observable<any> {
    const url = `${this.serviceUrl}/getHandle`;
    return this.getRequest(url, { params: params });
  }

  public getNntn(orgEovIds: string): Observable<any> {
    const orgIds = CommonUtils.nvl(orgEovIds);
    const url = `${this.serviceUrl}/employees/${orgIds}`;
    return this.getRequest(url);
  }

  public findByUserLogin(): Observable<any> {
    const url = `${this.serviceUrl}/getOrganization`;
    return this.getRequest(url);
  }

  public sendSms(id: number): Observable<any> {
    const url = `${this.serviceUrl}/send-sms/${CommonUtils.nvl(id)}`;
    return this.getRequest(url);
  }
  public export(data) : Observable<any> {
    const url = `${this.serviceUrl}/export`
    return this.getRequest(url, {params: data, responseType: 'blob'})
  }

  public getCountRewardThoughtReport(data: any): Observable<any> {
    const buildParams = CommonUtils.buildParams(data);
    const url = `${this.serviceUrl}/getCountRewardThoughtReport`;
    return this.getRequest(url, { params: buildParams });
  }

}
