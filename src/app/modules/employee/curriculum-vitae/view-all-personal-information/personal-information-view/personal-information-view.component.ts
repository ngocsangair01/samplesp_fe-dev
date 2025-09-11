import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { APP_CONSTANTS } from '@app/core';
import { FileControl } from '@app/core/models/file.control';
import { EmpTypesService } from '@app/core/services/emp-type.service';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { NationService } from '@app/core/services/nation/nation.service';
import { ProvinceService } from '@app/core/services/province/province.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';

@Component({
  selector: 'personal-information-view',
  templateUrl: './personal-information-view.component.html',
  styleUrls: ['./personal-information-view.component.css']
})
export class PersonalInformationViewComponent extends BaseComponent implements OnInit {
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
  isFirstIntroduceIn: boolean = true;
  isSecondIntroduceIn: boolean = true;
  isInnerParty: boolean = true;
  isViewMore: boolean = false;
  isMobileScreen: boolean = false;
  employeeId: number;
  formConfig = {
    employeeId: [{ value: '', disabled: true }],
    employeeCode: [{ value: '', disabled: true }],
    employeeName: [{ value: '', disabled: true }],
    email: [{ value: '', disabled: true }],
    gender: [{ value: '', disabled: true }],
    formatedSoldierNumber: [{ value: '', disabled: true }], // So hieu sy quan
    aliasName: [{ value: '', disabled: true }], // Bi danh
    dateOfBirth: [{ value: '', disabled: true }],
    nationId: [{ value: '', disabled: true }],
    currentPosition: [{ value: '', disabled: true }],
    positionStartDate: [{ value: '', disabled: true }],
    orgFullName: [{ value: '', disabled: true }],
    empTypeId: [{ value: '', disabled: true }],
    soldierLevel: [{ value: '', disabled: true }],
    soldierSignedDate: [{ value: '', disabled: true }], // ngay nhan chuc vu
    currentEducationGrade: [{ value: '', disabled: true }], // Trinh do dao tao
    degreeId: [{ value: '', disabled: true }], // Hoc vi
    personalIdNumber: [{ value: '', disabled: true }],
    personalIdIssuedDate: [{ value: '', disabled: true }],
    personalIdIssuedPlace: [{ value: '', disabled: true }],
    passportNumber: [{ value: '', disabled: true }],
    passportIssueDate: [{ value: '', disabled: true }],
    maritalStatus: [{ value: '', disabled: true }],
    ethnicId: [{ value: '', disabled: true }],
    religionId: [{ value: '', disabled: true }],
    placeOfBirth: [{ value: '', disabled: true }],
    provinceOfBirthId: [{ value: '', disabled: true }],
    origin: [{ value: '', disabled: true }],
    provinceOfOriginId: [{ value: '', disabled: true }],
    permanentAddress: [{ value: '', disabled: true }],
    permanentProvinceId: [{ value: '', disabled: true }],
    currentAddress: [{ value: '', disabled: true }],
    currentProvinceId: [{ value: '', disabled: true }],
    mobileNumber: [{ value: '', disabled: true }],
    phoneNumber: [{ value: '', disabled: true }],
    fax: [{ value: '', disabled: true }],
    recruitTypeId: [{ value: '', disabled: true }],
    status: [{ value: '', disabled: true }],
    wentAbroad: [{ value: '', disabled: true }],
    sangnnStartDate: [{ value: '', disabled: true }],
    firstSignedContractDate: [{ value: '', disabled: true }],
    mobilizationDate: [{ value: '', disabled: true }],
    managementCommand: [{ value: '', disabled: true }],
    politicalTheorist: [{ value: '', disabled: true }],
    technicalExpertiseProfession: [{ value: '', disabled: true }],
    empTypeFile: [{ value: '', disabled: true }],
  };
  formSavePartyMemberConfig = {
    partyMemberId: [{ value: '', disabled: true }],
    partyOrganizationId: [{ value: '', disabled: true }],
    partyPositionId: [{ value: '', disabled: true }],
    partyNumber: [{ value: '', disabled: true }],
    partyOfficialAdmissionDate: [{ value: '', disabled: true }],
    partyAdmissionPlace: [{ value: '', disabled: true }],
    partyAdmissionDate: [{ value: '', disabled: true }],
    exceptPartyOrganizationId: [{ value: '', disabled: true }],
    exceptPartyDate: [{ value: '', disabled: true }],
    isInnerParty: [{ value: '', disabled: true }],
    innerPartyOrganizationId: [{ value: '', disabled: true }],
    firstIntroduceEmployeeId: [{ value: '', disabled: true }],
    firstIntroducePerson: [{ value: '', disabled: true }],
    firstPositionUnit: [{ value: '', disabled: true }],
    secondIntroduceEmployeeId: [{ value: '', disabled: true }],
    secondIntroducePerson: [{ value: '', disabled: true }],
    secondPositionUnit: [{ value: '', disabled: true }],
    trainingUnit: [{ value: '', disabled: true }],
    trainingResultId: [{ value: '', disabled: true }],
    jobBefore: [{ value: '', disabled: true }],
    mainJob: [{ value: '', disabled: true }],
    highestRankId: [{ value: '', disabled: true }],
    profileNumber: [{ value: '', disabled: true }],
    officerTypeId: [{ value: '', disabled: true }],
    unionNumber: [{ value: '', disabled: true }],
    unionDate: [{ value: '', disabled: true }],
    unionPlace: [{ value: '', disabled: true }],
    isFirstIntroduceIn: [{ value: '', disabled: true }],
    isSecondIntroduceIn: [{ value: '', disabled: true }],
  };
  formSecurityProtectionInfoConfig = {
    noteTypeId: [{ value: '', disabled: true }], // Thong tin can chu y
    expressionViolationIdList: [{ value: '', disabled: true }], // Bieu hien pham vi
    description: [{ value: '', disabled: true }], // Mo ta chi tiet
  };
  constructor(
    private curriculumVitaeService: CurriculumVitaeService,
    private employeeResolver: EmployeeResolver,
    private nationService: NationService,
    private provinceService: ProvinceService,
    private empTypeService: EmpTypesService,
    private sysCatService: SysCatService,
    private categoryService: CategoryService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeT63Information"));
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
          });

          this.employeeId = data;
          this.isViewMore = false;
        }
      }
    );
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
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
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.SOLDIER_LEVEL).subscribe(res => this.highestRankList = res.data);
    // Lấy ra danh sách Kết quả bồi dưỡng
    this.trainingResultList = APP_CONSTANTS.TRAINING_RESULT;
    // Lấy ra danh sách Loại cán bộ
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.OFFICER_TYPE).subscribe(res => this.officerTypeList = res.data);
    // Lấy danh sách các tùy chọn cho [Thông tin cần chú ý]
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.EMPLOYEE_NOTE_TYPE).subscribe(res => this.noteTypeList = res.data);

    // Danh muc diện đối tượng hồ sơ
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.EMP_TYPE_FILE).subscribe(res => this.empTypeFileList = res.data);
  }

  get f() {
    return this.formView.controls;
  }

  get fPartyMember() {
    return this.formSavePartyMember.controls;
  }

  get fSecurityProtection() {
    return this.formSaveSecurityProtectionInfo.controls;
  }

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

  private buildformSavePartyMember(data?: any): void {
    this.formSavePartyMember = this.buildForm(data, this.formSavePartyMemberConfig);
    this.setIntroduceValue(data);
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
      otherPartyId: [{ value: '', disabled: true }],
      partyName: [{ value: '', disabled: true }],
      joinedPlace: [{ value: '', disabled: true }],
      joinedDate: [{ value: '', disabled: true }],
    };
    return this.buildForm({}, group);
  }

  public viewMore() {
    if (!this.isViewMore) {
      // Load thong tin dang vien, doan vien, thong tin BVAN
      this.curriculumVitaeService.getPartyMemberDetail(this.employeeId)
        .subscribe(res => {
          this.buildformSavePartyMember(res.data);
        });
      this.isViewMore = true;
    } else {
      this.isViewMore = false;
    }
  }
}
