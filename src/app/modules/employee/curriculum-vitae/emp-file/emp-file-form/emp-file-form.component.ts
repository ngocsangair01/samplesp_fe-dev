
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { EmployeeProfileService } from '@app/core/services/employee/employee_profile.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ACTION_FORM, APP_CONSTANTS } from './../../../../../core/app-config';

@Component({
  selector: 'emp-file-form',
  templateUrl: './emp-file-form.component.html',
})
export class EmpFileFormComponent extends BaseComponent implements OnInit {
  empFileFixList: [] = APP_CONSTANTS.EMP_FILE_FIXEDEMPFILE;
  empFileStatus: [] = APP_CONSTANTS.EMP_FILE_STATUS;
  profileTypeList: any;
  formSave: FormGroup;
  empFileTypeList: any;
  isMobileScreen: boolean = false;
  formConfig = {
    empFileId: ['', [ValidationService.maxLength(10)]],
    fileId: ['', [ValidationService.required, ValidationService.maxLength(10)]],
    organizationId: ['', [ValidationService.required, ValidationService.maxLength(10)]],
    employeeId: ['', [ValidationService.maxLength(10)]],
    fixedEmpFile: ['', [ValidationService.maxLength(1)]],
    status: ['', [ValidationService.maxLength(1)]],
    description: ['', [ValidationService.maxLength(500)]],
  };

  constructor(public actr: ActivatedRoute
    , public activeModal: NgbActiveModal
    , private employeeProfileService: EmployeeProfileService
    , private app: AppComponent) {
    super(null, CommonUtils.getPermissionCode("resource.empFile"));
    this.formSave = this.buildForm({}, this.formConfig);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    this.employeeProfileService.getListEmpFileType().subscribe(res => {
      this.empFileTypeList = res.data;
    });
  }

  /**
   * processSaveOrUpdate
   */
  processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.app.confirmMessage(null, () => { // on accepted
      this.actionSave();
    }, () => {
    });
  }

  private actionSave() {
    this.employeeProfileService.saveOrUpdateFormFile(this.formSave.value)
      .subscribe(res => {
        if (this.employeeProfileService.requestIsSuccess(res)) {
          this.activeModal.close(res);
        }
      });
  }

  get f() {
    return this.formSave.controls;
  }

  /**
   * buildForm
   */
  private buildForms(data?: any): void {
    const fileControl = new FileControl(null);
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, []);
    this.formSave.addControl('file', fileControl)
  }

  private buildFormFile(data) {
    const fileControl = new FileControl(null);
    this.formSave.addControl('file', fileControl);
    this.formSave.controls["file"].setValidators([Validators.required]);
    if (data.fileAttachment && data.fileAttachment.file) {
      (this.formSave.controls['file'] as FileControl).setFileAttachment(data.fileAttachment.file);
    }
  }

  /**
   * setFormValue
   * param data
   */
  public setFormValue(propertyConfigs: any, data?: any) {
    this.propertyConfigs = propertyConfigs;
    if (data && data.empFileId > 0) {
      this.buildForms(data);
    } else {
      this.buildForms(data);
    }
    this.buildFormFile(data);
  }

  public clearFormData() {
    this.formSave.reset();
  }
}