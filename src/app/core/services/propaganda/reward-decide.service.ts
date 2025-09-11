import { Observable } from 'rxjs/Observable';
import { HelperService } from '@app/shared/services/helper.service';
import { HttpClient } from '@angular/common/http';
import { BasicService } from '@app/core/services/basic.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RewardDecideService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'rewarDecide', httpClient, helperService);
  }
  public getRewardProposalList(params: any) : Observable<any> {
    const url = `${this.serviceUrl}/get-list-reward-proposal`;
    return this.getRequest(url, {params: params});
  }
  public findRewardTableByProgandaRewardId(event ?: any) : Observable<any> {
    const url = `${this.serviceUrl}/get-rewards-list`;
    return this.getRequest(url, {params: event});
  }
  public export(data):Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, {params: data, responseType : 'blob'});
  }
}
