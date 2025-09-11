import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { EmployeeProfileService } from '@app/core/services/employee/employee_profile.service';
import { TransferEmployeeService } from '@app/core/services/employee/transfer-employee.service';
import { HrStorage } from '@app/core/services/HrStorage';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { HelperService } from '@app/shared/services/helper.service';
import { AccordionTab } from 'primeng/primeng';
import { AssessmentSearchComponent } from './assessment/assessment-search.component';
import { RewardDisplineGovernmentComponent } from './reward-displine-government/reward-displine-government.component';
import { RewardPartyMemberComponent } from './reward-party-member/reward-party-member.component';
import { WorkProcessSearchComponent } from './work-process/work-process-search.component';

@Component({
  selector: 'transfer-employee-evaluate',
  templateUrl: './transfer-employee-evaluate.component.html',
})
export class TransferEmployeeEvaluateComponent extends BaseComponent implements OnInit {
  evaluateList = APP_CONSTANTS.EVALUATE_TYPE;
  formSave: FormGroup;
  transferEmployeeId: any;
  transferTypeList = APP_CONSTANTS.TRANSFER_TYPE_LIST;
  isEvaluateEdit: boolean = false;
  isEvaluate: boolean = false;
  isView: boolean = false;
  formPrivateStandard: FormArray;
  formGeneralStandard: FormArray;
  formVincinityPlan: FormGroup;
  vincinityPlanList = [];
  lstPosition: any;
  defaultDomain: any;
  isApproved: boolean = false;
  private operationKey = 'action.view';
  private adResourceKey = 'resource.transferEmployee';
  formConfig = {
    transferEmployeeId: [''],
    name: [''],
    code: [''],
    organizationId: [''],
    employeeId: [''],
    oldPositionId: [''],
    documentId: [''],
    positionId: [''],
    transferType: [''],
    transferDate: [''],
    description: [''],
    status: [''],
    conclude: [2],
    comment: ['']
  };

  @ViewChild('generalStandardTab') generalStandardTab: AccordionTab;
  @ViewChild('privateStandardTab') privateStandardTab: AccordionTab;
  @ViewChild('vincinityPlanTab') vincinityPlanTab: AccordionTab;
  @ViewChild('commentTab') commentTab: AccordionTab;
  @ViewChild('assessment') assessment: AssessmentSearchComponent;
  @ViewChild('workProcess') workProcess: WorkProcessSearchComponent;
  @ViewChild('rewardPartyMember') rewardPartyMember: RewardPartyMemberComponent;
  @ViewChild('rewardDisplineGovernment') rewardDisplineGovernment: RewardDisplineGovernmentComponent;

