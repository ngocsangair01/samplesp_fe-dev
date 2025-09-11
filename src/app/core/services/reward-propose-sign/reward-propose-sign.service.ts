import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {CommonUtils, CryptoService} from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class RewardProposeSignService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'rewardProposeSign', httpClient, helperService);
  }

  public exportRewardProposeSign(data): Observable<any> {
    const url = `${this.serviceUrl}/export`
    return this.getRequest(url, { params: data, responseType: 'blob' })
  }
  public exportRewardProposeSignObject(rewardProposeSignId: number): Observable<any> {
    const url = `${this.serviceUrl}/export-reward-propose-sign-object/${rewardProposeSignId}`
    return this.getRequest(url, {responseType: 'blob' })
  }
  /**
* tim du lieu theo form
* @param data
* @param event
* @returns
*/
  public processSearchDetail(data?: any, event?: any): Observable<any> {
    const searchData = CommonUtils.convertData(Object.assign({}, data));
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/searchDetail?`;
    return this.getRequest(url, { params: buildParams });
  }

  public downloadTemplateImport(rewardType: number): Observable<any> {
    const url = `${this.serviceUrl}/export-template/${rewardType}`;
    return this.getRequest(url, { responseType: 'blob' });
  }

  public processImport(data): Observable<any> {
    const url = `${this.serviceUrl}/import`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }

  public exportProposeSignObject(rewardProposeSignId: number): Observable<any> {
    const url = `${this.serviceUrl}/export-reward-propose-object/${rewardProposeSignId}`
    return this.getRequest(url, {responseType: 'blob' })
  }

    /**
   * Them moi
   * getRewardGeneralList
   */
  public updateStatus(data: any): Observable<any> {
    const dataToSave = CommonUtils.convertFormFile(data);
    const url = `${this.serviceUrl}/update-status`;
    return this.postRequest(url, dataToSave);
  }

  public updateStatusRewardProposeSign(data: any): Observable<any> {
    const dataToSave = CommonUtils.convertFormFile(data);
    const url = `${this.serviceUrl}/update-status-reward-propose-sign`;
    return this.postRequest(url, dataToSave);
  }


  /**
   * tim don vi cong tac theo ngay ky va ma nhan vien
   * @param data
   * @param event
   * @returns
   */
  public findUnitWork(data): Observable<any> {
    const url = `${this.serviceUrl}/find-unit-work`;
    return this.postRequest(url, CommonUtils.convertFormFile(data));
  }

  /**
   * actionSignVoffice
   * @param rewardProposeSignId
   * @returns
   */
   public actionSignVoffice(rewardProposeSignId: number): Observable<any> {
    const url = `${this.serviceUrl}/gen-file-sign-voffice/${rewardProposeSignId}`
    return this.getRequest(url)
  }
  public getDataDropdown(): Observable<any> {
    const url = `${this.serviceUrl}/get-data-dropdown`;
    return this.getRequest(url);
  }
  public processTransferPayment(data): Observable<any> {  
    const url = `${this.serviceUrl}/create-reimbursement`;
    
    return this.postRequest(url, CommonUtils.convertFormFile(data));
  }

  public processTransferBTHTT(data): Observable<any> {
    const url = `${this.serviceUrl}/transfer-reimbursement`;
    return this.postRequest(url,CommonUtils.convertFormFile(data));
  }
  public processRejectStatement(id: number): Observable<any> {
      const url = `${this.serviceUrl}/reject-statement/${id}`;
      return this.postRequest(url);
  }

  public completeStatement(id: number): Observable<any> {
        const url = `${this.serviceUrl}/complete-statement/${id}`;
        return this.postRequest(url);
  }
  public generateFileReward(id: number): Observable<any> {
    const url = `${this.serviceUrl}/generate-file/${id}`;
    return this.getRequest(url);
  }



  /**
   * preview file
   * param item
   */
  public previewFile(item): Observable<any> {
    const url = `${this.serviceUrl}/preview-file`;
    return this.postRequestFile(url, CommonUtils.convertData(item));
  }

  public callJobGenFile(): Observable<any>{
    const url = `${this.serviceUrl}/call-job-gen-file`;
    return this.getRequest(url);
  }
  public findByEmployeeCode(employeeCode): Observable<any>{
    const url = `${this.serviceUrl}/find-info-promulgate-by/${employeeCode}`;
    return this.getRequest(url);
  }
}
