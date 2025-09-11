import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { AppComponent } from '@app/app.component';
import { TransferPartyMemberService } from '@app/core/services/party-organization/transfer-party-member.service';
import { ValidationService } from '@app/shared/services';
import { ACTION_FORM } from '@app/core';

@Component({
  selector: 'transfer-party-member-confirm-cancel',
  templateUrl: './transfer-party-member-confirm-cancel.component.html',
  styleUrls: ['./transfer-party-member-confirm-cancel.component.css']
})
export class TransferPartyMemberConfirmCancelComponent extends BaseComponent implements OnInit {
  @Input() public transferPartyMemberId;
  @Input() public employeeName;
  public formCancelReason: FormGroup;
  formConfig = {
    transferPartyMemberId: [null],
    cancelStreamReason: ['', [ValidationService.required, ValidationService.maxLength(1000)]],
  };

  constructor(
    public activeModal: NgbActiveModal,
    private transferPartyMemberService: TransferPartyMemberService
    ,
    private app: AppComponent
  ) {
    super();
    this.buildForms({});
  }

  private buildForms(data?: any): void {
    this.formCancelReason = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, []);
  }

  get f() {
    return this.formCancelReason.controls;
  }

  ngOnInit() {
  }

  public actionSave() {
    if (!CommonUtils.isValidForm(this.formCancelReason)) {
      return;
    }
    this.app.confirmMessage('transferPartyMembers.cancelStream', () => { // accept
      this.formCancelReason.get('transferPartyMemberId').setValue(this.transferPartyMemberId);
      this.transferPartyMemberService.reasonCancelStream(this.formCancelReason.value).subscribe(res => {
        if (this.transferPartyMemberService.requestIsSuccess(res)) {
          this.activeModal.close(res);
        }
      })
    }, () => { // reject
    });
  }
}