import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS, LOAI_DANH_MUC_KHEN_THUONG, LOAI_DOI_TUONG_KHEN_THUONG, NHOM_KHEN_THUONG, RESOURCE } from '@app/core';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { RewardCategoryService } from '@app/core/services/reward-category/reward-category.service';
import { RewardGeneralService } from '@app/core/services/reward-general/reward-general.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { SortEvent } from 'primeng/api';
import { Observable, Subject, Subscription } from 'rxjs';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';
import { BaseControl } from '@app/core/models/base.control';
import _ from 'lodash';
@Component({
  selector: 'decision-reward-group-position',
  templateUrl: './decision-reward-group-position.component.html',
  styleUrls: ['./decision-reward-group-position.component.css']
})
export class DecisionRewardGroupPositionComponent extends BaseComponent implements OnInit {
  @Input() pageFocus: Subject<any> = new Subject<any>();
  pageFocusSubscription: Subscription;
  @Input() rewardType;
  @Input() setData: Subject<any> = new Subject<any>();
  setDataSubscription: Subscription;
  @Input() importGroupInsangnn: Subject<any> = new Subject<any>();
  importGroupInsangnnSubscription: Subscription;
  @Input() processingData: Subject<any> = new Subject<any>();

  @Input() dataToSave;
  @Output() formRewardGroupOutput = new EventEmitter();
  @Input() resetFormArray: Subject<any> = new Subject<any>();
  resetFormArraySubscription: Subscription;
  @Input() isViewFile: boolean = false;
  @ViewChild('elePreviewAll') elePreviewAll: any;
  formSearchNguoiHuong: FormGroup;
  formRewardGroup: FormArray;
  mapRewardTitleIdList: any = {};
  numIndex = 1;
  branch: number;
  isGOV: boolean;
  isMasO: boolean;
  isOgr: boolean;
  isView: boolean = false;
  isEdit: boolean = false;
  isInsert: boolean = false;
  amountOfMoney: any;
  isSelectedRewardType: any = true;
  rewardCategory: any;
  firstRowIndex = 0;
  pageSize = 50;
  formSearchConfig = {
    keyword: [null]
  };


  constructor(
    private router: Router,
    private app: AppComponent,
    public actr: ActivatedRoute,
    public appParamService: AppParamService,
    public rewardCategoryService: RewardCategoryService,
    public rewardGeneralService: RewardGeneralService,
    public rewardProposeService: RewardProposeService,
     private modalService: NgbModal,
  ) {
    super(actr, RESOURCE.MASS_MEMBER, ACTION_FORM.INSERT);
    this.formSearchNguoiHuong = this.buildForm({}, this.formSearchConfig);
    this.buildFormRewardGroup();
  }

