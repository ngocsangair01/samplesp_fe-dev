import { Observable } from 'rxjs/Observable';
import {CommonUtils, CryptoService} from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class RetiredContactService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'retired-contact', httpClient, helperService);
  }

  public export(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public exportfile(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export-file-list`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  public getEmployeeInfo(employeeId: number) {
    const empId = CommonUtils.nvl(employeeId);
    const url = `${this.serviceUrl}/${empId}/basic-info`;
    return this.getRequest(url);
  }

  public getEmployeeMainPositionInfo(employeeId: number) {
    const empId = CommonUtils.nvl(employeeId);
    const url = `${this.serviceUrl}/${empId}/main-position-info`;
    return this.getRequest(url);
  }

  public getPartyMember(employeeId: number) {
    const empId = CommonUtils.nvl(employeeId);
    const url = `${this.serviceUrl}/${empId}/party-member`;
    return this.getRequest(url);
  }
  
  // /**
  //  * saveOrUpdate
  //  */
  //  public saveOrUpdate(item: any): Observable<any> {
  //   const url = `${this.serviceUrl}`;
  //   return this.postRequest(url, CommonUtils.convertData(item));  
  // }

  public getOtherPartyList(employeeId: number) {
    const empId = CommonUtils.nvl(employeeId);
    const url = `${this.serviceUrl}/${empId}/other-party-list`;
    return this.getRequest(url);
  }

  public getImage(employeeId: number): Observable<any> {
    const empId = CommonUtils.nvl(employeeId);
    const url = `${this.serviceUrl}/employee-image/${empId}`;
    return this.getRequest(url);
  }

  public findById(employeeId: number): Observable<any> {
    const url = `${this.serviceUrl}/${employeeId}`;
    return this.getRequest(url);
  }

  public getRetiredContactDetail(employeeId: number) {
    const empId = CommonUtils.nvl(employeeId);
    const url = `${this.serviceUrl}/${empId}/retired-contact-detail`;
    return this.getRequest(url);
  }

  /**
   * Lấy ra danh sách nhân viên theo đơn vị
   * @param data 
   */
  public getListEmpSendWarning(data?: any) {
    const searchData = CommonUtils.convertData(data);
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/list-emp-send-warning`;
    return this.getRequest(url, {params: buildParams});
  }
  
  /**
   * Gửi thông báo cập nhật hồ sơ
   * @param data 
   */
  public sendWarningEmpFile(data: any): Observable<any> {
    const param = CommonUtils.convertData(data);
    const url = `${this.serviceUrl}/send-warning`;
    return this.postRequest(url, param);
  }

  /**
   * Lấy thông tin chức danh của nhân viên
   * @param employeeId 
   */
  public getPositionByEmployeeId(employeeId: number) {
    const empId = CommonUtils.nvl(employeeId);
    const url = `${this.serviceUrl}/${empId}/position`;
    return this.getRequest(url);
  }

  /**
   * Lấy thông tin chức danh của nhân viên
   * @param employeeId 
   */
  public getListEmpInsuranceProcessByEmployeeId(employeeId: number, event?: any): Observable<any> {
    const empId = CommonUtils.nvl(employeeId);
    const url = `${this.serviceUrl}/${empId}/emp-insurance-process`;
    if (!event) {
      this.credentials = Object.assign({}, null);
    }
    const searchData = CommonUtils.convertData(this.credentials);
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    return this.getRequest(url, {params: buildParams});
  }

   /**
   * Lấy thông tin danh sách file tải lên
   */
  public processFileSearch(data?: any, event?: any): Observable<any> {
    if (!event) {
      this.credentials = Object.assign({}, data);
    }

    const searchData = CommonUtils.convertData(this.credentials);
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/file-search`;
    return this.getRequest(url, {params: buildParams});
  }

  public exportPoliticsNeedToPayAttenion(params?: any): Observable<any> {
    const url = `${this.serviceUrl}/export-politics-need-to-pay-attenion`;
    return this.getRequest(url, {params: params, responseType: 'blob'});
  }

  public getListForeignEduPlace(employeeId: number) {
    const empId = CommonUtils.nvl(employeeId);
    const url = `${this.serviceUrl}/${empId}/foreign-edu-place`;
    return this.getRequest(url);
  }

  public exportCurriculumVitae(employeeId) {
    const url = `${this.serviceUrl}/export-curriculum-vitae/${employeeId}`;
    return this.getRequest(url, {responseType: 'blob'});
  }

  public getEmployeeInfoById(employeeId: number) {
    const url = `${this.serviceUrl}/get-employee-info-by-id/${employeeId}`;
    return this.getRequest(url);
  }
}
