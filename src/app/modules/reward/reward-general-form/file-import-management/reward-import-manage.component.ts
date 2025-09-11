import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { LOAI_DOI_TUONG_KHEN_THUONG } from '@app/core';
import { RewardGeneralService } from '@app/core/services/reward-general/reward-general.service';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { AppComponent } from '@app/app.component';

@Component({
  selector: 'reward-import-manage',
  templateUrl: './reward-import-manage.component.html'
})
export class RewardImportManageComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  formConfig = {
    massRequestId: [''],
    lstNodeCheck: [''],
    description: [''],
    fileImport: [null, ValidationService.required]
  };
  isPersonal: boolean;
  isGroup: boolean;
  isViewPersonal: boolean;
  isViewGroup: boolean;
  rewardType: number;
  isInside: number;
  branch: any;
  public dataError: any;
  public criteriaPlanTree;
  public massRequestId: any;
  public partyOrganizationId: any;

  constructor(
    public activeModal: NgbActiveModal,
    public actr: ActivatedRoute,
    private rewardGeneralService: RewardGeneralService,
    private router: Router,
    private app: AppComponent
  ) {
    super(null, 'REQUEST_RESOLUTION_QUARTER_YEAR');
    this.formSave = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 2) {
      this.isPersonal = subPaths[3] === 'reward-personal-add'
      this.isGroup = subPaths[3] === 'reward-group-add'
      this.isViewPersonal = subPaths[3] === 'reward-personal-edit'
      this.isViewGroup = subPaths[3] === 'reward-group-edit'
    }
  }

  get f() {
    return this.formSave.controls;
  }

  processDownloadTemplate() {
    let rewardObjectType;
    let fileName;
    if (this.isPersonal || this.isViewPersonal) {
      fileName = 'BieuMauImportDanhSachCaNhan.xls';
      rewardObjectType = LOAI_DOI_TUONG_KHEN_THUONG.CA_NHAN;
    }
    else if (this.isGroup || this.isViewGroup) {
      fileName = 'BieuMauImportDanhSachTapThe.xls';
      rewardObjectType = LOAI_DOI_TUONG_KHEN_THUONG.TAP_THE;
    }
    this.rewardGeneralService.downloadTemplateImport(rewardObjectType, this.rewardType, this.isInside).subscribe(res => {
      saveAs(res, fileName);
    });
  }

  public processImport() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.formSave.value.rewardType = this.rewardType;
    this.formSave.value.branch = this.branch;
    if (this.isPersonal || this.isViewPersonal) {
      this.formSave.value.rewardObjectType = LOAI_DOI_TUONG_KHEN_THUONG.CA_NHAN;

    } else if (this.isGroup || this.isViewGroup) {
      this.formSave.value.rewardObjectType = LOAI_DOI_TUONG_KHEN_THUONG.TAP_THE;
    }
      this.formSave.value.rewardGroup = this.isInside && this.isInside == 0  ? 1 : 2;
    this.rewardGeneralService.processImport(this.formSave.value).subscribe(res => {
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
    this.isInside = data.isInside;
    this.branch = data.branch;
  }
}
