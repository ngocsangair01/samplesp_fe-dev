import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { FileControl } from '@app/core/models/file.control';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { RewardThoughtReportResultService } from '@app/core/services/propaganda/reward-thought-report-result.service';
import { RewardThoughtReportService } from '@app/core/services/propaganda/reward-thought-report.service';
import { CommonUtils } from '@app/shared/services';
import { AppComponent } from '../../../../app.component';
import { BaseComponent } from '../../../../shared/components/base-component/base-component.component';

@Component({
  selector: 'reward-thought-report-index',
  templateUrl: './reward-thought-report-detail.component.html',
  styleUrls: ['./reward-thought-report-detail.component.css']
})
export class RewardThoughtReportDetailComponent extends BaseComponent implements OnInit {
  downLoadFile: boolean;
  orgCondition: String;
  formDetail: FormGroup;
  view: boolean;
  update: boolean;
  resultList: any;
  lstRewardCategory: any;
  eovListId: any;
  isShowResult: boolean = false;
  isView: boolean = true;
  formSearch: FormGroup;
  formconfig = {
    usecaseTypeName: [''],
    eovTime: [''],
    eovListName: [''],
    listEmployeeNTN: [''],
    listEmployeeKNTN: [''],
    rewardCategory: [''],
    freeIncomeTax: [''],
    description: [''],
    status: [''],
    decideDate: [''],
    fileImport: [''],
    propagandaRewardFormId: [''],
    code: [''],
    effectiveDate: [''],
    expiredDate: [''],
    listFormEovCategory: [[]],
    // categoryName: [''],
    listEmployeeVP: [''],
    listOrgGQ: [''],
    employeeName: [''],
    eovTypeLevel: [''],
    orgEovName : [''],
    reporter : [''],
    // categoryTypeName : [''],
    listEmployeeLQ : [''],
    listOrgVP : [''],
    fileBeanList: [''],
    eovListIsExplanation: [''],
    createDate: [''],
    updateDate: [''],
    notifiedDate: ['']
  }
  formSearchConfig = {
    eovListId: [''],
    eovListOrgId: ['']
  }
  constructor(
      private router: Router,
      public actr: ActivatedRoute,
      private app: AppComponent,
      private rewardThoughtReportService: RewardThoughtReportService,
      private rewardThoughtReportResultService: RewardThoughtReportResultService,
      private fileStorage: FileStorageService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.propagandaRewardThoughtHandling"));
    this.setMainService(rewardThoughtReportResultService);
    this.formDetail = this.buildForm({}, this.formconfig);
    this.formSearch = this.buildForm({}, this.formSearchConfig, ACTION_FORM.VIEW);
    this.lstRewardCategory = APP_CONSTANTS.REWARDCATEGORYLIST;
    this.actr.params.subscribe(params => {
      if (params && params.id != null) {
        this.eovListId = params.id;
      }
    });
  }
  get f() {
    return this.formDetail.controls;
  }
  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 4) {
      if (subPaths[4] === "update") {
        this.isView = false;
      }
    }
    this.formSearch.controls['eovListId'].setValue(this.eovListId);
    this.processSearch();
    this.buildFormsDetail(this.eovListId);
    this.downLoadFile = true
  }

  private buildFormsDetail(eovListId?: any) {
    if (eovListId) {
      this.rewardThoughtReportService.getDetailById(this.eovListId).subscribe(res => {
        if (res.data) {
          this.formDetail = this.buildForm(res.data, this.formconfig);
          if (res.data.fileBeanList != null) {
            const filesControl = new FileControl();
            filesControl.setFileAttachment(res.data.fileBeanList)
            this.formDetail.removeControl('fileBeanList');
            this.formDetail.addControl('fileBeanList', filesControl);
          }
          if (this.resultList && this.resultList.data) {
            this.resultList.data.forEach(e => {
              if (e.attachmentFileBeanList != null) {
                const filesControl1 = new FileControl();
                filesControl1.setFileAttachment(e.attachmentFileBeanList);
                e['attachmentfileList'] = filesControl1;
              } else {
                e['attachmentfileList'] = null;
              }
            })
          }
        }
      });
    }
  }

  public goBack() {
    this.router.navigate(['/propaganda/reward-thought-report']);
  }

  public processDownloadFile(item) {
    this.rewardThoughtReportService.processDownloadFile(item.vtCriticalId).subscribe(res => {
      saveAs(res, `${item.fileName}`);
    });
  }

  public getUpdate(item?: any){
    this.router.navigateByUrl(`${'/propaganda/reward-thought-report'}/${this.eovListId}/update/${item.eovResultId}`);
  }

  public prepareSaveOrUpdate(item?: any) {
    this.router.navigate(['/propaganda/reward-thought-report/',this.eovListId,'add']);
  }

  processDelete(item) {
    if (item && item.eovResultId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.rewardThoughtReportResultService.deleteById(item.eovResultId)
          .subscribe(res => {
            if (this.rewardThoughtReportResultService.requestIsSuccess(res)) {
              this.buildFormsDetail(this.eovListId);
            }
          });
      }, () => {// on rejected
      });
    }
  }

  /**
   * Xu ly download file trong danh sach
   */

   public downloadFile(fileData) {
    this.fileStorage.downloadFile(fileData.secretId).subscribe(res => {
      saveAs(res, fileData.fileName);
    });
  }
}
