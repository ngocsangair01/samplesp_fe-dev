import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { FileControl } from '@app/core/models/file.control';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { HrStorage } from '@app/core/services/HrStorage';
import { RewardThoughtReportService } from '@app/core/services/propaganda/reward-thought-report.service';
import { CategoryTypeService } from '@app/core/services/setting/category-type.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ValidationService } from '@app/shared/services/validation.service';
import { AppComponent } from '../../../../app.component';
import { CommonUtils } from '../../../../shared/services/common-utils.service';

@Component({
  selector: 'reward-thought-report-add',
  templateUrl: './reward-thought-report-add.component.html',
  styleUrls: ['./reward-thought-report-add.component.css']
})
export class RewardThoughtReportAddComponent extends BaseComponent implements OnInit {
  downLoadFile: Boolean;
  formSave: FormGroup;
  groupTypeOfExpressionList: any;
  typeOfExpressionList: any;
  unitHandleList: any;
  add: boolean;
  update: boolean = false;
  lstRewardCategory: any;
  propagandaRewardFormId: any;
  usecaseProcessId: any;
  employeeId: any;
  orgEovCode: any;
  listIdEmployeeNTN: any;
  eovListId: any;
  orgEovIdLogin: any;
  listIdFileRemove: number[] = [];
  operationKey = 'action.view';
  adResourceKey = 'resource.propagandaRewardThoughtReport';
  employeeFilterCondition = 'AND obj.status = 1';

  formconfig = {
    usecaseProcessId: [''],
    orgEovId: ['', ValidationService.required],
    employeeId: ['', ValidationService.required],
    eovListName: ['', [ValidationService.required, ValidationService.maxLength(200)]],
    eovTypeLevel: ['', ValidationService.required],
    eovTime: ['', [ValidationService.required, ValidationService.beforeCurrentDate]],
    description: ['', ValidationService.maxLength(500)],
    unitHandle: [''],
    employeeName: [''],
    reporter: [''],
    listDvgq: [''],
    eovListCode: [''],
    listDvgqRequired: ['', ValidationService.required],
    currentDate: [''],
  }
  checkEmplyee: boolean;
  listFormEovCategory: FormArray;
  formEovCategory = {
    code: [''],
    categoryId: ['',[ValidationService.required]],
    categoryTypeId: ['', [ValidationService.required]],
    typeOfExpressionList: [[]]
  };
  mapCategoryByExpressionList = {};

  constructor(
    private rewardThoughtReportService: RewardThoughtReportService,
    private appParamService: AppParamService,
    private categoryTypeService: CategoryTypeService,
    private router: Router,
    public actr: ActivatedRoute,
    private app: AppComponent,
    private fb: FormBuilder
  ) {
    super(null, CommonUtils.getPermissionCode("resource.propagandaRewardThoughtReport"));
    this.lstRewardCategory = APP_CONSTANTS.REWARDCATEGORYLIST;
    const params = this.actr.snapshot.params;
    if (params.id) {
      this.eovListId = params.id;
    }
    this.buildForms({});
    this.buildFormEovCategory();
    this.formSave.controls['listIdEmployeeNVVP'] = new FormArray([]);
    this.formSave.controls['listIdEmployeeNTN'] = new FormArray([]);
    this.formSave.controls['listIdEmployeeKNTN'] = new FormArray([]);
    this.formSave.controls['listIdOrgDVVP'] = new FormArray([]);
    this.formSave.controls['listDvgq'] = new FormArray([]);
    this.formSave.controls['listIdEmployeeLQ'] = new FormArray([]);
    this.formSave.get('currentDate').setValue(new Date().getTime());
    this.categoryTypeService.findByGroupId(APP_CONSTANTS.CATEGORY_TYPE_GROUP.BHTT).subscribe(res => {
      this.groupTypeOfExpressionList = res.data;
    });

    const employeeId = HrStorage.storedData().userToken.userInfo.employeeId;
    const fullName = HrStorage.storedData().userToken.userInfo.fullName;
    this.formSave.get('employeeId').setValue(employeeId);
    this.formSave.get('reporter').setValue(fullName);

    this.appParamService.getValueByCode(APP_CONSTANTS.APP_PARAM_CODE.VIP).subscribe(res => {
      if (res.data != null) {
        this.employeeFilterCondition += ' AND obj.employee_code NOT IN (' + res.data + ')';
      }
    });
  }

