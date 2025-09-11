import { CommonUtils } from './../../../shared/services/common-utils.service';
import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LabourContractDetailService extends BasicService {
  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'labourContractDetail', httpClient, helperService);
  }
  public getListLabourContractDetail(labourContractTypeId: number): Observable<any> {
    const list = `${this.serviceUrl}/by-labour-contract-type/${labourContractTypeId}`;
    return this.getRequest(list);
  }
}
