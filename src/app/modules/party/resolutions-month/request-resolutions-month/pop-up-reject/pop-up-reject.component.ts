import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { CategoryTypeService } from '@app/core/services/setting/category-type.service';
import { RequestResolutionMonthService } from '@app/core/services/party-organization/request-resolution-month.service';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'pop-up-reject',
  templateUrl: './pop-up-reject.component.html'
})
export class PopUpRejectComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  lstReason: any;
  formConfig = {
    responseResolutionsMonthId: [''],
    reason: ['', [Validators.required]],
  };
  public partyOrgSelector;
  constructor(
    private categoryTypeService: CategoryTypeService,
    private app: AppComponent,
    public activeModal : NgbActiveModal,
    private requestResolutionMonthService: RequestResolutionMonthService, 
    ) {
    super(null);
    this.formSave = this.buildForm({}, this.formConfig);
  }

  ngOnInit () {
  }

  get f () {
    return this.formSave.controls;
  }

    /**
   * actionLazyRead
   * @ param event
   */
  rejectResponse() {
    if(!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.requestResolutionMonthService.sendRejectResponse(this.formSave.value)
      .subscribe(res => {
        if (this.requestResolutionMonthService.requestIsSuccess(res)) {
            this.activeModal.close(res);
         }
       });
  }

  setResponseResolutionsMonthId(responseId){
    this.formSave.controls['responseResolutionsMonthId'].setValue(responseId);
  }
}
