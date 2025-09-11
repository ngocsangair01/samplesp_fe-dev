import { Component, OnInit } from '@angular/core';
import { WorkProcessService } from '@app/core/services/employee/work-process.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';

@Component({
  selector: 'work-process-list',
  templateUrl: './work-process-list.component.html'
})
export class WorkProcessListComponent extends BaseComponent implements OnInit {

  employeeId: number;
  empId: { employeeId: any };
  constructor(
    private employeeResolver: EmployeeResolver,
    private workProcessService: WorkProcessService) {
    super(null, CommonUtils.getPermissionCode("resource.employeeT63Information"));
    this.setMainService(workProcessService);
    // this.formSearch = this.buildForm({}, { employeeId: [''] });
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
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
}
