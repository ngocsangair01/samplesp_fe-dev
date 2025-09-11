import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { EmpTypePolicyReport } from '@app/core/services/employee/emp-type-policy-report.service';
import { GroupOrgPositionReportService } from '@app/core/services/employee/group-org-position-report.service';
import { PartyReportService } from '@app/core/services/employee/party-report.service';
import { WorkProcessService } from '@app/core/services/employee/work-process.service';
import { HrStorage } from '@app/core/services/HrStorage';
import { EmployeeLongLeaveReportService } from '@app/core/services/population/employee-long-leave-report.service';
import { PoliticsQualityService } from '@app/core/services/security-guard/politics-quality.service';
import { KeyProjectService } from '@app/core/services/security/key-project.service';
import { KeyProjectEmployeeService } from '@app/core/services/security/keyProjectEmployee.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import * as moment from 'moment';
import { DashboardService } from '../service/dash-board-service';



@Component({
  selector: 'home-warning',
  templateUrl: './home-warning.component.html'
})
export class HomeWarningComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() branch;
  formSearch: FormGroup;
  orgIdDomainForOrgPostionExport = HrStorage.getDefaultDomainByCode(CommonUtils.getPermissionCode("action.export"), CommonUtils.getPermissionCode("resource.employeeManager"));
  private listWarningType = [];
  public listWarningData = [];
  totalKeyProjectFormConfig = {
    toStartDate: [new Date().getTime()],
    endDate: [new Date().getTime()],
    status: [2]
  };
  totalKeyProjectEmployeeFormConfig = {
    startDateTo: [new Date().getTime()],
    endDateFrom: [new Date().getTime()]
  };
  constructor(
    private dashboardService: DashboardService,
    private groupOrgPositionReportService: GroupOrgPositionReportService,
    private partyReportService: PartyReportService,
    private employeeLongLeaveReportService: EmployeeLongLeaveReportService,
    private empTypePolicyReport: EmpTypePolicyReport,
    private politicsQualityService: PoliticsQualityService,
    private router: Router,
    private workProcessService: WorkProcessService,
    private curriculumVitaeService: CurriculumVitaeService,
    private keyProjectService: KeyProjectService,
    private keyProjectEmployeeService: KeyProjectEmployeeService,
  ) {
    super();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.branch.currentValue) {
      this.branch = changes.branch.currentValue;
    }
  }
  ngOnInit(): void {
    if (this.branch === 1) {
      this.listWarningType = ['numberOfPartyMembers', 'numberOfReservePartyMembers'
        , 'numberOfOfficialPartyMembers', 'partyMembersOutOfReserveTime'
        , 'newPartyMember', 'partyMembershipRate'];
    } else if (this.branch === 2) {
      this.listWarningType = ['officerManagement', 'groupOrgPosition', 'expiredSoldierLevelEmp'];
    } else if (this.branch === 6) {
      this.listWarningType = ['orgMeeting', 'joinPerform ', 'retirementWarning', 'longLeave', 'veterans', 'longLeaveRetirement', 'houseDossier'];
    } else if (this.branch === 5) {
      this.listWarningType = ['totalKeyPosition', 'totalKeyPositionNotEnoughFile', 'totalKeyProject', 'totalKeyProjectEmployee', 'politicsNeedToPayAttenion', 'politicsQuality'];
    } else if (this.branch == 7) {
      this.listWarningType = ['totalPunishmentInYear', 'totalPartyPunishmentInYear'];
    }
    this.loadWarning(this.listWarningType[0]);
  }
  loadWarning(warningType: string) {
    this.dashboardService.getWarningByType(warningType).subscribe(res => {
      let warningData = res.data;
      if (warningData && warningData.hasPermission) {
        this.listWarningData.push(warningData);
      }
      let nextWarningType = this.getNextWarningType(this.listWarningType, warningType);
      if (!CommonUtils.isNullOrEmpty(nextWarningType)) {
        this.loadWarning(nextWarningType);
      }
    });
  }

  getNextWarningType(list, warningType: string): string {
    const index = list.indexOf(warningType);
    if (index === -1) {
      return null;
    }
    if (index < list.length - 1) {
      return list[index + 1];
    }
    return null;
  }

  redirectAndSearch(routerLink, warningType) {
    if (warningType === 'groupOrgPosition') {
      this.groupOrgPositionReportService.groupOrgPositionReport({
        organizationId: [this.orgIdDomainForOrgPostionExport]
        , reportDate: [moment(new Date()).startOf('day').toDate().getTime()]
      })
        .subscribe(res => {
          saveAs(res, 'Bao_cao_nhom_chuc_danh.xls');
        });
    } else if (warningType === 'expiredSoldierLevelEmp') {
      this.partyReportService.processPartyExpiredReport({
        organizationId: [this.orgIdDomainForOrgPostionExport]
        , reportDate: [moment(new Date()).startOf('day').toDate().getTime()]
      })
        .subscribe(res => {
          saveAs(res, 'ctct_bao_cao_nien_han_can_bo.xls');
        });
    } else if (warningType === 'longLeave') {
      this.employeeLongLeaveReportService.export().subscribe(res => {
        saveAs(res, 'ctct_bao_cao_chi_tiet_nghi_dai_ngay.xlsx');
      });
    } else if (warningType === 'veterans') {
      this.empTypePolicyReport.processReportEmpTypePolicy({ reportedDate: [moment(new Date()).startOf('day').toDate().getTime()] }).subscribe(
        res => {
          saveAs(res, 'ctct_bao_cao_doi_tuong_chinh_sach.xls');
        }
      );
    } else if (warningType === 'politicsQuality') {
      this.politicsQualityService.exportOrgNotYetClassifyEmp().subscribe(
        res => {
          saveAs(res, 'danh_sach_nhan_vien_chua_phan_loai_chat_luong.xls');
        }
      );
    } else if (warningType === 'totalKeyPositionNotEnoughFile') {
      this.workProcessService.processExportKeyPositionNotEnoughFile().subscribe(
        res => {
          saveAs(res, 'danh_sach_vi_tri_trong_yeu_thieu_ho_so.xlsx');
        }
      );
    } else if (warningType === 'politicsNeedToPayAttenion') {
      this.curriculumVitaeService.exportPoliticsNeedToPayAttenion().subscribe(
        res => {
          saveAs(res, 'danh_sach_nhan_su_can_chu_y_ve_chinh_tri.xlsx');
        }
      );
    } else if (warningType === 'totalKeyProject') {
      this.formSearch = this.buildForm({}, this.totalKeyProjectFormConfig);
      this.keyProjectService.export(this.formSearch.value).subscribe(
        res => {
          saveAs(res, 'danh_sach_du_an_trong_diem.xlsx');
        }
      );
    } else if (warningType === 'totalKeyProjectEmployee') {
      this.formSearch = this.buildForm({}, this.totalKeyProjectEmployeeFormConfig);
      this.keyProjectEmployeeService.export(this.formSearch.value).subscribe(
        res => {
          saveAs(res, 'danh_sach_nhan_su_dang_tham_gia_du_an_trong_diem.xls');
        }
      );
    } else if (warningType !== 'partyMembershipRate') {
      if (routerLink) {
        this.router.navigate([routerLink, warningType]);
      }
    }
  }
}
