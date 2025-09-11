import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS, LOAI_DANH_MUC_KHEN_THUONG, NHOM_KHEN_THUONG } from '@app/core';
import { RewardCategoryService } from '@app/core/services/reward-category/reward-category.service';
import { RewardGeneralService } from '@app/core/services/reward-general/reward-general.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { FileControl } from '@app/core/models/file.control';
import { Subject } from 'rxjs';
import { RewardProposeSignService } from '@app/core/services/reward-propose-sign/reward-propose-sign.service';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';
import {AppParamService} from "@app/core/services/app-param/app-param.service";


@Component({
  selector: 'reward-general-modal',
  templateUrl: './reward-general-modal.component.html',
  styleUrls: ['./reward-general-modal.component.css']
})
export class RewardGeneralModalComponent extends BaseComponent implements OnInit {
  @Input() resetFormSubject: Subject<number> = new Subject<number>();
  formSave: FormGroup;
  rewardObjectTypeList = [];
  rewardTitleIdListTemp = []
  rewardTypeList = [];
  periodTypeList = [];
  public yearList: Array<number>;
  rewardTitleIdList = [];
  isInsideList = [
    {id: 1, name: "Trong TĐ"},
    {id: 0, name: "Ngoài TĐ"}
  ];
  decisionList: any;
  isRequiredDecision: boolean = false;
  isRequiredIsInside: boolean = false;
  isFormView = false;
  rewardCategoryType = {
    cap: 1,
    danhHieu: 2,
    hinhThuc: 3
  };
  branch: any;
  rewardCategoryList: any;
  rewardTypeListByUserToInsert: any;
  formConfig = {
    rewardObjectType: ['', [ValidationService.required]],
    rewardType: ['', [ValidationService.required]],
    rewardGeneralId: [''],
    rewardTitleName: [''],
    rewardTitleId: ['', [ValidationService.required]],
    decisionNumber: ['', [ValidationService.required]],
    decisionDate: ['', [ValidationService.required, ValidationService.beforeCurrentDate]],
    decisionYear: [parseInt(moment(new Date()).format('YYYY')), [ValidationService.required]],
    periodType: ['', [ValidationService.required]],
    objectId: ['', [ValidationService.required]],
    organizationId: [''],
    rewardMoney: ['', [ValidationService.positiveInteger, ValidationService.maxLength(15)]],
    description: ['', [ValidationService.maxLength(200)]],
    organizationName: [''],
    employeeCode: [''],
    employeeName: [''],
    objectName: [''],
    decisionId: [''],
    decisionName: [''],
    positionName: [''],
    isInside: [1],
    rewardCategory: ['', [ValidationService.required]],
  };

  constructor(
    public actr: ActivatedRoute,
    public activeModal: NgbActiveModal,
    private rewardGeneralService: RewardGeneralService,
    private rewardCategoryService: RewardCategoryService,
    private app: AppComponent,
    private rewardProposeService: RewardProposeService,
    public RewardProposeSignService: RewardProposeSignService,
    private appParamService : AppParamService,
  ) {
    super();
    this.formSave = this.buildForm({}, this.formConfig);
    this.yearList = this.getYearList();
    this.rewardObjectTypeList = APP_CONSTANTS.REWARD_OBJECT_LIST;
    this.rewardTypeList = APP_CONSTANTS.REWARD_GENERAL_TYPE_LIST;
    this.periodTypeList = APP_CONSTANTS.REWARD_PERIOD_TYPE_LIST;
    this.rewardCategoryList = APP_CONSTANTS.REWARD_CATEGORY;
  }

  ngOnInit() {
    this.loadSelectBox(this.formSave.value.rewardObjectType, this.formSave.value.rewardType);
    this.getListRewardTitle(this.formSave.value.rewardObjectType, this.formSave.value.rewardType);
    this.appParamService.findAllByParType("EXTERNAL_REWARD_CODE").subscribe(res =>{
      this.decisionList = res.data
    })
    this.rewardProposeService.getRewardTypeList().subscribe(res => {
      this.rewardTypeListByUserToInsert = this.rewardTypeList.filter((item) => {
        return res.includes(item.id)
      })
    })  
  }

