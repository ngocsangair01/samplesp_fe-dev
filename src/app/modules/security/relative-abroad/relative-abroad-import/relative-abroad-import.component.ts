import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { TranslationService } from 'angular-l10n';
import {WorkedAbroadService} from "@app/core/services/security/workedAbroad.service";
import {RelativeAbroadService} from "@app/core/services/security/relativeAbroad.service";

@Component({
  selector: 'relative-abroad-import',
  templateUrl: './relative-abroad-import.component.html',
  styleUrls: ['./relative-abroad-import.component.css']
})
export class RelativeAbroadImportComponent extends BaseComponent implements OnInit {
  formConfig = {
  };
  public dataError: any;
  formImport: FormGroup;
  
  constructor(
    public translation: TranslationService,
    public app: AppComponent,
    private router: Router,
      private relativeAbroadService: RelativeAbroadService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.securityProtection"));
    this.formImport = this.buildForm({}, this.formConfig);
    this.formImport.addControl('fileImport', new FileControl(null, ValidationService.required));
  }

  ngOnInit() {
  }

  get f() {
    return this.formImport.controls;
  }

  processImport() {
    this.formImport.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.relativeAbroadService.processImport(this.formImport.value).subscribe(res => {
        if (res.type !== 'SUCCESS') {
          this.dataError = res.data;
        } else {
          this.dataError = null;
          this.goBack();
        }
      });
    }, () => {
      // on rejected
    });
  }

  processDownloadTemplate() {
    const params = this.formImport.value;
    delete params['fileImport'];
    this.formImport.removeControl('fileImport');
    this.formImport.addControl('fileImport', new FormControl(null));
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    this.relativeAbroadService.downloadTemplateImport(params).subscribe(res => {
      saveAs(res, 'template_import.xls');
    });
    this.formImport.controls['fileImport'].setValidators(ValidationService.required);
  }

  public goBack() {
    this.router.navigate(['/security-guard/relative-abroad']);
  }
}
