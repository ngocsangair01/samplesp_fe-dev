import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class ThoroughContentService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'thorough-content', httpClient, helperService);
  }

  search(data, event?) : Observable<any>{
    let param = {...data};
    const url = `${this.serviceUrl}/search?`;
    param.typeThorough = param.typeThorough ? param.typeThorough.id : '';
    param.status = param.status ? param.status.id : '';
    param.issueLevel = param.issueLevel ? param.issueLevel.id : '';
    if (event){
      param._search = CryptoService.encrAesEcb(JSON.stringify(event));
    }
    return this.getRequest(url,{params: CommonUtils.buildParams(param)})
  }

  searchProcess(data, event?) : Observable<any>{
    let param = {...data};
    const url = `${this.serviceUrl}/search-process?`;
    if (event){
      param._search = CryptoService.encrAesEcb(JSON.stringify(event));
    }
    return this.getRequest(url,{params: CommonUtils.buildParams(param)})
  }

  public clone(thoroughContentId: number) {
    const url = `${this.serviceUrl}/clone/${thoroughContentId}`;
    return this.getRequest(url);
  }

  public thoroughFormFile(item: any): Observable<any> {
    const formdata = CommonUtils.convertFormFile(item);
    const url = `${this.serviceUrl}/thorough`;
    return this.postRequest(url, formdata);
  }
  public submitToApprove(thoroughContentId: number) {
    const url = `${this.serviceUrl}/submitToApprove/${thoroughContentId}`;
    return this.getRequest(url);
  }
  public submitToThorough(thoroughContentId: number) {
    const url = `${this.serviceUrl}/thorough/${thoroughContentId}`;
    return this.getRequest(url);
  }

  getChildOrganziation(parentId, thoroughContentId) : Observable<any>{
    const url = `${this.serviceUrl}/get-child-organization/${parentId}/${thoroughContentId}`;
    return this.getRequest(url);
  }

  previewInfo( thoroughContentId) : Observable<any>{
    const url = `${this.serviceUrl}/preview/${thoroughContentId}`;
    return this.getRequest(url);
  }

  public getBranchList() {
    const url = `${this.serviceUrl}/get-branch-list`;
    return this.getRequest(url);
  }


  public getAudioFullContent(thoroughContentId) : Observable<any>{
    const url = `${this.serviceUrl}/get-audio-full-content/${thoroughContentId}`;
    return this.getRequest(url,{responseType: 'blob'});
  }

  public getAudioSumContent(thoroughContentId) : Observable<any>{
    const url = `${this.serviceUrl}/get-audio-sum-content/${thoroughContentId}`;
    return this.getRequest(url, {responseType: 'blob'});
  }
}
