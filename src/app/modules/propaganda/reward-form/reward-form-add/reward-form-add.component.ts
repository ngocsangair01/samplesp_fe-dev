import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { PropagandaRewardFormService } from '@app/core/services/propaganda/propaganda-reward-form.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ValidationService } from '@app/shared/services/validation.service';
import { AppComponent } from '../../../../app.component';
import { CommonUtils } from '../../../../shared/services/common-utils.service';

@Component({
  selector: 'reward-form-add',
  templateUrl: './reward-form-add.component.html',
  styleUrls: ['./reward-form-add.component.css']
})
export class RewardFormAddComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  view: boolean;
  update: boolean;
  lstRewardCategory: any;
  propagandaRewardFormId: any;
  formconfig = {
    propagandaRewardFormId: [''],
    code: ['', ValidationService.required],
    name: ['', ValidationService.required],
    effectiveDate: ['', ValidationService.required],
    expiredDate: [''],
    rewardCategory: ['', ValidationService.required],
    freeIncomeTax: ['', [ValidationService.required, ValidationService.number, Validators.min(0), Validators.max(100)]],
    description: [''],
  }

  constructor(
    private propagandaRewardFormService: PropagandaRewardFormService,
    private router: Router,
    public actr: ActivatedRoute,
    private app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode("resource.propagandaRewardForm"));
    this.lstRewardCategory = APP_CONSTANTS.REWARDCATEGORYLIST;
    this.actr.params.subscribe(params => {
      if (params && params.id != null) {
        this.propagandaRewardFormId = params.id;
      }
    });
    this.buildForms({});
  }

  get f() {
    return this.formSave.controls;
  }

  ngOnInit() {
    this.setFormValue(this.propagandaRewardFormId);
    const subPaths = this.router.url.split('/');
    if (subPaths.length >= 3) {
      if (subPaths[3] == 'view') {
        this.view = true;
      } else if (subPaths[3] == 'edit') {
        this.update = true;
      }
    }
  }

  public buildForms(data?: any) {
    this.formSave = this.buildForm(data, this.formconfig, ACTION_FORM.INSERT,
      [ValidationService.notAffter('effectiveDate', 'expiredDate', 'massOrganization.check.expiredDate')]);
  }

  public setFormValue(data?: any) {
    if (data && data > 0) {
      this.propagandaRewardFormService.findOne(data).subscribe(res => {
        this.buildForms(res.data);
      });
    }
  }

  public goBack() {
    this.router.navigate(['/propaganda/reward-form']);
  }

  public processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.app.confirmMessage(null, () => {
      this.propagandaRewardFormService.saveOrUpdate(this.formSave.value).subscribe(res => {
        if (this.propagandaRewardFormService.requestIsSuccess(res)) {
          this.router.navigate(['/propaganda/reward-form']);
        }
      })
    }, () => { // on rejected

    });
  }
}