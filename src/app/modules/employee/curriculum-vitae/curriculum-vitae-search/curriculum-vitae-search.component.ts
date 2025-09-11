import { FormGroup } from '@angular/forms';
import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { EmpTypesService } from '@app/core/services/emp-type.service';
import { ACTION_FORM } from '@app/core';

@Component({
  selector: 'curriculum-vitae-search',
  templateUrl: './curriculum-vitae-search.component.html',
  styleUrls: ['./curriculum-vitae-search.component.css']
})
export class CurriculumVitaeSearchComponent extends BaseComponent implements OnInit, OnChanges {
  formSearch: FormGroup;
  status: any;
  empTypeList: any;
  statusList: any;
  genderList: any;
  managementTypeList: any;
  keyPositionList: any;
  permission360Info: boolean = false;
  permissionSecurityPro : boolean = false;
  isMobileScreen: boolean = false;
  @Input() warningType;
  private listManagementWarningType = ['officerManagement', 'maleOfficerManagement', 'femaleOfficerManagement', 'totalKeyPosition'];
  formConfig = {
    employeeCode: [''],
    employeeName: [''],
    organizationId: [''],
    status: [null],
    mobileNumber: [''],
    email: [''],
    personalIdNumber: [''],
    passportNumber: [''],
    positionId: [''],
    empTypeId: [''],
    soldierNumber: [''],
    taxNumber: [''],
    dateOfBirthFrom: [null, [ValidationService.beforeCurrentDate]],
    dateOfBirthTo: [null, [ValidationService.beforeCurrentDate]],
    gender: [null],
    managementTypeId: [null],
    isKeyPosition: [null],
    isEmpTypeId: [false]
  };

  constructor(
    private curriculumVitaeService: CurriculumVitaeService,
    private empTypeService: EmpTypesService,
    private router: Router,
    public actr: ActivatedRoute,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
    this.setMainService(curriculumVitaeService);
    this.permission360Info = this.hasPermission('action.view', 'resource.employee360Information');
    this.permissionSecurityPro = this.hasPermission('action.export', 'resource.securityProtection');
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW, [
      ValidationService.notAffter('dateOfBirthFrom', 'dateOfBirthTo', 'profile.label.nsdn')]);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.warningType.currentValue) {
      this.warningType = changes.warningType.currentValue;
    }
  }

  ngOnInit() {
    this.setFormSearchValue(this.warningType);
    this.processSearch();
    this.empTypeService.getNoneStaffAreaEmpType().subscribe(res => {
      this.empTypeList = res.data;
    })
    this.statusList = [
      { statusId: '0', name: 'Tất cả' },
      { statusId: '1', name: 'Đang làm việc' },
      { statusId: '2', name: 'Nghỉ việc' }
    ];
    this.genderList = [
      { genderId: '0', name: 'Chọn tất cả' },
      { genderId: '1', name: 'Nam' },
      { genderId: '2', name: 'Nữ' }
    ];
    this.managementTypeList = [
      { managementTypeId: '0', name: 'Chọn tất cả' },
      { managementTypeId: '1', name: 'Cán bộ quản lý' },
      { managementTypeId: '2', name: 'Quân lực quản lý' }
    ];
    this.keyPositionList = [
      { keyPositionId: 'null', name: 'Chọn tất cả' },
      { keyPositionId: '0', name: 'Không là vị trí trọng yếu' },
      { keyPositionId: '1', name: 'Là vị trí trọng yếu' }
    ];
  }

  // get form
  get f() {
    return this.formSearch.controls;
  }

  processView(item) {
    this.router.navigate(['/employee/curriculum-vitae/', item.employeeId, 'view']);
  }

  processViewAllInformation(item) {
    this.router.navigate(['/employee/curriculum-vitae/', item.employeeId, 'overall-info']);
  }

  prepareSaveOrUpdate(item) {
    this.router.navigate(['/employee/curriculum-vitae/', item.employeeId, 'edit']);
  }

  public processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }

    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.curriculumVitaeService.export(params).subscribe(res => {
      saveAs(res, 'employee_curriculum_vitae_report.xlsx');
    });
  }

  setFormSearchValue(warningType) {
    if (warningType === this.listManagementWarningType[0]) {
      this.formSearch.controls['managementTypeId'].setValue('1');
    } else if (warningType === this.listManagementWarningType[1]) {
      this.formSearch.controls['gender'].setValue('1');
      this.formSearch.controls['managementTypeId'].setValue('1');
    } else if (warningType === this.listManagementWarningType[2]) {
      this.formSearch.controls['gender'].setValue('2');
      this.formSearch.controls['managementTypeId'].setValue('1');
    } else if (warningType === this.listManagementWarningType[3]) {
      this.formSearch.controls['isKeyPosition'].setValue(1);
    }
  }

  exportCurriculumVitae(employeeId) {
    if (employeeId && employeeId > 0) {
      this.curriculumVitaeService.exportCurriculumVitae(employeeId).subscribe(res => {
        saveAs(res, 'So_yeu_ly_lich.docx');
      });
    }
  }
}
