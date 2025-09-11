import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import {ACTION_FORM, LOAI_DOI_TUONG_KHEN_THUONG} from '@app/core';
import { RewardGeneralService } from '@app/core/services/reward-general/reward-general.service';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { AppComponent } from '@app/app.component';
import {TrainingTopicService} from "@app/core/services/training-topic/training-topic.service";

@Component({
  selector: 'file-import-popup',
  templateUrl: './file-import-popup.component.html'
})
export class FileImportPopupComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  trainingTopicOrgIds = []
  formConfig = {
    "fileImport" : [],
    "trainingTopicOrgIds":[]
  }
  dataError;
  constructor(
    public activeModal: NgbActiveModal,
    public actr: ActivatedRoute,
    private trainingTopicService: TrainingTopicService,
    private router: Router,
    private app: AppComponent
  ) {
    super(null, 'REQUEST_RESOLUTION_QUARTER_YEAR');
    this.formSave = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
  }
  get f() {
    return this.formSave.controls;
  }

  processDownloadTemplate() {
    let rewardObjectType;
    let fileName ="template_danh_sach_dao_tao";

    this.trainingTopicService.downloadTemplateImport().subscribe(res => {
      saveAs(res, fileName);
    });
  }

  public processImport() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    {{debugger}}

    this.trainingTopicService.processImport(this.formSave.value).subscribe(res => {
      if (res.type == 'SUCCESS') {
        this.activeModal.close(res);
      }else {
        this.dataError = res.data;
      }
    });
  }

  public setFormValue(propertyConfigs: any, data?: any) {
    this.propertyConfigs = propertyConfigs;
  }

  setInitValue(trainingTopicOrgIds) {
    this.formSave.controls['trainingTopicOrgIds'].setValue(trainingTopicOrgIds)
  }
}
