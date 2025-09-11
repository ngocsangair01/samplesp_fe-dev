import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class ArmyProposedTemplateService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'armyProposedTemplate', httpClient, helperService);
  }

  public getListType(): Observable<any> {
    const url = `${this.serviceUrl}/getType`;
    return this.getRequest(url);
  }

  public findByType(type,year): Observable<any> {
    const url = `${this.serviceUrl}/get-list-by-type/` + type + '/' + year;
    return this.getRequest(url);
  }
}
