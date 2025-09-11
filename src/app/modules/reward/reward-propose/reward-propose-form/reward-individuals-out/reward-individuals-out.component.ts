import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, LOAI_DANH_MUC_KHEN_THUONG, LOAI_DOI_TUONG_KHEN_THUONG, NHOM_KHEN_THUONG, RESOURCE } from '@app/core';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { SortEvent } from 'primeng/api';
import { Observable, Subject, Subscription } from 'rxjs';
import { PropagandaRewardFormService } from '@app/core/services/propaganda/propaganda-reward-form.service';
import { NationService } from '@app/core/services/nation/nation.service';
import { RewardCategoryService } from '@app/core/services/reward-category/reward-category.service';
import { RewardGeneralService } from '@app/core/services/reward-general/reward-general.service';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { Table } from 'primeng/table';
import { BaseControl } from '@app/core/models/base.control';
import _ from "lodash";
@Component({
  selector: 'reward-individuals-out',
  templateUrl: './reward-individuals-out.component.html',
  styleUrls: ['./reward-individuals-out.component.css']
})
export class RewardIndividualsOutComponent extends BaseComponent implements OnInit {
  @Input() pageFocus: Subject<any> = new Subject<any>();
  pageFocusSubscrition: Subscription;
  @Input() resetFormSubject: Subject<number> = new Subject<number>();
  @Input() setData: Subject<any> = new Subject<any>();
  setDataSubscrition: Subscription;
  @Input() processingData: Subject<any> = new Subject<any>();
  @Input() resetFormArray: Subject<any> = new Subject<any>();
  resetFormArraySubscrition: Subscription;
  @Input() rewardType;
  @Input() isDisable: boolean = false;
  @Input() dataImportStaffOutsangnn: Subject<any> = new Subject<any>();
  dataImportStaffOutsangnnSubscrition: Subscription;
  @Output() formRewardIndividualOutside = new EventEmitter();
  @ViewChild('eleChooseAll') eleChooseAll: any;
  @ViewChild('eleSuggestAll') eleSuggestAll: any;
  formSearchNguoiHuong: FormGroup;
  formRewardIndividualOut: FormArray;
  rewardTypeList: any;
  rewardFormList: any;
  rewardProposeId: any;
  nationList: any;
  mapRewardTitleIdList: any = {};
  residentStatusList: any;
  numIndex = 1;
  view: boolean;
  isView: boolean = false;
  isEdit: boolean = false;
  isViewSign: boolean = false;
  isEditSign: boolean = false;
  isAddSign: boolean = false;
  isViewSelection: boolean = false;
  isEditSelection: boolean = false;
  rewardCategory: any;
  firstRowIndex = 0;
  pageSize = 50;
  isSynthetic: any;
  formSearchConfig = {
    keyword: [null]
  };
  subscrition: Subscription;
  constructor(
    private router: Router,
    private app: AppComponent,
    public actr: ActivatedRoute,
    public appParamService: AppParamService,
    private nationService: NationService,
    private propagandaRewardFormService: PropagandaRewardFormService,
    public rewardCategoryService: RewardCategoryService,
    public rewardGeneralService: RewardGeneralService
  ) {
    super(actr, RESOURCE.MASS_MEMBER, ACTION_FORM.INSERT);
    this.formSearchNguoiHuong = this.buildForm({}, this.formSearchConfig);
    this.buildFormRewardIndividualOut();
    this.residentStatusList = APP_CONSTANTS.RESIDENT_STATUS_LIST;
    this.rewardTypeList = APP_CONSTANTS.REWARD_TYPE_LIST;
    this.propagandaRewardFormService.getAllPropagandaRewardForm().subscribe(res => {
      this.rewardFormList = res.data;
    });
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.rewardProposeId = params.id;
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
    this.formRewardIndividualOutside.emit(this.formRewardIndividualOut);
    this.resetFormArraySubscrition = this.resetFormArray.subscribe(async res => {
      this.rewardType = res.rewardType;
      this.formRewardIndividualOut.reset()
      this.buildFormRewardIndividualOut();
      this.formRewardIndividualOutside.emit(this.formRewardIndividualOut);
      await this.makeMapRewardTitleIdList();
    });
    this.setDataSubscrition = this.setData.subscribe(async res => {
      this.isSynthetic = res.data.isSynthetic;
      await this.makeMapRewardTitleIdList();
      await this.setDataToForm(res.data.lstRewardProposeDetail);
    });
    this.dataImportStaffOutsangnnSubscrition = this.dataImportStaffOutsangnn.subscribe(async res => {
      await this.makeMapRewardTitleIdList();
      await this.setDataToForm(res);
    });
    this.nationService.getNationList().subscribe(res => this.nationList = res.data);
    /**
     * thực hiện focus vào page bị lỗi
     */
     this.pageFocusSubscrition = this.pageFocus.subscribe(focus => {
      if (focus.activeIndex === 3) {
        const stt = focus.stt;
        this.firstRowIndex = parseInt(stt/this.pageSize + "") * this.pageSize;
      }
    })
  }

