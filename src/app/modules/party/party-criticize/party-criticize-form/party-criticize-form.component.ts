import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS } from '@app/core/app-config';
import { PartyCriticizeService } from '@app/core/services/party-organization/party-criticize.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'party-criticize-form',
  templateUrl: './party-criticize-form.component.html'
})
export class PartyCriticizeFormComponent extends BaseComponent implements OnInit {

  formSave: FormGroup;
  public listYear: any;
  public listCriticizeType = APP_CONSTANTS.CRITICIZE_TYPE;
  formConfig = {
    partyCriticizeId: [''],
    partyOrganizationId: ['', [ValidationService.required]],
    year: [new Date().getFullYear(), [ValidationService.required]],
    criticizeType: ['', [ValidationService.required]],
    groupNumber: ['', [ValidationService.positiveInteger, ValidationService.required, Validators.max(4294967295)]],
    personalNumber: ['', [ValidationService.positiveInteger, ValidationService.required, Validators.max(4294967295)]],
    note: ['', [ValidationService.maxLength(1000)]]
  }

  constructor(
    public activeModal: NgbActiveModal,
    private app: AppComponent,
    private partyCriticizeService: PartyCriticizeService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyCriticize"));
    this.formSave = this.buildForm({}, this.formConfig);
    this.listYear = this.getYearList();
  }

  ngOnInit() {
  }

  get f() {
    return this.formSave.controls;
  }

  private getYearList() {
    this.listYear = [];
    const currentYear = new Date().getFullYear();
    for (let i = (currentYear - 50); i <= (currentYear + 10); i++) {
      const obj = {
        year: i
      };
      this.listYear.push(obj);
    }
    return this.listYear;
  }

  /**
    * processSaveOrUpdate
    */
  processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.app.confirmMessage(null, () => { // on accepted
      this.partyCriticizeService.saveOrUpdate(this.formSave.value)
        .subscribe(res => {
          if (this.partyCriticizeService.requestIsSuccess(res)) {
            this.activeModal.close(res);
          }
        });
    }, () => {
    });
  }

  /**
    * setFormValue
    * param data
    */
  public setFormValue(propertyConfigs: any, data?: any) {
    this.propertyConfigs = propertyConfigs;
    if (data && data.partyCriticizeId > 0) {
      this.formSave = this.buildForm(data, this.formConfig);
    } else {
      this.formSave = this.buildForm({}, this.formConfig);
    }
  }
}