  ngOnDestroy() {
    this.pageFocusSubscription.unsubscribe();
    this.setDataSubscription.unsubscribe();
    this.importGroupInsangnnSubscription.unsubscribe();
    this.resetFormArraySubscription.unsubscribe();
  }
  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 3) {
      this.isView = subPaths[4] === 'view-decision';
      this.isEdit = subPaths[4] === 'edit-decision';
      this.isInsert = subPaths[4] === 'add-decided';
    }
    
    this.formRewardGroupOutput.emit(this.formRewardGroup);
    this.isMasO = false;
    this.resetFormArraySubscription = this.resetFormArray.subscribe(async res => {
      if(res.status && (res.status != 1 &&  res.status != 4)){
        this.isEdit = false;
        this.isView = true;
      }
      this.isGOV = false;
      this.isMasO = false;
      this.isOgr = false;
      this.isSelectedRewardType = false;
      if (res.rewardType == 1) {
        this.isOgr = true;
        this.isMasO = false;
      } else if (res.rewardType == 5) {
        this.isGOV = true;
        this.isMasO = false;
      } else if (res.rewardType == null) {
        this.isSelectedRewardType = true;
      } else {
        this.isMasO = true;
      }
      this.rewardType = res.rewardType;
      this.formRewardGroup.reset();
      this.buildFormRewardGroup();
      this.formRewardGroupOutput.emit(this.formRewardGroup);
      this.branch = res.branch;
      await this.makeMapRewardTitleIdList();
    });
    this.setDataSubscription = this.setData.subscribe(async res => {
      this.rewardType = res.data.rewardType;
      await this.makeMapRewardTitleIdList();
      await this.setDataToForm(res.data.lstRewardProposeSignObject);
    });
    this.importGroupInsangnnSubscription = this.importGroupInsangnn.subscribe(async res => {
      await this.makeMapRewardTitleIdList();
      await this.setDataToForm(res);
    });
    /**
     * thực hiện focus vào page bị lỗi
     */
    this.pageFocusSubscription = this.pageFocus.subscribe(focus => {
      if (focus.activeIndex === 0) {
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
    this.buildFormRewardGroup(listData);
  }

  get f () {
    return this.formSearchNguoiHuong.controls;
  }

  /**
   * makeDefaultForm
   */
  private makeDefaultForm(): FormGroup {
    let group = {
      objectIdsangnnMember: [null], // id to chuc
      massOrganizationId: [null], // to chuc doan, thanh nien, phu nu
      partyOrganizationId: [null], // to chuc dang
      organizationId: [null], // chinh quyen
      mapOrganizationId: [null], // id map
      rewardProposeId: [null], // parent id
      rewardProposeDetailId: [null], // id
      objectNameGuest: [null], // ho va ten hoac ten to chuc
      rewardTitleId: [null, [ValidationService.required]], // id danh hieu/hinh thuc khen thuong
      amountOfMoney: [null, [ValidationService.positiveInteger, ValidationService.maxLength(15)]], // tien thuong
      description: [null], // noi dung khen thuong
      accountNumber: [null, [ValidationService.number, ValidationService.maxLength(20), ValidationService.positiveInteger]], // so tai khoan
      bank: [null], // ngan hang
      accountName: [null], // ngan hang
      personalIdNumber: [null], // so cmnd, ho chieu
      personalIdIssuedDate: [null], // ngay cap cmnd, ho chieu
      personalIdIssuedPlace: [null], // noi cap cmnd, ho chieu
      nationId: [null], // quoc gia
      residencyStatus: [null], // tinh trang cu tru
      addressOrPhone: [null], // address or phone number
      rewardCategory: [null],
      rewardTitleIdList: [],
      rewardType: [null],
      partyOrgName: [null],
      massOrgName: [null],
      orgName: [null],
      representativeId : [null],
      representativeName : [null],
      rewardTitleName: [null],
      isHidden: true,
      isChoose: [null],
      isPreview: [null],
      receiveBonusOrgId: [null],
      receiveBonusOrgName: [null],
      isEnableReceiveBonusOrg : [true],
      partnerDrCode: [null],
      fundReservationLine: [null]
    };
    let validate = [null, [ValidationService.required]];
    if (this.rewardType == 1) {
      group.partyOrganizationId = validate;
    } else if (this.rewardType == 2 || this.rewardType == 3 || this.rewardType == 4) {
      group.massOrganizationId = validate;
    } else if (this.rewardType == 5) {
      group.organizationId = validate;
    }
    return this.buildForm({}, group);
  }

  public buildFormRewardGroup(listData?: any) {
    console.log("listData",listData)
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
    if (this.rewardType == 1) {
      controls.setValidators([
        ValidationService.duplicateArray(['partyOrganizationId', 'rewardTitleId'], 'rewardTitleId', 'rewardGeneral.rewardTitle'),
      ]);
    } else if (this.rewardType == 2 || this.rewardType == 3 || this.rewardType == 4) {
      controls.setValidators([
        ValidationService.duplicateArray(['massOrganizationId', 'rewardTitleId'], 'rewardTitleId', 'rewardGeneral.rewardTitle'),
      ]);
    } else if (this.rewardType == 5) {
      controls.setValidators([
        ValidationService.duplicateArray(['organizationId', 'rewardTitleId'], 'rewardTitleId', 'rewardGeneral.rewardTitle'),
      ]);
    }
    this.formRewardGroup = controls;
  }

  /**
   * addGroup
   * param index
   * param item
   */
  public add() {
    const controls = this.formRewardGroup as FormArray;
    this.numIndex++;
    controls.insert(controls.length, this.makeDefaultForm());
    this.sortDataTable();
    const maxPage = Math.ceil(this.formRewardGroup.controls.length / this.pageSize);
    this.firstRowIndex = (maxPage - 1) * this.pageSize;
  }
  /**
   * removeGroup
   * param index
   * param item
   */
  public remove(index: number, item: FormGroup) {
    const controls = this.formRewardGroup as FormArray;
    this.numIndex--;
    controls.removeAt(index);
    this.sortDataTable();
  }

  private sortDataTable() {
    const _event = {
      data: this.formRewardGroup.controls,
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

  public onChangeMassOrg(data, massOrgSelector) {
    this.formRewardGroup.controls.forEach(element => {
      if (this.rewardType == 1 && element.value['partyOrganizationId'] == data.partyOrganizationId) {
        element.patchValue({
          partyOrgName: data.name,
          partyOrganizationId: data.partyOrganizationId,
          mapOrganizationId: data.partyOrganizationId
        })
      } else if((this.rewardType == 2 || this.rewardType == 3 || this.rewardType == 4) && element.value['massOrganizationId']  == data.massOrganizationId) {
        element.patchValue({
          massOrgName: data.name,
          massOrganizationId: data.massOrganizationId,
          mapOrganizationId: data.massOrganizationId
        })
      } else if (this.rewardType == 5 && element.value['organizationId']  == data.organizationId) {
        element.patchValue({
          orgName: data.name,
          organizationId: data.organizationId,
          mapOrganizationId: data.organizationId
        })
      }
    });
    if (data.massOrganizationId) {
      const currentDate = moment(new Date(), 'DD/MM/YYYY');
      if (data.expritedDate === null) {
        const effectiveDate = moment(new Date(data.effectiveDate), 'DD/MM/YYYY');
        if (effectiveDate.isAfter(currentDate)) {
          this.app.errorMessage('partymember.partyOrganizationNotEffectYet');
          massOrgSelector.delete();
        }
      } else {
        const expiredDate = moment(new Date(data.expritedDate), 'DD/MM/YYYY');
        if (expiredDate.isSameOrBefore(currentDate)) {
          this.app.errorMessage('partymember.partyOrganizationExpired');
          massOrgSelector.delete();
        }
      }
    }
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
    const dataList = dataToSet.filter(data => data.rewardProposeDetailType == null || data.rewardProposeDetailType == 1);
    let control = new FormArray([]);
    const groupConfig = this.makeDefaultForm();
    if (this.processingData) {
      this.processingData.next({1: {rewardProposeDetailType: 1, total: dataList.length, status: 'begin', percent: 0}});
    }
    let i = 0;
    for (const key in dataList) {
      const element = dataList[key];
      i++;
      if (i%200 == 0) {
        if (this.processingData) {
          await this.wait(0);
          this.processingData.next({1: {total: dataList.length, status: 'processing', percent: Number((i/dataList.length)*100).toFixed(2)}});
        }
      }
      let representativeId = "";
      if(element.representativeId){
        representativeId = element.representativeId;
      }
      let representativeName = "";
      if(element.representativeName){
        representativeName = element.representativeName;
      }
      let partnerDrCode = "";
      if(element.partnerDrCode){
        partnerDrCode = element.partnerDrCode;
      }
      // if(element.rewardType ==   && )
      const group = _.cloneDeep(groupConfig);
      if (element.rewardProposeDetailType == null) {
        group.patchValue({
          description: element.description ? element.description : '',
          amountOfMoney: element.amountOfMoney ? element.amountOfMoney : '',
          rewardTitleId: element.rewardTitleId,
          bank: element.bank,
          accountNumber: element.accountNumber,
          accountName: element.accountName ? element.accountName : '',
          massOrganizationId: element.objectId,
          mapOrganizationId: element.mapOrganizationId,
          partyOrganizationId: element.objectId,
          organizationId: element.objectId,
          rewardType: element.rewardType,
          rewardCategory: element.rewardCategory.toString(),
          rewardTitleName: element.rewardTitleName,
          representativeId: representativeId,
          representativeName: representativeName,
          receiveBonusOrgId: element.receiveBonusOrgId,
          orgName: element.orgName ? element.orgName : '',
          isEnableReceiveBonusOrg : element.isEnableReceiveBonusOrg,
          partnerDrCode : element.partnerDrCode ?  element.partnerDrCode: '' ,
          fundReservationLine: element.fundReservationLine
        });
        control.push(group);
      } else {
        if (element.rewardProposeDetailType == 1) {
          group.patchValue({
            description: element.description ? element.description : '',
            amountOfMoney: element.amountOfMoney ? element.amountOfMoney : '',
            rewardProposeDetailId: element.rewardProposeDetailId,
            rewardTitleId: element.rewardTitleId,
            bank: element.bank,
            accountNumber: element.accountNumber,
            accountName: element.accountName ? element.accountName : '',
            rewardType: element.rewardType,
            rewardCategory: element.rewardCategory ? element.rewardCategory.toString() : null,
            rewardTitleName: element.rewardTitleName,
            representativeId: representativeId,
            representativeName: representativeName,
            receiveBonusOrgId: element.receiveBonusOrgId,
            mapOrganizationId: element.mapOrganizationId,
            isEnableReceiveBonusOrg : element.isEnableReceiveBonusOrg,
            partnerDrCode : element.partnerDrCode ?  element.partnerDrCode: '',
            fundReservationLine: element.fundReservationLine
          });
          if (this.rewardType == 1) {
            group.patchValue({
              partyOrganizationId: element.objectIdsangnnMember,
              partyOrgName: element.partyOrgName
            });
          } else if (this.rewardType == 5) {
            group.patchValue({
              organizationId: element.objectIdsangnnMember,
              orgName: element.orgName
            });
          } else {
            group.patchValue({
              massOrganizationId: element.objectIdsangnnMember,
              massOrgName: element.massOrgName
            });
          }
          control.push(group);
        }
      }
      this.isEnableReceiveBonusOrgCheck(group);
    }
    if (this.rewardType == 1) {
      this.formRewardGroup.setValidators([
        ValidationService.duplicateArray(['partyOrganizationId', 'rewardTitleId'], 'rewardTitleId', 'rewardGeneral.rewardTitle'),
      ]);
    } else if (this.rewardType == 2 || this.rewardType == 3 || this.rewardType == 4) {
      this.formRewardGroup.setValidators([
        ValidationService.duplicateArray(['massOrganizationId', 'rewardTitleId'], 'rewardTitleId', 'rewardGeneral.rewardTitle'),
      ]);
    } else if (this.rewardType == 5) {
      this.formRewardGroup.setValidators([
        ValidationService.duplicateArray(['organizationId', 'rewardTitleId'], 'rewardTitleId', 'rewardGeneral.rewardTitle'),
      ]);
    }
    this.formRewardGroup = control;
    this.formRewardGroupOutput.emit(this.formRewardGroup);
    if (this.processingData) {
      await this.wait(0);
      this.processingData.next({1: {rewardProposeDetailType: 1, total: dataList.length, status: 'done', percent: 100}});
    }
  }

  filterFormSubsidizedSuggest() {
    let keyword = this.formSearchNguoiHuong.controls['keyword'].value.toLowerCase();
    this.formRewardGroup.controls.forEach((item:FormGroup) => {
      let value;
      if (this.rewardType == 1) {
        value = item.value.partyOrgName.toLowerCase();
      } else if (this.rewardType == 2 || this.rewardType == 3 || this.rewardType == 4) {
        value = item.value.massOrgName.toLowerCase();
      } else if (this.rewardType == 5) {
        value = item.value.orgName.toLowerCase();
      }
      const rewardTitleIdList = this.mapRewardTitleIdList[this.rewardType][item.value.rewardCategory];
      var map = new Map(rewardTitleIdList.map(option => [option.rewardCategoryId, option.name]));
      if(keyword === "") {
        item.controls['isHidden'].setValue(false);
      } else {
        let rewardTitleName = map.get(item.value.rewardTitleId) + "";
        const isAmountOfMoney = item.value.amountOfMoney ? item.value.amountOfMoney.toString().includes(keyword) : false;
        const isValue = value ? value.includes(keyword) : false;
        const isDescription = item.value.description ? item.value.description.includes(keyword) : false;
        const isRewardTitleName = rewardTitleName ? rewardTitleName.includes(keyword) : false;
        if (isAmountOfMoney || isValue || isDescription || isRewardTitleName) {
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
    this.isEnableReceiveBonusOrgCheck(item);
  }

  public isEnableReceiveBonusOrgCheck(item){
    const rewardCategoryId = item.controls['rewardCategory'].value;
    const rewardTitleId = item.controls['rewardTitleId'].value;
    if (!rewardTitleId) {
      item.controls['rewardTitleName'].setValue('');
    }
    const rewardTitleName = item.controls['rewardTitleName'].value;
    if (rewardCategoryId == 2 && rewardTitleName == "Khen thưởng bằng hiện vật"){
      item.controls['isEnableReceiveBonusOrg'] = false;
      item.controls['representativeId'].setValue('');
      item.controls['representativeName'].setValue('');
    }else {
      item.controls['isEnableReceiveBonusOrg'] = true;
      item.controls['receiveBonusOrgId'].setValue('');
    }
  }

  newReasonControl = new BaseControl();
  checkValidate(rowData) {
    if (!rowData || !rowData.value) return;
    const { reason } = rowData.value;
    rowData.removeControl('reason');
    const newReasonControl = _.cloneDeep(this.newReasonControl);
    const hasValidate = rowData.value.isChoose || rowData.value.isSuggest || rowData.value.isPreview;
    if (!hasValidate) {
      newReasonControl.setValidators(ValidationService.required);
    }
    newReasonControl.setValue(reason);
    rowData.addControl('reason', newReasonControl);
    rowData.updateValueAndValidity();
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
  /**
   * Khi bấm chọn bỏ chọn tất cả
   * @param event 
   * @param targetList 
   */
  chooseAll(event, targetList) {
    const isChecked = event.target.checked;
    const currentList = this.getCurrentViewList(targetList)
    if (currentList.length > 0) {
      for (let i = 0; i < currentList.length; i++) {
        currentList[i].controls['isPreview'].setValue(isChecked);
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
   * cập nhật trạng thái chọn tất cả
   * @param event 
   * @param targetList 
   */
  updateChooseAll(targetList) {
    setTimeout(() => {
      const currentList = this.getCurrentViewList(targetList)
      let isChecked = true;
      if (currentList.length > 0) {
        for (let i = 0; i < currentList.length; i++) {
          if (!currentList[i].controls['isPreview'].value) {
            isChecked = false;
            break;
          }
        }
      }
      if (this.elePreviewAll && this.elePreviewAll.nativeElement) {
        this.elePreviewAll.nativeElement.checked = isChecked;
      }
    }, 500)
  }

  onChangeEmployee(data){
    if(data){
      this.formRewardGroup.controls.forEach(element => {
        if(element.value.representativeId === data.selectField){
          element.patchValue({
            representativeName : data.nameField
          })
        }else if(element.value.representativeId === ""){
          element.patchValue({
            representativeName : ''
          })
        }
      })
    }
  }

  public onProposeOrgChange(event) {
    this.formRewardGroup.controls.forEach(element => {
      element.patchValue({
        orgName: event.name,
        // receiveBonusOrgId: event.organizationId
      })
    })
  }
}
