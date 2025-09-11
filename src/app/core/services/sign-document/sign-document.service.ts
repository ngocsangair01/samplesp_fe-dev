import { Observable } from 'rxjs/Observable';
import {CommonUtils, CryptoService} from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';

@Injectable({
  providedIn: 'root'
})
export class SignDocumentService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'sign-document', httpClient, helperService);
  }
  public findOneAndGetFile(item: any): Observable<any> {
    const url = `${this.serviceUrl}/sign-document-file`;
    return this.getRequest(url, { params: CommonUtils.convertData(item) });
  }

  public approval(item: any): Observable<any> {
    const formdata = CommonUtils.convertFormFile(item);
    const url = `${this.serviceUrl}/save`;
    return this.postRequest(url, formdata);
  }

  public findVofficeUser(employeeId: number): Observable<any> {
    return this.getRequest(this.serviceUrl + `/find-voffice-user/${employeeId}`);
  }
  public findVofficeSignature(employeeId: number): Observable<any> {
    return this.getRequest(this.serviceUrl + `/find-voffice-signature/${employeeId}/1`, {isNewest: 'true'});
  }

  public findNewestVofficeSignature(employeeId: number): Observable<any> {
    return this.getRequest(this.serviceUrl + `/find-voffice-signature/${employeeId}/1`, {isNewest: 'true'});
  }
  public getFile(id: number): Observable<any> {
    return this.getRequest(this.serviceUrl + `/get-file/${id}`);
  }
  public getFile2(id: number): Observable<any> {
    return this.getRequest(this.serviceUrl + `/get-file2/${id}`);
  }

  public getSignFile(transCode: string): Observable<any> {
    return this.getRequest(this.serviceUrl + `/voffice-list-file/${transCode}`);
  }

  public preview(id: number, fileId: number): Observable<any> {
    return this.getRequest(this.serviceUrl + `/preview/${id}/${fileId}`, { responseType: 'blob' });
  }

  public preview2(id: number, fileId: number): Observable<any> {
    return this.getRequest(this.serviceUrl + `/preview2/${id}/${fileId}`, { responseType: 'blob' });
  }

  public sign(item: any): Observable<any> {
    const formdata = CommonUtils.convertFormFile(item);
    const url = `${this.serviceUrl}/sign`;
    return this.postRequest(url, formdata);
  }

  public exportSignTemplate(signType: string, id: number): Observable<any> {
    const url = `${this.serviceUrl}/export-sign-template/${signType}/${id}`;
    return this.getRequest(url, {responseType: 'blob'});
  }

  public countSignNote(item: any): Observable<any> {
    const formdata = CommonUtils.convertFormFile(item);
    const url = `${this.serviceUrl}/count-sign-note`;
    return this.postRequest(url, formdata);
  }
  public passSign(item: any): Observable<any> {
    const formdata = CommonUtils.convertFormFile(item);
    const url = `${this.serviceUrl}/pass-sign`;
    return this.postRequest(url, formdata);
  }

  public cancelStream(signType: string, id: number): Observable<any> {
    const url = `${this.serviceUrl}/cancel-stream/${signType}/${id}`;
    return this.postRequest(url, {});
  }

  public findOrgNameByEmployeeId(employeeId: number): Observable<any> {
    return this.getRequest(this.serviceUrl + `/get-org-name-by-employee-id/${employeeId}`);
  }

  public getDocumentAttachmentVoffice(formSearch: any): Observable<any> {
    const url = `${this.serviceUrl}/get-document-attachment-voffice`;
    return this.getRequest(url, {params: formSearch});
  }

  public getDocumentReceiverVoffice(formSearch: any): Observable<any> {
    const url = `${this.serviceUrl}/get-document-receiver-voffice`;
    return this.getRequest(url, {params: formSearch});
  }

  public submitVoffice(formSubmit: any): Observable<any> {
    const formdata = CommonUtils.convertFormFile(formSubmit);
    const url = `${this.serviceUrl}/submit-voffice`;
    return this.postRequest(url, formdata);
  }

  public getVofficeFile(transCode: string , index: number): Observable<any> {
    return this.getRequest(this.serviceUrl + `/download-file/${transCode}/${index}`, { responseType: 'blob' });
  }

  cloneFile(signDocumentId) {
    const url = `${this.serviceUrl}/clone-file/${signDocumentId}`;
    return this.getRequest(url);
  }
  public getVofficeDocxFile(transCode: string , index: number): Observable<any> {
    return this.getRequest(this.serviceUrl + `/doc-2-pdf-file/${transCode}/${index}`, { responseType: 'blob' });
  }

  public cancelTransaction(signType, signDocumentId) {
    const formdata = {signDocumentId: signDocumentId}
    const url = `${this.serviceUrl}/cancel-transaction/${signType}/${signDocumentId}`;
    return this.postRequest(url, formdata);
  }

  public updateVoffice(transCode: string) {
    const url = `${this.serviceUrl}/voffice-status/${transCode}`;
    return this.getRequest(url);
  }

  public showVofficeHistory(data?: any, event?: any): Observable<any> {
    if (!event) {
      this.credentials = Object.assign({}, data);
    }
    const searchData = CommonUtils.convertData(this.credentials);
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/voffice-history`;
    return this.getRequest(url, { params: buildParams });
  }
  public showHistory(event,signDocumentId?: any): Observable<any> {
    return this.getRequest(this.serviceUrl + `/get-list-sign-image-vof-2-new/${signDocumentId}`);
  }

  public syncSign(transCode) {    
    const formdata = {transCode: transCode}
    const formdata1 = CommonUtils.convertFormFile(formdata);
    const url = `${this.serviceUrl}/voffice-status/${transCode}`;
    return this.getRequest(url, formdata1);
  }
}
