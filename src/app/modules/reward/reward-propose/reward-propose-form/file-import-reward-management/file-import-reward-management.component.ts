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
export class RewardSuggestImportManageComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  lstReason: any;
  formConfig = {
    massRequestId: [null],
    lstNodeCheck: [null],
    description: [null],
    branch: [null],
    objectType: [null],
    rewardTypeId: [null],
    fileImport: [null, ValidationService.required]
  };
  isPersonal: boolean;
  rewardType: number;
  branch: any;
  option: any;
  rewardObjectType: any;
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
    this.rewardProposeService.downloadTemplateImport(this.rewardType).subscribe(res => {
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
    this.rewardProposeService.processImport(this.formSave.value).subscribe(res => {
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
  }
}
