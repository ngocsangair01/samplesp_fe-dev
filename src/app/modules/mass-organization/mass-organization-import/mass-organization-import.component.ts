import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormGroup } from '@angular/forms';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { FileControl } from '@app/core/models/file.control';
import { AppComponent } from '@app/app.component';
import { Router } from '@angular/router';
import { TranslationService } from 'angular-l10n';
import { MassOrganizationService } from '@app/core/services/mass-organization/mass-organization.service';
import { HelperService } from '@app/shared/services/helper.service';

@Component({
  selector: 'mass-organization-import',
  templateUrl: './mass-organization-import.component.html'
})
export class MassOrganizationImportComponent extends BaseComponent implements OnInit {
  public branch: Number;
  public formMassOrganization: FormGroup;
  public dataError: any;
  private formImportConfig = {
    branch: ['', [ValidationService.required]],
  };

  constructor(private massOrganizationService: MassOrganizationService,
              public translation: TranslationService,
              private helperService: HelperService,
              private app: AppComponent,
              private router: Router) {
    super(null, CommonUtils.getPermissionCode("resource.massOrganization"));
    const subPaths = this.router.url.split('/');
    if (subPaths.length >= 2) {
      if (subPaths[2] === 'organization-women') {
        this.branch = 1;
      }
      if (subPaths[2] === 'organization-youth') {
        this.branch = 2;
      }
      if (subPaths[2] === 'organization-union') {
        this.branch = 3;
      }
    }
    this.formMassOrganization = this.buildForm({}, this.formImportConfig);
    this.formMassOrganization.controls['branch'].setValue(this.branch);
    this.formMassOrganization.addControl('fileImport', new FileControl(null, ValidationService.required));
   }

  ngOnInit() {
  }

  get f () {
    return this.formMassOrganization.controls;
  }

  processImport() {
    if (!CommonUtils.isValidForm(this.formMassOrganization)) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.massOrganizationService.processImport(this.formMassOrganization.value).subscribe(res => {
        if (res.type !== 'SUCCESS') {
          this.dataError = res.data;
        } else {
          this.dataError = null;
          this.helperService.reloadTreeMass('importSuccess');
          this.goBack();
        }
      });
    }, () => {
      // on rejected
    });
  }

  processDownloadTemplate() {
    this.formMassOrganization.controls['fileImport'].clearValidators();
    this.formMassOrganization.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formMassOrganization)) {
      return;
    }
    const params = this.formMassOrganization.value;
    delete params['fileImport'];
    this.massOrganizationService.downloadTemplateImport(params).subscribe(res => {
      saveAs(res, 'template_mass_organization.xls');
    });
    this.formMassOrganization.controls['fileImport'].setValidators(ValidationService.required);
  }

  public goBack() {
    if (this.branch === 1) {
      this.router.navigate(['/mass/organization-women']);
    } else if (this.branch === 2) {
      this.router.navigate(['/mass/organization-youth']);
    } else if (this.branch === 3) {
      this.router.navigate(['/mass/organization-union']);
    }
  }
}
