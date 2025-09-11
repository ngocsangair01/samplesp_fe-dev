import { NumberFormatStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { VicinityPositionPlanService } from '@app/core/services/vicinityPlan/vicinity-position-plan.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'vicinity-position-plan-form-clone',
  templateUrl: './vicinity-position-plan-form.component.html'
})
export class VicinityPositionPlanFormCloneComponent extends BaseComponent implements OnInit {
  positionList: any;
  categoryEducationList = new Array();
  categoryList: [];
  objectOfUseList: any;
  formSave: FormGroup;
  yearLists: any;
  transferTimeList: [];
  educationPlanFormList: FormArray;
  transferEmployeePlanFormList: FormArray;
  isPutPlanning: boolean;
  vicinityPositionPlanIdPutPlanning: any;
  filterConditionEmployee: String = "AND obj.status = 1";
  isUpdate = false;
  navigationSubscription;

  formConfig = {
    organizationName: [''],
    vicinityPositionPlanId: [''],
    vicinityPlanMappingId: [''],
    documentId: [''],
    organizationId: ['', [ValidationService.required]],
    positionId: ['', [ValidationService.required]],
    employeeId: ['', [ValidationService.required]],
    employeeCode: [''],
    fullName: [''],
    startDate: ['', [ValidationService.required]],
    endDate: [''],
    type: ['1', [ValidationService.required]],
    note: ['', [ValidationService.required]],
    typeOfVicinity: ['', [ValidationService.required]],
    documentName: [''],
    positionName: [''],
    documentNumber: [''],
    description: ['', ValidationService.maxLength(500)],
    credibilityRatio: ['', ValidationService.maxLength(500)]
  };

  formVicinityEmployeeConfig = {
    employeeId: [''],
    addressTraining: [''],
    description: [''],
    categoryTypeId: [''],
    fieldOfTrainingId: [''],
    yearStartPlan: [''],
    type: [APP_CONSTANTS.VICINITY_PLAN_TYPE.VICINITY_EMPLOYEE]
  }

  formNextEmployeeConfig = {
    employeeId: [''],
    positionId: [''],
    description: [''],
    organizationId: [''],
    transferTimeId: [''],
    yearStartPlan: [''],
    type: [APP_CONSTANTS.VICINITY_PLAN_TYPE.NEXT_EMPLOYEE]
  }

