import { AppComponent } from '@app/app.component';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Component, OnInit } from '@angular/core';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PrivateStandardPositionGroupService } from '@app/core/services/setting/private-standard_position_group.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';

@Component({
  selector: 'private-standard-position-group-form',
  templateUrl: './private-standard-position-group-form.component.html',
  styleUrls: ['./private-standard-position-group-form.component.css']
})
export class PrivateStandardPositionGroupFormComponent extends BaseComponent implements OnInit {
  groupOrgPositionId: Number;
  standardTypeList: [];
  formSave: FormGroup;
  formConfig = {
    privateStandardPositionGroupId: [''],
    groupOrgPositionId: [''],
    standardType: ['', [ValidationService.required]],
    name: ['', [ValidationService.required, ValidationService.maxLength(200)]],
    effectiveDate: [null, [ValidationService.required]],
    expiredDate: [null],
    description: [null, [ValidationService.maxLength(60000)]],
    sortOrder: ['', [ValidationService.positiveInteger, ValidationService.maxLength(4)]],
  };

  constructor(
    public actr: ActivatedRoute,
    public activeModal: NgbActiveModal,
    private categoryService: CategoryService,
    private privateStandardPositionGroupService: PrivateStandardPositionGroupService,
    private app: AppComponent
  ) {
    super();
    this.formSave = this.buildForm({}, this.formConfig, ACTION_FORM.INSERT,
      [ValidationService.notAffter('effectiveDate', 'expiredDate', 'generalStandard.expritedDate')]);
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.PRIVATE_STANDARD_TYPE).subscribe(res => {
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
      this.privateStandardPositionGroupService.saveOrUpdate(this.formSave.value)
        .subscribe(res => {
          if (this.privateStandardPositionGroupService.requestIsSuccess(res)) {
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
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT,
      [ValidationService.notAffter('effectiveDate', 'expiredDate', 'generalStandard.expiredDate')]);
  }
}