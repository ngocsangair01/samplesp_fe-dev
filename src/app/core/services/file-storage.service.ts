import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { BasicService } from './basic.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class FileStorageService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('file', 'fileStorage', httpClient, helperService);
  }
  /**
   * deleteFile
   * param id
   */
  public deleteFile(secretId: string): Observable<any> {
    const url = `${this.serviceUrl}/delete/${secretId}`;
    return this.deleteRequest(url);
  }
  /**
   * downloadFile
   * param id
   */
  public downloadFile(id: string): Observable<any> {
    const url = `${this.serviceUrl}/download/${id}`;
    return this.getRequest(url, { responseType: 'blob' });
  }
  /**
   * downloadFileExcel
   * param id
   */
  public downloadFileExcel(id: string): Observable<any> {
    const url = `${this.serviceUrl}/download-excel/${id}`;
    return this.getRequest(url, { responseType: 'blob' });
  }


  /**
 * downloadPdfFile
 * param id
 */
    public downloadPdfFile(id: string): Observable<any> {
    const url = `${this.serviceUrl}/download-pdf/${id}`;
    return this.getRequest(url, { responseType: 'blob' });
  }

  uploadFiles(fileType, objectId, files): Observable<any> {
    const url = `${this.serviceUrl}/${fileType}/append_all/${objectId}`;
    const fromData = new FormData();
    for (let file of files) {
      fromData.append("file", file);
    }
    return this.postRequest(url, fromData);
  }

  uploadFile(fileType, objectId, file): Observable<any> {
    const url = `${this.serviceUrl}/${fileType}/append/${objectId}`;
    const fromData = new FormData();
    fromData.append("file", file);
    return this.postRequest(url, fromData);
  }
}
