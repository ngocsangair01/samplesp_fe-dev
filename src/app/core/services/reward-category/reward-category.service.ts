import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class RewardCategoryService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'rewardCategory', httpClient, helperService);
  }

  public findById(rewardCategoryId: any): Observable<any> {
    const url = `${this.serviceUrl}/${rewardCategoryId}`;
    return this.getRequest(url);
  }

  public getListByRewardType(rewardType: any): Observable<any> {
    const url = `${this.serviceUrl}/rewardType/${rewardType}`;
    return this.getRequest(url);
  }

  public getListByRewardCategoryType(categoryType: any): Observable<any> {
    const url = `${this.serviceUrl}/categoryType/${categoryType}`;
    return this.getRequest(url);
  }

  public getLevelSelectBox(rewardCategoryType: any, rewardType: any): Observable<any> {
    const url = `${this.serviceUrl}/find-by-criteria/${rewardCategoryType}/${rewardType}`;
    return this.getRequest(url);
  }

  public getLinkedSelectBoxReward(rewardCategoryType: any, rewardObjectType: any, rewardType: any): Observable<any> {
    const url = `${this.serviceUrl}/find-by-criteria/${rewardCategoryType}/${rewardObjectType}/${rewardType}`;
    return this.getRequest(url);
  }

  public getListByRewardTypeAndRewardObjectType(rewardType: any, objectType: any): Observable<any> {
    const url = `${this.serviceUrl}/${rewardType}/${objectType}`;
    return this.getRequest(url);
  }

  public getListByRewardCategoryTypeRewardObjectTypeAndRewardType(
    rewardCategoryType: number,
    rewardObjectType: number,
    rewardType: number): Observable<any> {
    const url = `${this.serviceUrl}/find-by-criteria/${rewardCategoryType}/${rewardObjectType}/${rewardType}`;
    return this.getRequest(url);
  }


  public getListRewardCategory(data: any): Observable<any> {
    const buildParams = CommonUtils.buildParams(data);
    const url = `${this.serviceUrl}/find-reward-category-list?`;
    return this.getRequest(url, { params: buildParams });
  }

  public exportRewardCategory(data): Observable<any> {
    const url = `${this.serviceUrl}/export`
    return this.getRequest(url, { params: data, responseType: 'blob' })
  }
  public saveAll(lstData: any): Observable<any> {
    const dataToSave = CommonUtils.convertFormFile(lstData);
    const url = `${this.serviceUrl}`;
    return this.postRequest(url, dataToSave);
  }

}
