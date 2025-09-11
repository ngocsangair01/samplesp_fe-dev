import { APP_CONSTANTS, DEFAULT_MODAL_OPTIONS, LARGE_MODAL_OPTIONS } from '@app/core';
import { Component, OnInit, NgModuleFactoryLoader } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssessmentPeriodService } from '@app/core/services/assessmentPeriod/assessment-period.service';
import { SignDocumentService } from '@app/core/services/sign-document/sign-document.service';
import { AppComponent } from '@app/app.component';
import { VofficeSigningPreviewModalComponent } from '@app/modules/voffice-signing/preview-modal/voffice-signing-preview-modal.component';
import { AssessmentPartySignerSignFileComponent } from "../assessment-party-signer-sign-file/assessment-party-signer-sign-file.component";
import { AssessmentReportService } from '@app/core/services/assessment-party-organization/assessment-report.service';
import { AssessmentPartySignerImportComponent } from '../assessment-party-signer-import/assessment-party-signer-import.component';
import { AssessmentPartySignerService } from '@app/core/services/assessment-party-signer/assessment-party-signer.service';
import { ApprovalHistoryModalComponent } from '@app/shared/components/approval-history/approval-history.component';

@Component({
  selector: 'assessment-party-signer-search',
  templateUrl: './assessment-party-signer-search.component.html',
  styleUrls: ['./assessment-party-signer-search.component.css']
})
export class AssessmentPartySignerSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  formConfig = {
    symbol: [null],
    extractingContent: [null],
    partyOrganizationId: [null],
    assessmentPeriodId: [null],
    assessmentLevel: [null],
    status: [''],
    statusDoc: ['']
    ,isSymbol: [false],
    isExtractingContent: [false],
    isPartyOrganizationId: [false],
    isAssessmentPeriodId: [false],
    isAssessmentLevel: [false],
    isStatus: [false],
    isStatusDoc: [false]
  };
  statusDocs = [];
  statusList = [];
  assessmentPeriodList = [];
  assessmentLevelOrderList = [];
  constructor(
    public assessmentPartySignerService: AssessmentPartySignerService,
    public assessmentPeriodService: AssessmentPeriodService,
    private assessmentReport: AssessmentReportService,
    private modalService: NgbModal,
    private signDocumentService: SignDocumentService,
    private app: AppComponent,
    private router: Router
  ) {
    super(null, CommonUtils.getPermissionCode("resource.assessmentLevelPartyOrganization"));
    this.setMainService(assessmentPartySignerService);
    this.formSearch = this.buildForm({}, this.formConfig);
    this.statusDocs = APP_CONSTANTS.RESOLUTION_MONTH_DOCUMENT_STATUS;
    this.statusList = APP_CONSTANTS.ASSESSMENT_PARTY_ORGANIZATION_STATUS;
    // get periodList da ban hanh
    this.assessmentPeriodService.getAssessmentPeriodListPromulgated().subscribe(res => {
      this.assessmentPeriodList = res;
      this.formSearch.controls['assessmentPeriodId'].setValue(res[0].assessmentPeriodId);
      setTimeout(() => {
        this.handleGetValueForLevelOrder();
      }, 500);
    })
    setTimeout(() => {
      this.processSearch(null);
    }, 1000);
  }

  ngOnInit() {
  }

  get f() {
    return this.formSearch.controls;
  }

  sumUp() {
    this.router.navigate(['/party-organization/assessment-party-signer/sum-up'])
  }

/**
   * cancel stream sign
   * @param item 
   */
 cancelSign(item) {
  if (item && item.signDocumentId > 0) {
    this.app.confirmMessage('resolutionsMonth.cancelStream', () => { // on accepted
      this.signDocumentService.cancelStream('assessment-party-signer', item.signDocumentId)
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


  processViewDetail(item) {
    this.router.navigate(['/party-organization/assessment-party-signer/detail', item.assessmentPartySignerId]);
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
    if (item && item.assessmentPartySignerId > 0) {
      const modalRef = this.modalService.open(AssessmentPartySignerSignFileComponent, DEFAULT_MODAL_OPTIONS);
      modalRef.componentInstance.assessmentPartySignerId = item.assessmentPartySignerId;
    }
  }

  processImportVotingResult(item) {
    const modalRef = this.modalService.open(AssessmentPartySignerImportComponent, DEFAULT_MODAL_OPTIONS);
    if (item) {
      modalRef.componentInstance.setFormValue(item.assessmentPartySignerId);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.assessmentPartySignerService.requestIsSuccess(result)) {
        this.processSearch();
      }
    });
  }

  processExportSumUp(item) {
    const formValue = {
      assessmentPartySignerId: item.assessmentPartySignerId
    }
    this.assessmentPartySignerService.processExportSumUp(formValue).subscribe(res => {
      saveAs(res, 'Tổng hợp xếp loại Đảng viên.xlsx');
    })
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

  /**
   * Trinh ky
   * @param signStatus 
   */
  prepareSign(item: any) {
    if (item && item.signDocumentId > 0) {
      this.assessmentReport.makeSignerFileAttachmentFile({signDocumentId: item.signDocumentId})
        .subscribe(res => {
          if (this.assessmentReport.requestIsSuccess(res)) {
            this.router.navigate(["/voffice-signing/assessment-party-signer/", item.signDocumentId])
          }
      })
    }
  }

  handleGetValueForLevelOrder() {
    if (this.formSearch.controls['assessmentPeriodId'].value) {
      const form = {
        assessmentPeriodId: this.formSearch.controls['assessmentPeriodId'].value,
        hasSign: 1,
        isFromSearch: true
      }
      this.assessmentPartySignerService.getAssessmentLevelOrderList(form)
      .subscribe(res => {
        if (this.assessmentPartySignerService.requestIsSuccess(res)) {
          this.assessmentLevelOrderList = res.data;
        }
      })
    }
    this.formSearch.controls['assessmentLevel'].setValue('');
    return;
  }

  public actionShowHistory(item) {
    if (item.signDocumentId == null || item.statusDoc == 0) {
      return;
    }
    const modalRef = this.modalService.open(ApprovalHistoryModalComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance.signDocumentId = item.signDocumentId;
  }

  // public syncSign(item:any) {
  //   this.signDocumentService.syncSign(item.transCode).subscribe(res => {
  //     this.app.successMessage('voffice.success');
  //     this.processSearch();
  //   })
  // }
}
