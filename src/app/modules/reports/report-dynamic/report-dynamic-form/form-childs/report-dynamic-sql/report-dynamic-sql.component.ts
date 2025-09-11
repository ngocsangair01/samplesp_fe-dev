import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ACTION_FORM } from '@app/core';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { SortEvent } from 'primeng/api';
import { group } from 'console';

@Component({
  selector: 'report-dynamic-sql',
  templateUrl: './report-dynamic-sql.component.html',
  styles: []
})
export class ReportDynamicSqlComponent extends BaseComponent implements OnInit {
  numIndex = 1;
  formSql: FormArray;

  constructor(public actr: ActivatedRoute) {
    super(actr, CommonUtils.getPermissionCode("resource.reportDynamic"), ACTION_FORM.INSERT);
    this.buildFormSql();
  }

  ngOnInit() {
  }

  /**
   * initSqlForm: form Parent call formChild
   */
  public initSqlForm(actionForm: any, propertyConfigs: any, listTemplateSql?: any) {
    this.actionForm = actionForm;
    this.propertyConfigs = propertyConfigs;
    this.buildFormSql(listTemplateSql);
  }

  /**
   * makeDefaultForm
   */
  private makeDefaultForm(): FormGroup {
    const group = {
      reportDynamicId: [null],
      templateSqlId: [null],
      sql: [null],
      sortOrder: [this.numIndex],
      isAppendFilter: [1],
      groupByColumn: [null, [ValidationService.maxLength(255)]],
      rowGroupBy: [null, [ValidationService.positiveInteger, ValidationService.maxLength(2)]],
      pivotColumn: [null, [ValidationService.maxLength(255)]]
    };
    return this.buildForm({}, group);
  }

  public buildFormSql(listTemplateSql?: any) {
    const controls = new FormArray([]);
    if (!listTemplateSql || listTemplateSql.length === 0) {
      const group = this.makeDefaultForm();
      controls.push(group);
    } else {
      for (const i in listTemplateSql) {
        const param = listTemplateSql[i];
        const group = this.makeDefaultForm();
        group.patchValue(param);
        controls.push(group);
      }
    }
    this.formSql = controls;
  }

  /**
   * addGroup
   * param index
   * param item
   */
  public addGroup(index: number, item: FormGroup) {
    const controls = this.formSql as FormArray;
    this.numIndex++;
    controls.insert(index + 1, this.makeDefaultForm());
    for (let i = index + 1; i < controls.length; i++) {
      controls.controls[i].get("sortOrder").setValue(i + 1);
    }
    this.sortDataTable();
  }

    /**
   * removeGroup
   * param index
   * param item
   */
  public removeGroup(index: number, item: FormGroup) {
    const controls = this.formSql as FormArray;
    if (controls.length === 1) {
      this.formSql.reset();
      const group = this.makeDefaultForm();
      const control = new FormArray([]);
      control.push(group);
      this.formSql = control;
      return;
    }
    controls.removeAt(index);
    if (index != controls.length) {
      for (let i = index; i < controls.length; i++) {
        controls.controls[i].get("sortOrder").setValue(i + 1);
      }
    }
    this.numIndex--;
  }

  public goUp(item: FormGroup) {
    const idx = parseInt(item.controls['sortOrder'].value) - 1;
    this.formSql.controls[idx - 1].get("sortOrder").setValue(idx + 1);
    item.controls['sortOrder'].setValue(idx);
    this.sortDataTable();
  }

  public goDown(item: FormGroup) {
    const idx = parseInt(item.controls['sortOrder'].value) + 1;
    this.formSql.controls[idx - 1].get("sortOrder").setValue(idx - 1);
    item.controls['sortOrder'].setValue(idx);
    this.sortDataTable();
  }
  private sortDataTable() {
    const _event = {
      data: this.formSql.controls,
      field: 'sortOrder',
      mode: 'single',
      order: 1
    };
    this.customSort(_event);
  }

  /**
   * Xu ly check box ton tai duy nhat
   */
  checkOnly(e, index, formControlName) {
    if (e.target.checked) {
      const controls = this.formSql as FormArray;
      for (let i = 0; i < controls.length; i++) {
        if (index !== i) {
          controls.controls[i].get(formControlName).setValue(false);
        }
      }
    }
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      const value1 = data1.value[event.field];
      const value2 = data2.value[event.field];
      let result = null;

      if (value1 == null && value2 != null) {
        result = -1;

      } else if (value1 != null && value2 == null) {
        result = 1;
      } else if (value1 == null && value2 == null) {
        result = 0;
      } else {
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
      }
      return (event.order * result);
    });
  }
}