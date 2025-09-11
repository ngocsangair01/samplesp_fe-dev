import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class RewardGeneralService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'rewardGeneral', httpClient, helperService);
  }
  /**
   * Lay danh khen thuong chung
   * getRewardGeneralList
   */
  public getRewardGeneralList(): Observable<any> {
    const url = `${this.serviceUrl}/reward-general-list`;
    return this.getRequest(url);
  }

  /**
   * Lay danh khen thuong chung theo loai khen thuong, 1: khen thuong ca nhan, 2: khen thuong tap the
   * getRewardGeneralList
   */
  public getRewardGeneralListByRewardType(): Observable<any> {
    const url = `${this.serviceUrl}/reward-general-list`;
    return this.getRequest(url);
  }
  /**
   * Them moi
   * getRewardGeneralList
   */
  public saveRewardGeneral(data: any): Observable<any> {
    const url = `${this.serviceUrl}`;
    return this.postRequest(url, CommonUtils.convertData(data));
  }
  /**
   * Them moi
   * getRewardGeneralList
   */
  public saveAll(lstData: any): Observable<any> {
    const dataToSave = CommonUtils.convertFormFile(lstData);
    const url = `${this.serviceUrl}/update-list-reward`;
    return this.postRequest(url, dataToSave);
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

  public processSearch3(data?: any, event?: any): Observable<any> {
    const searchData = CommonUtils.convertData(Object.assign({}, data));
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/search3?`;
    return this.getRequest(url, { params: buildParams });
  }

  /**
   * find by id
   * param id
   */
  public findById(id: number): Observable<any> {
    const url = `${this.serviceUrl}/${id}`;
    return this.getRequest(url);
  }

  public findByIdWithAttachedFile(id: number): Observable<any> {
    const url = `${this.serviceUrl}/find-by-id-attached-files/${id}`;
    return this.getRequest(url);
  }

  public exportRewardGeneral(data: any): Observable<any> {
    const url = `${this.serviceUrl}/export-reward-general`;
    return this.getRequest(url, { params: data, responseType: 'blob' });
  }

  /**
  * download template
  * param rewardObjectType
  */
  public downloadTemplateImport(rewardObjectType: number, rewardType: number, isInside: number): Observable<any> {
    const url = `${this.serviceUrl}/export-template/${rewardObjectType}/${rewardType}/${isInside}`;
    return this.getRequest(url, { responseType: 'blob' });
  }

  public processImport(data): Observable<any> {
    const url = `${this.serviceUrl}/import`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }

    /**
   * tim du lieu theo form
   * @param data 
   * @param event 
   * @returns 
   */
     public processSearch2(data?: any, event?: any): Observable<any> {
      const searchData = CommonUtils.convertData(Object.assign({}, data));
      if (event) {
        searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
      }
      const buildParams = CommonUtils.buildParams(searchData);
      const url = `${this.serviceUrl}/search2?`;
      return this.getRequest(url, { params: buildParams });
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
   * export file bang khen
   * @param data 
   * @param event 
   * @returns 
   */
  public exportFilePersonalReward(data?: any, event?: any): Observable<any> {
    const searchData = CommonUtils.convertData(Object.assign({}, data));
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/export-file-merit-reward-general?`;
    return this.getRequest(url, { params: buildParams,  responseType: 'blob' });
  }
  /**
   * export file bằng khen ko có con dấu
   * * @param data 
   */
   public exportFilePersonalRewardNoStamp(data?: any, event?: any): Observable<any> {
    const searchData = CommonUtils.convertData(Object.assign({}, data));
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/export-file-merit-reward-general-no-stamp?`;
    return this.getRequest(url, { params: buildParams,  responseType: 'blob' });
  }
}
