import { Injectable, ViewChild } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class GroupOrgPositionService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'group-org-position', httpClient, helperService);
  }

  public validateBeforeSave(item: any): Observable<any> {
    const url = `${this.serviceUrl}/validate-before-save`;
    return this.postRequest(url, item);
  }

  
  public export(data): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.postRequestFile(url, data);
  }

  /**
   * Get list group position by organization
   */
  public findGroupPositionByOrganizationId(organizationId: number): Observable<any> {
    const url = `${this.serviceUrl}/group-positions-by-organization/${organizationId}`;
    return this.getRequest(url);
  }

  /**
   * Get position by organization and group position id
   */
  public findPositionByOrganizationAndGroupPosition(organizationId: number, groupId: number): Observable<any> {
    const url = `${this.serviceUrl}/position-by-group-positions-and-organization/${organizationId}/${groupId}`;
    return this.getRequest(url);
  }

  public updateAppoval(item: any): Observable<any> {
    const url = `${this.serviceUrl}/update-approval`;
    return this.postRequest(url, CommonUtils.convertData(item));  
  }

   public  downloadTemplateImport() {
     const url = `${this.serviceUrl}/download-template-import`;
     return this.getRequest(url,{responseType: 'blob'});
    }

  public processImportUpgradeGroupOrg(data): Observable<any> {
    const url = `${this.serviceUrl}/import-group-org`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }
}
