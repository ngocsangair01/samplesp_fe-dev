import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { PropagandaRewardFormService } from '@app/core/services/propaganda/propaganda-reward-form.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { ValidationService } from '@app/shared/services/validation.service';
import { ACTION_FORM, APP_CONSTANTS } from '../../../../core/app-config';

@Component({
  selector: 'reward-form-search',
  templateUrl: './reward-form-search.component.html',
  styleUrls: ['./reward-form-search.component.css']
})
export class RewardFormSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  lstRewardCategory: any;
  resultList: any;
  formConfig = {
    propagandaRewardFormId: [null],
    code: [null],
    name: [null],
    effectiveDate: [null],
    toEffectiveDate: [null],
    listRewardCategoryChoose: [null],
    freeIncomeTax: [null],
    description: [null],
  }

  constructor(
    private propagandaRewardFormService: PropagandaRewardFormService,
    private router: Router,
    private app: AppComponent,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.propagandaRewardForm"));
    this.setMainService(propagandaRewardFormService);
    this.lstRewardCategory = APP_CONSTANTS.REWARDCATEGORYLIST;
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('effectiveDate', 'toEffectiveDate', 'common.label.toDate')]);
    this.processSearch();
  }

  ngOnInit() {

  }

  get f() {
    return this.formSearch.controls;
  }
  
  /**
   * prepareSaveOrUpdate
   */
  public prepareSaveOrUpdate(item?: any) {
    if (item && item.propagandaRewardFormId > 0) {
      this.propagandaRewardFormService.findOne(item.propagandaRewardFormId).subscribe(res => {
        if (res.data != null) {
          this.router.navigate(['/propaganda/reward-form/edit/', item.propagandaRewardFormId]);
        }
      });
    } else {
      this.router.navigate(['/propaganda/reward-form/add'])
    }
  }

  public processView(item, view) {
    if (view) {
      this.propagandaRewardFormService.findOne(item.propagandaRewardFormId)
        .subscribe(res => {
          if (res.data != null) {
            this.router.navigate(['/propaganda/reward-form/view/', item.propagandaRewardFormId]);
          }
        });
    }
  }

  public processDelete(item) {
    if (item && item.propagandaRewardFormId > 0) {
      this.app.confirmDelete(null, () => { // accept
        this.propagandaRewardFormService.deleteById(item.propagandaRewardFormId)
          .subscribe(res => {
            if (this.propagandaRewardFormService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          })
      }, () => {
        // on rejected
      })
    }
  }

  public processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.propagandaRewardFormService.export(params).subscribe(res => {
      saveAs(res, 'hinh_thuc_khen_thuong.xlsx');
    });
  }
}