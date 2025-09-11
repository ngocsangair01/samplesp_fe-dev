import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
    providedIn: 'root'
})
export class RewardCategoryFunding extends BasicService {
    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'rewardCategoryFunding', httpClient, helperService);
    }

    public getListRewardCategoryFunding(): Observable<any> {
        const url = `${this.serviceUrl}/get-all-active?`;
        return this.getRequest(url);
    }
}
