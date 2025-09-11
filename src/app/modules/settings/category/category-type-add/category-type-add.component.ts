import { CommonUtils } from './../../../../shared/services/common-utils.service';
import { AppComponent } from './../../../../app.component';
import { CategoryTypeService } from './../../../../core/services/setting/category-type.service';
import { BaseComponent } from './../../../../shared/components/base-component/base-component.component';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ValidationService } from '@app/shared/services';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'category-type-add',
  templateUrl: './category-type-add.component.html',
  styleUrls: ['./category-type-add.component.css']
})
export class CategoryTypeAddComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  formConfig = {
    categoryTypeId: [''],
    code: ['', [ValidationService.required, ValidationService.maxLength(50)]],
    name: ['', [ValidationService.required, ValidationService.maxLength(200)]]
  };
  constructor(
    public actr: ActivatedRoute,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private categoryTypeService: CategoryTypeService,
    private app: AppComponent
  ) {
    super();
    this.formSave = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {
  }

  /**
   * processSaveOrUpdate
   */
  processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }

    this.app.confirmMessage(null, () => {// on accepted
      this.categoryTypeService.saveOrUpdate(this.formSave.value)
      .subscribe(res => {
        if (this.categoryTypeService.requestIsSuccess(res) ) {
          this.activeModal.close(res);
        }
      });
      }, () => {// on rejected
    });
  }
  get f () {
    return this.formSave.controls;
  }

  private buildForms(data?: any) {
    this.formSave = this.buildForm(data, this.formConfig);
  }
  /**
   * setFormValue
   * param data
   */
  public setFormValue(propertyConfigs: any, data: any) {
    this.propertyConfigs = propertyConfigs;
    this.buildForms(data);
  }
}
