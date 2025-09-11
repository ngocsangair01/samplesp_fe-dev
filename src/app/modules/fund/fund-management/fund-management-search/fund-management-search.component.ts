import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM } from '@app/core';
import { FundManagementService } from '@app/core/services/fund/fund-management.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'fund-management-search',
  templateUrl: './fund-management-search.component.html',
  styleUrls: ['./fund-management-search.component.css']
})
export class FundManagementSearchComponent extends BaseComponent implements OnInit {
  formConfig = {
    fundName: ['', [Validators.maxLength(255)]],
    organizationId: [''],
    isFundName: [false],
    isOrganizationId: [false],
  };
  constructor(
    private fundManagementService: FundManagementService,
    private router: Router,
    private app: AppComponent,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.fundManagement"));
    this.setMainService(fundManagementService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW, []);
    this.processSearch();
  }
  ngOnInit() {
  }
  get f() {
    return this.formSearch.controls;
  }

  /**
   * Hàm chuyển sang trang Add or Update quỹ
   * @param item 
   */
  public prepareSaveOrUpdate(item?: any) {

    if (item && item.fundManagementId > 0) {
      this.router.navigate(['/fund/fund-management/fund-management-edit/', item.fundManagementId]);
    } else {
      this.router.navigate(['/fund/fund-management/fund-management-add']);
    }
  }
  public prepareView(item) {
    this.router.navigate(['/fund/fund-management/fund-management-view/', item.fundManagementId, 'view']);
  }

  /**
   * Hàm xóa quỹ
   * @param item 
   */
  processDelete(item) {
    if (item && item.fundManagementId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.fundManagementService.deleteById(item.fundManagementId)
          .subscribe(res => {
            if (this.fundManagementService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      }, () => {// on rejected

      });
    }
  }

  /**
   * Hàm export quỹ
   */
  export() {
    const reqData = this.formSearch.value;
    this.fundManagementService.export(reqData).subscribe(res => {
      saveAs(res, 'Danh_sach_quy');
    });
  }

  /**
   * Hàm redirect sang màn xem lịch sử hoạt động
   * @param item 
   */
  public onViewListActivity(item) {
    this.router.navigate(['/fund/fund-management/fund-history/', item.fundManagementId]);
  }
}
