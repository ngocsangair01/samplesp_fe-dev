import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute} from '@angular/router';
import { FormGroup } from '@angular/forms';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';
import {GroupOrgPositionService} from "@app/core/services/group-org-position/group-org-position.service";

@Component({
  selector: 'file-import-group-org-position',
  templateUrl: './file-import-group-org-position.component.html'
})
export class GroupOrgPositionImportComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  formConfig = {
    fileImport: [null, ValidationService.required]
  };
  public dataError: any;

  constructor(
    public activeModal: NgbActiveModal,
    public actr: ActivatedRoute,
    private groupOrgPositionService: GroupOrgPositionService
  ) {
    super(null, 'REQUEST_RESOLUTION_QUARTER_YEAR');
    this.formSave = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {}

  get f() {
    return this.formSave.controls;
  }

  processDownloadTemplate() {
    this.groupOrgPositionService.downloadTemplateImport().subscribe(res => {
      saveAs(res, 'DanhSachCauHinhDonViChucDanh.xls');
    });
  }

  public processImport() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.groupOrgPositionService.processImportUpgradeGroupOrg(this.formSave.value).subscribe(res => {
      if (res.type == 'SUCCESS') {
        this.activeModal.close(res);
        this.dataError = null;
      }
      else {
        this.dataError = res.data;
      }
    });
  }
}
