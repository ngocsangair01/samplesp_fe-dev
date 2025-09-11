import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute} from '@angular/router';
import { FormGroup } from '@angular/forms';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';
import { RewardProposeSignService } from '@app/core/services/reward-propose-sign/reward-propose-sign.service';

@Component({
  selector: 'file-import-decision-reward',
  templateUrl: './file-import-decision-reward.component.html'
})
export class FileImportDecisionRewardComponent extends BaseComponent implements OnInit {
  public dataError: any;
  formSave: FormGroup;
  
  formConfig = {
    massRequest: [null],
    lstNodeCheck: [null],
    description: [null],
    branch: [null],
    objectType: [null],
    rewardTypeId: [null],
    fileImport: [null, ValidationService.required]
  };
  rewardType: number;
  branch: any;
  option: any;
  rewardObjectType: any;
  closingDate: any;
  constructor(
    public activeModal: NgbActiveModal,
    public actr: ActivatedRoute,
    private rewardProposeSignService: RewardProposeSignService
  ) {
    super(null, 'REQUEST_RESOLUTION_QUARTER_YEAR');
    this.formSave = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {}

  get f() {
    return this.formSave.controls;
  }

  processDownloadTemplate() {
    this.rewardProposeSignService.downloadTemplateImport(this.rewardType).subscribe(res => {
      saveAs(res, 'DanhSachKhenThuongChiTiet.xls');
    });
  }

  public processImport() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.formSave.value.rewardType = this.rewardType;
    this.formSave.value.objectType = this.rewardObjectType;
    this.formSave.value.branch = this.branch;
    this.formSave.value.closingDate = this.closingDate;
    this.rewardProposeSignService.processImport(this.formSave.value).subscribe(res => {
      if (res.type == 'SUCCESS') {
        this.activeModal.close(res);
        this.dataError = null;
      }
      else {
        this.dataError = res.data;
      }
    });
  }

  public setFormValue(propertyConfigs: any, data?: any) {
    this.propertyConfigs = propertyConfigs;
    this.rewardType = data.rewardType;
    this.branch = data.branch;
    this.rewardObjectType = data.rewardObjectType;
    this.option = data.option;
    this.closingDate = data.closingDate;
  }
}
