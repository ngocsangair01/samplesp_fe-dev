import { APP_CONSTANTS, DEFAULT_MODAL_OPTIONS, LARGE_MODAL_OPTIONS } from '@app/core';
import { Component, OnInit, NgModuleFactoryLoader } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { FormGroup } from '@angular/forms';
import { AssessmentPartyOrganizationService } from '@app/core/services/assessment-party-organization/assessment-party-organization.service';
import { AssessmentPartyOrganizationImportComponent } from '../assessment-party-organization-import/assessment-party-organization-import.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssessmentPeriodService } from '@app/core/services/assessmentPeriod/assessment-period.service';
import { SignDocumentService } from '@app/core/services/sign-document/sign-document.service';
import { AppComponent } from '@app/app.component';
import { VofficeSigningPreviewModalComponent } from '@app/modules/voffice-signing/preview-modal/voffice-signing-preview-modal.component';
import { AssessmentPartyOrganizationSignFileComponent } from "./../assessment-party-organization-sign-file/assessment-party-organization-sign-file.component";
import { AssessmentReportService } from '@app/core/services/assessment-party-organization/assessment-report.service';
import { AssessmentRequestAgainComponent } from '../assessment-request-again/assessment-request-again.component';

@Component({
  selector: 'assessment-party-organization-search',
  templateUrl: './assessment-party-organization-search.component.html',
  styleUrls: ['./assessment-party-organization-search.component.css']
})
export class AssessmentPartyOrganizationSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  formConfig = {
    symbol: [null],
    extractingContent: [null],
    partyOrganizationId: [null],
    assessmentPeriodId: [null],
    assessmentOrder: [null],
    status: [''],
    statusDoc: [''],
    isSymbol: [false],
    isExtractingContent: [false],
    isPartyOrganizationId: [false],
    isAssessmentPeriodId: [false],
    isAssessmentOrder: [false],
    isStatus: [false],
    isStatusDoc: [false]
  };
  statusDocs = [];
  statusList = [];
  assessmentPeriodList = [];
  assessmentLevelOrderList = [];
  isMobileScreen: boolean = false;
  constructor(
    public assessmentPartyOrganizationService: AssessmentPartyOrganizationService,
    public assessmentPeriodService: AssessmentPeriodService,
    private assessmentReport: AssessmentReportService,
    private modalService: NgbModal,
    private signDocumentService: SignDocumentService,
    private app: AppComponent,
    private router: Router
  ) {
    super(null, CommonUtils.getPermissionCode("resource.assessmentPartyOrganization"));
    this.setMainService(assessmentPartyOrganizationService);
    this.formSearch = this.buildForm({}, this.formConfig);
    this.statusDocs = APP_CONSTANTS.RESOLUTION_MONTH_DOCUMENT_STATUS;
    this.statusList = APP_CONSTANTS.ASSESSMENT_PARTY_ORGANIZATION_STATUS;
    // get periodList da ban hanh
    this.assessmentPeriodService.getAssessmentPeriodListPromulgated()
    .subscribe(res => {
      this.assessmentPeriodList = res;
      this.formSearch.controls['assessmentPeriodId'].setValue(res[0].assessmentPeriodId);
      setTimeout(() => {
        this.handleGetValueForLevelOrder();
      }, 500);
    })
    setTimeout(() => {
      this.processSearch(null);
    }, 1000);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
  }

  get f() {
    return this.formSearch.controls;
  }

  sumUp() {
    this.router.navigate(['/party-organization/assessment-party-organization/sum-up'])
  }

  processImportVotingResult(item) {
    const modalRef = this.modalService.open(AssessmentPartyOrganizationImportComponent, DEFAULT_MODAL_OPTIONS);
    if (item) {
      modalRef.componentInstance.setFormValue(item.assessmentPartyOrganizationId);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.assessmentPartyOrganizationService.requestIsSuccess(result)) {
        this.processSearch();
      }
    });
  }

  /**
   * control show label of status
   * @param status 
   */
  showStatus(status) {
    const objStatus = this.statusList.find(item => item.value == status);
    return objStatus.label;
  }

  /**
   * control show status doc
   * @param signStatus 
   */
  showSignStatusDoc(statusDoc) {
    const objStatusDoc = this.statusDocs.find(item => item.value == statusDoc);
    return objStatusDoc.label;
  }

  handleGetValueForLevelOrder() {
    if (this.formSearch.controls['assessmentPeriodId'].value) {
      // get list for assessment level order
      const form = {
        assessmentPeriodId: this.formSearch.controls['assessmentPeriodId'].value,
        hasSign: 1,
        isFromSearch: true
      }
      this.assessmentPartyOrganizationService.getAssessmentLevelOrderList(form)
      .subscribe(res => {
        if (this.assessmentPartyOrganizationService.requestIsSuccess(res)) {
          this.assessmentLevelOrderList = res.data;
        }
      })
    }
    this.formSearch.controls['assessmentOrder'].setValue('');
    return;
  }

  /**
   * cancel stream sign
   * @param item 
   */
  cancelSign(item) {
    if (item && item.signDocumentId > 0) {
      this.app.confirmMessage('resolutionsMonth.cancelStream', () => { // on accepted
        this.signDocumentService.cancelStream('assessment-party-organization', item.signDocumentId)
          .subscribe(res => {
            if (this.signDocumentService.requestIsSuccess(res)) {
              this.processSearch();
            }
          });
      }, () => {
        // on rejected
      });
    }
  }

  prepareSign(item: any) {
    if (item && item.signDocumentId > 0) {
      this.assessmentReport.makeSignFileAttachmentFile({signDocumentId: item.signDocumentId})
        .subscribe(res => {
          if (this.assessmentReport.requestIsSuccess(res)) {
            this.router.navigate(["/voffice-signing/assessment-party-organization/", item.signDocumentId])
          }
      })
    }
  }

  processViewDetail(item) {
    this.router.navigate(['/party-organization/assessment-party-organization/detail', item.assessmentPartyOrganizationId]);
  }

  /**
  * Action xem file truoc khi trinh ky
  * @param signDocumentId 
  */
  previewBeforeSign(signDocumentId) {
    const modalRef = this.modalService.open(VofficeSigningPreviewModalComponent, LARGE_MODAL_OPTIONS);
    modalRef.componentInstance.id = signDocumentId;
  }

  previewFileSigning(item) {
    if (item && item.assessmentPartyOrganizationId > 0) {
      const modalRef = this.modalService.open(AssessmentPartyOrganizationSignFileComponent, DEFAULT_MODAL_OPTIONS);
      modalRef.componentInstance.assessmentPartyOrganizationId = item.assessmentPartyOrganizationId;
    }
  }

  processExportSumUp(item) {
    const formValue = {
      partyOrganizationId: item.partyOrganizationId,
      assessmentPeriodId: item.assessmentPeriodId,
      assessmentOrder: item.assessmentLevelOrder
    }
    this.assessmentPartyOrganizationService.processExportSumUp(formValue).subscribe(res => {
      saveAs(res, 'Tổng hợp xếp loại Đảng viên.xlsx');
    })
  }

  // #229 start
  processUnDecide(item) {
    const modalRef = this.modalService.open(AssessmentRequestAgainComponent, DEFAULT_MODAL_OPTIONS);
    if (item) {
      modalRef.componentInstance.setFormValue(item);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.assessmentPartyOrganizationService.requestIsSuccess(result)) {
        this.processSearch();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }
  // #229 end

  updateVoffice(item) {
      this.signDocumentService.updateVoffice(item.transCode).subscribe(res => {
        this.app.successMessage('voffice.success');
        this.processSearch();
      });
    }
}
