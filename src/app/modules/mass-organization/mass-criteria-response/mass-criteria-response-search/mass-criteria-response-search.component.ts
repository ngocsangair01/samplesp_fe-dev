import { Router } from '@angular/router';
import { APP_CONSTANTS, LARGE_MODAL_OPTIONS, DEFAULT_MODAL_OPTIONS, ACTION_FORM  } from '@app/core/app-config';
import { MassCriteriaResponseService } from '@app/core/services/mass-organization/mass-criteria-response.service';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VofficeSigningPreviewModalComponent } from '@app/modules/voffice-signing/preview-modal/voffice-signing-preview-modal.component';
import { SignVofficeHistoryComponent } from './sign-voffice-history/sign-voffice-history.component';
import { AppComponent } from '@app/app.component';
import { SignDocumentService } from '@app/core/services/sign-document/sign-document.service';
import { ApprovalHistoryModalComponent } from '@app/shared/components/approval-history/approval-history.component';
import _ from "lodash"
import { AppParamService } from '@app/core/services/app-param/app-param.service';
@Component({
  selector: 'mass-criteria-response-search',
  templateUrl: './mass-criteria-response-search.component.html',
  styleUrls: ['./mass-criteria-response-search.component.css']
})
export class MassCriteriaResponseSearchComponent extends BaseComponent implements OnInit {

  statusList = APP_CONSTANTS.MASS_CRITERIA_RESPONSE_TYPE;
  branch: any;
  transCode: any;
  signDocumentId: any;
  formConfig = {
    massRequestCode: ['', ValidationService.maxLength(50)],
    massRequestName: ['', ValidationService.maxLength(200)],
    criteriaName: ['', ValidationService.maxLength(500)],
    signVoffice: ['0'],
    status: [''],
    branch: [''],
    documentCode: [null],
    startDate: [null],
    endDate: [null],
    isMassRequestCode: [false],
    isMassRequestName: [false],
    isCriteriaName: [false],
    isSignVoffice: [false],
    isStatus: [false],
    isBranch: [false],
    isDocumentCode: [false],
    isStartDate: [false],
    isEndDate: [false]
  };
  constructor(
    private router: Router,
    private app: AppComponent,
    private massCriteriaResponseService: MassCriteriaResponseService,
    private modalService: NgbModal,
    private signDocumentService: SignDocumentService,
    private appParamService: AppParamService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.massRequestCriteria"));
    this.setMainService(massCriteriaResponseService);
    this.formSearch = this.buildForm({}, this.formConfig);
    const subPaths = this.router.url.split('/');
    if (subPaths.length >= 2) {
      if (subPaths[2] === 'woman') {
        this.branch = 1;
      }
      if (subPaths[2] === 'youth') {
        this.branch = 2;
      }
      if (subPaths[2] === 'union') {
        this.branch = 3;
      }
    }
    this.formSearch.controls['branch'].setValue(this.branch);
    this.processSearch();
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW, [
      ValidationService.notAffter('startDate', 'endDate', 'organizationcontroller.table.to.date')]);
  }

  ngOnInit() {
  }

  get f() {
    return this.formSearch.controls;
  }

  /**
   * Thực hiện tiêu chí (Nhập nội dung tiêu chí)
   * @param item 
   */
  public performCriteria(item) {
    if (!item) {
      return;
    }
    if (this.branch == 1) {
      this.router.navigate(['/mass/woman/mass-criteria-response/perform-criteria', item.massCriteriaResponseId]);
    }
    if (this.branch == 2) {
      this.router.navigate(['/mass/youth/mass-criteria-response/perform-criteria', item.massCriteriaResponseId]);
    }
    if (this.branch == 3) {
      this.router.navigate(['/mass/union/mass-criteria-response/perform-criteria', item.massCriteriaResponseId]);
    }
  }


  /**
   * Trình ký
   * @param item 
   */
  prepareSign(item) {
    if (item && item.signDocumentId > 0) {
      if (this.branch == 1) {
        this.router.navigate(['/sign-manager/woman-mass-criteria-response/', item.signDocumentId]);
      }
      if (this.branch == 2) {
        this.router.navigate(['/sign-manager/youth-mass-criteria-response', item.signDocumentId]);
      }
      if (this.branch == 3) {
        this.router.navigate(['/sign-manager/union-mass-criteria-response', item.signDocumentId]);
      }
    }
  }

  /**
 * Xem chi tiết
 * @param item 
 */
  prepareView(item) {
    if (!item) {
      return;
    }
    if (this.branch == 1) {
      this.router.navigate(['/mass/woman/mass-criteria-response/view', item.massCriteriaResponseId]);
    }
    if (this.branch == 2) {
      this.router.navigate(['/mass/youth/mass-criteria-response/view', item.massCriteriaResponseId]);
    }
    if (this.branch == 3) {
      this.router.navigate(['/mass/union/mass-criteria-response/view', item.massCriteriaResponseId]);
    }
  }


  public export() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    this.formSearch.controls['branch'].setValue(this.branch);
    const credentials = _.cloneDeep(this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.massCriteriaResponseService.export(params).subscribe(res => {
      if (this.branch == 1) {
        saveAs(res, 'DS_thuc_hien_tieu_chi_HPN.xlsx');
      } else if (this.branch == 2) {
        saveAs(res, 'DS_thuc_hien_tieu_chi_HTN.xlsx');
      } else {
        saveAs(res, 'DS_thuc_hien_tieu_chi_HCD.xlsx');
      }
    });
  }

  previewFileSigning(signDocumentId) {
    const modalRef = this.modalService.open(VofficeSigningPreviewModalComponent, LARGE_MODAL_OPTIONS);
    modalRef.componentInstance.id = signDocumentId; 
  }
  
  public actionShowHistory(item) {
    if (item.signDocumentId==null || item.status == 0 || item.status == 1) {
      return;
    } 
    const modalRef = this.modalService.open(ApprovalHistoryModalComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance.signDocumentId = item.signDocumentId;
  }

  /**
   * hủy trình ký Phụ nữ, thanh niên, công đoàn
   * @param item 
   */
  cancelSignMassCriteria(item: any) {
    this.formSearch.controls['branch'].setValue(this.branch);
    this.app.confirmMessage('resolutionsMonth.cancelStream',
      () => {
        if (this.branch == 1) {
           this.signDocumentService.cancelTransaction('woman-mass-criteria-response', item.signDocumentId)
            .subscribe(res => {
              this.app.successMessage('cancelSign.success');
              this.processSearch();
            })
        } else if (this.branch == 2) {
          this.signDocumentService.cancelTransaction('youth-mass-criteria-response', item.signDocumentId)
          .subscribe(res => {
            this.app.successMessage('cancelSign.success');
            this.processSearch();
          })
        } else {
          this.signDocumentService.cancelTransaction('union-mass-criteria-response', item.signDocumentId)
          .subscribe(res => {
            this.app.successMessage('cancelSign.success');
            this.processSearch();
          })
        }
      }, () => {
         // on rejected
       });
  }

  handleSearch() {
    this.formSearch.controls['branch'].setValue(this.branch);
    this.processSearch()
  }

  syncSign(item: any) {
    this.signDocumentService.syncSign(item.transCode)
    .subscribe(res => {
      if (this.appParamService.requestIsSuccess(res)) {
        this.app.successMessage('voffice.success');
        this.processSearch();
      }
    })
  }

}
