import { Component, OnInit, ViewChildren } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { FileControl } from '@app/core/models/file.control';
import { EmpTypesService } from '@app/core/services/emp-type.service';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { NationService } from '@app/core/services/nation/nation.service';
import { ProvinceService } from '@app/core/services/province/province.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { DataPickerComponent } from '@app/shared/components/data-picker/data-picker.component';
import { ValidationService } from '@app/shared/services';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';



@Component({
  selector: 'personal-information-form-clone',
  templateUrl: './personal-information-form-clone.component.html',
})
export class PersonalInformationFormCloneComponent extends BaseComponent implements OnInit {
  formView: FormGroup;
  formSavePartyMember: FormGroup;
  formSaveOtherParty: FormArray;
  formSaveSecurityProtectionInfo: FormGroup;
  nationList: any = {};
  empTypeList: any = {};
  degreeList: any = {};
  empTypeFileList: any = {};
  ethnicList: any = {};
  religionList: any = {};
  provinceList: any = {};
  recuitList: any = {};
  employeeStatusList: any = {};
  officerTypeList: any = {};
  highestRankList: any = {};
  trainingResultList: any = {};
  noteTypeList: any = {};
  expressionViolationList: any = {};
  isInnerParty: boolean = true;
  employeeId: number;
  isView: boolean = false;
  isUpdate: boolean = false;
  isFirstIntroduceIn: boolean = true;
  isSecondIntroduceIn: boolean = true;
  linkGotoVHR: any;
  @ViewChildren('firstIntroduceDataPicker')
  public firstIntroduceDataPicker;

  @ViewChildren('secondIntroduceDataPicker')
  public secondIntroduceDataPicker;
  formConfig = {
    employeeId: [''],
    employeeCode: [''],
    employeeName: [{ value: '', disabled: true }],
    email: [''],
    gender: [{ value: '', disabled: true }],
    formatedSoldierNumber: [{ value: '', disabled: true }], // So hieu sy quan
    aliasName: [{ value: '', disabled: true }], // Bi danh
    dateOfBirth: [''],
    nationId: [],
    currentPosition: [{ value: '', disabled: true }],
    positionStartDate: [''],
    orgFullName: [{ value: '', disabled: true }],
    empTypeId: [''],
    soldierLevel: [{ value: '', disabled: true }],
    soldierSignedDate: [''], // ngay nhan chuc vu
    currentEducationGrade: [{ value: '', disabled: true }], // Trinh do dao tao
    degreeId: [''], // Hoc vi
    personalIdNumber: [{ value: '', disabled: true }],
    personalIdIssuedDate: [''],
    personalIdIssuedPlace: [{ value: '', disabled: true }],
    passportNumber: [{ value: '', disabled: true }],
    passportIssueDate: [''],
    maritalStatus: [{ value: '', disabled: true }],
    ethnicId: [''],
    religionId: [''],
    placeOfBirth: [{ value: '', disabled: true }],
    provinceOfBirthId: [''],
    origin: [{ value: '', disabled: true }],
    provinceOfOriginId: [''],
    permanentAddress: [{ value: '', disabled: true }],
    permanentProvinceId: [''],
    currentAddress: [{ value: '', disabled: true }],
    currentProvinceId: [''],
    mobileNumber: [{ value: '', disabled: true }],
    phoneNumber: [{ value: '', disabled: true }],
    fax: [{ value: '', disabled: true }],
    recruitTypeId: [''],
    status: [''],
    wentAbroad: [{ value: '', disabled: true }],
    sangnnStartDate: [''],
    firstSignedContractDate: [''],
    mobilizationDate: [''],
    managementCommand: [{ value: '', disabled: true }],
    politicalTheorist: [{ value: '', disabled: true }],
    technicalExpertiseProfession: [{ value: '', disabled: true }],
    empTypeFile: [null],
  };
  formSavePartyMemberConfig = {
    partyMemberId: [''],
    partyOrganizationId: [''],
    partyPositionId: [''],
    partyNumber: [null, [ValidationService.maxLength(50)]],
    partyOfficialAdmissionDate: [null],
    partyAdmissionPlace: ['', [ValidationService.maxLength(500)]],
    partyAdmissionDate: ['', [ValidationService.beforeCurrentDate]],
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
    trainingResultId: [],
    jobBefore: ['', [ValidationService.maxLength(200)]],
    mainJob: ['', [ValidationService.maxLength(200)]],
    highestRankId: [''],
    profileNumber: ['', [ValidationService.maxLength(200)]],
    officerTypeId: [''],
    unionNumber: ['', [ValidationService.maxLength(50)]],
    unionDate: [''],
    unionPlace: ['', [ValidationService.maxLength(200)]],
    isFirstIntroduceIn: [''],
    isSecondIntroduceIn: [''],
  };
  formSecurityProtectionInfoConfig = {
    noteTypeId: [''], // Thong tin can chu y
    expressionViolationIdList: [''], // Bieu hien pham vi
    description: ['', [ValidationService.maxLength(1000)]], // Mo ta chi tiet
  };

