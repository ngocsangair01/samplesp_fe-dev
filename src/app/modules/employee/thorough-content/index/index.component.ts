import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Router } from '@angular/router';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { AppComponent } from '@app/app.component';
import { DialogService } from 'primeng/api';
import {CommonUtils,ValidationService} from "../../../../shared/services";
import { TranslationService } from 'angular-l10n';
import { ThoroughContentService } from '@app/core/services/thorough-content/thorough-content.service';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {LARGE_MODAL_OPTIONS, MEDIUM_MODAL_OPTIONS} from "@app/core";
import {
  PreviewFileThoroughContentModalComponent
} from "@app/modules/employee/thorough-content/preview-modal/preview-file-thorough-content-modal.component";
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ExportDynamicService } from '@app/modules/reports/report-dynamic/export-dynamic-service';
import { environment } from '@env/environment';
import { APP_CONSTANTS } from '@app/core/app-config';
import { LetterDenunciationModule } from '@app/modules/monitoring/letter-denunciation/letter-denunciation.module';

@Component({
  selector: 'index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent extends BaseComponent implements OnInit {
  isHidden: boolean = false;
  isMasO: boolean = false;
  isPartyO: boolean = false;
  isOrg: boolean = false;
  rewardType: any;
  branch: any;
  formConfig = {
    title: [null],
    organizationId: [null],
    branch: [null],
    typeThorough: [null],
    fromThoroughDate: [null, ValidationService.required],
    toThoroughDate: [null, ValidationService.required],
    fromEndDate: [null],
    toEndDate: [null],
    status: [null],
    parentId: [null],
    issueLevel: [null],

    isTitle: [false],
    isThoroughOrganizationId: [false],
    isBranch: [false],
    isTypeThorough: [false],
    isFromThoroughDate: [false],
    isToThoroughDate: [false],
    isFromEndDate: [false],
    isToEndDate: [false],
    isStatus: [false],
    isParentId: [false],
    isIssueLevel: [false],

    first: [0],
    limit: [10],
  }
  businessTypeOptions
  typeOfReportOptions;
  isMobileScreen: boolean = false;
  tableColumnsConfig = [
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
      header: "label.thorough-content.title",
      width: "200px"
    },
    {
      name: "organizationName",
      header: "label.thorough-content.org-tkqt",
      width: "200px"
    },
    {
      name: "typeThoroughName",
      header: "label.thorough-content.type-thorough",
      width: "200px"
    },
    {
      name: "targetTypeThoroughName",
      header: "label.thorough-content.target-type-thorough",
      width: "200px"
    },
    {
      name: "issueLevelName",
      header: "label.thorough-content.issue-level",
      width: "200px"
    },
    {
      name: "thoroughDate",
      header: "label.thorough-content.thorough-date",
      width: "150px"
    },
    {
      name: "endDate",
      header: "label.thorough-content.end-date",
      width: "150px"
    },
    {
      name: "formOfConfirmationName",
      header: "label.thorough-content.form-of-confirmation",
      width: "200px"
    },
    {
      name: "statusName",
      header: "label.thorough-content.approveEmployee",
      width: "150px"
    },
    {
      name: "statusName",
      header: "label.thorough-content.status",
      width: "150px"
    },
    {
      name: "total",
      header: "label.thorough-content.total",
      width: "150px"
    },
    {
      name: "confirmed",
      header: "label.thorough-content.confirmed",
      width: "150px"
    },
    {
      name: "notConfirmed",
      header: "label.thorough-content.not-confirmed",
      width: "150px"
    },
    {
      name: "branchName",
      header: "label.thorough-content.branch",
      width: "200px"
    },
    {
      name: "createdDate",
      header: "label.thorough-content.create-date",
      width: "200px"
    },
    {
      name: "createdBy",
      header: "label.thorough-content.create-user",
      width: "200px"
    },
  ];

  branchNotUpdatableList = [];

  branchOptions = [{ value: 1, label: this.translation.translate('label.thorough-content.branch-1'), disabled: false },
    { value: 2, label: this.translation.translate('label.thorough-content.branch-2'), disabled: false },
    { value: 3, label: this.translation.translate('label.thorough-content.branch-3'), disabled: false },
    { value: 4, label: this.translation.translate('label.thorough-content.branch-4'), disabled: false },
    { value: 5, label: this.translation.translate('label.thorough-content.branch-5'), disabled: false },
    { value: 6, label: this.translation.translate('label.thorough-content.branch-6'), disabled: false },
    { value: 7, label: this.translation.translate('label.thorough-content.branch-7'), disabled: false }];
  
  typeThoroughOptions = [
      // { id: 1, name: this.translation.translate('label.thorough-content.type-thorough-1') },
    { id: 2, name: this.translation.translate('label.thorough-content.type-thorough-2') },
    { id: 3, name: this.translation.translate('label.thorough-content.type-thorough-3') },
    { id: 4, name: this.translation.translate('label.thorough-content.type-thorough-4') },
    { id: 5, name: this.translation.translate('label.thorough-content.type-thorough-5') },
    { id: 6, name: this.translation.translate('label.thorough-content.type-thorough-6') },
    { id: 8, name: this.translation.translate('label.thorough-content.type-thorough-8') },
    { id: 7, name: this.translation.translate('label.thorough-content.type-thorough-7') }];

  statusOptions = [{id: 0, name: this.translation.translate('label.thorough-content.status-0')},
    {id: 1, name: this.translation.translate('label.thorough-content.status-1')},
    {id: 2, name: this.translation.translate('label.thorough-content.status-2')},
    {id: 3, name: this.translation.translate('label.thorough-content.status-3')},
  ];

  issueLevelOptions = [{id: 1, name: this.translation.translate('label.thorough-content.issue-level-1')},
    {id: 2, name: this.translation.translate('label.thorough-content.issue-level-2')},
    {id: 3, name: this.translation.translate('label.thorough-content.issue-level-3')}];

  emptyFilterMessage = this.translation.translate('selectFilter.emptyFilterMessage');

  constructor(
    private router: Router,
    private appParamService: AppParamService,
    private app: AppComponent,
    public dialogService: DialogService,
    private service: ThoroughContentService,
    public translation: TranslationService,
    private modalService: NgbModal,
    public sanitizer: DomSanitizer,
    private exportDynamicService: ExportDynamicService,
  ) {
    super();
    this.setMainService(this.service);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    this.formSearch = this.buildForm('', this.formConfig);
    this.formSearch.get('fromThoroughDate').setValue(new Date(new Date().getFullYear() - 1, 0, 1).getTime());
    this.formSearch.get('toThoroughDate').setValue(new Date(new Date().getFullYear() + 1, 11, 31).getTime());
    this.getDropDownOptions();
    this.search({first: 0, rows: 10})
  }
  get f() {
    return this.formSearch.controls;
  }

  getDropDownOptions() {
    this.service.getBranchList().subscribe(resBranch => {
      this.branchNotUpdatableList = [];
      this.branchOptions.forEach(item => {
        if (!resBranch.data.includes(item.value)) {
          item.disabled = true;

          this.branchNotUpdatableList.push(item.value);
        }
      });
    });
  }

  navigateToCreatePage(rowData?) {
    this.router.navigateByUrl('/employee/thorough-content/create-update', { state: rowData });
  }

  navigateToViewPage(rowData?) {
    this.router.navigateByUrl('/employee/thorough-content/view', { state: rowData });
  }

  clonePopup(rowData?){
    this.router.navigateByUrl('/employee/thorough-content/clone', { state: rowData });
    // if (CommonUtils.nvl(rowData.thoroughContentId) > 0) {
    //   this.app.confirmMessage("common.message.confirm.clone", () => {// on accepted
    //     this.service.clone(rowData.thoroughContentId)
    //         .subscribe(res => {
    //           if (this.service.requestIsSuccess(res)) {
    //             this.search(null);
    //           }
    //         });
    //   }, () => {// on rejected
    //   });
    // }
  }

  quickDeploy(rowData?) {
    this.router.navigateByUrl('/employee/thorough-content/quick-deploy', { state: rowData });
  }

  search(event?) {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    if(event){
      this.formSearch.value['first'] = event.first;
      this.formSearch.value['limit'] = event.rows;
    }
    this.service.search(this.formSearch.value, event).subscribe(res => {
      this.resultList = res;
    });
  }

  deleteThoroughContent(thoroughContent) {
    this.app.confirmDelete(null,
      () => {
        this.service.deleteById(thoroughContent.thoroughContentId)
          .subscribe(res => {
              this.search({first: 0, rows: this.formSearch.value.limit});
          })
      },
      () => { }
    )
  }

  viewProgress(rowData?) {
    this.router.navigateByUrl('/employee/progress-track', { state: rowData });
  }

  preview(item) {
    // if (!this.validateBeforeSave()) {
    //   return;
    // }
    const modalRef = this.modalService.open(PreviewFileThoroughContentModalComponent, MEDIUM_MODAL_OPTIONS);
    modalRef.componentInstance.thoroughContentId = item.thoroughContentId;
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      this.router.navigateByUrl('/employee/thorough-content');
    });
  }

  exportFile(rowData) {
    let urlPreview;
    const formExport: {
      reportDynamicId?: number,
      orgId?: number,
      thorough_content_id?: number,
      code?: number,
    } = {};

    this.appParamService.getValueByCode(APP_CONSTANTS.APP_PARAM_CODE.CTCT_THOROUGH_CONTENT_REPORT).subscribe(res => {
      formExport.reportDynamicId = Number(res.data);
      formExport.orgId = rowData.organizationId;
      formExport.thorough_content_id = rowData.thoroughContentId;
      this.app.isProcessing(true);

      this.exportDynamicService.export(formExport)
        .subscribe(res => {
          urlPreview = this.exportDynamicService.serviceUrl + "/download/" + res.filePath;
          urlPreview = this.sanitizer.bypassSecurityTrustResourceUrl(urlPreview);
          window.location.href = urlPreview.changingThisBreaksApplicationSecurity + "/" + res.fileName;
        });
    })
  }
}