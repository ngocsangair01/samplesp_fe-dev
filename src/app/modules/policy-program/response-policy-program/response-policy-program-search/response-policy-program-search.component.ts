import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, DEFAULT_MODAL_OPTIONS, LARGE_MODAL_OPTIONS } from '@app/core';
import { SignDocumentService } from '@app/core/services/sign-document/sign-document.service';
import { VofficeSigningPreviewModalComponent } from '@app/modules/voffice-signing/preview-modal/voffice-signing-preview-modal.component';
import { ApprovalHistoryModalComponent } from '@app/shared/components/approval-history/approval-history.component';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { ValidationService } from '@app/shared/services/validation.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslationService } from 'angular-l10n';
import { ResponsePolicyProgramService } from './../../../../core/services/policy-program/response-policy-program.service';

@Component({
  selector: 'response-policy-program-search',
  templateUrl: './response-policy-program-search.component.html',
})
export class ResponsePolicyProgramSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  signDocumentId: any;
  formConfig = {
    requestName: ['', [ValidationService.maxLength(200)]],
    requestFromDate: [''],
    requestToDate: [''],
    finishFromDate: [''],
    finishToDate: [''],
    organizationName: ['', [ValidationService.maxLength(200)]],
    organizationId: [''],
    status: [''],
    documentCode: [null],
    startDate: [null],
    endDate: [null]
  };

  constructor(
    public translation: TranslationService,
    private responsePolicyProgramService: ResponsePolicyProgramService,
    private app: AppComponent,
    private router: Router,
    private modalService: NgbModal,
    private signDocumentService: SignDocumentService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.requestPolicyProgram"));
    this.setMainService(responsePolicyProgramService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('requestFromDate', 'requestToDate', 'app.responseResolutionMonth.requestDateToDate'),
      ValidationService.notAffter('finishFromDate', 'finishToDate', 'app.responseResolutionMonth.finishDateToDate')]);
      this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW, [
        ValidationService.notAffter('startDate', 'endDate', 'organizationcontroller.table.to.date')]);
    this.processSearch();
  }

  ngOnInit() {

  }

  get f() {
    return this.formSearch.controls;
  }


  public prepareSaveOrUpdate(item?: any) {
    // if (item && item.democraticMeetingId > 0) {
    //   this.router.navigate(['/population/democratic-meeting-edit/', item.democraticMeetingId]);
    // } 
  }

  public prepareView(item) {
    // this.router.navigate(['/population/democratic-meeting-view/', item.democraticMeetingId,'view']);
  }

  processDelete(item) {
    // if (item && item.documentId > 0) {
    //   this.app.confirmDelete(null, () => {// on accepted
    //     this.democraticMeetingService.deleteById(item.documentId)
    //       .subscribe(res => {
    //         if (this.democraticMeetingService.requestIsSuccess(res)) {
    //           this.processSearch(null);
    //         }
    //       });
    //   }, () => {// on rejected

    //   });
    // }
  }

  prepareSign(item) {
    if (item && item.signDocumentId > 0) {
      this.router.navigate(['/sign-manager/response-policy-program/', item.signDocumentId]);
    }
  }

  /**
   * Xuat excel Grid
   */
  export() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.responsePolicyProgramService.export(params).subscribe(res => {
      saveAs(res, 'Danh_sach_thuc_hien_chuong_trinh_chinh_sach.xlsx');
    })
  }

  /**
   * Xu ly download file trong danh sach
   */
  // public downloadFile(fileData) {
  //   this.fileStorage.downloadFile(fileData.id).subscribe(res => {
  //       saveAs(res , fileData.fileName);
  //   });
  // }

  // public onChangeStatus(event) {
  //   const value = event;
  //   if (value === null) {
  //     this.isMeeting = '';
  //     this.formSearch['isMeeting'] = null;
  //   } else if (value === true) {
  //     this.formSearch['isMeeting'] = 1;
  //     this.isMeeting = this.translation.translate('democraticmeeting.label.hasMet');
  //   } else if (value === false) {
  //     this.formSearch['isMeeting'] = 0;
  //     this.isMeeting = this.translation.translate('democraticmeeting.label.meetingnotyet');
  //   }
  // }

  prepareExport(item: any) {
    // this.democraticMeetingService.exportDocument(item.democraticMeetingId).subscribe(
    //   res => {
    //     saveAs(res, 'ctct_bien_ban_hop_dan_chu.doc');
    //   }
    // )
  }

  import(item) {
    this.router.navigate(['policy-program/import-response-policy-program/', item.responsePolicyProgramId]);
  }

  /**
   * Action xem file trước khi trình ký
   * @param signDocumentId 
   */
   previewFileSigning(signDocumentId) {
    const modalRef = this.modalService.open(VofficeSigningPreviewModalComponent, LARGE_MODAL_OPTIONS);
    modalRef.componentInstance.id = signDocumentId;
  }

  cancelSignPolicyProgram(item: any) {
    this.app.confirmMessage('resolutionsMonth.cancelStream',
    () => {
      this.signDocumentService.cancelTransaction('response-policy-program',item.signDocumentId)
        .subscribe(res => {
          this.app.successMessage('cancelSign.success');
          this.processSearch();
        })
    }, () => {
       // on rejected
     });
  }

  public actionShowHistory(item) {
    if (item.signDocumentId == null || item.status == 0) {
      return;
    }
    const modalRef = this.modalService.open(ApprovalHistoryModalComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance.signDocumentId = item.signDocumentId;
  }
}