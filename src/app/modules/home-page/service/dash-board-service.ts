import { CommonUtils } from '@app/shared/services';
import {BasicService} from "@app/core/services/basic.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HelperService } from '@app/shared/services/helper.service';
import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
  })

  export class DashboardService extends BasicService {
    defaultUrl = `${this.serviceUrl}`;
    options = {headers: new HttpHeaders().set('X-CACHEABLE', "1")}
    constructor(public httpClient: HttpClient, public helperService: HelperService) {
      super('political', 'dashboard', httpClient, helperService);
    }

    public getUnofficalMember(){
     const url = `${this.defaultUrl}/get-unoffical-member`;
      return this.getRequest(url)
    }
    public getTotalPendingTransferMember(){
     const url = `${this.defaultUrl}/getpendingtransfermember`;
      return this.getRequest(url)
    }
    public getTotalNewMember(){
     const url = `${this.defaultUrl}/get-total-new-member`;
      return this.getRequest(url)
    }
    public getPercentFemaleMember(){
     const url = `${this.defaultUrl}/getpercentfemalemember`;
      return this.getRequest(url)
    }
    public getOrgUnfinishResolutionMonth(){
     const url = `${this.defaultUrl}/countorgunfinishresolutionmonth`;
      return this.getRequest(url)
    }

    public percentStaff(){
     const url = `${this.defaultUrl}/percentStaff`;
      return this.getRequest(url)
    }

    public getOrgUnCompleteResolution(){
     const url = `${this.defaultUrl}/gettotalorguncompleteresolution`;
      return this.getRequest(url)
    }

    public getWarningByType(warningType: string): Observable<any> {
      const url = `${this.serviceUrl}/${warningType}`;
      return this.httpClient.get(url, this.options);
    }

    public getPolulationWarningByType(warningType: string): Observable<any> {
      const url = `${this.serviceUrl}/population/${warningType}`;
      return this.httpClient.get(url);
    }

    public getPieData(): Observable<any> {
      const url = `${this.serviceUrl}/get-pie-data`;
      return this.getRequest(url, this.options);
    }
    public getBarData(empTypeId: number): Observable<any> {
      const url = `${this.serviceUrl}/get-bar-data/${empTypeId}`;
      return this.getRequest(url, this.options);
    }
    public getPoliticalFeature(): Observable<any> {
      const url = `${this.serviceUrl}/get-political-feature`;
      return this.getRequest(url);
    }
    public getCountPunishmentForYear(): Observable<any> {
      const url = `${this.serviceUrl}/get-bar-data-punishment-year`;
      return this.getRequest(url);
    }
    public getCountPunishmentForQuater(): Observable<any> {
      const url = `${this.serviceUrl}/get-bar-data-punishment-quater`;
      return this.getRequest(url);
    }
  }