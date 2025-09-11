import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Router } from '@angular/router';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { AppComponent } from '@app/app.component';
import { ReportManagerService } from '@app/core/services/report/report-manager.service';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { ReportDynamicService } from '@app/modules/reports/report-dynamic/report-dynamic.service';
import { RequestReportService } from '@app/core/services/report/request-report.service';
import { SignDocumentService } from '@app/core/services/sign-document/sign-document.service';
import { DialogService } from 'primeng/api';
import { ExportComponent } from '../export/export-dialog.component';
import { SendSMSComponent } from '../send-sms/send-sms.component';
import { RejectFormComponent } from '../reject-form/reject-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { APP_CONSTANTS, LARGE_MODAL_OPTIONS, REPORT_SUBMISSION_STATUS, REPORT_SUBMISSION_TYPE,DEFAULT_MODAL_OPTIONS, ACTION_FORM, MAP_YCBC_OBJECT_TYPE } from '@app/core';
import { ReportPreviewModalComponent } from '../preview-modal/report-preview-modal.component';
import { VofficeSigningPreviewModalComponent } from '@app/modules/voffice-signing/preview-modal/voffice-signing-preview-modal.component';
import { reportContentReview } from './report-content-review/report-content-review';
import { ReportManagerHistoryComponent } from '../report-manager-history/report-manager-history.component';
import { TranslationService } from 'angular-l10n';
import { FormGroup } from '@angular/forms';
import { ValidationService } from '@app/shared/services';
const DA_XET_DUYET = "DA_XET_DUYET"
const BI_TU_CHOI = "BI_TU_CHOI"

