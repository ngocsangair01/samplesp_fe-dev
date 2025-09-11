import { Observable } from 'rxjs/Observable';
import {CommonUtils, CryptoService} from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralStandardPositionGroupService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'generalStandardPositionGroup', httpClient, helperService);
  }

  public findByCategoryId(id: number): Observable<any> {
    const url = `${this.serviceUrl}/by-category-id/${id}`;
    return this.getRequest(url);
    }

    public searchgenaralStandard(data?: any, event?: any): Observable<any> {
      if (!event) {
        this.credentials = Object.assign({}, data);
      }
  
      const searchData = CommonUtils.convertData(this.credentials);
      if (event) {
        searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
      }
      const buildParams = CommonUtils.buildParams(searchData);
      const url = `${this.serviceUrl}/search-genaral-standard?`;
      return this.getRequest(url, {params: buildParams});
    }
}
