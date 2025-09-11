import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ActivatedRoute } from '@angular/router';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { FormGroup } from '@angular/forms';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { PartyPunishmentService } from '@app/core/services/monitoring/party-punishment.service';
import { APP_CONSTANTS } from '@app/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';

@Component({
  selector: 'party-punishment-form',
  templateUrl: './party-punishment-form.component.html',
  styleUrls: ['./party-punishment-form.component.css']
})
export class PartyPunishmentFormComponent extends BaseComponent implements OnInit {

  formSave: FormGroup;
  listPunishmentForm: any;
  formConfig = {
    partyPunishmentId: [''],
    decideNum: ['', [ValidationService.required, ValidationService.maxLength(100)]],
    decideDate: [''],
    decideLevelId: ['', [ValidationService.required]],
    punishmentFormId: ['', [ValidationService.required]],
    partyOrganizationId: ['', [ValidationService.required]],
    reason: ['', [ValidationService.maxLength(1000)]]
  };
  constructor(
    public activeModal: NgbActiveModal,
    private app: AppComponent,
    public actr: ActivatedRoute,
    public sysCatService: SysCatService,
    public partyPunishmentService: PartyPunishmentService
  ) {
    super(actr, CommonUtils.getPermissionCode("resource.partyPunishment"));
    this.formSave = this.buildForm({}, this.formConfig);
    this.formSave.addControl('files', new FileControl(null));
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.PUNISHMENT_FORM)
      .subscribe(res => {
        this.listPunishmentForm = res.data;
      });
  }

  ngOnInit() {
  }

  get f() {
    return this.formSave.controls;
  }

  /**
    * processSaveOrUpdate
    */
  processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.app.confirmMessage(null, () => { // on accepted
      this.partyPunishmentService.saveOrUpdateFormFile(this.formSave.value)
        .subscribe(res => {
          if (this.partyPunishmentService.requestIsSuccess(res)) {
            this.activeModal.close(res);
          }
        });
    }, () => {
    });
  }

  /**
    * setFormValue
    * param data
    */
  public setFormValue(propertyConfigs: any, data?: any) {
    this.propertyConfigs = propertyConfigs;
    const filesControl = new FileControl(null);
    if (data && data.partyPunishmentId > 0) {
      this.formSave = this.buildForm(data, this.formConfig);
      if (data.fileAttachment && data.fileAttachment.partyPunishmentFiles) {
        filesControl.setFileAttachment(data.fileAttachment.partyPunishmentFiles);
      }
    } else {
      this.formSave = this.buildForm({}, this.formConfig);
    }
    this.formSave.addControl('files', filesControl);
  }
}
