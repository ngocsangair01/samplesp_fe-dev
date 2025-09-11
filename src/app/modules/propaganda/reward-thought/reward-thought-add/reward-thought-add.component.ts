import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { RewardThoughtService } from '@app/core/services/propaganda/reward-thought.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ValidationService } from '@app/shared/services/validation.service';
import { AppComponent } from '../../../../app.component';
import { CommonUtils } from '../../../../shared/services/common-utils.service';

@Component({
  selector: 'reward-thought-add',
  templateUrl: './reward-thought-add.component.html',
  styleUrls: ['./reward-thoungt.css']
})
export class RewardThoughtmAddComponent extends BaseComponent implements OnInit {

  formSave: FormGroup;
  view: boolean;
  update: boolean;
  lstRewardCategory: any;
  categoryId: any;
  listStatus: any;
  firstTitle: any;
  lastTitle: any;
  formConfig = {
    categoryId: [''],
    code: ['',  ValidationService.required],
    name: ['',  ValidationService.required],
    categoryTypeId: ['',  ValidationService.required],
    classify: ['',  ValidationService.required],
    eovTypeLevel: ['', ValidationService.required],
    effectiveDate: ['', ValidationService.required],
    expiredDate: [''],
    description: [''],
  }
  constructor(
    private rewardThoughtService: RewardThoughtService,
    private router: Router,
    public actr: ActivatedRoute,
    private app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode("resource.propagandaRewardThought"));
    this.lstRewardCategory = APP_CONSTANTS.REWARDCATEGORYLIST;
    this.actr.params.subscribe(params => {
      if (params && params.id != null) {
        this.categoryId = params.id;
      }
    });
    this.buildForms({});

  }
  get f() {
    return this.formSave.controls;
  }
  ngOnInit() {
    this.getTypeOfExpression();
    this.setFormValue(this.categoryId);
    const subPaths = this.router.url.split('/');
    if (subPaths.length >= 3) {
      if (subPaths[4] == 'view-detail') {
        this.view = true;
      } else if (subPaths[4] == 'edit') {
        this.update = true;
      }
    }
    if (this.view) {
      this.firstTitle = 'ui-g-12 ui-md-3 ui-lg-2 control-label vt-align-right';
      this.lastTitle = 'ui-g-12 ui-md-3 ui-lg-3 control-label vt-align-right';
    } else {
      this.firstTitle = 'ui-g-12 ui-md-3 ui-lg-2 control-label vt-align-right required';
      this.lastTitle = 'ui-g-12 ui-md-3 ui-lg-3 control-label vt-align-right required';
    }
  }
  public buildForms(data?: any) {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT,
      [ValidationService.notAffter('effectiveDate', 'expiredDate', 'massOrganization.check.expiredDate')]);
  }
  public setFormValue(data?: any) {
    if (data && data > 0) {
      this.rewardThoughtService.findOne(data).subscribe(res => {
        this.buildForms(res.data);
      });
    }
  }
  public goBack() {
    this.router.navigate(['/propaganda/reward-thought']);
  }
  public processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    const formSave = {};
    formSave['categoryId'] = this.categoryId;
    formSave['code'] = this.formSave.get('code').value;
    formSave['name'] = this.formSave.get('name').value;
    formSave['categoryTypeId'] = this.formSave.get('categoryTypeId').value;
    formSave['classify'] = this.formSave.get('classify').value;
    formSave['effectiveDate'] = this.formSave.get('effectiveDate').value;
    formSave['expiredDate'] = this.formSave.get('expiredDate').value;
    formSave['description'] = this.formSave.get('description').value;
    this.app.confirmMessage(null, () => {
      this.rewardThoughtService.saveOrUpdate(this.formSave.value).subscribe(res => {
        if (this.rewardThoughtService.requestIsSuccess(res) && res.data && res.data.categoryId) {
          this.router.navigate([`/propaganda/reward-thought/${res.data.categoryId}/view-detail`]);
        }
      })
    }, () => { // on rejected

    })
  }

  public getTypeOfExpression(vtCriticalId?: string) {
    this.rewardThoughtService.getTypeOfExpression()
      .subscribe(res => {
        var listType = [];
        for (var i = 0; i < res.data.length; i++) {
          listType.push({ itemName: res.data[i].name, itemValue: res.data[i].categoryTypeId })
        }
        this.listStatus = listType
      })
  }

  navigate() {
    this.router.navigate(['/propaganda/reward-thought', this.categoryId, 'edit']);
  }
}