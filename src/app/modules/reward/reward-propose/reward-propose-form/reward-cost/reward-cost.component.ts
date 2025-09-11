import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {FormArray, FormGroup} from "@angular/forms";
import {CommonUtils, ValidationService} from "@app/shared/services";
import {ACTION_FORM, APP_CONSTANTS, LOAI_DOI_TUONG_KHEN_THUONG, NHOM_KHEN_THUONG, RESOURCE} from "@app/core";
import {BaseComponent} from "@app/shared/components/base-component/base-component.component";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {AppComponent} from "@app/app.component";
import {AppParamService} from "@app/core/services/app-param/app-param.service";
import {NationService} from "@app/core/services/nation/nation.service";
import {PropagandaRewardFormService} from "@app/core/services/propaganda/propaganda-reward-form.service";
import {RewardCategoryService} from "@app/core/services/reward-category/reward-category.service";
import {RewardGeneralService} from "@app/core/services/reward-general/reward-general.service";
import {Observable, Subject, Subscription} from "rxjs";
import _ from 'lodash';
import {SortEvent} from "primeng/api";
import {PartyOrgSelectorComponent} from "@app/shared/components/party-org-selector/party-org-selector.component";
import {MassOrgSelectorComponent} from "@app/shared/components/mass-org-selector/mass-org-selector.component";
import {element} from "protractor";
import {RewardCategoryFunding} from "@app/core/services/reward-category/reward-category-funding";

@Component({
  selector: 'reward-cost',
  templateUrl: './reward-cost.component.html',
  styleUrls: ['./reward-cost.component.css']
})
export class RewardCostComponent extends BaseComponent implements OnInit {

  @ViewChild('signPartyOrgElement') signPartyOrgElement: PartyOrgSelectorComponent;
  @ViewChild('signMassOrgElement') signMassOrgElement: MassOrgSelectorComponent;

  @Input() pageFocus: Subject<any> = new Subject<any>();
  pageFocusSubscrition: Subscription;
  @Input() resetFormSubject: Subject<number> = new Subject<number>();
  @Input() setData: Subject<any> = new Subject<any>();
  setDataSubscrition: Subscription;
  @Input() processingData: Subject<any> = new Subject<any>();
  @Input() resetFormArray: Subject<any> = new Subject<any>();
  @Input() dataRewardCost: Subject<any> = new Subject<any>();
  dataRewardCostSubscrition: Subscription;
  resetFormArraySubscrition: Subscription;
  @Input() rewardType;
  @Input() isDisable: boolean = false;
  @Output() formRewardOrgCost = new EventEmitter();
  @ViewChild('eleChooseAll') eleChooseAll: any;
  @ViewChild('eleSuggestAll') eleSuggestAll: any;

  formSave: FormGroup;
  formRewardCost : FormArray;
  numIndex = 1;
  pageSize = 50;
  isSynthetic: any;
  firstRowIndex = 0;
  rewardTypeList: any;
  residentStatusList: any;
  rewardProposeId: any;
  rewardTitleList: any;
  fundingCategoryList: any;
  branch: number;
  formConfig = {
    // proposeOrgId: [null, [ValidationService.required]],
    rewardType: [null, [ValidationService.required]],
    signOrgId: [null, [ValidationService.required]],
    employeeId: [null],
    keyword: [null]
  }
  signOrgId: any;
  // proposeOrgId: any;


  mapRewardTitleIdList: any = {};

  view: boolean;
  isView: boolean = false;
  isEdit: boolean = false;
  isViewSign: boolean = false;
  isEditSign: boolean = false;
  isAddSign: boolean = false;
  isViewSelection: boolean = false;
  isEditSelection: boolean = false;



