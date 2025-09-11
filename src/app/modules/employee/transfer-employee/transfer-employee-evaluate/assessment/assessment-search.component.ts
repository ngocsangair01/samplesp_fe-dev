import { Component, OnInit } from '@angular/core';
import { AssessmentService } from '@app/core/services/employee/assessment.service';
import { TransferEmployeeService } from '@app/core/services/employee/transfer-employee.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';

@Component({
  selector: 'assessment-search',
  templateUrl: './assessment-search.component.html',
})
export class AssessmentSearchComponent extends BaseComponent implements OnInit {
  transferEmployeeId: number;
  transferEmpId: { transferEmployeeId: any };
  
  constructor(private assessmentService: AssessmentService,
    private transferEmployeeService: TransferEmployeeService,
    private helperService: HelperService) {
    super(null, CommonUtils.getPermissionCode("resource.transferEmployee"));
    this.setMainService(transferEmployeeService);
  }

  /**
   * ngOnInit
   */
  ngOnInit() {

  }

  public callProcessSeach(event?: any) {
    this.helperService.TRANSFER_EMPLOYEE.subscribe(
      data => {
        if (data) {
          this.transferEmployeeId = data;
          this.transferEmpId = { transferEmployeeId: data };
          this.formSearch = this.buildForm(this.transferEmpId, { transferEmployeeId: [''] });
          this.processSearchDetail(event);
        }
      }
    );
  }

  public processSearchDetail(event?: any): void {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const params = this.formSearch ? this.formSearch.value : null;
    this.transferEmployeeService.assessmentDetail(params, event).subscribe(res => {
      this.resultList = res;
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }

  public processDownloadFile(item) {
    this.assessmentService.processDownloadFile(item.vtCriticalId).subscribe(res => {
      saveAs(res, `${item.vtCriticalId}.pdf`);
    });
  }
}
