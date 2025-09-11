import { AppComponent } from '@app/app.component';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Component, OnInit } from '@angular/core';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralStandardPositionGroupService } from '@app/core/services/setting/general-standard_position_group.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';

@Component({
  selector: 'general-standard-position-group-form',
  templateUrl: './general-standard-position-group-form.component.html',
  styleUrls: ['./general-standard-position-group-form.component.css']
})
export class GeneralStandardPositionGroupFormComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  standardTypeList: [];
  formConfig = {
    generalStandardPositionGroupId: [''],
    groupPositionId: [''],
    standardType: ['', [ValidationService.required]],
    code: ['', [ValidationService.required, ValidationService.maxLength(50)]],
    nameCat: ['', [ValidationService.required, ValidationService.maxLength(500)]],
    name: ['', [ValidationService.required, ValidationService.maxLength(200)]],
    effectiveDate: [null, [ValidationService.required]],
    expiredDate: [null],
    description: [null, [ValidationService.maxLength(60000)]],
    sortOrder: ['', [ValidationService.positiveInteger, ValidationService.maxLength(4)]],
  };

  constructor(
    public actr: ActivatedRoute,
    public activeModal: NgbActiveModal,
    private generalStandardPositionGroupService: GeneralStandardPositionGroupService,
    private app: AppComponent,
    private categoryService: CategoryService
  ) {
    super();
    this.formSave = this.buildForm({}, this.formConfig, ACTION_FORM.INSERT,
      [ValidationService.notAffter('effectiveDate', 'expiredDate', 'generalStandard.expritedDate')]);
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.GENERAL_STANDARD_TYPE).subscribe(res => {
      this.standardTypeList = res.data;
    });
  }

  ngOnInit() {
  }

  processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }

    this.app.confirmMessage(null, () => {// on accepted
      this.generalStandardPositionGroupService.saveOrUpdate(this.formSave.value)
        .subscribe(res => {
          if (this.generalStandardPositionGroupService.requestIsSuccess(res)) {
            this.activeModal.close(res);
          }
        });
    }, () => {// on rejected
    });
  }

  get f() {
    return this.formSave.controls;
  }

  public setFormValue(propertyConfigs: any, data?: any) {
    this.propertyConfigs = propertyConfigs;
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT,
      [ValidationService.notAffter('effectiveDate', 'expiredDate', 'generalStandard.expiredDate')]);
  }
}