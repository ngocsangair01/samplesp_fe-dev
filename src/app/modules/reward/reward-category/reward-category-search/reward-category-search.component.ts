import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, OrganizationService } from '@app/core';
import { HrStorage } from '@app/core/services/HrStorage';
import { RewardCategoryService } from '@app/core/services/reward-category/reward-category.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';


@Component({
  selector: 'reward-category-search',
  templateUrl: './reward-category-search.component.html',
  styleUrls: ['./reward-category-search.component.css']
})
export class RewardCategorySearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  rewardObjectTypeList: any;
  rewardTypeList: any;
  rewardCategoryTypeList: any;
  rewardGroupList: any;
  rewardTypeListByUser: any;
  formConfig = {
    rewardObjectType: [null],
    rewardType: [null],
    rewardCategoryType: [null],
    code: [null],
    name: [null],
    rewardCategory: [null],
    rewardGroup: [null],
    isRewardObjectType: [false],
    isRewardType: [false],
    isCode: [false],
    isName: [false],
    isRewardCategory: [false],
    isRewardGroup: [false]
  };
  private defaultDomain: any;
  private operationKey = 'action.view';
  private adResourceKey = 'resource.rewardGeneral';
  constructor(
    public rewardCategoryService: RewardCategoryService,
    private app: AppComponent,
    private router: Router,
    private service: OrganizationService,
    private modalService: NgbModal,
    private rewardProposeService: RewardProposeService,
  ) { 
    super(null, CommonUtils.getPermissionCode("resource.rewardGeneral"));
    this.setMainService(this.rewardCategoryService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW);
    this.rewardObjectTypeList = APP_CONSTANTS.REWARD_OBJECT_LIST;
    this.rewardTypeList = APP_CONSTANTS.REWARD_GENERAL_TYPE_LIST;
    this.rewardCategoryTypeList= APP_CONSTANTS.REWARD_CATEGORY_TYPE_LIST;
    this.rewardGroupList = APP_CONSTANTS.REWARD_GROUP_LIST;    
  }

  ngOnInit() {
    //Lấy miền dữ liệu mặc định theo nv đăng nhập
    this.defaultDomain = HrStorage.getDefaultDomainByCode(CommonUtils.getPermissionCode(this.operationKey)
      , CommonUtils.getPermissionCode(this.adResourceKey));
    // search
    if (this.defaultDomain) {
      this.service.findOne(this.defaultDomain)
        .subscribe((res) => {
          const data = res.data;
          // if (data) {
          //   this.f['rewardCategoryId'].setValue(data.organizationId);
          // }
          this.processSearch();
        });
    } else {
      this.processSearch();
    }
    this.rewardProposeService.getRewardTypeList().subscribe(res => {
      this.rewardTypeListByUser = this.rewardTypeList.filter((item) => {
        return res.includes(item.id)
      })
    })
  }

  get f() {
    return this.formSearch.controls;
  }

  public prepareSaveOrUpdate(item) {
    if (item && item.rewardCategoryId > 0) {
      this.rewardCategoryService.findOne(item.rewardCategoryId).subscribe(res => {
        if (res.data != null) {
          this.router.navigate(['/reward/reward-category/edit/', item.rewardCategoryId]);
        } else {
          this.processSearch();
          return;
        }
      });
    } else {
      this.router.navigate(['/reward/reward-category/add']);
    }
  }

  public processView(item) {
    this.rewardCategoryService.findOne(item.rewardCategoryId)
      .subscribe(res => {
        if (res.data != null) {
          this.router.navigate(['/reward/reward-category/view/', item.rewardCategoryId]);
        } else {
          this.processSearch();
          return;
        }
      });
  }

  public processDelete(item) {
    if (item && item.rewardCategoryId > 0) {
      this.rewardCategoryService.findOne(item.rewardCategoryId)
        .subscribe(res => {
          if (res.data != null) {
            this.app.confirmDelete(null, () => { // accept
              this.rewardCategoryService.deleteById(item.rewardCategoryId)
                .subscribe(res => {
                  if (this.rewardCategoryService.requestIsSuccess(res)) {
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

  /**
   * export
   */
  public processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.rewardCategoryService.exportRewardCategory(params).subscribe(res => {
      saveAs(res, 'danh_muc_khen_thuong.xlsx');
    });
  }

}
