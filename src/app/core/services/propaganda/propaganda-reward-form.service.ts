import { BasicService } from '@app/core/services/basic.service';
import { HelperService } from '@app/shared/services/helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropagandaRewardFormService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'rewardForm', httpClient, helperService);
  }

  /**
   * Lấy danh sách hình thức khen thưởng còn hiệu lực
   */
  public getAllValidityPropagandaRewardForm(): Observable<any> {
    const url = `${this.serviceUrl}/get-all-validity`;
    return this.getRequest(url);
  }

  /**
   * Lấy ra toàn bộ danh sách hình thức khen thưởng
   */
  public getAllPropagandaRewardForm(): Observable<any> {
    const url = `${this.serviceUrl}/get-all`;
    return this.getRequest(url);
  }
  public export(data): Observable<any> {
    const url = `${this.serviceUrl}/export`;
    return this.getRequest(url, {params: data, responseType: 'blob'});
  }
}
