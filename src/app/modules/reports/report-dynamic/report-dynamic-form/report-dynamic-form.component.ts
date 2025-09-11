import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, SYSTEM_PARAMETER_CODE } from '@app/core';
import { FileControl } from '@app/core/models/file.control';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';
import { ReportDynamicService } from '../report-dynamic.service';
import { ReportDynamicColumnComponent } from './form-childs/report-dynamic-column/report-dynamic-column.component';
import { ReportDynamicParameterComponent } from './form-childs/report-dynamic-parameter/report-dynamic-parameter.component';
import { ReportDynamicSqlComponent } from './form-childs/report-dynamic-sql/report-dynamic-sql.component';

@Component({
  selector: 'report-dynamic-form',
  templateUrl: './report-dynamic-form.component.html',
  styleUrls: ['./report-dynamic-form.component.css']
})
export class ReportDynamicFormComponent extends BaseComponent implements OnInit {
  @ViewChild('parameter')
  public parameterForm: ReportDynamicParameterComponent;
  @ViewChild('column')
  public columnForm: ReportDynamicColumnComponent;
  @ViewChild('sql')
  public sqlForm: ReportDynamicSqlComponent;

  navigationSubscription;
  formSave: FormGroup;
  listFormatReport = [];
  reportDynamicId: number;
  formConfig: any = {
    reportDynamicId: [''],
    code: ['', [ValidationService.required]],
    name: ['', [ValidationService.required]],
    formatReport: [''],
    startDate: ['', [ValidationService.required]],
    endDate: [''],
    startRow: ['', [ValidationService.positiveInteger]],
    startRowSign: ['', [ValidationService.positiveInteger]],
    endRowSign: ['', [ValidationService.positiveInteger]],
    fileType: [1, [ValidationService.required]],
    groupId: ['', ValidationService.required],
    fileTemplate: [''],
    fileName: [''],
    reportUrl: ['']
  };
  listGroup = [];

  constructor(public actr: ActivatedRoute
    , public reportDynamicService: ReportDynamicService
    , private categoryService: CategoryService
    , private appParamService: AppParamService
    , private app: AppComponent
    , private router: Router
    , private helperService: HelperService) {
    super(actr, CommonUtils.getPermissionCode("resource.reportDynamic"));
    if (!this.hasPermission('action.insert')) {
      return;
    }
    this.loadReference();
    this.formSave = this.buildForm({}, this.formConfig, ACTION_FORM.INSERT,
      [ValidationService.notAffter('startDate', 'endDate', 'app.reportDynamic.endDate')]);
    this.formSave.addControl('file', new FileControl(null, ValidationService.required));

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd && this.router.url.indexOf('edit') >= 0) {
        this.reportDynamicId = this.actr.snapshot.params.id;
        // if (this.reportDynamicId) {
        this.reportDynamicService.findOne(this.reportDynamicId).subscribe(res => {
          this.helperService.isProcessing(true);
          this.formSave = this.buildForm(res.data, this.formConfig, ACTION_FORM.UPDATE,
            [ValidationService.notAffter('startDate', 'endDate', 'app.reportDynamic.endDate')]);
          this.formSave.addControl('file', new FileControl(null));
          if (res.data && res.data.fileAttachment) {
            (this.formSave.controls['file'] as FileControl).setFileAttachment(res.data.fileAttachment.reportDynamicFile);
          }
          if (res.data && res.data.formatReport != "BIRT") {
            this.formSave.controls.fileType.setValue(1);
          }
          this.parameterForm.initParameterForm(ACTION_FORM.UPDATE, this.propertyConfigs, res.data.lstReportParameter);
          this.sqlForm.initSqlForm(ACTION_FORM.UPDATE, this.propertyConfigs, res.data.lstReportSql);
          this.columnForm.initColumnForm(ACTION_FORM.UPDATE, this.propertyConfigs, res.data.lstReportColumn);
          this.helperService.isProcessing(false);
        });
        // }
      }
    });
  }

  ngOnInit() { }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  get f() {
    return this.formSave.controls;
  }

  private loadReference(): void {
    this.appParamService.findByName(SYSTEM_PARAMETER_CODE.REPORT_DYNAMIC_FORMAT_REPORT)
      .subscribe(res => this.listFormatReport = res.data);

    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.BUSINESS_GROUP).subscribe(
      res => this.listGroup = res.data
    );
  }

  /**
   * processSaveOrUpdate
   */
  processSaveOrUpdate() {
    if (!this.formSave.get('fileName').value && !this.formSave.get('file').value) {
      this.formSave.removeControl('file');
      this.formSave.addControl('file', new FormControl(null , [ValidationService.required]));
    }
    const formSave = CommonUtils.isValidForm(this.formSave);
    const formParameter = CommonUtils.isValidForm(this.parameterForm.formParameter);
    const formColumn = CommonUtils.isValidForm(this.columnForm.formColumn);
    const formSql = CommonUtils.isValidForm(this.sqlForm.formSql);
    if (formSave && formParameter && formColumn && formSql) {
      const reqData = this.formSave.value;
      reqData.lstReportParameter = this.parameterForm.formParameter.value;
      reqData.lstReportColumn = this.columnForm.formColumn.value;
      reqData.lstReportSql = this.sqlForm.formSql.value;
      this.app.confirmMessage(null, () => {// on accepted
        this.reportDynamicService.saveOrUpdateFormFile(reqData)
          .subscribe(res => {
            if (this.reportDynamicService.requestIsSuccess(res)) {
              this.router.navigate(['/reports/report-dynamic']);
            }
          });
      }, () => {// on rejected

      });
    }
  }

  syncAlias() {
    if (!CommonUtils.isValidForm(this.sqlForm.formSql)) {
      return;
    }
    let arrSql = this.sqlForm.formSql.value;
    let data = {
      sqlQuery: arrSql[0].sql,
      sortOrder: 999999999
    }
    if (!data.sqlQuery) {
      return;
    }
    const that = this;
    let arrColumn = [];
    let i = 1;
    let length = arrSql.length;
    arrSql.forEach(function (item) {
      data = {
        sqlQuery: item.sql,
        sortOrder: item.sortOrder
      }
      that.reportDynamicService.getColumnReturn(data).subscribe(res => {
        if (res && res.length > 0) {
          res.forEach(function (item) {
            arrColumn.push({
              reportDynamicId: that.formSave.controls.reportDynamicId.value,
              name: item.toUpperCase(),
              dataType: "STRING",
              width: 100,
              sortOrder: i++,
              aliasName: item.toUpperCase()
            });
          });
          if (length !== 1) {
            length--;
          } else {
            that.columnForm.initColumnForm(ACTION_FORM.UPDATE, that.propertyConfigs, arrColumn);
          }

        }
      });
    });
  }

  downloadFile(reportDynamicId) {
    const url = `${this.reportDynamicService.serviceUrl}/download-template/${reportDynamicId}`;
    window.location.href = url;
  }

  searchFileById(reportDynamicId) {
    const url = `${this.reportDynamicService.serviceUrl}/download-template/${reportDynamicId}`;
    return this.reportDynamicService.getRequest(url);
  }
}
