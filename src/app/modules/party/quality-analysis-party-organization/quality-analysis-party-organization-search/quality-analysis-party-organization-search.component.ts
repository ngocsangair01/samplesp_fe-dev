import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS } from '@app/core/app-config';
import { QualityAnalysisPartyOrgService } from '@app/core/services/party-organization/quality-analysis-party-org.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QualityAnalysisPartyOrganizationViewComponent } from '../quality-analysis-party-organization-view/quality-analysis-party-organization-view.component';

@Component({
  selector: 'quality-analysis-party-organization-search',
  templateUrl: './quality-analysis-party-organization-search.component.html',
  styleUrls: ['./quality-analysis-party-organization-search.component.css']
})
export class QualityAnalysisPartyOrganizationSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  formConfig = {
    partyOrganizationId: [''],
    year: [''],
    importDate: [''],
    importToDate: [''],
    isPartyOrganizationId: [false],
    isYear: [false],
    isImportDate: [false],
    isImportToDate: [false],
  };
  public listYear: any;
  public listQualityRating: any;
  isMobileScreen: boolean = false;

  constructor(
    private qualityAnalysisPartyOrgService: QualityAnalysisPartyOrgService,
    private categoryService: CategoryService,
    private modalService: NgbModal,
    private router: Router,
    private app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode("resource.qualityAnalysisParty"));
    this.setMainService(qualityAnalysisPartyOrgService);
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
      [ValidationService.notAffter('importDate', 'importToDate', 'common.label.effectiveDateTo')]);
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
    this.router.navigate(['/party-organization/quality-analysis-party-organization-import']);
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
    this.qualityAnalysisPartyOrgService.exportImportQualityAnalysisPartyOrganization(params).subscribe(res => {
      saveAs(res, 'Danh_sach_chat_luong_to_chuc_dang.xlsx');
    });
  }

  /**
   * Trinh ky
   * @param item 
   */
  prepareSign(item) {
    if (item && item.signDocumentId > 0) {
      this.router.navigate(['/sign-manager/import-quality-analysis-party-org/', item.signDocumentId]);
    }
  }

  processDelete(item) {
    if (item && item.importQualityAnalysisPartyOrgId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.qualityAnalysisPartyOrgService.deleteById(item.importQualityAnalysisPartyOrgId)
          .subscribe(res => {
            if (this.qualityAnalysisPartyOrgService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      }, () => {// on rejected
      });
    }
  }

  public prepareView(item) {
    let importQualityAnalysisPartyOrgId = item.importQualityAnalysisPartyOrgId;
    if (importQualityAnalysisPartyOrgId > 0) {
      this.qualityAnalysisPartyOrgService.findOne(importQualityAnalysisPartyOrgId).subscribe(res => {
        if (this.qualityAnalysisPartyOrgService.requestIsSuccess(res)) {
          this.activeModelView(importQualityAnalysisPartyOrgId);
        }
      });
    }
  }

  private activeModelView(importQualityAnalysisPartyOrgId) {
    const modalRef = this.modalService.open(QualityAnalysisPartyOrganizationViewComponent, DEFAULT_MODAL_OPTIONS);

    if (importQualityAnalysisPartyOrgId > 0) {
      modalRef.componentInstance.importQualityAnalysisPartyOrgId = importQualityAnalysisPartyOrgId;
    }

    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.qualityAnalysisPartyOrgService.requestIsSuccess(result)) {
        this.processSearch();
      }
    });
  }
}
