import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class ResponseResolutionQuarterYearService extends BasicService{

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'resolutionQuarterYear', httpClient, helperService);
  }

  /**
   * Ra yêu cầu
   */
  public setRequest(id: number) {
    const requestResolutionsId = CommonUtils.nvl(id);
    const url = `${this.serviceUrl}/${requestResolutionsId}/request`;
    return this.postRequest(url, requestResolutionsId);
  }

  /**
   * Báo cáo file docx
   */
  public exportFileDocx(id: number) {
    const requestResolutionsId = CommonUtils.nvl(id);
    const url = `${this.serviceUrl}/${requestResolutionsId}/export`;
    return this.getRequest(url, {params: requestResolutionsId, responseType: 'blob'} );
  }

  public findByCateCriteriaId(id: number) {
    const cateCriteriaId = CommonUtils.nvl(id);
    const url = `${this.serviceUrl}/find-by-cate-criteria-id/${cateCriteriaId}`;
    return this.getRequest(url);
  }

  /**
   * Báo cáo tiến độ
   */
  public exportReportProgressManage(id: number) {
    const requestResolutionsId = CommonUtils.nvl(id);
    const url = `${this.serviceUrl}/export-report-manage-progress/${requestResolutionsId}`;
    return this.getRequest(url, {params: requestResolutionsId, responseType: 'blob'} );
  }
}
