import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { HrStorage } from '@app/core/services/HrStorage';
import { RewardThoughtReportService } from '@app/core/services/propaganda/reward-thought-report.service';
import { CategoryTypeService } from '@app/core/services/setting/category-type.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services/common-utils.service';

@Component({
  selector: 'reward-thought-report-search',
  templateUrl: './reward-thought-report-search.component.html',
  styleUrls: ['./reward-thought-report-search.component.css']
})
export class RewardThoughtReportSearchComponent extends BaseComponent implements OnInit {

  formSearch: FormGroup;
  listStatus: any;
  groupTypeOfExpression: any;
  typeOfExpressionList: any;
  typeOfExpression: any;
  resultList: any;
  operationKey = 'action.view';
  adResourceKey = 'resource.propagandaRewardThoughtReport';
  formconfig = {
    orgEovId: [HrStorage.getDefaultDomainByCode(CommonUtils.getPermissionCode(this.operationKey),
      CommonUtils.getPermissionCode(this.adResourceKey))],
    categoryId: [''],
    categoryTypeId: [''],
    eovTypeLevel: [0],
    status: [''],
    timeFromDate: [''],
    timeToDate: [''],
    idEmployeeLQ: [''],
    idEmployeeNTN: [''],
    idOrgDVVP: [''],
    idEmployeeNVVP: [''],
    eovListName: [''],
    isOrgEovId: [false],
    isCategoryId: [false],
    isCategoryTypeId: [false],
    isStatus: [false],
    isTimeFromDate: [false],
    isTimeToDate: [false],
    isIdEmployeeLQ: [false],
    isIdEmployeeNTN: [false],
    isIdOrgDVVP: [false],
    isIdEmployeeNVVP: [false],
    isEovListName: [false],
    isEovTypeLevel: [false]
  }

  constructor(
    private rewardThoughtReportService: RewardThoughtReportService,
    private categoryTypeService: CategoryTypeService,
    private app: AppComponent,
    private router: Router
  ) {
    super(null, CommonUtils.getPermissionCode("resource.propagandaRewardThoughtReport"));
    this.setMainService(rewardThoughtReportService);
    this.formSearch = this.buildForm({}, this.formconfig, ACTION_FORM.VIEW);
    this.listStatus = APP_CONSTANTS.STATUS_REWARD_THOUGHT_REPORT;
    this.categoryTypeService.findByGroupId(APP_CONSTANTS.CATEGORY_TYPE_GROUP.BHTT).subscribe(res => {
      this.groupTypeOfExpression = res.data;
    });
  }

  ngOnInit() {
    this.processSearch();
  }

  get f() {
    return this.formSearch.controls;
  }

  public testDetail() {
    this.router.navigate(['/propaganda/reward-thought-report/detail'])
  }
  public prepareSaveOrUpdate(item?: any) {
    this.router.navigate(['/propaganda/reward-thought-report/add']);
  }

  // thangdt detail
  public getDetaiLById(item?: any) {
    if (item && item.eovListId > 0) {
      this.rewardThoughtReportService.getDetailById(item.eovListId)
        .subscribe(res => {
          if (res.data != null) {
            this.router.navigate(['/propaganda/reward-thought-report/', item.eovListId, 'view']);
          }
        })
    }
  }

  public getUpdate() {
    this.router.navigate(['/propaganda/reward-thought-report/update']);
  }

  // thangdt detail
  public getDetailRequestById(item?: any) {
    if (item && item.eovListId > 0) {
      this.rewardThoughtReportService.getDetailById(item.eovListId)
        .subscribe(res => {
          if (res.data != null) {
            this.router.navigate(['/propaganda/reward-thought-report/', item.eovListId, 'update']);
          }
        })
    }
  }

  // thangdt detail
  public getDetailUpdate(item?: any) {
    if (item && item.eovListId > 0) {
      this.rewardThoughtReportService.getDetailById(item.eovListId)
        .subscribe(res => {
          if (res.data != null) {
            this.router.navigate(['/propaganda/reward-thought-report/update/', item.eovListId]);
          }
        })
    }
  }

  getTypeOfExpression() {
    if (this.formSearch.value.categoryTypeId != '') {
      const param = CommonUtils.buildParams({ categoryTypeId: this.formSearch.value.categoryTypeId });
      this.rewardThoughtReportService.getTypeOfExpression(param).subscribe(res => {
        this.typeOfExpressionList = res;
      })
    }
  }

  processDelete(item) {
    if (item && item.eovListId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.rewardThoughtReportService.deleteById(item.eovListId)
          .subscribe(res => {
            if (this.rewardThoughtReportService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      }, () => {// on rejected
      });
    }
  }

  sendSms(eovListId) {
    this.app.confirmMessage('propaganda.thoughtReport.confirmSendSms', () => { // accept
      this.rewardThoughtReportService.sendSms(eovListId).subscribe(res => {
        if (this.rewardThoughtReportService.requestIsSuccess(res)) {
          this.processSearch();
        }
      })
    }, () => {
      // reject
    })
  }
  public processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.rewardThoughtReportService.export(params).subscribe(res => {
      saveAs(res, 'danh_sach_phan_anh_bieu_hien_tu_tuong.xlsx');
    });
  }
}
