import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS, DEFAULT_MODAL_OPTIONS } from '@app/core';
import { EmployeeT63InfomationService } from '@app/core/services/employee/employee_t63_infomation.service';
import { TransferEmployeeService } from '@app/core/services/employee/transfer-employee.service';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ValidationService } from '@app/shared/services';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeT63ExportFormComponent } from '../employee-t63-export-form/employee-t63-export-form.component';
import { PartyMemebersService } from '@app/core/services/party-organization/party-members.service';


@Component({
  selector: 'employee-t63-infomation-form',
  templateUrl: './employee-t63-infomation-form.component.html',
  styleUrls: ['./employee-t63-infomation-form.component.css']
})
export class EmployeeT63InfomationFormComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  familyTypeList: any = {};
  employeeId: number;
  hideEmployeeT63Information: boolean = false;
  hidePoliticalAndEconomicSituationOfFamily: boolean = false;
  hidePoliticalAndEconomicSituationOfFamilyWife: boolean = false;
  hideReviewSummary: boolean = false;
  textAreaControlList = ['t36Abroad', 't36PriorRevolution', 't36Housing', 't36Diseases', 't36FamilyDesciption', 't36MarriageFamilyDesciption', 't36Review'];
  textAreaWarningList = [false, false, false, false, false, false, false];
  isMobileScreen: boolean = false;
  formConfig = {
    employeeId: [''],
    formatedSoldierNumber: [''],
    ethnic: [''],
    religion: [''],
    sangnnStartDate: [''],
    firsSignCNVQP: [''],
    mobilizationDate: [''],
    demobilizationDate: [''],
    remobilizationDate: [''],
    t36Abroad: ['', [ValidationService.maxLength(1000)]],
    t36PriorRevolution: ['', [ValidationService.maxLength(1000)]],
    t36Housing: ['', [ValidationService.maxLength(1000)]],
    t36HealthLevelId: [''],
    t36Diseases: ['', [ValidationService.maxLength(1000)]],
    fatherName: [{ value: '', disabled: true }],
    fatherDayOfBirth: [{ value: '', disabled: true }],
    fatherMonthOfBirth: [{ value: '', disabled: true }],
    fatherYearOfBirth: [{ value: '', disabled: true }],
    fatherJob: [{ value: '', disabled: true }],
    motherName: [{ value: '', disabled: true }],
    motherDayOfBirth: [{ value: '', disabled: true }],
    motherMonthOfBirth: [{ value: '', disabled: true }],
    motherYearOfBirth: [{ value: '', disabled: true }],
    motherJob: [{ value: '', disabled: true }],
    familyTypeId: [''],
    t36PermanentAddress: [{ value: '', disabled: true }],
    t36CurrentAddress: [{ value: '', disabled: true }],
    t36SiblingNumber: [{ value: '', disabled: true }],
    t36BrotherNumber: [{ value: '', disabled: true }],
    t36YourPosition: [{ value: '', disabled: true }],
    t36FamilyDesciption: ['', [ValidationService.maxLength(1000)]],
    marriageFatherName: [{ value: '', disabled: true }],
    marriageFatherDayOfBirth: [{ value: '', disabled: true }],
    marriageFatherMonthOfBirth: [{ value: '', disabled: true }],
    marriageFatherYearOfBirth: [{ value: '', disabled: true }],
    marriageFatherJob: [{ value: '', disabled: true }],
    marriageMotherName: [{ value: '', disabled: true }],
    marriageMotherDayOfBirth: [{ value: '', disabled: true }],
    marriageMotherMonthOfBirth: [{ value: '', disabled: true }],
    marriageMotherYearOfBirth: [{ value: '', disabled: true }],
    marriageMotherJob: [{ value: '', disabled: true }],
    t36MarriageFamilyTypeId: [''],
    t36MarriagePermanentAddress: [{ value: '', disabled: true }],
    t36MarriageCurrentAddress: [{ value: '', disabled: true }],
    t36MarriageSiblingNumber: [{ value: '', disabled: true }],
    t36MarriageBrotherNumber: [{ value: '', disabled: true }],
    t36MarriageYourPosition: [{ value: '', disabled: true }],
    t36MarriageFamilyDesciption: ['', [ValidationService.maxLength(1000)]],
    marriageName: [{ value: '', disabled: true }],
    marriageDayOfBirth: [{ value: '', disabled: true }],
    marriageMonthOfBirth: [{ value: '', disabled: true }],
    marriageYearOfBirth: [{ value: '', disabled: true }],
    marriageJob: [{ value: '', disabled: true }],
    marriageAddress: [{ value: '', disabled: true }],
    t36MarriageTypeId: [''],
    t36Review: ['', [ValidationService.maxLength(60000)]],
  };

  constructor(
    private employeeResolver: EmployeeResolver,
    private sysCatService: SysCatService,
    private employeeT63InfomationService: EmployeeT63InfomationService,
    private transferEmployeeService: TransferEmployeeService,
    private app: AppComponent,
    private router: Router,
    private modalService: NgbModal,
    private partyMemebersService: PartyMemebersService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyMember"));
    this.formSave = this.buildForm({}, this.formConfig);
    this.employeeResolver.EMPLOYEE.subscribe(
      data => {
        if (data) {
          this.employeeId = data;
          this.employeeT63InfomationService.findOne(this.employeeId).subscribe(res => {
            this.buildForms(res.data);
            this.onBlurTextArea(this.f['t36Abroad'], 't36Abroad', 1, 50, 0);
            this.onBlurTextArea(this.f['t36PriorRevolution'], 't36PriorRevolution', 2, 28, 93);
            this.onBlurTextArea(this.f['t36Housing'], 't36Housing', 2, 47, 93);
            this.onBlurTextArea(this.f['t36FamilyDesciption'], 't36FamilyDesciption', 6, null, 100);
            this.onBlurTextArea(this.f['t36MarriageFamilyDesciption'], 't36MarriageFamilyDesciption', 6, null, 100);
            this.onBlurTextArea(this.f['t36Review'], 't36Review', 18, null, 96);
          });
        }
      }
    );
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    // Danh sach thanh phan gia dinh
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.FAMILY_TYPE).subscribe(res => {
      this.familyTypeList = res.data
    });
    this.partyMemebersService.selectMenuItem.subscribe(res => {
      let element = document.getElementById(res);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    })
  }

  private buildForms(data?: any): void {
    this.formSave = this.buildForm(data, this.formConfig);
  }

  /* */
  get f() {
    return this.formSave.controls;
  }

  /**
   * processSaveOrUpdate
   */
  public doSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.app.confirmMessage(null, () => { // on accepted
      this.formSave.controls['employeeId'].setValue(this.employeeId);
      this.employeeT63InfomationService.saveOrUpdate(this.formSave.value).subscribe(res => {
        if (this.employeeT63InfomationService.requestIsSuccess(res)) {
          this.employeeT63InfomationService.findOne(this.employeeId).subscribe(res => {
            this.buildForms(res.data);
          });
        }
      });
    }, () => {
    });
  }

  public goBack() {
    // Neu di tu menu dang vien thi back lai man hinh danh sach dang vien
    if (this.transferEmployeeService.isPartyMember) {
      this.transferEmployeeService.isPartyMember = false;
      this.router.navigate(['/party-organization/party-member']);
    } else {
      this.router.navigate(['/employee/curriculum-vitae']);
    }
  }

  activeModal() {
    if (this.employeeId) {
      const modalRef = this.modalService.open(EmployeeT63ExportFormComponent, DEFAULT_MODAL_OPTIONS);
      modalRef.componentInstance.setFormValue(this.employeeId);
      modalRef.result.then((result) => {
        if (!result) {
          return;
        }
      });
    }
  }

  onBlurTextArea(c: AbstractControl, controlName, maxLine: number, maxLengthFirstLine: number, maxLengthPerLine: number) {
    let controlIndex = this.textAreaControlList.indexOf(controlName);
    if (c.value) {
      if (c.value.indexOf("\n") != -1) {
        let splitedString = (c.value + '').split("\n");
        if (splitedString.length > maxLine) {
          this.textAreaWarningList[controlIndex] = true;
          return;
        }
        let i = 0;
        if (maxLengthFirstLine && maxLengthFirstLine > 0) {
          i = 1;
          if (splitedString[0].length > maxLengthFirstLine) {
            this.textAreaWarningList[controlIndex] = true;
            return;
          }
        }
        for (i; i < splitedString.length; i++) {
          if (splitedString[i].length > maxLengthPerLine) {
            this.textAreaWarningList[controlIndex] = true;
            return;
          }
        }
      } else {
        if (maxLine === 1 && c.value.length > maxLengthFirstLine) {
          this.textAreaWarningList[controlIndex] = true;
          return;
        }
        if (c.value.length > (maxLengthFirstLine + maxLengthPerLine)) {
          this.textAreaWarningList[controlIndex] = true;
          return;
        }
      }
    }
    this.textAreaWarningList[controlIndex] = false;
  }
}
