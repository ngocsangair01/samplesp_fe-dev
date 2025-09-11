import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { APP_CONSTANTS, MAP_YCBC_OBJECT_TYPE, RequestReportService } from '@app/core';
import { Router } from '@angular/router';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { DialogService } from 'primeng/api';
import {FormArray} from "@angular/forms";
import {RequestPeriodicReportingService} from "@app/core/services/report/request-periodic-reporting.service";
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
  isHidden: boolean = false;
  isMasO: boolean = false;
  isPartyO: boolean = false;
  isOrg: boolean = false;
  isLabel: boolean = false;
  rewardType: any;
  branch: any;
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
    reportingPeriod: [null],
    isBusinessType: [false],
    isTitle: [false],
    isRequestOrgMulti: [false],
    isOrgChildCheck: [false],
    isStartDate: [false],
    isEndTime: [false],
    isReportingPeriod: [false]
  }
  businessTypeOptions
  typeOfReportOptions;
  isMobileScreen: boolean = false;

  constructor(
    private router: Router,
    private appParamService: AppParamService,
    private requestReportService: RequestReportService,
    private service: RequestPeriodicReportingService,
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
    this.requestReportService.getBusinessType().subscribe(
      res => {
        this.businessTypeOptions = res.data;
        this.handleChangeBusinessType();
      }
    )
  }

  navigateToViewPage(item?) {
    this.router.navigateByUrl('/report/request-report/view', { state: item });
  }

  previewDynamicReport(item?){
    this.router.navigateByUrl('/report/request-periodic-reporting/dynamic-report', { state: item });
  }

  search(event?) {
    let data= {
      businessType : this.formSearch.value.businessType,
      title : this.formSearch.value.title,
      reportingPeriod: this.formSearch.value.reportingPeriod,
      startDate: this.formSearch.value.startDate,
      endDate: this.formSearch.value.endDate,
      organizationSubmitReport: this.formSearch.value.organizationSubmitReport,
      isOrgChild: this.formSearch.value.isOrgChild,
      requestOrgMulti: this.formSearch.value.requestOrgMulti
    }
    this.service.search(data, event).subscribe(res => {
      this.resultList = res;
    });
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