  get f() {
    return this.formSave.controls;
  }

  ngOnInit() {
    this.setFormValue(this.propagandaRewardFormId);
    const subPaths = this.router.url.split('/');
    if (subPaths.length >= 3) {
      if (subPaths[3] == 'add') {
        this.add = true;
        this.rewardThoughtReportService.findByUserLogin().subscribe(res => {
          this.orgEovIdLogin = res.organizationId;
          this.formSave.removeControl('orgEovId');
          this.formSave.addControl('orgEovId', new FormControl(this.orgEovIdLogin, [ValidationService.required]));
          // don vi giai quyet
          const param = CommonUtils.buildParams({ orgId: this.orgEovIdLogin });
          this.rewardThoughtReportService.getHandle(param).subscribe(resp => {
            if (resp.organizationId) {
              let data = [resp.organizationId];
              this.formSave.setControl('listDvgq', this.fb.array(data || []));
              this.rewardThoughtReportService.getNntn(resp.organizationId).subscribe(res => {
                this.formSave.setControl('listIdEmployeeNTN', this.fb.array(res.map(item => item.employeeId) || []));
              });
            }
          });
        });
      } else if (subPaths[3] == 'update') {
        this.formconfig.employeeId = ['']
        this.update = true;
        this.buildFormsDetail(this.eovListId);
      }
    }
  }

  private makeDefaultFormEovCategory(): FormGroup {
    const formGroup = this.buildForm({}, this.formEovCategory);
    return formGroup;
  }

  private buildFormEovCategory(list?: any) {
    if (!list || list.length == 0) {
      this.listFormEovCategory = new FormArray([this.makeDefaultFormEovCategory()]);
    } else {
      const controls = new FormArray([]);
      for (const i in list) {
        const formTableConfig = list[i];
        const group = this.makeDefaultFormEovCategory();
        group.patchValue(formTableConfig);
        controls.push(group);
      }
      controls.setValidators([
        ValidationService.duplicateArray(['categoryTypeId', 'categoryId'], 'categoryId', 'propaganda.thoughtReport.typeBehavior'),
      ]);
      this.listFormEovCategory = controls;
    }
  }

  public addRow(index: number, item: FormGroup) {
    const controls = this.listFormEovCategory as FormArray;
    controls.insert(index + 1, this.makeDefaultFormEovCategory());
  }

  public removeRow(index: number, item: FormGroup) {
    const controls = this.listFormEovCategory as FormArray;
    controls.removeAt(index);
    if (controls.length === 0) {
        this.buildFormEovCategory();
        const group = this.makeDefaultFormEovCategory();
        controls.push(group);
        this.listFormEovCategory = controls;
      }
  }
  public buildForms(data?: any) {
    this.formSave = this.buildForm(data, this.formconfig, ACTION_FORM.INSERT,
      [ValidationService.notAffter('eovTime', 'currentDate', 'propaganda.thoughtReport.now')]);
    const filesControl = new FileControl(null);
    if (data && data.fileAttachment) {
      if (data.fileAttachment.documentFile) {
        filesControl.setFileAttachment(data.fileAttachment.documentFile);
      }
    }
    this.formSave.addControl('files', filesControl);

  }
  public setFormValue(data?: any) {
    if (data && data > 0) {
      this.rewardThoughtReportService.findOne(data).subscribe(res => {
        this.buildForms(res.data);
      });
    }
  }
  public goBack() {
    this.router.navigate(['/propaganda/reward-thought-report']);
  }

   /**
   * Hàm kiểm tra lại giá trị input trước khi lưu
   * @returns
   */
    validateBeforeSave() {
      const isValidForm = CommonUtils.isValidForm(this.formSave);
      const isValidFormArray = CommonUtils.isValidForm(this.listFormEovCategory);
      return isValidFormArray && isValidForm;
    }

