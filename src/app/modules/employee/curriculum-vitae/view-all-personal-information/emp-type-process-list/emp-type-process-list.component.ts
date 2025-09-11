import { Component, OnInit } from '@angular/core';
import { EmpTypeProcessService } from '@app/core/services/emp-type-process/emp-type-process.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';

@Component({
  selector: 'emp-type-process-list',
  templateUrl: './emp-type-process-list.component.html'
})
export class EmpTypeProcessListComponent extends BaseComponent implements OnInit {

  employeeId: number;
  empId: { employeeId: any };
  constructor(
    private empTypeProcessService: EmpTypeProcessService,
    private employeeResolver: EmployeeResolver
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeT63Information"));
    this.setMainService(empTypeProcessService);
    this.employeeResolver.EMPLOYEE.subscribe(
      data => {
        if (data) {
          this.employeeId = data;
          this.empId = { employeeId: data };
          this.formSearch = this.buildForm(this.empId, { employeeId: [''] });
        }
      }
    );
  }

  ngOnInit() {
  }

}
