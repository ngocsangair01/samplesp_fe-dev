import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class EmployeeResolver {
  public EMPLOYEE: Subject<any> = new BehaviorSubject<any>(null);
  public COMMON_INFO: Subject<any> = new BehaviorSubject<any>(null);
  public WORK_PROCESS: Subject<any> = new BehaviorSubject<any>(null); // quá trình công tác hiện tại
  public LONG_LEAVE_PROCESS: Subject<any> = new BehaviorSubject<any>(null); // quá trình nghỉ dài ngày
  public EDUCATION_PROCESS: Subject<any> = new BehaviorSubject<any>(null); // quá trình đào tạo
  public LANGUAGE: Subject<any> = new BehaviorSubject<any>(null); // trình độ ngoại ngữ
  public EMP_TYPE_PROCESS: Subject<any> = new BehaviorSubject<any>(null); // quá trình diện đối tượnng
  public MENU_ID: Subject<any> = new BehaviorSubject<any>(null); // quá trình diện đối tượnng
  public HEADER_MENU: Subject<any> = new BehaviorSubject<any>(null); // quá trình diện đối tượnng
  public SYS_MENU_ID: Subject<any> = new BehaviorSubject<any>(null); // quá trình diện đối tượnng

  resolve(data) {
    this.EMPLOYEE.next(data);
  }

}
