import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../../basic.service';
import { CommonUtils } from '@app/shared/services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'organization', httpClient, helperService);
  }

  public findData(item: any) {
    return this.getRequest(`${this.serviceUrl}/` + CommonUtils.convertData(item));
  }
  public findVfsAccountingTypeById(item: any) {
    return this.getRequest(`${this.serviceUrl}/`+'find-vfs-accounting-type/' + CommonUtils.convertData(item));
  }

  public findOneForHomeInfo(): Observable<any> {
    const url = `${this.serviceUrl}/home-info`;
    return this.getRequest(url);
  }

   /**
   * get node org view detail
   */
  public findOrgViewDetail(id: number): Observable<any> {
    const organizationId = CommonUtils.nvl(id);
    const url = `${this.serviceUrl}/${organizationId}/node-view-detail`;
    return this.getRequest(url);
  }

  /**
   * get child nodes org
   */
  public findListChildViewDetail(id: number): Observable<any> {
    const orgChartId = CommonUtils.nvl(id);
    const url = `${this.serviceUrl}/${orgChartId}/childs-node-view-detail`;
    return this.getRequest(url);
  }

   /**
   * get total boundary
   */
  public getTotalBoundary(id: number): Observable<any> {
    const organizationId = CommonUtils.nvl(id);
    const url = `${this.serviceUrl}/${organizationId}/total-boundary`;
    return this.getRequest(url);
  }

  /**
   * find org additional info
   */
  public findOrgAdditionalInfo(orgId: number) {
    const organizationId = CommonUtils.nvl(orgId);
    const url = `${this.serviceUrl}/${organizationId}/other-info`;
    return this.getRequest(url);
  }

  public findByIds(orgIds: any): Observable<any> {
    const url = `${this.serviceUrl}/find-by-ids/${orgIds}`;
    return this.getRequest(url);
  }

  public isSmallThanParentId(formData): Observable<any> {
    const url = `${this.serviceUrl}/is-small-than-parent-id`;
    return this.getRequest(url, {params: formData});
  }
}