  processSaveOrUpdate() {
    this.isRequiredDecision = false;
    this.isRequiredIsInside = false;
    if (this.formSave.controls['isInside'].value == null) {
      this.isRequiredIsInside = true;
    }
    if(this.formSave.controls['isInside'].value != null && this.formSave.controls['isInside'].value === 0 && !this.formSave.controls['decisionId'].value){
      this.isRequiredDecision = true;
    }
    if(this.formSave.controls['isInside'].value != null && this.formSave.controls['isInside'].value === 0 && this.formSave.controls['decisionId'].value){
      this.formSave.controls['decisionName'].setValue(this.decisionList.filter(item => item.parId === this.formSave.controls['decisionId'].value)[0].parValue)
    }
    if (!CommonUtils.isValidForm(this.formSave) || this.isRequiredDecision || this.isRequiredIsInside) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.rewardGeneralService.saveOrUpdateFormFile(this.formSave.value)
        .subscribe(res => {
          if (this.rewardGeneralService.requestIsSuccess(res)) {
            this.activeModal.close(res);
          }
        });
    }, () => {// on rejected
    });
  }

  get f() {
    return this.formSave.controls;
  }

  public setFormValue(propertyConfigs: any, data?: any) {
    this.propertyConfigs = propertyConfigs;
    this.formSave = this.buildForm(data, this.formConfig);
    const fileControl = new FileControl(null);
    if (data && data.isView) {
      this.isFormView = data.isView;
    }
    if (data && data.fileAttachment) {
      if (data.fileAttachment.attachedFiles) {
        fileControl.setFileAttachment(data.fileAttachment.attachedFiles);
      }
    }
    this.formSave.addControl('attachedFiles', fileControl);
  }

  private getYearList() {
    const yearList = [];
    const currentYear = new Date().getFullYear();
    for (let i = (currentYear - 20); i <= currentYear; i++) {
      const obj = {
        decisionYear: i
      };
      yearList.push(obj);
    }
    return yearList;
  }

  loadSelectBox(rewardObjectType: number, rewardType: any) {
    let isInside = this.formSave.controls['isInside'].value;
    this.rewardCategoryService.getListRewardCategory({rewardGroup: isInside != null && isInside === 1? NHOM_KHEN_THUONG.TRONG_TAP_DOAN : NHOM_KHEN_THUONG.NGOAI_TAP_DOAN,
      rewardObjectType: rewardObjectType, rewardType: rewardType}).subscribe(res => {
      let rewardTitleIdArr = [];
      res.forEach(element => {
        if (element.rewardObjectType == rewardObjectType) {
          rewardTitleIdArr.push(element);
        }
      });
      this.rewardTitleIdList = rewardTitleIdArr;
    });
  }

  onChangeRewardType() {
    let rewardType = this.formSave.controls['rewardType'].value;
    if (rewardType != null) {
      if (rewardType != null)
        this.resetFormSubject.next(rewardType);
    } else {
      this.formSave.patchValue({
        rewardTitleId: null
      });
      this.rewardTitleIdList = [];
    }
    this.loadSelectBox(this.formSave.value.rewardObjectType, rewardType);
    this.getListRewardTitle(this.formSave.value.rewardObjectType, rewardType);
  }

  public getListRewardTitle(rewardObjectType: number, rewardType: any) {
    // lay danh hieu khen thuong
    let isInside = this.formSave.controls['isInside'].value;
    const data = {rewardGroup: isInside != null && isInside === 1? NHOM_KHEN_THUONG.TRONG_TAP_DOAN : NHOM_KHEN_THUONG.NGOAI_TAP_DOAN, rewardObjectType: rewardObjectType, rewardType: rewardType};
    this.rewardCategoryService.getListRewardCategory(data).subscribe(res => {
      let rewardTitleIdArr = [];
      res.forEach(element => {
        if (element.rewardObjectType == rewardObjectType) {
          rewardTitleIdArr.push(element);
        }
      });
      this.rewardTitleIdListTemp = rewardTitleIdArr;
    })
  }
  public handleChaneValue() {
    const rewardCategory = this.formSave.controls['rewardCategory'].value;
    if (rewardCategory) {
      this.rewardTitleIdList = this.rewardTitleIdListTemp.filter(e => e.rewardCategory == rewardCategory)
    }

  }
  public genData(){
    let dateString = this.formSave.value.decisionDate ? moment(new Date(this.formSave.value.decisionDate)).format('DD/MM/YYYY') : null;
    if (dateString) {
      const formData = {
        employeeId: this.formSave.controls.objectId.value,
        closingDate: dateString
      }
      this.RewardProposeSignService.findUnitWork(formData).subscribe(res => {
          if(res.data.organizationName) {
            this.formSave.controls.organizationName.setValue(res.data.organizationName);
            this.formSave.controls.organizationId.setValue(res.data.organizationId);
          }
      })
    } else {
      this.formSave.controls.organizationName.setValue(null);
      this.formSave.controls.organizationId.setValue(null);
    }
  }
  getAmountOfMoney(item) {
    const rewardTitleId = item.controls['rewardTitleId'].value;
    const amountOfMoney = this.rewardTitleIdList.find(e => e.rewardCategoryId == rewardTitleId).offerMoney;
    item.controls['rewardMoney'].setValue(amountOfMoney);
  }
}
