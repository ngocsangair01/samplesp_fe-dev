import { AppComponent } from '@app/app.component';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder,FormArray } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Component, OnInit } from '@angular/core';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '@app/core/services/setting/category.service';
import { SettingVersionService } from '@app/core/services/setting/version-control.service';
import { ACTION_FORM } from "@app/core";

@Component({
  selector: 'version-control-add',
  templateUrl: './version-control-add.component.html',
  styleUrls: ['./version-control-add.component.css']
})
export class VersionControlAddComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  formConfig = {
    versionControlId: [''],
    androidBuildNumber: ['', [Validators.maxLength(5)]],
    androidVersion: ['', [Validators.required, Validators.maxLength(5)]],
    forceUpdateAndroid: [false],
    linkAndroid: ['', [Validators.maxLength(100)]],
    iosBuildNumber: ['', [Validators.maxLength(5)]],
    iosVersion:['', [Validators.required, Validators.maxLength(5)]],
    forceUpdateIOS: [false],
    linkIOS: ['', [Validators.maxLength(100)]],
    applicableOrg: [null],
    effectiveDate: ['', Validators.required],
    expriedDate: [''],
  };
  constructor(
    public actr: ActivatedRoute,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private app: AppComponent,
    private categoryService: CategoryService, 
    private settingVersionService : SettingVersionService, 
  ) {
    super(null, CommonUtils.getPermissionCode("resource.versionControl"));
    this.formSave = this.buildForm({}, this.formConfig);

    this.formSave = this.buildForm( {}, this.formConfig, ACTION_FORM.INSERT);
    this.formSave.controls['applicableOrg'] = new FormArray([]);
  }

  ngOnInit() {
  }

  get f() {
    return this.formSave.controls;
  }

  public setFormValue(propertyConfigs: any, data?: any) {
    this.propertyConfigs = propertyConfigs;
    this.formSave = this.buildForm(data, this.formConfig);
    this.formSave.controls['applicableOrg'] = new FormArray([]);
    if (data != {} && data.applicableOrg && data.applicableOrg.length > 0) {
      this.formSave.setControl('applicableOrg', this.fb.array(data.applicableOrg.map(item => item) || []));
    }
  }
  processSaveOrUpdate() {
    this.formSave.value['applicableOrg'] = this.formSave.get('applicableOrg').value;
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.settingVersionService.saveOrUpdate(this.formSave.value)
        .subscribe(res => {
          if (this.settingVersionService.requestIsSuccess(res)) {
            this.activeModal.close(res);
          }
        });
    }, () => {// on rejected
    });
  }
}
