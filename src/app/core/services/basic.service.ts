import { CommonUtils } from '@app/shared/services/common-utils.service';
import { Injectable } from '@angular/core';
import { CONFIG } from '../app-config';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HelperService } from '@app/shared/services/helper.service';
import {CryptoService} from "@app/shared/services";

@Injectable()
export class BasicService {
  public serviceUrl: string;
  public module: string;
  public systemCode: string;
  credentials: any = {};

  /**
   * init service from system code and module
   * config value of app-config.ts
   * param systemCode
   * param module
   */
  constructor(
    systemCode: string,
    module: string,
    public httpClient: HttpClient,
    public helperService: HelperService,
    ) {

    this.systemCode = systemCode;
    this.module = module;
    const API_URL = environment.serverUrl[this.systemCode];
    const API_PATH = CONFIG.API_PATH[this.module];
    if (!API_URL) {
      console.error(`Missing config system service config in src/environments/environment.ts => system: ${this.systemCode}`);
      return;
    }
    if (!API_PATH) {
      console.error(`Missing config system service config in src/app/app-config.ts => module: ${this.module}`);
      return;
    }
    this.serviceUrl = API_URL + API_PATH;
  }
  /**
   * set SystemCode
   * param systemCode
   */
  public setSystemCode(systemCode: string) {
    this.systemCode = systemCode;
    const API_URL = environment.serverUrl[this.systemCode];
    const API_PATH = CONFIG.API_PATH[this.module];
    if (!API_URL) {
      console.error(`Missing config system service config in src/environments/environment.ts => system: ${this.systemCode}`);
      return;
    }
    if (!API_PATH) {
      console.error(`Missing config system service config in src/app/app-config.ts => module: ${this.module}`);
      return;
    }
    this.serviceUrl = API_URL + API_PATH;
  }


  public search(data?: any, event?: any): Observable<any> {
    if (!event) {
      this.credentials = Object.assign({}, data);
    }

    const searchData = CommonUtils.convertData(this.credentials);

    if (event) {
      // console.log(JSON.stringify(event), CryptoService.encrAesEcb(event))
      searchData._search = CryptoService.encrAesEcb(JSON.stringify(event));
    }
    const buildParams = CommonUtils.buildParams(searchData);
    const url = `${this.serviceUrl}/search?`;
    return this.getRequest(url, {params: buildParams});
  }
  /**
   * findAll
   */
  public findAll(): Observable<any> {
    const url = `${this.serviceUrl}`;
    return this.getRequest(url);
  }
  /**
   * findOne
   * param id
   */
  public findOne(id: number): Observable<any> {
    const url = `${this.serviceUrl}/${id}`;
    return this.getRequest(url);
  }
  /**
   * saveOrUpdate
   */
  public saveOrUpdate(item: any): Observable<any> {
    const url = `${this.serviceUrl}`;
    return this.postRequest(url, CommonUtils.convertData(item));
  }
  /**
   * saveOrUpdateFormFile
   */
  public saveOrUpdateFormFile(item: any): Observable<any> {
    const formdata = CommonUtils.convertFormFile(item);
    const url = `${this.serviceUrl}`;
    return this.postRequest(url, formdata);
  }
  /**
   * deleteById
   * param id
   */
  public deleteById(id: number): Observable<any> {
    const url = `${this.serviceUrl}/${id}`;
    this.helperService.isProcessing(true);
    return this.deleteRequest(url);
  }
  /*******************************/

