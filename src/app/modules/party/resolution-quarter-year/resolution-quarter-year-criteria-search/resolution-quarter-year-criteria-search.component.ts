import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { CriteriaPlanService } from './../../../../core/services/party-organization/criteria-plan.service';

@Component({
  selector: 'resolution-quarter-year-criteria-search',
  templateUrl: './resolution-quarter-year-criteria-search.component.html',
  styleUrls: ['./resolution-quarter-year-criteria-search.component.css']
})
export class ResolutionQuarterYearCriteriaSearchComponent extends BaseComponent implements OnInit {

  formSearch: FormGroup;
  formSearchConfig = {
    resolutionsName: ['', ValidationService.maxLength(200)],
    criteriaName: ['', ValidationService.maxLength(200)],
    status: [''],
    isResolutionsName: [false],
    isCriteriaName: [false],
    isStatus: [false]
  };
  navigationSubscription: any;
  isMobileScreen: boolean = false;
  constructor(
    private router: Router
    , public actr: ActivatedRoute
    , private criteriaPlanService: CriteriaPlanService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.requestResolutionQuarterYear"));
    this.setMainService(criteriaPlanService);
    this.buildFormSearch({});
    this.processSearch();
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {

  }

  get f() {
    return this.formSearch.controls;
  }

  /**
   * buildFormCriteria
   * @param event
   */
  private buildFormSearch(data?: any, validate?: boolean): void {
    this.formSearch = this.buildForm(data, this.formSearchConfig);
  }

  /**
   * Thực hiện tiêu chí (Nhập nội dung tiêu chí)
   * @param item 
   */
  public performCriteria(item) {
    if (!item) {
      return;
    }
    this.router.navigate(['/party-organization/resolution-quarter-year/cate-criteria/', item.requestResolutionsId, 'perform-criteria', item.cateCriteriaId]);
  }
}