  constructor(private curriculumVitaeService: CurriculumVitaeService,
    private employeeResolver: EmployeeResolver,
    private nationService: NationService,
    private provinceService: ProvinceService,
    private empTypeService: EmpTypesService,
    private sysCatService: SysCatService,
    private app: AppComponent,
    private router: Router,
    private categoryService: CategoryService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
    this.formView = this.buildForm({}, this.formConfig);
    this.buildformSavePartyMember({});
    this.buildFormOtherParty();
    this.buildFormSecurityProtectionInfo({});

    this.employeeResolver.EMPLOYEE.subscribe(
      data => {
        if (data) {
          this.curriculumVitaeService.findOne(data).subscribe(res => {
            // Load thong tin chung cua nhan vien
            this.formView = this.buildForm(res.data, this.formConfig);
            this.linkGotoVHR = APP_CONSTANTS.VHR.URL_VIEW_EMPLOYEE + res.data.employeeCode;
          });

          // Load thong tin dang vien, doan vien, thong tin BVAN
          this.curriculumVitaeService.getPartyMemberDetail(data).subscribe(res => {
            this.buildformSavePartyMember(res.data);
            this.buildFormSecurityProtectionInfo(res.data);
            // Lay danh sach bieu hien vi pham
            this.getExpressionViolationList(res.data.noteTypeId);
          });

          // Load thong tin to chuc khac
          this.curriculumVitaeService.getOtherPartyList(data).subscribe(res => {
            this.buildFormOtherParty(res.data);
          });
          // Load danh sach thong tin qua trinh dao tao o nuoc ngoai
          this.curriculumVitaeService.getListForeignEduPlace(data).subscribe(res => {
            this.resultList = res;
          });
          this.employeeId = data;

        }
      }
    );
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 4) {
      this.isView = subPaths[4] === 'view';
      this.isUpdate = subPaths[4] === 'edit'
    }
    // Quốc tịch
    this.nationService.getNationList().subscribe(res => this.nationList = res.data);

    // Danh sách diện đối tượng
    this.empTypeService.getListEmpType().subscribe(res => this.empTypeList = res);