@Component({
  selector: 'index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent extends BaseComponent implements OnInit {
  @ViewChild('form') form: any;
  rootId: any;
  partyOrgRootId: any;
  massOrgRootId: any;
  businessTypeOptions;
  isHidden: boolean = false;
  isMasO: boolean = false;
  isPartyO: boolean = false;
  isOrg: boolean = false;
  isLabel: boolean = false;
  branch: any;
  rewardType: any;
  isMobileScreen: boolean = false;
  formConfig = {
    title: [null],
    status: [null],
    statuses: [null],
    reportingPeriod: [null],
    organizationSubmitReport: [null],
    businessType:[null],
    requestOrg: [null],
    documentCode: [null],
    startDate: [null],
    endDate: [null],
    isTitle: [false],
    isStatus: [false],
    isStatuses: [false],
    isReportingPeriod: [false],
    isOrganizationSubmitReport: [false],
    isBusinessType:[false],
    isRequestOrg: [false],
    isDocumentCode: [false],
    isStartDate: [false],
    isEndDate: [false]
  }

  tabeColumnsConfig = [
    {
      header: "common.label.table.action",
      width: "50px"
    },
    {
      header: "common.table.index",
      width: "50px"
    },
    {
      name: "title",
      header: "label.resolutionsMonth.name",
      width: "350px"
    },
    {
      name: "reportingPeriod",
      header: "lable.report.period",
      width: "180px"
    },
    {
      name: "orgSubmission",
      header: "label.org.submitReport",
      width: "200px"
    },
    {
      name: "statusLabel",
      header: "common.label.status",
      width: "150px"
    },
    {
      name: "file",
      header: "label.report.file",
      width: "200px"
    },
    {
      name: "file",
      header: "label.report.fileSigned",
      width: "120px"
    },
    {
      name: "empSubmit",
      header: "label.reportManager.employee",
      width: "140px"
    },
    {
      name: "submittedDate",
      header: "lable.report.sumittedDate",
      width: "100px"
    },
    {
      name: "evaluate",
      header: "transferEmployee.evaluate.evaluate",
      width: "80px"
    },
    {
      name: "businessType",
      header: "label.report.business",
      width: "140px"
    },
    {
      name: "organizationRequest",
      header: "label.organizationReport.requestReport",
      width: "200px"
    }
  ]

  get f() {
    return this.formSearch.controls;
  }

  mapActionTable = {
    KHONG_KY_VO: {
      REQUEST_RESUBMIT: [
        REPORT_SUBMISSION_STATUS.DA_NOP,
      ],
      APPROVE: [],
      SEND_REMINDER_MESSAGE: [
        REPORT_SUBMISSION_STATUS.CHUA_THUC_HIEN,
        REPORT_SUBMISSION_STATUS.DU_THAO,
        REPORT_SUBMISSION_STATUS.DA_NOP,
        REPORT_SUBMISSION_STATUS.BI_TU_CHOI_DUYET,
      ],
    },
    CO_KY_VO_KHONG_DUYET: {
      REQUEST_RESUBMIT: [
        REPORT_SUBMISSION_STATUS.CHUA_TRINH_KY,
      ],
      APPROVE: [],
      SEND_REMINDER_MESSAGE: [
        REPORT_SUBMISSION_STATUS.CHUA_THUC_HIEN,
        REPORT_SUBMISSION_STATUS.DU_THAO,
        REPORT_SUBMISSION_STATUS.CHUA_TRINH_KY,
        REPORT_SUBMISSION_STATUS.BI_TU_CHOI_KY_DUYET,
        REPORT_SUBMISSION_STATUS.BI_TU_CHOI_DUYET,
      ],
    },
    CO_KY_VO_CO_DUYET: {
      REQUEST_RESUBMIT: [
        REPORT_SUBMISSION_STATUS.CHO_XET_DUYET,
        REPORT_SUBMISSION_STATUS.DA_XET_DUYET,
      ],
      APPROVE: [
        REPORT_SUBMISSION_STATUS.CHO_XET_DUYET,
      ],
      SEND_REMINDER_MESSAGE: [
        REPORT_SUBMISSION_STATUS.CHUA_THUC_HIEN,
        REPORT_SUBMISSION_STATUS.DU_THAO,
        REPORT_SUBMISSION_STATUS.CHO_XET_DUYET,
        REPORT_SUBMISSION_STATUS.BI_TU_CHOI_DUYET,
        REPORT_SUBMISSION_STATUS.BI_TU_CHOI_KY_DUYET,
        REPORT_SUBMISSION_STATUS.DA_XET_DUYET,
      ],
    }
  }

  statusOption

  constructor(
    private router: Router,
    private appParamService: AppParamService,
    private service: ReportManagerService,
    private fileStorage: FileStorageService,
    private requestReportService: RequestReportService,
    private signDocumentService: SignDocumentService,
    public dialogService: DialogService,
    private app: AppComponent,
    private modalService: NgbModal,
    private translation: TranslationService,

  ) {
    super();
    this.setMainService(this.service);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    this.formSearch = this.buildForm('', this.formConfig);
    this.getDropDownOptions();
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('startDate', 'endDate', 'organizationcontroller.table.to.date')]);
    this.search()
  }

  getDropDownOptions() {
    this.appParamService.appParams('REPORT_SUBMISSION_STATUS')
    .subscribe(res => {
      this.statusOption = res.data.map(item => {
        return {
          parName: item.parName,
          parCode: item.parCode
        }
      });
    })

    this.requestReportService.getBusinessType()
      .subscribe(res => {
        this.businessTypeOptions = res.data;
        this.handleChangeBusinessType();
      })
  }


  search(event?) {
    this.service.search(this.getParamSearch(), event).subscribe(res => {
      this.resultList = res;
    });
  }

  exportReport() {

    const ref = this.dialogService.open(ExportComponent, {
      header: 'Xuất báo cáo',
      width: '50%',
      baseZIndex: 1000,
      contentStyle: {"padding": "0"},
    });
    ref.onClose.subscribe( (isAdd) => {
      if (isAdd){
        this.search()
      }
    });
    // this.reportDynamicService.export({ code: 'THONG_KE_NOP_BAO_CAO' })
    //   .subscribe(res => {
    //     saveAs(res, "test.xlsx")
    //   })
  }

  openSendSMSDialog(reportSubmission){
    const ref = this.dialogService.open(SendSMSComponent, {
      header: 'Gửi tin nhắn nhắc nhở',
      width: '50%',
      baseZIndex: 1500,
      contentStyle: {"padding": "0"},
      data: reportSubmission
    });
  }

  getParamSearch() {
    let param = { ...this.formSearch.value };
    if(param.statuses && param.statuses.length > 0){
      param.statuses = param.statuses.join(',');
    }else {
      param.statuses = null;
    }
    // if (param.status) {
    //   param.status = param.status.parValue;
    // }
    if (param.businessType){
      param.businessType = param.businessType.parValue
    }
    return param;
  }

  downloadFile(file) {
    // nếu là file .docx, .doc, xlsx, xls, pdf thì hiển thị dialog xem file, định dạng khác thì cho download
    if(file.fileName.includes('.docx') || file.fileName.includes('.doc') || file.fileName.includes('.pdf') || file.fileName.includes(".xlsx")) {
      this.viewReportFile(file, false);
    } else {
      this.fileStorage.downloadFile(file.secretId)
      .subscribe(res => {
        saveAs(res, file.fileName);
      });
    }
  }
  viewSignFile(transCode: string) {
    this.viewVofficeFile(transCode);
  }

  // updateVoffice(rowData) {
  //   this.signDocumentService.updateVoffice(rowData.transCode).subscribe(res => {
  //     this.app.successMessage('voffice.success');
  //   });
  // }

  goToUrl(url, data) {
    this.router.navigateByUrl(url, { state: data });
  }

  rejectReport(rowData) {
    const ref = this.dialogService.open(RejectFormComponent, {
      header: 'Nhập lý do từ chối',
      width: '50%',
      baseZIndex: 1500,
      contentStyle: {"padding": "0"},
      data: rowData
    });
    ref.onClose.subscribe( (isAdd) => {
      if (isAdd){
        this.search()
      }
    });

    // this.app.confirmMessage('label.report.reject',
    //   () => {
    //     let param = {
    //       reportSubmissionId: rowData.reportSubmissionId,
    //       status: BI_TU_CHOI
    //     }
    //     this.service.updateStatusReport(param)
    //       .subscribe(res => {
    //         this.search();
    //       })
    //   },
    //   () => { }
    // )
  }

  approveReport(rowData) {
    const ref = this.dialogService.open(reportContentReview, {
      header: 'Nội dung xét duyệt',
      width: '50%',
      baseZIndex: 1500,
      contentStyle: {"padding": "0"},
      data: rowData
    });
    ref.onClose.subscribe( (isAdd) => {
      if (isAdd){
        this.search()
      }
    });
    // this.app.confirmMessage("label.report.aprrove",
    //   () => {
    //     let param = {
    //       reportSubmissionId: rowData.reportSubmissionId,
    //       status: DA_XET_DUYET
    //     }
    //     this.service.updateStatusReport(param)
    //       .subscribe(res => {
    //         this.search();
    //       })
    //   },
    //   () => { }
    // )
  }

  viewReportFile(file, isBlobFile) {
    const modalRef = this.modalService.open(ReportPreviewModalComponent, LARGE_MODAL_OPTIONS);
    modalRef.componentInstance.file = file;
    modalRef.componentInstance.isBlobFile = isBlobFile;
  }
  async viewVofficeFile(transcode) {
    const modalRef = this.modalService.open(VofficeSigningPreviewModalComponent, LARGE_MODAL_OPTIONS);
    modalRef.componentInstance.transCode = transcode;
  }

  /**
   * Xử lý kiểm tra trạng thái
   * @param rowData
   * @param action
   */
  isValidAction(rowData, action) {
    let actionKey = REPORT_SUBMISSION_TYPE.KHONG_KY_VO;
    if (rowData.isSignRequired && rowData.isApproveRequired) {
      actionKey = REPORT_SUBMISSION_TYPE.CO_KY_VO_CO_DUYET;
    } else if (rowData.isSignRequired && !rowData.isApproveRequired) {
      actionKey = REPORT_SUBMISSION_TYPE.CO_KY_VO_KHONG_DUYET;
    }
    const isValid = this.mapActionTable[actionKey][action].includes(rowData.status);
    return isValid;
  }

  public actionShowHistory(rowData) {
      const modalRef = this.modalService.open(ReportManagerHistoryComponent, DEFAULT_MODAL_OPTIONS);
      modalRef.componentInstance.reportSubmissionId = rowData.reportSubmissionId;      
  }

  handleChangeBusinessType() {
    const rewardType = this.formSearch.controls['businessType'].value;
    this.formSearch.controls['requestOrg'].setValue(null);
    this.formSearch.controls['organizationSubmitReport'].setValue(null);
    this.rewardType = rewardType
    this.isHidden = false;
    this.isPartyO = false;
    this.isMasO = false;
    this.isOrg = false;
    this.isLabel = false;
    const mapParCode = MAP_YCBC_OBJECT_TYPE;
    if (!rewardType) {
      return;
    }
    const parCode = rewardType.parValue;
    if (mapParCode[parCode] == 1) {
      this.isHidden = true;
      this.isLabel = true;
      this.isOrg = true;
      this.rootId = APP_CONSTANTS.ORG_ROOT_ID
    } else if (mapParCode[parCode] == 2) {
      this.isHidden = true;
      this.isPartyO = true;
      this.isLabel = true;
      this.partyOrgRootId = APP_CONSTANTS.PARTY_ORG_ROOT_ID;
    } else {
      this.isHidden = true;
      this.isMasO = true;
      this.isLabel = true;
      if (mapParCode[parCode] == 3) {//Phụ nữ
        this.branch = 1;
      } else if (mapParCode[parCode] == 4) {// Công đoàn
        this.branch = 3;
      } else if (mapParCode[parCode] == 5) {// thanh niên
        this.branch = 2;
      }
    }
  }
}
