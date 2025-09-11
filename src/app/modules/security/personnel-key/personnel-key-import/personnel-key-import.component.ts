import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Router } from '@angular/router';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { FileControl } from '@app/core/models/file.control';
import { OrganizationService } from '@app/core';
import { AppComponent } from '@app/app.component';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import {PersonnelKeyService} from "@app/core/services/security-guard/personnel-key.service";

@Component({
  selector: 'personnel-key-import',
  templateUrl: './personnel-key-import.component.html',
})
export class PersonnelKeyImportComponent extends BaseComponent implements OnInit {
  formImport: FormGroup;
  organizationName: string;
  dataError: any;
  formConfig = {};
  constructor(
    private personnelKeyService: PersonnelKeyService,
    private router: Router,
    private organizationService: OrganizationService,
    private app: AppComponent,
  ) {
    // super(null, CommonUtils.getPermissionCode("resource.politicsQuality"));
    super();
    this.formImport = this.buildForm({}, this.formConfig)
    this.formImport.addControl('fileImport', new FileControl(null, ValidationService.required));
  }

  ngOnInit() {
  }

  get f() {
    return this.formImport.controls;
  }

  processDownloadTemplate() {
    const params = this.formImport.value;
    delete params['fileImport'];
    this.personnelKeyService.downloadTemplate(this.formImport.value).subscribe(
      res => {
        saveAs(res, 'BM_nhan_su_vi_tri_trong_yeu.xls');
      }
    );
    this.formImport.controls['fileImport'].setValidators(ValidationService.required);
  }

  goBack() {
    this.router.navigate(['/security-guard/personnel-key']);
  }

  processImport() {
    this.formImport.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.personnelKeyService.processImport(this.formImport.value).subscribe(
        res => {
          if (this.personnelKeyService.requestIsSuccess(res)) {
            this.goBack();
          } else if (res.type === 'ERROR') {
            this.dataError = res.data;
          }
        }
      );
    }, () => {// on reject
    });
  }
}
