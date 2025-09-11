import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class MassOrganizationService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'managerMassOrg', httpClient, helperService);
  }
  public getTypeOrganization(parentId): Observable <any> {
    const url = `${this.serviceUrl}/org-type/${parentId}`;
    return this.getRequest(url);
  }
  public export(data: any): Observable <any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }
  public lstMassMappingOrg(massOrganizationId: any): Observable <any> {
    const url = `${this.serviceUrl}/mass-mapping-org/${massOrganizationId}`;
    return this.getRequest(url);
  }
  public lstMassSearchTree(massOrganizationId: any): Observable <any> {
    const url = `${this.serviceUrl}/mass-search-tree/${massOrganizationId}`;
    return this.getRequest(url);
  }
  public getEmployee(employeeId: number): Observable <any> {
    const url = `${this.serviceUrl}/search-employee/${employeeId}`;
    return this.getRequest(url);
  }
  public getTypeWithBranch(type: any): Observable <any> {
    // console.log('listType', type);
    const url = `${this.serviceUrl}/get-type-with-branch/${type}`;
    return this.getRequest(url);
  }
  public downloadTemplateImport(data): Observable<any> {
    const url = `${this.serviceUrl}/export-template`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }
  public processImport(data): Observable<any> {
    const url = `${this.serviceUrl}/import`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }
  public findChildsByParent(data): Observable<any> {
    const url = `${this.serviceUrl}/find-child/${data}`;
    return this.getRequest(url);
  }
  public findByParentId(parentId: number): Observable<any> {
    const url = `${this.serviceUrl}/find-by-parent-id/${parentId}`;
    return this.getRequest(url);
  }

  public getListMassOrgByEmployeeId(employeeId: number, branch: number): Observable<any> {
    const url = `${this.serviceUrl}/list-mass-org-by-employee/${employeeId}/${branch}`;
    return this.getRequest(url);
  }
}
