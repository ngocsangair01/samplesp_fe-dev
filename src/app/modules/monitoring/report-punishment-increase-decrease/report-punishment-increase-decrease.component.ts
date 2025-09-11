import { ReportPunishmentService } from './../../../core/services/punishment/report-punishment.service';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { Component, OnInit } from '@angular/core';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormGroup } from '@angular/forms';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { EmpTypesService } from '@app/core/services/emp-type.service';

@Component({
  selector: 'report-punishment-increase-decrease',
  templateUrl: './report-punishment-increase-decrease.component.html'
})
export class ReportPunishmentIncreaseDecreaseComponent extends BaseComponent implements OnInit {
  reportForm: FormGroup;
  reportFormYear: FormGroup;
  formConfig = {
    reportType: [1],
  }
  reportType = 1;

  // Bao cao so sanh du lieu cung ky truoc, cung ky sau
  reportCompareForm: FormGroup;
  reportCompareFormConfig = {
    organizationId: ['', [ValidationService.required]],
    periodDateFrom: ['', [ValidationService.required]],
    periodDateTo: ['', [ValidationService.required]],
    nextPeriodDateFrom: ['', [ValidationService.required]],
    nextPeriodDateTo: ['', [ValidationService.required]],
    dataDateFrom: ['', [ValidationService.required]],
    dataDateTo: ['', [ValidationService.required]],
    isPartyMember: [0],
    decissionLevelId: [''],
    empTypeId: [''],
    punishmentTypeId: [''],
    punishmentFormId: [''],
    partyPunishmentFormId: ['']
  };

  // bao cao ky luat theo nam
  reportFormYearConfig = {
    organizationId: ['', ValidationService.required],
    fromYear: [new Date().getFullYear()],
    toYear: [new Date().getFullYear()],
    isPartyMember: [0],
    decissionLevelId: [''],
    empTypeId: [''],
    punishmentTypeId: [''],
    punishmentFormId: [''],
    partyPunishmentFormId: [''],
  }
  // báo cáo so sánh số liệu giữa 2 thời điểm
  reportCompareProcessForm: FormGroup;
  reportCompareProcessFormConfig = {
    organizationId: ['', [ValidationService.required]],
    previousTimeFrom: ['', [ValidationService.required]],
    previousTimeTo: ['', [ValidationService.required]],
    dataDateFrom: ['', [ValidationService.required]],
    dataDateTo: ['', [ValidationService.required]],
    isPartyMember: [0],
    decissionLevelId: [''],
    empTypeId: [''],
    punishmentTypeId: [''],
    punishmentFormId: [''],
    partyPunishmentFormId: ['']
  };
  reportTypeList: any;
  punishmentTypeList: any;
  punishmentFormList: any;
  partyPunishmentFormList: any;
  decissionLevelList: any;
  yearList: any;
  empTypeList: any;

  constructor(
    private sysCatService: SysCatService,
    private empTypeService: EmpTypesService,

    private reportPunishmentService: ReportPunishmentService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.disciplineIncreaseDecreaseReport"));
    this.reportTypeList = APP_CONSTANTS.REPORT_INCREASE_DECREASE;
    this.reportForm = this.buildForm({}, this.formConfig);
    this.reportCompareForm = this.buildForm({}, this.reportCompareFormConfig, ACTION_FORM.INSERT, [
      ValidationService.notAffter("periodDateFrom", "periodDateTo", "reportPunishment.periodDateTo"),
      ValidationService.notAffter("nextPeriodDateFrom", "nextPeriodDateTo", "reportPunishment.nextPeriodDateTo"),
      ValidationService.notAffter("dataDateFrom", "dataDateTo", "reportPunishment.dataDateTo")
    ]);
    this.reportCompareProcessForm = this.buildForm({}, this.reportCompareProcessFormConfig, ACTION_FORM.INSERT, [
      ValidationService.notAffter("previousTimeFrom", "previousTimeTo", "reportPunishment.periodDateTo"),
      ValidationService.notAffter("dataDateFrom", "dataDateTo", "reportPunishment.dataDateTo")
    ]);

    this.sysCatService.getSysCatListBySysCatTypeIdSortOrderOrName(APP_CONSTANTS.PERSONAL_PUNISHMENT.CQD).subscribe(res => {
      this.decissionLevelList = res.data;
    });
    this.sysCatService.getSysCatListBySysCatTypeIdSortOrderOrName(APP_CONSTANTS.PERSONAL_PUNISHMENT.LP).subscribe(res => {
      this.punishmentTypeList = res.data;
    });
    this.sysCatService.getSysCatListBySysCatTypeIdSortOrderOrName(APP_CONSTANTS.PERSONAL_PUNISHMENT.KLCQ).subscribe(res => {
      this.punishmentFormList = res.data;
    });
    this.sysCatService.getSysCatListBySysCatTypeIdSortOrderOrName(APP_CONSTANTS.PERSONAL_PUNISHMENT.KLD).subscribe(res => {
      this.partyPunishmentFormList = res.data;
    });
    this.yearList = CommonUtils.getYearList(9, 0);
    // Danh sách diện đối tượng
    this.empTypeService.getListEmpType().subscribe(res => {
      this.empTypeList = res
    });

    // bao cao theo nam
    this.reportFormYear = this.buildForm({}, this.reportFormYearConfig, ACTION_FORM.INSERT, [
      ValidationService.notAffter("fromYear", "toYear", "reportPunishment.toYear")
    ]);
  }

  ngOnInit() {
  }

  get fReportForm() {
    return this.reportForm.controls;
  }

  get fReportCompareForm() {
    return this.reportCompareForm.controls;
  }

  get fReportCompareProcessForm() {
    return this.reportCompareProcessForm.controls;
  }

  onchangeReportType(event?: any) {
    if (event === 1) {
      this.reportType = 1;
    } else if (event === 2) {
      this.reportType = 2;
    } else if (event === 3) {
      this.reportType = 3;
    }
  }

  get fReportFormYear() {
    return this.reportFormYear.controls;
  }

  processExportYear() {
    const credentials = Object.assign({}, this.reportFormYear.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.reportPunishmentService.reportPunishmentYear(params).subscribe(res => {
      saveAs(res, 'bao_cao_xu_huong_theo_nam.xlsx');
    });
  }

  /**
   * Bao cao so sanh du lieu cung ky truoc, cung ky sau
   */
  processExportCompare() {
    const isValidReportType = CommonUtils.isValidForm(this.reportForm);
    const isValidReportCompareForm = CommonUtils.isValidForm(this.reportCompareForm);
    if (!isValidReportType || !isValidReportCompareForm) {
      return;
    }

    const credentials = Object.assign({}, this.reportCompareForm.value);
    const formData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(formData);
    this.reportPunishmentService.processExportCompare(params)
      .subscribe(res => {
        saveAs(res, 'bao_cao_so_sanh_so_lieu_cung_ky.xls');
      });
  }

  /**
   * báo cáo so sánh số liệu giữa 2 thời điểm
   */
  processExportCompareProcess() {
    if (!CommonUtils.isValidForm(this.reportCompareProcessForm)) {
      return;
    }
    const credentials = Object.assign({}, this.reportCompareProcessForm.value);
    const formData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(formData);
    this.reportPunishmentService.processExportCompareProcess(params)
      .subscribe(res => {
        saveAs(res, 'bao_cao_so_sanh_so_lieu_giua_2_thoi_diem.xlsx');
      });
  }
}