import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import {
  ACTION_FORM, APP_CONSTANTS,
  DynamicApiService,
  RequestReportService,
} from '@app/core';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { AppComponent } from '@app/app.component';
import { DialogService } from 'primeng/api';
import { HelperService } from '@app/shared/services/helper.service';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { FileControl } from '@app/core/models/file.control';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { RewardCategoryFunding } from '@app/core/services/reward-category/reward-category-funding';
import { WelfarePolicyCategoryService } from '@app/core/services/population/welfare-policy-category.service';
import {CategoryService} from "@app/core/services/setting/category.service";
import {formatDate} from "@angular/common";

@Component({
  selector: 'welfare-policy-category-form',
  templateUrl: './welfare-policy-category-form.component.html',
  styleUrls: ['./welfare-policy-category-form.component.css']
})
export class WelfarePolicyFormComponent extends BaseComponent implements OnInit, AfterViewInit {
  viewMode;
  isChangeEffectiveStartDate: boolean = false;
  isChangeEffectiveEndDate: boolean = false;
  formGroup: FormGroup;
  welfarePolicyNormBOList: FormArray;
  policyDocumentBOList: FormArray;
  policyDeseaseBOList: FormArray;
  isInvalidRelationship: boolean = false;
  isRequireRelationship: boolean = true;
  checkLimitAmountUnit: boolean = false;
  checkLimitNumber: boolean = false;
  sheetNoOptions: any;
  header;
  disable;
  isMasO: boolean = false;
  isPartyO: boolean = false;
  isOrg: boolean = false;
  branch: any;
  rewardType: any;
  action: any;
  firstRowIndexNorm = 0;
  pageSizeNorm = 10;
  firstRowIndexDocumentType = 0;
  pageSizeDocumentType = 10;
  firstRowIndexDesease = 0;
  pageSizeDesease = 10;
  isCreate = false;
  relationshipList;
  requestDocumentTypeOptions;
  organizationModelOptions;
  employeeStatusOptions;
  welfareCategoryLevelOptions;
  fundingCategoryOptions;
  categoryOptions;
  welfarePolicyCategoryId;
  isInvalidEndDate: boolean = false;
  isAllowanceHM: boolean = false;
  formConfig = {
    welfarePolicyCategoryId: [null],
    name: [null, ValidationService.required],
    code: [null, ValidationService.required],
    type: [null, ValidationService.required],
    objectType: [null, ValidationService.required],
    relationShipList: [null],
    effectiveStartDate: [new Date(), ValidationService.required],
    effectiveEndDate: [null],
    incomeType: [null],
    limitNumber: [null],
    limitUnit: [null],
    order: [null],
    description: [null],                               
    welfarePolicyNormBOList: [null],
    policyDocumentBOList: [null],
    policyDeseaseBOList: [null],
    employeeStatus: [null, ValidationService.required],
    orgType: [null, ValidationService.required],
    limitAmount: [null],
    limitAmountUnit: [null],
  }

  policyDocumentFormConfig = {
    policyDocumentId: [null],
    welfarePolicyCategoryId: [null],
    code: [null],
    isRequired: [0],
    isActive: [0],
    isDeleted: [1]
  }

  welfarePolicyNormFormConfig = {
    welfarePolicyNormId: [null],
    welfarePolicyCategoryId: [null],
    chairmanType: [null, [ValidationService.required]],
    fundingCategoryId: [null, ValidationService.required],
    incomeType: [null, ValidationService.required],
    level: [null, ValidationService.required],
    amount: [null],
    isFixed: [0],
    isDeleted: [1]
  }

  policyDeseaseFormConfig = {
    policyDeseaseId: [null],
    welfarePolicyCategoryId: [null],
    categoryId: [null],
    isDeleted: [1]
  }

