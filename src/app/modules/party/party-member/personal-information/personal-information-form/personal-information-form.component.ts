import { Component, OnInit, ViewChildren } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { FileControl } from '@app/core/models/file.control';
import { EmpTypesService } from '@app/core/services/emp-type.service';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { TransferEmployeeService } from '@app/core/services/employee/transfer-employee.service';
import { NationService } from '@app/core/services/nation/nation.service';
import { PartyMemebersService } from '@app/core/services/party-organization/party-members.service';
import { ProvinceService } from '@app/core/services/province/province.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { DataPickerComponent } from '@app/shared/components/data-picker/data-picker.component';
import { ValidationService } from '@app/shared/services';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';
import { environment } from '@env/environment';
import { TranslationService } from 'angular-l10n';
import {RelativeAbroadService} from "@app/core/services/security/relativeAbroad.service";
import {StudyAbroadService} from "@app/core/services/security/studyAbroad.service";
import {WorkedAbroadService} from "@app/core/services/security/workedAbroad.service";

@Component({
  selector: 'personal-information-form',
  templateUrl: './personal-information-form.component.html',
  styleUrls: ['./personal-information-form.component.css']
})
export class PersonalInformationFormComponent extends BaseComponent implements OnInit {
  formView: FormGroup;
  formSavePartyMember: FormGroup;
  formSaveOtherParty: FormArray;
  formSaveSecurityProtectionInfo: FormGroup;
  nationList: any;
  empTypeList: any;
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
  expressionViolationList: any = [];
  individualExpressionViolationList: any = [];
  relativeAbroad: any;
  studyAbroad: any;
  workedAbroad: any;
  isInnerParty: boolean = true;
  employeeId: number;
  isView: boolean = false;
  isUpdate: boolean = false;
  isFirstIntroduceIn: boolean = true;
  isSecondIntroduceIn: boolean = true;
  linkGotoVHR: any;
  empInfo: any;
  partyInfo: any;
  empType: any;
  nation: any;
  public API_URL = environment.serverUrl['political'];
  hideGeneralInformation: boolean = false;
  hidePersonalInformation: boolean = false;
  hidePartyInformation: boolean = false;
  hideOtherInformation: boolean = false;
  hideSecurityInformation: boolean = false;
  settings = {
    singleSelection: false,
    text: this.translation.translate('common.label.cboSelect'),
    selectAllText: this.translation.translate('common.label.choseAll'),
    unSelectAllText: 'Bỏ chọn tất cả',
    searchPlaceholderText: this.translation.translate('common.label.cboSelect'),
    enableSearchFilter: true,
    groupBy: 'groupName',
    labelKey: 'name',
    primaryKey: 'sysCatId',
    noDataLabel: this.translation.translate('common.label.noData'),
    disabled: false
  };
  selectedItems = [];
  strPartyCongressTitle: string;
  strPartyOrgTitle: string;
  isValidIndividualExpressionDesciption: any;
  isValidRelativeExpressionDescription: any;
  isMobileScreen: boolean = false;

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
    strPartyCongressTitle: [''],
    strPartyOrgTitle: [''],
  };

  formSecurityProtectionInfoConfig = {
    description: ['', [ValidationService.maxLength(1000)]], // Mo ta nhan than,
    individualDescription: ['', [ValidationService.maxLength(1000)]], // Mo ta ca nhan,
    individualExpressionViolationIdList: [''], // Bieu hien ca nhan
    expressionViolationIdList: [''] // Bieu hien nhan than
  };

  constructor(private curriculumVitaeService: CurriculumVitaeService,
    private employeeResolver: EmployeeResolver,
    private nationService: NationService,
    private provinceService: ProvinceService,
    private empTypeService: EmpTypesService,
    private sysCatService: SysCatService,
    private transferEmployeeService: TransferEmployeeService,
    private app: AppComponent,
    private router: Router,
    private categoryService: CategoryService,
    public translation: TranslationService,
    private relativeAbroadService : RelativeAbroadService,
    private studyAbroadService : StudyAbroadService,
    private workedAbroadService : WorkedAbroadService,
    private partyMemebersService: PartyMemebersService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyMember"));
    this.formView = this.buildForm({}, this.formConfig);
    this.buildformSavePartyMember({});
    this.buildFormOtherParty();
    this.buildFormSecurityProtectionInfo({});

    this.employeeResolver.EMPLOYEE.subscribe(
      data => {
        if (data) {
          this.curriculumVitaeService.findOne(data).subscribe(res => {
            this.empInfo = res.data;
            if (this.empInfo && this.empInfo.empTypeId) {
              let types = (this.empTypeList && this.empTypeList.length) ? this.empTypeList .filter((item: any) => item.empTypeId === this.empInfo.empTypeId) : [];
              this.empType = types[0];
            }
            if (this.empInfo && this.empInfo.nationId) {
              let nations = (this.nationList && this.nationList.length) ? this.nationList.filter((item: any) => item.nationId === this.empInfo.nationId): [];
              this.nation = nations[0];
            }
            // Load thong tin chung cua nhan vien
            this.formView = this.buildForm(res.data, this.formConfig);
            this.linkGotoVHR = APP_CONSTANTS.VHR.URL_VIEW_EMPLOYEE + res.data.employeeCode;
          });

          // Load thong tin dang vien, doan vien, thong tin BVAN
          this.curriculumVitaeService.getPartyMemberDetail(data).subscribe(res => {
            this.partyInfo = res.data;
            this.buildformSavePartyMember(res.data);
            this.buildFormSecurityProtectionInfo(res.data);
            this.strPartyCongressTitle = res.data.strPartyCongressTitle;
            this.strPartyOrgTitle = res.data.strPartyOrgTitle;
          });

          // Load thong tin to chuc khac
          this.curriculumVitaeService.getOtherPartyList(data).subscribe(res => {
            this.buildFormOtherParty(res.data);
          });

          // Load danh sach thong tin qua trinh dao tao o nuoc ngoai
          this.curriculumVitaeService.getListForeignEduPlace(data).subscribe(res => {
            this.resultList = res;
          });
          // người thân ở nước ngoài
          this.relativeAbroadService.getListRelativeAbroad(data).subscribe(res => {
            this.relativeAbroad = res
          })
          // người thân ở nước ngoài
          this.studyAbroadService.getListStudyAbroad(data).subscribe(res => {
            this.studyAbroad = res
          })
          // người thân ở nước ngoài
          this.workedAbroadService.getListWorkedAbroad(data).subscribe(res => {
            this.workedAbroad = res
          })
          this.employeeId = data;
        }
      }
    );
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 5) {
      this.isView = subPaths[5] === 'view';
      this.isUpdate = subPaths[5] === 'edit'
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
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.SOLDIER_LEVEL).subscribe(res => this.highestRankList = res.data);

    // Lấy ra danh sách Kết quả bồi dưỡng
    this.trainingResultList = APP_CONSTANTS.TRAINING_RESULT;

    // Lấy ra danh sách Loại cán bộ
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.OFFICER_TYPE).subscribe(res => this.officerTypeList = res.data);

    // Lấy danh sách các tùy chọn cho [Thông tin cần chú ý]
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.EMPLOYEE_NOTE_TYPE).subscribe(res => this.noteTypeList = res.data);

    // Danh muc diện đối tượng hồ sơ
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.EMP_TYPE_FILE).subscribe(res => this.empTypeFileList = res.data);

    // Biểu hiện vi phạm
    this.sysCatService.findBySysCatTypeIds(APP_CONSTANTS.SYS_CAT_TYPE_ID.VIOLATE_YOUR + "," + APP_CONSTANTS.SYS_CAT_TYPE_ID.VIOLATE_FAMILY)
      .subscribe(res => {
        if (res.data) {
          res.data.forEach(e => {
            if(e.sysCatTypeId == APP_CONSTANTS.SYS_CAT_TYPE_ID.VIOLATE_YOUR){
            // Biểu hiện vi phạm cá nhân
              e.groupName = "Bản thân";
              this.individualExpressionViolationList.push(e);
            }
            else {
            // Biểu hiện vi phạm nhân thân
              e.groupName = "Gia đình";
              this.expressionViolationList.push(e)
            }
          });
        }
      });
    this.partyMemebersService.savePartyMember.subscribe(res => {
      this.doSaveOrUpdate();
    })
    this.partyMemebersService.selectMenuItem.subscribe(res => {
      let element = document.getElementById(res);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    })
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
      this.formSavePartyMemberConfig, ACTION_FORM.INSERT,
      [ValidationService.notAffter('partyAdmissionDate', 'partyOfficialAdmissionDate', 'generalInformation.label.partyDateJoinSuccess')]
    );
    this.setIntroduceValue(data);
  }

  private buildFormSecurityProtectionInfo(data?: any): void {
    this.formSaveSecurityProtectionInfo = this.buildForm(data, this.formSecurityProtectionInfoConfig);

    const fileInfomationSecurityControl = new FileControl(null);
    const fileJudicialRecordControl = new FileControl(null);
    const filePoliticalStandardControl = new FileControl(null);
    const fileLeaderCommentControl = new FileControl(null);
    const fileSelfProfileControl = new FileControl(null);
    if (data && data.fileAttachment) {
      if (data.fileAttachment.fileInfomationSecurity) {
        fileInfomationSecurityControl.setFileAttachment(data.fileAttachment.fileInfomationSecurity);
      }

      if (data.fileAttachment.fileJudicialRecord) {
        fileJudicialRecordControl.setFileAttachment(data.fileAttachment.fileJudicialRecord);
      }

      if (data.fileAttachment.filePoliticalStandard) {
        filePoliticalStandardControl.setFileAttachment(data.fileAttachment.filePoliticalStandard);
      }

      if (data.fileAttachment.fileLeaderComment) {
        fileLeaderCommentControl.setFileAttachment(data.fileAttachment.fileLeaderComment);
      }

      if (data.fileAttachment.fileSelfProfile) {
        fileSelfProfileControl.setFileAttachment(data.fileAttachment.fileSelfProfile);
      }
    }
    this.formSaveSecurityProtectionInfo.addControl('fileInfomationSecurity', fileInfomationSecurityControl);
    this.formSaveSecurityProtectionInfo.addControl('fileJudicialRecord', fileJudicialRecordControl);
    this.formSaveSecurityProtectionInfo.addControl('filePoliticalStandard', filePoliticalStandardControl);
    this.formSaveSecurityProtectionInfo.addControl('fileLeaderComment', fileLeaderCommentControl);
    this.formSaveSecurityProtectionInfo.addControl('fileSelfProfile', fileSelfProfileControl);

    // Bieu hien nhan than
    const temp = [];
    if (this.fSecurityProtection['expressionViolationIdList'].value) {
      this.fSecurityProtection['expressionViolationIdList'].value.forEach(item => {
        const index = this.expressionViolationList.findIndex(x => x.sysCatId === item);
        if (index >= 0) {
          temp.push(this.expressionViolationList[index]);
        }
      });
    }
    this.fSecurityProtection['expressionViolationIdList'].setValue(temp);

    // Bieu hien ca nhan
    const temp1 = [];
    if (this.fSecurityProtection['individualExpressionViolationIdList'].value) {
      this.fSecurityProtection['individualExpressionViolationIdList'].value.forEach(item => {
        const index = this.individualExpressionViolationList.findIndex(x => x.sysCatId === item);
        if (index >= 0) {
          temp1.push(this.individualExpressionViolationList[index]);
        }
      });
    }
    this.fSecurityProtection['individualExpressionViolationIdList'].setValue(temp1);
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

  /**
   * processSaveOrUpdate
   */
  public doSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSavePartyMember)
      || !CommonUtils.isValidForm(this.formSaveOtherParty)
      || this.isDuplicateIntroduceEmployee()
      || this.setRequiredDescription()) {
      return;
    }
    this.app.confirmMessage(null, () => { // on accepted
      const formSave = {};
      formSave['employeeId'] = this.employeeId;
      formSave['empTypeFile'] = this.formView.controls['empTypeFile'].value;
      formSave['partyMemberForm'] = this.formSavePartyMember.value;
      formSave['otherPartyForm'] = this.formSaveOtherParty.value;
      formSave['securityProtectionForm'] = this.formSaveSecurityProtectionInfo.value;
      // Bieu hien vi pham ca nhan
      formSave['securityProtectionForm'].individualExpressionViolationIdList = this.fSecurityProtection['individualExpressionViolationIdList'].value.map(x => x.sysCatId);
      // Bieu hien vi pham nhan than
      formSave['securityProtectionForm'].expressionViolationIdList = this.fSecurityProtection['expressionViolationIdList'].value.map(x => x.sysCatId);      this.curriculumVitaeService.saveOrUpdateFormFile(formSave).subscribe(res => {
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

  exportCurriculumVitae() {
    if (this.employeeId && this.employeeId > 0) {
      this.curriculumVitaeService.exportCurriculumVitae(this.employeeId).subscribe(res => {
        saveAs(res, 'So_yeu_ly_lich.docx');
      });
    }
  }

  exportPartyMemberInfo() {
    if (this.employeeId && this.employeeId > 0) {
      this.partyMemebersService.exportPartyMemberInfo(this.employeeId).subscribe(res => {
        saveAs(res, 'Phieu_dang_vien.docx');
      });
    }
  }

  public goBack() {
    this.router.navigate(['/party-organization/party-member']);
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
  // Xử lý hiển thị validate bắt buộc hoặc không bắt buộc nhập mô tả vấn đề vi phạm
  setRequiredDescription() {
    // danh sách biểu hiện vi phạm nhân thân
    const lstRelativeExpressionViolation = this.formSaveSecurityProtectionInfo.value.expressionViolationIdList;
    // mô tả vi phạm nhân thân
    const relativeDescription = this.formSaveSecurityProtectionInfo.value.description;
    // danh sách biểu hiện vi phạm cá nhân
    const lstIndividualExpressionViolation = this.formSaveSecurityProtectionInfo.value.individualExpressionViolationIdList;
    // mô tả biểu hiện vi phạm cá nhân
    const individualDescription = this.formSaveSecurityProtectionInfo.value.individualDescription;
    this.isValidIndividualExpressionDesciption = false;
    this.isValidRelativeExpressionDescription = false;
    // nếu biểu hiện cá nhân + biểu hiện nhân thân rỗng => không validate nhập miêu tả
    if(!CommonUtils.isNullOrEmpty(lstIndividualExpressionViolation) && CommonUtils.isNullOrEmpty(individualDescription)) {
      this.isValidIndividualExpressionDesciption = true;
    }
    if(!CommonUtils.isNullOrEmpty(lstRelativeExpressionViolation) && CommonUtils.isNullOrEmpty(relativeDescription)) {
      this.isValidRelativeExpressionDescription = true;
    }
    if(this.isValidRelativeExpressionDescription || this.isValidIndividualExpressionDesciption) {
      return true;
    }
    return false;
  }

  onExpresstionViolationChange(event: any) {
    this.setRequiredDescription();
  }
}