  constructor(private formBuilder: FormBuilder,
    private transferEmployeeService: TransferEmployeeService,
    private employeeProfileService: EmployeeProfileService,
    public actr: ActivatedRoute,
    private router: Router,
    private app: AppComponent,
    private helperService: HelperService) {
    super(null, CommonUtils.getPermissionCode("resource.transferEmployee"));
    this.buildFormPrivateStandard();
    this.buildFormGeneralStandard();
    this.defaultDomain = HrStorage.getDefaultDomainByCode(
      CommonUtils.getPermissionCode(this.operationKey),
      CommonUtils.getPermissionCode(this.adResourceKey));
    this.formVincinityPlan = this.buildForm({}, { isVicinity: [''] });
    this.setFormValue({});
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.transferEmployeeId = params.id;
        }
      }
    });
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 2) {
      this.isEvaluate = subPaths[2] === 'transfer-employee-evaluate';
      this.isView = subPaths[2] === 'transfer-employee-view';
    }
    this.setFormValue(this.transferEmployeeId);
  }

  public getListPosition() {
    const organizationId = this.f['organizationId'].value;
    const transferDate = this.f['transferDate'].value;
    const param = this.formSave.value;
    if (organizationId && transferDate != '') {
      this.transferEmployeeService.findPositionByOrgId(param)
        .subscribe(res => {
          this.lstPosition = res.data;
        });
    } else if (this.defaultDomain && transferDate != '') {
      const param = this.formSave.value;
      param['organizationId'] = this.defaultDomain;
      this.transferEmployeeService.findPositionByOrgId(param)
        .subscribe(res => {
          this.lstPosition = res.data;
        });
    }
  }

  get f() {
    return this.formSave.controls;
  }

  /**
   * buildForm
   */
  private buildForms(data?: any): void {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, []);
  }

  /**
   * setFormValue
   * param data
   */
  public setFormValue(data?: any) {
    this.buildForms({});
    if (data && data > 0) {
      this.transferEmployeeService.findOne(data)
        .subscribe(res => {
          this.buildForms(res.data);
          if (res.data.employeeId != null) {
            this.changeOldPosition(res.data.employeeId);
            this.helperService.assessmentData(res.data.employeeId);
            this.helperService.transferEmployeeData(data);
            // TRANSFER_EMPLOYEE
            this.assessment.callProcessSeach();
            this.rewardPartyMember.callProcessSeach();
            // ASSESSMENT_DATA
            this.workProcess.callProcessSeach();
            this.rewardDisplineGovernment.callProcessSeach();
          }
          if (res.data.positionId != null) {
            this.loadListPosition();
          }
          this.vincinityPlanList = res.data.vicinityPositionPlanList;
          this.formVincinityPlan.controls['isVicinity'].setValue(res.data.isVicinity);
          this.buildFormGeneralStandard(res.data.generalStandard);
          this.buildFormPrivateStandard(res.data.privateStandard);
          if (res.data.status == 1 && !this.isView) {
            this.isEvaluate = false;
            this.isEvaluateEdit = true;
          }
          this.getListPosition();
          if (res.data.groupOrgPositionBean.isApproved == 1) {
            this.isApproved = true;
          }
        });
    }
  }

  public processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      this.setVisibleTab(this.commentTab);
      return;
    } else {
      let formData = this.formSave.value;
      formData['generalStandard'] = this.formGeneralStandard.value;
      formData['privateStandard'] = this.formPrivateStandard.value;
      this.app.confirmMessage("doYouWantEvaluaEmployee.confirm", () => { // on accepted
        this.transferEmployeeService.evaluate(formData)
          .subscribe(res => {
            if (this.transferEmployeeService.requestIsSuccess(res)) {
              this.goBack();
            }
          });
      }, () => {
        // on rejected
      });
    }
  }

  public goBack() {
    this.router.navigate(['/employee/transfer-employee']);
  }

  public changeEmployee(event?) {
    if (event != null) {
      const employeeId = event.selectField;
      this.changeOldPosition(employeeId);
    }
  }

  private changeOldPosition(employeeId) {
    this.employeeProfileService.getPositionInfoByEmployeeId(employeeId).subscribe(res => {
      if (this.employeeProfileService.requestIsSuccess(res)) {
        if (res.data != null) {
          this.formSave.removeControl('oldPositionId');
          this.formSave.addControl('oldPositionId', new FormControl(res.data.positionId, []));
        } else {
          this.formSave.removeControl('oldPositionId');
          this.formSave.addControl('oldPositionId', new FormControl(null, []));
        }
      }
    });
  }

  /**
   * makeDefaultEmpsForm
   */
  private makeDefaultPrivateStandardForm(): FormGroup {
    return this.formBuilder.group({
      transferEmployeeEvaluateId: [null],
      privateStandardPositionGroupId: [null],
      name: [null],
      nameCate: [null],
      namePspg: [null],
      evaluateType: [null],
      dataSystem: [null],
      dataAdjustment: [null],
      description: [null],
      comment: [null],
    });
  }

  /**
   * buildFormEmps
   */
  private buildFormPrivateStandard(listEmp?: any) {
    let isValue = true;
    if (!listEmp) {
      listEmp = [{}];
      isValue = false;
    }
    const controls = new FormArray([]);
    if (isValue) {
      for (const emp of listEmp) {
        const group = this.makeDefaultPrivateStandardForm();
        group.patchValue(emp);
        controls.push(group);
      }
    }
    // controls.setValidators(ValidationService.duplicateArray(
    //   ['employeeId'], 'employeeId', 'recieveNotificationGroup.duplicateEmployee'));
    this.formPrivateStandard = controls;
  }


  /**
   * tieu chuan chung
   * makeDefaultEmpsForm
   */
  private makeDefaultGeneralStandardForm(): FormGroup {
    return this.formBuilder.group({
      transferEmployeeEvaluateId: [null],
      generalStandardPositionGroupId: [null],
      name: [null],
      nameCate: [null],
      nameGspg: [null],
      evaluateType: [null],
      dataSystem: [null],
      dataAdjustment: [null],
      description: [null],
      comment: [null],
    });
  }

  /**
   * tieu chuan chung
   */
  private buildFormGeneralStandard(listEmp?: any) {
    let isValue = true;
    if (!listEmp) {
      listEmp = [{}];
      isValue = false;
    }
    const controls = new FormArray([]);
    if (isValue) {
      for (const emp of listEmp) {
        const group = this.makeDefaultGeneralStandardForm();
        group.patchValue(emp);
        controls.push(group);
      }
    }
    this.formGeneralStandard = controls;
  }

  private setVisibleTab(tabSelected: AccordionTab) {
    this.generalStandardTab.selected = false;
    this.privateStandardTab.selected = false;
    this.vincinityPlanTab.selected = false;
    this.commentTab.selected = false;
    tabSelected.selected = true;
  }

  processRequest() {
    if (this.transferEmployeeId > 0) {
      let formData = this.formSave.value;
      formData['generalStandard'] = this.formGeneralStandard.value;
      formData['privateStandard'] = this.formPrivateStandard.value;
      this.app.confirmMessage('confirm.transferEmployee.request', () => {// on accepted
        this.transferEmployeeService.request(formData)
          .subscribe(res => {
            if (this.transferEmployeeService.requestIsSuccess(res)) {
              this.goBack();
              this.processSearch(null);
            }
          });
      }, () => {// on rejected
      });
    }
  }

  processComplete() {
    if (this.transferEmployeeId > 0) {
      let formData = this.formSave.value;
      formData['generalStandard'] = this.formGeneralStandard.value;
      formData['privateStandard'] = this.formPrivateStandard.value;
      this.app.confirmMessage('confirm.transferEmployee.complete', () => {// on accepted
        this.transferEmployeeService.complete(formData)
          .subscribe(res => {
            if (this.transferEmployeeService.requestIsSuccess(res)) {
              this.goBack();
              this.processSearch(null);
            }
          });
      }, () => {// on rejected
      });
    }
  }

  public loadListPosition() {
    const organizationId = this.f['organizationId'].value;
    const transferDate = this.f['transferDate'].value;
    const param = {};
    param['organizationId'] = organizationId;
    param['transferDate'] = transferDate;
    if (organizationId && transferDate != '' && transferDate != null) {
      this.transferEmployeeService.findPositionByOrgId(param)
        .subscribe(res => {
          this.lstPosition = res.data;
        });
    } else {
      this.f['code'].setValue(null);
      this.lstPosition = []
    }
  }
}