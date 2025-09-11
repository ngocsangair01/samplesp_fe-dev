import { Component, OnInit, ViewChildren } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { PartyOrganizationService } from '@app/core/services';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { PartyMemebersService } from '@app/core/services/party-organization/party-members.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { DataPickerComponent } from '@app/shared/components/data-picker/data-picker.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import * as moment from 'moment';
import { SysCatService } from './../../../../core/services/sys-cat/sys-cat.service';

@Component({
  selector: 'party-member-form-clone',
  templateUrl: './party-member-form-clone.component.html'
})
export class PartyMemberFormCloneComponent extends BaseComponent implements OnInit {
  partyTerminationList = [];
  formPartyMemberProcess: FormGroup;
  formPartyMember: FormGroup;
  partyMembersId: any;
  officerTypeList: any;
  highestRankList: any;
  trainingResultList: any;
  isInnerParty: boolean = true;
  tenureList = [];
  public isFirstIntroduceIn: boolean = false;
  public isSecondIntroduceIn: boolean = false;
  public employeeChosen: boolean = false;

  @ViewChildren('partyOrgSelector')
  public partyOrgSelector;

  @ViewChildren('partyOrgSelectorExpect')
  public partyOrgSelectorExpect;

  @ViewChildren('partyOrgSelectorInner')
  public partyOrgSelectorInner;

  @ViewChildren('firstIntroduceDataPicker')
  public firstIntroduceDataPicker;

  @ViewChildren('secondIntroduceDataPicker')
  public secondIntroduceDataPicker;

  formPartyMemberProcessConfig = {
    partyMemberProcessId: [''],
    partyMemberId: [''],
    partyOrganizationId: ['', Validators.required],
    employeeId: ['', Validators.required],
    fullName: [''],
    partyPositionId: ['', Validators.required],
    isLast: [],
    tenureId: [''],
  };

  formPartyMemberConfig = {
    partyMemberId: [''],
    partyOrganizationId: [''],
    partyPositionId: [''],
    employeeId: [''],
    partyNumber: ['', [ValidationService.maxLength(50)]],
    partyOfficialAdmissionDate: [''],
    partyAdmissionPlace: ['', [ValidationService.maxLength(500)]],
    partyAdmissionDate: [''],
    exceptPartyOrganizationId: [''],
    exceptPartyDate: [''],
    isInnerParty: [''],
    innerPartyOrganizationId: [''],
    firstIntroduceEmployeeId: [''],
    firstIntroducePerson: ['', [ValidationService.maxLength(200)]],
    firstPositionUnit: ['', [ValidationService.maxLength(500)]],
    secondIntroduceEmployeeId: [''],
    secondIntroducePerson: ['', [ValidationService.maxLength(200)]],
    secondPositionUnit: ['', [ValidationService.maxLength(500)]],
    trainingUnit: ['', [ValidationService.maxLength(1000)]],
    trainingResultId: [''],
    jobBefore: ['', [ValidationService.maxLength(500)]],
    mainJob: ['', [ValidationService.maxLength(500)]],
    highestRankId: [''],
    profileNumber: ['', [ValidationService.maxLength(200)]],
    officerTypeId: [''],
    unionNumber: ['', ValidationService.maxLength(50)],
    unionDate: [''],
    unionPlace: ['', [ValidationService.maxLength(200)]],
  };
  constructor(private partyMemebersService: PartyMemebersService,
    public actr: ActivatedRoute,
    private app: AppComponent,
    public sysCatService: SysCatService,
    public curriculumVitaeService: CurriculumVitaeService,
    public partyOrganizationService: PartyOrganizationService,
    private router: Router,
    private categoryService: CategoryService) {
    super(null, CommonUtils.getPermissionCode("resource.partyMember"));
    this.buildPartyMembersProcessForm({});
    this.buildPartyMemberForm({});

  }

