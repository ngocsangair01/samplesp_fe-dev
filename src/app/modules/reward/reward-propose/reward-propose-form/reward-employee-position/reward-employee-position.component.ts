import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS, LARGE_MODAL_OPTIONS, LOAI_DANH_MUC_KHEN_THUONG, LOAI_DOI_TUONG_KHEN_THUONG, NHOM_KHEN_THUONG, RESOURCE } from '@app/core';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { RewardCategoryService } from '@app/core/services/reward-category/reward-category.service';
import { RewardGeneralService } from '@app/core/services/reward-general/reward-general.service';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SortEvent } from 'primeng/api';
import { Observable, Subject, Subscription } from 'rxjs';
import { RewardSuggestImportManageComponent } from '../file-import-reward-management/file-import-reward-management.component';
import * as moment from 'moment';
import { BaseControl } from '@app/core/models/base.control';
import _ from 'lodash';
import { ReportPreviewCertificateComponent } from '@app/modules/reward/reward-general-preview/report-preview-certificate';
import {element} from "protractor";
@Component({
  selector: 'reward-employee-position',
  templateUrl: './reward-employee-position.component.html',
  styleUrls: ['./reward-employee-position.component.css']
})
export class RewardEmployeePositionComponent extends BaseComponent implements OnInit {
  @Input() pageFocus: Subject<any> = new Subject<any>();
  pageFocusSubscrition: Subscription;
  @Input() resetFormSubject: Subject<number> = new Subject<number>();
  resetFormArraySubscrition: Subscription;
  @Input() setData: Subject<any> = new Subject<any>();
  setDataSubscrition: Subscription;
  @Input() processingData: Subject<any> = new Subject<any>();
  @Input() resetFormArray: Subject<any> = new Subject<any>();
  @Input() rewardType;
  @Input() dataImportStaffInsangnn: Subject<any> = new Subject<any>();
  dataImportStaffInsangnnSubscrition: Subscription;
  @Output() formRewarPersonalOutput = new EventEmitter();
  @Input() isDisable: boolean = false;
  @Input() isHideProposeSign: boolean = false;
  @Input() isViewFile: boolean = false;
  @Input() hideIncludeStatement: boolean = false;
  @ViewChild('elePreviewAll') elePreviewAll: any;
  @ViewChild('eleChooseAll') eleChooseAll: any;
  @ViewChild('eleSuggestAll') eleSuggestAll: any;
  formSearchNguoiHuong: FormGroup;
  formRewardEmployee: FormArray;
  employeeFilterCondition: string;
  isSearchByPartyDomainData: string;
  isNotSearchByOrgDomainData: string;
  employeeFilterCondition1: string = " AND obj.status = 1 ";// dang vien
  employeeFilterCondition2: string;// công đoàn
  employeeFilterCondition3: string = " AND obj.gender = 2 ";// phu nu
  employeeFilterCondition4: string = "";// thanh nien
  numIndex = 1;
  isView: boolean = false;
  isEdit: boolean = false;
  isAdd: boolean = false;
  isViewSign: boolean = false;
  isEditSign: boolean = false;
  isAddSign: boolean = false;
  isViewSelection: boolean = false;
  isEditSelection: boolean = false;
  mapRewardTitleIdList: any = {};
  rewardCategory: any;
  firstRowIndex = 0;
  pageSize = 50;
  rewardProposeId: any;
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
    public rewardCategoryService: RewardCategoryService,
    public rewardGeneralService: RewardGeneralService,
    public rewardProposeService: RewardProposeService,
    private modalService: NgbModal
  ) {
    super(actr, RESOURCE.MASS_MEMBER, ACTION_FORM.INSERT);
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

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 3) {
      this.isView = subPaths[3] === 'view';
      this.isEdit = subPaths[3] === 'edit';
      this.isAdd = subPaths[3] === 'add';
      this.isViewSign = subPaths[3] === 'view-sign';
      this.isEditSign = subPaths[3] === 'edit-sign';
      this.isAddSign = subPaths[3] === 'add-sign';
      this.isViewSelection = subPaths[3] === 'view-selection';
      this.isEditSelection = subPaths[3] === 'edit-selection';
    }
    this.formRewarPersonalOutput.emit(this.formRewardEmployee);
    this.resetFormArraySubscrition = this.resetFormArray.subscribe(async res => {
      this.rewardType = res.rewardType;
      this.isSearchByPartyDomainData = null
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
      };

      this.isNotSearchByOrgDomainData = [2,3,4].some(item => item == this.rewardType) ? 'true' : null;
      this.formRewardEmployee.reset();
      this.buildFormRewardEmployee();
      this.formRewarPersonalOutput.emit(this.formRewardEmployee);
      await this.makeMapRewardTitleIdList();
    });
    this.setDataSubscrition = this.setData.subscribe(async res => {
      this.isSynthetic = res.data.isSynthetic;
      this.rewardType = res.data.rewardType;
      await this.makeMapRewardTitleIdList();
      await this.setDataToForm(res.data.lstRewardProposeDetail);
    });
    this.dataImportStaffInsangnnSubscrition = this.dataImportStaffInsangnn.subscribe(async res => {
      await this.makeMapRewardTitleIdList();
      await this.setDataToForm(res);
    });
    /**
     * thực hiện focus vào page bị lỗi
     */
     this.pageFocusSubscrition = this.pageFocus.subscribe(focus => {
      if (focus.activeIndex === 1) {
        const stt = focus.stt;
        this.firstRowIndex = parseInt(stt/this.pageSize + "") * this.pageSize;
      }
    })
  }

  ngOnDestroy() {
    this.pageFocusSubscrition.unsubscribe();
    this.setDataSubscrition.unsubscribe();
    this.dataImportStaffInsangnnSubscrition.unsubscribe();
    this.resetFormArraySubscrition.unsubscribe();
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

  get f() {
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
      mapOrganizationId: [null], // id map
      organizationId: [null],
      rewardProposeId: [null], // parent id
      rewardProposeDetailId: [null], // id
      objectNameGuest: [null], // ho va ten hoac ten to chuc
      amountOfMoney: [null, [ValidationService.positiveInteger, ValidationService.maxLength(15)]], // tien thuong
      description: [null, [ValidationService.maxLength(2000)]], // noi dung khen thuong
      includedStatement: ["Y"], // có thanh toán hay không
      personalIdNumber: [null], // so cmnd, ho chieu
      personalIdIssuedDate: [null], // ngay cap cmnd, ho chieu
      personalIdIssuedPlace: [null], // noi cap cmnd, ho chieu
      nationId: [null], // quoc gia
      residencyStatus: [null], // tinh trang cu tru
      addressOrPhone: [null], // address or phone number
      rewardCategory: [""],
      rewardTitleIdList: [],
      keyword: [''],
      rewardTitleName: [''],
      isChoose: [null],
      isSuggest: [null],
      isPreview: [null],
      reason: [null],
      isHidden: true,
      rewardProposeDetailType: [null],
      positionName: [null], // chức danh
      soldierLevel: [null], // quân hàm
      incomeType:[null],
      reimbursementOrgName: [null],
      receiveBonusOrgId: [null],
      isEnableReceiveBonusOrg : [true],
      partnerDrCode: [null],
      fundReservationLine: [null]
    };
    if (this.isEditSelection || this.isViewSelection) {
      group['reason'] = [null, ValidationService.required]
    }
    return this.buildForm({}, group);
  }


  public buildFormRewardEmployee(listData?: any) {
    const controls = new FormArray([]);
    if (!listData || listData.length === 0) {
      // const group = this.makeDefaultForm();
      // controls.push(group);
    } else {
      const formConfig = this.makeDefaultForm();
      for (const i in listData) {
        const group = _.cloneDeep(formConfig);
        const param = listData[i];
        if (this.isEditSelection && (param.isChoose == 0 || param.isChoose == null) && (param.isSuggest == 0 || param.isSuggest == null)) {
          group.removeControl('reason');
          group.addControl('reason', new FormControl('', [ValidationService.required]));
        }
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

  public openFormImport() {
    if (!this.rewardType) {
      this.app.warningMessage('pleaseChooseRewardType');
      return;
    }
    const modalRef = this.modalService.open(RewardSuggestImportManageComponent, DEFAULT_MODAL_OPTIONS);
    const data = { rewardType: this.rewardType, rewardObjectType: 1, option: 2 };
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
    const dataList = dataToSet.filter(data => data.rewardProposeDetailType == null || data.rewardProposeDetailType == 2);
    let control = new FormArray([]);
    console.log("data",dataList)
    const groupConfig = this.makeDefaultForm();
    if (this.processingData) {
      this.processingData.next({2: {rewardProposeDetailType: 2, total: dataList.length, status: 'begin', percent: 0}});
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
          organizationId: element.organizationId,
          mapOrganizationId: element.mapOrganizationId,
          organizationName: element.organizationName,
          employeeCode: element.employeeCode,
          rewardTitleName: element.rewardTitleName,
          isSuggest: element.isSuggest,
          isChoose: element.isChoose,
          reason: element.reason,
          rewardCategory: element.rewardCategory ? element.rewardCategory.toString() : null,
          positionName: element.positionName,
          soldierLevel: element.soldierLevel,         
          incomeType : element.incomeType  == 0? "Miễn thuế":element.incomeType  == 1?  "Chịu thuế" : "",
          reimbursementOrgName: element.reimbursementOrgName != undefined ? element.reimbursementOrgName: "",
          receiveBonusOrgId: element.receiveBonusOrgId,
          includedStatement: element.includedStatement && element.includedStatement == 'Y' ? element.rewardCategory.toString() : null,
          partnerDrCode: element.partnerDrCode,
          fundReservationLine: element.fundReservationLine
        });
        control.push(group);
        console.log("group",group)
      } else {
        if (element.rewardProposeDetailType == 2) {
          group.patchValue({
            description: element.description ? element.description : '',
            amountOfMoney: element.amountOfMoney ? element.amountOfMoney : '',
            rewardProposeDetailId: element.rewardProposeDetailId,
            rewardTitleId: element.rewardTitleId,
            massOrganizationId: element.objectId,
            employeeId: element.objectIdsangnnMember,
            employeeName: element.employeeName,
            organizationId: element.organizationId,
            mapOrganizationId: element.mapOrganizationId,
            organizationName: element.organizationName,
            employeeCode: element.employeeCode,
            rewardTitleName: element.rewardTitleName,
            rewardCategory: element.rewardCategory ? element.rewardCategory.toString() : null,
            isSuggest: element.isSuggest,
            isChoose: element.isChoose,
            reason: element.reason,
            positionName: element.positionName,
            soldierLevel: element.soldierLevel,            
            incomeType : element.incomeType  == 0? "Miễn thuế":element.incomeType  == 1?  "Chịu thuế" : "",
            reimbursementOrgName: element.reimbursementOrgName != undefined ? element.reimbursementOrgName: "",
            receiveBonusOrgId: element.receiveBonusOrgId,
            includedStatement: element.includedStatement && element.includedStatement == 'Y' ? element.rewardCategory.toString() : null,
            partnerDrCode: element.partnerDrCode,
            fundReservationLine: element.fundReservationLine
          });
          control.push(group);
        }
      }
      this.isEnableReceiveBonusOrgCheck(group);
    };
    this.formRewardEmployee = control;
    if (this.isEditSelection) {
      this.formRewardEmployee.controls.forEach(ele => {
        this.checkValidate(ele);
      })
    }
    this.formRewarPersonalOutput.emit(this.formRewardEmployee);
    this.formRewardEmployee.setValidators([
      ValidationService.duplicateArray(['employeeId', 'rewardTitleId'], 'rewardTitleId', 'rewardGeneral.rewardTitle'),
      this.checkMultipleMaxlength('rewardGeneral.rewardTitle')//"Đơn vị và chức danh dài nhất ${maxlength} ký tự"
    ]);
    this.updateChooseAll(this.formRewardEmployee.controls)
    if (this.processingData) {
      await this.wait(0);
      this.processingData.next({2: {rewardProposeDetailType: 2, total: dataList.length, status: 'done', percent: 100}});
    }
  }

  patchValueEmploye(event: any, organizationName: string, organizationId, positionName, soldierLevel, partyOrganizationId) {
    this.formRewardEmployee.controls.forEach(element => {
      if (element.value['employeeId'] == event.selectField) {
        element.patchValue({
          employeeName: event.nameField,
          employeeId: event.selectField,
          employeeCode: event.codeField,
          organizationName: organizationName,
          organizationId: organizationId,
          positionName: positionName,
          mapOrganizationId: partyOrganizationId,
          soldierLevel: soldierLevel
        })
      } else if (element.value['employeeId'] == event.selectField && organizationId == null) {
        element.patchValue({
          employeeName: event.nameField,
          employeeId: event.selectField,
          employeeCode: event.codeField,
          positionName: positionName,
          mapOrganizationId: partyOrganizationId,
          soldierLevel: soldierLevel
        })
      }
    });
  }
  public genData(event) {
    const dateString = moment(new Date()).format('DD/MM/YYYY');
    const formData = {
      employeeId: event.selectField,
      decisionDate: dateString,
      rewardType: this.rewardType
    }
    this.rewardGeneralService.findUnitWork(formData).subscribe(res => {
      if (res.data) {
        this.patchValueEmploye(event, res.data.organizationName || '', res.data.organizationId || '',
            res.data.positionName || '', res.data.soldierLevel || '', res.data.partyOrganizationId);
      } else {
        this.patchValueEmploye(event, '', '','','','');
        this.app.warningMessage('pleaseOrganization');
        return;
      }
    })

  }

  public getListRewardCategory(rewardGroup: number, rewardObjectType: number, rewardType): Observable<any> {
    const data = {rewardGroup: rewardGroup, rewardObjectType: rewardObjectType, rewardType: rewardType};
    return this.rewardCategoryService.getListRewardCategory(data);
  }

  filterFormSubsidizedSuggest() {
    let keyword = this.formSearchNguoiHuong.controls['keyword'].value.toLowerCase();
    this.formRewardEmployee.controls.forEach((item: FormGroup) => {
      const rewardTitleIdList = this.mapRewardTitleIdList[this.rewardType][item.value.rewardCategory];
      const map = new Map(rewardTitleIdList.map(option => [option.rewardCategoryId, option.name]));
      if (keyword === "") {
        item.controls['isHidden'].setValue(false);
      } else {
        let rewardTitleName = map.get(item.value.rewardTitleId) + "";
        const isAmountOfMoney = item.value.amountOfMoney ? item.value.amountOfMoney.toString().includes(keyword) : false;
        const isEmployeeCode = item.value.employeeCode ? item.value.employeeCode.toLowerCase().includes(keyword) : false;
        const isEmployeeName = item.value.employeeName ? item.value.employeeName.toLowerCase().includes(keyword) : false;
        const isPositionName = item.value.positionName ? item.value.positionName.toLowerCase().includes(keyword) : false;
        const isSoldierLevel = item.value.soldierLevel ? item.value.soldierLevel.toLowerCase().includes(keyword) : false;
        const isOrganizationName = item.value.organizationName ? item.value.organizationName.toLowerCase().includes(keyword) : false;
        const isDescription = item.value.description ? item.value.description.toLowerCase().includes(keyword) : false;
        const receiveBonusOrgId = item.value.receiveBonusOrgId ? item.value.receiveBonusOrgId.toLowerCase().includes(keyword) : false;
        const isRewardTitleName = rewardTitleName ? rewardTitleName.toLowerCase().includes(keyword) : false;
        if (isAmountOfMoney || isEmployeeName || isEmployeeCode || isDescription || isRewardTitleName || isOrganizationName
          || isPositionName || isSoldierLevel || receiveBonusOrgId) {
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

  /**
   * Ham preview file khen thuong
   * @param item
   */
  previewRewardTitle(item) {
    const formData = {
      rewardTitleId: item.value.rewardTitleId || '',
      objectName: item.value.employeeName || '',
      organizationName: item.value.organizationName || '',
      positionName: item.value.positionName || '',
      soldierLevel: item.value.soldierLevel || '',
      description: item.value.description || '',
      rewardObjectType: 1,
  }
    const modalRef = this.modalService.open(ReportPreviewCertificateComponent, LARGE_MODAL_OPTIONS);
    modalRef.componentInstance.value = formData;
    modalRef.componentInstance.isBlobFile = false;
    modalRef.componentInstance.isPreviewRewardTitle = true;
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
    const newReasonControl = _.cloneDeep(this.newReasonControl);
    const hasValidate = rowData.value.isChoose || rowData.value.isSuggest || !rowData.value.isPreview;
    if (!hasValidate) {
      newReasonControl.setValidators(ValidationService.required);
    }
    newReasonControl.setValue(reason);
    rowData.addControl('reason', newReasonControl);
    rowData.updateValueAndValidity();
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

  public onProposeOrgChange(event) {
    this.formRewardEmployee.controls.forEach(element => {
      element.patchValue({
        orgName: event.name,
        // receiveBonusOrgId: event.organizationId
      })
    })
  }
}
