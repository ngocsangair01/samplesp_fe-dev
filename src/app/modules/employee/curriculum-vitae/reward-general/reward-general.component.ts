
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';
import { CommonUtils } from '@app/shared/services';
import { RewardGeneralService } from '@app/core/services/reward-general/reward-general.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '@app/app.component';
import { ReportPreviewCertificateComponent } from './reward-general-preview/report-preview-certificate'
import { RewardGeneralModalComponent } from '@app/shared/components/reward-general-modal/reward-general-modal.component';
import { DEFAULT_MODAL_OPTIONS, LOAI_DOI_TUONG_KHEN_THUONG, LARGE_MODAL_OPTIONS } from '@app/core';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';

@Component({
  selector: 'reward-general',
  templateUrl: './reward-general.component.html',
  styleUrls: ['./reward-general.component.css']
})
export class RewardGeneralComponent extends BaseComponent implements OnInit {
  employeeId: number;
  resultList: any;
  hideEmployeeReward: boolean = false;
  formConfig = {
    objectId: [''],
    rewardObjectType: [LOAI_DOI_TUONG_KHEN_THUONG.CA_NHAN],
  };
  constructor(
    private rewardGeneralService: RewardGeneralService,
    private modalService: NgbModal,
    private employeeResolver: EmployeeResolver,
    private app: AppComponent,
    private curriculumVitaeService: CurriculumVitaeService
  ) {
    super(null,  CommonUtils.getPermissionCode("resource.rewardGeneral"));
    this.setMainService(rewardGeneralService);
    this.employeeResolver.EMPLOYEE.subscribe(
      data => {
        if (data) {
          this.employeeId = data;
          this.formSearch = this.buildForm({ objectId: this.employeeId }, this.formConfig);
          this.processSearchDetail();
        }
      }
    );
  }

  ngOnInit() {
    this.curriculumVitaeService.selectMenuItem.subscribe(res => {
      let element = document.getElementById(res);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    })
  }

  public processSearchDetail(event?): void {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const params = this.formSearch ? this.formSearch.value : null;
    this.rewardGeneralService.processSearch3(params, event).subscribe(res => {
      this.resultList = res;
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }

  onTablePageChange(event) {
    const param = {first: 0, rows: event};
    this.changeRow = event;
    this.processSearchDetail(param)
  }

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
          this.processSearch(null);
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
            this.processSearch(null);
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
        this.processSearch(null);
      });
    }
  }

  private activeModelView(rewardGeneralId, data) {
    const modalRef = this.modalService.open(RewardGeneralModalComponent, DEFAULT_MODAL_OPTIONS);
    if (rewardGeneralId > 0) {
      data.isView = true;
      modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
      //modalRef.componentInstance.rewardGeneralId = rewardGeneralId;
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
    const modalRef = this.modalService.open(ReportPreviewCertificateComponent, LARGE_MODAL_OPTIONS);
    modalRef.componentInstance.file = certificateFile;
    modalRef.componentInstance.isBlobFile = false;
  }
}
