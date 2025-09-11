import { Component, OnInit } from '@angular/core';
import { TransferEmployeeService } from '@app/core/services/employee/transfer-employee.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';

@Component({
  selector: 'reward-party-member',
  templateUrl: './reward-party-member.component.html',
})
export class RewardPartyMemberComponent extends BaseComponent implements OnInit {
  transferEmployeeId: number;
  transferEmpId: { transferEmployeeId: any, status: number };
  
  constructor(
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
          this.transferEmpId = { transferEmployeeId: data, status: 3 };
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
    this.transferEmployeeService.searchDetail(params, event).subscribe(res => {
      this.resultList = res;
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }
}


