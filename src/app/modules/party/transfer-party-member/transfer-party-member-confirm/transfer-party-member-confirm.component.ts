import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { AppComponent } from '@app/app.component';
import { TransferPartyMemberService } from '@app/core/services/party-organization/transfer-party-member.service';
import { PartyMemebersService } from '@app/core/services/party-organization/party-members.service';
import { ValidationService } from '@app/shared/services';
import { ACTION_FORM } from '@app/core';

@Component({
  selector: 'transfer-party-member-confirm',
  templateUrl: './transfer-party-member-confirm.component.html',
})
export class TransferPartyMemberConfirmComponent extends BaseComponent implements OnInit {
  @Input() public transferPartyMemberId;
  @Input() public employeeName;
  @Input() public employeeId;
  @Input() public isApprove;
  @Input() public isLastApprove;
  @Input() public partyOrgId;
  @Input() public partyType;
  public formData: FormGroup;
  public maxDate: Date;
  public minDate: Date;
  formConfigUnApprove = {
    transferPartyMemberId: [null],
    note: ['', [ValidationService.required, ValidationService.maxLength(1000)]],
  };
  formConfigApproveWithOrg = {
    transferPartyMemberId: [null],
    approvedDate: ['', [ValidationService.required]],
    partyOrgId: [null, [ValidationService.required]],
    partyType: ['', [ValidationService.required]],
  };
  formConfigApprove = {
    transferPartyMemberId: [null],
    approvedDate: ['', [ValidationService.required]],
    partyType: ['', [ValidationService.required]],
  };
  constructor(
    public activeModal: NgbActiveModal,
    private transferPartyMemberService: TransferPartyMemberService,
    private partyMemebersService: PartyMemebersService,
    private app: AppComponent
  ) {
    super();
    this.buildForms({});
  }

  private buildForms(data?: any): void {
    if(this.isApprove && this.isLastApprove && this.partyType == '2') {
      this.transferPartyMemberService.findProcessLast(this.employeeId).subscribe(res => {
        if (res.data) {
          const minDate = new Date(res.data.effectiveDate)
          this.minDate = new Date(minDate.setDate(minDate.getDate() + 1))
        }
      })
    }
    let formBuild;
    if (this.isApprove) {
      formBuild = this.isLastApprove && this.partyType == '1' ? this.formConfigApproveWithOrg : this.formConfigApprove;
      this.maxDate = new Date();
    } else {
      formBuild = this.formConfigUnApprove;
    }
    this.formData = this.buildForm(data, formBuild, ACTION_FORM.INSERT, []);
  }

  get f() {
    return this.formData.controls;
  }

  ngOnInit() {
    this.buildForms({approvedDate: new Date().getTime(), partyType: this.partyType});
  }

  public actionSave() {
    if (!CommonUtils.isValidForm(this.formData)) {
      return;
    }
    this.app.confirmMessage( this.isApprove ? "transferPartyMembers.confirmApproval" : "transferPartyMembers.confirm", () => { // on accepted
      this.formData.get('transferPartyMemberId').setValue(this.transferPartyMemberId);
      if(this.isApprove) {
        this.transferPartyMemberService.approved(this.formData.value)
        .subscribe(res => {
          if (this.transferPartyMemberService.requestIsSuccess(res)) {
            this.activeModal.close(res);
          }
        });
      } else {
        this.transferPartyMemberService.reasonUnApprove(this.formData.value)
          .subscribe(res => {
            if (this.transferPartyMemberService.requestIsSuccess(res)) {
              this.activeModal.close(res);
            }
          });
      }
    }, () => {
      // on rejected
    });
  }
}