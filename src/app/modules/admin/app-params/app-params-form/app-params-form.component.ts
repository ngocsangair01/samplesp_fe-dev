import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM } from '@app/core';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-params-form',
  templateUrl: './app-params-form.component.html',
  styleUrls: ['./app-params-form.component.css']
})
export class AppParamsFormComponent extends BaseComponent implements OnInit {
  formSave: any;
  formConfig = {
    parId: [''],
    parCode: ['', Validators.required],
    parName: ['', Validators.required],
    parType: [''],
    parValue: [''],
    description: [''],
    parOrder: ['', ValidationService.integer]
  }
  constructor(public activeModal: NgbActiveModal,
    private appParamsService: AppParamService,
    public actr: ActivatedRoute,
    public app: AppComponent,
    private helperService: HelperService) { 
    super(null, CommonUtils.getPermissionCode("resource.appParams"));
    this.setMainService(appParamsService);
    this.formSave = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {
  }

  // quay lai
  public goBack() {
    this.activeModal.close()
  }

  // them moi or sua
  processSaveOrUpdate() {
    // debugger
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.app.confirmMessage(null, () => { // on accept
      this.appParamsService.saveOrUpdate(this.formSave.value)
          .subscribe(res => {
            if (this.appParamsService.requestIsSuccess(res)) {
              this.helperService.reloadHeaderNotification('complete');
              this.activeModal.close(res);
            }
          });
       () => {

      }
    }, () => {
      // on rejected
    });
  }

  get f() {
    return this.formSave.controls;
  }

  public setFormValue(data?: any) {
    if (data) {
      this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.VIEW);
    }
  }
}
