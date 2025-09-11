import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonUtils } from "@app/shared/services";
import { HelperService } from "@app/shared/services/helper.service";
import { Observable } from "rxjs";
import { BasicService } from "../basic.service"

@Injectable({
    providedIn: 'root'
})
export class FundManagementService extends BasicService {
    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'fundManagement', httpClient, helperService);
    }
    /**
     * Hàm tìm kiếm theo FundManagementID
     * @param data 
     * @returns 
     */
    public findOneFundManagement(data: any): Observable<any> {
        const buildParams = CommonUtils.buildParams(data);
        const url = `${this.serviceUrl}/find-one?`;
        return this.getRequest(url, { params: buildParams });
    }

    /**
     * Hàm lấy các loại quỹ
     * @returns 
     */
    public getAllFundType(): Observable<any> {
        const url = `${this.serviceUrl}/getAllType`;
        return this.getRequest(url);
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
    * Hàm tìm kiếm theo FundManagementID
    * @param data 
    * @returns 
    */
    public findHistoryfund(data: any): Observable<any> {
        const buildParams = CommonUtils.buildParams(data);
        const url = `${this.serviceUrl}/find-history-fund?`;
        return this.getRequest(url, { params: buildParams });
    }
}