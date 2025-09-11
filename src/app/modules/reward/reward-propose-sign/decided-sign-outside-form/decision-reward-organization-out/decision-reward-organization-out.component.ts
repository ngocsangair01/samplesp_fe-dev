import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ACTION_FORM, APP_CONSTANTS, LOAI_DANH_MUC_KHEN_THUONG, LOAI_DOI_TUONG_KHEN_THUONG, NHOM_KHEN_THUONG, RESOURCE } from '@app/core';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { RewardCategoryService } from '@app/core/services/reward-category/reward-category.service';
import { RewardGeneralService } from '@app/core/services/reward-general/reward-general.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { SortEvent } from 'primeng/api';
import { Observable, Subject, Subscription } from 'rxjs';
import _ from 'lodash';
@Component({
  selector: 'decision-reward-organization-out',
  templateUrl: './decision-reward-organization-out.component.html',
  styleUrls: ['./decision-reward-organization-out.component.css']
})
export class DecisionRewardOrganizationOutComponent extends BaseComponent implements OnInit {
  @Input() pageFocus: Subject<any> = new Subject<any>();
  pageFocusSubscription: Subscription;
  @Input() setData: Subject<any> = new Subject<any>();
  setDataSubscription: Subscription;
  @Input() resetFormArray: Subject<any> = new Subject<any>();
  resetFormArraySubscription: Subscription;
  @Input() importGroupOutsangnn: Subject<any> = new Subject<any>();
  importGroupOutsangnnSubscription: Subscription;
  @Output() formRewardOrgOutside = new EventEmitter();
  @Input() processingData: Subject<any> = new Subject<any>();
  formSearchNguoiHuong: FormGroup;
  formRewardOrgOut: FormArray;
  mapRewardTitleIdList: any = {};
  rewardType: any;
  numIndex = 1;
  isView: boolean = false;
  isEdit: boolean = false;
  isInsert: boolean = false;
  rewardCategory: any;
  firstRowIndex = 0;
  pageSize = 50;
  formSearchConfig = {
    keyword: [null]
  };