  ngOnInit() {
    // Lấy ra danh sách Quân hàm cao nhất
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.HIGHEST_RANK).subscribe(res => {
      this.highestRankList = res.data;
    })
    // Lấy ra danh sách Kết quả bồi dưỡng
    this.trainingResultList = APP_CONSTANTS.TRAINING_RESULT;
    // Lấy ra danh sách Loại cán bộ
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.OFFICER_TYPE).subscribe(res => {
      this.officerTypeList = res.data;
    })
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.TENURE).subscribe(
      res => this.tenureList = res.data
    );
  }

  get f() {
    return this.formPartyMember.controls;
  }

  get fProcess() {
    return this.formPartyMemberProcess.controls;
  }

  /**
   * buildPartyMembersProcessForm
   */
  private buildPartyMembersProcessForm(data?: any): void {
    this.formPartyMemberProcess = this.buildForm(data, this.formPartyMemberProcessConfig);
  }

  /**
   * buildPartyMemberForm
   */
  private buildPartyMemberForm(data?: any): void {
    this.formPartyMember = this.buildForm(data, this.formPartyMemberConfig, ACTION_FORM.INSERT
      , [ValidationService.notAffter('partyAdmissionDate', 'partyOfficialAdmissionDate', 'generalInformation.label.partyDateJoinSuccess')
      ]);
  }

  /**
   * goBack
   */
  public goBack() {
    this.router.navigate(['/party-organization/party-member-clone']);
  }

  /**
   * processSaveOrUpdate
   */
  public processSaveOrUpdate() {
    const validatePMP = CommonUtils.isValidFormAndValidity(this.formPartyMemberProcess);
    const valdiatePM = CommonUtils.isValidFormAndValidity(this.formPartyMember);
    if (!validatePMP || !valdiatePM || this.validateDuplicateBeforeSave()) {
      return;
    }

    this.app.confirmMessage(null, () => { // on accepted
      const formSave = {};

      formSave['partyMemberProcessForm'] = this.formPartyMemberProcess.value;

      this.formPartyMember.get('partyOrganizationId').setValue(this.formPartyMemberProcess.get('partyOrganizationId').value);
      this.formPartyMember.get('partyPositionId').setValue(this.formPartyMemberProcess.get('partyPositionId').value);
      formSave['partyMemberForm'] = this.formPartyMember.value;

      this.partyMemebersService.saveOrUpdate(formSave)
        .subscribe(res => {
          if (this.partyMemebersService.requestIsSuccess(res)) {
            this.goBack();
          }
        });
    }, () => {
      // on rejected
    });
  }

  /** 
   * Chọn nhân viên fill ra dữ liệu
   */
  public onChangEmployeeCode(data) {
    if (data) {
      this.employeeChosen = true;
      this.formPartyMemberProcess.get('fullName').setValue(data.nameField);
      this.curriculumVitaeService.getPartyMember(data.selectField).subscribe(res => {
        if (res.data.isInnerParty === 1) {
          this.isInnerParty = false;
        }
        if (res.data.firstIntroduceEmployeeId) {
          this.isFirstIntroduceIn = true;
          this.curriculumVitaeService.findOne(res.data.firstIntroduceEmployeeId).subscribe(res => {
            const positionName = res.data.currentPosition;
            const organizationName = res.data.organizationName;
            if (positionName !== null && organizationName !== null) {
              this.formPartyMember.get('firstPositionUnit').setValue(positionName + ' - ' + organizationName);
            } else if (positionName !== null) {
              this.formPartyMember.get('firstPositionUnit').setValue(positionName);
            } else if (organizationName !== null) {
              this.formPartyMember.get('firstPositionUnit').setValue(organizationName);
            }
          });
        } else {
          this.isFirstIntroduceIn = false;
        }

        if (res.data.secondIntroduceEmployeeId) {
          this.isSecondIntroduceIn = true;
          this.curriculumVitaeService.findOne(res.data.secondIntroduceEmployeeId).subscribe(res => {
            const positionName = res.data.currentPosition;
            const organizationName = res.data.organizationName;
            if (positionName !== null && organizationName !== null) {
              this.formPartyMember.get('secondPositionUnit').setValue(positionName + ' - ' + organizationName);
            } else if (positionName !== null) {
              this.formPartyMember.get('secondPositionUnit').setValue(positionName);
            } else if (organizationName !== null) {
              this.formPartyMember.get('secondPositionUnit').setValue(organizationName);
            }
          });
        } else {
          this.isFirstIntroduceIn = false;
        }
        this.buildPartyMemberForm(res.data);

        if (!res.data.partyMemberId) {
          this.formPartyMember.get('employeeId').setValue(this.formPartyMemberProcess.get('employeeId').value);
        }
      })
    } else {
      this.employeeChosen = true;
      this.formPartyMemberProcess.get('fullName').setValue('');
    }
  }

  /**
   * Hiển thị Chức vụ đơn vị khi chọn người giới thiệu
   * @param event 
   * @param property 
   */
  public onChangeIntroduce(event, property: AbstractControl) {
    if (event.selectField) {
      this.curriculumVitaeService.findOne(event.selectField).subscribe(res => {
        const positionName = res.data.currentPosition;
        const organizationName = res.data.organizationName;
        if (positionName !== null && organizationName !== null) {
          property.setValue(positionName + ' - ' + organizationName);
        } else if (positionName !== null) {
          property.setValue(positionName);
        } else if (organizationName !== null) {
          property.setValue(organizationName);
        }
      });
    } else {
      property.setValue(null);
    }
  }

  /**
   * Active quá trình trong tại chi bộ
   * @param event 
   */
  public onChangeIsInnerParty(event) {
    if (event.target.checked) {
      this.isInnerParty = false;
    } else {
      this.isInnerParty = true;
      this.formPartyMember.get('innerPartyOrganizationId').setValue('');
    }
  }

  /**
   * Validate khi chọn chi bộ Đảng
   * @param data 
   */
  public onChangePartyOrg(data, partyOrgSelect) {
    if (data.partyOrganizationId) {
      if (data.type !== APP_CONSTANTS.PARTY_ORG_TYPE.CBCS && data.type !== APP_CONSTANTS.PARTY_ORG_TYPE.CBTT) {
        this.app.errorMessage('transferPartyMember.mustBePartyCell');
        partyOrgSelect.delete();
        return;
      }
      const currentDate = moment(new Date(), 'DD/MM/YYYY');
      if (data.expritedDate === null) {
        const effectiveDate = moment(new Date(data.effectiveDate), 'DD/MM/YYYY');
        if (effectiveDate.isAfter(currentDate)) {
          this.app.errorMessage('partymember.partyOrganizationNotEffectYet');
          partyOrgSelect.delete();
        }
      } else {
        const expiredDate = moment(new Date(data.expritedDate), 'DD/MM/YYYY');
        if (expiredDate.isSameOrBefore(currentDate)) {
          this.app.errorMessage('partymember.partyOrganizationExpired');
          partyOrgSelect.delete();
        }
      }
    }
  }

  /** 
   * Validate trùng nhân viên với người giới thiệu
   */
  public validateDuplicateBeforeSave(): boolean {
    if (
      CommonUtils.isNullOrEmpty(this.formPartyMember.get('firstIntroduceEmployeeId').value) &&
      CommonUtils.isNullOrEmpty(this.formPartyMember.get('secondIntroduceEmployeeId').value)
    ) {
      return false;
    }
    if (this.formPartyMember.get('firstIntroduceEmployeeId').value === this.formPartyMemberProcess.get('employeeId').value
      && this.formPartyMember.get('secondIntroduceEmployeeId').value === this.formPartyMemberProcess.get('employeeId').value) {
      this.app.errorMessage('partymember.doubleIntroduceDuplicateEmployeeInsert');
      return true;
    } else if (this.formPartyMember.get('firstIntroduceEmployeeId').value === this.formPartyMemberProcess.get('employeeId').value) {
      this.app.errorMessage('partymember.firstIntroduceDuplicateEmployeeInsert');
      return true;
    } else if (this.formPartyMember.get('secondIntroduceEmployeeId').value === this.formPartyMemberProcess.get('employeeId').value) {
      this.app.errorMessage('partymember.secondIntroduceDuplicateEmployeeInsert');
      return true;
    } else if (this.formPartyMember.get('firstIntroduceEmployeeId').value === this.formPartyMember.get('secondIntroduceEmployeeId').value) {
      this.app.errorMessage('partymember.firstIntroduceDuplicatesecondIntroduce');
      return true;
    }
  }

  /**
   * Kích hoạt để chọn người giới thiệu thứ nhất là trong hay ngoài sangnn
   * @param event 
   */
  public onChangeFirstIntroduceInOut(event) {
    if (event.target.checked) {
      this.isFirstIntroduceIn = true;
      this.formPartyMember.get('firstPositionUnit').disable();
      this.formPartyMember.get('firstIntroducePerson').setValue(null);
      this.formPartyMember.get('firstPositionUnit').setValue(null);
    } else {
      this.isFirstIntroduceIn = false;
      (this.firstIntroduceDataPicker.first as DataPickerComponent).delete(event);
      this.formPartyMember.get('firstPositionUnit').enable();
      this.formPartyMember.get('firstPositionUnit').setValue(null);
    }
  }

  /**
   *  Kích hoạt để chọn người giới thiệu thứ hai là trong hay ngoài sangnn
   * @param event 
   */
  public onChangeSecondIntroduceInOut(event) {
    if (event.target.checked) {
      this.isSecondIntroduceIn = true;
      this.formPartyMember.get('secondPositionUnit').disable();
      this.formPartyMember.get('secondIntroducePerson').setValue(null);
      this.formPartyMember.get('secondPositionUnit').setValue(null);
    } else {
      this.isSecondIntroduceIn = false;
      (this.secondIntroduceDataPicker.first as DataPickerComponent).delete(event);
      this.formPartyMember.get('secondPositionUnit').enable();
      this.formPartyMember.get('secondPositionUnit').setValue(null);
    }
  }

}
