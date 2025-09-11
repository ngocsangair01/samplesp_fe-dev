import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS, LARGE_MODAL_OPTIONS, LOAI_DANH_MUC_KHEN_THUONG, LOAI_DOI_TUONG_KHEN_THUONG, LOAI_KHEN_THUONG, LOAI_KHEN_THUONG_CHI_TIET, NHOM_KHEN_THUONG } from '@app/core';
import { RewardCategoryService } from '@app/core/services/reward-category/reward-category.service';
import { RewardGeneralService } from '@app/core/services/reward-general/reward-general.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Observable, Subject} from 'rxjs';
import { RewardGeneralFormComponent } from '../reward-general-form/reward-general-form.component';
import { ReportPreviewCertificateComponent } from '../reward-general-preview/report-preview-certificate'
import { RewardGeneralModalComponent } from '@app/shared/components/reward-general-modal/reward-general-modal.component';
import _ from 'lodash'
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';

@Component({
  selector: 'reward-general-search',
  templateUrl: './reward-general-search.component.html',
  styleUrls: ['./reward-general-search.component.css']
})
export class RewardGeneralSelectComponent extends BaseComponent implements OnInit {
  @Input() rewardType;
  @Input() resetFormSubject: Subject<number> = new Subject<number>();
  @ViewChild('ptable') dataTable: any;
  formSearch: FormGroup;
  formSavePersonalRewards: FormGroup;
  formSaveCollectiveReward: FormGroup;
  formSavePersonalOutRewards: FormGroup;
  formSaveRewardGroupOut: FormGroup;
  rewardObjectTypeList: any;
  rewardTypeList: any;
  rewardTypeListByUser: any;
  periodTypeList: any;
  lstFormConfig: FormArray;
  mapRewardTitleIdList: any = {};
  formRelationConfig = {
    stt: [0],    // số thứ tự
    dataType: [1],   // điều kiện so sánh || hay &&
    type:[''],    // loại
    rewardTitleId: ['', [ValidationService.required]],   // danh hiệu, hình thức, nội dung khác
    compare: [''],    // >=, =, <=, không chọn
    number: [''],     // số lượng
    rule: [''],     // điều kiện: năm liên tiếp, lượt
  };
  SEND_METHOD = [
    {id: 1, name: "TO"},
    {id: 2, name: "CC"},
  ];
  dataTypeOptions = [
    {id: 1, name: "Và"},
    {id: 2, name: "Hoặc"},
  ];
  typeOptions = APP_CONSTANTS.REWARD_CATEGORY;
  compareOptions = [
    {id: 1, name: ">="},
    {id: 2, name: "="},
    {id: 3, name: "<="},
    {id: 4, name: "Không chọn"},
  ];
  ruleOptions = [
    {id: 1, name: "Năm liên tiếp"},
    {id: 2, name: "Lượt"},
  ];
  isInsideList = [
    {id: 1, name: "Trong TĐ"},
    {id: 0, name: "Ngoài TĐ"}
  ];
  rewardCategoryList: any;
  rewardTitleIdList: any;
  rewardTitleIdListTemp: any;
  listYear: any;
  isEmptyRewardType: any;
  rewardGroupList: any;
  branch: any;
  isPartyOrganization: any;
  isOrganization: any;
  mapRewardTypeBranch = { 1: 0, 2: 3, 3: 1, 4: 2, 5: 5 };
  khenThuongCaNhan = LOAI_DOI_TUONG_KHEN_THUONG.CA_NHAN;
  khenThuongTapThe = LOAI_DOI_TUONG_KHEN_THUONG.TAP_THE;
  khenThuongCaNhanNgoaiVT = LOAI_KHEN_THUONG_CHI_TIET.CA_NHAN_NGOAI_VT;
  khenThuongTapTheNgoaiVT = LOAI_KHEN_THUONG_CHI_TIET.TAP_THE_NGOAI_VT;
  resultListPersonal = this.resultList;
  resultListGroup = this.resultList;
  resultListPersonalOut = this.resultList;
  resultListRewardGroupOut = this.resultList;
  isHidden: boolean = false;
  isMasO: boolean = false;
  isPartyO: boolean = false;
  isOrg: boolean = false;
  formConfig = {
    rewardObjectType: [null],
    rewardType: [null],
    rewardTitleId: [null],
    decisionNumber: [null],
    decisionDateFrom: [null],
    decisionDateTo: [null],
    decisionYearFrom: [null],
    decisionYearTo: [null],
    periodType: [null],
    rewardCategory: [null],
    rewardTitleIds: [null],
    objectId: [null],
    organizationId: [null],
    employeeCode: [null],
    employeeName: [null],
    objectPartyName: [null],
    massOrganizationId: [null],
    partyOrganizationId: [null],
    rewardProposeDetailType: [null],
    formSource:[null],
    isInside:[null],
    isOrgSelector:[false],
    isRewardObjectType: [false],
    isRewardType: [false],
    isRewardTitleId: [false],
    isDecisionNumber: [false],
    isDecisionDateFrom: [false],
    isDecisionDateTo: [false],
    isDecisionYearFrom: [false],
    isDecisionYearTo: [false],
    isPeriodType: [false],
    isRewardCategory: [false],
    isRewardTitleIds: [false],
    isEmployeeCode: [false],
    isEmployeeName: [false],
    isObjectPartyName: [false],
    isBooleanInside: [false],
    rewardGroup: [null],
    lstFormConfig: [null],
    limit: [10],
    first: [0],
  };
  formSavePersonalRewardsConfig = {
    employeeCode: [null],
    employeeName: [null],
    organizationId: [null],
    rewardType: [null],
    periodType: [null],
    rewardCategory: [null],
    decisionNumber: [null],
    decisionDate: [null],
    decisionYear: [null],
    rewardTitleId: [null]
  };
  formSaveCollectiveRewardConfig = {
    objectPartyName: [null],
    objectMassName: [null],
    rewardType: [null],
    periodType: [null],
    rewardCategory: [null],
    decisionNumber: [null],
    decisionDate: [null],
    decisionYear: [null],
    rewardTitleId: [null],
    objectName: [null],
  };
  formSavePersonalOutRewardsConfig = {
    employeeName: [null],
    organizationId: [null],
    rewardType: [null],
    periodType: [null],
    rewardCategory: [null],
    decisionNumber: [null],
    decisionDate: [null],
    rewardTitleId: [null],
  };
  formSaveRewardGroupOutConfig = {
    employeeName: [null],
    organizationId: [null],
    rewardType: [null],
    periodType: [null],
    rewardCategory: [null],
    decisionNumber: [null],
    decisionDate: [null],
    rewardTitleId: [null],
  };
  activeIndex = 0;
  isDisablePersonal = false;
  isDisableGroup = false;
  isDisablePersonalOut = false;
  isDisableGroupOut = false;
  isSelectedPesonal = true;
  isSelectedGroup = false;
  isSelectedPesonalOut = false;
  isSelectedGroupOut = false;

