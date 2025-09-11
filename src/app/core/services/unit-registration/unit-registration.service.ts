import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class UnitRegistrationService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'competition', httpClient, helperService);
  }

  /**
   * get all danh hieu
   * @param username
   */
  public getTitles(param?: any): Observable<any> {
    const url = `${this.serviceUrl}/title-name-and-code`;
    return this.getRequest(url, {params: param});
  }

  public getDetail(param: any): Observable<any> {
    const url = `${this.serviceUrl}`;
    return this.getRequest(url, {params: param});
  }

  public getDetailEmployee(): Observable<any> {
    const url = `${this.serviceUrl}/get-employee-detail`;
    return this.getRequest(url);
  }

  public findOne(id: number): Observable<any> {
    const url = `${this.serviceUrl}/?${id}`;
    return super.getRequest(url);
  }

  public saveRegistration(body: any): Observable<any> {
    const url = `${this.serviceUrl}/registration-unit`;
    return this.postRequest(url, body);
  }

  public getDetailCompetitionProgram(data: any): Observable<any> {
    const url = `${this.serviceUrl}/competition-program`;
    return this.getRequest(url, {params: data});
  }

  public getUserOrganization(): Observable<any> {
    const url = `${this.serviceUrl}/get-user-organization`;
    return this.getRequest(url);
  }

  /**
   * get danh hieu
   * @param data Ma CTTD
   */
  public getTitle(param: any): Observable<any> {
    const url = `${this.serviceUrl}/emulation-title-id-and-name`;
    return this.getRequest(url, {params: param});
  }

  public getTitleObjectId(param: any): Observable<any> {
    const url = `${this.serviceUrl}/validate-reward-category`;
    return this.getRequest(url, {params: param});
  }

  /**
   * get all hinh thuc khen thuong
   * @param username
   */
  public geRewards(param?: any): Observable<any> {
    const url = `${this.serviceUrl}/all-reward-category-id-and-name`;
    return this.getRequest(url, {params: param});
  }

  /**
   * get hinh thuc khen thuong
   * @param data Ma CTTD
   */
  public getListReward(param: any): Observable<any> {
    const url = `${this.serviceUrl}/reward-category-id-and-name`;
    return this.getRequest(url, {params: param});
  }

  /**
   * Thay d?i tr?ng th�i c�c b?n ghi du?c dang k� l?i khi ? tr?ng th�i Reject
   * @param param
   */
  public updateCompetitionRegistrationStatus(param: any): Observable<any>{
    const url = `${this.serviceUrl}/update-competition-registration-status`;
    return this.postRequest(url, CommonUtils.convertData(param), true, true);
  }

  /**
   * CHECK �� �ANG K� L?I SAU KHI ��NG POPUP
   * @param param
   */
  public checkRegister(param: any): Observable<any> {
    const url = `${this.serviceUrl}/check/register`;
    return this.getRequest(url, {params: param});
  }

  /**
   * download template biểu mẫu import
   */
  public downloadTemplateImport(data): Observable<any> {
    const url = `${this.serviceUrl}/export-template`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }

  /**
   * import dữ liệu
   */
  public processImport(data): Observable<any> {
    const url = `${this.serviceUrl}/import`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }

  public processSearchSign(data: any): Observable<any> {
    const url = `${this.serviceUrl}/sign-fast`;
    return this.postRequest(url, data);
  }
}
