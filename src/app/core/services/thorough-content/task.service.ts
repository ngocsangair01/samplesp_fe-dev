import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'task', httpClient, helperService);
  }

  search(data, event?) : Observable<any>{
    let param = {...data};
    const url = `${this.serviceUrl}/search?`;
    param.typeThorough = param.typeThorough ? param.typeThorough.id : '';
    param.status = param.status ? param.status.map(item => item.id).join(', ') : '';
    param.issueLevel = param.issueLevel ? param.issueLevel.id : '';
    param.type = param.type ? param.type.id : '';
    param.priority = param.priority ? param.priority.map(item => item.id).join(', ') : '';
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

  public clone(TaskId: number) {
    const url = `${this.serviceUrl}/clone/${TaskId}`;
    return this.getRequest(url);
  }

  public thoroughFormFile(item: any): Observable<any> {
    const formdata = CommonUtils.convertFormFile(item);
    const url = `${this.serviceUrl}/thorough`;
    return this.postRequest(url, formdata);
  }

  getChildOrganziation(parentId, TaskId) : Observable<any>{
    const url = `${this.serviceUrl}/get-child-organization/${parentId}/${TaskId}`;
    return this.getRequest(url);
  }

  public getBranchList() {
    const url = `${this.serviceUrl}/get-branch-list`;
    return this.getRequest(url);
  }

  saveOrUpdateV2(data) : Observable<any>{
    let param = {...data};
    const url = `${this.serviceUrl}`;
    // const url = `${this.serviceUrl}/search?`;
    // param.status = param.status ? param.status.id : '';
    return this.postRequest(url, this.convertFormFile(param));
  }

  saveUpdateProgress(data) : Observable<any>{
    let param = {...data};
    const url = `${this.serviceUrl}/update-progress`;
    // const url = `${this.serviceUrl}/search?`;
    // param.status = param.status ? param.status.id : '';
    return this.postRequest(url,CommonUtils.convertData(param));
  }

  public findProgress(id: number): Observable<any> {
    const url = `${this.serviceUrl}/update-progress/${id}`;
    return this.getRequest(url);
  }

  /**
   * convert To FormData mutilpart request post
   */
   public convertFormFile(dataPost: any): FormData {
    const filteredData = CommonUtils.convertData(dataPost);
    const formData = this.objectToFormData(filteredData, '', []);
    return formData;
  }

  /**
   * objectToFormData
   */
   public objectToFormData(obj, rootName, ignoreList): FormData {
    const formData = new FormData();
    function appendFormData(data, root) {
      if (!ignore(root)) {
        root = root || '';
        if (data instanceof File) {
            formData.append(root, data); 
        } else if (Array.isArray(data)) {
          let index = 0;
          for (let i = 0; i < data.length; i++) {
            if (data[i] instanceof File) {
                appendFormData(data[i], root + '[' + index + ']');
                index++;
            } else {
              appendFormData(data[i], root + '[' + i + ']');
            }
          }
        } else if (data && typeof data === 'object') {
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              if (root === '') {
                appendFormData(data[key], key);
              } else {
                appendFormData(data[key], root + '.' + key);
              }
            }
          }
        } else {
          if (data !== null && typeof data !== 'undefined') {
            formData.append(root, data);
          }
        }
      }
    }

    function ignore(root) {
      return Array.isArray(ignoreList) && ignoreList.some(function (x) { return x === root; });
    }

    appendFormData(obj, rootName);
    return formData;
  }

}
