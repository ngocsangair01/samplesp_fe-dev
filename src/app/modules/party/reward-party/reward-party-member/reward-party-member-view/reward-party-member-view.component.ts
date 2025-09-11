import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { RewardPartyMemberService } from '@app/core/services/party-organization/reward-party-member.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'reward-party-member-view',
  templateUrl: './reward-party-member-view.component.html',
  styleUrls: ['./reward-party-member-view.component.css']
})
export class RewardPartyMemberViewComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  yearList = [];
  formConfigDetail = {
    importRewardPartyMemberId: ['', [Validators.required]],
    year: [''],
  };
  constructor(
    private rewardPartyMemberService: RewardPartyMemberService,
    public activeModal: NgbActiveModal,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.rewardParty"));
    this.setMainService(rewardPartyMemberService);
    this.formSearch = this.buildForm({}, this.formConfigDetail);
  }

  ngOnInit() {

  }

  get f() {
    return this.formSearch.controls;
  }

  setFormValue(item) {
    if (item && item.importRewardPartyMemberId > 0) {
      this.formSearch = this.buildForm({ importRewardPartyMemberId: item.importRewardPartyMemberId, year: item.year }, this.formConfigDetail);
      this.processSearchDetail(null);
    }
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

  processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    this.rewardPartyMemberService.exportDetailRewardYear(this.formSearch.value).subscribe(
      res => {
        if (this.formSearch.value && this.formSearch.value.year) {
          saveAs(res, 'ctct_danh_sach_khen_thuong_dang_vien_nam_' + this.formSearch.value.year + '.xlsx');
        }
      }
    );
  }
}
