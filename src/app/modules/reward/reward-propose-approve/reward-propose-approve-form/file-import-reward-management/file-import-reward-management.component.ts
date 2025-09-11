import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute} from '@angular/router';
import { FormGroup } from '@angular/forms';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';

@Component({
  selector: 'file-import-reward-management',
  templateUrl: './file-import-reward-management.component.html'
})
export class RewardSuggestImportManageComponent1 extends BaseComponent implements OnInit {
  formSave: FormGroup;
  lstReason: any;
  formConfig = {
    massRequestId: [null],
    lstNodeCheck: [null],
    description: [null],
    branch: [null],
    objectType: [null],
    rewardProposeId: [null],
    fileImport: [null, ValidationService.required],
    isApprovalScreen: [null]
  };
  isPersonal: boolean;
  rewardProposeId: number;
  branch: any;
  option: any;
  rewardObjectType: any;
  rewardType: any;
  isApprovalScreen: any;
  public dataError: any;
  public criteriaPlanTree;
  public massRequestId: any;
  public partyOrganizationId: any;

  constructor(
    public activeModal: NgbActiveModal,
    public actr: ActivatedRoute,
    private rewardProposeService: RewardProposeService
  ) {
    super(null, 'REQUEST_RESOLUTION_QUARTER_YEAR');
    this.formSave = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {}

  get f() {
    return this.formSave.controls;
  }

  processDownloadTemplate() {
    this.rewardProposeService.downloadTemplateImport1(this.rewardProposeId).subscribe(res => {
      saveAs(res, 'DanhSachKhenThuongChiTiet.xls');
    });
  }

  public processImport() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.formSave.value.rewardTypeId = this.rewardType;
    this.formSave.value.objectType = this.rewardObjectType;
    this.formSave.value.branch = this.branch;
    this.formSave.value.isApprovalScreen = this.isApprovalScreen;
    this.formSave.value.rewardProposeId = this.rewardProposeId;
    this.rewardProposeService.processImportSelection(this.formSave.value).subscribe(res => {
      if (res.type == 'SUCCESS') {
        this.dataError = null;
        this.activeModal.close(res);
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
    this.isApprovalScreen = data.isApprovalScreen;
    this.rewardProposeId = data.rewardProposeId;
  }
}
