import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM } from '@app/core';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'reward-propose-unapprove',
  templateUrl: './reward-propose-unapprove.component.html'
})
export class RewardProposeUnapproveComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  formConfig = {
    note: ['', [ValidationService.required, ValidationService.maxLength(1000)]]
  }
  rewardProposeIdList = [];
  status: any;
  constructor(
    public activeModal: NgbActiveModal,
    public actr: ActivatedRoute,
    private rewardProposeService: RewardProposeService,
    private app: AppComponent
    ) {
    super(null, CommonUtils.getPermissionCode("resource.rewardPropose"));
    this.formSave = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {}

  get f() {
    return this.formSave.controls;
  }

  public setFormValue(propertyConfigs: any, data?: any) {
    this.propertyConfigs = propertyConfigs;
    this.rewardProposeIdList = data.rewardProposeIdList;
    this.status = data.status;
  }

  processConfirm() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    let note = this.formSave.controls['note'].value;
    this.app.confirmMessage(null, () => {
        this.rewardProposeService.updateStatusList({rewardProposeIdList: this.rewardProposeIdList, note: note, status: this.status}).subscribe(res => {
            if (res.data == null) {
              this.activeModal.close(res);
            }
          }
        )
      }
      , () => { }
    );
  }
}
