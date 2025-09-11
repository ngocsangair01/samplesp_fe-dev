import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { TransferPartyMemberService } from '@app/core/services/party-organization/transfer-party-member.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { AppComponent } from '@app/app.component';
import { PartyOrgSelectorComponent } from '@app/shared/components/party-org-selector/party-org-selector.component';
import { ACTION_FORM } from '@app/core';

@Component({
  selector: 'transfer-party-member-accept',
  templateUrl: './transfer-party-member-accept.component.html',
})
export class TransferPartyMemberAcceptComponent extends BaseComponent implements OnInit {
  rootId: Number;
  data: [];
  recordsTotal: any;
  resultList: any;
  formSave: FormGroup;
  formConfig = {
    transferPartyMemberId: [null, []],
    partyOrganizationId: ['', [ValidationService.required]],
  };
  @ViewChild('partyOrg') partyOrg: PartyOrgSelectorComponent;
  @Input() public transferPartyMemberId;
  
  constructor(
    public activeModal: NgbActiveModal,
    private app: AppComponent,
    public transferPartyMemberService: TransferPartyMemberService,
  ) {
    super();
  }

  get f() {
    return this.formSave.controls;
  }

  ngOnInit() {
    this.formSave = this.buildForm({ transferPartyMemberId: this.transferPartyMemberId }, this.formConfig, ACTION_FORM.INSERT, []);
    this.transferPartyMemberService.getPartyOrg(this.transferPartyMemberId).subscribe(res => {
      if (res != null || res != '') {
        this.rootId = res;
      }
    });
  }

  /**
   * processSaveOrUpdate
   */
  public processSaveOrUpdate() {
    const validateForm = CommonUtils.isValidFormAndValidity(this.formSave);
    if (!validateForm) {
      return;
    }
    this.app.confirmMessage(null, () => { // on accepted
      this.transferPartyMemberService.partyApprovalAccept(this.formSave.value).subscribe(res => {
        if (this.transferPartyMemberService.requestIsSuccess(res)) {
          this.activeModal.close(res);
        }
      });
    }, () => {
    });
  }

  public choosePartyAccept(event) {
    if (event) {
      let partyOrganizationId = event.partyOrganizationId;
      if (this.rootId == partyOrganizationId) {
        this.formSave.removeControl('partyOrganizationId');
        this.formSave.addControl('partyOrganizationId', new FormControl(partyOrganizationId, [ValidationService.notSelectedThisParty]));
        const validateForm = CommonUtils.isValidForm(this.formSave);
        if (!validateForm) {
          return;
        }
      } else if (this.rootId != partyOrganizationId) {
        this.formSave.removeControl('partyOrganizationId');
        this.formSave.addControl('partyOrganizationId', new FormControl(partyOrganizationId, [ValidationService.required]));
      }
    }
  }
}