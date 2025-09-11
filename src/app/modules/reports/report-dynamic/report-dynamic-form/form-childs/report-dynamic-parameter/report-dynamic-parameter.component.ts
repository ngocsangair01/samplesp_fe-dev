import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ACTION_FORM, SYSTEM_PARAMETER_CODE } from '@app/core';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { AppParamService } from '@app/core/services/app-param/app-param.service';

@Component({
  selector: 'report-dynamic-parameter',
  templateUrl: './report-dynamic-parameter.component.html',
  styles: []
})
export class ReportDynamicParameterComponent extends BaseComponent implements OnInit {
  formParameter: FormArray;
  listDataType = [];

  constructor(public actr: ActivatedRoute, public appParamService: AppParamService) {
    super(actr, CommonUtils.getPermissionCode("resource.reportDynamic"), ACTION_FORM.INSERT);
    this.buildFormParameter();
    this.loadReference();
  }

  ngOnInit() {
  }

  private loadReference() {
    this.appParamService.findByName(SYSTEM_PARAMETER_CODE.REPORT_DYNAMIC_CONDITION_TYPE)
      .subscribe(res => this.listDataType = res.data);
  }

  /**
   * initParameterForm: form Parent call formChild
   */
  public initParameterForm(actionForm: any, propertyConfigs: any, listTemplateParameter?: any) {
    this.actionForm = actionForm;
    this.propertyConfigs = propertyConfigs;
    this.buildFormParameter(listTemplateParameter);
  }

  /**
   * makeDefaultForm
   */
  private makeDefaultForm(): FormGroup {
    const group = {
      reportDynamicId: [null],
      reportParameterId: [null],
      parameterCode: [null, [ValidationService.maxLength(200)]],
      parameterName: [null, [ValidationService.maxLength(200)]],
      dataType: [null],
      isRequire: [null],
      description: [null, [ValidationService.maxLength(500)]],
      sqlCondition: [null],
    };
    return this.buildForm({}, group);
  }

  public buildFormParameter(listTemplateParameter?: any) {
    const controls = new FormArray([]);
    if (!listTemplateParameter || listTemplateParameter.length === 0) {
      const group = this.makeDefaultForm();
      controls.push(group);
    } else {
      for (const i in listTemplateParameter) {
        const param = listTemplateParameter[i];
        const group = this.makeDefaultForm();
        group.patchValue(param);
        // group.patchValue(this.emp);
        controls.push(group);
      }
    }
    this.formParameter = controls;
  }

  /**
   * addGroup
   * param index
   * param item
   */
  public addGroup(index: number, item: FormGroup) {
    const controls = this.formParameter as FormArray;
    controls.insert(index + 1, this.makeDefaultForm());
  }
  /**
   * removeGroup
   * param index
   * param item
   */
  public removeGroup(index: number, item: FormGroup) {
    const controls = this.formParameter as FormArray;
    if (controls.length === 1) {
      this.formParameter.reset();
      const group = this.makeDefaultForm();
      const control = new FormArray([]);
      control.push(group);
      this.formParameter = control;
      return;
    }
    controls.removeAt(index);
  }
}