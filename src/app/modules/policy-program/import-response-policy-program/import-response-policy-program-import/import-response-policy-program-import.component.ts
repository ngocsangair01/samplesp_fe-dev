import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { ImportResponsePolicyProgramService } from '@app/core/services/policy-program/import-response-policy-program.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslationService } from 'angular-l10n';

@Component({
  selector: 'import-response-policy-program-import',
  templateUrl: './import-response-policy-program-import.component.html',
})
export class ImportResponsePolicyProgramImportComponent extends BaseComponent implements OnInit {

  public formImport: FormGroup;
  public dataError: any;
  private formImportConfig = {
    responsePolicyProgramId: [''],
  };

  constructor(public translation: TranslationService,
    private app: AppComponent,
    public activeModal: NgbActiveModal,
    private importResponsePolicyProgramService: ImportResponsePolicyProgramService) {
    super(null, CommonUtils.getPermissionCode("resource.requestPolicyProgram"));
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

  /**
   * Download file biểu mẫu
   */
  public processDownloadTemplate() {
    this.importResponsePolicyProgramService.downloadTemplateImport(this.f['responsePolicyProgramId'].value).subscribe(res => {
      saveAs(res, 'import_response_policy_program_template.xls');
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
      this.importResponsePolicyProgramService.processImport(this.formImport.value).subscribe(res => {
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
