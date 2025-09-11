import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute} from '@angular/router';
import { FormGroup } from '@angular/forms';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { PartyAdmissionService } from '@app/core/services/party-admission/party-admission.service';

@Component({
  selector: 'file-import-party-management',
  templateUrl: './file-import-party-management.component.html'
})
export class FileImportPartyManagementComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  lstReason: any;
  formConfig = {
    massRequestId: [null],
    lstNodeCheck: [null],
    description: [null],
    fileImport: [null, ValidationService.required]
  };
  isPersonal: boolean;
  option: any;
  public dataError: any;
  public criteriaPlanTree;
  public massRequestId: any;

  constructor(
    public activeModal: NgbActiveModal,
    public actr: ActivatedRoute,
    private partyAdmissionService: PartyAdmissionService
  ) {
    super(null, 'REQUEST_RESOLUTION_QUARTER_YEAR');
    this.formSave = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {}

  get f() {
    return this.formSave.controls;
  }

  processDownloadTemplate() {
    this.partyAdmissionService.downloadTemplateImport().subscribe(res => {
      saveAs(res, 'DanhSachCamTinhDang.xls');
    });
  }

  public processImport() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.partyAdmissionService.processImport(this.formSave.value).subscribe(res => {
      if (res.type == 'SUCCESS') {
        this.activeModal.close(res);
        this.dataError = null;
      }
      else {
        this.dataError = res.data;
      }
    });
  }

  public setFormValue(propertyConfigs: any) {
    this.propertyConfigs = propertyConfigs;
  }
}
