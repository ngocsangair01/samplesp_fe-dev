import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonUtils } from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class SubsidizedBeneficiaryService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'subsidizedBeneficiary', httpClient, helperService);
  }

  /**
  * Them moi
  * getRewardGeneralList
  */
  public syncResult(data: any): Observable<any> {
    const dataToSave = CommonUtils.convertFormFile(data);
    const url = `${this.serviceUrl}/sync-result`;
    return this.postRequest(url, dataToSave);
  }
}

