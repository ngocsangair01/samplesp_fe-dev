import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { CategoryService } from '@app/core/services/setting/category.service';
import { FundActivityService } from '@app/core/services/fund/fund-activity.service';
import {saveAs} from "file-saver";

@Component({
  selector: 'fund-activity-search',
  templateUrl: './fund-activity-search.component.html',
  styleUrls: ['./fund-activity-search.component.css']
})
export class FundActivitySearchComponent extends BaseComponent implements OnInit {
  activityTypeList: any;
  formConfig = {
    activityTypeId: [''],
    executedDateFrom: [''],
    executedDateTo: [''],
    organizationId: [''],
    isActivityTypeId: [''],
    isExecutedDateFrom: [''],
    isExecutedDateTo: [''],
    isOrganizationId: [''],
  };
  constructor(
    private fundActivityService: FundActivityService,
    private categoryService: CategoryService,
    private router: Router,
    private app: AppComponent,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.fundActivity"));
    this.setMainService(fundActivityService);
    this.buildForms();
    this.processSearch();
  }
  ngOnInit() {
  }
  get f() {
    return this.formSearch.controls;
  }

  /**
   * buildForm
   */
  private buildForms(): void {
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW, [ValidationService.notAffter('executedDateFrom', 'executedDateTo', 'fund.label.toDate')]);
    //lay activity type
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.ACTIVITY_TYPE).subscribe(res => {
      this.activityTypeList = res.data;
    });
  }

  /**
   * Hàm chuyển sang trang Add or Update hoạt động của quỹ
   * @param item
   */
  public prepareSaveOrUpdate(item?: any) {

    if (item && item.fundActivityId > 0) {
      this.router.navigate(['/fund/fund-activity/fund-activity-edit/', item.fundActivityId]);
    } else {
      this.router.navigate(['/fund/fund-activity/fund-activity-add']);
    }
  }
  /**
   * Hàm xem hoạt động của quỹ
   * @param item
   */
  public prepareView(item) {
    this.router.navigate(['/fund/fund-activity/fund-activity-view/', item.fundActivityId, 'view']);
  }

  /**
   * Hàm xóa hoạt động của quỹ
   * @param item
   */
  processDelete(item) {
    if (item && item.fundActivityId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.fundActivityService.deleteById(item.fundActivityId)
          .subscribe(res => {
            if (this.fundActivityService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      }, () => {// on rejected

      });
    }
  }

  /**
   * Hàm export hoạt động của quỹ
   */
  export() {
    const reqData = this.formSearch.value;
    this.fundActivityService.export(reqData).subscribe(res => {
      saveAs(res, 'Danh_sach_hoat_dong');
    });
  }
}