  constructor(
    private curriculumVitaeService: CurriculumVitaeService,
    public actr: ActivatedRoute,
    private router: Router,
    private app: AppComponent,
    private vicinityPositionPlanService: VicinityPositionPlanService,
    private categoryService: CategoryService,
    private message: MessageService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
    this.formSave = this.buildForm({}, this.formConfig, ACTION_FORM.INSERT, ValidationService.notAffter('startDate', 'endDate', 'party.member.start.date.to.label'));
    this.buildFormVicinityEmployee(null);
    this.buildFormNextEmployee(null);
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;

        if (params.vicinityPlanMappingId) {
          this.buildForms(params.vicinityPlanMappingId);
        }

        if (params.vicinityPositionPlanId) {
          this.isUpdate = true;
        }

        const queries = this.actr.snapshot.queryParams;
        if (queries.positionId && queries.organizationId && queries.vicinityPositionPlanId) {
          this.isPutPlanning = true;
          this.vicinityPositionPlanIdPutPlanning = queries.vicinityPositionPlanId;
          if (queries.documentId) {
            this.formSave.get("documentId").setValue(queries.documentId);
          }
          this.formSave.get("organizationId").setValue(queries.organizationId);
          this.formSave.get("positionId").setValue(queries.positionId);
        } else {
          this.isPutPlanning = false;
        }
      }
    });
  }

  ngOnInit() {
    this.getYear();
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.THOI_GIAN_LUAN_CHUYEN).subscribe(res => {
      this.transferTimeList = res.data;
    });
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.DOI_TUONG_SU_DUNG).subscribe(res => {
      this.objectOfUseList = res.data;
      if (this.objectOfUseList && this.objectOfUseList.length > 0)
        this.f['typeOfVicinity'].setValue(this.objectOfUseList[0].categoryId);
    })
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  getYear() {
    let now = new Date();
    let year = now.getFullYear() - 1;
    var yearList = [];
    for (var i = 0; i <= 5; i++) {
      yearList.push({ id: year + i, name: (year + i).toString() })
    }
    this.yearLists = yearList;
  }

  get f() {
    return this.formSave.controls;
  }

  validateBeforeSave(): boolean {
    const isValidFormSave = CommonUtils.isValidForm(this.formSave);
    const isValidLstVicinityEmployee = CommonUtils.isValidForm(this.educationPlanFormList);
    const isValidLstNextEmployee = CommonUtils.isValidForm(this.transferEmployeePlanFormList);

    if (!isValidFormSave || !isValidLstNextEmployee || !isValidLstVicinityEmployee)
      return false;
    return true;
  }

  processSaveOrUpdate() {
    // Xet file vao form
    if (!this.validateBeforeSave()) {
      return;
    }
    const formSave = this.formSave.value;
    formSave['educationPlanFormList'] = this.educationPlanFormList.value;
    formSave['transferEmployeePlanFormList'] = this.transferEmployeePlanFormList.value;
    this.app.confirmMessage(null, () => { // on accepted
      this.vicinityPositionPlanService.saveOrUpdate(formSave).subscribe(res => {
        if (this.vicinityPositionPlanService.requestIsSuccess(res)) {
          if (CommonUtils.isNullOrEmpty(this.f["vicinityPositionPlanId"].value)) {
            if (!this.isPutPlanning) {
              this.router.navigate(['/employee/vicinity-position-plan-clone']);
            } else {
              const url = '/employee/vicinity-position-plan-clone/detail/' + this.vicinityPositionPlanIdPutPlanning;
              this.router.navigate(
                [url],
                {
                  queryParams: {
                    'positionId': this.f["positionId"].value
                  }
                }
              );
            }
          } else {
            const url = '/employee/vicinity-position-plan-clone/detail/' + this.f["vicinityPositionPlanId"].value;
            this.router.navigate(
              [url],
              {
                queryParams: {
                  'positionId': this.f["positionId"].value
                }
              }
            );
          }
        }
        if (CommonUtils.isNullOrEmpty(res.type)) {
          this.message.add({ severity: 'error', detail: res.message });
        }
      });
    }, () => {
    });
  }

  public goBack() {
    if (CommonUtils.isNullOrEmpty(this.f["vicinityPositionPlanId"].value)) {
      if (!this.isPutPlanning) {
        this.router.navigate(['/employee/vicinity-position-plan-clone']);
      } else {
        const url = '/employee/vicinity-position-plan-clone/detail/' + this.vicinityPositionPlanIdPutPlanning;
        this.router.navigate(
          [url],
          {
            queryParams: {
              'positionId': this.f["positionId"].value
            }
          }
        );
      }
    } else {
      const url = '/employee/vicinity-position-plan-clone/detail/' + this.f["vicinityPositionPlanId"].value;
      this.router.navigate(
        [url],
        {
          queryParams: {
            'positionId': this.f["positionId"].value
          }
        }
      );
    }
  }

  private buildForms(vicinityPlanMappingId?: any) {
    if (vicinityPlanMappingId) {
      // Build form trường hợp edit
      this.vicinityPositionPlanService.getDetailRotation(vicinityPlanMappingId).subscribe(res => {
        if (res.data) {
          res.data.vicinityEducationPlanBeans.forEach(e => {
            if (!CommonUtils.isNullOrEmpty(e.categoryTypeId)) {
              this.categoryService.findByCategoryTypeId(e.categoryTypeId).subscribe(res => {
                this.categoryEducationList.push(res.data);
              })
            } else {
              this.categoryEducationList.push([]);
            }
            e.yearStartPlan = parseInt(e.yearStartPlan);
          })
          res.data.vicinityTransferEmployeePlanBeans.forEach(e => {
            e.yearStartPlan = parseInt(e.yearStartPlan);
          })

          if (res.data.type !== null) {
            res.data.type = res.data.type.toString();
          }
          this.formSave = this.buildForm(res.data, this.formConfig, ACTION_FORM.UPDATE, ValidationService.notAffter('startDate', 'endDate', 'party.member.start.date.to.label'));

          if (res.data.vicinityEducationPlanBeans.length > 0) {
            this.buildFormVicinityEmployee(res.data.vicinityEducationPlanBeans);
          } else {
            this.makeDefaultVicinityEmployeeForm();
          }

          if (res.data.vicinityTransferEmployeePlanBeans.length > 0) {
            this.buildFormNextEmployee(res.data.vicinityTransferEmployeePlanBeans);
          } else {
            this.makeDefaultNextEmployeeForm();
          }
        }
      });
    }
  }

  // Build list form nhân sự kế cận
  private makeDefaultVicinityEmployeeForm(): FormGroup {
    const formGroup = this.buildForm({}, this.formVicinityEmployeeConfig);
    formGroup.setValidators(ValidationService.requiredControlInGroup(['yearStartPlan', 'categoryTypeId', 'fieldOfTrainingId']));
    return formGroup;
  }

  public addVicinityEmployeeRow(index: NumberFormatStyle) {
    const controls = this.educationPlanFormList as FormArray;
    controls.insert(index + 1, this.makeDefaultVicinityEmployeeForm());
  }

  public removeVicinityEmployeeRow(index: number) {
    const controls = this.educationPlanFormList as FormArray;
    if (controls.length === 1) {
      this.buildFormVicinityEmployee();
      const group = this.makeDefaultVicinityEmployeeForm();
      controls.push(group);
      this.educationPlanFormList = controls;
    }
    controls.removeAt(index);
  }

  /**
   * buildFormVicinityEmployee
   */
  private buildFormVicinityEmployee(data?: any) {
    if (!data) {
      data = [{}];
    }
    const controls = new FormArray([]);
    for (const item of data) {
      const group = this.makeDefaultVicinityEmployeeForm();
      group.patchValue(item);
      controls.push(group);
    }
    controls.setValidators(ValidationService.duplicateArray(
      ['categoryTypeId', 'fieldOfTrainingId', 'yearStartPlan'], 'yearStartPlan', 'vicinityPlan.vicinityPositionPlan.yearStartPlan'));
    this.educationPlanFormList = controls;
  }

  // Build list form nhân sự kế tiếp
  private makeDefaultNextEmployeeForm(): FormGroup {
    const formGroup = this.buildForm({}, this.formNextEmployeeConfig);
    formGroup.setValidators(ValidationService.requiredControlInGroup(['positionId', 'organizationId', 'transferTimeId', 'yearStartPlan']));
    return formGroup;
  }

  public addNextEmployeeRow(index: number, item: FormGroup) {
    const controls = this.transferEmployeePlanFormList as FormArray;
    controls.insert(index + 1, this.makeDefaultNextEmployeeForm());
  }

  public removeNextEmployeeRow(index: number, item: FormGroup) {
    const controls = this.transferEmployeePlanFormList as FormArray;
    if (controls.length === 1) {
      this.buildFormNextEmployee();
      const group = this.makeDefaultNextEmployeeForm();
      controls.push(group);
      this.transferEmployeePlanFormList = controls;
    }
    controls.removeAt(index);
  }

  /**
   * buildFormVicinityEmployee
   */
  private buildFormNextEmployee(data?: any) {
    if (!data) {
      data = [{}];
    }
    const controls = new FormArray([]);
    for (const item of data) {
      const group = this.makeDefaultNextEmployeeForm();
      group.patchValue(item);
      controls.push(group);
    }
    controls.setValidators(ValidationService.duplicateArray(
      ['positionId', 'transferTimeId', 'organizationId', 'yearStartPlan'], 'yearStartPlan', 'vicinityPlan.vicinityPositionPlan.yearPlan'));
    this.transferEmployeePlanFormList = controls;
  }

  /**
   * Lấy thông tin nhân viên
   * @param event 
   * @param item 
   */
  public loadUserInfo(event, item: FormGroup) {
    if (event && event.selectField > 0) {
      this.curriculumVitaeService.getEmployeeMainPositionInfo(event.selectField).subscribe(res => {
        item.controls['mainPositionName'].setValue(res.data.mainPositionName);
      });
    } else {
      item.controls['mainPositionName'].setValue(null);
    }
  }

  changeNote() {
    if (this.formSave.value.employeeId != '') {
      this.vicinityPositionPlanService.getDetailEmployeeById(this.formSave.value.employeeId).subscribe(res => {
        let fullName = !CommonUtils.isNullOrEmpty(res.data.fullName) ? res.data.fullName + '\n' : '';
        let dateOfBirthTmp = !CommonUtils.isNullOrEmpty(res.data.dateOfBirthTmp) ? res.data.dateOfBirthTmp : '';
        let placeOfBirth = !CommonUtils.isNullOrEmpty(res.data.placeOfBirth) ? ' - ' + res.data.placeOfBirth + '\n' : '\n';
        let currentPlaceOfIssue = !CommonUtils.isNullOrEmpty(res.data.currentPlaceOfIssue) ? res.data.currentPlaceOfIssue + '\n' : '';
        let positionName = !CommonUtils.isNullOrEmpty(res.data.positionName) ? res.data.positionName + '\n' : '';
        let content = fullName + dateOfBirthTmp + placeOfBirth + currentPlaceOfIssue + positionName;
        this.formSave.get('note').setValue(content);
      });
    }
  }

  getCategoryByType() {
    let form = this.educationPlanFormList.controls;
    this.categoryEducationList = [];
    for (let i = 0; i < form.length; i++) {
      let cateTypeId = form[i].get('categoryTypeId').value;
      if (!CommonUtils.isNullOrEmpty(cateTypeId)) {
        this.categoryService.findByCategoryTypeId(cateTypeId).subscribe(res => {
          this.categoryList = res.data;
          this.categoryEducationList.push(this.categoryList);
        });
      } else {
        this.categoryList = [];
        this.categoryEducationList.push(this.categoryList);
      }
    }
  }
}
