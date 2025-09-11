import { Component, OnInit } from '@angular/core';
import {FormGroup} from "@angular/forms";
import {AppComponent} from "@app/app.component";
import {Router} from "@angular/router";
import {ACTION_FORM} from "@app/core";
import {CommonUtils} from "@app/shared/services";
import {BaseComponent} from "@app/shared/components/base-component/base-component.component";
import {RewardCategoryFunding} from "@app/core/services/reward-category/reward-category-funding";

@Component({
  selector: 'reward-category-funding-search',
  templateUrl: './reward-category-funding-search.component.html',
  styleUrls: ['./reward-category-funding-search.component.css']
})
export class RewardCategoryFundingSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;

  formConfig = {
    funding: [''],
    fundingCode: [''],
    expriedDate: [''],
    isFunding: [false],
    isFundingCode: [false],
    isExpriedDate: [false]
  };
  constructor(
      public rewardCategoryFunding: RewardCategoryFunding,
      private app: AppComponent,
      private router: Router,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.rewardGeneral"));
    this.setMainService(this.rewardCategoryFunding);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW);

  }

  ngOnInit() {
    //Lấy miền dữ liệu mặc định theo nv đăng nhập
    // this.defaultDomain = HrStorage.getDefaultDomainByCode(CommonUtils.getPermissionCode(this.operationKey)
    //     , CommonUtils.getPermissionCode(this.adResourceKey));
    // // search
    // if (this.defaultDomain) {
    //   this.service.findOne(this.defaultDomain)
    //       .subscribe((res) => {
    //         const data = res.data;
    //         // if (data) {
    //         //   this.f['rewardCategoryId'].setValue(data.organizationId);
    //         // }
    //         this.processSearch();
    //       });
    // } else {
      this.processSearch();
    // }
  }

  get f() {
    return this.formSearch.controls;
  }

  public prepareSaveOrUpdate(item) {
    if (item && item.fundingCategoryId > 0) {
      this.rewardCategoryFunding.findOne(item.fundingCategoryId).subscribe(res => {
        if (res.data != null) {
          this.router.navigate(['/reward/reward-category-funding/edit/', item.fundingCategoryId]);
        } else {
          this.processSearch();
          return;
        }
      });
    } else {
      this.router.navigate(['/reward/reward-category-funding/add']);
    }
  }

  public processView(item) {
    this.rewardCategoryFunding.findOne(item.fundingCategoryId)
        .subscribe(res => {
          if (res.data != null) {
            this.router.navigate(['/reward/reward-category-funding/view/', item.fundingCategoryId]);
          } else {
            this.processSearch();
            return;
          }
        });
  }

  public processDelete(item) {
    if (item && item.fundingCategoryId > 0) {
      this.rewardCategoryFunding.findOne(item.fundingCategoryId)
          .subscribe(res => {
            if (res.data != null) {
              this.app.confirmDelete(null, () => { // accept
                this.rewardCategoryFunding.deleteById(item.fundingCategoryId)
                    .subscribe(res => {
                      if (this.rewardCategoryFunding.requestIsSuccess(res)) {
                        this.processSearch(null);
                      }
                    })
              }, () => {
                // rejected
              })
            } else {
              this.processSearch();
              return;
            }
          })
    }
  }


}
