import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BasicService } from './basic.service';
import { Observable } from 'rxjs';
import { HelperService } from '@app/shared/services/helper.service';
import {CommonUtils, CryptoService} from "@app/shared/services";

@Injectable({
  providedIn: 'root'
})
export class DataPickerService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'dataPicker', httpClient, helperService);
  }
  /**
   * action load org tree
   */
  public actionInitAjax(nationId: number, params: any): Observable<any> {
    const url = `${this.serviceUrl}/${nationId}/action-init-ajax`;
    return this.postRequest(url, params);
  }
  /**
   * findOne
   * param id
   */
  public findByNationId(nationId: number, id: number, params: any): Observable<any> {
    const url = `${this.serviceUrl}/${nationId}/${id}`;
    return this.postRequest(url, params);
  }

  public findByListId(params: any, listId: any): Observable<any> {
    return this.postRequest(`${this.serviceUrl}/find-by-list-id`, { params: params, listId: listId });
  }

  public searchThoroughContent(data?: any, event?: any): Observable<any> {
    if (!event) {
      this.credentials = Object.assign({}, data);
    }

    const searchData = CommonUtils.convertData(this.credentials);

    if (event) {
      // console.log(JSON.stringify(event), CryptoService.encrAesEcb(event))
      searchData._search = CryptoService.encrAesEcb(JSON.stringify(event));
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/search-thorough-content?`;
    return this.getRequest(url, {params: buildParams});
  }

}
