import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import {ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS} from '@app/core';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { RequestResolutionMonthService } from '@app/core/services/party-organization/request-resolution-month.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestResolutionsMonthManage } from '../request-resolutions-month-manage/request-resolutions-month-manage.component';

@Component({
  selector: 'request-resolutions-month-search',
  templateUrl: './request-resolutions-month-search.component.html',
  styleUrls: ['./request-resolutions-month-search.component.css']
})
export class RequestResolutionMonthSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  monthOfYear = APP_CONSTANTS.MONTH_OF_YEAR
  isMobileScreen: boolean = false;
  formConfig = {
    requestMonth: [''],
    name: ['', [Validators.maxLength(200)]],
    requestedDateFrom: [''],
    requestedDateTo: [''],
    partyOrganizationId: [''],
    requestedPeriod: [0],
    requestedLevel: [0],
    status: [0],
    month: [],

    isName: [false],
    isPartyOrganizationId: [false],
    isStatus: [false],
    isRequestedLevel: [false],
    isRequestedPeriod: [false],
    isMonth: [false],
    isRequestedDateFrom: [false],
    isRequestedDateTo: [false],
  };

  constructor(
    public actr: ActivatedRoute
    , private requestResolutionMonthService: RequestResolutionMonthService
    , private modalService: NgbModal
    , private router: Router
    , private app: AppComponent
    , private fileStorage: FileStorageService) {
    super(null, CommonUtils.getPermissionCode("resource.requestResolutionMonth"));
    this.setMainService(requestResolutionMonthService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('requestedDateFrom', 'requestedDateTo', 'app.responseResolutionMonth.requestDateToDate')]);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    this.processSearch();
  }

  get f() {
    return this.formSearch.controls;
  }

  public prepareSaveOrUpdate(item?: any) {
    if (item && item.requestResolutionsMonthId > 0) {
      this.router.navigate(['/party-organization/request-resolutions-month/request-resolutions-month-edit/', item.requestResolutionsMonthId]);
    } else {
      this.router.navigate(['/party-organization/request-resolutions-month/request-resolutions-month-add']);
    }
  }

  /**
   * Hàm bổ sung đơn vị thực hiện
   * @param item 
   */
  public addPartyExucte(item?: any) {
    this.router.navigate(['/party-organization/request-resolutions-month-add-party-excute/', item.requestResolutionsMonthId, 'addPartyExcute']);
  }

  public view(item?: any) {
    if (item && item.requestResolutionsMonthId > 0) {
      this.router.navigate(['/party-organization/request-resolutions-month/request-resolutions-month-view/', item.requestResolutionsMonthId, 'view']);
    }
  }

  sendRequest(item?: any) {
    if (item && item.requestResolutionsMonthId > 0) {
      this.app.confirmSendReqest(null, () => {// on accepted
        this.requestResolutionMonthService.sendRequest(item.requestResolutionsMonthId)
          .subscribe(res => {
            if (this.requestResolutionMonthService.requestIsSuccess(res)) {
              this.processSearch();
            }
          });
      }, () => {// on rejected
      });
    }
  }

  /**
   * Hàm xóa nghị quyết
   * @param item 
   */
  delete(item?: any) {
    if (item && item.requestResolutionsMonthId > 0) {
      this.app.confirm('resolutionsMonth.confirmDelete.message', 'resolutionsMonth.confirmDelete.title', () => {// on accepted
        this.requestResolutionMonthService.deleteById(item.requestResolutionsMonthId)
          .subscribe(res => {
            if (this.requestResolutionMonthService.requestIsSuccess(res)) {
              this.processSearch();
            }
          });
      }, () => {// on rejected
      });
    }
  }

  /**
   * Hàm thu hồi nghị quyết
   * @param item
   */
  revokeRequest(item?: any) {
    if (item && item.requestResolutionsMonthId > 0) {
      this.app.confirm('resolutionsMonth.confirmRevoke.message', 'resolutionsMonth.confirmRevoke.title', () => {// on accepted
        this.requestResolutionMonthService.revokeRequest(item.requestResolutionsMonthId)
          .subscribe(res => {
            if (this.requestResolutionMonthService.requestIsSuccess(res)) {
              this.processSearch();
            }
          });
      }, () => {// on rejected
      });
    }
  }

  // mo pop-up quan ly
  preparePopManage(item) {
    this.actionActiveModal(item);
  }

  // action mo
  actionActiveModal(item) {
    const modalRef = this.modalService.open(RequestResolutionsMonthManage, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance.setManageForm(item.requestResolutionsMonthId, item.partyOrganizationId);
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.requestResolutionMonthService.requestIsSuccess(result)) {
        this.processSearch();
      }
    });
  }

  /**
   * Xu ly download file trong danh sach
   */
  public downloadFile(fileData, item) {
    // Trường hơp bản ghi do tiến trình tạo tự động
    if (item.createdBy == 'ROBOT_SCHEDULE'){
      this.requestResolutionMonthService.getDefaultFileAttach(fileData.secretId).subscribe(res => {
        saveAs(res, fileData.fileName);
      });
    } else {
      this.fileStorage.downloadFile(fileData.secretId).subscribe(res => {
        saveAs(res, fileData.fileName);
      });
    }
  }

  /**
   * Action xuất báo cáo ra tiến độ chi tiết
   * @param item 
   */
  onReportDetail(item: any) {
    this.requestResolutionMonthService.exportDetail(item.requestResolutionsMonthId).subscribe(res => {
      saveAs(res, 'ctct_bao_cao_tien_do_ra_nghi_quyet_chi_tiet.xlsx');
    });
  }

  /**
   * Action xuất báo cáo ra tiến độ tổng hợp
   * @param item 
   */
  onReportSummary(item: any) {
    this.requestResolutionMonthService.exportSummary(item.requestResolutionsMonthId).subscribe(res => {
      saveAs(res, 'ctct_bao_cao_tien_do_ra_nghi_quyet_tong_hop.xlsx');
    });
  }

  testRequestResolutions(){
    if(this.formSearch.get('month').value){
      this.requestResolutionMonthService.testRequestResolutions(this.formSearch.get('month').value).subscribe(res =>{
      })
    }
  }

  processSendWarningResponseResolution(){
    const formInput = this.formSearch.value;
    this.requestResolutionMonthService.processSendWarningResponseResolution(formInput).subscribe(res => {
    })
  }

  processSendNoticeResolutionsMonth(){
    const formInput = this.formSearch.value;
    this.requestResolutionMonthService.processSendNoticeResolutionsMonth(formInput).subscribe(res => {
      saveAs(res, 'ctct_bao_cao_tien_do_ra_nghi_quyet_chi_tiet');
    })
  }
}