  constructor(
    private router: Router,
    public actr: ActivatedRoute,
    public appParamService: AppParamService,
    public rewardCategoryService: RewardCategoryService,
    public rewardGeneralService: RewardGeneralService
  ) {
    super(actr, RESOURCE.MASS_MEMBER, ACTION_FORM.INSERT);
    this.formSearchNguoiHuong = this.buildForm({}, this.formSearchConfig);
    this.buildFormRewardOrgOut();
  }
  ngOnDestroy() {
    this.pageFocusSubscription.unsubscribe();
    this.setDataSubscription.unsubscribe();
    this.resetFormArraySubscription.unsubscribe();
    this.importGroupOutsangnnSubscription.unsubscribe();
  }
  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 3) {
      this.isView = subPaths[4] === 'view-decision';
      this.isEdit = subPaths[4] === 'edit-decision';
      this.isInsert = subPaths[4] === 'add-decided';
    }
    this.formRewardOrgOutside.emit(this.formRewardOrgOut);
    this.resetFormArraySubscription = this.resetFormArray.subscribe(async res => {
      if(res.status && (res.status != 1 &&  res.status != 4)){
        this.isEdit = false;
        this.isView = true;
      }
      this.rewardType = res.rewardType;
      await this.makeMapRewardTitleIdList();
    });
    this.setDataSubscription = this.setData.subscribe(async res => {
      await this.makeMapRewardTitleIdList();
      await this.setDataToForm(res.data.lstRewardProposeSignObject);
    });
    this.importGroupOutsangnnSubscription = this.importGroupOutsangnn.subscribe(async res => {
      await this.makeMapRewardTitleIdList();
      await this.setDataToForm(res);
    });
    /**
     * thực hiện focus vào page bị lỗi
     */
    this.pageFocusSubscription = this.pageFocus.subscribe(focus => {
      if (focus.activeIndex === 2) {
        const stt = focus.stt;
        this.firstRowIndex = parseInt(stt/this.pageSize + "") * this.pageSize;
      }
    })
  }

  public async makeMapRewardTitleIdList() {
    if (!this.mapRewardTitleIdList[this.rewardType]) {
      this.mapRewardTitleIdList[this.rewardType] = {}
      const rewardTitleIdList = await this.getListRewardCategory(NHOM_KHEN_THUONG.TRONG_TAP_DOAN, LOAI_DOI_TUONG_KHEN_THUONG.TAP_THE, this.rewardType).toPromise();
      rewardTitleIdList.forEach(e => {
        this.mapRewardTitleIdList[this.rewardType][e.rewardCategory] = this.mapRewardTitleIdList[this.rewardType][e.rewardCategory] || [];
        this.mapRewardTitleIdList[this.rewardType][e.rewardCategory].push(e);
      })
    }
  }

  public initPositionForm(listData?: any) {
    this.buildFormRewardOrgOut(listData);
  }

  get f () {
    return this.formSearchNguoiHuong.controls;
  }

  /**
   * makeDefaultForm
   */
  private makeDefaultForm(): FormGroup {
    const group = {
      rewardProposeId: [null], // parent id
      rewardProposeDetailId: [null], // id
      objectNameGuest: [null, [ValidationService.required]], // ho va ten hoac ten to chuc
      rewardTitleId: [null, [ValidationService.required]], // id danh hieu/hinh thuc khen thuong
      amountOfMoney: [null, [ValidationService.positiveInteger, ValidationService.maxLength(15)]], // tien thuong
      description: [null, ValidationService.maxLength(2000)], // noi dung khen thuong
      accountNumber: [null,  [ValidationService.maxLength(20), ValidationService.onlyLetterNumber, ValidationService.required]], // so tai khoan
      bank: [null, [ValidationService.maxLength(255), ValidationService.required]], // ngan hang
      personalIdNumber: [null], // so cmnd, ho chieu
      personalIdIssuedDate: [null], // ngay cap cmnd, ho chieu
      personalIdIssuedPlace: [null], // noi cap cmnd, ho chieu
      nationId: [null], // quoc gia
      residencyStatus: [null], // tinh trang cu tru
      addressOrPhone: [null], // address or phone number
      rewardCategory: [""],
      rewardTitleIdList: [],
      isChoose:[null],
      isSuggest:[null],
      reason:[null],
      rewardTitleName:[null],
      isHidden: true,
      fundReservationLine: [null]
    };
    return this.buildForm({}, group);
  }

  public buildFormRewardOrgOut(listData?: any) {
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
    this.formRewardOrgOut = controls;
  }

  /**
   * addGroup
   * param index
   * param item
   */
  public add(index: number, item: FormGroup) {
    const controls = this.formRewardOrgOut as FormArray;
    this.numIndex++;
    controls.insert(controls.length, this.makeDefaultForm());
    this.sortDataTable();
    const maxPage = Math.ceil(this.formRewardOrgOut.controls.length / this.pageSize);
    this.firstRowIndex = (maxPage - 1) * this.pageSize;
  }

  /**
   * removeGroup
   * param index
   * param item
   */
  public remove(index: number, item: FormGroup) {
    const controls = this.formRewardOrgOut as FormArray;
    this.numIndex--;
    controls.removeAt(index);
    this.sortDataTable();
  }
  private sortDataTable() {
    const _event = {
      data: this.formRewardOrgOut.controls,
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

  wait(ms: number)  {
    return new Promise((resolve)=> {
      setTimeout(resolve, ms);
    });
  }
  public async setDataToForm(dataToSet) {
    const dataList = dataToSet.filter(data => data.rewardProposeDetailType == null || data.rewardProposeDetailType == 3);
    let control = new FormArray([]);
    const groupConfig = this.makeDefaultForm();
    if (this.processingData) {
      this.processingData.next({3: {rewardProposeDetailType: 3, total: dataList.length, status: 'begin', percent: 0}});
    }
    let i = 0;
    for (const key in dataList) {
      const element = dataList[key];
      i++;
      if (i%200 == 0) {
        if (this.processingData) {
          await this.wait(0);
          this.processingData.next({3: {total: dataList.length, status: 'processing', percent: Number((i/dataList.length)*100).toFixed(2)}});
        }
      }
      const group = _.cloneDeep(groupConfig);
      if (element.rewardProposeDetailType == null) {
        group.patchValue({
          description: element.description ? element.description : '',
          amountOfMoney: element.amountOfMoney ? element.amountOfMoney : '',
          rewardTitleId: element.rewardTitleId,
          bank: element.bank,
          objectNameGuest: element.objectNameGuest,
          accountNumber: element.accountNumber,
          rewardTitleName: element.rewardTitleName,
          rewardCategory: element.rewardCategory ? element.rewardCategory.toString() : null,
          isSuggest: element.isSuggest,
          isChoose: element.isChoose,
          reason: element.reason,
          fundReservationLine: element.fundReservationLine
        });
        control.push(group);
      } else {
        if (element.rewardProposeDetailType == 3) {
          let objectPatchValue = {
            rewardProposeDetailId: element.rewardProposeDetailId,
            description: element.description ? element.description : '',
            amountOfMoney: element.amountOfMoney ? element.amountOfMoney : '',
            rewardTitleId: element.rewardTitleId,
            bank: element.bank,
            objectNameGuest: element.objectNameGuest,
            accountNumber: element.accountNumber,
            rewardTitleName: element.rewardTitleName,
            rewardCategory: element.rewardCategory ? element.rewardCategory.toString() : null,
            isSuggest: element.isSuggest,
            isChoose: element.isChoose,
            reason: element.reason,
            fundReservationLine: element.fundReservationLine
          }
          group.patchValue(objectPatchValue);
          control.push(group);
        }
      }
    }
    this.formRewardOrgOut.setValidators([
      ValidationService.duplicateArray(['objectNameGuest', 'rewardTitleId'], 'rewardTitleId', 'rewardGeneral.rewardTitle'),
    ]);
    this.formRewardOrgOut = control;
    this.formRewardOrgOutside.emit(this.formRewardOrgOut);
    if (this.processingData) {
      await this.wait(0);
      this.processingData.next({3: {rewardProposeDetailType: 3, total: dataList.length, status: 'done', percent: 100}});
    }
  }

  public goBack() {
    this.router.navigate(['/reward/reward-propose']);
  }

  public getListRewardCategory(rewardGroup: number, rewardObjectType: number, rewardType): Observable<any> {
      const data = {rewardGroup: rewardGroup, rewardObjectType: rewardObjectType, rewardType: rewardType};
    return this.rewardCategoryService.getListRewardCategory(data);
  }

  filterFormSubsidizedSuggest() {
    let keyword = this.formSearchNguoiHuong.controls['keyword'].value.toLowerCase();
    this.formRewardOrgOut.controls.forEach((item:FormGroup) => {
      const rewardTitleIdList = this.mapRewardTitleIdList[this.rewardType][item.value.rewardCategory];
      var map = new Map(rewardTitleIdList.map(option => [option.rewardCategoryId, option.name]));
      if(keyword === "") {
        item.controls['isHidden'].setValue(false);
      } else {
        let relativeName = map.get(item.value.rewardTitleId) + "";
        const isAmountOfMoney = item.value.amountOfMoney ? item.value.amountOfMoney.toString().includes(keyword) : false;
        const isObjectNameGuest = item.value.objectNameGuest ? item.value.objectNameGuest.toLowerCase().includes(keyword) : false;
        const isDescription = item.value.description ? item.value.description.toLowerCase().includes(keyword) : false;
        const isRelativeName = relativeName ? relativeName.toLowerCase().includes(keyword) : false;
        if (isAmountOfMoney || isObjectNameGuest || isDescription || isRelativeName) {
          item.controls['isHidden'].setValue(false);
        } else {
          item.controls['isHidden'].setValue(true);
        }
      }
    });
  }
  getAmountOfMoney(item) {
    const rewardTitleId = item.controls['rewardTitleId'].value;
    if (!rewardTitleId) {
      item.controls['rewardTitleName'].setValue('');
      return;
    }
    const rewardTitleList = this.mapRewardTitleIdList[this.rewardType][item.value.rewardCategory];
    const foundItem = rewardTitleList.find(e => e.rewardCategoryId == rewardTitleId);
    if (!foundItem) {
      item.controls['rewardTitleName'].setValue('');
      return;
    }
    item.controls['amountOfMoney'].setValue(foundItem.offerMoney);
    item.controls['rewardTitleName'].setValue(foundItem.name);
  }
}
