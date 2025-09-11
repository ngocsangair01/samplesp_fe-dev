import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BasicService } from './basic.service';
import { Observable } from 'rxjs';
import { HelperService } from '@app/shared/services/helper.service';

@Injectable({
  providedIn: 'root'
})
export class EmpTypesService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'emp-types', httpClient, helperService);
  }
  /**
   * action load org tree
   */
  public getListEmpType(): Observable<any> {
    const url = `${this.serviceUrl}/emp-type-list`;
    return this.getRequest(url);
  }

  public getAllByEmpTypeByIsUsed(): Observable<any> {
    const url = `${this.serviceUrl}/by-is-used`;
    return this.getRequest(url);
  }

  /**
   * Lay danh sach dien doi tuong khong phai la nhan vien dia ban
   */
  public getNoneStaffAreaEmpType(): Observable<any> {
    const url = `${this.serviceUrl}/none_staff_area_emp_type`;
    return this.getRequest(url);
  }
}
