import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { APP_CONSTANTS } from '@app/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslationService } from 'angular-l10n';

@Component({
  selector: 'mass-criteria-response-view',
  templateUrl: './mass-criteria-response-view.component.html'
})
export class MassCriteriaResponseViewComponent extends BaseComponent implements OnInit {
  @Input() public branch;
  @Input() public data;
  listStatus = APP_CONSTANTS.MASS_CRITERIA_RESPONSE_TYPE;
  formSave: FormGroup;
  formConfig = {
    massCriteriaResponseId: [''],
    massOrganizationId: ['', [ValidationService.required]],
    branch: [''],
    status: [''],
    content: [''],
  };

  public isSignVoffice: string = this.translation.translate('massRequest.mustNotSign');;
  public isChecked: boolean = false;
  constructor(public actr: ActivatedRoute,
    public activeModal: NgbActiveModal,
    public translation: TranslationService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.massRequestCriteria"));
    this.buildForms({});
  }

  ngOnInit() {
    this.setFormValue(this.data);
  }

  public buildForms(data?: any) {
    this.formSave = this.buildForm(data, this.formConfig);
  }

  get f() {
    return this.formSave.controls;
  }

  /**
   * Set form value after pop-up
   * @param data 
   */
  private setFormValue(data) {
    if (data && data.massCriteriaResponseId > 0) {
      this.buildForms(data);
    }
  }
}
