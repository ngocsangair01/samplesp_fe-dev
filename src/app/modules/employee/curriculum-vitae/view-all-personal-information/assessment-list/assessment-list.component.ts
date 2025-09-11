import { Component, OnInit } from '@angular/core';
import { AssessmentService } from '@app/core/services/employee/assessment.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';

@Component({
  selector: 'assessment-list',
  templateUrl: './assessment-list.component.html'
})
export class AssessmentListComponent extends BaseComponent implements OnInit {
  employeeId: number;
  empId: { employeeId: any };
  constructor(
    private assessmentService: AssessmentService,
    private employeeResolver: EmployeeResolver
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeT63Information"));
    this.setMainService(assessmentService);
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

  /**
   * ngOnInit
   */
  ngOnInit() {
  }

  public processDownloadFile(item) {
    this.assessmentService.processDownloadFile(item.vtCriticalId).subscribe(res => {
      saveAs(res, `${item.vtCriticalId}.pdf`);
    });
  }
}
