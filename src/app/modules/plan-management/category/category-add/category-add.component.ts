import { AppComponent } from '@app/app.component';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Component, OnInit } from '@angular/core';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '@app/core/services/setting/category.service';

@Component({
  selector: 'category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.css']
})
export class CategoryAddComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  formConfig = {
    categoryId: [''],
    code: ['', [ValidationService.required, ValidationService.maxLength(50)]],
    name: ['', [ValidationService.required, ValidationService.maxLength(500)]],
    categoryTypeName: [''],
    categoryTypeId: [''],
    sortOrder: ['', [ValidationService.positiveInteger, ValidationService.maxLength(4)]],
    isDefault: [''],
    description: ['', [ValidationService.maxLength(4000)]]
  };
  constructor(
    public actr: ActivatedRoute,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private app: AppComponent
  ) {
    super();
    this.formSave = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {
  }

  processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }

    this.app.confirmMessage(null, () => {// on accepted
      this.categoryService.saveOrUpdate(this.formSave.value)
      .subscribe(res => {
        if (this.categoryService.requestIsSuccess(res)) {
          this.activeModal.close(res);
        }
      });
      }, () => {// on rejected
    });
  }

  get f () {
    return this.formSave.controls;
  }

  public setFormValue(propertyConfigs: any, data?: any) {
    this.propertyConfigs = propertyConfigs;
    this.formSave = this.buildForm(data, this.formConfig);
  }
}
