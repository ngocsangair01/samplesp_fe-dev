import { Component, OnInit } from '@angular/core';
import { WorkProcessService } from '@app/core/services/employee/work-process.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';

@Component({
  selector: 'work-process-search',
  templateUrl: './work-process-search.component.html',
})
export class WorkProcessSearchComponent extends BaseComponent implements OnInit {
  employeeId: number;
  empId: { employeeId: any };
  
  constructor(private workProcessService: WorkProcessService,
    private helperService: HelperService) {
    super(null, CommonUtils.getPermissionCode("resource.transferEmployee"));
    this.setMainService(workProcessService);
  }

  /**
   * ngOnInit
   */
  ngOnInit() {

  }

  public callProcessSeach() {
    this.helperService.ASSESSMENT_DATA.subscribe(
      data => {
        if (data) {
          this.employeeId = data;
          this.empId = { employeeId: data };
          this.formSearch = this.buildForm(this.empId, { employeeId: [''] });
          this.processSearch();
        }
      }
    );
  }
}
