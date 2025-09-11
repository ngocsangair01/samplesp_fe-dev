import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, SYSTEM_PARAMETER_CODE } from '@app/core';
import { FileControl } from '@app/core/models/file.control';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { WarningManagerService } from '@app/modules/reports/warning-manager/warning-manager.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ValidationService } from '@app/shared/services';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { WarningDynamicColumnComponent } from './form-childs/warning-dynamic-column/warning-dynamic-column.component';

@Component({
  selector: 'create-warning',
  templateUrl: './create-warning.component.html'
})
export class CreateWarningComponent extends BaseComponent implements OnInit {
  @ViewChild('column')
  public columnForm: WarningDynamicColumnComponent;
  formSave: FormGroup;
  private fb: FormBuilder
  dataWarningManage: any;
  formCreateList: FormArray;
  @Input() item: any;
  isStatusExport = true;
  isFlag = false;
  listDataType: any;
  branchList: any;
  view: boolean;
  update: boolean;
  disabledSql: boolean = null;
  formCreate = {
    columnName: [''],
    dataType: [''],
    aliasName: ['']
  }
  formConfig = {
    warningManagerId: [''],
    code: ['', [ValidationService.required, ValidationService.maxLength(100), Validators.pattern(/^([A-z0-9!@#$%^&*().,<>{}[\]<>?_=+\-|;:\'\"\/])*[^\s]\1*$/)]],
    name: ['', [ValidationService.required, ValidationService.maxLength(250)]],
    resourceCode: ['', [ValidationService.required, ValidationService.maxLength(100)]],
    status: [1],
    warningType: [1],
    url: [''],
    branchCode: ['', [ValidationService.required]],
    tableCellWarningInfo: ['', ValidationService.required]
  };
  constructor(public actr: ActivatedRoute
    , private router: Router
    , private warningManagerService: WarningManagerService
    , private activatedRoute: ActivatedRoute
    , public appParamService: AppParamService
    , private app: AppComponent) {
    super(actr, CommonUtils.getPermissionCode("resource.warningManager"));
    this.buildCreateForm(null);
    this.formSave = this.buildForm({}, this.formConfig,
      ACTION_FORM.INSERT);
    this.formSave.addControl('file', new FileControl(null, ValidationService.required));
    this.formSave.controls['lstFormSql'] = new FormArray([]);
    this.formSave.removeControl('url');
    this.formSave.addControl('url', new FormControl(null));
    const params = this.activatedRoute.snapshot.params;
    if (params.warningManagerId) {
      this.warningManagerService.findOne(params.warningManagerId).subscribe(
        res => {
          this.isFlag = false;
          const data = res.data;
          if (res.data.warningType === 1) {
            this.isStatusExport = true;
            this.changeUrl(res.data.warningType);
          } else {
            this.isStatusExport = false;
            this.changeUrl(res.data.warningType);
          }
          this.dataWarningManage = data;
          this.buildForms(data, ACTION_FORM.UPDATE);
          this.formSave.addControl('file', new FileControl(null));
          if (res.data && res.data.fileAttachment) {
            (this.formSave.controls['file'] as FileControl).setFileAttachment(res.data.fileAttachment.warningManagerFile);
          }
          let formSql = new FormArray([]);
          data.lstFormSql.forEach(e => {
            if (!CommonUtils.isNullOrEmpty(e)) {
              formSql.push(new FormControl(e));
            }
          })
          this.formSave.controls['lstFormSql'] = formSql;
          this.columnForm.initColumnForm(ACTION_FORM.UPDATE, this.propertyConfigs, res.data.lstWarningManagerColumn);

        }
      );
    } else {
      this.isFlag = true;
    }
    this.loadReference()
    this.warningManagerService.getListBranchCode().subscribe(
      res => {
        this.branchList = res;
      }
    )
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length === 5) {
      if (subPaths[3] === "view") {
        this.view = true;
        this.disabledSql = true;
      } else if (subPaths[3] === "edit") {
        this.update = true;
      }
    }

  }

  /**
   * processSaveOrUpdate
   */
  processSaveOrUpdate() {
    let arrayControl = this.formSave.controls['lstFormSql'] as FormArray;
    let sqlWarning = [];
    for (let i = 0; i < arrayControl.length; i++) {
      sqlWarning.push(arrayControl.at(i).value);
    }
    const reqData = this.formSave.value;
    if (this.isStatusExport) {
      reqData.lstWarningManagerColumn = this.columnForm.formColumn.value;
      if (this.columnForm) {
        const formColumn = CommonUtils.isValidForm(this.columnForm.formColumn);
        if (!formColumn) {
          return;
        }
      }
    }
    reqData.lstFormSql = sqlWarning;
    let checkFormSave = false;
    for (let i in this.formSave.controls) {
      if (!CommonUtils.isValidForm(this.formSave.controls[i])) {
        checkFormSave = true;
      };
    }
    if (checkFormSave) {
      return;
    } else {
      this.app.confirmMessage(null, () => {// on accepted
        this.warningManagerService.saveOrUpdateFormFile(reqData)
          .subscribe(res => {
            if (this.warningManagerService.requestIsSuccess(res)) {
              return this.router.navigate(['reports/warning-manager']);
            }
          });
      }, () => {// on rejected
      });
    }
  }

  /****************** CAC HAM COMMON DUNG CHUNG ****/
  get f() {
    return this.formSave.controls;
  }

  /**
   * buildForm
   */
  private buildForms(data?: any, actionForm?: ACTION_FORM): void {
    this.formSave = this.buildForm(data, this.formConfig, actionForm);
    const filesControl = new FileControl(null);
    if (data && data.fileAttachment) {
      if (data.fileAttachment.documentFile) {
        filesControl.setFileAttachment(data.fileAttachment.documentFile);
      }
    }
  }

  cancel() {
    return this.router.navigate(['reports/warning-manager']);
  }

  changeUrl(value: number) {
    if (value === 1) {
      this.formSave.removeControl('url');
      this.formSave.addControl('url', new FormControl(null));
      this.formSave.removeControl('file')
      this.formSave.addControl('file', new FileControl(null, ValidationService.required))
      this.isStatusExport = true;
    } else {
      this.formSave.removeControl('file')
      this.formSave.addControl('file', new FileControl(null))
      this.formSave.removeControl('url');
      this.formSave.addControl('url', new FormControl(null, ValidationService.required));
      this.isStatusExport = false;
    }
  }

  changeCodeResource() {
    if (this.formSave.get('branchCode').value && this.formSave.get('code').value) {
      this.formSave.get('resourceCode').setValue(this.formSave.get('branchCode').value + "_" + this.formSave.get('code').value.trim())
    } else {
      this.formSave.get('resourceCode').setValue("")

    }
  }
  private makeCreateForm(): FormGroup {
    const formGroup = this.buildForm({}, this.formCreate);
    // formGroup.setValidators(ValidationService.requiredControlInGroup(['yearStartPlan', 'categoryTypeId', 'fieldOfTrainingId']));
    return formGroup;
  }

  public addCreateFormRow(index: number, item: FormGroup) {
    const controls = this.formCreateList as FormArray;
    controls.insert(index + 1, this.makeCreateForm());
  }

  public removeCreateFormRow(index: number, item: FormGroup) {
    const controls = this.formCreateList as FormArray;
    if (controls.length === 1) {
      this.buildForms();
      const group = this.makeCreateForm();
      controls.push(group);
      this.formCreateList = controls;
    }
    controls.removeAt(index);
  }

  private buildCreateForm(data?: any) {
    if (!data) {
      data = [{}];
    }
    const controls = new FormArray([]);
    for (const item of data) {
      const group = this.makeCreateForm();
      group.patchValue(item);
      controls.push(group);
    }
    this.formCreateList = controls;
  }

  private loadReference() {
    this.appParamService.findByName(SYSTEM_PARAMETER_CODE.REPORT_DYNAMIC_DATA_TYPE)
      .subscribe(res => {
        this.listDataType = res.data
      });
  }

  syncAlias() {
    let sqlWarning = [];
    let arrayControl = this.formSave.controls['lstFormSql'] as FormArray;
    for (let i = 0; i < arrayControl.length; i++) {
      sqlWarning.push(arrayControl.at(i).value);
    }

    let arrSql = sqlWarning;
    const that = this;
    let arrColumn = [];
    let i = 1;
    let length = arrSql.length;
    arrSql.forEach(function (item) {
      const params = CommonUtils.buildParams({ sql: item })
      that.warningManagerService.getColumn(params).subscribe(res => {
        if (res && res.length > 0) {
          res.forEach(function (item) {
            arrColumn.push({
              reportDynamicId: that.formSave.controls.warningManagerId.value,
              columnName: item.toUpperCase(),
              dataType: "STRING",
              sortOrder: i++,
              aliasName: item.toUpperCase()
            });
          });
          if (length !== 1) {
            length--;
          } else {
            that.columnForm.initColumnForm(ACTION_FORM.UPDATE, that.propertyConfigs, arrColumn);
          }
        }
      });
    });
  }
}
