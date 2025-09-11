import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {CommonUtils, CryptoService} from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class PartyAdmissionService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'partyCandidate', httpClient, helperService);
  }
  /**
    * tim du lieu theo form
    * @param data
    * @param event
    * @returns
    */
  public processSearch(data?: any, event?: any): Observable<any> {
    const searchData = CommonUtils.convertData(Object.assign({}, data));
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/search?`;
    return this.getRequest(url, { params: buildParams });
  }
  /**
    * tim du lieu theo form
    * @param listRewardProposeId
    * @returns
    */
   public getDatatablesConfirmed(data?: any, event?: any): Observable<any> {
    const searchData = CommonUtils.convertData(Object.assign({}, data));
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    if (searchData.ignoreList && searchData.ignoreList.length > 0) {
      searchData.ignoreList = searchData.ignoreList.join(', ');
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/search-list-confirmed`;
    return this.getRequest(url, { params: buildParams } );
  }


  public downloadTemplateImport(): Observable<any> {
    const url = `${this.serviceUrl}/export-template`;
    return this.getRequest(url, { responseType: 'blob' });
  }

  public processImport(data): Observable<any> {
    const url = `${this.serviceUrl}/import`; 
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }

}