  typeOptions = [
    { name: 'Phúc lợi', value: 1 },
    { name: 'Hỗ trợ', value: 2 },
    { name: 'Trợ cấp bệnh', value: 3 },
    { name: 'Trợ cấp hiếm muộn', value: 4 }
  ]
  objectTypeOptions = [
    { name: 'Bản thân', value: 1 },
    { name: 'Thân nhân', value: 2 }
  ]
  incomeTypeList = [
    { name: 'Miễn thuế', value: 0 },
    { name: 'Chịu thuế', value: 1 }
  ]
  limitUnitList = [
    { name: 'Năm', value: 1 },
    { name: 'Nhân viên', value: 2 }
  ]
  chairmanTypeList = [
    { name: 'Đơn vị', value: 2 },
    { name: 'Ban giám đốc', value: 1 },
    { name: 'Tập đoàn', value: 3 }
  ]
  constructor(
    private requestReportService: RequestReportService,
    private appParamService: AppParamService,
    private app: AppComponent,
    public dialogService: DialogService,
    public helperService: HelperService,
    private dynamicApiService: DynamicApiService,
    private fileStorageService: FileStorageService,
    private router: Router,
    private service: WelfarePolicyCategoryService,
    private sysCatService: SysCatService,
    public rewardCategoryFunding: RewardCategoryFunding,
    public categoryService: CategoryService,
    public actr: ActivatedRoute
  ) {
    super();
    this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd && this.actr.snapshot && this.actr.snapshot.params) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.welfarePolicyCategoryId = params.id;
        }
      }
    });
    this.setMainService(this.service);
  }

  ngAfterViewInit() {
    if (this.welfarePolicyCategoryId) {
      this.service.findOne(this.welfarePolicyCategoryId).subscribe(res => {
        this.isRequireRelationship = res.data.objectType === 2;
        this.buildPolicyDocumentFormConfig(res.data.policyDocumentBOList);
        this.buildWelfarePolicyNormFormConfig(res.data.welfarePolicyNormBOList);
        this.buildPolicyDeseaseFormConfig(res.data.policyDeseaseBOList);
      })
    }
  }

  ngOnInit() {
    this.employeeStatusOptions = APP_CONSTANTS.EMPLOYEE_STATUS;
    this.organizationModelOptions = APP_CONSTANTS.REWARD_GENERAL_TYPE_LIST;
    this.welfareCategoryLevelOptions = APP_CONSTANTS.WELFARE_CATEGORY_LEVEL;
    this.sysCatService.findBySysCatTypeIdActive(APP_CONSTANTS.SYS_CAT_TYPE_ID.RELATION_SHIP).subscribe(res => {
      this.relationshipList = res.data;
    });
    this.appParamService.appParams('LOAI_GIAY_TO').subscribe(res => {
      this.requestDocumentTypeOptions = res.data;
    });
    this.rewardCategoryFunding.getListRewardCategoryFunding().subscribe(res => {
      this.fundingCategoryOptions = res;
    });
    this.categoryService.findByCategoryTypeCode('danh_muc_benh').subscribe(res => {
      this.categoryOptions = res.data;
    })
    this.viewMode = this.router.url.includes('/population/welfare-policy-category/view');
    if (this.welfarePolicyCategoryId) {
      this.header = "Xem thông tin danh mục chính sách"
      // this.helperService.setWaitDisplayLoading(true);
      this.service.findOne(this.welfarePolicyCategoryId).subscribe(res => {
        res.data.type = this.typeOptions.find(e => { return e.value == res.data.type });
        res.data.objectType = this.objectTypeOptions.find(e => { return e.value == res.data.objectType });
        res.data.incomeType = this.incomeTypeList.find(e => { return e.value == res.data.incomeType });
        if(res.data.type.value === 4){
          this.isAllowanceHM = true;
          this.categoryService.findByCategoryTypeCode('KY_THUAT_DIEU_TRI_HIEM_MUON').subscribe(res => {
            this.categoryOptions = res.data;
          })
        }
        this.isRequireRelationship = res.data.objectType === 2;
        res.data.limitUnit = this.limitUnitList.find(e => { return e.value == res.data.limitUnit });
        res.data.limitAmountUnit = this.limitUnitList.find(e => { return e.value == res.data.limitAmountUnit });
        this.formGroup = this.buildForm(res.data, this.formConfig, ACTION_FORM.INSERT);
        const fileAttachment = new FileControl(null);
        if (res.data && res.data.fileAttachment) {
          if (res.data.fileAttachment.file) {
            fileAttachment.setFileAttachment(res.data.fileAttachment.file);
          }
        }
        this.formGroup.addControl('file', fileAttachment);
        this.welfarePolicyNormBOList = new FormArray([this.makeDefaultWelfarePolicyNormFormConfig()])
        this.policyDocumentBOList = new FormArray([this.makeDefaultPolicyDocumentFormConfig()])
        this.policyDeseaseBOList = new FormArray([this.makeDefaultPolicyDeseaseFormConfig()])
      })
    }else{
      this.header = "Thêm mới danh mục chính sách";
      this.isCreate = true;
      this.formGroup = this.buildForm({}, this.formConfig, ACTION_FORM.INSERT);
      const fileAttachment = new FileControl(null);
      this.formGroup.addControl('file', fileAttachment);
      this.buildPolicyDocumentFormConfig();
      this.buildWelfarePolicyNormFormConfig();
      this.buildPolicyDeseaseFormConfig();
    }
  }

  private makeDefaultPolicyDocumentFormConfig(): FormGroup {
    const formPolicyDocumentConfig = this.buildForm({}, this.policyDocumentFormConfig);
    return formPolicyDocumentConfig;
  }

  private makeDefaultWelfarePolicyNormFormConfig(): FormGroup {
    const welfarePolicyNormFormConfig = this.buildForm({}, this.welfarePolicyNormFormConfig);
    return welfarePolicyNormFormConfig;
  }

  private makeDefaultPolicyDeseaseFormConfig(): FormGroup {
    const policyDeseaseFormConfig = this.buildForm({}, this.policyDeseaseFormConfig);
    return policyDeseaseFormConfig;
  }

  public addRow(index: number, item: FormGroup) {
    const controls = this.welfarePolicyNormBOList as FormArray;
    controls.insert(index + 1, this.makeDefaultWelfarePolicyNormFormConfig());
    const maxPage = Math.ceil(this.welfarePolicyNormBOList.controls.length / this.pageSizeNorm);
    this.firstRowIndexNorm = (maxPage - 1) * this.pageSizeNorm;
  }

  public removeRow(index: number, item: FormGroup) {
    this.welfarePolicyNormBOList.value[index].isDeleted = 0;
    this.buildWelfarePolicyNormFormConfig(this.welfarePolicyNormBOList.value);
    let count = 0
    for(let item in this.welfarePolicyNormBOList.value){
      if(this.welfarePolicyNormBOList.value[item].isDeleted == 0){
        count++;
      }
    }
    if(count == this.welfarePolicyNormBOList.value.length){
      const controls = this.welfarePolicyNormBOList as FormArray;
      this.buildWelfarePolicyNormFormConfig();
      const group = this.makeDefaultWelfarePolicyNormFormConfig();
      controls.push(group);
      this.welfarePolicyNormBOList = controls;
    }
  }

  public addRowDocumentType(index: number, item: FormGroup) {
    const controls = this.policyDocumentBOList as FormArray;
    controls.insert(index + 1, this.makeDefaultPolicyDocumentFormConfig());
    const maxPage = Math.ceil(this.policyDocumentBOList.controls.length / this.pageSizeDocumentType);
    this.firstRowIndexDocumentType = (maxPage - 1) * this.pageSizeDocumentType;
  }

  public removeRowDocumentType(index: number, item: FormGroup) {
    this.policyDocumentBOList.value[index].isDeleted = 0;
    this.buildPolicyDocumentFormConfig(this.policyDocumentBOList.value);
    let count = 0;
    for(let item in this.policyDocumentBOList.value){
      if(this.policyDocumentBOList.value[item].isDeleted == 0){
        count++;
      }
    }
    if(count == this.policyDocumentBOList.value.length){
      const controls = this.policyDocumentBOList as FormArray;
      this.buildPolicyDocumentFormConfig();
      const group = this.makeDefaultPolicyDocumentFormConfig();
      controls.push(group);
      this.policyDocumentBOList = controls;
    }
  }

  public addRowPolicyDesease(index: number, item: FormGroup) {
    const controls = this.policyDeseaseBOList as FormArray;
    controls.insert(index + 1, this.makeDefaultPolicyDeseaseFormConfig());
    const maxPage = Math.ceil(this.policyDeseaseBOList.controls.length / this.pageSizeDesease);
    this.firstRowIndexDesease = (maxPage - 1) * this.pageSizeDesease;
  }

  public removeRowPolicyDesease(index: number, item: FormGroup) {
    this.policyDeseaseBOList.value[index].isDeleted = 0;
    this.buildPolicyDeseaseFormConfig(this.policyDeseaseBOList.value);
    let count = 0;
    for(let item in this.policyDeseaseBOList.value){
      if(this.policyDeseaseBOList.value[item].isDeleted == 0){
        count++;
      }
    }
    if(count == this.policyDeseaseBOList.value.length){
      const controls = this.policyDeseaseBOList as FormArray;
      this.buildPolicyDeseaseFormConfig();
      const group = this.makeDefaultPolicyDeseaseFormConfig();
      controls.push(group);
      this.policyDeseaseBOList = controls;
    }
  }

  private buildPolicyDocumentFormConfig(list?: any) {
    if (!list || list.length == 0) {
      this.policyDocumentBOList = new FormArray([this.makeDefaultPolicyDocumentFormConfig()]);
    } else {
      const controls = new FormArray([]);
      for (const i in list) {
        const formTableConfig = list[i];
        const group = this.makeDefaultPolicyDocumentFormConfig();
        group.patchValue(formTableConfig);
        controls.push(group);
      }
      this.policyDocumentBOList = controls;
    }
  }

  private buildWelfarePolicyNormFormConfig(list?: any) {
    if (!list || list.length == 0) {
      this.welfarePolicyNormBOList = new FormArray([this.makeDefaultWelfarePolicyNormFormConfig()]);
    } else {
      const controls = new FormArray([]);
      for (const i in list) {
        const formTableConfig = list[i];
        const group = this.makeDefaultWelfarePolicyNormFormConfig();
        group.patchValue(formTableConfig);
        controls.push(group);
      }
      this.welfarePolicyNormBOList = controls;
    }
  }

  private buildPolicyDeseaseFormConfig(list?: any) {
    if (!list || list.length == 0) {
      this.policyDeseaseBOList = new FormArray([this.makeDefaultPolicyDeseaseFormConfig()]);
    } else {
      const controls = new FormArray([]);
      for (const i in list) {
        const formTableConfig = list[i];
        const group = this.makeDefaultPolicyDeseaseFormConfig();
        group.patchValue(formTableConfig);
        controls.push(group);
      }
      this.policyDeseaseBOList = controls;
    }
  }

  previous() {
    this.router.navigateByUrl('/population/welfare-policy-category');
  }

  get f() {
    return this.formGroup.controls;
  }

  setValueInPDropDown(){
    this.formGroup.controls['type'].setValue(this.typeOptions.find(e => { return e.value == this.formGroup.value.type }))
    this.formGroup.controls['objectType'].setValue(this.objectTypeOptions.find(e => { return e.value == this.formGroup.value.objectType }))
    this.formGroup.controls['limitUnit'].setValue(this.limitUnitList.find(e => { return e.value == this.formGroup.value.limitUnit }))
    this.formGroup.controls['limitAmountUnit'].setValue(this.limitUnitList.find(e => { return e.value == this.formGroup.value.limitAmountUnit }))
  }

  save(){
    if ((this.formGroup.get('objectType').value.value === 2 && !this.formGroup.get('relationShipList').value) || (this.formGroup.get('objectType').value === null && !this.formGroup.get('relationShipList').value)) {
      this.isInvalidRelationship = true;
    }
    if(this.formGroup.get('limitNumber').value != null && !this.formGroup.get('limitUnit').value){
      this.checkLimitNumber = true
    }
    if(this.formGroup.get('limitAmount').value != null && !this.formGroup.get('limitAmountUnit').value){
      this.checkLimitAmountUnit = true
    }
    let isCheck = false
    for(let item in this.welfarePolicyNormBOList.value){
      if((this.welfarePolicyNormBOList.value[item].chairmanType == null || this.welfarePolicyNormBOList.value[item].fundingCategoryId == null
          || this.welfarePolicyNormBOList.value[item].incomeType == null || this.welfarePolicyNormBOList.value[item].level == null)
          && this.welfarePolicyNormBOList.value[item].isDeleted === 1){
        this.app.warningMessage("inValidAllTab","Hãy nhập danh sách trường dữ liệu trong định mức!");
        isCheck = true
      }
    }
    if (!CommonUtils.isValidForm(this.formGroup) || isCheck || this.isInvalidRelationship || this.isInvalidEndDate || this.checkLimitNumber || this.checkLimitAmountUnit) {
      return;
    }
    // check trùng bệnh
    let checkListDesease = [];
    if(this.policyDeseaseBOList.value.length > 0){
      for(let i=0; i<this.policyDeseaseBOList.value.length; i++){
        if(checkListDesease.length > 0 && checkListDesease.includes(this.policyDeseaseBOList.value[i].categoryId) && this.policyDeseaseBOList.value[i].isDeleted === 1){
          this.app.warningMessage('',"Danh sách bệnh bị trùng lặp!");
          return;
        }else{
          if(this.policyDeseaseBOList.value[i].isDeleted === 1){
            checkListDesease.push(this.policyDeseaseBOList.value[i].categoryId);
          }
        }
      }
    }
    // check trùng giấy tờ
    let checkListDocument = [];
    if(this.policyDocumentBOList.value.length > 0){
      for(let i=0; i<this.policyDocumentBOList.value.length; i++){
        if(checkListDocument.length > 0 && checkListDocument.includes(this.policyDocumentBOList.value[i].code) && this.policyDocumentBOList.value[i].isDeleted === 1){
          this.app.warningMessage('',"Danh sách giấy tờ bị trùng lặp!");
          return;
        }else{
          if(this.policyDocumentBOList.value[i].isDeleted === 1){
            checkListDocument.push(this.policyDocumentBOList.value[i].code);
          }
        }
      }
    }
    // check trùng bộ định mức
    let checkListNorm = [];
    if(this.welfarePolicyNormBOList.value.length > 0){
      for(let i=0;i<this.welfarePolicyNormBOList.value.length;i++){
        if(checkListNorm.length > 0){
         for(let item in checkListNorm){
           if(checkListNorm[item].chairmanType == this.welfarePolicyNormBOList.value[i].chairmanType &&
               checkListNorm[item].fundingCategoryId == this.welfarePolicyNormBOList.value[i].fundingCategoryId &&
               checkListNorm[item].level == this.welfarePolicyNormBOList.value[i].level &&
               this.welfarePolicyNormBOList.value[i].isDeleted === 1){
             this.app.warningMessage('',"Danh sách định mức có bộ bị trùng lặp!");
             return;
           }
         }
        }else{
          if(this.welfarePolicyNormBOList.value[i].isDeleted === 1){
            checkListNorm.push(this.welfarePolicyNormBOList.value[i])
          }
        }
      }
    }
    // check giá trị bắt buộc nguyên dương
    if(this.formGroup.value.limitNumber && this.formGroup.value.limitNumber < 0){
      this.app.warningMessage('',"Giới hạn số lần tối đa không được nhỏ hơn giá trị 0!");
      return;
    }
    if(this.formGroup.value.limitAmount && this.formGroup.value.limitAmount < 0){
      this.app.warningMessage('',"Giới hạn số tiền tối đa tối đa không được nhỏ hơn giá trị 0!");
      return;
    }
    if(this.formGroup.value.order && this.formGroup.value.order < 0){
      this.app.warningMessage('',"Thứ tự không được nhỏ hơn giá trị 0!");
      return;
    }
    if(this.welfarePolicyNormBOList.value.length > 0){
      for(let i=0;i<this.welfarePolicyNormBOList.value.length; i++){
        if(this.welfarePolicyNormBOList.value[i].amount && this.welfarePolicyNormBOList.value[i].amount<0){
          this.app.warningMessage('',"Số tiền trong danh sách định mức không được nhỏ hơn giá trị 0!");
          return;
        }
        if(this.welfarePolicyNormBOList.value[i].isFixed && !this.welfarePolicyNormBOList.value[i].amount){
          this.app.warningMessage('',"Phải nhập Số tiền trong danh sách định mức đối với trường hợp Tập đoàn quy định!");
          return;
        }
      }
    }
    this.formGroup.controls['welfarePolicyNormBOList'].setValue(this.welfarePolicyNormBOList.value)
    this.formGroup.controls['policyDocumentBOList'].setValue(this.policyDocumentBOList.value)
    this.formGroup.controls['policyDeseaseBOList'].setValue(this.policyDeseaseBOList.value)
    this.formGroup.controls['type'].setValue(this.formGroup.value.type.value)
    this.formGroup.controls['objectType'].setValue(this.formGroup.value.objectType.value)
    if(!this.isChangeEffectiveStartDate && this.isCreate){
      if(typeof this.formGroup.value.effectiveStartDate === 'number'){
        this.formGroup.controls['effectiveStartDate'].setValue(this.formGroup.value.effectiveStartDate)
      }else{
        this.formGroup.controls['effectiveStartDate'].setValue(this.formGroup.value.effectiveStartDate.getTime())
      }
    }
    if(this.formGroup.value.effectiveEndDate && !this.isChangeEffectiveEndDate && this.isCreate){
      if(typeof this.formGroup.value.effectiveEndDate === 'number'){
        this.formGroup.controls['effectiveEndDate'].setValue(this.formGroup.value.effectiveEndDate)
      }else{
        this.formGroup.controls['effectiveEndDate'].setValue(this.formGroup.value.effectiveEndDate.getTime())
      }
    }
    if(this.formGroup.value.incomeType != null){
      this.formGroup.controls['incomeType'].setValue(this.formGroup.value.incomeType.value)
    }
    if(this.formGroup.value.limitUnit != null){
      this.formGroup.controls['limitUnit'].setValue(this.formGroup.value.limitUnit.value)
    }
    if(this.formGroup.value.limitAmountUnit != null){
      this.formGroup.controls['limitAmountUnit'].setValue(this.formGroup.value.limitAmountUnit.value)
    }
    this.app.confirmMessage(null,
      () => {
        this.service.saveOrUpdateFormFile(this.formGroup.value)
            .subscribe(res => {
              if(res.code === "success" && res.data && res.data.welfarePolicyCategoryId){
                this.router.navigateByUrl(`/population/welfare-policy-category/view/${res.data.welfarePolicyCategoryId}`);
              }else if(res.code === "success"){
                this.router.navigateByUrl('/population/welfare-policy-category');
              }
            })
        this.setValueInPDropDown();
      },
      () => {
        this.setValueInPDropDown();
      }
    )
  }

  navigate() {
    this.router.navigateByUrl(`/population/welfare-policy-category/update/${this.welfarePolicyCategoryId}`);
  }

  changeCheckLimitNumber(event){
    if(event){
      this.checkLimitNumber = false;
    }
  }

  changeCheckLimitAmountUnit(event){
    if(event){
      this.checkLimitAmountUnit = false;
    }
  }

  changeObjectType(event: any) {
    if (event && event.value) {
      this.isInvalidRelationship = false;
      if (event.value.value === 1) {
        this.isRequireRelationship = false;
        this.formGroup.get('relationShipList').setValue(null);
      } else {
        this.isRequireRelationship = true;
      }
    } else {
      this.isInvalidRelationship = true;
    }
  }

  changeType(event: any){
    if(event && event.value){
      if(event.value.value == 4){
        this.formGroup.controls['orgType'].setValue(3);
        this.isAllowanceHM = true;
        this.categoryService.findByCategoryTypeCode('KY_THUAT_DIEU_TRI_HIEM_MUON').subscribe(res => {
          this.categoryOptions = res.data;
        })
      }else if(event.value.value == 1 || event.value.value == 2 || event.value.value == 3){
        this.formGroup.controls['orgType'].setValue(2);
        this.isAllowanceHM = false;
        this.categoryService.findByCategoryTypeCode('danh_muc_benh').subscribe(res => {
          this.categoryOptions = res.data;
        })
      }
    }
  }
  changeStartDate(event: any) {
    if (event) {
      this.isChangeEffectiveStartDate = true
      let date: any;
      if (this.action === 'select') {
        date = new Date(formatDate(new Date(event), 'MM/dd/yyyy', 'en-US')).getTime();
      } else if (this.action === 'input') {
        date = new Date(formatDate(new Date(event), 'dd/MM/yyyy', 'en-US')).getTime();
      }
      if (this.formGroup.get('effectiveEndDate').value && date > this.formGroup.get('effectiveEndDate').value) {
        this.isInvalidEndDate = true;
      } else {
        this.isInvalidEndDate = false;
      }
    } else {
      this.isInvalidEndDate = false;
    }
  }

  getAction(event: any) {
    if (event) {
      this.action = event;
    }
  }

  changeEndDate(event: any) {
    if (event) {
      this.isChangeEffectiveEndDate = true
      let date: any;
      if (this.action === 'select') {
        date = new Date(formatDate(new Date(event), 'MM/dd/yyyy', 'en-US')).getTime();
      } else if (this.action === 'input') {
        date = new Date(formatDate(new Date(event), 'dd/MM/yyyy', 'en-US')).getTime();
      }
      if (this.formGroup.get('effectiveStartDate').value && date < this.formGroup.get('effectiveStartDate').value) {
        this.isInvalidEndDate = true;
      } else {
        this.isInvalidEndDate = false;
      }
    } else {
      this.isInvalidEndDate = false;
    }
  }

  changeRelationship(event: any) {
    if (event && event.length > 0) {
      this.isInvalidRelationship = false;
    }
  }

  requiredRelationShip(): boolean {

    let isInvalid = false;

    if (CommonUtils.isNullOrEmpty(this.formGroup.get('relationShipList').value)) {
        this.formGroup.controls['relationShipList'].setErrors({requiredRelationShip: true});
        isInvalid = true;
    } else {
        this.formGroup.get('relationShipList').setErrors(null);
    }

    this.formGroup.controls['relationShipList'].markAsTouched();

    return isInvalid;
  }

  handleBr5(): boolean {

    let isInvalid = false;

    if (CommonUtils.isNullOrEmpty(this.formGroup.get('relationShipList').value)) {
        this.formGroup.controls['relationShipList'].setErrors({required: true});
        isInvalid = true;
    } else {
        this.formGroup.get('relationShipList').setErrors(null);
    }

    this.formGroup.controls['relationShipList'].markAsTouched();

    return isInvalid;
  }
}
