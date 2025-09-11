import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { DisciplineViolationReportService } from '@app/core/services/monitoring/discipline-violation-report.service';

@Component({
  selector: 'discipline-violation-report',
  templateUrl: './discipline-violation-report.component.html',
  styleUrls: ['./discipline-violation-report.component.css']
})
export class DisciplineViolationReportComponent extends BaseComponent implements OnInit {
  levelDecideList: any;
  empTypeList: any;
  punishmentTypeList: any;
  punishmentFormList: any;
  partyPunishmentFormList: any;
  orgLevelId: any;
  isSearchResult = false;
  rootOrgPunishment: Array<any>;
  currentDate: any;
  formConfig = {
    organizationId: ['', [ValidationService.required]],
    fromDate: ['', [ValidationService.required]],
    toDate: ['', [ValidationService.required]],
    isPartyMember: [''],
    decisionLevelId: [''],
    empTypeId: [''],
    punishmentTypeId: [''],
    punishmentFormId: [''],
    partyPunishmentFormId: [''],
    isOrganizationId: [false],
    isFromDate: [false],
    isToDate: [false],
    isShowPartyMember: [false],
    isDecisionLevelId: [false],
    isEmpTypeId: [false],
    isPunishmentTypeId: [false],
    isPunishmentFormId: [false],
    isPartyPunishmentFormId: [false]
  };

  constructor(
    public sysCatService: SysCatService,
    public disciplineViolationService: DisciplineViolationReportService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.disciplineViolationReport"));
    this.currentDate = new Date();
    this.formSearch = this.buildForm({ isPartyMember: '0' }, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('fromDate', 'toDate', 'disciplineViolation.toDate')]);
    this.rootOrgPunishment = [];
    this.formSearch.controls['fromDate'].setValue(new Date(this.currentDate.getFullYear(), 0, 1).getTime());
    this.formSearch.controls['toDate'].setValue(new Date().getTime());
    this.setMainService(this.disciplineViolationService);

    // Danh sach cap quyet dinh
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.DECISSION_LEVEL)
      .subscribe(res => {
        this.levelDecideList = res.data;
      });

    // Danh sach loai doi tuong nhan vien
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.STAFF_TYPE)
      .subscribe(res => {
        this.empTypeList = res.data;
      });

    // Danh sach loi pham
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.PUNISHMENT_TYPE)
      .subscribe(res => {
        this.punishmentTypeList = res.data;
      });

    // Danh sach ky luat chinh quyen
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.GOV_PUNISHMENT_FORM)
      .subscribe(res => {
        this.punishmentFormList = res.data;
      });

    // Danh sach ky luat Dang
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.PARTY_PUNISHMENT)
      .subscribe(res => {
        this.partyPunishmentFormList = res.data;
      });

    // Id loai don vi
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.ORGANIZATION_CONTROLLER_TYPE)
      .subscribe(res => {
        res.data.forEach(element => {
          if (element['code'] === '1') {
            this.orgLevelId = element['sysCatId'];
          }
        });
      });
  }

  ngOnInit() {
    this.processSearch(null);
  }

  get f() {
    return this.formSearch.controls;
  }

  public processSearch(event?): void {
    this.isSearchResult = true;
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const params = this.formSearch ? this.formSearch.value : null;
    this.disciplineViolationService.search(params, event).subscribe(res => {
      this.resultList = res;
      if (!event && this.resultList.data.length > 0) {
        // Xu ly chi lay du lieu mot lan, khong lay lai khi chuyen trang
        this.rootOrgPunishment = [];
        this.rootOrgPunishment.push(res.data[0]);
      }
      // else {
      //   this.disciplineViolationService.findRootOrgPunishment(params)
      //   .subscribe(result => {
      //     this.rootOrgPunishment.push(result.data);
      //   });
      // }
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }

  /**
   * Xuất file báo cáo
   */
  public processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }

    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.disciplineViolationService.export(params).subscribe(res => {
      saveAs(res, 'ctct_bao_cao_ty_le_vi_pham_ky_luat.xlsx');
    });
  }
}
