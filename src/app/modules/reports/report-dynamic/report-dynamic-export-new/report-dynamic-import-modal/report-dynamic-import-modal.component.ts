import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { ValidationService } from '@app/shared/services/validation.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportDynamicImportService } from '../../report-dynamic.import.service';
import { HrStorage } from '@app/core/services/HrStorage';

@Component({
  selector: 'report-dynamic-import-modal',
  templateUrl: './report-dynamic-import-modal.component.html',
  styleUrls: ['./report-dynamic-import-modal.component.css']
})
export class ReportDynamicImportModalComponent extends BaseComponent implements OnInit {
  public formImport: FormGroup;
  public dataError: any;
  public yearList: Array<any>;
  formConfig = {
    partyOrganizationId: ['', [ValidationService.required]],
  }
  isDisabled: boolean = false;

  constructor(private reportDynamicImportService: ReportDynamicImportService,
    private app: AppComponent,
    private activeModal: NgbActiveModal) {
    super(null, CommonUtils.getPermissionCode("resource.partyCriticize"));
    this.setMainService(reportDynamicImportService);
    this.formImport = this.buildForm({}, this.formConfig);
    this.formImport.addControl('fileImport', new FileControl(null, ValidationService.required));

  }
  ngOnInit() {
    this.formImport.value.partyOrganizationId = 1;
  }

  get f() {
    return this.formImport.controls;
  }
  /**
   * file template
   */
  processDownloadTemplate() {
    if(this.isDisabled){
      return;
    }
    this.reportDynamicImportService.downloadTemplateImport().subscribe(res => {
      saveAs(res, 'report_template.xls');
    });
  }
  /**
   * import
   */
  processImport() {
    this.formImport.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    this.isDisabled = true;
    this.app.confirmMessage(null, () => {// on accepted

      this.reportDynamicImportService.importOfficers(this.formImport.value).subscribe({
        next: res => {
          if (res.type !== 'SUCCESS') {
            this.dataError = res.data;
            this.isDisabled = false;
          } else {
            this.dataError = null;
            this.isDisabled = false;
            this.goBack();
          }
        },
        error: (e) => {
          this.isDisabled = false;
        }
      });

    }, () => {
      this.isDisabled = false;
      // on rejected
    });
  }
  
  public onChangePartyOrg(data, partyOrgSelect) {}

  public goBack() {
    this.activeModal.close()
  }
}
