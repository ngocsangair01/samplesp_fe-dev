import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ValidationService } from '@app/shared/services/validation.service';
import { AppComponent } from '../../../../app.component';
import { CommonUtils } from '../../../../shared/services/common-utils.service';
import * as moment from 'moment';
import { ExpressionReportRequestService } from '@app/core/services/propaganda/expression-report-recored.service';
import { HrStorage } from '@app/core/services/HrStorage';
import { RewardThoughtReportService } from '@app/core/services/propaganda/reward-thought-report.service';

@Component({
  selector: 'expression-report-recorded-add',
  templateUrl: './expression-report-recorded-add.component.html',
  styleUrls: ['./expression-report-recorded-add.component.css']
})
export class ExpressionReportRecordedAddComponent extends BaseComponent implements OnInit {

  formSave: FormGroup;
  isView: boolean;
  isUpdate: boolean;
  expressionReportRecordedId: any;
  firstTitle: any;
  lastTitle: any;
  yearList: Array<any>;
  reportTimeList: Array<any>;
  listDataTable : Array<any>;
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  adResourceKey = "resource.expressionReportRecorded";
  formConfig = {
    expressionReportRecordedId: [''],
    reportedOrganizationId: ['', ValidationService.required],
    receivedOrganizationId: ['', ValidationService.required],
    reportedEmployeeId: ['', ValidationService.required],
    reportedYear: [moment().year(), ValidationService.required],
    reportedType: [1, ValidationService.required],
    comment: [''],
    reportedTime: ['', ValidationService.required],
    reportResult: [1, ValidationService.required],
    reportedDateFrom: [''],
    reportedDateTo: ['']
  }
  isShowRewardThoughtReport: boolean;
  isRequiredComment: boolean;
  public rootId: any;
  constructor(
    private expressionReportRequestService: ExpressionReportRequestService,
    private rewardThoughtReportService: RewardThoughtReportService,
    private router: Router,
    public actr: ActivatedRoute,
    private app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode("resource.expressionReportRecorded"));
    this.actr.params.subscribe(params => {
      if (params && params.id != null) {
        this.expressionReportRecordedId = params.id;
      }
    });
    this.yearList = this.getYearList();
    this.buildForms({});
    this.formSave.controls['reportedTime'].setValue(moment().week());
    const userInfo = HrStorage.getUserToken();
    this.formSave.controls['reportedEmployeeId'].setValue(userInfo.userInfo.employeeId);
  }
  get f() {
    return this.formSave.controls;
  }
  ngOnInit() {
    this.setFormValue(this.expressionReportRecordedId);
    const subPaths = this.router.url.split('/');
    if (subPaths.length >= 3) {
      if (subPaths[4] == 'view') {
        this.isView = true;
      } else if (subPaths[4] == 'edit') {
        this.isUpdate = true;
      }
    }
    if (this.isView) {
      this.firstTitle = 'ui-g-12 ui-md-3 ui-lg-2 control-label vt-align-right';
      this.lastTitle = 'ui-g-12 ui-md-3 ui-lg-3 control-label vt-align-right';
    } else {
      this.firstTitle = 'ui-g-12 ui-md-3 ui-lg-2 control-label vt-align-right required';
      this.lastTitle = 'ui-g-12 ui-md-3 ui-lg-3 control-label vt-align-right required';
    }
  }
  public buildForms(data?: any) {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT);
  }
  public setFormValue(data?: any) {
    if (data && data > 0) {
      this.expressionReportRequestService.findOne(data).subscribe(res => {
        this.buildForms(res.data);
        this.handleThoughtStatus();
        this.onChangeReportResult(res.data.reportResult)
        this.onChangeReportTime(res.data.reportedType, true);
      });
    } else {
      const timeOut = setTimeout(() => {
        this.onChangeReportTime(APP_CONSTANTS.EXPRESSION_REPORT_TYPE.TUAN, true);
        clearTimeout(timeOut)
      }, 200)
      
    }
  }
  public goBack() {
    this.router.navigate(['/propaganda/expression-report-recorded']);
  }
  public processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    const formInput = {...this.formSave.value}
    formInput['expressionReportRecordedId'] = this.expressionReportRecordedId;
    this.app.confirmMessage(null, () => {
      this.expressionReportRequestService.saveOrUpdate(formInput).subscribe(res => {
        if (this.expressionReportRequestService.requestIsSuccess(res) && res.data && res.data.expressionReportRecordedId) {
          this.router.navigate([`/propaganda/expression-report-recorded/${res.data.expressionReportRecordedId}/view`]);
        }
      })
    }, () => { // on rejected

    })
  }

  private getYearList() {
    const yearList = [];
    for (let i = (this.currentYear - 20); i <= (this.currentYear + 20); i++) {
      const obj = {
        year: i
      };
      yearList.push(obj);
    }
    return yearList;
  }

  public onChangeReportTime(value?: any, isSetTime?: any) {
    !isSetTime && this.formSave.controls['reportedTime'].setValue('');
    let reportTimeName = ''
    const reportTimeList = [];
    let maxRage = 0
    switch (value) {
      case APP_CONSTANTS.EXPRESSION_REPORT_TYPE.TUAN:
          maxRage = moment().year(this.formSave.get('reportedYear').value).weeksInYear()
          reportTimeName = 'Tuần '
          break;
      case APP_CONSTANTS.EXPRESSION_REPORT_TYPE.THANG:
          maxRage = 12
          reportTimeName = 'Tháng '
          break;
      case APP_CONSTANTS.EXPRESSION_REPORT_TYPE.QUY:
          maxRage = 4
          reportTimeName = 'Quý '
          break;
      case APP_CONSTANTS.EXPRESSION_REPORT_TYPE.NAM:
        this.formSave.controls['reportedTime'].setValue(this.formSave.get('reportedYear').value)
        break;
      default:
    }
    for (let i = 1; i <= maxRage; i++) {
      const obj = {
        reportTime: i,
        reportTimeName: reportTimeName + i
      };
      reportTimeList.push(obj);
    }
    this.reportTimeList = reportTimeList;
    this.handleThoughtStatus();
  }

  onChangeYear() {
    this.onChangeReportTime(this.formSave.get('reportedType').value)
  }

  onChangeReportedOrg(data?: any) {
    if (this.rootId != data.orgParentId) {
      this.rootId = data.orgParentId
      this.formSave.controls['receivedOrganizationId'].setValue('');
    }
    this.handleThoughtStatus();
  }

  /**
   * Ham xu ly lay du lieu muc do, tinh chat
  */
  handleThoughtStatus() {
      this.setReportDate();
      if (this.formSave.get('reportedDateTo').value && this.formSave.get('reportedDateFrom').value && this.formSave.get('reportedOrganizationId').value) {
        const params = {
            orgEovId: this.formSave.get('reportedOrganizationId').value,
            timeFromDate: this.formSave.get('reportedDateFrom').value,
            timeToDate: this.formSave.get('reportedDateTo').value,
        }
        this.rewardThoughtReportService.getCountRewardThoughtReport(params).subscribe(res => {
          this.listDataTable = res.sort(((a, b) => parseInt(a.eovTypeLevel) - parseInt(b.eovTypeLevel)));
          this.listDataTable = res.reverse();
          this.isShowRewardThoughtReport = true;
        })
      } else {
        this.isShowRewardThoughtReport = false;
      }
  }
  
  /**
   * Ham xu ly lay thoi gian bao cao
  */
  setReportDate() {
    switch (this.formSave.get('reportedType').value) {
      case APP_CONSTANTS.EXPRESSION_REPORT_TYPE.TUAN:
          this.formSave.controls['reportedDateFrom'].setValue(moment().year(this.formSave.get('reportedYear').value).week(this.formSave.get('reportedTime').value).startOf('isoWeek').valueOf());
          this.formSave.controls['reportedDateTo'].setValue(moment().year(this.formSave.get('reportedYear').value).week(this.formSave.get('reportedTime').value).endOf('isoWeek').valueOf());
          break;
      case APP_CONSTANTS.EXPRESSION_REPORT_TYPE.THANG:
          this.formSave.get('reportedDateFrom').setValue(moment().year(this.formSave.get('reportedYear').value).month(this.formSave.get('reportedTime').value - 1).startOf("month").valueOf());
          this.formSave.get('reportedDateTo').setValue(moment().year(this.formSave.get('reportedYear').value).month(this.formSave.get('reportedTime').value - 1).endOf("month").valueOf());
          break;
      case APP_CONSTANTS.EXPRESSION_REPORT_TYPE.QUY:
          this.formSave.get('reportedDateFrom').setValue(moment().year(this.formSave.get('reportedYear').value).quarter(this.formSave.get('reportedTime').value).startOf("quarter").valueOf());
          this.formSave.get('reportedDateTo').setValue(moment().year(this.formSave.get('reportedYear').value).quarter(this.formSave.get('reportedTime').value).endOf("quarter").valueOf());
          break;
      case APP_CONSTANTS.EXPRESSION_REPORT_TYPE.NAM:
          this.formSave.get('reportedDateFrom').setValue(moment().year(this.formSave.get('reportedYear').value).startOf("year").valueOf());
          this.formSave.get('reportedDateTo').setValue(moment().year(this.formSave.get('reportedYear').value).endOf("year").valueOf());
          break;
      default:
    }
  }
  onChangeReportResult (value?: any) {
    if (value == 2) {
      this.isRequiredComment = true;
      this.f['comment'].setValidators(ValidationService.required);
    } else {
      this.isRequiredComment = false;
      this.f['comment'].clearValidators();
    }
      this.f['comment'].updateValueAndValidity();
  }

  navigate() {
    this.router.navigate(['/propaganda/expression-report-recorded', this.expressionReportRecordedId, 'edit']);
  }

}
