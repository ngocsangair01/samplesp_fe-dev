import { Component, OnInit } from '@angular/core';
import { KeyProjectService } from '@app/core/services/security/key-project.service';
import { CommonUtils } from '@app/shared/services';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';
import { BaseComponent } from './../../../../../shared/components/base-component/base-component.component';

@Component({
  selector: 'key-project',
  templateUrl: './key-project.component.html'
})
export class KeyProjectComponent extends BaseComponent implements OnInit {
  employeeId: number;
  empId: { employeeId: any };
  constructor(private employeeResolver: EmployeeResolver,
    private keyProjectService: KeyProjectService) {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
    this.setMainService(keyProjectService);
    this.formSearch = this.buildForm({}, { employeeId: [''] });
  }

  ngOnInit() {
    this.employeeResolver.EMPLOYEE.subscribe(
      data => {
        if (data) {
          this.employeeId = data;
          this.empId = { employeeId: data };
          this.formSearch = this.buildForm(this.empId, { employeeId: [''] });
          this.processSearchKeyProjectForEmployee(this.employeeId);
        }
      }
    );
  }
  public processSearchKeyProjectForEmployee(employeeId?: any, event?: any) {
    this.keyProjectService.processSearchKeyProjectForEmployee(employeeId, event).subscribe(res => {
      this.resultList = res;
    });
  }
}