  constructor(
      private router: Router,
      private app: AppComponent,
      public actr: ActivatedRoute,
      public appParamService: AppParamService,
      private nationService: NationService,
      private propagandaRewardFormService: PropagandaRewardFormService,
      public rewardCategoryService: RewardCategoryService,
      public rewardGeneralService: RewardGeneralService,
      public rewardCategoryFunding: RewardCategoryFunding,
  ) {
    super(actr, RESOURCE.MASS_MEMBER, ACTION_FORM.INSERT);
    this.buildFormSave({});
    this.buildFormRewardCost();
    this.residentStatusList = APP_CONSTANTS.RESIDENT_STATUS_LIST;
    this.rewardTypeList = APP_CONSTANTS.REWARD_TYPE_LIST;
    this.propagandaRewardFormService.getAllPropagandaRewardForm().subscribe(res => {
      // this.rewardFormList = res.data;
    });
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          // this.rewardProposeId = params.id;
        }
      }
    });
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 3) {
      this.isView = subPaths[3] === 'view';
      this.isEdit = subPaths[3] === 'edit';
      this.isViewSign = subPaths[3] === 'view-sign';
      this.isEditSign = subPaths[3] === 'edit-sign';
      this.isAddSign = subPaths[3] === 'add-sign';
      this.isViewSelection = subPaths[3] === 'view-selection';
      this.isEditSelection = subPaths[3] === 'edit-selection';
    }
    this.formRewardOrgCost.emit(this.formRewardCost);
    this.resetFormArraySubscrition = this.resetFormArray.subscribe(async res => {
      this.rewardType = res.rewardType;
      this.formRewardCost.reset()
      this.buildFormRewardCost();
      this.formRewardOrgCost.emit(this.formRewardCost);
      const data = {rewardObjectType: LOAI_DOI_TUONG_KHEN_THUONG.CHI_PHI, rewardType: this.rewardType};
      this.rewardCategoryService.getListRewardCategory(data).subscribe(res =>{
        this.rewardTitleList = res
      });
      this.rewardCategoryFunding.getListRewardCategoryFunding().subscribe(res =>{
        this.fundingCategoryList = res
      });
      this.branch = res.branch;
    });
    this.setDataSubscrition = this.setData.subscribe(async res => {
      this.isSynthetic = res.data.isSynthetic;
      // await this.makeMapRewardTitleIdList();
      await this.setDataToForm(res.data.lstRewardProposeDetail);
    });
    this.dataRewardCostSubscrition = this.dataRewardCost.subscribe(async res => {
      // await this.makeMapRewardTitleIdList();
      await this.setDataToForm(res);
    });
    /**
     * thực hiện focus vào page bị lỗi
     */
    this.pageFocusSubscrition = this.pageFocus.subscribe(focus => {
      if (focus.activeIndex === 2) {
        const stt = focus.stt;
        this.firstRowIndex = parseInt(stt/this.pageSize + "") * this.pageSize;
      }
    })
  }

  public buildFormSave(data?: any) {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, [])
  }

  ngOnDestroy() {
    this.pageFocusSubscrition.unsubscribe();
    this.setDataSubscrition.unsubscribe();
    this.resetFormArraySubscrition.unsubscribe();
    this.dataRewardCostSubscrition.unsubscribe();
  }

  public initPositionForm(listData?: any) {
    this.buildFormRewardCost(listData);
  }

  public getListRewardCategory(rewardGroup: number, rewardObjectType: number, rewardType): Observable<any> {
    const data = {rewardGroup: rewardGroup, rewardObjectType: rewardObjectType, rewardType: rewardType};
    return this.rewardCategoryService.getListRewardCategory(data);
  }


  public buildFormRewardCost(listData?: any) {
    const controls = new FormArray([]);
    if (!listData || listData.length === 0) {
      // const group = this.makeDefaultForm();
      // controls.push(group);
    } else {
      const formConfig = this.makeDefaultForm();
      for (const i in listData) {
        const group = _.cloneDeep(formConfig);
        const param = listData[i];
        group.patchValue(param);
        controls.push(group);
        this.numIndex++;
      }
    }

    this.formRewardCost = controls;
  }

  private makeDefaultForm(): FormGroup {
    const group = {
      rewardProposeId: [null], // parent id
      rewardProposeDetailId: [null], // id
      objectIdsangnnMember: [null, [ValidationService.required]], // đơn vị
      rewardTitleId : [null, [ValidationService.required]],
      isHidden: true,
      amountOfMoney: [null, [ValidationService.positiveInteger, ValidationService.maxLength(15),ValidationService.required]], // số tiền
      description: [null],
      fundingCategoryId : [null, [ValidationService.required]],
      isChoose: true,
      representReceiveBonusOrgId: [null, [ValidationService.required]]
    };
    return this.buildForm({}, group);
  }

  public add() {
    const controls = this.formRewardCost as FormArray;
    this.numIndex++;
    controls.insert(controls.length, this.makeDefaultForm());
    this.sortDataTable();
    const maxPage = Math.ceil(this.formRewardCost.controls.length / this.pageSize);
    this.firstRowIndex = (maxPage - 1) * this.pageSize;
  }

  /**
   * removeGroup
   * param index
   * param item
   */
  public remove(index: number, item: FormGroup) {
    const controls = this.formRewardCost as FormArray;
    this.numIndex--;
    controls.removeAt(index);
    this.sortDataTable();
  }

  private sortDataTable() {
    const _event = {
      data: this.formRewardCost.controls,
      field: 'sortOrder',
      mode: 'single',
      order: 1
    };
    this.customSort(_event);
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      const value1 = data1.value[event.field];
      const value2 = data2.value[event.field];
      let result = null;

      if (value1 == null && value2 != null) {
        result = -1;

      } else if (value1 != null && value2 == null) {
        result = 1;
      } else if (value1 == null && value2 == null) {
        result = 0;
      } else {
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
      }
      return (event.order * result);
    });
  }

  getCurrentViewList(targetList) {
    const first = this.firstRowIndex;
    const last = this.firstRowIndex + this.pageSize;
    return targetList.slice(first, last);
  }

  // updateChooseAll(targetList) {
  //   setTimeout(() => {
  //     const currentList = this.getCurrentViewList(targetList)
  //     let isUnChecked1 = true;
  //     let isUnChecked2 = true;
  //     if (currentList.length > 0) {
  //       isUnChecked1 = currentList.some((item) => !item.controls['isChoose'].value)
  //       isUnChecked2 = currentList.some((item) => !item.controls['isSuggest'].value)
  //     }
  //     if (this.eleChooseAll && this.eleChooseAll.nativeElement) {
  //       this.eleChooseAll.nativeElement.checked = !isUnChecked1;
  //     }
  //     if (this.eleSuggestAll && this.eleSuggestAll.nativeElement) {
  //       this.eleSuggestAll.nativeElement.checked = !isUnChecked2;
  //     }
  //   }, 500)
  // }

  get f() {
    return this.formSave.controls;
  }

  public onProposeOrgChange(event) {
    this.formRewardCost.controls.forEach(element => {
      element.patchValue({
        orgName: event.name,
        organizationId: event.organizationId
      })
    })
  }

  wait(ms: number)  {
    return new Promise((resolve)=> {
      setTimeout(resolve, ms);
    });
  }

  public async setDataToForm(dataToSet) {
    const dataList = dataToSet.filter(data => data.rewardProposeDetailType == null || data.rewardProposeDetailType == 5);

    let control = new FormArray([]);
    const groupConfig = this.makeDefaultForm();
    if (this.processingData) {
      this.processingData.next({1: { total: dataList.length, status: 'begin', percent: 0}});
    }
    let i = 0;
    for (const key in dataList) {
      const element = dataList[key];
      i++;
      if (i%200 == 0) {
        if (this.processingData) {
          await this.wait(1);
          this.processingData.next({1: {total: dataList.length, status: 'processing', percent: Number((i/dataList.length)*100).toFixed(2)}});
        }
      }
      const group = _.cloneDeep(groupConfig);
      if (element.rewardProposeDetailType == null) {
        group.patchValue({
          description: element.description ? element.description : '',
          amountOfMoney: element.amountOfMoney ? element.amountOfMoney : '',
          rewardTitleId: element.rewardTitleId,
          fundingCategoryId: element.fundingCategoryId,
          representReceiveBonusOrgId: element.representReceiveBonusOrgId
        });
        control.push(group);
      } else {
        if (element.rewardProposeDetailType == 5) {
          group.patchValue({
            description: element.description ? element.description : '',
            rewardProposeDetailId: element.rewardProposeDetailId,
            amountOfMoney: element.amountOfMoney ? element.amountOfMoney : '',
            rewardTitleId: element.rewardTitleId,
            fundingCategoryId: element.fundingCategoryId,
            objectIdsangnnMember: element.objectIdsangnnMember,
            representReceiveBonusOrgId: element.representReceiveBonusOrgId
          });
          control.push(group);
        }
      }
    };
    this.formRewardCost = control;
    this.formRewardOrgCost.emit(this.formRewardCost);
    if (this.processingData) {
      await this.wait(1);
      this.processingData.next({1: {total: dataList.length, status: 'done', percent: 100}});
    }
  }

}
