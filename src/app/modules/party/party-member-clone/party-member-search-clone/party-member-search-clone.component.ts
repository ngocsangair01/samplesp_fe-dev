import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferEmployeeService } from '@app/core/services/employee/transfer-employee.service';
import { PartyMemebersService } from '@app/core/services/party-organization/party-members.service';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { TranslationService } from 'angular-l10n';
import { ACTION_FORM } from './../../../../core/app-config';
import { EmpTypesService } from './../../../../core/services/emp-type.service';
import { BaseComponent } from './../../../../shared/components/base-component/base-component.component';

@Component({
  selector: 'party-member-search-clone',
  templateUrl: './party-member-search-clone.component.html'
})
export class PartyMemberSearchCloneComponent extends BaseComponent implements OnInit, OnChanges {
  formSearch: FormGroup;
  empTypeList: any;
  status: any;
  action: any;
  isDisableEffective: boolean;
  isDisableRetirement: boolean;
  isDisableDocumentNumber: boolean;
  isDisableDecision: boolean;
  // warningType;
  @Input() warningType;
  private listWarningType = ['numberOfPartyMembers', 'numberOfReservePartyMembers'
    , 'numberOfOfficialPartyMembers', 'partyMembersOutOfReserveTime'
    , 'newPartyMember', 'partyMembershipRate'];
  formConfig = {
    partyMembersId: [''],
    partyOrganizationId: [''],
    partyOrganizationName: [''],
    employeeCode: [''],
    fullName: [''],
    partyPositionId: [''],
    partyTitleHighest: [''],
    partyPositionCode: [''],
    partyOfficialAdmissionDate: [''],
    partyOfficialAdmissionFromDate: [''],
    partyOfficialAdmissionToDate: [''],
    empTypeId: [''],
    partyMemberType: [null],
    employeeId: [''],
    status: [null],
    statusName: [''],
    exclusionStatus: [''],
    documentNumber: ['', [Validators.maxLength(100)]],
    email: [''],
    partyAdmissionDate: [''],
    partyAdmissionFromDate: [''],
    partyAdmissionToDate: [''],
    effectiveStartDate: [''],
    effectiveStartFromDate: [''],
    effectiveStartToDate: [''],
    retirementToDate: [''],
    retirementFromDate: [''],
    retirementDate: [''],
    deductionNumber: [''],
    deleteNameNumber: [''],
    checkVersion: ['1']
  };

  constructor(private partyMemebersService: PartyMemebersService,
    public translation: TranslationService,
    public empTypeService: EmpTypesService,
    private router: Router,
    private transferEmployeeService: TransferEmployeeService,
    public actr: ActivatedRoute,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyMember"));
    this.setMainService(partyMemebersService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW
      , [
        ValidationService.notAffter('partyOfficialAdmissionFromDate', 'partyOfficialAdmissionToDate', 'party.member.start.date.to.label'),
        ValidationService.notAffter('partyAdmissionFromDate', 'partyAdmissionToDate', 'party.member.start.date.to.label'),
        ValidationService.notAffter('effectiveStartFromDate', 'effectiveStartToDate', 'party.member.start.date.to.label'),
        ValidationService.notAffter('retirementFromDate', 'retirementToDate', 'party.member.start.date.to.label')
      ]
    );
  }

  ngOnInit() {
    this.setFormSearchValue(this.warningType);
    this.processSearch();
    this.empTypeService.getListEmpType().subscribe(res => {
      this.empTypeList = res;
    })
    this.isDisableEffective = true;
    this.isDisableRetirement = true;
    this.isDisableDocumentNumber = true;
    this.isDisableDecision = null;
  }

