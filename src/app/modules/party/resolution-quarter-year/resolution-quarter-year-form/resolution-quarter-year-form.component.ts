import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ResponseResolutionQuarterYearService } from '@app/core/services/party-organization/request-resolution-quarter-year.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'resolution-quarter-year-form',
  templateUrl: './resolution-quarter-year-form.component.html'
})
export class ResolutionQuarterYearFormComponent extends BaseComponent implements OnInit {

  formSave: FormGroup;
  isMobileScreen: boolean = false;
  formConfig = {
    requestResolutionsId: [''],
    organizationId: ['', [ValidationService.required]],
    resolutionsNumber: ['', [ValidationService.required, ValidationService.maxLength(100)]],
    resolutionsName: ['', [ValidationService.required, ValidationService.maxLength(200)]],
    finishDate: ['', [ValidationService.required, ValidationService.afterCurrentDate]]
  };

  constructor(
    public actr: ActivatedRoute,
    private app: AppComponent,
    public activeModal: NgbActiveModal,
    public responseResolutionQuarterYearService: ResponseResolutionQuarterYearService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.requestResolutionQuarterYear"));
    this.buildForms({});
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
  }

  get f() {
    return this.formSave.controls;
  }

  /**
   * Action insert or update
   */
  public processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }

    this.app.confirmMessage(null, () => { // on accepted
      this.responseResolutionQuarterYearService.saveOrUpdate(this.formSave.value).subscribe(res => {
        if (this.responseResolutionQuarterYearService.requestIsSuccess(res)) {
          this.activeModal.close(res);
        }
      });
    }, () => {
      // on rejected   
    }
    );
  }

  /**
   * Set form value after pop-up
   * @param data 
   */
  private setFormValue(data) {
    if (data && data.requestResolutionsId > 0) {
      this.buildForms(data);
    } else {
      this.buildForms(data);
    }
  }

  public buildForms(data) {
    this.formSave = this.buildForm(data, this.formConfig);
  }

}