  /**
   * handleError
   */
  public handleError(error: any) {
    const errorMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return throwError(errorMsg);
  }
  /**
   * make get request
   */
  public getRequest(url: string, options?: any): Observable<any> {
    this.helperService.isProcessing(true);
    return this.httpClient.get(url, options)
      .pipe(
        tap( // Log the result or error
          res => {
            this.helperService.APP_TOAST_MESSAGE.next(res);
            this.helperService.isProcessing(false);
          },
          error => {
            this.helperService.APP_TOAST_MESSAGE.next(error);
            this.helperService.isProcessing(false);
          }
        ),
        catchError(this.handleError)
      );
  }
  /**
   * make get request
   */
  public getRequestNoEndSpin(url: string, options?: any): Observable<any> {
    this.helperService.isProcessing(true);
    return this.httpClient.get(url, options)
        .pipe(
            tap( // Log the result or error
                res => {
                  this.helperService.APP_TOAST_MESSAGE.next(res);
                },
                error => {
                  this.helperService.APP_TOAST_MESSAGE.next(error);
                }
            ),
            catchError(this.handleError)
        );
  }
  /**
   * make post request
   */
  public postRequest(url: string, data?: any, isNotDisplayLoading?: boolean, isNotShowMessage?: boolean): Observable<any> {
    if (!isNotDisplayLoading) {
      this.helperService.isProcessing(true);
    }
    return this.httpClient.post(url, data)
      .pipe(
        tap( // Log the result or error
          res => {
            if (!isNotShowMessage) {
              this.helperService.APP_TOAST_MESSAGE.next(res);
            }
            this.helperService.isProcessing(false);
          },
          error => {
            if (!isNotShowMessage) {
              this.helperService.APP_TOAST_MESSAGE.next(error);
            }
            this.helperService.isProcessing(false);
          }
        ),
        catchError(this.handleError)
      );
  }
  /**
   * make post request for file
   */
  public postRequestFile(url: string, data?: any): Observable<any> {
    this.helperService.isProcessing(true);
    return this.httpClient.post(url, data, {responseType: 'blob'})
      .pipe(
        tap( // Log the result or error
          res => {
            this.helperService.APP_TOAST_MESSAGE.next(res);
            this.helperService.isProcessing(false);
          },
          error => {
            this.helperService.APP_TOAST_MESSAGE.next(error);
            this.helperService.isProcessing(false);
          }
        ),
        catchError(this.handleError)
      );
  }
  /**
   * make get request
   */
  public deleteRequest(url: string): Observable<any> {
    this.helperService.isProcessing(true);
    return this.httpClient.delete(url)
      .pipe(
        tap( // Log the result or error
          res => {
            this.helperService.APP_TOAST_MESSAGE.next(res);
            this.helperService.isProcessing(false);
          },
          error => {
            this.helperService.APP_TOAST_MESSAGE.next(error);
            this.helperService.isProcessing(false);
          }
        ),
        catchError(this.handleError)
      );
  }
  /**
   * processReturnMessage
   * param data
   */
  public processReturnMessage(data): void {
    this.helperService.APP_TOAST_MESSAGE.next(data);
  }
  /**
   * request is success
   */
  public requestIsSuccess(data: any): boolean {
    let isSuccess = false;
    if (!data) {
      isSuccess = false;
    }
    if (data.type === 'SUCCESS' || data.type === 'success') {
      isSuccess = true;
    } else {
      isSuccess = false;
    }
    return isSuccess;
  }
  /**
   * request is success
   */
  public requestIsConfirm(data: any): boolean {
    let isConfirm = false;
    if (!data) {
      isConfirm = false;
    }
    if (data.type === 'CONFIRM') {
      isConfirm = true;
    } else {
      isConfirm = false;
    }
    return isConfirm;
  }
  /**
   * confirmDelete
   */
  public confirmDelete(data): void {
    this.helperService.confirmDelete(data);
  }

  public downloadFile(data?: any, fileName?: string) {
    let extensionFile = '';
    if (fileName) {
      const arr = fileName.split('.');
      extensionFile = arr[arr.length -1];
    }
    if (data) {
      if (extensionFile.toLocaleLowerCase() === 'docx' || extensionFile.toLocaleLowerCase() === 'doc') {
        saveAs(this.convertBase64ToBlob(data, "application/msword", ""), fileName);
      } else if ( extensionFile.toLocaleLowerCase() === 'xls') {
        saveAs(this.convertBase64ToBlob(data, "application/vnd.ms-excel", ""), fileName);
      } else if (extensionFile.toLocaleLowerCase() === 'xlsx') {
        saveAs(this.convertBase64ToBlob(data, "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", ""), fileName);
      } else if (extensionFile.toLocaleLowerCase() === 'pdf') {
        saveAs(this.convertBase64ToBlob(data, "application/pdf", ""), fileName);
      } else if (extensionFile.toLocaleLowerCase() === 'rptdesign') {
        saveAs(this.convertBase64ToBlob(data, "APPLICATION/OCTET-STREAM", ""), fileName);
      }
    }
  }

  /**
   * convert base64 to blob
   */
  public convertBase64ToBlob(b64Data: any, contentType: any, sliceSize: any){
    contentType = contentType || "";
    var sliceSize = sliceSize || 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (
      var offset = 0;
      offset < byteCharacters.length;
      offset += sliceSize
    ) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };
}
