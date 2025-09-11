import { HelperService } from '@app/shared/services/helper.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { CONFIG } from '@app/core/app-config';
import { BasicService } from '@app/core/services/basic.service';

@Injectable({
  providedIn: 'root'
})
export class SysPropertyService extends BasicService {
  private API_URL: string = environment.serverUrl.sys;

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'sysProperty', httpClient, helperService);
  }
  public findPropertyDetails(propertyId): Observable<any> {
    const url = `${this.serviceUrl}/${propertyId}/sys-property-details/`;
    return this.httpClient.get(url).pipe();
  }
  public findColumns(tableName): Observable<any> {
    const url = `${this.serviceUrl}/tables/${tableName}/columns`;
    return this.httpClient.get(url).pipe();
  }
  public savePropertyDetail(data: any): Observable<any> {
    const url = `${this.API_URL + CONFIG.API_PATH.sysPropertyDetails}`;
    return this.postRequest(url, data);
  }
  public findTables(): any {
    const url = `${this.API_URL + CONFIG.API_PATH.sysCat}/tables`;
    return this.httpClient.get(url).pipe();
  }
  public findPropertyDetailsByResoureCode(resoureCode: string): any {
    const url = `${this.serviceUrl}/resource/${resoureCode}`;
    return this.httpClient.get(url);
  }
}