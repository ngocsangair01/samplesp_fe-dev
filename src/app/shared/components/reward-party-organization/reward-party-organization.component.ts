import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormGroup } from '@angular/forms';
import { RewardGeneralService } from '@app/core/services/reward-general/reward-general.service';
import { CommonUtils } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RewardGeneralModalComponent } from '@app/shared/components/reward-general-modal/reward-general-modal.component';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS, DEFAULT_MODAL_OPTIONS, LARGE_MODAL_OPTIONS, LOAI_DOI_TUONG_KHEN_THUONG } from '@app/core';
import { ReportPreviewCertificateComponentS } from '../reward-general-preview-S/report-preview-certificate-S';

@Component({
  selector: 'reward-party-organization',
  templateUrl: './reward-party-organization.component.html',
  styleUrls: ['./reward-party-organization.component.css']
})
export class RewardPartyOrganizationComponent extends BaseComponent implements OnInit {
  @Input() public massOrganizationId: number;
  @Input() public branch: number;
  formSearch: FormGroup;
  resultList: any;
  formConfig = {
    massOrganizationId: [''],
    objectId: [''],
    rewardObjectType: [LOAI_DOI_TUONG_KHEN_THUONG.TAP_THE],
    rewardType: ['']
  }
  constructor(
    private rewardGeneralService: RewardGeneralService,
    private modalService: NgbModal,
    private app: AppComponent
    //private rewardPartyOrganizationService: RewardPartyOrganizationService
  ) {
    super(null, 'REWARD_PARTY');
    this.setMainService(rewardGeneralService);
  }

  ngOnInit() {
    let rewardTypeObj = APP_CONSTANTS.BRANCH_WITH_LOAI_KHEN_THUONG.filter(obj => {
      return obj.branch == this.branch;
    });
    let rewardType = 0;
    if (rewardTypeObj && rewardTypeObj.length != 0) {
      rewardType = rewardTypeObj[0] ? rewardTypeObj[0].loai : 0;
    }
    this.formSearch = this.buildForm({objectId: this.massOrganizationId,  massOrganizationId: this.massOrganizationId, rewardType: rewardType }, this.formConfig);
    this.processSearch();
  }

  // public processSearchDetail(event?): void {
  //   if (!CommonUtils.isValidForm(this.formSearch)) {
  //     return;
  //   }
  //   const params = this.formSearch ? this.formSearch.value : null;
  //   this.rewardGeneralService.processSearch3(params, event).subscribe(res => {
  //     this.resultList = res;
  //   });
  //   if (!event) {
  //     if (this.dataTable) {
  //       this.dataTable.first = 0;
  //     }
  //   }
  // }

  /**
   * prepare insert/update
   */
  prepareSaveOrUpdate(item: any): void {
    if (item && item.rewardGeneralId > 0) {
      this.rewardGeneralService.findByIdWithAttachedFile(item.rewardGeneralId)
        .subscribe(res => {
          if (res.data) {
            this.activeFormModal(this.modalService, RewardGeneralModalComponent, res.data);
          }
        });
    } else {
      this.app.warningMessage('message.warning.recordNotExist', '');
      return;
    }
  }

  processDelete(item) {
    if (item && item.rewardGeneralId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.rewardGeneralService.deleteById(item.rewardGeneralId)
          .subscribe(res => {
            if (this.rewardGeneralService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      }, () => {// on rejected
      });
    }
  }

  public prepareView(item) {
    let rewardGeneralId = item.rewardGeneralId;
    if (rewardGeneralId > 0) {
      this.rewardGeneralService.findByIdWithAttachedFile(rewardGeneralId).subscribe(res => {
        if (this.rewardGeneralService.requestIsSuccess(res)) {
          this.activeModelView(rewardGeneralId, res.data);
        }
      });
    }
  }

  private activeModelView(rewardGeneralId, data) {
    const modalRef = this.modalService.open(RewardGeneralModalComponent, DEFAULT_MODAL_OPTIONS);

    if (rewardGeneralId > 0) {
      // modalRef.componentInstance.rewardGeneralId = rewardGeneralId;
      data.isView = true;
      modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
    }

    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.rewardGeneralService.requestIsSuccess(result)) {
        this.processSearch();
      }
    });
  }
  viewFile(certificateFile) {
    const modalRef = this.modalService.open(ReportPreviewCertificateComponentS, LARGE_MODAL_OPTIONS);
    modalRef.componentInstance.file = certificateFile;
    modalRef.componentInstance.isBlobFile = false;
  }
}