  ngOnDestroy() {
    this.pageFocusSubscrition.unsubscribe();
    this.setDataSubscrition.unsubscribe();
    this.dataImportStaffOutsangnnSubscrition.unsubscribe();
    this.resetFormArraySubscrition.unsubscribe();
  }

  public initPositionForm(listData?: any) {
    this.buildFormRewardIndividualOut(listData);
  }

  get f() {
    return this.formSearchNguoiHuong.controls;
  }

  public async makeMapRewardTitleIdList() {
    if (!this.mapRewardTitleIdList[this.rewardType]) {
      this.mapRewardTitleIdList[this.rewardType] = {}
      const rewardTitleIdList = await this.getListRewardCategory(NHOM_KHEN_THUONG.TRONG_TAP_DOAN, LOAI_DOI_TUONG_KHEN_THUONG.CA_NHAN, this.rewardType).toPromise();
      rewardTitleIdList.forEach(e => {
        this.mapRewardTitleIdList[this.rewardType][e.rewardCategory] = this.mapRewardTitleIdList[this.rewardType][e.rewardCategory] || [];
        this.mapRewardTitleIdList[this.rewardType][e.rewardCategory].push(e);
      })
    }
  }

  /**
   * makeDefaultForm
   */
  private makeDefaultForm(): FormGroup {
    const group = {
      rewardProposeId: [null], // parent id
      rewardProposeDetailId: [null], // id
      objectNameGuest: [null, [ValidationService.required]], // ho va ten
      rewardTitleId: [null, [ValidationService.required]], // id danh hieu/hinh thuc khen thuong
      amountOfMoney: [null, [ValidationService.positiveInteger, ValidationService.maxLength(15)]], // tien thuong
      description: [null], // noi dung khen thuong
      accountNumber: [null, [ValidationService.maxLength(20), ValidationService.required, ValidationService.onlyLetterNumber]], // so tai khoan
      bank: [null, [ValidationService.required]], // ngan hang
      personalIdNumber: [null], // so cmnd, ho chieu
      personalIdIssuedDate: [null, [ValidationService.beforeCurrentDate]], // ngay cap cmnd, ho chieu
      personalIdIssuedPlace: [null], // noi cap cmnd, ho chieu
      nationId: [null], // quoc gia
      residencyStatus: [null], // tinh trang cu tru
      addressOrPhone: [null], // address or phone number
      rewardCategory: [""],
      rewardTitleIdList: [],
      taxId: [null, [ValidationService.maxLength(50)]], // Ma so thue
      isChoose: [null],
      isSuggest: [null],
      reason: [null],
      rewardTitleName:[null],
      isHidden: true,
      rewardProposeDetailType:[null],
      nationName:[null],
      incomeType : [null],
      reimbursementOrgName: [null],
      fundReservationLine: [null]
    };
    if (this.isEditSelection || this.isViewSelection) {
      group['reason'] = [null, ValidationService.required]
    }
    return this.buildForm({}, group);
  }

  public buildFormRewardIndividualOut(listData?: any) {
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

    this.formRewardIndividualOut = controls;
  }

