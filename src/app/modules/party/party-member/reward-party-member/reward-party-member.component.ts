import { RewardPartyMemberService } from './../../../../core/services/party-organization/reward-party-member.service';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';
import { CommonUtils } from '@app/shared/services';
import { PartyMemebersService } from '@app/core/services/party-organization/party-members.service';

@Component({
  selector: 'reward-party-member',
  templateUrl: './reward-party-member.component.html',
  styleUrls: ['./reward-party-member.component.css']
})
export class RewardPartyMemberComponent extends BaseComponent implements OnInit {
  employeeId: number;
  resultList: any;
  hideListTitle: boolean = false;
  formConfig = {
    employeeId: [''],
    status: [3],
  };
  constructor(
    private rewardPartyMemberService: RewardPartyMemberService,
    private employeeResolver: EmployeeResolver,
    private partyMemebersService: PartyMemebersService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyMember"));
    this.setMainService(rewardPartyMemberService);
    this.employeeResolver.EMPLOYEE.subscribe(
      data => {
        if (data) {
          this.employeeId = data;
          this.formSearch = this.buildForm({employeeId: this.employeeId}, this.formConfig);
          this.processSearchDetail(null);
        }
      }
    );
  }

  ngOnInit() {
    this.partyMemebersService.selectMenuItem.subscribe(res => {
      let element = document.getElementById(res);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    })
  }

  public processSearchDetail(event?): void {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const params = this.formSearch ? this.formSearch.value : null;
    this.rewardPartyMemberService.searchDetail(params, event).subscribe(res => {
      this.resultList = res;
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }
}
