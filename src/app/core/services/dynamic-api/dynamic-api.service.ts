import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class DynamicApiService extends BasicService {


  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'dynamic-api', httpClient, helperService);
  }

  public getByCode(apiCode, param?) : Observable<any>{
      const url = `${this.serviceUrl}/` + apiCode;
      let paramApi = param ? param : {};
      return this.postRequest(url,paramApi);
  }

  public getByCodeNotDisplayLoading(apiCode, param?) : Observable<any>{
    const url = `${this.serviceUrl}/` + apiCode;
    let paramApi = param ? param : {};
    return this.postRequest(url,paramApi, true);
}


}
