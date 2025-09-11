import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class CatAllowanceService extends BasicService {


  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'cat-allowance', httpClient, helperService);
  }

  search(data, event?) : Observable<any>{
    const url = `${this.serviceUrl}/search?`;
    if (event){
      // data._search = event;
      data._search = CryptoService.encrAesEcb(JSON.stringify(event));
    }
    return this.getRequest(url,{params: CommonUtils.buildParams(data)})
  }

}
