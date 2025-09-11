import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS, LARGE_MODAL_OPTIONS, OrganizationService } from '@app/core';
import { HrStorage } from '@app/core/services/HrStorage';
import { CatAllowanceService } from '@app/core/services/subsidized/cat-allowance.service';
import { SubsidizedInfoService } from '@app/core/services/subsidized/subsidized-info.service';
import { SubsidizedPeriodService } from '@app/core/services/subsidized/subsidized-period.service';
import { VofficeSigningPreviewModalComponent } from '@app/modules/voffice-signing/preview-modal/voffice-signing-preview-modal.component';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'subsidized-info-approve-search',
  templateUrl: './subsidized-info-approve-search.component.html',
  styleUrls: ['./subsidized-info-approve-search.component.css']
})
export class SubsidizedInfoApproveSearchComponent extends BaseComponent implements OnInit {
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
    subsidizeInfoId: [null],
    name: [null],
    decisionOrgId: [null],
    beneficiaryType: [null],
    beneficialOrgList: [null],
    decisionYearFrom: [null],
    isDecisionYearFrom: [false],
    decisionYearTo: [null],
    isDecisionYearTo: [false],
    subsidizedType: [null],
    isSubsidizedType: [false],
    status: [null],
    isStatus: [false],
    subsidizedBeneficialOrgId: [null],
    subsidizedPeriodId: [null],
    isSubsidizedPeriodId: [false],
    signDocumentId: [null],
    proposeOrgId: [null],
    isProposeOrgId: [false],
    isApprovalScreen: [1]
  };
  constructor(
    private subsidizedInfoService: SubsidizedInfoService,
    private subsidizedPeriodService: SubsidizedPeriodService,
    private catAllowanceService: CatAllowanceService,
    private router: Router,
    private app: AppComponent,
    private modalService: NgbModal
  ) {
    super(null, CommonUtils.getPermissionCode("resource.subsidized"))
    this.setMainService(this.subsidizedInfoService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW, []);
    this.listYear = this.getYearList();
    this.subsidizedPeriodService.getListSubsidizedPeriod({isNeverBeUsed: 0}).subscribe(res => {
      this.periodList = res;
    });
    this.catAllowanceService.getDataForDropdownCatAllowance({}).subscribe(res => {
      this.subsidizedTypeList = res;
    });
    this.listStatus = APP_CONSTANTS.SUBSIDIZED_APPROVE_STATUS_LIST;

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

  public prepareApprove(item) {
    this.subsidizedInfoService.findOne(item.subsidizedInfoId)
      .subscribe(res => {
        if (res.data != null) {
          this.router.navigate(['/subsidized/subsidized-approve/approve/', item.subsidizedInfoId]);
        }
      });
  }

  public processView(item) {
    this.subsidizedInfoService.findOne(item.subsidizedInfoId)
      .subscribe(res => {
        if (res.data != null) {
          this.router.navigate(['/subsidized/subsidized-approve/view/', item.subsidizedInfoId]);
        } else {
          this.processSearch();
          return;
        }
      });
  }

  /**
* gửi xét duyệt
*/
  public prepareSendApprove(item) {
    this.app.confirmMessage(null, () => { // on accepted
      this.subsidizedInfoService.updateStatus({ rewardProposeId: item.rewardProposeId, status: 2, note: null, signOrgId: item.signOrgId })
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
    this.subsidizedInfoService.exportSubsidizedApprove(params).subscribe(res => {
      saveAs(res, 'xet_duyet_de_xuat_tro_cap.xlsx');
    });
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
