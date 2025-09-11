import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, LARGE_MODAL_OPTIONS, OrganizationService, SUBSIDIZED_STATUS } from '@app/core';
import { HrStorage } from '@app/core/services/HrStorage';
import { CatAllowanceService } from '@app/core/services/subsidized/cat-allowance.service';
import { SubsidizedInfoService } from '@app/core/services/subsidized/subsidized-info.service';
import { SubsidizedPeriodService } from '@app/core/services/subsidized/subsidized-period.service';
import { VofficeSigningPreviewModalComponent } from '@app/modules/voffice-signing/preview-modal/voffice-signing-preview-modal.component';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'subsidized-info-search',
  templateUrl: './subsidized-info-search.component.html',
  styleUrls: ['./subsidized-info-search.component.css']
})
export class SubsidizedInfoSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  listYear: any;
  beneficiaryTypeList: any;
  listStatus: any;
  periodList: any;
  subsidizedTypeList: any;
  operationKey = 'action.view';
  adResourceKey = 'resource.subsidized';
  private defaultDomain: any;
  formConfig = {
    subsidizedInfoId: [null],
    decisionOrgId: [null],
    beneficiaryType: [null],
    beneficialOrgList: [null],
    decisionYearFrom: [null],
    isDecisionYearFrom: [false],
    decisionYearTo: [null],
    isDecisionYearTo: [false],
    catAllowanceId: [null],
    status: [null],
    isStatus: [false],
    subsidizedBeneficialOrgId: [null],
    proposeOrgId: [null],
    isProposeOrgId: [false],
    subsidizedPeriodId: [null],
    isSubsidizedPeriodId: [false],
    subsidizedType: [null],
    isSubsidizedType: [false],
  };
  constructor(
    private subsidizedInfoService: SubsidizedInfoService,
    private subsidizedPeriodService: SubsidizedPeriodService,
    private catAllowanceService: CatAllowanceService,
    private router: Router,
    private app: AppComponent,
    private modalService: NgbModal,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.subsidized"))
    this.setMainService(this.subsidizedInfoService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW, []);
    this.subsidizedPeriodService.getListSubsidizedPeriod({ isNeverBeUsed: 0 }).subscribe(res => {
      this.periodList = res;
    });
    this.catAllowanceService.getDataForDropdownCatAllowance({}).subscribe(res => {
      this.subsidizedTypeList = res;
    });
    this.listYear = this.getYearList();
    this.listStatus = APP_CONSTANTS.SUBSIDIZED_STATUS_LIST;

    this.beneficiaryTypeList = APP_CONSTANTS.BENEFCIARY_TYPE_LIST;
  }

  ngOnInit() {
    //Lấy miền dữ liệu mặc định theo nv đăng nhập
    this.defaultDomain = HrStorage.getDefaultDomainByCode(CommonUtils.getPermissionCode(this.operationKey)
      , CommonUtils.getPermissionCode(this.adResourceKey));
    // search
    this.processSearch();
  }

  get f() {
    return this.formSearch.controls;
  }

  private getYearList() {
    this.listYear = [];
    const currentYear = new Date().getFullYear();
    for (let i = (currentYear - 20); i <= (currentYear); i++) {
      const obj = {
        year: i
      };
      this.listYear.push(obj);
    }
    return this.listYear;
  }

  public prepareSaveOrUpdate(item) {
    if (item && item.subsidizedInfoId > 0) {
      this.subsidizedInfoService.findOne(item.subsidizedInfoId).subscribe(res => {
        if (res.data != null) {
          this.router.navigate(['/subsidized/subsidized-suggest/edit/', item.subsidizedInfoId]);
        } else {
          this.processSearch();
          return;
        }
      });
    } else {
      this.router.navigate(['/subsidized/subsidized-suggest/add']);
    }
  }

  public processView(item) {
    this.subsidizedInfoService.findOne(item.subsidizedInfoId)
      .subscribe(res => {
        if (res.data != null) {
          this.router.navigate(['/subsidized/subsidized-suggest/view/', item.subsidizedInfoId]);
        } else {
          this.processSearch();
          return;
        }
      });
  }

  public processDelete(item) {
    if (item && item.subsidizedInfoId > 0) {
      this.subsidizedInfoService.findOne(item.subsidizedInfoId)
        .subscribe(res => {
          if (res.data != null) {
            this.app.confirmDelete(null, () => { // accept
              this.subsidizedInfoService.deleteById(item.subsidizedInfoId)
                .subscribe(res => {
                  if (this.subsidizedInfoService.requestIsSuccess(res)) {
                    this.processSearch(null);
                  }
                })
            }, () => {
              // rejected
            })
          } else {
            this.processSearch();
            return;
          }
        })
    }
  }

  /**
  * gửi xét duyệt
  */
  public prepareSendApprove(item) {
    this.app.confirmMessage(null, () => { // on accepted
      this.subsidizedInfoService.updateStatus({ subsidizedType: item.subsidizedType, status: SUBSIDIZED_STATUS.CHO_XET_DUYET, subsidizedInfoId: item.subsidizedInfoId })
        .subscribe(res => {
          if (res.data != null) {
            this.processSearch(null);
          }
          else {
            this.processSearch();
            return;
          }
        });
    }, () => {
      // on rejected
    });
  }

  /**
   * export
   */
  public processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.subsidizedInfoService.exportSubsidized(params).subscribe(res => {
      saveAs(res, 'danh_sach_de_xuat_ho_tro.xlsx');
    });
  }

  /**
   * Trinh ky
   * @param item 
   */
  prepareSign(item) {
    if (item && item.signDocumentId > 0) {
      this.subsidizedInfoService.findOne(item.subsidizedInfoId).subscribe(res => {
        if (res.data != null) {
          this.router.navigate(['/voffice-signing/subsidized-suggest/', item.signDocumentId]);
        } else {
          this.processSearch();
          return;
        }
      });
    }
  }

  /**
   * xem file trinh ky
   * @param signDocumentId 
   */
  previewFileSigning(signDocumentId) {
    const modalRef = this.modalService.open(VofficeSigningPreviewModalComponent, LARGE_MODAL_OPTIONS);
    modalRef.componentInstance.id = signDocumentId;
  }
}

