import { Observable } from 'rxjs/Observable';
import { CommonUtils } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { CryptoService } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class SettingVersionService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'settingVersCtrl', httpClient, helperService);
  }

  // search(data, event?) : Observable<any>{
  //   const url = `${this.serviceUrl}/search`;
  //   if (event){
  //     // data._search = event;
  //     data._search = CryptoService.encrAesEcb(JSON.stringify(event));
  //   }
  //   return this.getRequest(url,CommonUtils.convertData(data))
  // }
}
