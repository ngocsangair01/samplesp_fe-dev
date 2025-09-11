import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { EmpTypesService } from '@app/core/services/emp-type.service';
import { ManagementEmployeeService } from '@app/core/services/mass-organization/management-employee.service';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { ReportDynamicService } from '@app/modules/reports/report-dynamic/report-dynamic.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ValidationService } from '@app/shared/services';
import { CommonUtils } from '@app/shared/services/common-utils.service';

@Component({
  selector: 'management-employee-search',
  templateUrl: './management-employee-search.component.html',
  styleUrls: ['./management-employee-search.component.css']
})
export class ManagementEmployeeSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  bo: any;
  branch: any;
  resultList: any;
  typePosition: any;
  typeObject: any;
  lstMassPosition: any;
  filterCondition: string;
  formconfig = {
    branch: [''],
    massOrganizationId: [''], // to chuc
    mobileNumber: [''],
    cmt: [''],
    effectiveDate: ['', [ValidationService.beforeCurrentDate]],
    toEffectiveDate: ['', [ValidationService.beforeCurrentDate]],
    massPositionId: [''], // chuc vu quan chung
    empTypeId: [''], // dien doi tuong
    employeeId: [''],
    listObjectSelected: [null],
    status: ['1'],
    maritalStatus: [''],
    ageType: [1],
    educationGradeIdList: [''],
    workProcessFromDate: ['', [ValidationService.beforeCurrentDate]],
    workProcessToDate: ['', [ValidationService.beforeCurrentDate]],
    ethnicId: [''],
    religionId: [''],
    unionAdmissionFromDate: ['', [ValidationService.beforeCurrentDate]],
    unionAdmissionToDate: ['', [ValidationService.beforeCurrentDate]],
    code: [CommonUtils.getPermissionCode("resource.reportMassMember")],
    monthListSelected: [''],
    isMassOrganizationId: [false], // to chuc
    isMobileNumber: [false],
    isCmt: [false],
    isEffectiveDate: [false],
    isToEffectiveDate: [false],
    isMassPositionId: [false], // chuc vu quan chung
    isEmpTypeId: [false], // dien doi tuong
    isEmployeeId: [false],
    isListObjectSelected: [false],
    isStatus: [false],
    isMaritalStatus: [false],
    isAgeType: [false],
    isEducationGradeIdList: [false],
    isWorkProcessFromDate: [false],
    isWorkProcessToDate: [false],
    isEthnicId: [false],
    isReligionId: [false],
    isUnionAdmissionFromDate: [false],
    isUnionAdmissionToDate: [false],
    isCode: [false],
    isMonthListSelected: [false]
  };
  listObject: any;
  orderPositionField: string;
  degreeList: any;
  ethnicList: any;
  religionList: any;
  employeeFilterCondition: string;
  nameData: string;
  ageTypeList: any[] = [];
  monthList: any[] = [];

  constructor(
    public atr: ActivatedRoute,
    private managementEmployeeService: ManagementEmployeeService,
    private router: Router,
    private empTypesService: EmpTypesService,
    private sysCatService: SysCatService,
    private appParamService: AppParamService,
    private reportDynamicService: ReportDynamicService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.massMember"));
    this.setMainService(managementEmployeeService);
    this.formSearch = this.buildForm({}, this.formconfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('effectiveDate', 'toEffectiveDate', 'common.label.toDate'),
      ValidationService.notAffter('workProcessFromDate', 'workProcessToDate', 'common.label.toDate'),
      ValidationService.notAffter('unionAdmissionFromDate', 'unionAdmissionToDate', 'common.label.toDate')]);
    // take branch with url
    const subPaths = this.router.url.split('/');
    if (subPaths.length >= 2) {
      if (subPaths[2] === 'women') {
        this.branch = 1;
        this.listObject = APP_CONSTANTS.WOMEN_LIST_OBJECT;
        this.employeeFilterCondition = " AND obj.gender = 2 "
        this.nameData = 'women'
      }
      if (subPaths[2] === 'youth') {
        this.branch = 2;
        this.listObject = APP_CONSTANTS.YOUTH_LIST_OBJECT;
        this.employeeFilterCondition = ""
        this.nameData = 'youth'
        this.ageTypeList = APP_CONSTANTS.MASS_MEMBER_AGE_TYPE_LIST;
      }
      if (subPaths[2] === 'union') {
        this.branch = 3;
        this.listObject = APP_CONSTANTS.UNION_LIST_OBJECT;
        this.employeeFilterCondition = " AND EXISTS (SELECT 1 FROM emp_type_process etp WHERE etp.employee_id = obj.employee_id"
        this.nameData = 'union'
        appParamService.appParams(APP_CONSTANTS.APP_PARAM_TYPE.LABOUR_CONTRACT_TYPE_REGULAR).subscribe(res => {
          if (res.data != null) {
            this.employeeFilterCondition += " AND ((etp.labour_contract_type_id IN (" + res.data[0].parValue + ") AND etp.emp_type_id = 486)";
          } else {
            this.employeeFilterCondition += " AND etp.labour_contract_type_id IN (-1)";
          }
        });

        appParamService.getValueByCode(APP_CONSTANTS.APP_PARAM_CODE.EMP_TYPE_REGULAR_1).subscribe(res => {
          if (res.data != null) {
            this.employeeFilterCondition += " OR etp.emp_type_id IN (" + res.data + "))";
          } else {
            this.employeeFilterCondition += " AND etp.emp_type_id IN (-1)";
          }

          this.employeeFilterCondition += " AND CURDATE() BETWEEN etp.effective_date AND COALESCE(etp.expired_date, CURDATE()))";

          this.employeeFilterCondition += " AND EXISTS (SELECT 1 FROM work_process wp WHERE wp.employee_id = obj.employee_id AND CURDATE() BETWEEN wp.effective_start_date AND COALESCE(wp.effective_end_date,CURDATE()))";
        });
      }
    }
    this.f['branch'].setValue(this.branch);
    this.filterCondition = " AND obj.branch = " + this.branch;
    this.orderPositionField = " obj.code, obj.name ";
    this.processSearch();
  }

  ngOnInit() {
    this.empTypesService.getListEmpType().subscribe(res => this.lstMassPosition = res);
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.CLL_ILL).subscribe(res => this.degreeList = res.data);
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.ETHNIC)
      .subscribe(res => {
        const data = res.data;
        data.push({name: "Là dân tộc thiểu số", sysCatId: -1});
        this.ethnicList = data;
      });
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.RELIGION)
      .subscribe(res => {
        const data = res.data;
        data.push({name: "Có theo tôn giáo", sysCatId: -1});
        this.religionList = data;
      });

    this.monthList = CommonUtils.getMonthList();
  }

  get f() {
    return this.formSearch.controls;
  }

  public prepareSaveOrUpdate(item?: any) {
    if (item && item.employeeId > 0) {
      this.managementEmployeeService.getEmployee(item.employeeId).subscribe(res => {
        if (res.data != null) {
          if (this.branch == 1) {
            this.router.navigate(['/mass/women/employee-management/edit', item.employeeId]);
          }
          if (this.branch == 2) {
            this.router.navigate(['/mass/youth/employee-management/edit', item.employeeId]);
          }
          if (this.branch == 3) {
            this.router.navigate(['/mass/union/employee-management/edit', item.employeeId]);
          }
        }
      });
    } else {
      if (this.branch == 1) {
        this.router.navigate(['/mass/women/employee-management/add']);
      }
      if (this.branch == 2) {
        this.router.navigate(['/mass/youth/employee-management/add']);
      }
      if (this.branch == 3) {
        this.router.navigate(['/mass/union/employee-management/add']);
      }
    }
  }

  public processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    this.reportDynamicService.export(searchData).subscribe(res => {
      if (this.branch == 1) {
        saveAs(res, 'Danh_sach_nhan_vien_to_chuc_phu_nu.xlsx');
      }
      if (this.branch == 2) {
        saveAs(res, 'Danh_sach_nhan_vien_to_chuc_thanh_nien.xlsx');
      }
      if (this.branch == 3) {
        saveAs(res, 'Danh_sach_nhan_vien_to_chuc_cong_doan.xlsx');
      }
    });
  }

  processExportGrid() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const buildParams = CommonUtils.buildParams(searchData);
    this.managementEmployeeService.export(buildParams).subscribe(res => {
      if (this.branch == 1) {
        saveAs(res, 'Danh_sach_nhan_vien_to_chuc_phu_nu.xlsx');
      }
      if (this.branch == 2) {
        saveAs(res, 'Danh_sach_nhan_vien_to_chuc_thanh_nien.xlsx');
      }
      if (this.branch == 3) {
        saveAs(res, 'Danh_sach_nhan_vien_to_chuc_cong_doan.xlsx');
      }
    });
  }

  public processView(item?: any) {
    // if (this.branch == 1) {
    //   this.router.navigate(['mass/women/employee-management/view/', item.employeeId]);
    // }
    // if (this.branch == 2) {
    //   this.router.navigate(['mass/youth/employee-management/view/', item.employeeId]);
    // }
    // if (this.branch == 3) {
    //   this.router.navigate(['mass/union/employee-management/view/', item.employeeId]);
    // }
    this.router.navigate(['/employee/curriculum-vitae', item.employeeId, 'population-process']);
  }

  public processImport() {
    if (this.branch == 1) {
      this.router.navigate(['mass/women-member']);
    }
    if (this.branch == 2) {
      this.router.navigate(['mass/youth-member']);
    }
    if (this.branch == 3) {
      this.router.navigate(['mass/union-member']);
    }
  }
}
