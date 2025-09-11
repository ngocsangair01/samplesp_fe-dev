import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { APP_CONSTANTS } from '@app/core';
import { GroupOrgPositionReportService } from '@app/core/services/employee/group-org-position-report.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import * as moment from 'moment';


@Component({
  selector: 'group-org-position-report',
  templateUrl: './group-org-position-report.component.html',
  styleUrls: ['./group-org-position-report.component.css']
})
export class GroupOrgPositionReportComponent extends BaseComponent implements OnInit {

  public reportTypeList: Array<any>;
  groupList: any;
  isMobileScreen: boolean = false;
  formConfig = {
    organizationId: [''],
    reportDate: [moment(new Date()).startOf('day').toDate().getTime(), Validators.required],
    groupIdList: [''],
    positionId: [''],
    reportTypeId: ['', [Validators.required]]
  };

  constructor(
    private groupOrgPositionReportService: GroupOrgPositionReportService,
    private categoryService: CategoryService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
    this.formSearch = this.buildForm({}, this.formConfig);
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.POSITION_GROUP).subscribe(res => {
      this.groupList = res.data;
    });
    this.reportTypeList = APP_CONSTANTS.REPORT_GROUP_ORG_TYPE_LIST;
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
  }

  // get form
  get f() {
    return this.formSearch.controls;
  }

  processExportReport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }

    if (this.formSearch.controls['reportTypeId'].value == 1) {
      this.groupOrgPositionReportService.groupOrgPositionReport(this.formSearch.value).subscribe(
        res => {
          saveAs(res, 'Bao_cao_nhom_chuc_danh.xls');
        }
      );
    } else if (this.formSearch.controls['reportTypeId'].value == 2) {
      this.groupOrgPositionReportService.detailGroupOrgPositionReport(this.formSearch.value).subscribe(
        res => {
          saveAs(res, 'Bao_cao_chi_tiet_nhom_chuc_danh_theo_don_vi.xlsx');
        }
      );
    }
  }
}
