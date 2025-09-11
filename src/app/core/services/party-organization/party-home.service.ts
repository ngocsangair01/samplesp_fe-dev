import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {CommonUtils, CryptoService} from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class PartyHomeService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'partyHome', httpClient, helperService);
  }

  /**
   * Lấy danh sách nghị quyết lãnh đạo
   * @param event 
   */
  public getListResponseResolution(event?: any): Observable<any> {
    if (!event) {
      this.credentials = Object.assign({}, {});
    }
    const searchData = CommonUtils.convertData(this.credentials);
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/response-resolution`;
    return this.getRequest(url, { params: buildParams });
  }

  /**
   * Service lấy thông tin biến động Đảng viên
   * @param formSearch 
   */
  public getInfoPartyMemberVolatility(formSearch: any): Observable<any> {
    const url = `${this.serviceUrl}/get-info-party-volatility`;
    return this.getRequest(url, {params: formSearch});
  }

  /**
   * Service lấy thông tin thống kê diện đối tượng đảng viên
   * @param formSearch 
   */
  public getInfoPartyMemberContract(formSearch: any): Observable<any> {
    const url = `${this.serviceUrl}/get-info-party-contract`;
    return this.getRequest(url, {params: formSearch});
  }

  /**
   * hàm gọi api xuất báo cáo biến động Đảng viên
   * @param formSearch 
   */
  public exportPartyMemberVolatility(formSearch: any): Observable<any> {
    const url = `${this.serviceUrl}/export-party-member-volatility`;
    return this.getRequest(url,{params: formSearch, responseType: 'blob'});
  }
  
  /**
   * hàm gọi api xuất báo cáo biến động Đảng viên
   * @param formSearch 
   */
   public exportPartyMemberAmount(formSearch: any): Observable<any> {
    const url = `${this.serviceUrl}/export-party-member-amount`;
    return this.getRequest(url,{params: formSearch, responseType: 'blob'});
  }

  /**
   * hàm gọi api xuất báo cáo biến động diện đối tượng
   * @param formSearch 
   */
  public exportPartyMemberEmpType(formSearch: any): Observable<any> {
    const url = `${this.serviceUrl}/export-party-member-emp-type`;
    return this.getRequest(url,{params: formSearch, responseType: 'blob'});
  }

  /**
   * Lấy tổng số nhân viên
   * @param formSearch 
   */
  public getPartyMemberTotal(formSearch: any): Observable<any> {
    const url = `${this.serviceUrl}/get-party-member-total`;
    return this.getRequest(url, {params: formSearch});
  }

  /**
   * Lấy tổng số member
   * @param formSearch 
   */
  public getPartyNewMember(formSearch: any): Observable<any> {
    const url = `${this.serviceUrl}/get-party-new-member`;
    return this.getRequest(url, {params: formSearch});
  }
  
  /**
   * Hàm lấy số lượng Đảng viên
   * @param formSearch 
   */
  public getPartyMemberAmount(formSearch: any): Observable<any> {
    const url = `${this.serviceUrl}/get-party-member-amount`;
    return this.getRequest(url, {params: formSearch});
  }
  /**
   * Service lấy thông tin cơ cấu nhân sự
   * @param formSearch 
   */
  public getInfoPartyMemberStructure(formSearch: any): Observable<any> {
    const url = `${this.serviceUrl}/get-party-member-structure`;
    return this.getRequest(url, {params: formSearch});
  }

  /**
   * Service xuất báo cáo cơ cấu Đảng viên
   * @param formSearch 
   */
  public exportPartyMemberStructure(formSearch: any): Observable<any> {
    const url = `${this.serviceUrl}/export-party-member-structure`;
    return this.getRequest(url,{params: formSearch, responseType: 'blob'});
  }

  /**
   * Lấy số lượng Đảng viên tăng
   * @param formSearch 
   */
  public getPartyIncreaseMember(formSearch: any): Observable<any> {
    const url = `${this.serviceUrl}/get-party-increase-member`;
    return this.getRequest(url, {params: formSearch});
  }

  /**
   * Lấy số lượng Đảng viên giảm
   * @param formSearch 
   */
  public getPartyDecreaseMember(formSearch: any): Observable<any> {
    const url = `${this.serviceUrl}/get-party-decrease-member`;
    return this.getRequest(url, {params: formSearch});
  }
  
}
