import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { FileControl } from '@app/core/models/file.control';
import { MassGroupService } from '@app/core/services/mass-group/mass-group.service';
import { AppComponent } from '@app/app.component';

@Component({
  selector: 'mass-group-import',
  templateUrl: './mass-group-import.component.html'
})
export class MassGroupImportComponent extends BaseComponent implements OnInit {
  formImport: FormGroup
  dataError: any;
  formConfig = {
    massGroupYear: ['', ValidationService.required]
  };
  currentDate = new Date;
  listYear: any;
  constructor(
    private massGroupService: MassGroupService,
    public activeModal: NgbActiveModal,
    private app: AppComponent,
  ) {
    super(null, CommonUtils.getPermissionCode('resource.massGroup'));
    this.listYear = CommonUtils.getYearList(10, 0).sort(function(a, b){return b.year - a.year});
  }

  get f() {
    return this.formImport.controls;
  }

  ngOnInit() {
    this.buildForms({massGroupYear: this.currentDate.getFullYear()});
  }

  buildForms(data) {
    this.formImport = this.buildForm(data, this.formConfig);
    this.formImport.addControl('fileImport', new FileControl(null, ValidationService.required));
  }

  processDownloadTemplate() {
    this.formImport.controls['fileImport'].clearValidators();
    this.formImport.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    let params = this.formImport.value;
    delete params['fileImport'];
    this.massGroupService.downloadTemplateImport(params).subscribe(res => {
      saveAs(res, 'Danh_sach_to_cong_tac_quan_chung.xls');
    });
  }

  processImport() {
    this.formImport.controls['fileImport'].setValidators(ValidationService.required);
    this.formImport.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.massGroupService.processImport(this.formImport.value).subscribe(res => {
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

  cancel() {
    this.activeModal.close();
  }

}