  /**
   * addGroup
   * param index
   * param item
   */
  public add() {
    const controls = this.formRewardIndividualOut as FormArray;
    this.numIndex++;
    controls.insert(controls.length, this.makeDefaultForm());
    this.sortDataTable();
    const maxPage = Math.ceil(this.formRewardIndividualOut.controls.length / this.pageSize);
    this.firstRowIndex = (maxPage - 1) * this.pageSize;
  }

  /**
   * removeGroup
   * param index
   * param item
   */
  public remove(index: number, item: FormGroup) {
    const controls = this.formRewardIndividualOut as FormArray;
    this.numIndex--;
    controls.removeAt(index);
    this.sortDataTable();
  }

  private sortDataTable() {
    const _event = {
      data: this.formRewardIndividualOut.controls,
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

  public goBack() {
    this.router.navigate(['/reward/reward-propose']);
  }

  public getListRewardCategory(rewardGroup: number, rewardObjectType: number, rewardType): Observable<any> {
    const data = {rewardGroup: rewardGroup, rewardObjectType: rewardObjectType, rewardType: rewardType};
    return this.rewardCategoryService.getListRewardCategory(data);
  }

  wait(ms: number)  {
    return new Promise((resolve)=> {
      setTimeout(resolve, ms);
    });
  }
  public async setDataToForm(dataToSet) {
    const dataList = dataToSet.filter(data => data.rewardProposeDetailType == null || data.rewardProposeDetailType == 4);
    const control = new FormArray([]);
    const groupConfig = this.makeDefaultForm();
    if (this.processingData) {
      this.processingData.next({4: {total: dataList.length, status: 'begin', percent: 0}});
    }
    let i = 0;
    for (const key in dataList) {
      const element = dataList[key];
      i++;
      if (i%200 == 0) {
        if (this.processingData) {
          await this.wait(1);
          this.processingData.next({4: {total: dataList.length, status: 'processing', percent: Number((i/dataList.length)*100).toFixed(2)}});
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
          nationId: element.nationId,
          residencyStatus: element.residencyStatus,
          personalIdIssuedPlace: element.personalIdIssuedPlace,
          addressOrPhone: element.addressOrPhone,
          personalIdIssuedDate: element.personalIdIssuedDate,
          personalIdNumber: element.personalIdNumber,
          rewardCategory: element.rewardCategory ? element.rewardCategory.toString() : null,
          rewardTitleName: element.rewardTitleName ? element.rewardTitleName: '',
          nationName: element.nationId ? this.nationList.find(e => e.nationId == element.nationId).name : "",
          taxId: element.taxId,
          isSuggest: element.isSuggest,
          isChoose: element.isChoose,
          reason: element.reason,
          incomeType : element.incomeType == "0"? "Miễn thuế": "Chịu thuế",
          reimbursementOrgName: element.reimbursementOrgName,
          fundReservationLine: element.fundReservationLine
        });
        control.push(group);
      } else if (element.rewardProposeDetailType == 4) {
        group.patchValue({
          description: element.description ? element.description : '',
          amountOfMoney: element.amountOfMoney ? element.amountOfMoney : '',
          rewardProposeDetailId: element.rewardProposeDetailId,
          rewardTitleId: element.rewardTitleId,
          bank: element.bank,
          objectNameGuest: element.objectNameGuest,
          accountNumber: element.accountNumber,
          nationId: element.nationId,
          residencyStatus: element.residencyStatus,
          personalIdIssuedPlace: element.personalIdIssuedPlace,
          addressOrPhone: element.addressOrPhone,
          personalIdIssuedDate: element.personalIdIssuedDate,
          personalIdNumber: element.personalIdNumber,
          rewardCategory: element.rewardCategory ? element.rewardCategory.toString() : null,
          rewardTitleName: element.rewardTitleName ? element.rewardTitleName: '',
          nationName: element.nationId ? this.nationList.find(e => e.nationId == element.nationId).name : "",
          taxId: element.taxId,
          isSuggest: element.isSuggest,
          isChoose: element.isChoose,
          reason: element.reason,
          incomeType : element.incomeType == "0"? "Miễn thuế": "Chịu thuế",
          reimbursementOrgName: element.reimbursementOrgName,
          fundReservationLine: element.fundReservationLine
        });
        control.push(group);
      }
    };
    this.formRewardIndividualOut.setValidators([
      ValidationService.duplicateArray(['objectNameGuest', 'rewardTitleId'], 'rewardTitleId', 'rewardGeneral.rewardTitle'),
    ]);
    this.formRewardIndividualOut = control;
    if (this.isEditSelection) {
      this.formRewardIndividualOut.controls.forEach(ele => {
        this.checkValidate(ele);
      })
    }
    this.formRewardIndividualOutside.emit(this.formRewardIndividualOut);
    this.updateChooseAll(this.formRewardIndividualOut.controls)
    if (this.processingData) {
      await this.wait(1);
      this.processingData.next({4: {total: dataList.length, status: 'done', percent: 100}});
    }
  }

  filterFormSubsidizedSuggest() {
    let keyword = this.formSearchNguoiHuong.controls['keyword'].value.toLowerCase();
    this.formRewardIndividualOut.controls.forEach((item:FormGroup) => {
      const rewardTitleIdList = this.mapRewardTitleIdList[this.rewardType][item.value.rewardCategory];
      const map = new Map(rewardTitleIdList.map(option => [option.rewardCategoryId, option.name]));
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

  getNationality(item){
    if (item.value.nationId) {
      const nationName = this.nationList.find(e => e.nationId == item.value.nationId).name
      item.controls['nationName'].setValue(nationName)
    }
  }

  /**
   * Khi bấm chọn bỏ chọn tất cả
   * @param event
   * @param targetList
   */
   chooseAll(event, targetList, option) {
    const isChecked = event.target.checked;
    const currentList = this.getCurrentViewList(targetList)
    if (currentList.length > 0) {
      for (let i = 0; i < currentList.length; i++) {
        if (option == 1) {
          currentList[i].controls['isChoose'].setValue(isChecked);
        } else {
          currentList[i].controls['isSuggest'].setValue(isChecked);
        }
        this.checkValidate(currentList[i])
      }
    }
  }

  /**
   * lấy danh sách đang xem tại page hiện tại
   * @param event
   * @param targetList
   */
  getCurrentViewList(targetList) {
    const first = this.firstRowIndex;
    const last = this.firstRowIndex + this.pageSize;
    return targetList.slice(first, last);
  }

   /**
   * xử lý check validate khi thay đổi checkbox
   * @param rowData
   * @returns
   */
  onChangeChooseOrSuggest(rowData, targetList) {
      this.checkValidate(rowData);
      this.updateChooseAll(targetList);
  }

  newReasonControl = new BaseControl();
  checkValidate(rowData) {
    if (!rowData || !rowData.value) return;
    const { reason } = rowData.value;
    rowData.removeControl('reason');
    const newReasonControl = _.cloneDeep(this.newReasonControl)
    const hasValidate = rowData.value.isChoose || rowData.value.isSuggest;
    if (!hasValidate) {
      newReasonControl.setValidators(ValidationService.required);
    }
    newReasonControl.setValue(reason);
    rowData.addControl('reason', newReasonControl);
    rowData.updateValueAndValidity();
  }
    /**
   * cập nhật trạng thái chọn tất cả
   * @param event
   * @param targetList
   */
  updateChooseAll(targetList) {
    setTimeout(() => {
      const currentList = this.getCurrentViewList(targetList)
      let isUnChecked1 = true;
      let isUnChecked2 = true;
      if (currentList.length > 0) {
        isUnChecked1 = currentList.some((item) => !item.controls['isChoose'].value)
        isUnChecked2 = currentList.some((item) => !item.controls['isSuggest'].value)
      }
      if (this.eleChooseAll && this.eleChooseAll.nativeElement) {
        this.eleChooseAll.nativeElement.checked = !isUnChecked1;
      }
      if (this.eleSuggestAll && this.eleSuggestAll.nativeElement) {
        this.eleSuggestAll.nativeElement.checked = !isUnChecked2;
      }
    }, 500)
  }

}
