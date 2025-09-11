import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { ImportResponsePolicyProgramService } from '@app/core/services/policy-program/import-response-policy-program.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'import-response-policy-program-add',
  templateUrl: './import-response-policy-program-add.component.html',
})
export class ImportResponsePolicyProgramAddComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  filterCondition: string = '';
  @Input() public organizationId;
  formConfig = {
    importResponsePolicyProgramId: [''],
    responsePolicyProgramId: [''],
    employeeId: ['', [ValidationService.required]],
    description: [null, [ValidationService.maxLength(1000)]]
  };
  constructor(
    private app: AppComponent,
    public activeModal: NgbActiveModal,
    private importResponsePolicyProgramService: ImportResponsePolicyProgramService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.requestPolicyProgram"));
    this.formSave = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {
    this.filterCondition = " AND obj.status = 1"
                         + " AND EXISTS (SELECT 1 FROM  organization o"
                         + "             WHERE o.organization_id = obj.organization_id"
                        + "               AND ( 0 = 1 OR o.path LIKE '%/" + this.organizationId + "/%'))"
  }

  processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }

    this.app.confirmMessage(null, () => {// on accepted
      this.importResponsePolicyProgramService.saveOrUpdate(this.formSave.value)
        .subscribe(res => {
          if (this.importResponsePolicyProgramService.requestIsSuccess(res)) {
            this.activeModal.close(res);
          }
        });
    }, () => {// on rejected
    });
  }

  get f() {
    return this.formSave.controls;
  }

  public setFormValue(data?: any) {
    this.formSave = this.buildForm(data, this.formConfig);
  }
}
