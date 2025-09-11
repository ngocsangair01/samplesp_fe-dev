import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, SYSTEM_PARAMETER_CODE } from '@app/core';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { ReportDynamicService } from '../report-dynamic.service';

@Component({
  selector: 'report-dynamic-index',
  templateUrl: './report-dynamic-index.component.html',
  styleUrls: ['./report-dynamic-index.component.css']
})
export class ReportDynamicIndexComponent extends BaseComponent implements OnInit {
  /* Variables */
  formConfig: any = {
    code: [''],
    name: [''],
    formatReport: [''],
    startDate: [''],
    endDate: [''],
    groupId: [''],
    isCode:[false],
    isName: [false],
    isStartDate: [false],
    isEndDate: [false],
    isGroupId: [false],
    isFormatReport: [false],
  };
  listFormatReport = [];
  listGroup = [];

  constructor(public actr: ActivatedRoute
    , public reportDynamicService: ReportDynamicService
    , private appParamService: AppParamService
    , private categoryService: CategoryService
    , private app: AppComponent) {
    super(actr, CommonUtils.getPermissionCode("resource.reportDynamic"), ACTION_FORM.VIEW);
    this.setMainService(this.reportDynamicService);
    this.formSearch = this.buildForm({}, this.formConfig);
    this.loadReference();
  }

  ngOnInit() {
    this.processSearch();
  }

  get f() {
    return this.formSearch.controls;
  }

  /**
   * Load cac list du lieu lien quan
   */
  private loadReference(): void {
    this.appParamService.findByName(SYSTEM_PARAMETER_CODE.REPORT_DYNAMIC_FORMAT_REPORT)
      .subscribe(res => this.listFormatReport = res.data);

    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.BUSINESS_GROUP).subscribe(
      res => this.listGroup = res.data
    );
  }

  processDelete(item) {
    if (item && item.reportDynamicId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.reportDynamicService.deleteById(item.reportDynamicId)
          .subscribe(res => {
            if (this.reportDynamicService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      }, () => {// on rejected
      });
    }
  }

  clone(reportDynamicId) {
    if (CommonUtils.nvl(reportDynamicId) > 0) {
      this.app.confirmMessage("common.message.confirm.clone", () => {// on accepted
        this.reportDynamicService.clone(reportDynamicId)
          .subscribe(res => {
            if (this.reportDynamicService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      }, () => {// on rejected
      });
    }
  }

}