  public processSaveOrUpdate() {
    if (this.formSave.get('listDvgq').value.length > 0) {
      this.formSave.get('listDvgqRequired').setValue("required");
    } else {
      this.formSave.patchValue({ 'listDvgqRequired': null })
    }
    if (!this.validateBeforeSave()) {
      return;
    }
    const formSave = {};
    formSave['orgEovId'] = this.formSave.get('orgEovId').value;
    formSave['reporter'] = this.formSave.get('reporter').value;
    formSave['eovListName'] = this.formSave.get('eovListName').value;
    formSave['eovTypeLevel'] = this.formSave.get('eovTypeLevel').value;
    formSave['eovTime'] = this.formSave.get('eovTime').value;
    formSave['files'] = this.formSave.get('files').value;
    formSave['description'] = this.formSave.get('description').value;

    const listFormEovCategory = this.listFormEovCategory.value.map((item) => {
        const itemFormEovCategory = {};
        itemFormEovCategory['categoryId'] = item.categoryId;
        itemFormEovCategory['categoryTypeId'] = item.categoryTypeId;
        return itemFormEovCategory;
    });

    formSave['listFormEovCategory'] = listFormEovCategory;
    formSave['listIdEmployeeNVVP'] = this.formSave.get('listIdEmployeeNVVP').value;
    formSave['listIdEmployeeNTN'] = this.formSave.get('listIdEmployeeNTN').value;
    formSave['listIdEmployeeKNTN'] = this.formSave.get('listIdEmployeeKNTN').value;
    formSave['listIdOrgDVVP'] = this.formSave.get('listIdOrgDVVP').value;
    formSave['listDvgq'] = this.formSave.get('listDvgq').value;
    formSave['listIdEmployeeLQ'] = this.formSave.get('listIdEmployeeLQ').value;
    formSave['listIdFileRemove'] = this.listIdFileRemove;
    if (this.update) {
      formSave['eovListId'] = this.eovListId;
    }
    this.app.confirmMessage(null, () => {
      this.rewardThoughtReportService.saveOrUpdateFormFile(formSave).subscribe(res => {
        if (this.rewardThoughtReportService.requestIsSuccess(res) && res.data && res.data.eovListId) {
          this.router.navigate([`/propaganda/reward-thought-report/${res.data.eovListId}/view`]);
        }
      })
    }, () => { // on rejected

    });
  }

  getTypeOfExpression(item) {
    if (item.controls.categoryTypeId.value != '') {
      const param = CommonUtils.buildParams({ categoryTypeId: item.controls.categoryTypeId.value });
      this.rewardThoughtReportService.getTypeOfExpression(param).subscribe(res => {
        this.mapCategoryByExpressionList[item.controls.categoryTypeId.value] = res;
      })
      this.makeDefaultFormEovCategory();
    }
  }

  onChangeIsEmployee(event) {
    this.checkEmplyee = event.currentTarget.checked
  }

  changeEmployeeKNTN() {
    let dataKNTN = this.formSave.get('listIdEmployeeKNTN').value;
    let dataNTN = this.formSave.get('listIdEmployeeNTN').value;

    if (dataKNTN && dataNTN) {
      for (const iterator of dataKNTN) {
        let index = dataNTN.indexOf(iterator);
        if (index >= 0) {
          dataNTN.splice(index, 1);
        }
      }
      this.formSave.setControl('listIdEmployeeNTN', this.fb.array(dataNTN || []));
    }
  }

  changeEmployeeNTN() {
    let dataNTN = this.formSave.get('listIdEmployeeNTN').value;
    let dataKNTN = this.formSave.get('listIdEmployeeKNTN').value;

    if (dataNTN && dataKNTN) {
      for (const iterator of dataNTN) {
        let index = dataKNTN.indexOf(iterator);
        if (index >= 0) {
          dataKNTN.splice(index, 1);
        }
      }
      this.formSave.setControl('listIdEmployeeKNTN', this.fb.array(dataKNTN || []));
    }
  }

