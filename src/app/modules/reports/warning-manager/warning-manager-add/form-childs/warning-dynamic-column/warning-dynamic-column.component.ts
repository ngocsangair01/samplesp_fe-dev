import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ACTION_FORM, SYSTEM_PARAMETER_CODE } from '@app/core';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { SortEvent } from 'primeng/api';

@Component({
  selector: 'warning-dynamic-column',
  templateUrl: './warning-dynamic-column.component.html',
  styles: []
})
export class WarningDynamicColumnComponent extends BaseComponent implements OnInit {
  formColumn: FormArray;
  listDataType = [];
  numIndex = 1;
  disabled : boolean;
  @Input()
  public disable: boolean;
  @Output() onRefresh: EventEmitter<any> = new EventEmitter();
  constructor(public actr: ActivatedRoute,
              public appParamService: AppParamService) {
    super(actr, CommonUtils.getPermissionCode("resource.warningManager"), ACTION_FORM.INSERT);
    this.buildFormColumn();
    this.loadReference();
  }
  private loadReference() {
    this.appParamService.findByName(SYSTEM_PARAMETER_CODE.REPORT_DYNAMIC_DATA_TYPE)
      .subscribe(res => this.listDataType = res.data);
  }
  ngOnInit() {
    if(this.disable){
      this.disabled = true;
    }
  }
  /**
   * initColumnForm: form Parent call formChild
   */
  public initColumnForm(actionForm: any, propertyConfigs: any, listTemplateColumn?: any) {
    this.actionForm = actionForm;
    this.propertyConfigs = propertyConfigs;
    this.buildFormColumn(listTemplateColumn);
  }
  /**
   * makeDefaultForm
   */
  private makeDefaultForm(): FormGroup {
    const group = {
      reportDynamicId: [null],
      reportColumnId: [null],
      columnName: [null, ValidationService.required],
      dataType: [null, ValidationService.required],
      width: [null],
      sortOrder: [this.numIndex],
      aliasName: [null, ValidationService.required]
    };
    return this.buildForm({}, group);
  }

  public buildFormColumn(listTemplateColumn?: any) {
    const controls = new FormArray([]);
    if (!listTemplateColumn || listTemplateColumn.length === 0) {
      const group = this.makeDefaultForm();
      controls.push(group);
    } else {
      for (const i in listTemplateColumn) {
        const param = listTemplateColumn[i];
        const group = this.makeDefaultForm();
        group.patchValue(param);
        controls.push(group);
      }
    }
    this.formColumn = controls;
  }

  private validateBeforeSave(): boolean {
    return CommonUtils.isValidForm(this.formColumn);
  }

  /**
   * addGroup
   * param index
   * param item
   */
  public addGroup(index: number, item: FormGroup) {
    const controls = this.formColumn as FormArray;
    this.numIndex++;
    controls.insert(index + 1, this.makeDefaultForm());
    this.sortDataTable();
  }
  /**
   * removeGroup
   * param index
   * param item
   */
  public removeGroup(index: number, item: FormGroup) {
    const controls = this.formColumn as FormArray;
    if (controls.length === 1) {
      this.formColumn.reset();
      this.numIndex = 1;
      const group = this.makeDefaultForm();
      const control = new FormArray([]);
      control.push(group);
      this.formColumn = control;
      return;
    }
    this.numIndex--;
    controls.removeAt(index);
    this.sortDataTable();
  }

  public goUp(item: FormGroup) {
    const idx = parseInt(item.controls['sortOrder'].value) - 1;
    for (const ctrl of this.formColumn.controls) {
      const ctrTmp = ctrl as FormGroup;
      if (parseInt(ctrTmp.controls['sortOrder'].value) === idx) {
        ctrTmp.controls['sortOrder'].setValue(idx + 1);
      }
    }
    item.controls['sortOrder'].setValue(idx);
    this.sortDataTable();
  }

  public goDown(item: FormGroup) {
    const idx = parseInt(item.controls['sortOrder'].value) + 1;
    for (const ctrl of this.formColumn.controls) {
      const ctrTmp = ctrl as FormGroup;
      if (parseInt(ctrTmp.controls['sortOrder'].value) === idx) {
        ctrTmp.controls['sortOrder'].setValue(idx - 1);
      }
    }
    item.controls['sortOrder'].setValue(idx);
    this.sortDataTable();
  }
  private sortDataTable() {
    const _event = {
      data: this.formColumn.controls,
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
      const controls = this.formColumn as FormArray;
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

  syncAlias() {
    this.onRefresh.emit();
  }
}

