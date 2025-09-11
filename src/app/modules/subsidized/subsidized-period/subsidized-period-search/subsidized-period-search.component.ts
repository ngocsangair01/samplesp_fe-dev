import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, OrganizationService } from '@app/core';
import { HrStorage } from '@app/core/services/HrStorage';
import { CatAllowanceService } from '@app/core/services/subsidized/cat-allowance.service';
import { SubsidizedPeriodService } from '@app/core/services/subsidized/subsidized-period.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'subsidized-period-search',
  templateUrl: './subsidized-period-search.component.html',
  styleUrls: ['./subsidized-period-search.component.css']
})
export class SubsidizedPeriodSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  listYear: any;
  beneficiaryTypeList: any;
  subsidizedTypeList: any;
  operationKey = 'action.view';
  adResourceKey = 'resource.subsidized';
  private defaultDomain: any;
  formConfig = {
    subsidizedPeriodId: [null],
    name: [null],
    decisionOrgId: [null],
    beneficiaryType: [null],
    decisionYearFrom: [null],
    decisionYearTo: [null],
    subsidizedType: [null],
    subsidizedBeneficialOrgId: [null],
    isSubsidizedPeriodId: [false],
    isName: [false],
    isDecisionOrgId: [false],
    isBeneficiaryType: [false],
    isDecisionYearFrom: [false],
    isDecisionYearTo: [false],
    isSubsidizedType: [false],
    isSubsidizedBeneficialOrgId: [false]
  };

  constructor(
    private subsidizedPeriodService: SubsidizedPeriodService,
    private catAllowanceService: CatAllowanceService,
    private router: Router,
    private fb: FormBuilder,
    private service: OrganizationService,
    private app: AppComponent,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.subsidized"));
    this.setMainService(this.subsidizedPeriodService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [(ValidationService.notAffter('decisionYearFrom', 'decisionYearTo', 'subsidizedPeriod.label.decisionYearTo'))]);
    this.catAllowanceService.getDataForDropdownCatAllowance({}).subscribe(res => {
      this.subsidizedTypeList = res;
    });
    this.listYear = this.getYearList();

    this.beneficiaryTypeList = APP_CONSTANTS.BENEFCIARY_TYPE_LIST;
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
          // if (data) {
          //   this.f['subsidizedBeneficialOrgId'].setValue(data.subsidizedBeneficialOrgId);
          // }
          this.processSearch();
        });
    } else {
      this.processSearch();
    }
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
    if (item && item.subsidizedPeriodId > 0) {
      this.subsidizedPeriodService.findOne(item.subsidizedPeriodId).subscribe(res => {
        if (res.data != null) {
          this.router.navigate(['/subsidized/subsidized-period/edit/', item.subsidizedPeriodId]);
        } else {
          this.processSearch();
          return;
        }
      });
    } else {
      this.router.navigate(['/subsidized/subsidized-period/add']);
    }
  }

  public processView(item) {
    this.subsidizedPeriodService.findOne(item.subsidizedPeriodId)
      .subscribe(res => {
        if (res.data != null) {
          this.router.navigate(['/subsidized/subsidized-period/view/', item.subsidizedPeriodId]);
        } else {
          this.processSearch();
          return;
        }
      });
  }

  public processDelete(item) {
    if (item && item.subsidizedPeriodId > 0) {
      this.subsidizedPeriodService.findOne(item.subsidizedPeriodId)
        .subscribe(res => {
          if (res.data != null) {
            this.app.confirmDelete(null, () => { // accept
              this.subsidizedPeriodService.deleteById(item.subsidizedPeriodId)
                .subscribe(res => {
                  if (this.subsidizedPeriodService.requestIsSuccess(res)) {
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
}
