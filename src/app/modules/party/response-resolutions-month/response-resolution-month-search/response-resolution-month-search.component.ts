import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS, LARGE_MODAL_OPTIONS, MEDIUM_MODAL_OPTIONS} from '@app/core';
import { AppComponent } from '@app/app.component';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { ResponseResolutionMonthService } from '@app/core/services/party-organization/response-resolution-month.service';
import { SignDocumentService } from '@app/core/services/sign-document/sign-document.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResponseResolutionMonthListFileComponent } from '../response-resolution-month-list-file/response-resolution-month-list-file.component';
import { VofficeSigningPreviewModalComponent } from '@app/modules/voffice-signing/preview-modal/voffice-signing-preview-modal.component';
import { ApprovalHistoryModalComponent } from '@app/shared/components/approval-history/approval-history.component';
import {
  ThoroughResolutionMonthFormComponent
} from "@app/modules/party/response-resolutions-month/thorough-resolution-month-form/thorough-resolution-month-form.component";
import {
  ThoroughResolutionMonthSearchComponent
} from "@app/modules/party/response-resolutions-month/thorough-resolution-month-search/thorough-resolution-month-search.component";
import {
  ThoroughResolutionMonthContentComponent
} from "@app/modules/party/response-resolutions-month/thorough-resolution-month-content/thorough-resolution-month-content.component";

