import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormGroup } from '@angular/forms';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '@app/app.component';
import { KeyProjectService } from '@app/core/services/security/key-project.service';
import { ACTION_FORM } from '@app/core';

@Component({
  selector: 'key-project-confirm',
  templateUrl: './key-project-confirm.component.html',
})
export class KeyProjectConfirmComponent extends BaseComponent implements OnInit {
  @Input() public keyProjectId;
  public formUnApprove: FormGroup;
  formConfig = {
    keyProjectId: [null],
    reason: ['', [ValidationService.required, ValidationService.maxLength(500)]],
  };

  constructor(
    public activeModal: NgbActiveModal,
    private keyProjectService: KeyProjectService,
    private app: AppComponent
  ) {
    super();
    this.buildForms({});
  }

  private buildForms(data?: any): void {
    this.formUnApprove = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, []);
  }

  get f() {
    return this.formUnApprove.controls;
  }

  ngOnInit() {
  }

  public actionSave() {
    if (!CommonUtils.isValidForm(this.formUnApprove)) {
      return;
    }
    this.app.confirmMessage("transferPartyMembers.confirm", () => { // on accepted
      this.formUnApprove.get('keyProjectId').setValue(this.keyProjectId);
      this.keyProjectService.reasonUnApprove(this.formUnApprove.value)
        .subscribe(res => {
          if (this.keyProjectService.requestIsSuccess(res)) {
            this.activeModal.close(res);
          }
        });
    }, () => {
      // on rejected
    });
  }
}