  constructor(
    private rewardGeneralService: RewardGeneralService,
    private router: Router,
    public rewardCategoryService: RewardCategoryService,
    private modalService: NgbModal,
    private app: AppComponent,
    private rewardProposeService: RewardProposeService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.rewardGeneral"));
    this.setMainService(this.rewardGeneralService);
    // this.buildFormSaveConfig();
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('decisionDateFrom', 'decisionDateTo', 'bonus.decisionDateTo'),
      (ValidationService.notAffter('decisionYearFrom', 'decisionYearTo', 'bonus.decisionYearTo'))]);
    this.formSavePersonalRewards = this.buildForm({}, this.formSavePersonalRewardsConfig, ACTION_FORM.VIEW);
    this.formSaveCollectiveReward = this.buildForm({}, this.formSaveCollectiveRewardConfig, ACTION_FORM.VIEW);
    this.formSavePersonalOutRewards = this.buildForm({}, this.formSavePersonalOutRewardsConfig, ACTION_FORM.VIEW);
    this.formSaveRewardGroupOut = this.buildForm({}, this.formSaveRewardGroupOutConfig, ACTION_FORM.VIEW);
    this.loadData();
    this.makeMapRewardTitleIdList();
    this.buildFormSaveConfig();
    this.processSearchRewardGroup();
    this.processSearchRewardPersonal();
    this.processSearchRewardPersonalOut();
    this.processSearchRewardGroupOut();
    this.formSearch.patchValue({
      rewardObjectType: null
    });

    this.listYear = this.getYearList();

    this.rewardObjectTypeList = APP_CONSTANTS.REWARD_OBJECT_LIST;
    this.rewardGroupList = APP_CONSTANTS.REWARD_GROUP_LIST;
    this.rewardTypeList = APP_CONSTANTS.REWARD_GENERAL_TYPE_LIST;

    this.periodTypeList = APP_CONSTANTS.REWARD_PERIOD_TYPE_LIST;

    this.rewardCategoryList = APP_CONSTANTS.REWARD_CATEGORY;


  }

  ngOnInit() {
    this.rewardProposeService.getRewardTypeList().subscribe(res => {
      this.rewardTypeListByUser = this.rewardTypeList.filter((item) => {
        return res.includes(item.id)
      })
  })
  }
  get f() {
    return this.formSearch.controls;
  }

  private getYearList() {
    this.listYear = [];
    const currentYear = new Date().getFullYear();
    for (let i = (currentYear - 20); i <= (currentYear); i++) {
      const obj = {
        year: i
      };
      this.listYear.push(obj);
    }
    return this.listYear;
  }

  public prepareSaveOrUpdate(option: number) {
    if (option === 1) {
      this.router.navigate(['/reward/reward-general/reward-personal-add']);
    }
    else {
      this.router.navigate(['/reward/reward-general/reward-group-add']);
    }
  }

  public getListRewardCategory(rewardObjectType: number, rewardType) {
    const data = {rewardObjectType: rewardObjectType, rewardType: rewardType};
    return this.rewardCategoryService.getListRewardCategory(data);
  }

  public processExportRewardGeneral(option: number) {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const formValue = _.cloneDeep(this.formSearch.value);
    
    if (formValue.rewardTitleIds && formValue.rewardTitleIds.length > 0) {
      formValue.rewardTitleIds = formValue.rewardTitleIds.join(',');
    }else {
      formValue.rewardTitleIds = null;
    }
    const credentials = Object.assign({}, formValue);
    const searchData = CommonUtils.convertData(credentials);
    searchData.rewardObjectType = option;
    const params = CommonUtils.buildParams(searchData);
    if (option === this.khenThuongCaNhan) {
      this.rewardGeneralService.exportRewardGeneral(params).subscribe(res => {
        saveAs(res, 'DS_khen_thuong_ca_nhan.xlsx');
      });
    } else if (option === this.khenThuongTapThe) {
      this.rewardGeneralService.exportRewardGeneral(params).subscribe(res => {
        saveAs(res, 'DS_khen_thuong_tap_the.xlsx');
      });
    } else if (option === this.khenThuongCaNhanNgoaiVT) {
      this.rewardGeneralService.exportRewardGeneral(params).subscribe(res => {
        saveAs(res, 'DS_khen_thuong_ca_nhan_ngoai_sangnn.xlsx');
      });
    } else if (option === this.khenThuongTapTheNgoaiVT){
      this.rewardGeneralService.exportRewardGeneral(params).subscribe(res => {
        saveAs(res, 'DS_khen_thuong_tap_the_ngoai_sangnn.xlsx');
      });
    }
  }
  processSearchAll() {
    this.formSearch.controls['lstFormConfig'].setValue(this.lstFormConfig.value)
    let rewardObjectType = this.formSearch.controls['rewardObjectType'].value;
    if (rewardObjectType === this.khenThuongTapThe) {
      this.processSearchRewardGroup();
      this.processSearchRewardGroupOut();
    }
    else if (rewardObjectType === this.khenThuongCaNhan) {
      this.processSearchRewardPersonal();
      this.processSearchRewardPersonalOut();
    }
    else {
      this.processSearchRewardPersonal();
      this.processSearchRewardPersonalOut();
      this.processSearchRewardGroup();
      this.processSearchRewardGroupOut();
    }
    this.formSearch.patchValue({
      rewardObjectType: rewardObjectType
    })
  }

  public onChangeObjectType() {
    let rewardType = this.formSearch.controls['rewardType'].value;
    if (rewardType != null) {
      if (rewardType != null)
        this.resetFormSubject.next(rewardType);
    } else {
      this.formSearch.patchValue({
        rewardTitleId: null,
        rewardTitleIds: null
      });
      this.rewardTitleIdList = [];
      this.rewardTitleIdListTemp = [];
    }
    this.resetFormSubject.next(rewardType);
    this.formSaveCollectiveReward = this.buildForm({}, this.formSaveCollectiveRewardConfig, ACTION_FORM.VIEW);
    this.branch = this.mapRewardTypeBranch[rewardType];
    if (this.branch === 0) {
      this.isPartyOrganization = true;
    } else if (this.branch === LOAI_KHEN_THUONG.CHINH_QUYEN) {
      this.isOrganization = true;
    }
    else {
      this.isOrganization = false;
      this.isPartyOrganization = false;
    }
    this.handleChangeBusinessType(rewardType);
  }

  public processSearchRewardPersonal(event?): void {
    const form = this.formSearch;
    form.patchValue({
      rewardObjectType: this.khenThuongCaNhan
    })
    const formValue = form.value;
    if (formValue.rewardTitleIds && formValue.rewardTitleIds.length > 0) {
      formValue.rewardTitleIds = formValue.rewardTitleIds.join(',');
    } else {
      formValue.rewardTitleIds = null;
    }
    if(event){
      formValue.first = event.first;
      formValue.limit = event.rows;
    }
    this.rewardGeneralService.processSearch(formValue || '', event).subscribe(res => {
      this.resultListPersonal = res;
      this.formSavePersonalRewards = this.buildForm(res.data, this.formSavePersonalRewardsConfig);
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }

  }

  public processSearchRewardPersonalOut(event?): void {
    const form = this.formSearch;
    form.patchValue({
      rewardProposeDetailType: this.khenThuongCaNhanNgoaiVT
    })
    const formValue = form.value;
    if (formValue.rewardTitleIds && formValue.rewardTitleIds.length > 0) {
      formValue.rewardTitleIds = formValue.rewardTitleIds.join(',');
    }else {
      formValue.rewardTitleIds = null;
    }
    this.rewardGeneralService.processSearch2(formValue, event).subscribe(res => {
      this.resultListPersonalOut = res;
      this.formSavePersonalOutRewards = this.buildForm(res.data, this.formSavePersonalOutRewardsConfig);
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }

  }


  public processSearchRewardGroup(event?): void {
    const form = this.formSearch;
    form.patchValue({
      rewardObjectType: this.khenThuongTapThe
    })
    const formValue = form.value;
    if (formValue.rewardTitleIds && formValue.rewardTitleIds.length > 0) {
      formValue.rewardTitleIds = formValue.rewardTitleIds.join(',');
    }else {
      formValue.rewardTitleIds = null;
    }
    this.rewardGeneralService.processSearch(formValue || '', event).subscribe(res => {
      this.resultListGroup = res;
      this.formSaveCollectiveReward = this.buildForm(res.data, this.formSaveCollectiveRewardConfig);
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }

  }

  public processSearchRewardGroupOut(event?): void {
    const form = this.formSearch;
    form.patchValue({
      rewardProposeDetailType: this.khenThuongTapTheNgoaiVT
    })
    const formValue = form.value;
    if (formValue.rewardTitleIds && formValue.rewardTitleIds.length > 0) {
      formValue.rewardTitleIds = formValue.rewardTitleIds.join(',');
    }else {
      formValue.rewardTitleIds = null;
    }
    this.rewardGeneralService.processSearch2(formValue, event).subscribe(res => {
      this.resultListRewardGroupOut = res;
      this.formSaveRewardGroupOut = this.buildForm(res.data, this.formSaveRewardGroupOutConfig);
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }

  }

  rewardPersonalDetail(item) {
    this.router.navigate(['/employee/curriculum-vitae/', item.objectId, 'reward-general']);
  }

  rewardCollectiveDetail(item) {
    if (item.rewardType === LOAI_KHEN_THUONG.TO_CHUC_DANG) {
      this.router.navigate(['/party-organization/party-organization-management/edit/', item.objectId]);
    } else if (item.rewardType === LOAI_KHEN_THUONG.TO_CHUC_DOAN) {
      this.router.navigate(['/mass/organization-union/mass-organization-edit/', item.objectId]);
    } else if (item.rewardType === LOAI_KHEN_THUONG.TO_CHUC_PHU_NU) {
      this.router.navigate(['/mass/organization-women/mass-organization-edit/', item.objectId]);
    } else if (item.rewardType === LOAI_KHEN_THUONG.TO_CHUC_THANH_NIEN) {
      this.router.navigate(['/mass/organization-youth/mass-organization-edit/', item.objectId]);
    }
  }

  loadDataTable() {
    this.makeMapRewardTitleIdList();
    const rewardType = this.formSearch.controls['rewardObjectType'].value;
    if (rewardType) {
      this.isEmptyRewardType = false;
    }
    if (rewardType == null) {
      this.clearData();
      this.processSearchRewardGroup();
      this.processSearchRewardPersonal();
      this.processSearchRewardPersonalOut();
      this.processSearchRewardGroupOut();
      this.formSearch.patchValue({
        rewardObjectType: null
      });
    }
    if (rewardType === this.khenThuongCaNhan) {
      this.clearData();
      this.isDisablePersonal = false;
      this.isDisablePersonalOut = false;
      this.isDisableGroup = true;
      this.isDisableGroupOut = true;
      this.activeIndex = 0
    }
    else if (rewardType === this.khenThuongTapThe) {
      this.clearData();
      this.isDisablePersonal = true;
      this.isDisablePersonalOut = true;
      this.isDisableGroup = false;
      this.isDisableGroupOut = false;
      this.activeIndex = 1
    } else {
      this.isDisablePersonal = false;
      this.isDisablePersonalOut = false;
      this.isDisableGroup = false;
      this.isDisableGroupOut = false;
    }
  }

  public loadData() {
    this.resetFormSubject.subscribe(rewardType => {
      if (!rewardType) {
        this.formSearch.patchValue({
          rewardTitleId: null
        })
        this.rewardTitleIdList = [];
        this.rewardTitleIdListTemp = [];
        return;
      } else {
        const objectType = this.formSearch.controls['rewardObjectType'].value;
        // lay danh hieu khen thuong
        this.getListRewardCategory(objectType, rewardType).subscribe(res => {
            this.rewardTitleIdListTemp = res;
            this.handleChangeRewardCategory()
        })
      }
    });
  }

  public clearData() {
    this.formSearch.patchValue({
      rewardTitleId: null,
      rewardType: null
    })
    this.rewardTitleIdList = [];
    this.rewardTitleIdListTemp = [];
  }

  /**
   * prepare insert/update
   */
   public prepareSaveOrUpdate2(item: any): void {
    if (item && item.rewardGeneralId > 0) {
      this.rewardGeneralService.findByIdWithAttachedFile(item.rewardGeneralId)
        .subscribe(res => {
          if (res.data) {
            const modalRef = this.modalService.open(RewardGeneralModalComponent, DEFAULT_MODAL_OPTIONS);
            modalRef.componentInstance.setFormValue(this.propertyConfigs, res.data);
            modalRef.result.then((result) => {
              if (!result) {
                return;
              }
              this.processSearchRewardGroup();
              this.processSearchRewardPersonal();
              this.processSearchRewardPersonalOut();
              this.processSearchRewardGroupOut();
            });
            // this.activeFormModal(this.modalService, RewardGeneralModalComponent, res.data);
          }
          // this.processSearch(null);
        });
    } else {
      this.app.warningMessage('message.warning.recordNotExist', '');
      return;
    }
  }

  prepareUpdate(item) {
    this.rewardGeneralService.findOne(item.rewardGeneralId).subscribe(res => {
      if (res.data.rewardObjectType == 1) {
        this.router.navigate(['/reward/reward-general/reward-personal-edit/', res.data.rewardGeneralId]);
      } else if(res.data.rewardObjectType == 2) {
        this.router.navigate(['/reward/reward-general/reward-group-edit/', res.data.rewardGeneralId]);
      }
    });
  }
  handleChange(event) {
    const index = event.index;
    this.activeIndex = index;
    
  }
  public processDelete(item) {
    if (item && item.rewardGeneralId > 0) {
      this.rewardGeneralService.findOne(item.rewardGeneralId)
        .subscribe(res => {
          if (res.data != null) {
            this.app.confirmDelete(null, () => { // accept
              this.rewardGeneralService.deleteById(item.rewardGeneralId)
                .subscribe(res => {
                  if (this.rewardGeneralService.requestIsSuccess(res)) {
                    this.processSearchRewardPersonal(null);
                    this.processSearchRewardGroup(null);
                  }
                })
            }, () => {
              // rejected
            })
          } else {
            this.processSearchRewardPersonal();
            this.processSearchRewardGroup();
            return;
          }
        })
    }
  }
  /**
   * prepare insert/update
   */
   prepareSaveOrUpdate3(item: any): void {
    if (item && item.rewardGeneralId > 0) {
      this.rewardGeneralService.findByIdWithAttachedFile(item.rewardGeneralId)
        .subscribe(res => {
          if (res.data) {
            const modalRef = this.modalService.open(RewardGeneralModalComponent, DEFAULT_MODAL_OPTIONS);
            modalRef.componentInstance.setFormValue(this.propertyConfigs, res.data);
            modalRef.result.then((result) => {
              if (!result) {
                return;
              }
              this.processSearchRewardGroup();
              this.processSearchRewardPersonal();
              this.processSearchRewardPersonalOut();
              this.processSearchRewardGroupOut();
            });
            // this.activeFormModal(this.modalService, RewardGeneralModalComponent, res.data);
          }
          // this.processSearch(null);
        });
    } else {
      this.app.warningMessage('message.warning.recordNotExist', '');
      return;
    }
  }
  viewFile(certificateFile) {
    const modalRef = this.modalService.open(ReportPreviewCertificateComponent, LARGE_MODAL_OPTIONS);
    modalRef.componentInstance.file = certificateFile;
    modalRef.componentInstance.isBlobFile = false;
  }

  /**
   * Lấy danh hiệu hình thức theo loại khen thưởng
   */
  handleChangeRewardCategory(){
    const rewardCategory = this.formSearch.controls['rewardCategory'].value;
    const rewardGroup = this.formSearch.controls['rewardGroup'].value;
    this.formSearch.patchValue({
      rewardTitleIds: null
    });
    if(rewardCategory && this.rewardTitleIdListTemp) {
      this.rewardTitleIdList = this.rewardTitleIdListTemp.filter(e => e.rewardCategory == rewardCategory)
      if(rewardGroup){
        this.rewardTitleIdList = this.rewardTitleIdListTemp.filter(e => e.rewardCategory == rewardCategory && e.rewardGroup == rewardGroup)
      }
    } else {
      this.rewardTitleIdList = []
    }
  }
  // start export file bằng khen
  exportFileReward(option: number) {
    let rewardObjectType = this.formSearch.controls['rewardObjectType'].value;
    const form = this.formSearch;
    const formValue = form.value;
    if (formValue.rewardTitleIds && formValue.rewardTitleIds.length > 0) {
      formValue.rewardTitleIds = formValue.rewardTitleIds.join(',');
    } else {
      formValue.rewardTitleIds = null;
    }
    formValue.rewardObjectType = option;
    this.rewardGeneralService.exportFilePersonalReward(formValue || '', event).subscribe(res => {
      if(res.size == 0){
        this.app.warningMessage('message.warning.hasNotReward');
        return;
      }
      if(option == 1){
        saveAs(res, 'Khen_thuong_tong_hop_ca_nhan.zip');
      } else{
        saveAs(res, 'Khen_thuong_tong_hop_tap_the.zip');
      }
    });
    this.formSearch.patchValue({
      rewardObjectType: rewardObjectType
    })
  }
  // end export file bằng khen

  handleChangeBusinessType(rewardType) {
    debugger
    this.isHidden = true;
    this.isPartyO = false;
    this.isMasO = false;
    this.isOrg = false;
    this.rewardType = rewardType
    this.makeMapRewardTitleIdList();
    if (!rewardType) {
      return;
    }
    const parCode = rewardType.parValue;
    if (rewardType == 1) { //đảng
      this.isHidden = false;
      this.isPartyO = true;
      this.formSearch.controls['organizationId'].reset();
      this.formSearch.controls['massOrganizationId'].reset();
    } else if (rewardType == 5) {
      this.isHidden = false;
      this.isOrg = true;
      this.formSearch.controls['partyOrganizationId'].reset();
      this.formSearch.controls['massOrganizationId'].reset();
    } else {
      this.isHidden = false;
      this.isMasO = true;
      this.formSearch.controls['partyOrganizationId'].reset();
      this.formSearch.controls['organizationId'].reset();
      if (rewardType == 3) {//Phụ nữ
        this.branch = 1;
      } else if (rewardType == 2) {// Công đoàn
        this.branch = 3;
      } else if (rewardType == 4) {// thanh niên
        this.branch = 2;
      }
    }
  }

  // start export file bằng khen ko có con dấu
  exportFileRewardNoStamp(option: number) {
    let rewardObjectType = this.formSearch.controls['rewardObjectType'].value;
    const form = this.formSearch;
    const formValue = form.value;
    if (formValue.rewardTitleIds && formValue.rewardTitleIds.length > 0) {
      formValue.rewardTitleIds = formValue.rewardTitleIds.join(',');
    } else {
      formValue.rewardTitleIds = null;
    }
    formValue.rewardObjectType = option;
    this.rewardGeneralService.exportFilePersonalRewardNoStamp(formValue || '', event).subscribe(res => {
      if(res.size == 0){
        this.app.warningMessage('message.warning.hasNotReward');
        return;
      }
      if(option == 1){
        saveAs(res, 'Khen_thuong_tong_hop_ca_nhan_khong_con dau.zip');
      } else{
        saveAs(res, 'Khen_thuong_tong_hop_tap_the_khong_con dau.zip');
      }
    });
    this.formSearch.patchValue({
      rewardObjectType: rewardObjectType
    })
  }
  // end export file bằng khen ko có con dấu

  // private makeDefaultFormSqlConfig(): FormGroup {
  //   const formGroup = this.buildForm({}, this.formSqlConfig);
  //   return formGroup;
  // }
  //
  // public addRow(index: number, item: FormGroup) {
  //   const controls = this.lstFormSqlConfig as FormArray;
  //   controls.insert(index + 1, this.makeDefaultFormSqlConfig());
  // }
  //
  // public removeRow(index: number, item: FormGroup) {
  //   const controls = this.lstFormSqlConfig as FormArray;
  //   if (controls.length === 1) {
  //     const group = this.makeDefaultFormSqlConfig();
  //     controls.push(group);
  //     this.lstFormSqlConfig = controls;
  //   }
  //   controls.removeAt(index);
  // }
  //
  // private buildFormSaveConfig(list?: any) {
  //   if (!list || list.length == 0) {
  //     this.lstFormSqlConfig = new FormArray([this.makeDefaultFormSqlConfig()]);
  //   } else {
  //     const controls = new FormArray([]);
  //     for (const i in list) {
  //       const formTableConfig = list[i];
  //       const group = this.makeDefaultFormSqlConfig();
  //       group.patchValue(formTableConfig);
  //       controls.push(group);
  //     }
  //     this.lstFormSqlConfig = controls;
  //   }
  // }
  private makeDefaultformRelationConfig(index?: number): FormGroup {
    const formGroup = this.buildForm({'stt': index}, this.formRelationConfig);
    return formGroup;
  }

  public addRow(index: number, item: FormGroup) {
    const controls = this.lstFormConfig;
    controls.insert(index + 1, this.makeDefaultformRelationConfig(index+1));
  }

  public removeRow(index: number, item: FormGroup) {
    const controls = this.lstFormConfig;
    if (controls.length === 1) {
      this.buildFormSaveConfig();
      const group = this.makeDefaultformRelationConfig();
      controls.push(group);
      this.lstFormConfig = controls;
    }
    controls.removeAt(index);
  }

  private buildFormSaveConfig(list?: any) {
    if (!list || list.length == 0) {
      this.lstFormConfig = new FormArray([this.makeDefaultformRelationConfig(0)]);
    } else {
      const controls = new FormArray([]);
      for (const i in list) {
        const formTableConfig = list[i];
        const group = this.makeDefaultformRelationConfig();
        group.patchValue(formTableConfig);
        controls.push(group);
      }
      this.lstFormConfig = controls;
    }
  }

  public async makeMapRewardTitleIdList() {
    const objectType = this.formSearch.controls['rewardObjectType'].value;
    if(objectType && this.rewardType){
      this.mapRewardTitleIdList[this.rewardType] = {}
      const rewardTitleIdList = await this.getListRewardCategory(objectType, this.rewardType).toPromise();
      rewardTitleIdList.forEach(e => {
        this.mapRewardTitleIdList[this.rewardType][e.rewardCategory] = this.mapRewardTitleIdList[this.rewardType][e.rewardCategory] || [];
        this.mapRewardTitleIdList[this.rewardType][e.rewardCategory].push(e);
      })
    }else{
      this.mapRewardTitleIdList = {}
    }
  }

}
