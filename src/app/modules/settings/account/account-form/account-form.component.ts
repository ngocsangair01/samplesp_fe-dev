import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS } from '@app/core';
import { FileControl } from '@app/core/models/file.control';
import { CategoryService } from '@app/core/services/setting/category.service';
import { SettingIconService } from '@app/core/services/setting/setting-icon.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { ValidationService } from '@app/shared/services/validation.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'account-form',
  templateUrl: './account-form.component.html'
})
export class AccountFormComponent extends BaseComponent implements OnInit {

  formSave: FormGroup;
  formConfig = {
    settingIconId: [''],
    iconType: ['', [ValidationService.required]],
    iconName: ['', [ValidationService.required, Validators.maxLength(100)]]
  };
  iconTypeList: any;
  constructor(
    public actr: ActivatedRoute,
    public activeModal: NgbActiveModal,
    private settingIconService: SettingIconService,
    private app: AppComponent,
    private categoryService: CategoryService
  ) {
    super(null, 'SETTING_ICON');
    this.buildForms({});
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.SETTING_ICON_TYPE).subscribe(res => {
      this.iconTypeList = res.data;
    });
  }

  ngOnInit() {
  }

  get f() {
    return this.formSave.controls;
  }

  /**
   * buildForm
   */
  private buildForms(data?: any): void {
    this.formSave = this.buildForm(data, this.formConfig);

    const fileAttachment = new FileControl(null, ValidationService.required);
    if (data && data.fileAttachment) {
      if (data.fileAttachment.file) {
        fileAttachment.setFileAttachment(data.fileAttachment.file);
      }
    }
    this.formSave.addControl('file', fileAttachment);
  }

  processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }

    this.app.confirmMessage(null, () => {// on accepted
      this.settingIconService.saveOrUpdateFormFile(this.formSave.value)
        .subscribe(res => {
          if (this.settingIconService.requestIsSuccess(res)) {
            this.activeModal.close(res);
          }
        });
    }, () => {// on rejected
    });
  }
}
