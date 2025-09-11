import { Component, OnInit } from '@angular/core';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { FileControl } from '@app/core/models/file.control';
import { TranslationService } from 'angular-l10n';
import { AppComponent } from '@app/app.component';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { EmpManagementVerticalService } from '@app/core/services/security/emp-management-vertical.service';

@Component({
  selector: 'management-vertical-import',
  templateUrl: './management-vertical-import.component.html'
})
export class ManagementVerticalImportComponent extends BaseComponent implements OnInit {

  formImport: FormGroup;
  formConfig = {
    year: [new Date().getFullYear(), [ValidationService.required]]
  };
  public listYear: any;
  public listQualityRating: any;

  public dataError: any;
  constructor(private empManagementVerticalService: EmpManagementVerticalService, 
              public translation: TranslationService,
              private app: AppComponent,
              private router: Router) {
    super(null, CommonUtils.getPermissionCode("resource.empManagementVertical"));
    this.listYear = CommonUtils.getYearList(10, 0).sort(function(a, b){return b.year - a.year});
    this.formImport = this.buildForm({}, this.formConfig);
    this.formImport.addControl('fileImport', new FileControl(null, ValidationService.required));
  }

  ngOnInit() {
  }

  get f() {
    return this.formImport.controls;
  }

  processImport() {
    this.dataError = null;
    this.formImport.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.empManagementVerticalService.processImport(this.formImport.value)
      .subscribe(res => {
        if (res.type == 'SUCCESS') {
          this.dataError = null;
          this.goBack();
        } else if (res.type == 'ERROR') {
          this.dataError = res.data;
        }
      });
    }, () => {
      // on rejected
    });
  }

  processDownloadTemplate() {
    this.formImport.controls['fileImport'].clearValidators();
    this.formImport.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    const params = this.formImport.value;
    delete params['fileImport'];
    this.empManagementVerticalService.downloadTemplateImport(params)
    .subscribe(res => {
      saveAs(res, 'Template_BM_NganhDocBaoVeAnNinh.xls');
    });
    this.formImport.controls['fileImport'].setValidators(ValidationService.required);
  }

  public goBack() {
    this.router.navigate(['/security-guard/management-vertical']);
  }
}
