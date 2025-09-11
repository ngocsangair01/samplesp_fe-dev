import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {CommonUtils, CryptoService} from "@app/shared/services";
import { HelperService } from "@app/shared/services/helper.service";
import { Observable } from "rxjs";
import { BasicService } from "../basic.service"

@Injectable({
    providedIn: 'root'
})
export class FundActivityService extends BasicService {
    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'fundActivity', httpClient, helperService);
    }
    /**
     * Hàm tìm kiếm theo FundActivityID
     * @param data 
     * @returns 
     */
    public findOneFundActivity(data: any): Observable<any> {
        const buildParams = CommonUtils.buildParams(data);
        const url = `${this.serviceUrl}/find-one?`;
        return this.getRequest(url, { params: buildParams });
    }
    /**
     * Hàm tìm kiếm Organization theo FundManagementID
     * @param data 
     * @returns 
     */
    public findOneByTypeAndOrganization(data: any): Observable<any> {
        const buildParams = CommonUtils.buildParams(data);
        const url = `${this.serviceUrl}/find-fund-management-name?`;
        return this.getRequest(url, { params: buildParams });
    }
    /**
     * Hàm lấy các loại quỹ
     * @returns 
     */
    public getActivityCategoryByType(data: any): Observable<any> {
        const buildParams = CommonUtils.buildParams(data);
        const url = `${this.serviceUrl}/getCategoryByType?`;
        return this.getRequest(url, { params: buildParams });
    }
    /**
     * Hàm xuất dữ liệu
     * @param data 
     * @returns 
     */
    public export(data): Observable<any> {
        const url = `${this.serviceUrl}/export`;
        return this.getRequest(url, { params: data, responseType: 'blob' });
    }

    /**
     * Hàm tìm kiếm lịch sử hoạt động
     * @param data 
     * @param event 
     */
    public searchHistory(data?: any, event?: any): Observable<any> {
        if (!event) {
            this.credentials = Object.assign({}, data);
        }

        const searchData = CommonUtils.convertData(this.credentials);
        if (event) {
            searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
        }
        const buildParams = CommonUtils.buildParams(searchData);
        const url = `${this.serviceUrl}/search-history?`;
        return this.getRequest(url, { params: buildParams });
    }
    /**
     * Hàm tìm kiếm Organization theo FundManagementID
     * @param data 
     * @returns 
     */
     public findTotalRemainingMoney(data: any): Observable<any> {
        const buildParams = CommonUtils.buildParams(data);
        const url = `${this.serviceUrl}/find-total-remaining-money?`;
        return this.getRequest(url, { params: buildParams });
    }
}
