import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { APP_CONSTANTS, DEFAULT_MODAL_OPTIONS, LARGE_MODAL_OPTIONS, MAP_YCBC_OBJECT_TYPE, REPORT_SUBMISSION_STATUS, REPORT_SUBMISSION_TYPE, RequestReportService, RESPONSE_TYPE } from '@app/core';
import { Router } from '@angular/router';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { AppComponent } from '@app/app.component';
import { ReportSubmissionService } from '@app/core/services/report/report-submission.service';
import { DialogService } from 'primeng/api';
import { EmpSubmitComponent } from '../emp-submit/emp-submit-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignDocumentService } from '@app/core/services/sign-document/sign-document.service';
import { Thickness } from '@syncfusion/ej2-ng-diagrams';
import { TranslationService } from 'angular-l10n';
import { ReportSubmissionHistoryComponent } from '../report-submission-history/report-submission-history.component';
@Component({
  selector: 'index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent extends BaseComponent implements OnInit {
  @ViewChild('form') form: any;
  headerFormConfig = "common.label.search.info"
  businessTypeOptions;
  rootId: any;
  partyOrgRootId: any;
  massOrgRootId: any;
  isMasO: boolean = false;
  isPartyO: boolean = false;
  isOrg: boolean = false;
  isLabel: boolean = false;
  branch: any;
  rewardType: any;
  isMobileScreen: boolean = false;
  formConfig = {
    title: [null],
    startDate: [null],
    endDate: [null],
    status: [null],
    statuses: [null],
    requestReportOrg: [null],
    businessType: [null],
    reportingPeriod: [null],
    requestOrg: [null],
    isTitle: [false],
    isStartDate: [false],
    isEndDate: [false],
    isStatus: [false],
    isStatuses: [false],
    isRequestReportOrg: [false],
    isBusinessType: [false],
    isReportingPeriod: [false],
    isRequestOrg: [false]
  }
  signType: any;

  mapActionTable = {
    KHONG_KY_VO: {
      REPORT: [
        REPORT_SUBMISSION_STATUS.CHUA_THUC_HIEN,
        REPORT_SUBMISSION_STATUS.DU_THAO,
        REPORT_SUBMISSION_STATUS.BI_TU_CHOI_DUYET
      ],
      CHOOSE_EMP_SUBMIT: [
        REPORT_SUBMISSION_STATUS.CHUA_THUC_HIEN,
        REPORT_SUBMISSION_STATUS.DU_THAO,
      ],
      SUBMIT_REPORT: [
        REPORT_SUBMISSION_STATUS.DU_THAO
      ],
      SUBMIT_REVIEW: [],
      SIGN_PROCESS: [],
      VIEW_REPORT: [
        REPORT_SUBMISSION_STATUS.DA_NOP,
        REPORT_SUBMISSION_STATUS.BI_TU_CHOI_DUYET
      ],
      VIEW_FILE_SIGNER: []
    },
    CO_KY_VO_KHONG_DUYET: {
      REPORT: [
        REPORT_SUBMISSION_STATUS.CHUA_THUC_HIEN,
        REPORT_SUBMISSION_STATUS.DU_THAO,
        REPORT_SUBMISSION_STATUS.BI_TU_CHOI_DUYET,
        REPORT_SUBMISSION_STATUS.BI_TU_CHOI_KY_DUYET,
        REPORT_SUBMISSION_STATUS.CHUA_TRINH_KY,
      ],
      CHOOSE_EMP_SUBMIT: [
        REPORT_SUBMISSION_STATUS.CHUA_THUC_HIEN,
        REPORT_SUBMISSION_STATUS.DU_THAO,
      ],
      SUBMIT_REPORT: [],
      SUBMIT_REVIEW: [],
      SIGN_PROCESS: [
        REPORT_SUBMISSION_STATUS.DU_THAO,
        REPORT_SUBMISSION_STATUS.CHUA_TRINH_KY,
      ],
      VIEW_REPORT: [
        REPORT_SUBMISSION_STATUS.DANG_TRINH_KY,
        REPORT_SUBMISSION_STATUS.DA_NOP_BK,
        REPORT_SUBMISSION_STATUS.BI_TU_CHOI_DUYET,
        REPORT_SUBMISSION_STATUS.BI_TU_CHOI_KY_DUYET,
      ],
      VIEW_FILE_SIGNER: [
        REPORT_SUBMISSION_STATUS.CHUA_TRINH_KY,
        REPORT_SUBMISSION_STATUS.DANG_TRINH_KY,
        REPORT_SUBMISSION_STATUS.DA_NOP_BK,
        REPORT_SUBMISSION_STATUS.BI_TU_CHOI_KY_DUYET,
      ]
    },
    CO_KY_VO_CO_DUYET: {
      REPORT: [
        REPORT_SUBMISSION_STATUS.CHUA_THUC_HIEN,
        REPORT_SUBMISSION_STATUS.DU_THAO,
        REPORT_SUBMISSION_STATUS.BI_TU_CHOI_DUYET,
        REPORT_SUBMISSION_STATUS.BI_TU_CHOI_KY_DUYET
      ],
      CHOOSE_EMP_SUBMIT: [
        REPORT_SUBMISSION_STATUS.CHUA_THUC_HIEN,
        REPORT_SUBMISSION_STATUS.DU_THAO,
      ],
      SUBMIT_REPORT: [],
      SUBMIT_REVIEW: [
        REPORT_SUBMISSION_STATUS.DU_THAO
      ],
      SIGN_PROCESS: [
        REPORT_SUBMISSION_STATUS.DA_XET_DUYET,
      ],
      VIEW_REPORT: [
        REPORT_SUBMISSION_STATUS.CHO_XET_DUYET,
        REPORT_SUBMISSION_STATUS.DA_XET_DUYET,
        REPORT_SUBMISSION_STATUS.DANG_TRINH_KY,
        REPORT_SUBMISSION_STATUS.DA_NOP_BK,
        REPORT_SUBMISSION_STATUS.BI_TU_CHOI_DUYET,
        REPORT_SUBMISSION_STATUS.BI_TU_CHOI_KY_DUYET,
      ],
      VIEW_FILE_SIGNER: [
        REPORT_SUBMISSION_STATUS.DANG_TRINH_KY,
        REPORT_SUBMISSION_STATUS.DA_NOP_BK,
        REPORT_SUBMISSION_STATUS.BI_TU_CHOI_KY_DUYET,
      ]
    }
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
      name: "reportingDeadline",
      header: "lable.request.deadline",
      width: "100px"
    },
    {
      name: "orgRequest",
      header: "label.organizationReport.requestReport",
      width: "200px"
    },
    {
      name: "empSubmit",
      header: "label.reportSubmission.employee",
      width: "140px"
    },
    {
      name: "strEmpApproves",
      header: "label.reportSubmission.empApproves",
      width: "140px"
    },
    {
      name: "statusLabel",
      header: "common.label.status",
      width: "150px"
    },
    {
      name: "summitedDate",
      header: "lable.report.sumittedDate",
      width: "100px"
    },
    {
      name: "businessType",
      header: "label.report.business",
      width: "140px"
    },
    {
      name: "organizationSubmission",
      header: "label.org.submitReport",
      width: "200px"
    }

  ]

  statusOption

  constructor(
    private router: Router,
    private appParamService: AppParamService,
    private service: ReportSubmissionService,
    private app: AppComponent,
    public dialogService: DialogService,
    public requestReportService: RequestReportService,
    private modalService: NgbModal,
    private signDocumentService: SignDocumentService,
    private translation: TranslationService

  ) {
    super();
    this.setMainService(this.service);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    this.formSearch = this.buildForm('', this.formConfig);
    this.getDropDownOptions();
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

    this.requestReportService.getBusinessType() .subscribe(res =>  {
      this.businessTypeOptions = res.data;
      this.handleChangeBusinessType();
    })
  }


  search(event?) {
    this.service.search(this.getParamSearch(), event).subscribe(res => {
      this.resultList = res;
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
    if (param.businessType) {
      param.businessType = param.businessType.parValue;
    }
    return param;
  }

  goToUrl(url, data) {
    this.router.navigateByUrl(url, { state: data });
  }

  submitReport(data) {
    this.app.confirmMessage(null,
      () => {
        this.service.submit(data.reportSubmissionId)
          .subscribe(res => {
            if (res.data.signDocumentId && res.data.status != 'CHO_XET_DUYET') {
              // them thuc hien tao du lieu trinh ky
              this.signDocumentService.cloneFile(res.data.signDocumentId).subscribe(resp => {
                this.router.navigateByUrl('voffice-signing/report-submission/' + res.data.signDocumentId, { state: {backUrl:'report/report-submission'} });
              })
            }
            this.search()
          })
      },
      () => { }
    )

  }

  updateEmpSubmit(rowData) {
    const ref = this.dialogService.open(EmpSubmitComponent, {
      width: '90vw',
      height: '90vh',
      baseZIndex: 2000,
      contentStyle: {"padding": "0"},
      data: rowData,
      closable: false
    });
    ref.onClose.subscribe( (isAdd) => {
      if (isAdd){
        this.search()
      }
    });
  }

  previewFileSigning(signDocumentId) {
  }

  async onOpendSign(rowData) {
    if (rowData.signDocumentId) {
      const cloneFileRest = await this.signDocumentService.cloneFile(rowData.signDocumentId).toPromise();
      if (cloneFileRest.type == RESPONSE_TYPE.SUCCESS) {
        this.router.navigateByUrl(`/voffice-signing/report-submission/${rowData.signDocumentId}`);
      }
    }
  }

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

  onSubmitReview(rowData) {
    if (rowData.reportSubmissionId) {
      this.app.confirmMessage("label.report.sendAprrove",
      () => {
        this.service.submit(rowData.reportSubmissionId).subscribe((resp) => {
          if (resp.type == RESPONSE_TYPE.SUCCESS) {
            this.search();
          }
        })
      },
      () => { }
    )
    }
  }

  handleChangeBusinessType() {
    const rewardType = this.formSearch.controls['businessType'].value;
    this.formSearch.controls['requestOrg'].setValue(null);
    this.formSearch.controls['requestReportOrg'].setValue(null);
    this.rewardType = rewardType
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
      this.isOrg = true;
      this.isLabel = true;
      this.rootId = APP_CONSTANTS.ORG_ROOT_ID
    } else if (mapParCode[parCode] == 2) {
      this.isPartyO = true;
      this.isLabel = true;
      this.partyOrgRootId = APP_CONSTANTS.PARTY_ORG_ROOT_ID;
    } else {
      this.isMasO = true;
      this.isLabel = true;
      if (mapParCode[parCode] == 3) {//Phụ nữ
        this.branch = 1;
      } else if (mapParCode[parCode] == 5) {// thanh niên
        this.branch = 2;
      } else {
        this.branch = 3;
      }
    }
  }
  cancelSign(rowData: any) {
    this.app.confirmMessage('resolutionsMonth.cancelStream',
      () => {
        this.signDocumentService.cancelTransaction('report-submission', rowData.signDocumentId)
          .subscribe(res => {
            this.app.successMessage('cancelSign.success');
            this.search();
        });
      }, () => {
         // on rejected
       });
  }

  public actionShowHistory(rowData) {
    const modalRef = this.modalService.open(ReportSubmissionHistoryComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance.reportSubmissionId = rowData.reportSubmissionId;
  }

  public syncSign(rowData:any) {
    this.signDocumentService.syncSign(rowData.transCode).subscribe(res => {
      if (this.appParamService.requestIsSuccess(res)) {
        this.app.successMessage('voffice.success');
        this.search();
      }
    })
  }
}
