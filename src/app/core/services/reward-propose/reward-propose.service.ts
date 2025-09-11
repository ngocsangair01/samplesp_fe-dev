import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {CommonUtils, CryptoService} from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class RewardProposeService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'rewardPropose', httpClient, helperService);
  }
  /**
    * tim du lieu theo form
    * @param data
    * @param event
    * @returns
    */
  public processSearch(data?: any, event?: any): Observable<any> {
    const searchData = CommonUtils.convertData(Object.assign({}, data));
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/search?`;
    return this.getRequest(url, { params: buildParams });
  }
  /**
    * tim du lieu theo form
    * @param listRewardProposeId
    * @returns
    */
   public getDatatablesConfirmed(data?: any, event?: any): Observable<any> {
    const searchData = CommonUtils.convertData(Object.assign({}, data));
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    if (searchData.ignoreList && searchData.ignoreList.length > 0) {
      searchData.ignoreList = searchData.ignoreList.join(', ');
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/search-list-confirmed`;
    return this.getRequest(url, { params: buildParams } );
  }
  /**
    * tim du lieu theo form
    * @param listRewardProposeId
    * @returns
    */
   public getDatatablesByListSignOrg(data?: any): Observable<any> {
    const dataToSave = CommonUtils.convertFormFile(data);
    const url = `${this.serviceUrl}/search-by-list-reward-propose-id`;
    return this.postRequest(url, dataToSave );
  }

  /**
   * Them moi
   * getRewardGeneralList
   */
  public saveAll(lstData: any): Observable<any> {
    const dataToSave = CommonUtils.convertFormFile(lstData);
    const url = `${this.serviceUrl}`;
    return this.postRequest(url, dataToSave);
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
  /**
  * download template
  * param rewardObjectType
  */
  // public downloadTemplateImport(rewardObjectType: number, rewardType: number): Observable<any> {
  //   const url = `${this.serviceUrl}/export-template/${rewardObjectType}/${rewardType}`;
  //   return this.getRequest(url, { responseType: 'blob' });
  // }

  public downloadTemplateImport(rewardType: number): Observable<any> {
    const url = `${this.serviceUrl}/export-template/${rewardType}`;
    return this.getRequest(url, { responseType: 'blob' });
  }

  public downloadTemplateImport1(rewardProposeId: number): Observable<any> {
    const url = `${this.serviceUrl}/export-reward-propose-object/${rewardProposeId}`;
    return this.getRequest(url, { responseType: 'blob' });
  }
  public processImport(data): Observable<any> {
    const url = `${this.serviceUrl}/import`; 
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }
  public processImportSelection(data): Observable<any> {
    const url = `${this.serviceUrl}/import-reward-propose`; 
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }

  public exportRewardPropose(data): Observable<any> {
    const url = `${this.serviceUrl}/export`
    return this.getRequest(url, { params: data, responseType: 'blob' })
  }

  public exportRewardProposeApproval(data): Observable<any> {
    const url = `${this.serviceUrl}/export-propose-approval`
    return this.getRequest(url, { params: data, responseType: 'blob' })
  }

   /**
  * Update trang thai nhieu ban ghi
  * updateStatusList
  */
  public updateStatusList(data: any): Observable<any> {
    const url = `${this.serviceUrl}/update-list-status`;
    return this.postRequest(url, data);
  }
  /**
   * actionSignVoffice
   * @param rewardProposeId 
   * @returns 
   */
  public actionSignVoffice(rewardProposeId: number): Observable<any> {
    const url = `${this.serviceUrl}/gen-file-sign-voffice/${rewardProposeId}`
    return this.getRequest(url)
  }
  //export file phụ lục
  public exportSignVofficeObject(rewardProposeId: number): Observable<any> {
    const url = `${this.serviceUrl}/export-file-sign-voffice/${rewardProposeId}`
    return this.getRequest(url, {responseType: 'blob'})
  }
  //export file danh sách khen thưởng chi tiết
  public actionExportRewardProposeObject(rewardProposeId: number): Observable<any> {
    const url = `${this.serviceUrl}/action-export-reward-propose-object/${rewardProposeId}`;
    return this.getRequest(url, { responseType: 'blob' });
  }
      /**
   * Check hủy xét chọn
   * getRewardGeneralList
   */
       public checkUpdateStatus(data: any): Observable<any> {
        const dataToSave = CommonUtils.convertFormFile(data);
        const url = `${this.serviceUrl}/check-update-status`;
        return this.postRequest(url, dataToSave);
      }

      /**
   * Get list lĩnh vực khen thưởng theo quyền user
   * getRewardTypeList
   */
  public getRewardTypeList(): Observable<any> {
    const url = `${this.serviceUrl}/find-reward-type-list`;
    return this.getRequest(url);
  }

    /**
     * Get list lĩnh vực khen thưởng cho đăng ký thi đua
     * getRewardTypeList
     */
    public getRewardTypeListForCompetition(): Observable<any> {
        const url = `${this.serviceUrl}/competition-find-reward-type-list`;
        return this.getRequest(url);
    }

      /**
   * Get list lĩnh vực khen thưởng theo quyền user để insert 
   * getRewardTypeList
   */
  public getRewardTypeListToInsert(): Observable<any> {
    const url = `${this.serviceUrl}/find-reward-type-list-to-insert`;
    return this.getRequest(url);
  }
      /**
   * Get list lĩnh vực khen thưởng theo quyền user để insert 
   * getRewardTypeList
   */
  public getRewardTypeListToApproval(): Observable<any> {
    const url = `${this.serviceUrl}/find-reward-type-list-to-approval`;
    return this.getRequest(url);
  }

  /**
   * Ủy quyền
   * getRewardGeneralList
   */
   public updateAuthority(data: any): Observable<any> {
    const dataToSave = CommonUtils.convertFormFile(data);
    const url = `${this.serviceUrl}/update-authority`;
    return this.postRequest(url, dataToSave);
  }
}
