import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { RewardCategoryCentificateService } from '@app/core/services/reward-category/reward-category-centificate.service';
import { RewardCategoryService } from '@app/core/services/reward-category/reward-category.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';
import {RewardCategoryFunding} from "@app/core/services/reward-category/reward-category-funding";
@Component({
  selector: 'reward-category-funding-form',
  templateUrl: './reward-category-funding-form.component.html',
  styleUrls: ['./reward-category-funding-form.component.css']
})
export class RewardCategoryFundingFormComponent extends BaseComponent implements OnInit, AfterViewInit {
  formSave: FormGroup;
  isView: boolean = false;
  isEdit: boolean = false;
  isInsert: boolean = false;
  isApprove: boolean = false;

  isDefaultF03 : boolean = false;
  fundingCategoryId : any;

  formConfig = {
    fundingCategoryId: [''],
    funding: ['', Validators.required],
    fundingCode: ['', Validators.required],
    expriedDate: [''],
    accountAllowanceIndepenent: [''],
    accountPartyFees: [''],
    accountInKind: [''],
    accountInCash: [''],
    accountDepenUnplan: [''],
    accountDepenPlan: [''],
    accountDepenActive: [''],
    accountIndepenUnplan: [''],
    accountIndepenPlan: [''],
    accountBod: [''],
    accountWelfare: [''],
    accountUnionHeadquarter: [''],
    accountUnionLocal: [''],
    accountUnionProvince: [''],
    accountAllowanceOther: ['']
  };
  constructor(
    public rewardCategoryFunding: RewardCategoryFunding,
    public actr: ActivatedRoute,
    private router: Router,
    private app: AppComponent,
    
  ) {
    super(null, CommonUtils.getPermissionCode("resource.rewardGeneral"));
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.fundingCategoryId = params.id;
        } else {
          this.setFormValue({});
        }
      }
    });
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 3) {
      this.isView = subPaths[3] === 'view';
      this.isEdit = subPaths[3] === 'edit';
      this.isInsert = subPaths[3] === 'add';
      this.isApprove = subPaths[3] === 'approve';
    }
    this.setFormValue(this.fundingCategoryId);
  }

  ngAfterViewInit(): void {
    
  }

  get f() {
    return this.formSave.controls;
  }

  public buildForms(data?: any) {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, []);
    this.isDefaultF03 = this.formSave.value.fundingCode.toLowerCase() == 'f03';
  }

  public goBack() {
    this.router.navigate(['/reward/reward-category-funding']);
  }

  public goView(fundingCategoryId: any) {
    this.router.navigate([`/reward/reward-category-funding/view/${fundingCategoryId}`]);
  }

  /**
   * setFormValue
   * param data
   */
  public setFormValue(data?: any) {
    this.buildForms({});
    if (data && data > 0) {
      this.rewardCategoryFunding.findOne(data).subscribe(res => {
          this.buildForms(res.data);
      })
    }
  }

  public validateFormSave() {
    let result = true;
    if (!CommonUtils.isValidForm(this.formSave)) {
      result = false;
    }
    return result;
  }

  public processSaveOrUpdate() {    
    if (CommonUtils.isValidForm(this.formSave)) {
      this.app.confirmMessage(null, () => { // on accepted
        this.rewardCategoryFunding.saveOrUpdateFormFile(this.formSave.value)
        .subscribe(res => {
          if (this.rewardCategoryFunding.requestIsSuccess(res) && res.data && res.data.fundingCategoryId) {
            this.goView(res.data.fundingCategoryId);
          }
        });
      }, (e) => {
        // on rejected           
        });
    }
  }

  public onCheckFundingCode(){
    const fundingCode = this.formSave.value.fundingCode;
    if(fundingCode.toLowerCase() == "f03"){
      this.isDefaultF03 = true;
      this.formSave.get('accountInKind').setValue('6429020101')
      this.formSave.get('accountInCash').setValue('6429020102')
      this.formSave.get('accountDepenUnplan').setValue('6429020201')
      this.formSave.get('accountDepenPlan').setValue('6429020202')
      this.formSave.get('accountDepenActive').setValue('6429020203')
      this.formSave.get('accountIndepenUnplan').setValue('6429020301')
      this.formSave.get('accountIndepenPlan').setValue('6429020302')
      this.formSave.get('accountBod').setValue('6429030000')
    }   else  if(fundingCode.toLowerCase() == "f05"){
      this.isDefaultF03 = false;
      this.formSave.get('accountWelfare').setValue('6429010401')
    }  else  if(fundingCode.toLowerCase() == "f64"){
      this.isDefaultF03 = false;
      this.formSave.get('accountUnionHeadquarter').setValue('6429051300')
      this.formSave.get('accountAllowanceIndepenent').setValue('6429010702')
      this.formSave.get('accountUnionLocal').setValue('6429051400')
      this.formSave.get('accountUnionProvince').setValue('6429051200')
    }
    else  if(fundingCode.toLowerCase() == "f72"){
      this.isDefaultF03 = false;     
      this.formSave.get('accountPartyFees').setValue('6429010401')
    }
    else {
      this.isDefaultF03 = false;
      this.formSave.get('accountInKind').setValue('')
      this.formSave.get('accountInCash').setValue('')
      this.formSave.get('accountDepenUnplan').setValue('')
      this.formSave.get('accountDepenPlan').setValue('')
      this.formSave.get('accountDepenActive').setValue('')
      this.formSave.get('accountIndepenUnplan').setValue('')
      this.formSave.get('accountIndepenPlan').setValue('')
      this.formSave.get('accountBod').setValue('')
      this.formSave.get('accountUnionHeadquarter').setValue('')
      this.formSave.get('accountUnionLocal').setValue('')
      this.formSave.get('accountUnionProvince').setValue('')
      this.formSave.get('accountWelfare').setValue('')
    }


  }

  navigate() {
    this.router.navigate(['/reward/reward-category-funding/edit', this.fundingCategoryId]);
  }
}
