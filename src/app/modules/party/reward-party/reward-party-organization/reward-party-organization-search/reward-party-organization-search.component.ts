import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS } from '@app/core/app-config';
import { RewardPartyOrganizationService } from '@app/core/services/party-organization/reward-party-organization.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RewardPartyOrganizationViewComponent } from '../reward-party-organization-view/reward-party-organization-view.component';

@Component({
  selector: 'reward-party-organization-search',
  templateUrl: './reward-party-organization-search.component.html',
  styleUrls: ['./reward-party-organization-search.component.css']
})
export class RewardPartyOrganizationSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  formConfig = {
    partyOrganizationId: [''],
    year: [''],
    importDate: [''],
    importToDate: [''],
    isPartyOrganizationId: [false],
    isYear: [false],
    isImportDate: [false],
    isImportToDate: [false]
  };
  public listYear: any;
  public listQualityRating: any;
  isMobileScreen: boolean = false;

  constructor(
    private rewardPartyOrganizationService: RewardPartyOrganizationService,
    private categoryService: CategoryService,
    private modalService: NgbModal,
    private router: Router,
    private app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode("resource.rewardParty"));
    this.setMainService(rewardPartyOrganizationService);
    this.listYear = this.getYearList();
    this.buildForms({});
    this.processSearch();
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.QUALITY_RATING_PARTY_ORG).subscribe(res => {
      this.listQualityRating = res.data;
    })
  }

  public buildForms(data?: any) {
    this.formSearch = this.buildForm(data, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('importDate', 'importToDate', 'common.label.toDate')]);
  }

  get f() {
    return this.formSearch.controls;
  }

  private getYearList() {
    this.listYear = [];
    const currentYear = new Date().getFullYear();
    for (let i = (currentYear - 50); i <= (currentYear + 10); i++) {
      const obj = {
        year: i
      };
      this.listYear.push(obj);
    }
    return this.listYear;
  }

  /**
   * Import
   */
  public import() {
    this.router.navigate(['/party-organization/reward-party-organization-import']);
  }

  /**
   * Export
   */
  public processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const formData = Object.assign({}, this.formSearch.value);
    const params = CommonUtils.buildParams(CommonUtils.convertData(formData));
    this.rewardPartyOrganizationService.exportImportRewardPartyOrg(params).subscribe(res => {
      saveAs(res, 'Danh_sach_khen_thuong_to_chuc_dang.xlsx');
    });
  }

  /**
   * Trinh ky
   * @param item 
   */
  prepareSign(item) {
    if (item && item.signDocumentId > 0) {
      this.router.navigate(['/sign-manager/import-reward-party-org/', item.signDocumentId]);
    }
  }

  processDelete(item) {
    if (item && item.importRewardPartyOrgId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.rewardPartyOrganizationService.deleteById(item.importRewardPartyOrgId)
          .subscribe(res => {
            if (this.rewardPartyOrganizationService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      }, () => {// on rejected
      });
    }
  }

  public prepareView(item) {
    let importRewardPartyOrgId = item.importRewardPartyOrgId;
    if (importRewardPartyOrgId > 0) {
      this.rewardPartyOrganizationService.findOne(importRewardPartyOrgId).subscribe(res => {
        if (this.rewardPartyOrganizationService.requestIsSuccess(res)) {
          this.activeModelView(importRewardPartyOrgId);
        }
      });
    }
  }

  private activeModelView(importRewardPartyOrgId) {
    const modalRef = this.modalService.open(RewardPartyOrganizationViewComponent, DEFAULT_MODAL_OPTIONS);

    if (importRewardPartyOrgId > 0) {
      modalRef.componentInstance.importRewardPartyOrgId = importRewardPartyOrgId;
    }

    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.rewardPartyOrganizationService.requestIsSuccess(result)) {
        this.processSearch();
      }
    });
  }
}
