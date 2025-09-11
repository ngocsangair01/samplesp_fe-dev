import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS } from '@app/core';
import { QualityAnalysisPartyMemberService } from '@app/core/services/party-organization/quality-analysis-party-member.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QualityAnalysisPartyMemberDetailComponent } from './../quality-analysis-party-member-detail/quality-analysis-party-member-detail.component';

@Component({
  selector: 'quality-analysis-party-member-search',
  templateUrl: './quality-analysis-party-member-search.component.html',
  styleUrls: ['./quality-analysis-party-member-search.component.css']
})
export class QualityAnalysisPartyMemberSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  formConfig = {
    partyOrganizationId: [''],
    importDateFrom: [''],
    importDateTo: [''],
    year: [''],
    documentCode: [null],
    startDate: [null],
    endDate: [null],
    isPartyOrganizationId: [false],
    isImportDateFrom: [false],
    isImportDateTo: [false],
    isYear: [false],
    isDocumentCode: [false],
    isStartDate: [false],
    isEndDate: [false]
  };
  public listYear: any;
  public listQualityRating: any;
  isMobileScreen: boolean = false;

  constructor(
    private qualityAnalysisPartyMemberService: QualityAnalysisPartyMemberService,
    private categoryService: CategoryService,
    private modalService: NgbModal,
    private router: Router) {
    super(null, CommonUtils.getPermissionCode("resource.qualityAnalysisParty"));
    this.setMainService(qualityAnalysisPartyMemberService);
    this.listYear = this.getYearList();
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('importDateFrom', 'importDateTo', 'qualityAnalysisPartyMember.importDateTo')]);
    this.processSearch();
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.QUALITY_RATING_PARTY_MEMBER).subscribe(res => {
      this.listQualityRating = res.data;
    })
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
    this.router.navigate(['/party-organization/quality-analysis-party-member-import']);
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
    this.qualityAnalysisPartyMemberService.exportListImportQualityAnalysisPartyMember(params).subscribe(res => {
      saveAs(res, 'Danh_sach_chat_luong_Dang_vien.xlsx');
    });
  }

  /**
   * Trinh ky
   * @param item 
   */
  prepareSign(item) {
    if (item && item.signDocumentId > 0) {
      this.qualityAnalysisPartyMemberService.findImportQualityAnalysisPartyMemberById(item.importQualityAnalysisPartyMemberId)
        .subscribe(res => {
          if (res.data) {
            this.router.navigate(['/sign-manager/quality-analysis-party-member/', item.signDocumentId]);
          }
        });
    }
  }

  public prepareView(item) {
    if (item && item.importQualityAnalysisPartyMemberId) {
      const modalRef = this.modalService.open(QualityAnalysisPartyMemberDetailComponent, DEFAULT_MODAL_OPTIONS);
      modalRef.componentInstance.importQualityAnalysisPartyMemberId = item.importQualityAnalysisPartyMemberId;
    }
  }
}
