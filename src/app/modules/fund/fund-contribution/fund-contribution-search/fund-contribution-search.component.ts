import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM } from '@app/core';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { FundContributionService } from '@app/core/services/fund/fund-contribution.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'fund-contribution-search',
  templateUrl: './fund-contribution-search.component.html',
  styleUrls: ['./fund-contribution-search.component.css']
})
export class FundContributionSearchComponent extends BaseComponent implements OnInit {
  formConfig = {
    fundManagementId: [''],
    organizationId: [''],
    effectiveDate: [''],
    expritedDate: [''],
    isFundManagementId: [false],
    isOrganizationId: [false],
    isEffectiveDate: [false],
    isExpritedDate: [false],
    employeeId: [false]
  };
  constructor(
    private fundContributionService: FundContributionService,
    private router: Router,
    private app: AppComponent,
    private fileStorage: FileStorageService,
    private appParamService: AppParamService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.fundContribution"));
    this.setMainService(fundContributionService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW, [ValidationService.notAffter('effectiveDate', 'expritedDate', 'fund.label.toDate')]);
    this.processSearch();
  }

  ngOnInit() {
  }

  get f() {
    return this.formSearch.controls;
  }

  public prepareSaveOrUpdate(item?: any) {

    if (item && item.fundContributionId > 0) {
      this.router.navigate(['/fund/fund-contribution/fund-contribution-edit/', item.fundContributionId]);
    } else {
      this.router.navigate(['/fund/fund-contribution/fund-contribution-add']);
    }
  }

  public prepareView(item) {
    this.router.navigate(['/fund/fund-contribution/fund-contribution-view/', item.fundContributionId, 'view']);
  }

  processDelete(item) {
    if (item && item.fundContributionId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.fundContributionService.deleteById(item.fundContributionId)
          .subscribe(res => {
            if (this.fundContributionService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      }, () => {// on rejected

      });
    }
  }

  /**
   * Xu ly download file trong danh sach
   */

  public downloadFile(fileData) {
    this.fileStorage.downloadFile(fileData.secretId).subscribe(res => {
      saveAs(res, fileData.fileName);
    });
  }


  /**
   * 
   */
  export() {
    const reqData = this.formSearch.value;
    this.fundContributionService.export(reqData).subscribe(res => {
      saveAs(res, 'Danh_sach_phieu_thu_quy');
    });
  }
}
