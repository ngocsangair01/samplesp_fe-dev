import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';

@Injectable({
  providedIn: 'root'
})
export class LabourContractTypeService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'labourContractType', httpClient, helperService);
  }

  public findByLabourContractTypeId(labourContractTypeId: number) {
    const url = `${this.serviceUrl}/${labourContractTypeId}/labour-cotract-detail`;
    return this.getRequest(url);
  }

  public checkLabourType(code: any): Observable<any> {
    const url = `${this.serviceUrl}/${code}/check-labour-type`;
    return this.getRequest(url);
  }

  public findActiveLabourContractType(): Observable<any> {
    const url = `${this.serviceUrl}/by-status-active`;
    return this.getRequest(url);
  }
}
