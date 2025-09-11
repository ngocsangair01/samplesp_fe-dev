import { Observable } from 'rxjs/Observable';
import { HelperService } from '@app/shared/services/helper.service';
import { HttpClient } from '@angular/common/http';
import { BasicService } from '@app/core/services/basic.service';
import { Injectable } from '@angular/core';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class RewardThoughtReportResultService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'rewardThoughtReportResult', httpClient, helperService);
  }

  public getDetaiLById(Id: number): Observable<any> {
    const id = CommonUtils.nvl(Id);
    const url = `${this.serviceUrl}/getDetail/${id}`;
    return this.getRequest(url)
  }

  public processDownloadFile(vtCriticalId : string): Observable<any> {
    const url = `${this.serviceUrl}/download-file/${vtCriticalId}`;
    return this.getRequest(url, {responseType: 'blob'});
  }

  public getTypeOfExpression(params: any): Observable<any> {
    const url = `${this.serviceUrl}/getStyle`;
    return this.getRequest(url, {params: params});
  }

  public getHandle(params: any): Observable<any> {
    const url = `${this.serviceUrl}/getHandle`;
    return this.getRequest(url, {params: params});
  }

  public getLevel(params: any): Observable<any> {
    const url = `${this.serviceUrl}/getLevel`;
    return this.getRequest(url, {params: params});
  }
  
  public getOrgan(params: any): Observable<any> {
    const url = `${this.serviceUrl}/getOrgan`;
    return this.getRequest(url, {params: params});
  }

  public checkDuplicate(params: any): Observable<any> {
    const url = `${this.serviceUrl}/checkOrg`;
    return this.getRequest(url, {params: params});
  }

  public checkDuplicateDoc(params: any): Observable<any> {
    const url = `${this.serviceUrl}/checkDocument`;
    return this.getRequest(url, {params: params});
  }

  public getDetailEovResult(eovResultId: number): Observable<any> {
    const id = CommonUtils.nvl(eovResultId);
    const url = `${this.serviceUrl}/getDetail/${id}`;
    return this.getRequest(url);
  }
}