  getUnitParent() {
    if (this.formSave.get('orgEovId').value != '' && this.formSave.get('orgEovId').value != null) {
      const param = CommonUtils.buildParams({ orgId: this.formSave.get('orgEovId').value });
      this.rewardThoughtReportService.getHandle(param).subscribe(res => {
        if (res.organizationId) {
          let data = [res.organizationId];
          this.formSave.setControl('listDvgq', this.fb.array(data || []));
        }
      })
    }
  }

  changeFile(attachmentFileId: any) {
    this.listIdFileRemove.push(attachmentFileId);
  }

  private async buildFormsDetail(eovListId?: any) {
    if (eovListId) {
      this.rewardThoughtReportService.getDetailById(this.eovListId).subscribe(async res => {
        if (res.data) {
          this.checkEmplyee = true;
          this.formSave = this.buildForm(res.data, this.formconfig);
          const filesControl = new FileControl(null);
          filesControl.setFileAttachment(res.data.fileBeanList)
          this.formSave.addControl('files', filesControl)
          this.formSave.controls['listIdEmployeeNVVP'] = new FormArray([]);
          this.formSave.controls['listIdEmployeeNTN'] = new FormArray([]);
          this.formSave.controls['listIdEmployeeKNTN'] = new FormArray([]);
          this.formSave.controls['listIdOrgDVVP'] = new FormArray([]);
          this.formSave.controls['listDvgq'] = new FormArray([]);
          this.formSave.controls['listIdEmployeeLQ'] = new FormArray([]);
          // Danh sách nhân sự nhận tin nhắn
          if (res.data.listIdEmployeeNTN && res.data.listIdEmployeeNTN.length > 0) {
            this.formSave.setControl('listIdEmployeeNTN', this.fb.array(res.data.listIdEmployeeNTN.map(item => item.employeeId) || []));
          }
          // Danh sách nhân sự không nhận tin nhắn
          if (res.data.listIdEmployeeKNTN && res.data.listIdEmployeeKNTN.length > 0) {
            this.formSave.setControl('listIdEmployeeKNTN', this.fb.array(res.data.listIdEmployeeKNTN.map(item => item.employeeId) || []));
          }
          // Đơn vị giải quyết
          if (res.data.listIdOrgGQ && res.data.listIdOrgGQ.length > 0) {
            this.formSave.setControl('listDvgq', this.fb.array(res.data.listIdOrgGQ.map(item => item.orgId) || []));
          }
          // Thông tin nhân viên liên quan nếu có
          if (res.data.listIdEmployeeLQ && res.data.listIdEmployeeLQ.length > 0) {
            this.formSave.setControl('listIdEmployeeLQ', this.fb.array(res.data.listIdEmployeeLQ.map(item => item.employeeId) || []));
          }
          // Danh sách đơn vị vi phạm nếu có
          if (res.data.listIdOrgVP && res.data.listIdOrgVP.length > 0) {
            this.formSave.setControl('listIdOrgDVVP', this.fb.array(res.data.listIdOrgVP.map(item => item.orgId) || []));
          }
          // Danh sách nhân viên vi phạm nếu có
          if (res.data.listIdEmployeeVP && res.data.listIdEmployeeVP.length > 0) {
            this.formSave.setControl('listIdEmployeeNVVP', this.fb.array(res.data.listIdEmployeeVP.map(item => item.employeeId) || []));
          }
          const list = res.data.listFormEovCategory;
          for (let i in list) {
            const item = list[i];
            if (item.categoryTypeId != '' && !this.mapCategoryByExpressionList.hasOwnProperty(item.categoryTypeId)) {
              const param = CommonUtils.buildParams({ categoryTypeId: item.categoryTypeId });
              await this.rewardThoughtReportService.getTypeOfExpression(param).subscribe(res => {
                this.mapCategoryByExpressionList[item.categoryTypeId] = res;
              });
            }
          }
          // them xu ly build form cho danh sach: listFormEovCategory
          this.buildFormEovCategory(list);
        }
      });
    }
  }

}