  get f() {
    return this.formSearch.controls;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.warningType.currentValue) {
      this.warningType = changes.warningType.currentValue;
    }
  }

  /**
   * Đổi trạng thái
   * @param event 
   */
  public onChangeStatus(event) {
    const value = event;
    if (value === null) {
      this.status = '';
    } else if (value === true) {
      this.status = this.translation.translate('partyMembers.isWorking');
    } else if (value === false) {
      this.status = this.translation.translate('partyMembers.notWorking');
    }
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
      saveAs(res, 'party_members_report.xlsx');
    });
  }

  /**
   * Xem chi tiết
   * @param item 
   */
  public processView(item) {
    this.transferEmployeeService.isPartyMember = true;
    this.router.navigate(['/employee/curriculum-vitae-clone/', item.employeeId, 'view']);
  }

  /**
   * Sửa
   * @param item 
   */
  public edit(item) {
    this.transferEmployeeService.isPartyMember = true;
    this.router.navigate(['/employee/curriculum-vitae-clone/', item.employeeId, 'edit']);
  }

  /**
   * Import
   */
  public import() {
    this.router.navigate(['/party-organization/party-member-import-clone/']);
  }

  /**
   * Thêm mới
   * @param item
   */
  public add() {
    this.router.navigate(['/party-organization/party-member-add-clone']);
  }

  /**
   * Set giá trị vào form
   * @param warningType 
   */
  setFormSearchValue(warningType) {
    if (warningType === this.listWarningType[0]) {
      return;
    } else if (warningType === this.listWarningType[1]) {
      this.formSearch.controls['partyMemberType'].setValue(1);
    } else if (warningType === this.listWarningType[2]) {
      this.formSearch.controls['partyMemberType'].setValue(2);
    } else if (warningType === this.listWarningType[3]) {
      this.formSearch.controls['partyMemberType'].setValue(3);
    } else if (warningType === this.listWarningType[4]) {
      this.formSearch.controls['partyMemberType'].setValue(4);
    }
  }
  /**
   * Khai trừ Đảng
   * @param item
   */
  public exclusion(item) {
    this.transferEmployeeService.isPartyMember = true;
    this.partyMemebersService.findEmployeeExclusionById(item.employeeId).subscribe(res => {
      if (this.partyMemebersService.requestIsSuccess(res)) {
        this.router.navigate(['/party-organization/party-member-exclusion', item.employeeId]);
      }
    });
  }

  /**
   * Xóa tên Đảng
   * @param item
   */
  public removeName(item) {
    this.transferEmployeeService.isPartyMember = true;
    this.partyMemebersService.findEmployeeExclusionById(item.employeeId).subscribe(res => {
      if (this.partyMemebersService.requestIsSuccess(res)) {
        this.router.navigate(['/party-organization/party-member-remove-name', item.employeeId]);
      }
    });
  }

  /**
   * Ẩn hiện tìm kiếm theo ngày công tác hiệu lực và ngày chờ nghỉ hưu tùy theo trạng thái công tác
   */
  changeDisable(event) {
    const action = event.target.id;
    if (action != "2" && action != "0") {
      let radios = document.getElementsByName('');
      for (let i = 0; i < radios.length; i++) {
        let radio = radios[i] as HTMLInputElement;
        radio.checked = false;
      }
      this.isDisableDocumentNumber = true;
      this.formSearch.get('documentNumber').setValue('');
      this.formSearch.get('exclusionStatus').setValue('');
    }
    switch (action) {
      case "0":
        this.isDisableEffective = true;
        this.isDisableRetirement = true;
        this.isDisableDecision = null;
        this.formSearch.get('effectiveStartFromDate').setValue('');
        this.formSearch.get('effectiveStartToDate').setValue('');
        this.formSearch.get('retirementFromDate').setValue('');
        this.formSearch.get('retirementToDate').setValue('');
        break;
      case "1":
        this.isDisableEffective = false;
        this.isDisableRetirement = true;
        this.isDisableDecision = true;
        this.formSearch.get('retirementFromDate').setValue('');
        this.formSearch.get('retirementToDate').setValue('');
        break;
      case "2":
        this.isDisableEffective = false;
        this.isDisableRetirement = true;
        this.isDisableDecision = null;
        this.formSearch.get('retirementFromDate').setValue('');
        this.formSearch.get('retirementToDate').setValue('');
        break;
      case "3":
        this.isDisableEffective = true;
        this.isDisableRetirement = false;
        this.isDisableDecision = true;
        this.formSearch.get('effectiveStartFromDate').setValue('');
        this.formSearch.get('effectiveStartToDate').setValue('');
        break;
    }
  }

  /**
   * Hiện input số quyết định khi quyết định được lựa chọn
   */
  changeHide() {
    this.isDisableDocumentNumber = null;
  }
}