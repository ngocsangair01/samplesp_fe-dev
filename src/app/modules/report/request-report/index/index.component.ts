import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { APP_CONSTANTS, MAP_YCBC_OBJECT_TYPE, RequestReportService, SCHEDULE_TYPE } from '@app/core';
import { Router } from '@angular/router';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { AppComponent } from '@app/app.component';
import * as moment from 'moment';
import { HrStorage } from '@app/core/services/HrStorage';
import { DialogService } from 'primeng/api';
import { ClonePopupFormComponent } from '../clone-popup/clone-popup-form.component';
import {FormArray, FormControl} from "@angular/forms";
@Component({
  selector: 'index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent extends BaseComponent implements OnInit {
  @ViewChild('form') form: any;
  @ViewChild('requestMultiOrg') requestMultiOrg: any;
  @ViewChild('requestPartyOrg') requestPartyOrg: any;
  @ViewChild('requestMassOrg') requestMassOrg: any;
  userLogin = HrStorage.getUserToken().employeeCode
  headerFormConfig = "common.label.search.info"
  isHidden: boolean = false;
  isMasO: boolean = false;
  isPartyO: boolean = false;
  isOrg: boolean = false;
  isLabel: boolean = false;
  rewardType: any;
  branch: any;
  isMobileScreen: boolean = false;
  buttonFormConfig = [
    { name: 'search', class: 'btn btn-sm btn-info', innerHTML: 'common.button.icon.search' },
    { name: 'add', class: 'btn btn-sm btn-info', innerHTML: 'common.button.icon.add' }
  ]
  repeatCycleOrder = APP_CONSTANTS.REPEAT_CYCLE_ORDER
  monthOfYear = APP_CONSTANTS.MONTH_OF_YEAR
  formConfig = {
    businessType: [null],
    title: [null],
    typeOfReport: [null],
    startDate: [null],
    endDate: [null],
    organizationSubmitReport: [null],
    requestOrgMulti: [null],
    isOrgChild: [null],
    isBusinessType: [false],
    isTitle: [false],
    isTypeOfReport: [false],
    isStartDate: [false],
    isEndDate: [false],
    isOrganizationSubmitReport: [false],
    isRequestOrgMulti: [false],
    isShowOrgChild: [false],
  }
  businessTypeOptions
  typeOfReportOptions;
  tabeColumnsConfig = [
    {
      header: "common.label.table.action",
      width: "50px"
    },
    {
      header: "common.table.index",
      width: "50px"
    },
    {
      name: "title",
      header: "label.resolutionsMonth.name",
      width: "350px"
    },
    {
      name: "reportOrgName",
      header: "label.organizationReport.requestReport",
      width: "300px"
    },
    {
      name: "businessType",
      header: "label.report.business",
      width: "200px"
    },
    {
      name: "typeOfReportName",
      header: "reportPunishment.reportType",
      width: "150px"
    },
    {
      name: "reportingDeadline",
      header: "lable.request.deadline",
      width: "200px"
    },
    {
      name: "objectTypeName",
      header: "lable.request.objectType",
      width: "200px"
    },
  ]
  weeklyOptions = [
        { label: "Thứ 2", value: '2' },
        { label: "Thứ 3", value: '3' },
        { label: "Thứ 4", value: '4' },
        { label: "Thứ 5", value: '5' },
        { label: "Thứ 6", value: '6' },
        { label: "Thứ 7", value: '7' },
        { label: "Chủ Nhật", value: '1' },
    ]

    monthlyOptions;
    monthOfQuarterly = [
      { label: "Tháng đầu tiên", value: 'FIRST' },
      { label: "Tháng thứ hai", value: 'SECOND' },
      { label: "Tháng thứ ba", value: 'THIRD' },
  ]

  constructor(
    private router: Router,
    private appParamService: AppParamService,
    private service: RequestReportService,
    private app: AppComponent,
    public dialogService: DialogService,
  ) {
    super();
    this.setMainService(this.service);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    this.formSearch = this.buildForm('', this.formConfig);
    this.formSearch.setControl('requestOrgMulti', new FormArray([]));
    this.getDropDownOptions();
    this.search()
  }

  getDropDownOptions() {
    this.appParamService.appParams("TYPE_OF_REPORT").subscribe(
      res => {
        this.typeOfReportOptions = res.data;
      }
    )

    this.service.getBusinessType().subscribe(
      res => {
        this.businessTypeOptions = res.data;
        this.handleChangeBusinessType();
      }
    )
  }

  navigateToCreatePage(rowData?) {
    this.router.navigateByUrl('/report/request-report/create-update', { state: rowData });
  }

  navigateToViewPage(rowData?) {
    this.router.navigateByUrl('/report/request-report/view', { state: rowData });
  }

  navigateToCreatePageClone(rowData?) {
    this.router.navigateByUrl('/report/request-report/clone', { state: rowData });
  }

  search(event?) {
    let data= {
      businessType : this.formSearch.value.businessType,
      title : this.formSearch.value.title,
      typeOfReport: this.formSearch.value.typeOfReport,
      startDate: this.formSearch.value.startDate,
      endDate: this.formSearch.value.endDate,
      organizationSubmitReport: this.formSearch.value.organizationSubmitReport,
      isOrgChild: this.formSearch.value.isOrgChild,
      requestOrgMulti: this.formSearch.value.requestOrgMulti
    }
    this.service.search(data, event).subscribe(res => {
      this.buildDealineReport(res)
      this.resultList = res;
    });
  }

  deleteReport(report) {
    this.app.confirmMessage(null,
      () => {
        this.service.deleteById(report.requestReportingId)
          .subscribe(res => {
              this.search();
          })
      },
      () => { }
    )
  }

  clonePopup(rowData) {
    const ref = this.dialogService.open(ClonePopupFormComponent, {
      header: 'Clone báo cáo',
      width: '450px',
      baseZIndex: 1500,
      contentStyle: {"padding": "0"},
      data: rowData.requestReportingId
    });
    ref.onClose.subscribe( (res) => {
      if(res) {
        rowData.checkbox1 = res.checkbox1
        rowData.checkbox2 = res.checkbox2
        this.router.navigateByUrl('/report/request-report/clone', { state: rowData });
      }
    });
  }

  /**
   * Hàm trả về thời gian hoàn thành báo cáo
   * @param listReport
   */
  buildDealineReport(listReport) {
    listReport.data.forEach(item => {
      let strDayOfWeek = ""
      let repeatCycleOrder = ""
      let monthOfQuarter = ""
      if (!CommonUtils.isNullOrEmpty(item.dayOfWeek)) {
        const dayOfWeek = this.weeklyOptions.filter(ele => item.dayOfWeek.includes(ele.value))
        strDayOfWeek = dayOfWeek.map(item => item.label).join(", ")
      }
      if (!CommonUtils.isNullOrEmpty(item.repeatCycleOrder)) {
        repeatCycleOrder = this.repeatCycleOrder.find(({ value }) => value == item.repeatCycleOrder).name
      }
      if (!CommonUtils.isNullOrEmpty(item.monthOfQuarter)) {
        monthOfQuarter = this.monthOfQuarterly.find(({ value }) => value == item.monthOfQuarter).label
      }
      if (item.scheduleType == SCHEDULE_TYPE.DOT_XUAT) {
        item.reportingDeadline = moment(new Date(item.scheduleDate)).format('DD/MM/YYYY');;
      } else if (item.scheduleType == SCHEDULE_TYPE.THEO_TUAN) {
        item.reportingDeadline = "Mỗi " + item.repeatCycle + " tuần vào " + strDayOfWeek
      } else if (item.scheduleType == SCHEDULE_TYPE.THEO_THANG) {
        if(item.repeatOption == 1) {
          item.reportingDeadline = "Vào ngày " + item.dayOfMonth + " của mỗi " + item.repeatCycle + " tháng"
        } else {
          item.reportingDeadline = "Vào " + strDayOfWeek + " lần " + repeatCycleOrder + " của mỗi " + item.repeatCycle +" tháng"
        }
      } else if (item.scheduleType == SCHEDULE_TYPE.THEO_QUY) {
        if(item.repeatOption == 1) {
          item.reportingDeadline = " Vào ngày " + item.dayOfMonth + " " + monthOfQuarter + " của Quý " + item.quarterOfYear.replace(/","/g, ", ")
        } else {
          item.reportingDeadline = "Vào " + strDayOfWeek + " lần " + repeatCycleOrder + " của " + monthOfQuarter + " Quý " + item.quarterOfYear.replace(/","/g, ", ")
        }
      } else if (item.scheduleType == SCHEDULE_TYPE.THEO_NAM) {
        if (item.repeatOption == 1) {
          item.reportingDeadline = "Vào ngày " +  item.dayOfMonth + " của Tháng " + item.monthOfYear.replace(/","/g, ", ")
        } else {
          item.reportingDeadline = "Vào " + strDayOfWeek + " lần " + repeatCycleOrder + " của Tháng " +  item.monthOfYear.replace(/","/g, ", ")
        }
      }
    })
  }

  handleChangeBusinessType() {
    const rewardType = this.formSearch.controls['businessType'].value;
    this.formSearch.controls['requestOrgMulti'].setValue([]);
    this.rewardType = rewardType
    this.isHidden = false;
    this.isPartyO = false;
    this.isMasO = false;
    this.isOrg = false;
    this.isLabel = false;
    const mapParCode = MAP_YCBC_OBJECT_TYPE;
    if (!rewardType) {
      return;
    }
    const parCode = rewardType.parValue;
    if (mapParCode[parCode] == 1) {
      this.isHidden = true;
      this.isLabel = true;
      this.isOrg = true;
    } else if (mapParCode[parCode] == 2) {
      this.isHidden = true;
      this.isPartyO = true;
      this.isLabel = true;
    } else {
      this.isHidden = true;
      this.isMasO = true;
      this.isLabel = true;
      if (mapParCode[parCode] == 3) {//Phụ nữ
        this.branch = 1;
      } else if (mapParCode[parCode] == 4) {// Công đoàn
        this.branch = 3;
      } else if (mapParCode[parCode] == 5) {// thanh niên
        this.branch = 2;
      }
    }
  }


}
