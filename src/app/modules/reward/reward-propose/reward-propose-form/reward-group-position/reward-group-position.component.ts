import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
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
import { RewardSuggestImportManageComponent } from '../file-import-reward-management/file-import-reward-management.component';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';
import { BaseControl } from '@app/core/models/base.control';
import _ from 'lodash';
@Component({
  selector: 'reward-group-position',
  templateUrl: './reward-group-position.component.html',
  styleUrls: ['./reward-group-position.component.css']
})
export class RewardGroupPositionComponent extends BaseComponent implements OnInit {
  @Input() pageFocus: Subject<any> = new Subject<any>();
  pageFocusSubscrition: Subscription;
  @Input() rewardType;
  @Input() saveData: Subject<boolean> = new Subject<boolean>();
  @Input() setData: Subject<any> = new Subject<any>();
  setDataSubscrition: Subscription;
  @Input() processingData: Subject<any> = new Subject<any>();
  @Input() dataImportGroupInsangnn: Subject<any> = new Subject<any>();
  dataImportGroupInsangnnSubscrition: Subscription;
  @Input() isDisable: boolean = false;
  @Input() isHideProposeSign: boolean = false;
  @Input() dataToSave;
  @Output() formRewardGroupOutput = new EventEmitter();
  @Input() resetFormArray: Subject<any> = new Subject<any>();
  resetFormArraySubscrition: Subscription;
  @Input() isViewFile: boolean = false;
  @ViewChild('elePreviewAll') elePreviewAll: any;
  @ViewChild('eleChooseAll') eleChooseAll: any;
  @ViewChild('eleSuggestAll') eleSuggestAll: any;
  formSearchNguoiHuong: FormGroup;
  formRewardGroup: FormArray;
  mapRewardTitleIdList: any = {};
  numIndex = 1;
  mapRewardTypeBranch = { 1: 0, 2: 3, 3: 1, 4: 2, 5: 5 };
  branch: number;
  isGOV: boolean;
  isMasO: boolean;
  isOgr: boolean;
  isView: boolean = false;
  isEdit: boolean = false;
  isViewSign: boolean = false;
  isEditSign: boolean = false;
  isAddSign: boolean = false;
  isApprove: boolean = false;
  isEditSelection: boolean = false;
  isViewSelection: boolean = false;
  checkDisable: boolean = false;
  amountOfMoney: any;
  isSelectedRewardType: any = true;
  rewardCategory: any;
  firstRowIndex = 0;
  pageSize = 50;
  isSynthetic: any;
  isChoose: any;
  rootID: any;
  rootMassID: any;
  isSuggest: any;
  formSearchConfig = {
    keyword: [null],
    representativeId: [null]
  };
  subscrition: Subscription;
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
    this.rootID = "148841"
    // this.rootMassID = "1"
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
    this.formRewardGroupOutput.emit(this.formRewardGroup);
    this.isMasO = false;
    this.resetFormArraySubscrition = this.resetFormArray.subscribe(async res => {
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
    this.setDataSubscrition = this.setData.subscribe(async res => {
      this.isSynthetic = res.data.isSynthetic;
      this.isChoose = res.data.isChoose;
      await this.makeMapRewardTitleIdList();
      await this.setDataToForm(res.data.lstRewardProposeDetail);
    });
    this.dataImportGroupInsangnnSubscrition = this.dataImportGroupInsangnn.subscribe(async res => {
      await this.makeMapRewardTitleIdList();
      await this.setDataToForm(res);
    });
    /**
     * thực hiện focus vào page bị lỗi
     */
     this.pageFocusSubscrition = this.pageFocus.subscribe(focus => {
      if (focus.activeIndex === 0) {
        const stt = focus.stt;
        this.firstRowIndex = parseInt(stt/this.pageSize + "") * this.pageSize;
      }
    })

  }

  ngOnDestroy() {
    this.pageFocusSubscrition.unsubscribe();
    this.setDataSubscrition.unsubscribe();
    this.dataImportGroupInsangnnSubscrition.unsubscribe();
    this.resetFormArraySubscrition.unsubscribe();
  }

  get f() {
    return this.formSearchNguoiHuong.controls;
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

  /**
   * makeDefaultForm
   */
  private makeDefaultForm(): FormGroup {
    let group = {
      objectIdsangnnMember: [null], // id to chuc
      massOrganizationId: [null], // to chuc doan, thanh nien, phu nu
      partyOrganizationId: [null], // to chuc dang
      organizationId: [null], // chinh quyen
      organizationName: [null], // ten
      mapOrganizationId: [null], // id map
      rewardProposeId: [null], // parent id
      rewardProposeDetailId: [null], // id
      objectNameGuest: [null], // ho va ten hoac ten to chuc
      rewardTitleId: [null, [ValidationService.required]], // id danh hieu/hinh thuc khen thuong
      amountOfMoney: [null, [ValidationService.positiveInteger, ValidationService.maxLength(15)]], // tien thuong
      description: [null], // noi dung khen thuong
      accountNumber: [null, [ValidationService.number, ValidationService.maxLength(20), ValidationService.positiveInteger]], // so tai khoan
      bank: [null], // ngan hang
      personalIdNumber: [null], // so cmnd, ho chieu
      personalIdIssuedDate: [null], // ngay cap cmnd, ho chieu
      personalIdIssuedPlace: [null], // noi cap cmnd, ho chieu
      nationId: [null], // quoc gia
      residencyStatus: [null], // tinh trang cu tru
      addressOrPhone: [null], // address or phone number
      rewardCategory: [null],
      rewardTitleIdList: [null],
      rewardType: [null],
      partyOrgName: [null],
      massOrgName: [null],
      orgName: [null],
      rewardTitleName: [null],
      isChoose: [null],
      isSuggest: [null],
      isPreview: [null],
      reason: [null],
      isHidden: true,
      rewardProposeDetailType: [null],
      accountName:[null],
      reimbursementOrgName:[null],
      representativeId : [null],
      representativeName : [null],
      receiveBonusOrgId: [null],
      isEnableReceiveBonusOrg : [true],
      partnerDrCode: [null],
      fundReservationLine: [null]
    };
    if (this.isEditSelection || this.isViewSelection) {
      group['reason'] = [null, ValidationService.required]
    }
    let validate = [null, [ValidationService.required]];
    let notValidate = [null];
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
          organizationName: data.name,
          mapOrganizationId: data.partyOrganizationId,
          partyOrganizationId: data.partyOrganizationId
        })
        element.setValidators([ValidationService.required]);    
      } else if ((this.rewardType == 2 || this.rewardType == 3 || this.rewardType == 4) && element.value['massOrganizationId'] == data.massOrganizationId) {
        element.patchValue({
          massOrgName: data.name,
          organizationName: data.name,
          mapOrganizationId: data.massOrganizationId,
          massOrganizationId: data.massOrganizationId
        })
        element.setValidators([ValidationService.required]);    
      } else if (this.rewardType == 5 && element.value['organizationId'] == data.organizationId) {
        element.patchValue({
          orgName: data.name,
          organizationName: data.name,
          mapOrganizationId: data.organizationId,
          organizationId: data.organizationId
        })
      }

