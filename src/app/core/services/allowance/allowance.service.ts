import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class AllowanceService extends BasicService {


  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'emp-allowance', httpClient, helperService);
  }

  search(data, event?) : Observable<any>{
    const url = `${this.serviceUrl}/search?`;
    if (event){
      data._search = CryptoService.encrAesEcb(JSON.stringify(event));
    }
    return this.getRequest(url,{params: CommonUtils.buildParams(data)})
  }

  downloadTemplate() : Observable<any>{
    const url = `${this.serviceUrl}/import/template`;
    return this.getRequest(url, {responseType: 'blob'})
  }

  downloadErrorFile(fileName) : Observable<any>{
    const url = `${this.serviceUrl}/import/error/${fileName}`;
    return this.getRequest(url, {responseType: 'blob'})
  }

  import(data): Observable<any>{
    let formData = new FormData()
    formData.append("catAllowanceId", data.catAllowanceId)
    formData.append("file", data.file)
    const url = `${this.serviceUrl}/import`;
    return this.postRequest(url, formData);
  }

}
