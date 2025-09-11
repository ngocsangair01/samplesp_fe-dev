import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { APP_CONSTANTS } from '@app/core';
import { EmpTypesService } from '@app/core/services/emp-type.service';
import { EmpTypePolicyReport } from '@app/core/services/employee/emp-type-policy-report.service';
import { PolicyReportService } from '@app/core/services/population/policy-report.service';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import * as moment from 'moment';

@Component({
  selector: 'emp-type-policy-report',
  templateUrl: './emp-type-policy-report.component.html'
})
export class EmpTypePolicyReportComponent extends BaseComponent implements OnInit {
  reportTypeList = APP_CONSTANTS.POLICY_REPORT_TYPE_LIST;
  familyRelationShipList = APP_CONSTANTS.DEATH_LIFE_LIST;
  relationshipList: any;
  reportType: string = '';
  empTypeList: any;
  formExport: FormGroup;
  formConfig = {
    reportType: ['', [ValidationService.required]],
    reportedDate: [moment(new Date()).startOf('day').toDate().getTime(), [ValidationService.required]],
    empTypeIds: [''],
    relativeStatusId: [0],
    familyRelationShipIds: [''],
    organizationId: ['', [ValidationService.required]],
  };

  constructor(private empTypePolicyReport: EmpTypePolicyReport,
    private empTypeService: EmpTypesService,
    private policyReportService: PolicyReportService,
    private sysCatService: SysCatService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.requestDemocraticMeeting"));
    this.formExport = this.buildForm({}, this.formConfig);
    this.sysCatService.getListSysCatFamilyRelationShip().subscribe(res => {
      this.relationshipList = res.data;
    })
  }

  ngOnInit() {
    this.empTypeService.getNoneStaffAreaEmpType().subscribe(res => {
      this.empTypeList = res.data;
    });
  }

  get f() {
    return this.formExport.controls;
  }

  /**
   * Báo cáo đối tượng chính sách
   */
  processReportEmpTypePolicy() {
    if (this.reportType == '' || this.reportType == 'BC_DTCS') {
      if (!CommonUtils.isValidForm(this.formExport)) {
        return;
      }
      //Bao cao CBCNV la doi tuong chinh sach
      this.empTypePolicyReport.processReportEmpTypePolicy(this.formExport.value).subscribe(
        res => {
          saveAs(res, 'ctct_bao_cao_doi_tuong_chinh_sach.xls');
        }
      )
    } else if (this.reportType == 'BC_TH_DTCS') {
      if (!CommonUtils.isValidForm(this.formExport)) {
        return;
      }
      //Bao cao CBCNV la dan toc it nguoi
      this.policyReportService.reportSynthesisSoldier(this.formExport.value).subscribe(
        res => {
          saveAs(res, 'ctct_bao_cao_tong_hop_doi_tuong_chinh_sach.xls');
        }
      )
    } else if (this.reportType == 'BC_DTCS_CTTN') {
      if (!CommonUtils.isValidForm(this.formExport)) {
        return;
      }
      //Bao cao chi tiet than nhan CBCNV là doi tuong chinh sach

      this.policyReportService.reportListEmpHaveParentSoldier(this.formExport.value).subscribe(
        res => {
          saveAs(res, 'ctct_bao_cao_chi_tiet_than_nhan_CBCNV_la_doi_tuong_chinh_sach.xls');
        }
      )
    } else if (this.reportType == 'BC_CBCNV_DT') {
      if (!CommonUtils.isValidForm(this.formExport)) {
        return;
      }
      //Bao cao CBCNV la dan toc it nguoi
      this.policyReportService.ethnicReport(this.formExport.value).subscribe(
        res => {
          saveAs(res, 'ctct_danh_sach_CBCNV_la_dan_toc_it_nguoi.xls');
        }
      )
    } else if (this.reportType == 'BC_CBCNV_DTTH') {
      if (!CommonUtils.isValidForm(this.formExport)) {
        return;
      }
      //Bao cao CBCNV la dan toc it nguoi tong hop
      this.policyReportService.ethnicSyntheticReport(this.formExport.value).subscribe(
        res => {
          saveAs(res, 'ctct_bao_cao_Tong_hop_CBCNV_la_nguoi_dan_toc_it_nguoi.xls');
        }
      )
    }

  }

  /**
   * action loai bao cao
   * @param event 
   */
  public onChangeType(event) {
    if (event != null) {
      this.reportType = event;
    }
    else {
      this.reportType = '';
    }
  }

  public onChangeRelation(event) {
    if (event == null) {
      this.formExport.get('relativeStatusId').setValue(0);
    }
  }
}
