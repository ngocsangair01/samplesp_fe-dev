import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM } from '@app/core';
import { ExpressionReportRequestService } from '@app/core/services/propaganda/expression-report-recored.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import * as moment from 'moment';
@Component({
  selector: 'expression-report-recorded-search',
  templateUrl: './expression-report-recorded-search.component.html',
    styleUrls: ['./expression-report-recorded-search.component.css']
})
export class ExpressionReportRecordedSearchComponent extends BaseComponent implements OnInit {

  formSearch: FormGroup;
  listStatus: any;
  resultList: any;
  dateRangeList: Array<any>;
  filterConditionEmp: any;
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  yearList: Array<any>;
  check: any;
  adResourceKey = "resource.expressionReportRecorded";
  formConfig = {
    reportedOrganizationId: [''],
    reportedType: [0],
    reportedTime: [''],
    reportedYear: [''] ,
      isReportedOrganizationId: [false],
      isReportedType: [false],
      isReportedTime: [false],
      isReportedYear: [false]
  }

  constructor(
    private expressionReportRequestService: ExpressionReportRequestService,
    private router: Router,
    private app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode("resource.expressionReportRecorded"));
    this.yearList = this.getYearList();
    this.setMainService(expressionReportRequestService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW);
    this.onChangeDateRange(0);
  }

  ngOnInit() {
    this.processSearch();
  }

  get f() {
    return this.formSearch.controls;
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

  public onChangeDateRange(value?: any) {
    let dateRangeName = ''
    const dateRangeList = [];
    let maxRage = 0
    this.f['reportedYear'].clearValidators();
    this.formSearch.controls['reportedTime'].setValue('');
    switch (value) {
      case 1:
          maxRage = this.formSearch.get('reportedYear').value ? moment().year(this.formSearch.get('reportedYear').value).weeksInYear() : 0
          dateRangeName = 'Tuần '
          this.f['reportedYear'].setValidators(ValidationService.required);
          break;
      case 2:
          maxRage = 12
          dateRangeName = 'Tháng '
          this.f['reportedYear'].setValidators(ValidationService.required);
          break;
      case 3:
          maxRage = 4
          dateRangeName = 'Quý '
          this.f['reportedYear'].setValidators(ValidationService.required);
          break;
      case 4:
        this.f['reportedYear'].setValidators(ValidationService.required);
        break;
      default:
    }
    this.f['reportedYear'].updateValueAndValidity();
    for (let i = 1; i <= maxRage; i++) {
      const obj = {
        dateRange: i,
        dateRangeName: dateRangeName + i
      };
      dateRangeList.push(obj);
      this.dateRangeList = dateRangeList;
    }
  }

   /**
   * Thêm mới
   * @param item
   */
    public add() {
      this.router.navigate(['/propaganda/expression-report-recorded/add']);
    }

    public prepareView(item) {
      this.router.navigate(['/propaganda/expression-report-recorded/', item.expressionReportRecordedId, 'view']);
    }

    /**
   * Hàm chuyển sang trang Add or Update hoạt động của quỹ
   * @param item 
   */
  public prepareAddOrUpdate(item?: any) {

    if (item && item.expressionReportRecordedId > 0) {
      this.router.navigate(['/propaganda/expression-report-recorded/', item.expressionReportRecordedId, 'edit']);
    } else {
      this.router.navigate(['/propaganda/expression-report-recorded/add']);
    }
  }
  
  /**
   * Xóa
   * @param item 
   */
   processDelete(item?: any) {
    if (item && item.expressionReportRecordedId > 0) {
      this.app.confirmDelete('common.message.confirm.delete', () => {// on accepted
        this.expressionReportRequestService.deleteById(item.expressionReportRecordedId)
          .subscribe(res => {
            if (this.expressionReportRequestService.requestIsSuccess(res)) {
              this.processSearch();
            }
          });
      }, () => {// on rejected
      });
    }
  }

  /**
   * Xuất báo cáo
   * @param item 
   */
   prepareExportReport(item?: any) {
      this.expressionReportRequestService.exportExpressionReportRecoded(item.expressionReportRecordedId).subscribe(res => {
        saveAs(res, 'Bao_cao_bieu_hien_tu_tuong.docx');
      });
  }
   /**
   * Xuất báo cáo
   * @param item 
   */
    prepareExportPdf(item?: any) {
      this.expressionReportRequestService.exportPdf(item.expressionReportRecordedId).subscribe(res => {
        saveAs(res, 'Bao_cao_bieu_hien_tu_tuong.pdf');
      });
  }
}
