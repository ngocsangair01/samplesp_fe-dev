import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM } from '@app/core';
import { FundManagementService } from '@app/core/services/fund/fund-management.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { FundHistoryActivityComponent } from './fund-history-activity/fund-history-activity.component';
import { FundHistoryContributionComponent } from './fund-history-contribution/fund-history-contribution.component';


@Component({
  selector: 'fund-history-index',
  templateUrl: './fund-history-index.component.html',
  styleUrls: ['./fund-management-index.css']
})
export class FundHistoryIndexComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  fundManagementId: any;
  isUpdate = false;
  isInsert = false;
  activeTab = 1;
  formConfig = {
    fundManagementId: [''],
    name: [''],
    totalContributionMoney: [''],
    totalActivityMoney: [''],
    contributionSearchKeyWord: [''],
    activitySearchKeyWord: [''],
  };
  @ViewChild('lstFundContribution') lstFundContribution: FundHistoryContributionComponent;
  @ViewChild('lstFundActivity') lstFundActivity: FundHistoryActivityComponent;
  constructor(
    private router: Router,
    private fundManagementService: FundManagementService,
    public actr: ActivatedRoute,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.fundManagement"));
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.fundManagementId = params.id;
        }
      }
    });
  }

  ngOnInit() {
    this.buildForms({});
    this.setFormValue(this.fundManagementId);
  }

  get f() {
    return this.formSave.controls;
  }

  public goBack() {
    this.router.navigate(['/fund/fund-management']);
  }

  /**
   * buildForm
   */
  private buildForms(data?: any): void {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, []);
  }

  /**
   * setFormValue
   * param data
   */
  public setFormValue(data?: any) {
    if (data && data > 0) {
      this.fundManagementService.findHistoryfund({ fundManagementId: data})
        .subscribe(res => {
          this.buildForms(res.data);
        });
    }
  }

  public onSelectTab(e) {
    this.activeTab = e.index + 1;
  }
}