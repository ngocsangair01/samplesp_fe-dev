import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferEmployeeService } from '@app/core/services/employee/transfer-employee.service';
import { PartyMemebersService } from '@app/core/services/party-organization/party-members.service';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { TranslationService } from 'angular-l10n';
import { ACTION_FORM, APP_CONSTANTS } from './../../../../core/app-config';
import { EmpTypesService } from './../../../../core/services/emp-type.service';
import { BaseComponent } from './../../../../shared/components/base-component/base-component.component';
import * as moment from 'moment';

@Component({
  selector: 'party-member-search',
  templateUrl: './party-member-search.component.html',
  styleUrls: ['./party-member-search.component.css']

})
export class PartyMemberSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  empTypeList: any[] = [];
  statusList: any;
  managementTypeList: any;
  religionList: any[] = [];
  ethnicList: any[] = [];
  levelEducationList: any[] = [];
  specializeTrainingList: any[] = [];
  status: any;
  action: any;
  formConfig = {
    employeeId: [''],
    status: ['0'],
    profileNumber: [''],
    isProfileNumberEmpty: [''],
    partyNumber: [''],
    isPartyNumberEmpty: [''],
    partyOrganizationId: [''],
    partyPositionId: [''],
    positionName: [''],
    empTypeId: [''],
    managementTypeId: ['0'],
    partyMemberType: ['0'],
    partyAge: ['0'],
    partyAdmissionFromDate: [''],
    partyAdmissionToDate: [''],
    partyOfficialAdmissionFromDate: [''],
    partyOfficialAdmissionToDate: [''],
    exceptPartyFromDate: [''],
    exceptPartyToDate: [''],
    existProgressType: ['0'],
    exclusionEffectiveFromDate: [''],
    exclusionEffectiveToDate: [''],
    removeNameEffectiveFromDate: [''],
    removeNameEffectiveToDate: [''],
    effectiveFromDate: [''],
    effectiveToDate: [''],
    expiredFromDate: [''],
    expiredToDate: [''],
    isPartyMemberGroupLevel: [''],
    isPartyMemberBaseLevel: [''],
    isPartyMemberDepartmentLevel: [''],
    isPartyMemberOnBaseLevel: [''],
    isCommissionerBaseLevel: [''],
    isCommissionerSubordinateLevel: [''],
    isPartyMemberMassUnion: [''],
    isPartyMemberMassYouth: [''],
    isPartyMemberMassWomen: [''],
    gender: ['0'],
    maritalStatus: ['0'],
    religionId: [''],
    ethnicId: [''],
    dateOfBirthFromDate: [''],
    dateOfBirthToDate: [''],
    educationGradeId: [''],
    specializeTraining: [''],
    //
    isEmployeeId: [false],
    isPartyProfileNumber: [false],
    isPartyOrganizationId: [false],
    isStatus: [false],
    isPartyNumber: [false],
    isPartyPositionId: [false],
    isEmpTypeId: [false],
    isManagementTypeId: [false],
    isEthnicId: [false],
    isPartyMemberType: [false],
    isPartyAge: [false],
    isExistProgressType: [false],
    isPartyAdmissionFromDate: [false],
    isPartyOfficialAdmissionFromDate: [false],
    isExceptPartyFromDate: [false],
    isPartyAdmissionToDate: [false],
    isPartyOfficialAdmissionToDate: [false],
    isExceptPartyToDate: [false],
    isExclusionEffectiveFromDate: [false],
    isRemoveNameEffectiveFromDate: [false],
    isEffectiveFromDate: [false],
    isExclusionEffectiveToDate: [false],
    isRemoveNameEffectiveToDate: [false],
    isEffectiveToDate: [false],
    isExpiredFromDate: [false],
    isDateOfBirthFromDate: [false],
    isGender: [false],
    isExpiredToDate: [false],
    isDateOfBirthToDate: [false],
    isMaritalStatus: [false],
    isEducationGradeId: [false],
    isSpecializeTraining: [false],
    isReligionId: [false],
  }
  constructor(private partyMemebersService: PartyMemebersService,
    public translation: TranslationService,
    public empTypeService: EmpTypesService,
    private sysCatService: SysCatService,
    private router: Router,
    private transferEmployeeService: TransferEmployeeService,
    public actr: ActivatedRoute,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyMember"));
    this.setMainService(partyMemebersService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [
        ValidationService.notAffter('partyAdmissionFromDate', 'partyAdmissionToDate', 'partyMember.admissionToDate'),
        ValidationService.notAffter('partyOfficialAdmissionFromDate', 'partyOfficialAdmissionToDate', 'partyMember.officialPartyDayTo'),
        ValidationService.notAffter('exceptPartyFromDate', 'exceptPartyToDate', 'partyMember.exceptPartyToDate'),
        ValidationService.notAffter('exclusionEffectiveFromDate', 'exclusionEffectiveToDate', 'partyMember.exclusionEffectiveToDate'),
        ValidationService.notAffter('removeNameEffectiveFromDate', 'removeNameEffectiveToDate', 'partyMember.removeNameEffectiveToDate'),
        ValidationService.notAffter('effectiveFromDate', 'effectiveToDate', 'partyMember.effectiveToDate'),
        ValidationService.notAffter('expiredFromDate', 'expiredToDate', 'partyMember.expiredToDate'),
        ValidationService.notAffter('dateOfBirthFromDate', 'dateOfBirthToDate', 'partyMember.dateOfBirthToDate')
      ]);
  }

  ngOnInit() {
    this.processSearch();
    this.empTypeService.getListEmpType().subscribe(res => {
      this.empTypeList = res;
    })
    // Danh sach ton giao
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.RELIGION).subscribe(
      res => this.religionList = res.data
    );
    // Danh sach dan toc
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.ETHNIC).subscribe(
      res => this.ethnicList = res.data
    );
    // Danh sach trinh do dao tao
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.CLL_ILL).subscribe(
      res => this.levelEducationList = res.data
    );
    // Danh sach chuyen nganh dao tao
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.SPECIALIZE_TRAINING).subscribe(
      res => this.specializeTrainingList = res.data
    );
    this.statusList = [
      { statusId: '0', name: 'Tất cả' },
      { statusId: '1', name: 'Đang làm việc' },
      { statusId: '2', name: 'Nghỉ việc' }
    ];
    this.managementTypeList = [
      { managementTypeId: '0', name: 'Chọn tất cả' },
      { managementTypeId: '5624', name: 'Cán bộ quản lý' },
      { managementTypeId: '5625', name: 'Quân lực quản lý' }
    ];
  }

  get f() {
    return this.formSearch.controls;
  }

  /**
   * Xuất báo cáo
   */
  public processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.partyMemebersService.export(params).subscribe(res => {
      saveAs(res, 'Danh_sach_Dang_vien.xlsx');
    });
  }

  /**
   * Xem chi tiết
   * @param item
   */
  public processView(item) {
    this.transferEmployeeService.isPartyMember = true;
    this.router.navigate(['/party-organization/party-member/curriculum-vitae/', item.employeeId, 'view']);
  }

  /**
   * Sửa
   * @param item
   */
  public edit(item) {
    this.transferEmployeeService.isPartyMember = true;
    this.router.navigate(['/party-organization/party-member/curriculum-vitae/', item.employeeId, 'edit']);
  }

  /**
   * Import
   */
  public import() {
    this.router.navigate(['/party-organization/party-member/import']);
  }

  /**
   * Thêm mới
   * @param item
   */
  public add() {
    this.router.navigate(['/party-organization/party-member/add']);
  }

   onChangeIsProfileNumberEmpty(val) {
    if (val) {
      this.formSearch.controls['profileNumber'].setValue(null);
      this.formSearch.controls['profileNumber'].disable();
    } else {
      this.formSearch.controls['profileNumber'].enable();
    }
  }

  onChangeIsPartyNumberEmpty(val) {
    if (val) {
      this.formSearch.controls['partyNumber'].setValue(null);
      this.formSearch.controls['partyNumber'].disable();
    } else {
      this.formSearch.controls['partyNumber'].enable();
    }
  }

  public onChangeExistProgressType(event) {
    const fromDate = moment().subtract(1, 'years').toDate().getTime();
    const toDate = moment().toDate().getTime();
    if (this.f['existProgressType'].value === '0') { // La Sinh hoat Dang hien tai
      this.f['exclusionEffectiveFromDate'].setValue(null);
      this.f['exclusionEffectiveToDate'].setValue(null);
      this.f['removeNameEffectiveFromDate'].setValue(null);
      this.f['removeNameEffectiveToDate'].setValue(null);
      this.f['effectiveFromDate'].setValue(null);
      this.f['effectiveToDate'].setValue(null);
      this.f['expiredFromDate'].setValue(null);
      this.f['expiredToDate'].setValue(null);
    } else if (this.f['existProgressType'].value === '1') { // La Khai tru Dang vien
      this.f['exclusionEffectiveFromDate'].setValue(fromDate);
      this.f['exclusionEffectiveToDate'].setValue(toDate);
      this.f['removeNameEffectiveFromDate'].setValue(null);
      this.f['removeNameEffectiveToDate'].setValue(null);
      this.f['effectiveFromDate'].setValue(null);
      this.f['effectiveToDate'].setValue(null);
      this.f['expiredFromDate'].setValue(null);
      this.f['expiredToDate'].setValue(null);
    } else if (this.f['existProgressType'].value === '2') { // La qua trinh Xoa ten/CRKD
      this.f['exclusionEffectiveFromDate'].setValue(null);
      this.f['exclusionEffectiveToDate'].setValue(null);
      this.f['removeNameEffectiveFromDate'].setValue(fromDate);
      this.f['removeNameEffectiveToDate'].setValue(toDate);
      this.f['effectiveFromDate'].setValue(null);
      this.f['effectiveToDate'].setValue(null);
      this.f['expiredFromDate'].setValue(null);
      this.f['expiredToDate'].setValue(null);
    } else if (this.f['existProgressType'].value === '3') { // Sinh hoat Dang chuyen di
      this.f['exclusionEffectiveFromDate'].setValue(null);
      this.f['exclusionEffectiveToDate'].setValue(null);
      this.f['removeNameEffectiveFromDate'].setValue(null);
      this.f['removeNameEffectiveToDate'].setValue(null);
      this.f['effectiveFromDate'].setValue(null);
      this.f['effectiveToDate'].setValue(null);
      this.f['expiredFromDate'].setValue(fromDate);
      this.f['expiredToDate'].setValue(toDate);
    } else if (this.f['existProgressType'].value === '4') { // Sinh hoat Dang chuyen den
      this.f['exclusionEffectiveFromDate'].setValue(null);
      this.f['exclusionEffectiveToDate'].setValue(null);
      this.f['removeNameEffectiveFromDate'].setValue(null);
      this.f['removeNameEffectiveToDate'].setValue(null);
      this.f['effectiveFromDate'].setValue(fromDate);
      this.f['effectiveToDate'].setValue(toDate);
      this.f['expiredFromDate'].setValue(null);
      this.f['expiredToDate'].setValue(null);
    }
  }

  // clearData() {
  //   this.f['partyMemberType'].setValue('0');
  //   this.f['partyAge'].setValue('0');
  //   this.f['partyAdmissionFromDate'].setValue(null);
  //   this.f['partyAdmissionToDate'].setValue(null);
  //   this.f['partyOfficialAdmissionFromDate'].setValue(null);
  //   this.f['partyOfficialAdmissionToDate'].setValue(null);
  //   this.f['exceptPartyFromDate'].setValue(null);
  //   this.f['exceptPartyToDate'].setValue(null);
  //   this.f['existProgressType'].setValue('0');
  //   this.f['exclusionEffectiveFromDate'].setValue(null);
  //   this.f['exclusionEffectiveToDate'].setValue(null);
  //   this.f['removeNameEffectiveFromDate'].setValue(null);
  //   this.f['removeNameEffectiveToDate'].setValue(null);
  //   this.f['effectiveFromDate'].setValue(null);
  //   this.f['effectiveToDate'].setValue(null);
  //   this.f['expiredFromDate'].setValue(null);
  //   this.f['expiredToDate'].setValue(null);
  //   this.f['isPartyMemberGroupLevel'].setValue(null);
  //   this.f['isPartyMemberBaseLevel'].setValue(null);
  //   this.f['isPartyMemberDepartmentLevel'].setValue(null);
  //   this.f['isPartyMemberOnBaseLevel'].setValue(null);
  //   this.f['isCommissionerBaseLevel'].setValue(null);
  //   this.f['isCommissionerSubordinateLevel'].setValue(null);
  //   this.f['isPartyMemberMassUnion'].setValue(null);
  //   this.f['isPartyMemberMassYouth'].setValue(null);
  //   this.f['isPartyMemberMassWomen'].setValue(null);
  //   this.f['gender'].setValue('0');
  //   this.f['maritalStatus'].setValue('0');
  //   this.f['religionId'].setValue(null);
  //   this.f['ethnicId'].setValue(null);
  //   this.f['dateOfBirthFromDate'].setValue(null);
  //   this.f['dateOfBirthToDate'].setValue(null);
  //   this.f['educationGradeId'].setValue(null);
  //   this.f['specializeTraining'].setValue(null);
  // }

}