      if (this.rewardType == 1) {        
        element.setValidators([ValidationService.required]);    
      } else if ((this.rewardType == 2 || this.rewardType == 3 || this.rewardType == 4)) {       
        element.setValidators([ValidationService.required]);    
      } else if (this.rewardType == 5 && element.value['organizationId'] == data.organizationId) {
        
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

  public openFormImport() {
    if (!this.rewardType) {
      this.app.warningMessage('pleaseChooseRewardType');
      return;
    }
    const modalRef = this.modalService.open(RewardSuggestImportManageComponent, DEFAULT_MODAL_OPTIONS);
    const data = { rewardType: this.rewardType, branch: this.branch, rewardObjectType: 2, option: 1 };
    modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      this.setDataToForm(result);
    });
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
      const group = _.cloneDeep(groupConfig);
      if (element.rewardProposeDetailType == null) {
        group.patchValue({
          description: element.description ? element.description : '',
          amountOfMoney: element.amountOfMoney ? element.amountOfMoney : '',
          rewardTitleId: element.rewardTitleId,
          bank: element.bank,
          accountNumber: element.accountNumber,
          massOrganizationId: element.objectId,
          partyOrganizationId: element.objectId,
          organizationId: element.objectId,
          mapOrganizationId: element.mapOrganizationId,
          organizationName: element.organizationName,
          rewardType: element.rewardType,
          rewardCategory: element.rewardCategory.toString(),
          rewardTitleName: element.rewardTitleName,
          isSuggest: element.isSuggest,
          accountName: element.accountName != undefined ? element.accountName: "",
          reimbursementOrgName: element.reimbursementOrgName != undefined? element.reimbursementOrgName: "",
          isChoose: element.isChoose,
          representativeId: representativeId,
          representativeName: representativeName,
          reason: element.reason,
          receiveBonusOrgId: element.receiveBonusOrgId,
          isEnableReceiveBonusOrg : element.isEnableReceiveBonusOrg,
          partnerDrCode: element.partnerDrCode,
          fundReservationLine: element.fundReservationLine
        });
        control.push(group);
      } else {
        if (element.rewardProposeDetailType == 1) {
          group.patchValue({
            description: element.description ? element.description : '',
            rewardProposeDetailId: element.rewardProposeDetailId,
            amountOfMoney: element.amountOfMoney ? element.amountOfMoney : '',
            rewardTitleId: element.rewardTitleId,
            bank: element.bank,
            accountNumber: element.accountNumber,
            rewardType: element.rewardType,
            rewardCategory: element.rewardCategory ? element.rewardCategory.toString() : null,
            rewardTitleName: element.rewardTitleName,
            isSuggest: element.isSuggest,
            accountName: element.accountName != undefined? element.accountName: "",
            reimbursementOrgName: element.reimbursementOrgName != undefined? element.reimbursementOrgName: "",
            isChoose: element.isChoose,
            representativeId: representativeId,
            representativeName: representativeName,
            reason: element.reason,
            receiveBonusOrgId: element.receiveBonusOrgId,
            mapOrganizationId: element.mapOrganizationId,
            organizationName: element.organizationName,
            isEnableReceiveBonusOrg : element.isEnableReceiveBonusOrg,
            partnerDrCode: element.partnerDrCode,
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
    };
    if (this.rewardType == 1) {
      this.formRewardGroup.setValidators([
        ValidationService.duplicateArray(['partyOrganizationId', 'rewardTitleId'], 'rewardTitleId', 'rewardGeneral.rewardTitle'),
      ]);
      this.formSearchNguoiHuong.get('representativeId').setValidators([ValidationService.required]);    
    } else if (this.rewardType == 2 || this.rewardType == 3 || this.rewardType == 4) {
      this.formRewardGroup.setValidators([
        ValidationService.duplicateArray(['massOrganizationId', 'rewardTitleId'], 'rewardTitleId', 'rewardGeneral.rewardTitle'),
      ]);
      this.formSearchNguoiHuong.get('representativeId').setValidators([ValidationService.required]);     
    } else if (this.rewardType == 5) {
      this.formRewardGroup.setValidators([
        ValidationService.duplicateArray(['organizationId', 'rewardTitleId'], 'rewardTitleId', 'rewardGeneral.rewardTitle'),
      ]);      
    }
    this.formRewardGroup = control;
    if (this.isEditSelection) {
      this.formRewardGroup.controls.forEach(ele => {
        this.checkValidate(ele);
      })
    }
    this.formRewardGroupOutput.emit(this.formRewardGroup);
    this.updateChooseAll(this.formRewardGroup.controls)
    if (this.processingData) {
      await this.wait(1);
      this.processingData.next({1: {total: dataList.length, status: 'done', percent: 100}});
    }
    console.log('reward-group-position.component Done', new Date());
  }

  filterFormSubsidizedSuggest() {
    let keyword = this.formSearchNguoiHuong.controls['keyword'].value.toLowerCase();
    this.formRewardGroup.controls.forEach((item: FormGroup) => {
      let value;
      if (this.rewardType == 1) {
        value = item.value.partyOrgName.toLowerCase();
      } else if (this.rewardType == 2 || this.rewardType == 3 || this.rewardType == 4) {
        value = item.value.massOrgName.toLowerCase();
      } else if (this.rewardType == 5) {
        value = item.value.orgName.toLowerCase();
      }
      const rewardTitleIdList = this.mapRewardTitleIdList[this.rewardType][item.value.rewardCategory];
      const map = new Map(rewardTitleIdList.map(option => [option.rewardCategoryId, option.name]));
      if (keyword === "") {
        item.controls['isHidden'].setValue(false);
      } else {
        let rewardTitleName = map.get(item.value.rewardTitleId) + "";
        const isAmountOfMoney = item.value.amountOfMoney ? item.value.amountOfMoney.toString().includes(keyword) : false;
        const isValue = value ? value.includes(keyword) : false;
        const isDescription = item.value.description ? item.value.description.toLowerCase().includes(keyword) : false;
        const isRewardTitleName = rewardTitleName ? rewardTitleName.toLowerCase().includes(keyword) : false;
        if (isAmountOfMoney || isValue || isDescription || isRewardTitleName) {
          item.controls['isHidden'].setValue(false);
        } else {
          item.controls['isHidden'].setValue(true);
        }
      }
    });
  }

  getAmountOfMoney(item) {
    const rewardTitleId = item.value.rewardTitleId;
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
    }else {
      item.controls['isEnableReceiveBonusOrg'] = true;
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
        if(option == 1){
          currentList[i].controls['isChoose'].setValue(isChecked);
        } else if (option == 2) {
          currentList[i].controls['isSuggest'].setValue(isChecked);
        } else {
          currentList[i].controls['isPreview'].setValue(isChecked);
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
    const hasValidate = rowData.value.isChoose || rowData.value.isSuggest || !rowData.value.isPreview;
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
      let isUnChecked = true;
      let isUnChecked1 = true;
      let isUnChecked2 = true;
      if (currentList.length > 0) {
        isUnChecked = currentList.some((item) => !item.controls['isPreview'].value)
        isUnChecked1 = currentList.some((item) => !item.controls['isChoose'].value)
        isUnChecked2 = currentList.some((item) => !item.controls['isSuggest'].value)
      }
      if (this.elePreviewAll && this.elePreviewAll.nativeElement) {
        this.elePreviewAll.nativeElement.checked = !isUnChecked;
      }
      if (this.eleChooseAll && this.eleChooseAll.nativeElement) {
        this.eleChooseAll.nativeElement.checked = !isUnChecked1;
      }
      if (this.eleSuggestAll && this.eleSuggestAll.nativeElement) {
        this.eleSuggestAll.nativeElement.checked = !isUnChecked2;
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
