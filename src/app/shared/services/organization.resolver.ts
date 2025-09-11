import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class OrganizationResolver {
  public ORGANIZATION: Subject<any> = new BehaviorSubject<any>(null);
  public COMMON_INFO: Subject<any> = new BehaviorSubject<any>(null);
  resolve(data) {
    this.ORGANIZATION.next(data);
  }

}
