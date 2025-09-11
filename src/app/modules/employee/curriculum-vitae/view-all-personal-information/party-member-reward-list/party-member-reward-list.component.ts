import { Component, OnInit } from '@angular/core';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { RewardPartyMemberService } from './../../../../../core/services/party-organization/reward-party-member.service';
import { BaseComponent } from './../../../../../shared/components/base-component/base-component.component';
import { CommonUtils } from './../../../../../shared/services/common-utils.service';
import { EmployeeResolver } from './../../../../../shared/services/employee.resolver';

@Component({
  selector: 'party-member-reward-list',
  templateUrl: './party-member-reward-list.component.html'
})
export class PartyMemberRewardListComponent extends BaseComponent implements OnInit {

  employeeId: number;
  empId: { employeeId: any };
  resultList: any;
  constructor(
    private employeeResolver: EmployeeResolver,
    private curriculumVitaeService: CurriculumVitaeService,
    private rewardPartyMemberService: RewardPartyMemberService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeT63Information"));
    this.setMainService(rewardPartyMemberService);
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
  public processSearchDetail(event?): void {
    this.curriculumVitaeService.getListEmpRewardByEmployeeId(this.employeeId, event)
      .subscribe(res => {
        if (res.data) {
          this.resultList = res;
        }
      });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }
}
