import { Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ValidationService } from '@app/shared/services/validation.service';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { TranslationService } from 'angular-l10n';
import { DemocraticMeetingService } from '@app/core/services/population/democratic-meeting.service';
import { ACTION_FORM, DEFAULT_MODAL_OPTIONS, LARGE_MODAL_OPTIONS } from '@app/core';
import { CommonUtils } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VofficeSigningPreviewModalComponent } from '@app/modules/voffice-signing/preview-modal/voffice-signing-preview-modal.component';
import { SignDocumentService } from '@app/core/services/sign-document/sign-document.service';
import { ApprovalHistoryModalComponent } from '@app/shared/components/approval-history/approval-history.component';

@Component({
  selector: 'democratic-meeting-search',
  templateUrl: './democratic-meeting-search.component.html',
  styleUrls: ['./democratic-meeting-search.component.css']
})
export class DemocraticMeetingSearchComponent extends BaseComponent implements OnInit {
  isMeeting: any;
  formConfig = {
    isMeeting: [null],
    documentNumber: ['', [Validators.maxLength(100)]],
    name: ['', [Validators.maxLength(200)]],
    effectiveDate: [''],
    expritedDate: [''],
    requestDemocraticMeetingName: [''],
    documentCode: [null],
    startDate: [null],
    endDate: [null],
    isShowMeeting: [false],
    isDocumentNumber: [false],
    isName: [false],
    isEffectiveDate: [false],
    isExpritedDate: [false],
    isRequestDemocraticMeetingName: [false],
    isDocumentCode: [false],
    isStartDate: [false],
    isEndDate: [false]
  };

  constructor(
    public translation: TranslationService,
    private democraticMeetingService: DemocraticMeetingService,
    private router: Router,
    private app: AppComponent,
    private fileStorage: FileStorageService,
    private modalService: NgbModal,
    private signDocumentService: SignDocumentService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.requestDemocraticMeeting"));
    this.setMainService(democraticMeetingService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('effectiveDate', 'expritedDate', 'document.label.toDate')]);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('startDate', 'endDate', 'document.label.toDate')]);
    this.processSearch();
  }

  ngOnInit() {

  }

  get f() {
    return this.formSearch.controls;
  }

  public prepareSaveOrUpdate(item?: any) {
    if (item && item.democraticMeetingId > 0) {
      this.router.navigate(['/population/democratic-meeting-edit/', item.democraticMeetingId]);
    }
  }

  public prepareView(item) {
    this.router.navigate(['/population/democratic-meeting-view/', item.democraticMeetingId, 'view']);
  }

  processDelete(item) {
    if (item && item.documentId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.democraticMeetingService.deleteById(item.documentId)
          .subscribe(res => {
            if (this.democraticMeetingService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      }, () => {// on rejected

      });
    }
  }

  prepareSign(item) {
    if (item && item.signDocumentId > 0) {
      this.router.navigate(['/sign-manager/democratic-meeting/', item.signDocumentId]);
    }
  }

  /**
   * Xuat excel Grid
   */
  export() {
    if (this.formSearch.get('isMeeting').value == 'null') {
      this.formSearch.get('isMeeting').setValue(null);
    }
    if (this.formSearch.get('isMeeting').value) {
      this.formSearch.get('isMeeting').setValue(1);

    } else if (this.formSearch.get('isMeeting').value == false) {
      this.formSearch.get('isMeeting').setValue(0);
    }
    const reqData = this.formSearch.value;
    this.app.isProcessing(true);
    this.democraticMeetingService.export(reqData)
      .subscribe((res) => {
        this.app.isProcessing(false);
        saveAs(res, 'quan_ly_hop_dan_chu.xls');
      });
  }

  /**
   * Xu ly download file trong danh sach
   */
  public downloadFile(fileData) {
    this.fileStorage.downloadFile(fileData.secretId).subscribe(res => {
      saveAs(res, fileData.fileName);
    });
  }

  public onChangeStatus(event) {
    const value = event;
    if (value === null) {
      this.isMeeting = '';
      this.formSearch['isMeeting'] = null;
    } else if (value === true) {
      this.formSearch['isMeeting'] = 1;
      this.isMeeting = this.translation.translate('democraticmeeting.label.hasMet');
    } else if (value === false) {
      this.formSearch['isMeeting'] = 0;
      this.isMeeting = this.translation.translate('democraticmeeting.label.meetingnotyet');
    }
  }

  prepareExport(item: any) {
    this.democraticMeetingService.exportDocument(item.democraticMeetingId).subscribe(
      res => {
        saveAs(res, 'ctct_bien_ban_hop_dan_chu.doc');
      }
    )
  }

  /**
   * Action xem file trước khi trình ký
   * @param signDocumentId 
   */
   previewFileSigning(signDocumentId) {
    const modalRef = this.modalService.open(VofficeSigningPreviewModalComponent, LARGE_MODAL_OPTIONS);
    modalRef.componentInstance.id = signDocumentId;
  }

  /**
   * Action hủy trình ký
   * @param signDocumentId
   */
   cancelSignDemocraticMeeting(rowData: any) {
    this.app.confirmMessage('resolutionsMonth.cancelStream',
      () => {
        this.signDocumentService.cancelTransaction('democratic-meeting', rowData.signDocumentId)
          .subscribe(res => {
            this.app.successMessage('cancelSign.success');
            this.processSearch();
        });
      }, () => {
        // on rejected
      });
  }

  /**
   * Action xem lịch sử trình ký
   * @param item 
   * @returns 
   */
   actionShowHistorySigning(item) {  
    if (item.signDocumentId == null) {
      return;
    }else {
      const modalRef = this.modalService.open(ApprovalHistoryModalComponent, DEFAULT_MODAL_OPTIONS);
      modalRef.componentInstance.signDocumentId = item.signDocumentId;
    }

  }
}
