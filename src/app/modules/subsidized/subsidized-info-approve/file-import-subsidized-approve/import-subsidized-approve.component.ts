import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { SubsidizedInfoService } from '@app/core/services/subsidized/subsidized-info.service';

@Component({
  selector: 'import-subsidized-approve',
  templateUrl: './import-subsidized-approve.component.html'
})
export class ImportSubsidizedApproveComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  lstReason: any;
  formConfig = {
    massRequestId: [null],
    lstNodeCheck: [null],
    description: [null],
    branch: [null],
    objectType: [null],
    rewardTypeId: [null],
    fileImport: [null, ValidationService.required],
    subsidizedInfoId: [null]
  };
  isPersonal: boolean;
  rewardType: number;
  branch: any;
  option: any;
  rewardObjectType: any;
  subsidizedPeriodId: any;
  subsidizedInfoId: any;
  public dataError: any;
  public criteriaPlanTree;
  public massRequestId: any;
  public partyOrganizationId: any;

  constructor(
    public activeModal: NgbActiveModal,
    public actr: ActivatedRoute,
    private subsidizedInfoService: SubsidizedInfoService
  ) {
    super(null, 'REQUEST_RESOLUTION_QUARTER_YEAR');
    this.formSave = this.buildForm({}, this.formConfig);
  }

  ngOnInit() { }

  get f() {
    return this.formSave.controls;
  }

  public processDownloadTemplate() {
    this.subsidizedInfoService.downloadTemplateApproveImport({ subsidizedInfoId: this.subsidizedInfoId }).subscribe(res => {
      saveAs(res, 'TemplateImportXetDuyetTroCap.xls');
    });
  }

  public processImport() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.formSave.value.subsidizedInfoId = this.subsidizedInfoId
    this.subsidizedInfoService.processImportApprove(this.formSave.value).subscribe(res => {
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
    this.subsidizedInfoId = data.subsidizedInfoId;
  }
}
