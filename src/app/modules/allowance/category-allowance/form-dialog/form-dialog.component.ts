import { Component, OnInit } from '@angular/core';
import { BaseControl } from '@app/core/models/base.control';
import { DynamicDialogConfig } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/api';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { RequestReportService } from '@app/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormGroup } from '@angular/forms';
import { CatAllowanceService } from '@app/core/services/allowance/cat-allowance.service';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';

@Component({
  templateUrl: './form-dialog.component.html',
})
export class FormDialogComponent extends BaseComponent implements OnInit {

  formConfig = {
    id: [null],
    name: [null, ValidationService.required],
    subject: [null, ValidationService.required],
    gender: [null, ValidationService.required],
    scope: [null, ValidationService.required],
    isReceiveManyTimes: [null],
    isReceiveManyTimesValue: [null, ValidationService.required],
  }

  form: FormGroup

  subjectOptions = [
    { name: "Bản thân", value: "SELF" },
    { name: "Nhân thân", value: "RELATIVE" },
    { name: "Bản thân và nhân thân", value: "SELF_AND_RELATIVE" },
  ]

  genderOptions = [
    { name: "Tất cả", value: "ALL" },
    { name: "Nam", value: "MALE" },
    { name: "Nữ", value: "FEMALE" },
  ]

  scopeOptions = [
    { name: "Tất cả", value: "ALL" },
    { name: "Hợp đồng lao động", value: "HĐLĐ" },
  ]

  isReceiveManyTimesOptions = [
    { value: 'Y', label: 'Có'},
    { value: 'N', label: 'Không' }
  ]

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private service: CatAllowanceService,
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.buildForm('', this.formConfig)
    if (this.config.data) {
      this.bindingForm()
    }
  }

  bindingForm() {
    let value = { ...this.config.data };
    value.subject = this.subjectOptions.find(e => e.name = value.subject)
    value.gender = this.genderOptions.find(e => e.name = value.gender)
    value.scope = this.scopeOptions.find(e => e.name = value.scope)
    delete value.isActive
    this.form.setValue(value);
  }

  save() {
    if (CommonUtils.isValidForm(this.form)) {
      this.service.saveOrUpdate(this.getParam())
        .subscribe(res => {
          if (res.type == "SUCCESS")
            this.ref.close(true)
        })
    }
  }

  getParam() {
    let param = { ...this.form.value }

    if (param.subject) {
      param.subject = param.subject.value;
    }

    if (param.gender) {
      param.gender = param.gender.value;
    }

    if (param.scope) {
      param.scope = param.scope.value;
    }
    param.isReceiveManyTimes = param.isReceiveManyTimesValue
    return param;
  }
}
