import { HrStorage } from '@app/core/services/HrStorage';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { AppComponent } from '@app/app.component';
import { RewardDecideService } from './../../../../core/services/propaganda/reward-decide.service';
import { ValidationService } from '@app/shared/services/validation.service';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Component, OnInit } from '@angular/core';
import { ACTION_FORM, APP_CONSTANTS, LARGE_MODAL_OPTIONS, OrganizationService } from '@app/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VofficeSigningPreviewModalComponent } from '@app/modules/voffice-signing/preview-modal/voffice-signing-preview-modal.component';

@Component({
  selector: 'reward-decide-search',
  templateUrl: './reward-decide-search.component.html'
})
export class RewardDecideSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  listStatus: any;
  resultList: any;
  filterConditionEmp: any;
  formconfig = {
    propagandaRewardDecideId: [''],
    organizationId: [''],
    employeeId: [''],
    rewardDecideCode: [''],
    decideDate: [''],
    toDecideDate: [''],
    totalAmountReward: [''],
    status: [''],
  }
  private operationKey = 'action.view';
  private adResourceKey = 'resource.propaganda';
  private defaultDomain: any;

  constructor(
    private rewardDecideService: RewardDecideService,
    private app: AppComponent,
    private router: Router,
    private service: OrganizationService,
    private modalService: NgbModal
  ) {
    super(null, CommonUtils.getPermissionCode("resource.propaganda"));
    this.filterConditionEmp = " AND obj.status = 1 "
    this.listStatus = APP_CONSTANTS.PROPAGANDA_REWARD_DECIDE_STATUS;
    this.setMainService(rewardDecideService);
    this.formSearch = this.buildForm({}, this.formconfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('decideDate', 'toDecideDate', 'common.label.toDate')]);
  }

  ngOnInit() {
    //Lấy miền dữ liệu mặc định theo nv đăng nhập
    this.defaultDomain = HrStorage.getDefaultDomainByCode(CommonUtils.getPermissionCode(this.operationKey)
      , CommonUtils.getPermissionCode(this.adResourceKey));

    // search
    if (this.defaultDomain) {
      this.service.findOne(this.defaultDomain)
        .subscribe((res) => {
          const data = res.data;
          if (data) {
            this.f['organizationId'].setValue(data.organizationId);
          }
          this.processSearch();
        });
    } else {
      this.processSearch();
    }
  }

  get f() {
    return this.formSearch.controls;
  }

  public prepareSaveOrUpdate(item?: any) {
    if (item && item.propagandaRewardDecideId > 0) {
      this.router.navigate(['/propaganda/reward-decide/edit/', item.propagandaRewardDecideId]);
    } else {
      this.router.navigate(['/propaganda/reward-decide/add']);
    }
  }

  public processView(item?: any) {
    this.rewardDecideService.findOne(item.propagandaRewardDecideId)
      .subscribe(res => {
        if (res.data != null) {
          this.router.navigate(['/propaganda/reward-decide/view/', item.propagandaRewardDecideId]);
        }
      });
  }
  public processDelete(item) {
    if (item && item.propagandaRewardDecideId > 0) {
      this.app.confirmDelete(null, () => { // accept
        this.rewardDecideService.deleteById(item.propagandaRewardDecideId)
          .subscribe(res => {
            if (this.rewardDecideService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          })
      }, () => {
        // rejected
      })
    }
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
    this.rewardDecideService.export(params).subscribe(res => {
      saveAs(res, 'quyet_dinh_khen_thuong.xlsx');
    });
  }

  /**
   * Trinh ky
   * @param item 
   */
  prepareSign(item) {
    if (item && item.signDocumentId > 0) {
      this.router.navigate(['/voffice-signing/reward-decide/', item.signDocumentId]);
    }
  }

  previewFileSigning(signDocumentId) {
    const modalRef = this.modalService.open(VofficeSigningPreviewModalComponent, LARGE_MODAL_OPTIONS);
    modalRef.componentInstance.id = signDocumentId;
  }
}