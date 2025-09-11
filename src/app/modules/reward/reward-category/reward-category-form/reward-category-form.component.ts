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
@Component({
  selector: 'reward-category-form',
  templateUrl: './reward-category-form.component.html',
  styleUrls: ['./reward-category-form.component.css']
})
export class RewardCategoryFormComponent extends BaseComponent implements OnInit, AfterViewInit {
  formSave: FormGroup;
  rewardObjectTypeList: any;
  rewardTypeList: any;
  rewardGroupList: any;
  rewardCategoryTypeList: any;
  setData: Subject<any> = new Subject<any>();
  formRewardGroupInside: any;
  isView: boolean = false;
  isEdit: boolean = false;
  isInsert: boolean = false;
  isApprove: boolean = false;
  isRewardObjectType: boolean = false;
  rewardCategoryId: any;
  incomeTypeList: any;
  isAgreeToApprove: any;
  rewardTypeListByUserToInsert: any;
  formConfig = {
    lstRewardCategoryDetail: [null],
    rewardCategoryId: [null],
    rewardObjectType: [null, [ValidationService.required]],
    rewardType: [null, [ValidationService.required]],
    // rewardCategoryType: [null, [ValidationService.required]],
    code: [null],
    name: [null, [ValidationService.required]],
    rewardCategory:["1"],
    isAgreeToApprove: [null],
    rewardGroup: [null, [ValidationService.required]],
    incomeType: [],
    expriedDate: [null],
    orderNumber: [null, [Validators.min(1), Validators.max(10000)]],
    offerMoney: [null, [ValidationService.positiveInteger, ValidationService.maxLength(15)]]
  };
  constructor(
    public rewardCategoryService: RewardCategoryService,
    public rewardCategoryCentificateService: RewardCategoryCentificateService,
    public actr: ActivatedRoute,
    private router: Router,
    private app: AppComponent,
    private rewardProposeService: RewardProposeService,
    
  ) {
    super(null, CommonUtils.getPermissionCode("resource.rewardGeneral"));
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.rewardCategoryId = params.id;
        } else {
          this.setFormValue({});
        }
      }
    });
    this.incomeTypeList = [
      {name:"Miễn thuế", value: 0},
      {name:"Chịu thuế", value: 1},
    ]
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 3) {
      this.isView = subPaths[3] === 'view';
      this.isEdit = subPaths[3] === 'edit';
      this.isInsert = subPaths[3] === 'add';
      this.isApprove = subPaths[3] === 'approve';
    }
    this.setFormValue(this.rewardCategoryId);
    this.rewardObjectTypeList = APP_CONSTANTS.REWARD_OBJECT_LIST;
    this.rewardTypeList = APP_CONSTANTS.REWARD_GENERAL_TYPE_LIST;
    this.rewardCategoryTypeList = APP_CONSTANTS.REWARD_CATEGORY_TYPE_LIST;    
    this.rewardGroupList = APP_CONSTANTS.REWARD_GROUP_LIST;  
    this.rewardProposeService.getRewardTypeList().subscribe(res => {
      this.rewardTypeListByUserToInsert = this.rewardTypeList.filter((item) => {
        return res.includes(item.id)
      })
    })  
  }

  ngAfterViewInit(): void {
    
  }

  get f() {
    return this.formSave.controls;
  }

  public buildForms(data?: any) { 
    if (data.rewardCategory) {
      data.rewardCategory = data.rewardCategory.toString();
    }
    if (data.rewardObjectType === 3){
      this.isRewardObjectType = true
      data.rewardCategory = "3"
    }
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, []);
  }

  public goBack() {
    this.router.navigate(['/reward/reward-category']);
  }

  public goView(rewardCategoryId: any) {
    this.router.navigate([`/reward/reward-category/view/${rewardCategoryId}`]);
  }

  /**
   * setFormValue
   * param data
   */
  public setFormValue(data?: any) {
    this.buildForms({});
    if (data && data > 0) {
      this.rewardCategoryService.findOne(data).subscribe(res => {
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
    if (CommonUtils.isValidForm(this.formSave) && CommonUtils.isValidForm(this.formRewardGroupInside)) {   
      const saveData = this.formSave.value;
      const rewardForm = {};      
      if( this.formRewardGroupInside.value.length >= 2){
        for (let i = 0; i <  this.formRewardGroupInside.value.length-1; i++) {
          const startDate1 =  this.formRewardGroupInside.value[i].effectiveDate;
          const endDate1 =  this.formRewardGroupInside.value[i].expritedDate
          for (let j = i+1; j <  this.formRewardGroupInside.value.length; j++) {
            const startDate2 =  this.formRewardGroupInside.value[j].effectiveDate;
            const endDate2 =  this.formRewardGroupInside.value[j].expritedDate;
            if(CommonUtils.isConflictDate(startDate1,endDate1,startDate2,endDate2) == true 
                || (startDate1 === startDate2 && endDate1 === endDate2) || endDate1 === startDate2){
              this.app.warningMessage('conflictDate');
              return;
            }
          }
        }
      }
      rewardForm['rewardCategoryId'] = saveData.rewardCategoryId;
      const lstRewardCategoryDetail = [];
      if(saveData.rewardObjectType == 3){
        saveData.incomeType = ''
      }else{
        this.formRewardGroupInside.value.forEach(data => {
          lstRewardCategoryDetail.push(data);
        })
      }
      this.app.confirmMessage(null, () => { // on accepted        
        saveData.lstRewardCategoryDetail = lstRewardCategoryDetail  
        this.rewardCategoryService.saveOrUpdateFormFile(saveData)
        .subscribe(res => {
          if (this.rewardCategoryService.requestIsSuccess(res) && res.data && res.data.rewardCategoryId) {
            this.goView(res.data.rewardCategoryId);
          }
        });
      }, (e) => {
        // on rejected           
        });
    }
    
  }
  
  public getFormRewardGroupInside(event) {    
    this.formRewardGroupInside = event;
  }

  public changeRewardObjectType(){
    if(this.formSave.get('rewardObjectType').value === 3){
      this.isRewardObjectType = true
      this.formSave.get('rewardCategory').setValue("3")
    }else{
      this.isRewardObjectType = false
    }
  }

  navigate() {
    this.router.navigate(['/reward/reward-category/edit', this.rewardCategoryId]);
  }
}
