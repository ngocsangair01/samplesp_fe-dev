import { Observable } from 'rxjs/Observable';
import {CommonUtils, CryptoService} from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartyMemebersService extends BasicService {
  savePartyMember: Subject<any> = new Subject<any>();
  saveEmployeeInformation: Subject<any> = new Subject<any>();
  selectMenuItem: Subject<any> = new Subject<any>();
  changeTab: Subject<any> = new Subject<any>();

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'partyMembers', httpClient, helperService);
  }

  public export(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
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

  public searchProcess(data?: any, event?: any): Observable<any> {
    if (!event) {
      this.credentials = Object.assign({}, data);
    }

    const searchData = CommonUtils.convertData(this.credentials);
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/search-process`;
    return this.getRequest(url, {params: buildParams});
  }

  public findByPartyMemberProcessId(partyMemberProcessId: number): Observable<any> {
    const url = `${this.serviceUrl}/find-by-party-member-process/${partyMemberProcessId}`;
    return this.getRequest(url);
  }

  public updatePartyMemberProcess(item: any): Observable<any> {
    const url = `${this.serviceUrl}/update-party-member-process`;
    return this.postRequest(url, CommonUtils.convertData(item));  
  }

  public saveOrUpdateProcess(item: any): Observable<any> {
    const url = `${this.serviceUrl}/save-process`;
    return this.postRequest(url, CommonUtils.convertData(item));  
  }

  public findProcessByEmployeeId(employeeId: number): Observable<any> {
    const url = `${this.serviceUrl}/find-process-by-employeeId/${employeeId}`;
    return this.getRequest(url);
  }

  public findEmployeeExclusionById(employeeId: number): Observable<any> {
    const empId = CommonUtils.nvl(employeeId);
    const url = `${this.serviceUrl}/exclusion/${empId}`;
    return this.getRequest(url);
  }
 
  public insertPartyMemberStatus(data): Observable<any> {
    const url = `${this.serviceUrl}/insert-party-member-status`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }

  public exportPartyMemberInfo(employeeId): Observable<any> {
    const url = `${this.serviceUrl}/export-party-member-info/${employeeId}`;
    return this.getRequest(url, {responseType: 'blob'});
  }

  public exportDeadPartyMember(workProcessId): Observable<any> {
    const url = `${this.serviceUrl}/export-dead-party-member/${workProcessId}`;
    return this.getRequest(url, {responseType: 'blob'});
  }

  public deleteByProcessId(partyMemberProcessId: any): Observable<any> {
    const url = `${this.serviceUrl}/party_process/${partyMemberProcessId}`;
    return this.deleteRequest(url);  
  }

  public findPartyConcurrentProcessByEmployeeId(employeeId: number): Observable<any> {
    const url = `${this.serviceUrl}/find-concurrent-process-by-employee-id/${employeeId}`;
    return this.getRequest(url);
  }

  public findLoginPartyMember(): Observable<any> {
    const url = `${this.serviceUrl}/get-user-login-info`;
    return this.getRequest(url);
  }
}
