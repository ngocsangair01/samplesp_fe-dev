import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { ValidationService } from '@app/shared/services/validation.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RetiredContactService } from '@app/core/services/employee/retired-contact.service';

@Component({
  selector: 'retired-import-modal',
  templateUrl: './retired-import-modal.component.html',
  styleUrls: ['./retired-import-modal.component.css']
})
export class RetiredImportModalComponent extends BaseComponent implements OnInit {
  public formImport: FormGroup;
  public dataError: any;
  public yearList: Array<any>;
  formConfig = {
    partyOrganizationId: ['', [ValidationService.required]],
  }
  isDisabled: boolean = false;

  constructor(private retiredContactService: RetiredContactService,
              private app: AppComponent,
              private activeModal: NgbActiveModal) {
    super(null, CommonUtils.getPermissionCode("resource.partyCriticize"));
    this.setMainService(retiredContactService);
    this.formImport = this.buildForm({}, this.formConfig);
    this.formImport.addControl('fileImport', new FileControl(null, ValidationService.required));

  }
  ngOnInit() {
  }

  get f() {
    return this.formImport.controls;
  }

  /**
   * file template
   */
  processDownloadTemplate() {
    if (this.isDisabled) {
      return;
    }
    this.retiredContactService.downloadTemplateImport().subscribe(res => {
      saveAs(res, 'retired_template.xls');
    });
  }

  /**
   * import
   */
  processImport() {
    this.formImport.controls['fileImport'].updateValueAndValidity();

    this.isDisabled = true;
    this.app.confirmMessage(null, () => {
      const params = {
        ...this.formImport.value
      }
      this.retiredContactService.processImport(params).subscribe(res => {
        if (res.type == 'SUCCESS') {
          this.activeModal.close(res);
          this.dataError = null;
          this.app.successMessage(res.code, res.message);
          this.processSearch();
          this.isDisabled = false;
        }
        else {
          this.isDisabled = false;
          this.dataError = res.data;
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
