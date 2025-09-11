import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { HrStorage } from '@app/core/services/HrStorage';
import { SubsidizedBeneficiaryService } from '@app/core/services/subsidized/subsidized-beneficiary.service';
import { SubsidizedPeriodService } from '@app/core/services/subsidized/subsidized-period.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'subsidized-result-search',
  templateUrl: './subsidized-result-search.component.html',
  styleUrls: ['./subsidized-result-search.component.css']
})
export class SubsidizedResultSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  listYear: any;
  beneficiaryTypeList: any;
  listStatus: any;
  operationKey = 'action.view';
  adResourceKey = 'resource.subsidized';
  currentYear = new Date().getFullYear();
  private defaultDomain: any;
  periodList: any;
  formConfig = {
    subsidizedPeriodId: [null, ValidationService.required],
    decisionNumber: [null, ValidationService.required],
    decisionDate: [null, ValidationService.required],
    decisionYear: [this.currentYear, ValidationService.required],
  };
  subsidizedPeriodId: any;
  resultDetailList = this.resultList;
  constructor(
    private subsidizedPeriodService: SubsidizedPeriodService,
    private app: AppComponent,
    private subsidizedBeneficiaryService: SubsidizedBeneficiaryService,
    private router: Router
  ) {
    super(null, CommonUtils.getPermissionCode("resource.subsidized"))
    this.setMainService(this.subsidizedBeneficiaryService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW, []);
    this.subsidizedPeriodService.getListSubsidizedPeriod({isReadyToSync: 1, decisionYear: this.currentYear}).subscribe(res => {
      this.periodList = res;
    });
    this.listYear = this.getYearList();
    this.listStatus = APP_CONSTANTS.SUBSIDIZED_RESULT_STATUS_LIST;
    this.beneficiaryTypeList = APP_CONSTANTS.BENEFCIARY_TYPE_LIST;
  }

  ngOnInit() {
    //Lấy miền dữ liệu mặc định theo nv đăng nhập
    this.defaultDomain = HrStorage.getDefaultDomainByCode(CommonUtils.getPermissionCode(this.operationKey)
      , CommonUtils.getPermissionCode(this.adResourceKey));
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

  public onPeriodChange() {
    let periodType = this.formSearch.value['subsidizedPeriodId'];
    this.subsidizedPeriodId = periodType;
    this.subsidizedBeneficiaryService.search(this.formSearch.value).subscribe(res => {
      this.resultList = res;
    });
  }

  public onYearChange() {
    let year = this.formSearch.value['decisionYear'];
    this.subsidizedPeriodService.getListSubsidizedPeriod({ isReadyToSync: 1, decisionYear: year }).subscribe(res => {
      this.periodList = res;
    });
    this.formSearch.controls['subsidizedPeriodId'].reset();
    this.resultList = [];
  }

  public processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    this.app.confirmMessage(null, () => { // on accepted
      this.subsidizedBeneficiaryService.syncResult(this.formSearch.value)
        .subscribe(res => {
          if (this.subsidizedBeneficiaryService.requestIsSuccess(res)) {
            this.goBack();
          }
        });
    }, () => {
      // on rejected   
    });
  }

  public goBack() {
    this.router.navigate(['/subsidized/subsidized-approve']);
  }
}
