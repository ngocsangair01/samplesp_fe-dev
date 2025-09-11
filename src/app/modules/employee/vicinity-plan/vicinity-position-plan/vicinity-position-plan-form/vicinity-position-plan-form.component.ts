import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS } from '@app/core/app-config';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { HrStorage } from '@app/core/services/HrStorage';
import { VicinityPositionPlanService } from '@app/core/services/vicinityPlan/vicinity-position-plan.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'vicinity-position-plan-form',
  templateUrl: './vicinity-position-plan-form.component.html'
})
export class VicinityPositionPlanFormComponent extends BaseComponent implements OnInit {

  positionList: any;
  formSave: FormGroup;
  lstPosition: any;
  lstVicinityEmployeeForm: FormArray;
  lstNextEmployeeForm: FormArray;
  vicinityPositionPlanId: any;
  formConfig = {
    vicinityPositionPlanId: [''],
    documentId: ['', [ValidationService.required]],
    organizationId: ['', [ValidationService.required]],
    positionId: ['', [ValidationService.required]]
  };

  formVicinityEmployeeConfig = {
    employeeId: ['', [ValidationService.required]],
    mainPositionName: [''],
    type: [APP_CONSTANTS.VICINITY_PLAN_TYPE.VICINITY_EMPLOYEE]
  }

  formNextEmployeeConfig = {
    employeeId: ['', null],
    mainPositionName: [null],
    type: [APP_CONSTANTS.VICINITY_PLAN_TYPE.NEXT_EMPLOYEE]
  }

  private operationKey = 'action.view';
  private adResourceKey = 'resource.employeeManager';
  private defaultDomain: any;

  constructor(
    private curriculumVitaeService: CurriculumVitaeService,
    public actr: ActivatedRoute,
    private router: Router,
    private app: AppComponent,
    private vicinityPositionPlanService: VicinityPositionPlanService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
    this.formSave = this.buildForm({}, this.formConfig);
    this.lstPosition = {};
    this.buildFormVicinityEmployee(null);
    this.buildFormNextEmployee(null);
    this.defaultDomain = HrStorage.getDefaultDomainByCode(
      CommonUtils.getPermissionCode(this.operationKey),
      CommonUtils.getPermissionCode(this.adResourceKey));
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params.vicinityPositionPlanId) {
          this.vicinityPositionPlanId = params.vicinityPositionPlanId;
        }
      }
    });
  }

  ngOnInit() {
    this.buildForms(this.vicinityPositionPlanId);
  }

  get f() {
    return this.formSave.controls;
  }

  validateBeforeSave(): boolean {
    const isValidFormSave = CommonUtils.isValidForm(this.formSave);
    const isValidLstVicinityEmployee = CommonUtils.isValidForm(this.lstVicinityEmployeeForm);
    const isValidLstNextEmployee = CommonUtils.isValidForm(this.lstNextEmployeeForm);

    if (!isValidFormSave || !isValidLstNextEmployee || !isValidLstVicinityEmployee)
      return false;
    return true;
  }

  processSaveOrUpdate() {
    // Xet file vao form
    if (!this.validateBeforeSave()) {
      return;
    }

    const formSave = {};
    formSave['vicinityPositionPlanId'] = this.vicinityPositionPlanId;
    formSave['documentId'] = this.formSave.get('documentId').value;
    formSave['organizationId'] = this.formSave.get('organizationId').value;
    formSave['positionId'] = this.formSave.get('positionId').value;
    formSave['listVicinityEmployee'] = this.lstVicinityEmployeeForm.value;
    formSave['listNextEmployee'] = this.lstNextEmployeeForm.value;
    this.app.confirmMessage(null, () => { // on accepted
      this.vicinityPositionPlanService.saveOrUpdate(formSave).subscribe(res => {
        if (this.vicinityPositionPlanService.requestIsSuccess(res)) {
          this.router.navigate(['/employee/vicinity-position-plan']);
        }
      });
    }, () => {
    });
  }

  public goBack() {
    this.router.navigate(['/employee/vicinity-position-plan']);
  }

  private buildForms(vicinityPositionPlanId?: any) {
    if (vicinityPositionPlanId) {
      // Build form trường hợp edit
      this.vicinityPositionPlanService.findOne(this.vicinityPositionPlanId).subscribe(res => {
        if (res.data) {
          this.formSave = this.buildForm(res.data, this.formConfig);
          this.buildFormVicinityEmployee(res.data.listVicinityEmployee);
          this.buildFormNextEmployee(res.data.listNextEmployee);
          this.onChangeOrganization(null, this.formSave.controls['organizationId'].value);
        }
      });
    } else {
      this.formSave.controls['organizationId'].setValue(this.defaultDomain);
      this.onChangeOrganization(null, this.formSave.controls['organizationId'].value);
    }
  }

  // Build list form nhân sự kế cận
  private makeDefaultVicinityEmployeeForm(): FormGroup {
    const formGroup = this.buildForm({}, this.formVicinityEmployeeConfig);
    return formGroup;
  }

  public addVicinityEmployeeRow(index: number, item: FormGroup) {
    const controls = this.lstVicinityEmployeeForm as FormArray;
    controls.insert(index + 1, this.makeDefaultVicinityEmployeeForm());
  }

  public removeVicinityEmployeeRow(index: number, item: FormGroup) {
    const controls = this.lstVicinityEmployeeForm as FormArray;
    if (controls.length === 1) {
      this.buildFormVicinityEmployee();
      const group = this.makeDefaultVicinityEmployeeForm();
      controls.push(group);
      this.lstVicinityEmployeeForm = controls;
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
      ['employeeId'], 'employeeId', 'vicinityPlan.vicinityPositionPlan.employee'));
    this.lstVicinityEmployeeForm = controls;
  }

  // Build list form nhân sự kế tiếp
  private makeDefaultNextEmployeeForm(): FormGroup {
    const formGroup = this.buildForm({}, this.formNextEmployeeConfig);
    return formGroup;
  }

  public addNextEmployeeRow(index: number, item: FormGroup) {
    const controls = this.lstNextEmployeeForm as FormArray;
    controls.insert(index + 1, this.makeDefaultNextEmployeeForm());
  }

  public removeNextEmployeeRow(index: number, item: FormGroup) {
    const controls = this.lstNextEmployeeForm as FormArray;
    if (controls.length === 1) {
      this.buildFormNextEmployee();
      const group = this.makeDefaultNextEmployeeForm();
      controls.push(group);
      this.lstNextEmployeeForm = controls;
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
      ['employeeId'], 'employeeId', 'vicinityPlan.vicinityPositionPlan.employee'));
    this.lstNextEmployeeForm = controls;
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
      })
    } else {
      item.controls['mainPositionName'].setValue(null);
    }
  }

  public onChangeOrganization(event, defaultDomain?) {
    const vicinityPositionPlanId = this.formSave.controls['vicinityPositionPlanId'].value;
    if (event && event.organizationId) {
      this.vicinityPositionPlanService.findEffectivePositionByOrgId(event.organizationId, vicinityPositionPlanId)
        .subscribe(res => {
          this.lstPosition = res.data;
        });
    } else if (defaultDomain) {
      this.vicinityPositionPlanService.findEffectivePositionByOrgId(defaultDomain, vicinityPositionPlanId)
        .subscribe(res => {
          this.lstPosition = res.data;
        });
    }
  }
}