    // Danh muc hoc vi
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.DEGREE).subscribe(res => this.degreeList = res.data);

    // Danh sach dan toc
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.ETHNIC).subscribe(res => this.ethnicList = res.data);

    // Danh sach ton giao
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.RELIGION).subscribe(res => this.religionList = res.data);

    // Danh sach tinh thanh
    this.provinceService.getProvinceList().subscribe(res => this.provinceList = res.data);

    // Loại tuyển dụng
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.RECUIT).subscribe(res => this.recuitList = res.data);

    // Trang thai lam viec
    this.employeeStatusList = APP_CONSTANTS.WORKING_STATUS;

    // Lấy ra danh sách Quân hàm cao nhất
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.HIGHEST_RANK).subscribe(res => this.highestRankList = res.data);
    // Lấy ra danh sách Kết quả bồi dưỡng
    this.trainingResultList = APP_CONSTANTS.TRAINING_RESULT;
    // Lấy ra danh sách Loại cán bộ
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.OFFICER_TYPE).subscribe(res => this.officerTypeList = res.data);
    // Lấy danh sách các tùy chọn cho [Thông tin cần chú ý]
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.EMPLOYEE_NOTE_TYPE).subscribe(res => this.noteTypeList = res.data);

    // Danh muc diện đối tượng hồ sơ
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.EMP_TYPE_FILE).subscribe(res => this.empTypeFileList = res.data);
  }

  /* */
  get f() {
    return this.formView.controls;
  }

  get fPartyMember() {
    return this.formSavePartyMember.controls;
  }

  get fSecurityProtection() {
    return this.formSaveSecurityProtectionInfo.controls;
  }

  private buildFormOtherParty(otherPartyList?: any): void {
    if (!otherPartyList) {
      this.formSaveOtherParty = new FormArray([this.createDefaultFormOtherParty()]);
    } else {
      const controls = new FormArray([]);
      for (const item of otherPartyList) {
        const group = this.createDefaultFormOtherParty();
        group.patchValue(item);
        controls.push(group);
      }
      this.formSaveOtherParty = controls;
    }
  }

  private createDefaultFormOtherParty(): FormGroup {
    const group = {
      otherPartyId: [null],
      partyName: [null, [ValidationService.maxLength(200)]],
      joinedPlace: [null, [ValidationService.maxLength(200)]],
      joinedDate: [null],
    };
    return this.buildForm({}, group);
  }

  private buildformSavePartyMember(data?: any): void {
    this.formSavePartyMember = this.buildForm(
      data,
      this.formSavePartyMemberConfig,
      ACTION_FORM.INSERT,
      [ValidationService.notAffter('partyAdmissionDate', 'partyOfficialAdmissionDate', 'generalInformation.label.partyDateJoinSuccess')]
    );
    this.setIntroduceValue(data);

  }

  private buildFormSecurityProtectionInfo(data?: any): void {
    this.formSaveSecurityProtectionInfo = this.buildForm(data, this.formSecurityProtectionInfoConfig);
    const fileInfomationSecurityControl = new FileControl(null);
    if (data && data.fileAttachment && data.fileAttachment.fileInfomationSecurity) {
      fileInfomationSecurityControl.setFileAttachment(data.fileAttachment.fileInfomationSecurity);
    }
    this.formSaveSecurityProtectionInfo.addControl('fileInfomationSecurity', fileInfomationSecurityControl);

    const fileJudicialRecordControl = new FileControl(null);
    if (data && data.fileAttachment && data.fileAttachment.fileJudicialRecord) {
      fileJudicialRecordControl.setFileAttachment(data.fileAttachment.fileJudicialRecord);
    }
    this.formSaveSecurityProtectionInfo.addControl('fileJudicialRecord', fileJudicialRecordControl);

    const filePoliticalStandardControl = new FileControl(null);
    if (data && data.fileAttachment && data.fileAttachment.filePoliticalStandard) {
      filePoliticalStandardControl.setFileAttachment(data.fileAttachment.filePoliticalStandard);
    }
    this.formSaveSecurityProtectionInfo.addControl('filePoliticalStandard', filePoliticalStandardControl);

    const fileLeaderCommentControl = new FileControl(null);
    if (data && data.fileAttachment && data.fileAttachment.fileLeaderComment) {
      fileLeaderCommentControl.setFileAttachment(data.fileAttachment.fileLeaderComment);
    }
    this.formSaveSecurityProtectionInfo.addControl('fileLeaderComment', fileLeaderCommentControl);

    const fileSelfProfileControl = new FileControl(null);
    if (data && data.fileAttachment && data.fileAttachment.fileSelfProfile) {
      fileSelfProfileControl.setFileAttachment(data.fileAttachment.fileSelfProfile);
    }
    this.formSaveSecurityProtectionInfo.addControl('fileSelfProfile', fileSelfProfileControl);
  }

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
      property.setValue('');
    }
  }

  public onChangeIsInnerParty(event) {
    if (event.target.checked) {
      this.isInnerParty = false;
    } else {
      this.isInnerParty = true;
      this.formSavePartyMember.get('innerPartyOrganizationId').setValue('');
    }
  }

  /**
   * addOtherParty
   * param index
   * param item
   */
  public addOtherParty(index: number) {
    const controls = this.formSaveOtherParty as FormArray;
    controls.insert(index + 1, this.createDefaultFormOtherParty());
  }
  /**
   * removeOtherParty
   * param index
   * param item
   */
  public removeOtherParty(index: number) {
    const controls = this.formSaveOtherParty as FormArray;
    if (controls.length === 1) {
      return;
    }
    controls.removeAt(index);
  }

  public onChangeEmployeeNoteType() {
    this.formSaveSecurityProtectionInfo.get('expressionViolationIdList').setValue([]);
    const noteTypeId = this.formSaveSecurityProtectionInfo.get('noteTypeId').value;
    this.getExpressionViolationList(noteTypeId);
  }

  /**
   * Lay danh sach bieu hien vi pham
   */
  private getExpressionViolationList(noteTypeId): void {
    const noteTypeCode = this.findNoteTypeCode(noteTypeId);
    if (CommonUtils.isNullOrEmpty(noteTypeCode)) {
      this.expressionViolationList = [];
      return;
    }
    if (noteTypeCode === 'BT') {
      this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.VIOLATE_YOUR).subscribe(res => this.expressionViolationList = res.data);
    } else if (noteTypeCode === 'GĐ') {
      this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.VIOLATE_FAMILY).subscribe(res => this.expressionViolationList = res.data);
    } else {
      this.expressionViolationList = [];
    }
  }

  /**
   * Tim note type code theo note type id
   */
  private findNoteTypeCode(noteTypeId): String {
    if (CommonUtils.isNullOrEmpty(noteTypeId) || !this.noteTypeList) {
      return null;
    }
    for (const noteType of this.noteTypeList) {
      if (noteType.sysCatId === noteTypeId) {
        return noteType.code;
      }
    }
    return null;
  }

  /**
   * processSaveOrUpdate
   */
  public doSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSavePartyMember)
      || !CommonUtils.isValidForm(this.formSaveOtherParty)
      || this.isDuplicateIntroduceEmployee()
      || this.validateInfoOfViolation()) {
      return;
    }
    this.app.confirmMessage(null, () => { // on accepted
      const formSave = {};
      formSave['employeeId'] = this.employeeId;
      formSave['empTypeFile'] = this.formView.controls['empTypeFile'].value;
      formSave['partyMemberForm'] = this.formSavePartyMember.value;
      formSave['otherPartyForm'] = this.formSaveOtherParty.value;
      formSave['securityProtectionForm'] = this.formSaveSecurityProtectionInfo.value;
      this.curriculumVitaeService.saveOrUpdateFormFile(formSave).subscribe(res => {
        if (this.curriculumVitaeService.requestIsSuccess(res)) {
          this.curriculumVitaeService.findOne(this.employeeId).subscribe(res => {
            // Load thong tin chung cua nhan vien
            this.formView = this.buildForm(res.data, this.formConfig);
            this.linkGotoVHR = APP_CONSTANTS.VHR.URL_VIEW_EMPLOYEE + res.data.employeeCode;
          });

          // Load thong tin dang vien, doan vien, thong tin BVAN
          this.curriculumVitaeService.getPartyMemberDetail(this.employeeId).subscribe(res => {
            this.buildformSavePartyMember(res.data);
            this.buildFormSecurityProtectionInfo(res.data);
            // Lay danh sach bieu hien vi pham
            this.getExpressionViolationList(res.data.noteTypeId);
          });

          this.curriculumVitaeService.getOtherPartyList(this.employeeId).subscribe(res => {
            this.buildFormOtherParty(res.data);
          });
        }
      });
    }, () => {
      // on rejected
    });
  }

  public goBack() {
    // Neu di tu menu dang vien thi back lai man hinh danh sach dang vien
    this.router.navigate(['/party-organization/party-member-clone']);
  }

  /**
   * Validate trung lap nguoi gioi thieu
   */
  public isDuplicateIntroduceEmployee(): boolean {
    if (
      CommonUtils.isNullOrEmpty(this.formSavePartyMember.get('firstIntroduceEmployeeId').value) &&
      CommonUtils.isNullOrEmpty(this.formSavePartyMember.get('secondIntroduceEmployeeId').value)
    ) {
      return false;
    }
    if (this.formSavePartyMember.get('firstIntroduceEmployeeId').value === this.formView.get('employeeId').value
      && this.formSavePartyMember.get('secondIntroduceEmployeeId').value === this.formView.get('employeeId').value) {
      this.app.errorMessage('partymember.doubleIntroduceDuplicateEmployeeInsert');
      return true;
    } else if (this.formSavePartyMember.get('firstIntroduceEmployeeId').value === this.employeeId) {
      this.app.errorMessage('partymember.firstIntroduceDuplicateEmployee');
      return true;
    } else if (this.formSavePartyMember.get('secondIntroduceEmployeeId').value === this.employeeId) {
      this.app.errorMessage('partymember.secondIntroduceDuplicateEmployee');
      return true;
    } else if (this.formSavePartyMember.get('firstIntroduceEmployeeId').value === this.formSavePartyMember.get('secondIntroduceEmployeeId').value) {
      this.app.errorMessage('partymember.firstIntroduceDuplicatesecondIntroduce');
      return true;
    }
  }

  public onChangeFirstIntroduceInOut(event) {
    if (event.target.checked) {
      this.isFirstIntroduceIn = false;
      (this.firstIntroduceDataPicker.first as DataPickerComponent).delete(event);
      this.formSavePartyMember.get('firstPositionUnit').disable();
      this.formSavePartyMember.get('firstIntroducePerson').setValue(null);
      this.formSavePartyMember.get('firstPositionUnit').setValue(null);
    } else {
      this.isFirstIntroduceIn = true;
      this.formSavePartyMember.get('firstPositionUnit').enable();
      this.formSavePartyMember.get('firstIntroduceEmployeeId').setValue(null);
      this.formSavePartyMember.get('firstPositionUnit').setValue(null);
    }
  }

  public onChangeSecondIntroduceInOut(event) {
    if (event.target.checked) {
      this.isSecondIntroduceIn = false;
      (this.secondIntroduceDataPicker.first as DataPickerComponent).delete(event);
      this.formSavePartyMember.get('secondPositionUnit').disable();
      this.formSavePartyMember.get('secondIntroducePerson').setValue(null);
      this.formSavePartyMember.get('secondPositionUnit').setValue(null);
    } else {
      this.isSecondIntroduceIn = true;
      this.formSavePartyMember.get('secondPositionUnit').enable();
      this.formSavePartyMember.get('secondIntroduceEmployeeId').setValue(null);
      this.formSavePartyMember.get('secondPositionUnit').setValue(null);
    }
  }

  setIntroduceValue(data) {
    if (data && data.firstIntroduceEmployeeId > 0) {
      this.formSavePartyMember.controls['isFirstIntroduceIn'].setValue(1);
      this.isFirstIntroduceIn = false;
      this.curriculumVitaeService.findOne(data.firstIntroduceEmployeeId).subscribe(res => {
        const positionName = res.data.currentPosition;
        const organizationName = res.data.organizationName;
        if (positionName !== null && organizationName !== null) {
          this.formSavePartyMember.controls['firstPositionUnit'].setValue(positionName + ' - ' + organizationName);
        } else if (positionName !== null) {
          this.formSavePartyMember.controls['firstPositionUnit'].setValue(positionName);
        } else if (organizationName !== null) {
          this.formSavePartyMember.controls['firstPositionUnit'].setValue(organizationName);
        }
      });
    } else {
      this.isFirstIntroduceIn = true;
    }
    if (data && data.secondIntroduceEmployeeId > 0) {
      this.formSavePartyMember.controls['isSecondIntroduceIn'].setValue(1);
      this.isSecondIntroduceIn = false;
      this.curriculumVitaeService.findOne(data.secondIntroduceEmployeeId).subscribe(res => {
        const positionName = res.data.currentPosition;
        const organizationName = res.data.organizationName;
        if (positionName !== null && organizationName !== null) {
          this.formSavePartyMember.controls['secondPositionUnit'].setValue(positionName + ' - ' + organizationName);
        } else if (positionName !== null) {
          this.formSavePartyMember.controls['secondPositionUnit'].setValue(positionName);
        } else if (organizationName !== null) {
          this.formSavePartyMember.controls['secondPositionUnit'].setValue(organizationName);
        }
      });
    } else {
      this.isSecondIntroduceIn = true;
    }
    if (data.isInnerParty === 1) {
      this.isInnerParty = false;
    }
  }

  public validateInfoOfViolation(): boolean {
    if (!CommonUtils.isNullOrEmpty(this.formSaveSecurityProtectionInfo.get('noteTypeId').value) &&
      CommonUtils.isNullOrEmpty(this.formSaveSecurityProtectionInfo.get('expressionViolationIdList').value)) {
      this.app.errorMessage('personalInfo.validateInfoOfViolation');
      return true;
    }
    return false;
  }

}
