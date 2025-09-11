import { APP_CONSTANTS } from './../../../core/app-config';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { CategoryService } from '@app/core/services/setting/category.service';
import { MassGroupService } from '@app/core/services/mass-group/mass-group.service';

@Component({
  selector: 'mass-group-form',
  templateUrl: './mass-group-form.component.html'
})
export class MassGroupFormComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  formConfig = {
    massGroupId: [''],
    massGroupYear: [new Date().getFullYear(), ValidationService.required],
    employeeId: [null, ValidationService.required],
    categoryIdList: ['', ValidationService.required],
    note: ['']
  };
  categoryList: Array<any>;
  yearList: Array<any>;
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  isEdit: boolean = false;
  constructor(
    public activeModal: NgbActiveModal,
    private categoryService: CategoryService,
    private massGroupService: MassGroupService
  ) {
    super(null, CommonUtils.getPermissionCode('resource.massGroup'));
    this.yearList = this.getYearList();
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.MASS_GROUP).subscribe(res => {
      this.categoryList = res.data;
    });
    this.formSave = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {
  }

  setFormValue(data) {
    if (data) {
      if (data.massGroupId && data.massGroupId > 0) {
        this.isEdit = true
      }
      this.formSave = this.buildForm(data, this.formConfig);
    }
  }

  get f() {
    return this.formSave.controls;
  }

  private getYearList() {
    const yearList = [];
    for (let i = (this.currentYear - 20); i <= (this.currentYear + 20); i++) {
      const obj = {
        year: i
      };
      yearList.push(obj);
    }
    return yearList;
  }

  processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.massGroupService.saveOrUpdate(this.formSave.value).subscribe(res => {
      if (this.massGroupService.requestIsSuccess(res)) {
        this.activeModal.close(res);
      }
    })
  }
}
