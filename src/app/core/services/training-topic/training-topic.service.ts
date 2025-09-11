import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import {CommonUtils, CryptoService} from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class TrainingTopicService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'training-topic', httpClient, helperService);
  }

  search(data, event?) : Observable<any>{
    let param = {...data};
    const url = `${this.serviceUrl}/search?`;
    // param.typeThorough = param.typeThorough ? param.typeThorough.id : '';
    param.status = param.status ? param.status.toString() : '';
    param.objectTypeTraining = param.objectTypeTraining ? param.objectTypeTraining.toString() : '';
    // param.issueLevel = param.issueLevel ? param.issueLevel.id : '';
    if (event){
      param._search = CryptoService.encrAesEcb(JSON.stringify(event));
    }
    return this.getRequest(url,{params: CommonUtils.buildParams(param)})
  }

  searchListTrainingClass(data, event?) {
    let param = {...data};
    const url = `${this.serviceUrl}/search-training-class`;
    // param.typeThorough = param.typeThorough ? param.typeThorough.id : '';
    // param.issueLevel = param.issueLevel ? param.issueLevel.id : '';
    if (event){
      param._search = CryptoService.encrAesEcb(JSON.stringify(event));
    }
    return this.getRequest(url,{params: CommonUtils.buildParams(param)})
  }

  findListTrainingClassByTrainingTopic(trainingTopicId: number) {
    const url = `${this.serviceUrl}/import-result/${trainingTopicId}`;
    return this.getRequest(url);
  }

  searchProcess(data, event?) : Observable<any>{
    let param = {...data};
    const url = `${this.serviceUrl}/search-process?`;
    if (event){
      param._search = CryptoService.encrAesEcb(JSON.stringify(event));
    }
    return this.getRequest(url,{params: CommonUtils.buildParams(param)})
  }

  public clone(trainingTopicId: number) {
    const url = `${this.serviceUrl}/clone/${trainingTopicId}`;
    return this.getRequest(url);
  }

  public submitToApprove(trainingTopicId: number) {
    const url = `${this.serviceUrl}/submitToApprove/${trainingTopicId}`;
    return this.getRequest(url);
  }
  public submitToThorough(trainingTopicId: number) {
    const url = `${this.serviceUrl}/thorough/${trainingTopicId}`;
    return this.getRequest(url);
  }

  getChildOrganziation(parentId, thoroughContentId) : Observable<any>{
    const url = `${this.serviceUrl}/get-child-organization/${parentId}/${thoroughContentId}`;
    return this.getRequest(url);
  }


  public getThoroughLevelByPermission() {
    const url = `${this.serviceUrl}/get-organization-by-permission`;
    return this.getRequest(url);
  }

  public downloadTemplateImport(): Observable<any> {
    const url = `${this.serviceUrl}/export-template`;
    return this.getRequest(url, { responseType: 'blob' });
  }

  public downloadTemplateResultImport(): Observable<any> {
    const url = `${this.serviceUrl}/export-result-template`;
    return this.getRequest(url, { responseType: 'blob' });
  }

  public exportFormClassImport(data): Observable<any> {
    const url = `${this.serviceUrl}/export-form-class-import`;
    return this.getRequest(url, {params: data, responseType:'blob'});
  }

  public processImport(data): Observable<any> {
    const url = `${this.serviceUrl}/import`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }

  public processImportResult(data): Observable<any> {
    const url = `${this.serviceUrl}/import-result`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }

  public findInfoToCreateTrainingClass(id) {
    const url = `${this.serviceUrl}/create-training-class/${id}`;
    return this.getRequest(url);
  }

  public saveOrUpdateTrainingClassForm(item: any): Observable<any> {
    const formdata = CommonUtils.convertFormFile(item);
    const url = `${this.serviceUrl}/training-class`;
    return this.postRequest(url, formdata);
  }

  public saveOrUpdateTrainingClasMember(item: any): Observable<any> {
    const formdata = CommonUtils.convertFormFile(item);
    const url = `${this.serviceUrl}/training-class-member`;
    return this.postRequest(url, formdata);
  }

  public saveOrUpdateImportFormFile(item: any): Observable<any> {
    const formdata = CommonUtils.convertFormFile(item);
    const url = `${this.serviceUrl}/save-import-result`;
    return this.postRequest(url, formdata);
  }

  public findImportByTargetThorough(data): Observable<any> {
    const url = `${this.serviceUrl}/find-import-by-target-thorough`;
    const formdata = CommonUtils.convertFormFile(data);
    return this.postRequest(url, formdata);
  }

  public deleteTrainingClassId(id) : Observable<any> {
    const url = `${this.serviceUrl}/delete-by-training-class-id/${id}`;
    this.helperService.isProcessing(true);
    return this.deleteRequest(url);
  }

  public findByTrainingClassId(id) {
    const url = `${this.serviceUrl}/training-class/${id}`;
    return this.getRequest(url);
  }
}
