import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM } from '@app/core';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { EmpThoroughContentService } from '@app/core/services/thorough-content/emp-thorough-content.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslationService } from 'angular-l10n';

@Component({
  selector: 'send-reminder-modal',
  templateUrl: './send-reminder-modal.component.html',
  styleUrls: ['./send-reminder-modal.component.css']
})
export class SendReminderModaComponent extends BaseComponent implements OnInit {
  formGroup: FormGroup;
  formConfig = {
    thoroughContentId: [null, ValidationService.required],
    organizationId: [null],
    typeThorough: [null, ValidationService.required],
    thoroughContentReminderId: [null, ValidationService.required],
  }

  thoroughContentReminderOptions;

  emptyFilterMessage = this.translation.translate('selectFilter.emptyFilterMessage');

  constructor(public activeModal: NgbActiveModal,
    private appParamService: AppParamService,
    private service: EmpThoroughContentService,
    public actr: ActivatedRoute,
    public app: AppComponent,
    private helperService: HelperService,
    public translation: TranslationService) { 
    super();
    this.setMainService(service);
    this.getDropDownOptions();
  }

  ngOnInit() {
  }

  getDropDownOptions() {
    this.appParamService.appParams("THOROUGH_CONTENT_REMINDER").subscribe(
      res => {
        this.thoroughContentReminderOptions = res.data;
      }
    )
  }

  setInitValue(thoroughContentId, organizationId) {
    this.formGroup = this.buildForm({}, this.formConfig, ACTION_FORM.INSERT);
    this.formGroup.get('thoroughContentId').reset(thoroughContentId);
    this.formGroup.get('organizationId').reset(organizationId);
  }

  sendReminder() {
    if (!CommonUtils.isValidForm(this.formGroup)) {
      return;
    }
    const copiedForm = this.cloneFormGroup(this.formGroup);
    copiedForm.controls['typeThorough'].setValue(this.formGroup.value['typeThorough'] ? this.formGroup.value['typeThorough'] : null);
    copiedForm.controls['thoroughContentReminderId'].setValue(this.formGroup.value['thoroughContentReminderId'] ? this.formGroup.value['thoroughContentReminderId'].parId : null);
    this.service.sendReminder(copiedForm.value).subscribe(res => {
      if (this.service.requestIsSuccess(res)) {
        this.activeModal.close();
      }
    });
  }

  cloneFormGroup(formGroup: FormGroup): FormGroup {
    const copiedControls = {};
    Object.keys(formGroup.controls).forEach(controlName => {
      const control = formGroup.controls[controlName];
      copiedControls[controlName] = new FormControl(control.value);
    });
    return new FormGroup(copiedControls);
  }

  get f() {
    return this.formGroup.controls;
  }

  // quay lai
  public goBack() {
    this.activeModal.close()
  }
}
