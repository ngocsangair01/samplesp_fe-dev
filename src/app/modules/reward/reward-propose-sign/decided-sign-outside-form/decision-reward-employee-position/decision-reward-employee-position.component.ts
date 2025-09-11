import { group } from 'console';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS, LOAI_DANH_MUC_KHEN_THUONG, LOAI_DOI_TUONG_KHEN_THUONG, NHOM_KHEN_THUONG, RESOURCE, RESPONSE_TYPE } from '@app/core';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { RewardCategoryService } from '@app/core/services/reward-category/reward-category.service';
import { RewardGeneralService } from '@app/core/services/reward-general/reward-general.service';
import { RewardProposeSignService } from '@app/core/services/reward-propose-sign/reward-propose-sign.service';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SortEvent } from 'primeng/api';
import { Observable, Subject, Subscription } from 'rxjs';
import * as moment from 'moment';
import { BaseControl } from '@app/core/models/base.control';
import _ from 'lodash';
@Component({
  selector: 'decision-reward-employee-position',
  templateUrl: './decision-reward-employee-position.component.html',
  styleUrls: ['./decision-reward-employee-position.component.css']
})
export class DecidedRewardEmployeePositionComponent extends BaseComponent implements OnInit {
  @Input() pageFocus: Subject<any> = new Subject<any>();
  pageFocusSubscription: Subscription;
  @Input() setData: Subject<any> = new Subject<any>();
  setDataSubscription: Subscription;
  @Input() resetFormArray: Subject<any> = new Subject<any>();
  resetFormArraySubscription: Subscription;
  @Input() rewardType;
  @Input() status: any;
  @Input() fromSource;
  @Input() importStaffInsangnn: Subject<any> = new Subject<any>();
  importStaffInsangnnSubscription: Subscription;
  @Output() formRewarPersonalOutput = new EventEmitter();
  @Output() onChangeRewardEmployeePosition = new EventEmitter();
  @Input() closingDate;
  @Input() forwardLoadOrgazation: Subject<any> = new Subject<any>();
  @Input() processingData: Subject<any> = new Subject<any>();
  forwardLoadOrgazationSubscription: Subscription;
  @Input() isViewFile: boolean = false;
  @ViewChild('elePreviewAll') elePreviewAll: any;
  formSearchNguoiHuong: FormGroup;
  formRewardEmployee: FormArray;
  isSearchByPartyDomainData: string;
  isNotSearchByOrgDomainData: string;
  employeeFilterCondition: string;
  employeeFilterCondition1: string = " AND obj.status = 1 ";// dang vien
  employeeFilterCondition2: string;// công đoàn
  employeeFilterCondition3: string = " AND obj.gender = 2 ";// phu nu
  employeeFilterCondition4: string = "";// thanh nien
  numIndex = 1;
  isView: boolean = false;
  isEdit: boolean = false;
  isInsert: boolean = false;
  mapRewardTitleIdList: any = {};
  rewardCategory: any;
  firstRowIndex = 0;
  pageSize = 50;
  rewardProposeId: any;
  formSearchConfig = {
    keyword: [null]
  };
  formCachedSearch = {
    objectDate: null,
    lstEmployee: null,
    rewardType: null
  }
  constructor(
    private router: Router,
    private app: AppComponent,
    public actr: ActivatedRoute,
    public appParamService: AppParamService,
    public rewardCategoryService: RewardCategoryService,
    public rewardGeneralService: RewardGeneralService,
    public rewardProposeService: RewardProposeService,
    public rewardProposeSignService: RewardProposeSignService,
  ) {
    super(actr, CommonUtils.getPermissionCode("resource.rewardPropose"), ACTION_FORM.INSERT);
    this.formSearchNguoiHuong = this.buildForm({}, this.formSearchConfig);
    this.buildFormRewardEmployee();
    this.employeeFilterCondition2 = " AND EXISTS (SELECT 1 FROM emp_type_process etp WHERE etp.employee_id = obj.employee_id ";
    this.appParamService.appParams(APP_CONSTANTS.APP_PARAM_TYPE.LABOUR_CONTRACT_TYPE_REGULAR).subscribe(res => {
      if (res.data != null) {
        this.employeeFilterCondition2 += " AND ((etp.labour_contract_type_id IN (" + res.data[0].parValue + ") AND etp.emp_type_id = 486)";
      } else {
        this.employeeFilterCondition2 += " AND etp.labour_contract_type_id IN (-1)";
      }
    });
    this.appParamService.getValueByCode(APP_CONSTANTS.APP_PARAM_CODE.EMP_TYPE_REGULAR_1).subscribe(res => {
      if (res.data != null) {
        this.employeeFilterCondition2 += " OR etp.emp_type_id IN (" + res.data + "))";
      } else {
        this.employeeFilterCondition2 += " AND etp.emp_type_id IN (-1)";
      }
      this.employeeFilterCondition2 += " AND CURDATE() BETWEEN etp.effective_date AND COALESCE(etp.expired_date, CURDATE()))";
      this.employeeFilterCondition2 += " AND EXISTS (SELECT 1 FROM work_process wp WHERE wp.employee_id = obj.employee_id AND CURDATE() BETWEEN wp.effective_start_date AND COALESCE(wp.effective_end_date,CURDATE()))";
    });
  }
  ngOnDestroy() {
    this.pageFocusSubscription.unsubscribe();
    this.setDataSubscription.unsubscribe();
    this.resetFormArraySubscription.unsubscribe();
    this.importStaffInsangnnSubscription.unsubscribe();
    this.forwardLoadOrgazationSubscription.unsubscribe();
  }
  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 3) {
      this.isView = subPaths[4] === 'view-decision';
      this.isEdit = subPaths[4] === 'edit-decision';
      this.isInsert = subPaths[4] === 'add-decided';
    }
    this.formRewarPersonalOutput.emit(this.formRewardEmployee);
    this.resetFormArraySubscription = this.resetFormArray.subscribe(async res => {
      if(res.status && (res.status != 1 &&  res.status != 4)){
        this.isEdit = false;
        this.isView = true;
      }
      this.rewardType = res.rewardType;
      this.isSearchByPartyDomainData = null;
      // Khen thưởng đảng viên
      if (this.rewardType == 1) {
        this.employeeFilterCondition = this.employeeFilterCondition1;
        this.isSearchByPartyDomainData = 'true';
      } // Khen thưởng công đoàn
      else if (this.rewardType == 2) {
        this.employeeFilterCondition = this.employeeFilterCondition2;
      } // khen thuwognr phụ nữ
      else if(this.rewardType == 3) {
        this.employeeFilterCondition = this.employeeFilterCondition3
      }
      else {
        this.employeeFilterCondition = this.employeeFilterCondition4
      }
      this.isNotSearchByOrgDomainData = [2,3,4].some(item => item == this.rewardType) ? 'true' : null;
      this.formRewardEmployee.reset();
      this.buildFormRewardEmployee();
      this.formRewarPersonalOutput.emit(this.formRewardEmployee);
      await this.makeMapRewardTitleIdList();
    });
    this.setDataSubscription = this.setData.subscribe(async res => {
      this.rewardType = res.data.rewardType;
      await this.makeMapRewardTitleIdList();
      await this.setDataToForm(res.data.lstRewardProposeSignObject);
    });
    this.importStaffInsangnnSubscription = this.importStaffInsangnn.subscribe(async res => {
      await this.makeMapRewardTitleIdList();
      await this.setDataToForm(res);
    });
    this.forwardLoadOrgazationSubscription = this.forwardLoadOrgazation.subscribe(async () => {
      await this.getWorkUnit();
    })
    /**
     * thực hiện focus vào page bị lỗi
     */
    this.pageFocusSubscription = this.pageFocus.subscribe(focus => {
      if (focus.activeIndex === 1) {
        const stt = focus.stt;
        this.firstRowIndex = parseInt(stt/this.pageSize + "") * this.pageSize;
      }
    })
    if(this.status != null && this.status != 1 && this.status != 4){
      this.isView = true;
    }
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
  public initPositionForm(listData?: any) {
    this.buildFormRewardEmployee(listData);
  }
  
  get f () {
    return this.formSearchNguoiHuong.controls;
  }
  /**
   * makeDefaultForm
   */
  private makeDefaultForm(): FormGroup {
    const group = {
      rewardTitleId: [null, [ValidationService.required]], // id danh hieu/hinh thuc khen thuong
      objectIdsangnnMember: [null], // objectId
      employeeId: [null, ValidationService.required],
      employeeCode: [null],
      employeeName: [null],
      organizationName: [null],
      organizationId: [null],
      mapOrganizationId: [null], // id map
      rewardProposeId: [null], // parent id
      rewardProposeDetailId: [null], // id
      objectNameGuest: [null], // ho va ten hoac ten to chuc
      amountOfMoney: [null, [ValidationService.positiveInteger, ValidationService.maxLength(15)]], // tien thuong
      description: [null, [ValidationService.maxLength(2000)]], // noi dung khen thuong
      personalIdNumber: [null], // so cmnd, ho chieu
      includedStatement: ["Y"], // Có nằm trong tờ trình hay không
      personalIdIssuedDate: [null], // ngay cap cmnd, ho chieu
      personalIdIssuedPlace: [null], // noi cap cmnd, ho chieu
      nationId: [null], // quoc gia
      residencyStatus: [null], // tinh trang cu tru
      addressOrPhone: [null], // address or phone number
      rewardCategory: [""],
      rewardTitleIdList: [],
      keyword: [''],
      rewardTitleName: [''],
      isHidden: true,
      positionName: [null],
      soldierLevel: [null],
      isChoose: [null],
      isPreview: [null],
      receiveBonusOrgId: [null],
      isEnableReceiveBonusOrg : [true],
      partnerDrCode: [null],
      fundReservationLine: [null]
    };
    return this.buildForm({}, group);
  }


  public buildFormRewardEmployee(listData?: any) {
    const controls = new FormArray([]);
    if (!listData || listData.length === 0) {
      // const group = this.makeDefaultForm();
      // controls.push(group);
    } else {
      const groupConfig = this.makeDefaultForm();
      for (const i in listData) {
        const group: FormGroup = _.cloneDeep(groupConfig);
        const param = listData[i];
        group.patchValue(param);
        controls.push(group);
        this.numIndex++;
      }
    }
    controls.setValidators([
      ValidationService.duplicateArray(['employeeId', 'rewardTitleId'], 'rewardTitleId', 'rewardGeneral.rewardTitle'),
      this.checkMultipleMaxlength('rewardGeneral.rewardTitle')//"Đơn vị và chức danh dài nhất ${maxlength} ký tự"
    ]);
    this.formRewardEmployee = controls;
  }

  public checkMultipleMaxlength(messageKey?: string): ValidatorFn {
    return (array: FormArray) => {
      for (const group of array.controls) {
        const rewardTitleId = group.value.rewardTitleId;
        const rewardTitleIdList = group.value.rewardTitleIdList;
        const controlOrgName = group.get("organizationName") as FormControl;
        const controlPositionName = group.get("positionName") as FormControl;
        if (rewardTitleId != null && rewardTitleIdList != null && controlOrgName != null && controlPositionName != null) {
          const maxLength = rewardTitleIdList.find(e => e.rewardCategoryId == rewardTitleId).maxLength;
          if (!maxLength) {
            if (controlOrgName.hasError('multipleMaxlength')) {
              controlOrgName.setErrors(null);
              controlOrgName.markAsUntouched();
            }
            continue;
          }
          const orgName = controlOrgName.value || '';
          const postionName = controlPositionName.value || '';
          const orgNameLength = orgName.trim();
          const postionNameLength = postionName.trim();
          if (orgNameLength.length + postionNameLength.length > maxLength) {
            controlOrgName.setErrors({ multipleMaxlength: { multipleMaxlength: maxLength} });
          } else {
            // fix bug khi xoa row dau khi bi duplicate
            if (controlOrgName.hasError('multipleMaxlength')) {
              controlOrgName.setErrors(null);
              controlOrgName.markAsUntouched();
            }
          }
        }
      }
      return null;
    };
  }

  /**
   * addGroup
   * param index
   * param item
   */
  public add() {
    const controls = this.formRewardEmployee as FormArray;
    this.numIndex++;
    controls.insert(controls.length, this.makeDefaultForm());
    this.sortDataTable();
    const maxPage = Math.ceil(this.formRewardEmployee.controls.length / this.pageSize);
    this.firstRowIndex = (maxPage - 1) * this.pageSize;
    this.onChangeRewardEmployeePosition.emit(this.formRewardEmployee);
  }

  /**
   * removeGroup
   * param index
   * param item
   */
  public remove(index: number, item: FormGroup) {
    const controls = this.formRewardEmployee as FormArray;
    this.numIndex--;
    controls.removeAt(index);
    this.sortDataTable();
    this.onChangeRewardEmployeePosition.emit(this.formRewardEmployee);
  }

  private sortDataTable() {
    const _event = {
      data: this.formRewardEmployee.controls,
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

  wait(ms: number)  {
    return new Promise((resolve)=> {
      setTimeout(resolve, ms);
    });
  }
  public async setDataToForm(dataToSet) {
    const dataList = dataToSet.filter(data => data.rewardProposeDetailType == null || data.rewardProposeDetailType == 2);
    let control = new FormArray([]);
    const groupConfig = this.makeDefaultForm();
    console.log("dataList",dataList)
    if (this.processingData) {
      this.processingData.next({2: {rewardProposeDetailType: 2, total: dataList.length, status: 'begin', percent: 0}});
    }
    const initFormSearch = [];
    if(dataToSet == null) {
      control = this.formRewardEmployee;
    } else {
     this.formRewardEmployee = control;
    }
    let i = 0;
    for (const key in dataList) {
      const element = dataList[key];
      i++;
      if (i%200 == 0) {
        if (this.processingData) {
          await this.wait(0);
          this.processingData.next({2: {total: dataList.length, status: 'processing', percent: Number((i/dataList.length)*100).toFixed(2)}});
        }
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
          massOrganizationId: element.objectId,
          employeeId: element.employeeId,
          employeeName: element.employeeName,
          orgName: element.orgName ? element.orgName : '',
          organizationId: element.organizationId,
          mapOrganizationId: element.mapOrganizationId,
          organizationName: element.organizationName,
          employeeCode: element.employeeCode,
          rewardTitleName: element.rewardTitleName,
          rewardCategory: element.rewardCategory ? element.rewardCategory.toString() : null,
          positionName: element.positionName,
          soldierLevel: element.soldierLevel,
          receiveBonusOrgId: element.receiveBonusOrgId,
          isEnableReceiveBonusOrg : element.isEnableReceiveBonusOrg,
          includedStatement: element.includedStatement && element.includedStatement == 'Y' ? element.rewardCategory.toString() : null,
          partnerDrCode: element.partnerDrCode ? element.partnerDrCode : '',
          fundReservationLine: element.fundReservationLine
        });
        control.push(group);
        console.log("group",group)
      } else {
        if (element.rewardProposeDetailType == 2) {
          initFormSearch.push({
            employeeId: element.objectIdsangnnMember,
            employeeCode: element.employeeCode,
            employeeName: element.employeeName,
          });
          group.patchValue({
            description: element.description ? element.description : '',
            amountOfMoney: element.amountOfMoney ? element.amountOfMoney : '',
            rewardProposeDetailId: element.rewardProposeDetailId,
            rewardTitleId: element.rewardTitleId,
            massOrganizationId: element.objectId,
            employeeId: element.objectIdsangnnMember,
            employeeName: element.employeeName,
            orgName: element.orgName ? element.orgName : '',
            organizationId: element.organizationId,
            mapOrganizationId: element.mapOrganizationId,
            organizationName: element.organizationName,
            employeeCode: element.employeeCode,
            rewardTitleName: element.rewardTitleName,
            rewardCategory: element.rewardCategory ? element.rewardCategory.toString() : null,
            positionName: element.positionName,
            soldierLevel: element.soldierLevel,
            receiveBonusOrgId: element.receiveBonusOrgId,
            isEnableReceiveBonusOrg : element.isEnableReceiveBonusOrg,
            includedStatement: element.includedStatement && element.includedStatement == 'Y' ? element.rewardCategory.toString() : null,
            partnerDrCode: element.partnerDrCode ? element.partnerDrCode : '',
            fundReservationLine: element.fundReservationLine
          });
          control.push(group);
        }
      }
      this.isEnableReceiveBonusOrgCheck(group);
    }
    if (initFormSearch.length) {
      this.formCachedSearch.lstEmployee = initFormSearch;
    }
    this.formRewardEmployee = control;
    this.formRewarPersonalOutput.emit(this.formRewardEmployee);
    this.formRewardEmployee.setValidators([
      ValidationService.duplicateArray(['employeeId', 'rewardTitleId'], 'rewardTitleId', 'rewardGeneral.rewardTitle'),
      this.checkMultipleMaxlength('rewardGeneral.rewardTitle')//"Đơn vị và chức danh dài nhất ${maxlength} ký tự"
    ]);
    if (this.processingData) {
      await this.wait(0);
      this.processingData.next({2: {rewardProposeDetailType: 2, total: dataList.length, status: 'done', percent: 100}});
    }
  }

  patchValueEmploye(result?) {
    if (result) {
      this.formRewardEmployee.controls.forEach(element => {
        if (element.value['employeeId'] == result['employeeId']) {
          element.patchValue({
            employeeName: result.employeeName,
            employeeCode: result.employeeCode,
            organizationName: result.organizationName || null,
            organizationId: result.organizationId || null,
            positionName: result.positionName,
            mapOrganizationId: result.partyOrganizationId,
            soldierLevel: result.soldierLevel,
          });
        }
      });
    } else {
      this.formRewardEmployee.controls.forEach(element => {
        const elementValue = element.value;
        const obj = this.formCachedSearch.lstEmployee.find(item => item.employeeId === elementValue.employeeId);
        if (obj) {
          element.patchValue({
            employeeName: obj.employeeName,
            employeeCode: obj.employeeCode,
            organizationName: obj.organizationName || null,
            organizationId: obj.organizationId || null,
            mapOrganizationId: obj.partyOrganizationId
          });
        }
      });
    }
  }

  async getWorkUnit(event?) {
    this.formCachedSearch['rewardType'] = this.rewardType;
    if (this.closingDate.value) {
      const closingDateStr = moment(new Date(this.closingDate.value)).format('DD/MM/YYYY');
      this.formCachedSearch['objectDate'] = closingDateStr;
    } else {
      this.formCachedSearch['objectDate'] = moment(new Date()).format('DD/MM/YYYY');
    }
    if (!this.formCachedSearch['lstEmployee'] || !this.formCachedSearch['objectDate']) {
      this.patchValueEmploye();
      return;
    }
    const rest = await this.rewardProposeSignService.findUnitWork(this.formCachedSearch).toPromise();
    if (rest.type == RESPONSE_TYPE.SUCCESS) {
      const restData = rest.data;
      if (restData && restData.length) {
        const lstEmployee = this.formCachedSearch.lstEmployee;
        restData.forEach(item => {
          const obj = lstEmployee.find(ele => ele.employeeId == item.employeeId);
          if (obj) {
            const mergeObj = { ...obj, ...item };
            this.patchValueEmploye(mergeObj);
          }
        });
      } else {
        this.app.warningMessage('pleaseOrganization');
        this.patchValueEmploye();
        return;
      }
    }
  }

  async onSelectEmployee(event) {
    const { selectField: employeeId, codeField: employeeCode, nameField: employeeName } = event;
    const lstEmployeePosition = this.formRewardEmployee.value || [];
    if (lstEmployeePosition.length) {
      const lstEmployee = this.formCachedSearch['lstEmployee'] || [];
      const tempEmployee = lstEmployee.find(ele => ele.employeeId == employeeId);
      if (!tempEmployee) {
        lstEmployee.push({
          employeeId,
          employeeCode,
          employeeName
        });
      }
      this.formCachedSearch['lstEmployee'] = lstEmployee;
    }
    await this.getWorkUnit(event);
  }


  public getListRewardCategory(rewardGroup: number, rewardObjectType: number, rewardType): Observable<any> {
    const data = {rewardGroup: rewardGroup, rewardObjectType: rewardObjectType, rewardType: rewardType};
    return this.rewardCategoryService.getListRewardCategory(data);
  }

  filterFormSubsidizedSuggest() {
    let keyword = this.formSearchNguoiHuong.controls['keyword'].value.toLowerCase() ;
    this.formRewardEmployee.controls.forEach((item:FormGroup) => {
      const rewardTitleIdList = this.mapRewardTitleIdList[this.rewardType][item.value.rewardCategory];
      var map = new Map(rewardTitleIdList.map(option => [option.rewardCategoryId, option.name]));
      if(keyword === "") {
        item.controls['isHidden'].setValue(false);
      } else {
        let rewardTitleName = map.get(item.value.rewardTitleId) + "";
        const isAmountOfMoney = item.value.amountOfMoney ? item.value.amountOfMoney.toString().includes(keyword) : false;
        const isEmployeeCode = item.value.employeeCode ? item.value.employeeCode.toLowerCase().includes(keyword) : false;
        const isEmployeeName = item.value.employeeName ? item.value.employeeName.toLowerCase().includes(keyword) : false;
        const isOrganizationName = item.value.organizationName ? item.value.organizationName.toLowerCase().includes(keyword) : false;
        const isDescription = item.value.description ? item.value.description.toLowerCase().includes(keyword) : false;
        const isRewardTitleName = rewardTitleName ? rewardTitleName.toLowerCase().includes(keyword) : false;
        const isSoldierLevel = item.value.soldierLevel ? item.value.soldierLevel.toLowerCase().includes(keyword) : false;
        const isPositionName = item.value.positionName ? item.value.positionName.toLowerCase().includes(keyword) : false;
        if (isAmountOfMoney || isEmployeeName || isEmployeeCode || isDescription || isRewardTitleName || isOrganizationName
           || isSoldierLevel || isPositionName) {
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
    const hasValidate = rowData.value.isChoose || rowData.value.isSuggest;
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

  public onProposeOrgChange(event) {
    this.formRewardEmployee.controls.forEach(element => {
      element.patchValue({
        orgName: event.name,
        // receiveBonusOrgId: event.organizationId
      })
    })
  }
}
