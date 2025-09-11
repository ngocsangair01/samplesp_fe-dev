import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { PersonalPunishmentService } from '../../../../core/services/punishment/personal-punishment.service';

@Component({
  selector: 'personal-punishment-import',
  templateUrl: './personal-punishment-import.component.html',
  styleUrls: ['./personal-punishment-import.component.css']
})
export class PersonalPunishmentImportComponent extends BaseComponent implements OnInit {

  public dataError: any;
  formImport: FormGroup;
  formConfig = {
  };

  constructor(
    public app: AppComponent,
    private router: Router,
    private personalPunishmentService: PersonalPunishmentService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.punishment"));
    this.formImport = this.buildForm({}, this.formConfig);
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
    this.formImport.removeControl('fileImport');
    this.formImport.addControl('fileImport', new FormControl(null));
    this.personalPunishmentService.downloadTemplateImport(params).subscribe(res => {
      saveAs(res, 'BM_Them_moi_ky_luat_ca_nhan.xls');
    });
    this.formImport.controls['fileImport'].setValidators(ValidationService.required);
  }

  processImport() {
    this.formImport.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.personalPunishmentService.processImport(this.formImport.value).subscribe(res => {
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

  goBack() {
    this.router.navigate(['/monitoring-inspection/personal-punishment-managerment']);
  }
}
