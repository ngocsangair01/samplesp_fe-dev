import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonUtils } from "@app/shared/services";
import { HelperService } from "@app/shared/services/helper.service";
import { Observable } from "rxjs";
import { BasicService } from "../basic.service"

@Injectable({
    providedIn: 'root'
})
export class FundContributionService extends BasicService {
    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'fundContribution', httpClient, helperService);
    }
    public findOneFundContribution(data: any): Observable<any> {
        const buildParams = CommonUtils.buildParams(data);
        const url = `${this.serviceUrl}/find-one?`;
        return this.getRequest(url, { params: buildParams });
    }
    public getAllFundContribution(): Observable<any> {
        const url = `${this.serviceUrl}/getAllContribution`;
        return this.getRequest(url);
    }
    /**
    * Hàm xuat exe
    * @returns 
    */
    public export(data): Observable<any> {
        const url = `${this.serviceUrl}/export`;
        return this.getRequest(url, { params: data, responseType: 'blob' });
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
   * Tổng số lượng nộp tiền
   * @returns 
   */
     public countMember(employeeId: number): Observable<any> {
        const url = `${this.serviceUrl}/totalMember/${employeeId}`;
        return this.getRequest(url);
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
}