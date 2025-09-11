import { Component, OnInit } from '@angular/core';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { CommonUtils } from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';
import { RewardPartyMemberService } from './../../../../../core/services/party-organization/reward-party-member.service';
import { BaseComponent } from './../../../../../shared/components/base-component/base-component.component';


@Component({
  selector: 'reward-displine-government',
  templateUrl: './reward-displine-government.component.html',
})
export class RewardDisplineGovernmentComponent extends BaseComponent implements OnInit {

  employeeId: number;
  resultList: any;

  constructor(
    private curriculumVitaeService: CurriculumVitaeService,
    private rewardPartyMemberService: RewardPartyMemberService,
    private helperService: HelperService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.transferEmployee"));
    this.setMainService(rewardPartyMemberService);
  }

  ngOnInit() {

  }

  public callProcessSeach(event?: any) {
    this.helperService.ASSESSMENT_DATA.subscribe(
      data => {
        if (data) {
          this.employeeId = data;
          this.formSearch = this.buildForm(this.employeeId, { employeeId: [''] });
          this.processSearchDetail(event);
        }
      }
    );
  }

  public processSearchDetail(event?: any): void {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const params = this.employeeId ? this.employeeId : null;
    this.curriculumVitaeService.getListEmpRewardByEmployeeId(params, event).subscribe(res => {
      this.resultList = res;
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }

}