@Component({
  selector: 'response-resolution-month-search',
  templateUrl: './response-resolution-month-search.component.html',
  styleUrls: ['./response-resolution-month-search.component.css']
})
export class ResponseResolutionMonthSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  statusList;
  conditionPartyMember: string;
  isMobileScreen: boolean = false;
  formConfig = {
    partyOrganizationId: [''],
    status: ['-1'],
    documentStatus: ['-1'],
    textSymbols: [null, [Validators.maxLength(50)]],
    numberOfSymbols: [null, [Validators.maxLength(50)]],
    extractingTextContent: [null, [Validators.maxLength(200)]],
    reqName: [null, [Validators.maxLength(200)]],
    implementDateFromDate: [null],
    implementDateToDate: [null],
    employeeId: [null],
    partyOrganizationName: [null],
    documentCode: [null],
    startDate: [null],
    endDate: [null],
    isTextSymbols: [false],
    isExtractingTextContent: [false],
    isReqName: [false],
    isDocumentCode: [false],
    isEmployeeId: [false],
    isPartyOrganizationId: [false],
    isStatus: [false],
    isDocumentStatus: [false],
    isImplementDateFromDate: [false],
    isImplementDateToDate: [false],
    isStartDate: [false],
    isEndDate: [false]
  };
  constructor(
    private responseResolutionMonthService: ResponseResolutionMonthService,
    private router: Router,
    private fileStorage: FileStorageService,
    private modalService: NgbModal,
    private signDocumentService: SignDocumentService,
    private app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode("resource.requestResolutionMonth"));
    this.setMainService(responseResolutionMonthService)
    this.statusList = APP_CONSTANTS.RESOLUTION_MONTH_STATUS;
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW
      , [
        , ValidationService.notAffter('implementDateFromDate', 'implementDateToDate', 'app.responseResolutionMonth.implementDateRule')]);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
          [ValidationService.notAffter('startDate', 'endDate', 'organizationcontroller.table.to.date')]);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    this.processSearch();
  }
  public processSearch(event?): void {
    const RESOLUTION_MONTH_STATUS = [
      { value: 0, lable: "Chưa yêu cầu" },
      { value: 1, lable: "Không thực hiện" },
      { value: 2, lable: "Ban hành quá hạn" },
      { value: 3, lable: "Ban hành đúng hạn" },
      { value: 4, lable: "Ban hành bổ sung" },
    ];
    const RESOLUTION_MONTH_DOCUMENT_STATUS = [
      { value: 0, lable: "Dự thảo" },
      { value: 1, lable: "Đang trình ký" },
      { value: 2, lable: "Đã hủy luồng" },
      { value: 3, lable: "Đã phê duyệt" },
      { value: 4, lable: "Đã từ chối" },
      { value: 5, lable: "Đã ban hành" },
    ];
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const params = this.formSearch ? this.formSearch.value : null;
    const newDate = new Date();
    newDate.setHours(0);
    newDate.setMinutes(0);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0)
    this.responseResolutionMonthService.search(params, event).subscribe(res => {
      this.resultList = res;
      for (const item of this.resultList.data) {
        if (item.status) {
          if (item.status == 1 && item.finishDate != null && item.finishDate > newDate) {
            const diff = new Date(item.finishDate - newDate.getTime());
            item.statusName = RESOLUTION_MONTH_STATUS[item.status].lable + " (Còn " + (diff.getUTCDate()).toString() + " ngày)";
          } else {
            item.statusName = RESOLUTION_MONTH_STATUS[item.status].lable;
          }
        }
        if (item.documentStatus != null) {
          item.documentStatusName = RESOLUTION_MONTH_DOCUMENT_STATUS[item.documentStatus].lable;
          if (item.documentStatus == 5) {
            if (item.promulgateDate){
              item.documentStatusName = item.documentStatusName + " (" + moment(new Date(item.promulgateDate)).format('DD/MM/YYYY') + ")";
            }
          } else if (item.updatedDate) {
            item.documentStatusName = item.documentStatusName + " (" + moment(new Date(item.updatedDate)).format('DD/MM/YYYY') + ")";
          }
        }
        if (item.massOrganizationEmployee) {
          const i = item.massOrganizationEmployee.indexOf('@');
          item.massOrganizationEmployee = item.massOrganizationEmployee.substr(0, i) + ')';
        }
        const finishDate= new Date(item.finishDate);
        // item.hiddenButtonEdit = (finishDate < newDate) && (item.status == 1 || item.status == 4) && (item.documentStatus != 1 || item.documentStatus == null);
      }
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }
  get f() {
    return this.formSearch.controls;
  }

  prepareView(item) {
    if (item && item.responseResolutionsMonthId > 0) {
      this.router.navigate(['/party-organization/response-resolutions-month/', item.responseResolutionsMonthId]);
    }
  }

  prepareSaveOrUpdate(item) {
    if (item && item.responseResolutionsMonthId > 0) {
      this.router.navigate(['/party-organization/response-resolutions-month/', item.responseResolutionsMonthId, 'edit'])
    }
  }

  public downloadFile(fileData) {
    this.fileStorage.downloadFile(fileData.secretId).subscribe(res => {
      saveAs(res, fileData.fileName);
    });
  }

  prepareSign(item) {
    if (item && item.signDocumentId > 0) {
      this.router.navigate(['/voffice-signing/resolution-month/', item.signDocumentId]);
    }
  }

  prepareViewFile(item) {
    if (item && item.responseResolutionsMonthId > 0) {
      const modalRef = this.modalService.open(ResponseResolutionMonthListFileComponent, DEFAULT_MODAL_OPTIONS);
      modalRef.componentInstance.responseResolutionsMonthId = item.responseResolutionsMonthId;
    }
  }
  cancelStream(item) {
    if (item && item.signDocumentId > 0) {
      this.app.confirmMessage('resolutionsMonth.cancelStream', () => { // on accepted
        this.signDocumentService.cancelStream('resolution-month', item.signDocumentId)
          .subscribe(res => {
            this.processSearch();
          });
      }, () => {
        // on rejected

      });
    }
  }

   /**
   * Action xem lịch sử trình ký
   * @param item 
   * @returns 
   */
    actionShowHistorySigning(item) {
      if (item.signDocumentId == null || item.documentStatus == 0 || item.isSignOutVoffice == 1) {  
        return;
      }     
      const modalRef = this.modalService.open(ApprovalHistoryModalComponent, DEFAULT_MODAL_OPTIONS); 
      modalRef.componentInstance.signDocumentId = item.signDocumentId;
    }

  /**
   * Action xem file trước khi trình ký
   * @param signDocumentId 
   */
  previewFileSigning(signDocumentId) {
    const modalRef = this.modalService.open(VofficeSigningPreviewModalComponent, LARGE_MODAL_OPTIONS);
    modalRef.componentInstance.id = signDocumentId;
  }

  thoroughResolution(item){
    const  modalRef = this.modalService.open(ThoroughResolutionMonthFormComponent, DEFAULT_MODAL_OPTIONS);

    if(item){
      modalRef.componentInstance.responseResolutionsMonthId = item.responseResolutionsMonthId;
    }

    modalRef.result.then((item) => {
      if (!item) {
        return;
      }

    });
  }

  thoroughResolutionSearch(item){
    const  modalRef = this.modalService.open(ThoroughResolutionMonthSearchComponent, DEFAULT_MODAL_OPTIONS);

    if(item){
      modalRef.componentInstance.responseResolutionsMonthId = item.responseResolutionsMonthId;
    }

    modalRef.result.then((item) => {
      if (!item) {
        return;
      }

    });
  }

  saveContent(item){
    const  modalRef = this.modalService.open(ThoroughResolutionMonthContentComponent, DEFAULT_MODAL_OPTIONS);

    if(item){
      modalRef.componentInstance.responseResolutionsMonthId = item.responseResolutionsMonthId;
    }

    modalRef.result.then((item) => {
      if (!item) {
        return;
      }

    });
  }

  /**
   * Action Đồng bộ VO
   * @param item 
   */
   syncSign(item: any) {
    this.signDocumentService.syncSign(item.transCode)
      .subscribe(res => {
        this.app.successMessage('voffice.success');
      this.processSearch();
    })
  }
}
