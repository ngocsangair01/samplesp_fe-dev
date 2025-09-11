import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class PersonalPunishmentService extends BasicService {

  private _isEmployee: boolean = false;

  get isEmployee(): boolean {
    return this._isEmployee;
  }

  set isEmployee(value: boolean) {
    this._isEmployee = value;
  }
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'personalPunishment', httpClient, helperService);
  }

  public getInfoOfEmp(employeeId): Observable <any> {
    const url = `${this.serviceUrl}/get-info-emp/${employeeId}`;
    return this.getRequest(url);
  }

  public processExport(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public findOnePunishment(data: any): Observable<any> {
    const buildParams = CommonUtils.buildParams(data);
    const url = `${this.serviceUrl}/find-one?`;
    return this.getRequest(url,{params: buildParams});
  }

  public downloadTemplateImport(data): Observable<any> {
    const url = `${this.serviceUrl}/export-template`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  /**
   * Import process political manage
   * @param data
   */
  public processImport(data): Observable<any> {
    const url = `${this.serviceUrl}/import`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }
  public processSearchPunishmentForEmployee(employeeId, event?: any) {
    if (!event) {
      this.credentials = Object.assign({}, employeeId);
    }
    const searchData = CommonUtils.convertData(this.credentials);
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/punishment-info/${employeeId}`;
    return this.getRequest(url, {params: buildParams});
  }
    /**
   * saveOrUpdate
   */
  public saveOrUpdate(item: any): Observable<any> {
    const url = `${this.serviceUrl}`;
    return this.postRequest(url, CommonUtils.convertData(item));  
  }
}
