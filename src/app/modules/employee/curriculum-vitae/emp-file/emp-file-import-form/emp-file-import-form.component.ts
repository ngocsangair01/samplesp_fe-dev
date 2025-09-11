import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { EmployeeProfileService } from '@app/core/services/employee/employee_profile.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslationService } from 'angular-l10n';

@Component({
  selector: 'emp-file-import-form',
  templateUrl: './emp-file-import-form.component.html'
})
export class EmpFileImportFormComponent extends BaseComponent implements OnInit {

  public formImport: FormGroup;
  public dataError: any;
  private formImportConfig = {
    empFileId: [''],
    organizationId: ['', ValidationService.required],
    employeeId: ['']
  };

  constructor(public translation: TranslationService,
    private app: AppComponent,
    public activeModal: NgbActiveModal,
    private employeeProfileService: EmployeeProfileService) {
    super(null, CommonUtils.getPermissionCode("resource.empFile"));
  }

  ngOnInit() {
  }

  get f() {
    return this.formImport.controls;
  }

  /**
   * buildForm
   */
  private buildForms(data?: any): void {
    this.formImport = this.buildForm(data, this.formImportConfig);

    const fileAttachment = new FileControl(null, ValidationService.required);
    if (data && data.fileAttachment) {
      if (data.fileAttachment.fileAttachment) {
        fileAttachment.setFileAttachment(data.fileAttachment.fileAttachment);
      }
    }
    this.formImport.addControl('fileAttachment', fileAttachment);
    this.formImport.addControl('fileImport', new FileControl(null, ValidationService.required));
  }

  /**
  * setFormValue66
  * param data
  */
  public setFormValue(propertyConfigs: any, data?: any) {
    this.propertyConfigs = propertyConfigs;
    this.buildForms(data);
  }

  cancel(){
    this.activeModal.close();
  }

  /**
   * Download file biểu mẫu
   */
  public processDownloadTemplate() {
    this.employeeProfileService.downloadTemplateImport(this.formImport.controls['employeeId'].value).subscribe(res => {
      saveAs(res, 'employee_file_profile_template.xls');
    });
  }

  /** 
   * Thực hiện import
   */
  processImport() {
    this.formImport.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.employeeProfileService.processImport(this.formImport.value).subscribe(res => {
        if (res.type === 'WARNING') {
          this.dataError = res.data;
        } else if (res.type === 'ERROR') {
          this.dataError = null;
        } else if (res.type === 'SUCCESS') {
          this.dataError = null;
          this.activeModal.close(res);
        }
      });
    }, () => {
      // on rejected
    });
  }
}
