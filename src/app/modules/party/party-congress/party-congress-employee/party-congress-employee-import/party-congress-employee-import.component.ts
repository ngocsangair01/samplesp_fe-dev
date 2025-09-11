;
import { Component, OnInit } from '@angular/core';
import { PartyCongressEmployeeService } from '@app/core/services/party-organization/party-congress-employee.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormGroup, Validators } from '@angular/forms';
import { FileControl } from '@app/core/models/file.control';
import { CommonUtils } from '@app/shared/services';
import { AppComponent } from '@app/app.component';
import { Router } from '@angular/router';
import { CategoryService } from '@app/core/services/setting/category.service';
import { APP_CONSTANTS } from '@app/core';

@Component({
  selector: 'party-congress-employee-import',
  templateUrl: './party-congress-employee-import.component.html',
})
export class PartyCongressEmployeeImportComponent extends BaseComponent implements OnInit {
  formImport: FormGroup;
  dataError: any;
  tenureList = [];
  formConfig = {
    partyOrganizationId: ['', [Validators.required]],
    tenureId: ['', [Validators.required]],
  };
  constructor(
    private partyCongressEmployeeService: PartyCongressEmployeeService,
    private app: AppComponent,
    private router: Router,
    private categoryService: CategoryService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyCongressEmployee"));
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.TENURE).subscribe(
      res => this.tenureList = res.data
    );
  }

  ngOnInit() {
    this.buildForms();
  }

  buildForms() {
    this.formImport = this.buildForm({}, this.formConfig);
    this.formImport.addControl('profiles', new FileControl(null));
    this.formImport.addControl('fileImport', new FileControl(null, [Validators.required]));
  }

  get f() {
    return this.formImport.controls;
  }

  processDownloadTemplate() {
    this.partyCongressEmployeeService.downloadTemplate().subscribe(
      res => {
        saveAs(res, 'party-congress-employee-template.xls');
      }
    );
  }

  processImport() {
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.partyCongressEmployeeService.processImport(this.formImport.value).subscribe(
        res => {
          if (this.partyCongressEmployeeService.requestIsSuccess(res)) {
            this.goBack();
          } else {
            this.dataError = res.data;
          }
        }
      );
    }, () => {// on reject
    });
  }

  goBack() {
    this.router.navigate(['party-organization/party-congress-employee'])
  }
}
