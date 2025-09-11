import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { DocumentService } from '@app/core/services/document/document.service';
import { PartyTermiationService } from '@app/core/services/party-organization/party_termination';
import { CategoryService } from '@app/core/services/setting/category.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'manager-party-org-delete',
  templateUrl: './manager-party-org-delete.component.html',
  styleUrls: ['./manager-party-org-delete.component.css']
})
export class ManagerPartyOrgDeleteComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  lstReason: any;
  formConfig = {
    documentId: ['', ValidationService.required],
    partyOrganizationId: [''],
    partyDecisionName: [''],
    effectiveDate: [''],
    expiredDate: ['', [ValidationService.required, ValidationService.beforeCurrentDate]],
    reason: ['', ValidationService.required],
    description: ['']
  };

  constructor(
    private categoryService: CategoryService,
    public activeModal: NgbActiveModal,
    private partyTermiationService: PartyTermiationService,
    private documentService: DocumentService,
    public actr: ActivatedRoute,
    private app: AppComponent,
    private helperService: HelperService
  ) {
    super();
    this.setMainService(partyTermiationService);
    this.formSave = this.buildForm({}, this.formConfig, ACTION_FORM.UPDATE,
      [ValidationService.notBefore('expiredDate', 'effectiveDate', 'partyOrganization.noAfterEffect')]);
  }

  ngOnInit() {
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.LY_DO_CHAM_DUT_DANG).subscribe(res => {
      this.lstReason = res.data;
    });
  }

  get f() {
    return this.formSave.controls;
  }

  setPartyOrgIdAndEffectDate(id, date) {
    this.f.partyOrganizationId.setValue(id);
    this.f.effectiveDate.setValue(date);
  }

  filterDataDocument() {
    // set null lai
    this.f.partyDecisionName.setValue(null);
    this.documentService.findByNumber(this.formSave.controls['documentId'].value).subscribe(res => {
      if (this.documentService.requestIsSuccess(res)) {
        this.f.partyDecisionName.setValue(res.data.partyDecisionName);
      }
    });
  }

  validateBeforeSave() {
    if (CommonUtils.isValidForm(this.formSave)) {
      return true;
    }
    return false;
  }

  processSaveOrUpdate() {
    if (!this.validateBeforeSave()) {
      return;
    }
    this.app.confirmMessage('', () => {// on accept
      this.partyTermiationService.saveOrUpdate(this.formSave.value)
        .subscribe(res => {
          if (this.partyTermiationService.requestIsSuccess(res)) {
            this.helperService.reloadTreeParty('complete');
            this.activeModal.close(res);
          }
        });
    }, () => {// on rejected

    });
  }
}