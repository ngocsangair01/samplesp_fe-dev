import { Component, OnInit } from '@angular/core';
import {FormGroup} from "@angular/forms";
import {ValidationService} from "@app/shared/services";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/api";
import {EmpArmyProposedService} from "@app/core/services/employee/emp-army-proposed.service";
import {BaseComponent} from "@app/shared/components/base-component/base-component.component";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'preview-email-content-showmore',
  templateUrl: './preview-email-content-showmore.component.html',
  styleUrls: ['./preview-email-content-showmore.component.css']
})
export class PreviewEmailContentShowmoreComponent extends BaseComponent implements OnInit {
  form: FormGroup

  formConfig = {
    emailContent: [],
  }


  constructor(
      public ref: DynamicDialogRef,
      public config: DynamicDialogConfig,
  ) {
    super();
  }
  ngOnInit() {
    this.form = this.buildForm('', this.formConfig);
    if (this.config.data) {
      let value = {...this.config.data};
      this.form = this.buildForm(value, this.formConfig);
    }
  }

  goBack(){
    this.ref.close()
  }
}
