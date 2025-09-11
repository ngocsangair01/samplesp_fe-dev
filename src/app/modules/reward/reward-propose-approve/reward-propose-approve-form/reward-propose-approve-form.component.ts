import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS, LARGE_MODAL_OPTIONS, LOAI_KHEN_THUONG, LOAI_KHEN_THUONG_CHI_TIET, MEDIUM_MODAL_OPTIONS, REWARD_APPROVE_STATUS, REWARD_PROPOSE_APPROVAL_STATUS, REWARD_PROPOSE_STATUS, SELECTION_STATUS } from '@app/core';
import { FileControl } from '@app/core/models/file.control';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
// import { RewardSuggestImportManageComponent } from '../../reward-propose/reward-propose-form/file-import-reward-management/file-import-reward-management.component';
import { RewardSuggestImportManageComponent1 } from '../../reward-propose-approve/reward-propose-approve-form/file-import-reward-management/file-import-reward-management.component';
import { DialogService } from 'primeng/api';
import { popupRejectReason } from '../reward-propose-approve-search/reward-propose-reject-reason/reward-propose-reject-reason';
import { RewardProposeSignService } from '@app/core/services/reward-propose-sign/reward-propose-sign.service';
import { ReportPreviewCertificateComponent } from '../../reward-general-preview/report-preview-certificate';
import { HelperService } from '@app/shared/services/helper.service';
import { RewardProcessLoadModalComponent } from '../../reward-propose/reward-process-load-modal/reward-process-load-modal.component';
@Component({
  selector: 'reward-propose-approve-form',
  templateUrl: './reward-propose-approve-form.component.html',
  styleUrls: ['./reward-propose-approve-form.component.css']
})
export class RewardProposeApproveFormComponent extends BaseComponent implements OnInit {
  pageFocus: Subject<any> = new Subject<any>();
  resetFormArray: Subject<any> = new Subject<any>();
  setData: Subject<any> = new Subject<any>();
  processingData: Subject<any> = new Subject<any>();
  dataImportGroupInsangnn: Subject<any> = new Subject<any>();
  dataImportStaffInsangnn: Subject<any> = new Subject<any>();
  dataImportGroupOutsangnn: Subject<any> = new Subject<any>();
  dataImportStaffOutsangnn: Subject<any> = new Subject<any>();
  rootPartyId = APP_CONSTANTS.PARTY_ORG_ROOT_ID;
  rootOrgId = APP_CONSTANTS.ORG_ROOT_ID;
  rewardProposeId: number;
  isView: boolean = false;
  isRefuse: boolean = false;
  isApprove: boolean = false;
  isEdit: boolean = false;
  rewardTypeList: any;
  listYear: any;
  formSave: FormGroup;
  numIndex = 1;
  lstRewardType = APP_CONSTANTS.REWARD_GENERAL_TYPE_LIST;
  lstPeriodType = APP_CONSTANTS.REWARD_PERIOD_TYPE_LIST;
  tuChoiXetDuyet = REWARD_PROPOSE_STATUS.TU_CHOI_XET_DUYET;
  daDuyetXetDuyet = REWARD_PROPOSE_STATUS.DA_DUYET_XET_DUYET;
  saveData: Subject<boolean> = new Subject<boolean>();
  totalRewardGroupInside = 0;
  totalRewardPersonInside = 0;
  totalRewardGroupOutside = 0;
  totalRewardPersonOutside = 0;
  isChooseOrIsSuggest = 0;
  isChoose = 0;
  isSuggest =0;
  //Form khen thuong tap the inside
  formRewardGroupInside: FormArray;
  //Form khen thuong ca nhan inside
  formRewardPersonInside: FormArray;
  //Form tap the outside
  formRewardPersonOutside: FormArray;
  //Form ca nhan outside
  formRewardGroupOutside: FormArray;
  //Form chi phí
  formRewardCost: FormArray;
  //Form Config Them Moi To Trinh
  formRewardDecideTable: Subject<any> = new Subject<any>();
  isPersonal: boolean;
  dataToLoadIntoForm: any;
  loadDataIntoForm: any;
  rewardProposeIdExist: any;
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  listStatus:any;
  formConfig = {
    rewardProposeId: [null],
    name: [null, [ValidationService.required, ValidationService.maxLength(200)]],
    proposeOrgId: [null, [ValidationService.required]],
    periodType: [null, [ValidationService.required]],
    status: [null],
    approvalOrgId: [null, [ValidationService.required]],
    proposeYear: [this.currentYear, [ValidationService.required]],
    rewardType: [null, [ValidationService.required]],
    signOrgId: [null, [ValidationService.required]],
    employeeId: [null],
    rewardDecideCode: [null],
    statusApprove: [null],
    note: [null],
    isAgreeToApprove: [null],
    isApprovalScreen: [1],
    isRequiredSign: [1],
    isSynthetic: [1],
    createdBy: [null],
    createdDate: [null],
    proposalType: [null, [ValidationService.required]]
  }
  proposalTypeOptions = [
    { name: "DX1–Tập đoàn ra quyết định", value: 1 },
    { name: "DX2–Tập đoàn ủy quyền TCT ra quyết định", value: 2 },
    { name: "DX3-Đơn vị độc lập ra quyết định", value: 3 },
  ]
  mapRewardTypeBranch = { 1: 0, 2: 3, 3: 1, 4: 2, 5: 5 };
  isHideDescription: any;
  signOrgId: any;
  isReasonEmpty: any;
  branch: number;
  rewardType: any;
  status: any;
  activeIndex: number;
  offset: any = 0;
  limit: any = 50;
  modalProcessLoad: NgbModalRef;
  loadInfoTab: any = {};
  constructor(
    public actr: ActivatedRoute,
    private router: Router,
    private app: AppComponent,
    private modalService: NgbModal,
    private rewardProposeService: RewardProposeService,
    private rewardProposeSignService: RewardProposeSignService,
    public helperService: HelperService,
    public dialogService: DialogService,) {
    super(null, CommonUtils.getPermissionCode("resource.rewardPropose"));
    this.setMainService(rewardProposeService);
    this.buildFormSave({});
    this.modalProcessLoad = this.modalService.open(RewardProcessLoadModalComponent, MEDIUM_MODAL_OPTIONS);
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 3) {
      this.isView = subPaths[3] === 'view-selection';
      this.isEdit = subPaths[3] === 'edit-selection';
      this.rewardProposeIdExist = subPaths[4];
    }
    this.helperService.setWaitDisplayLoading(true);
    this.isHideDescription = true;
    this.listYear = this.getYearList();
    this.setDataTopAllForms();
    this.listStatus = APP_CONSTANTS.SELECTION_STATUS_LIST;
    this.processingData.subscribe(async info => {
      this.modalProcessLoad.componentInstance.updateView(info);
    })
  }

  get f() {
    return this.formSave.controls;
  }

  private getYearList() {
    this.listYear = [];
    const currentYear = new Date().getFullYear();
    for (let i = (currentYear - 20); i <= currentYear; i++) {
      const obj = {
        year: i
      };
      this.listYear.push(obj);
    }
    return this.listYear;
  }

  public buildFormSave(data?: any) {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, []);
    const fileAttachment = new FileControl(null);
    if (data && data.fileAttachment) {
      if (data.fileAttachment.attachedFiles) {
        fileAttachment.setFileAttachment(data.fileAttachment.attachedFiles);
      }
    }
    this.formSave.addControl('attachedFiles', fileAttachment);
  }

  public goBack() {
    this.router.navigate(['/reward/reward-propose-approval']);
  }

  public onRewardTypeChange() {
    const rewardType = this.formSave.controls['rewardType'].value;
    this.rewardType = rewardType;
    const branch = this.mapRewardTypeBranch[rewardType];
    this.branch = branch;
    const data = { rewardType: rewardType, branch: branch };
    this.resetFormArray.next(data);
  }

  public setDataTopAllForms() {
    this.rewardProposeService.findOne(this.rewardProposeIdExist)
      .subscribe((res) => {
        this.rewardType = res.data.rewardType;
        this.status = res.data.status;
        this.rewardProposeId = res.data.rewardProposeId;
        const data = this.convertChoosenPropose(res.data);
        const lstRewardProposeSynthetic = res.data.lstRewardProposeSynthetic
        this.buildFormSave(data);
        this.formRewardDecideTable.next(lstRewardProposeSynthetic)
        this.signOrgId = res.data.signOrgId;
        this.onRewardTypeChange();
        this.setData.next(res);
        this.helperService.setWaitDisplayLoading(false);
      });
  }

  public convertChoosenPropose(oldData) {
    const newData = oldData;
    const lstRewardProposeDetail = newData.lstRewardProposeDetail || [];
    for (let i = 0; i < lstRewardProposeDetail.length; i++) {
      lstRewardProposeDetail[i].rewardTitleId = lstRewardProposeDetail[i].rewardTitleId2;
      lstRewardProposeDetail[i].rewardTitleName = lstRewardProposeDetail[i].rewardTitleName2;
      lstRewardProposeDetail[i].description = lstRewardProposeDetail[i].description2;
      lstRewardProposeDetail[i].amountOfMoney = lstRewardProposeDetail[i].amountOfMoney2;
      lstRewardProposeDetail[i].rewardCategory = lstRewardProposeDetail[i].rewardCategory2;
    }
    newData.lstRewardProposeDetail = lstRewardProposeDetail;
    return newData;
  }
  public onSignOgrChange(event) {
    this.signOrgId = event.organizationId
  }

  public processSaveOrUpdate(option: number) {
    let formArrayCheck;
    let isInvalidForm = false;
    if (!CommonUtils.isValidForm(this.formRewardGroupInside)) {
      this.activeIndex = 0;
      this.app.warningMessage('formRewardProposeGroupInside');
      isInvalidForm = true;
      formArrayCheck = this.formRewardGroupInside;
    } else if (!CommonUtils.isValidForm(this.formRewardPersonInside)) {
      this.activeIndex = 1;
      this.app.warningMessage('formRewardProposePersonInside');
      isInvalidForm = true;
      formArrayCheck = this.formRewardPersonInside;
    } else if (!CommonUtils.isValidForm(this.formRewardGroupOutside)) {
      this.activeIndex = 2;
      this.app.warningMessage('formRewardProposeGroupOutside');
      isInvalidForm = true;
      formArrayCheck = this.formRewardGroupOutside;
    } else if (!CommonUtils.isValidForm(this.formRewardPersonOutside)) {
      this.activeIndex = 3;
      this.app.warningMessage('formRewardProposePersonOutside');
      isInvalidForm = true;
      formArrayCheck = this.formRewardPersonOutside;
    }else if (!CommonUtils.isValidForm(this.formRewardCost)) {
      this.activeIndex = 3;
      this.app.warningMessage('formRewardProposeOrgCost');
      isInvalidForm = true;
      formArrayCheck = this.formRewardCost;
    }
    if (isInvalidForm) {
      let stt;
      for (stt = 0; stt < formArrayCheck.controls.length; stt++) {
        let formGroup = (formArrayCheck.controls[stt] as FormGroup);
        if (formGroup.invalid) {
          break;
        }
      }
      this.pageFocus.next({stt: stt, activeIndex: this.activeIndex});
      return;
    }
    const saveData = this.formSave.value;
    const lstRewardProposeDetail = [];
    const rewardForm = {};
    rewardForm['rewardProposeId'] = saveData.rewardProposeId;
    rewardForm['name'] = saveData.name;
    rewardForm['proposeOrgId'] = saveData.proposeOrgId;
    rewardForm['rewardType'] = saveData.rewardType;
    rewardForm['periodType'] = saveData.periodType;
    rewardForm['approvalOrgId'] = saveData.approvalOrgId;
    rewardForm['signOrgId'] = saveData.signOrgId;
    rewardForm['proposeYear'] = saveData.proposeYear;
    rewardForm['isApprovalScreen'] = saveData.isApprovalScreen;
    rewardForm['isRequiredSign'] = saveData.isRequiredSign;
    if (option === 1) {
      rewardForm['status'] = SELECTION_STATUS.DANG_XET_CHON;
    } else {
      rewardForm['status'] = SELECTION_STATUS.DA_XET_CHON;
    }
    rewardForm['attachedFiles'] = saveData.attachedFiles;
    // tap the trong sangnn
    if (CommonUtils.isValidForm(this.formRewardGroupInside)) {
      this.formRewardGroupInside.controls.forEach(data => {
        data.value['rewardProposeDetailType'] = LOAI_KHEN_THUONG_CHI_TIET.TAP_THE_TRONG_VT;
        if ((saveData.rewardType == LOAI_KHEN_THUONG.TO_CHUC_DOAN ||
          saveData.rewardType == LOAI_KHEN_THUONG.TO_CHUC_PHU_NU ||
          saveData.rewardType == LOAI_KHEN_THUONG.TO_CHUC_THANH_NIEN)
          && data.value.massOrganizationId != null) {
          data.value['objectIdsangnnMember'] = data.value.massOrganizationId;
        } else if (saveData.rewardType == LOAI_KHEN_THUONG.TO_CHUC_DANG && data.value.partyOrganizationId != null) {
          data.value['objectIdsangnnMember'] = data.value.partyOrganizationId;
        } else if (saveData.rewardType == LOAI_KHEN_THUONG.CHINH_QUYEN && data.value.organizationId != null) {
          data.value['objectIdsangnnMember'] = data.value.organizationId;
        }
        lstRewardProposeDetail.push(data.value);
      });
    }
    // can bo, cong nhan vien
    if (CommonUtils.isValidForm(this.formRewardPersonInside)) {
      this.formRewardPersonInside.controls.forEach(data => {
        data.value['rewardProposeDetailType'] = LOAI_KHEN_THUONG_CHI_TIET.KHEN_THUONG_CBNV;
        if (data.value.employeeId != null) {
          data.value['objectIdsangnnMember'] = data.value.employeeId;
        }
        lstRewardProposeDetail.push(data.value);
      });
    }
    // tap the ngoai sangnn
    if (CommonUtils.isValidForm(this.formRewardGroupOutside)) {
      this.formRewardGroupOutside.controls.forEach(data => {
        data.value['rewardProposeDetailType'] = LOAI_KHEN_THUONG_CHI_TIET.TAP_THE_NGOAI_VT;
        lstRewardProposeDetail.push(data.value);
      });
    } else {
      return;
    }
    // ca nhan ngoai sangnn
    if (CommonUtils.isValidForm(this.formRewardPersonOutside)) {
      this.formRewardPersonOutside.controls.forEach(data => {
        data.value['rewardProposeDetailType'] = LOAI_KHEN_THUONG_CHI_TIET.CA_NHAN_NGOAI_VT;
        lstRewardProposeDetail.push(data.value);
      });
    } else {
      return;
    }
    // chi phí
    if (CommonUtils.isValidForm(this.formRewardCost)) {
      this.formRewardCost.controls.forEach(data => {
        data.value['rewardProposeDetailType'] = LOAI_KHEN_THUONG_CHI_TIET.CHI_PHI;
        lstRewardProposeDetail.push(data.value);
      });
    } else {
      return;
    }
    if (!CommonUtils.isNullOrEmpty(lstRewardProposeDetail)) {
      this.app.confirmMessage(null, () => { // on accepted
        rewardForm['lstRewardProposeDetail'] = lstRewardProposeDetail;
        this.rewardProposeService.saveAll(rewardForm).subscribe(res => {
          if (this.rewardProposeService.requestIsSuccess(res)) {
            this.goBack();
          }
        });
      }, () => {
        // on rejected
      });
    } else {
      this.app.warningMessage("inValidAllTab");
      return;
    }
  }

  public getFormRewardGroupInside(event) {
    this.formRewardGroupInside = event;
  }

  public getFormRewardPersonalInside(event) {
    this.formRewardPersonInside = event;
  }

  public getFormRewardGroupOutSide(event) {
    this.formRewardGroupOutside = event;
  }

  public getFormRewardPersonalOutSide(event) {
    this.formRewardPersonOutside = event;
  }

  public getFormRewardOrgCost(event) {
    this.formRewardCost = event;
  }

  public openFormImport() {
    const rewardType = this.formSave.controls['rewardType'].value;
    if (!rewardType) {
      this.app.warningMessage('pleaseChooseRewardType');
      return;
    }
    const modalRef = this.modalService.open(RewardSuggestImportManageComponent1, DEFAULT_MODAL_OPTIONS);
    const data = { rewardProposeId: this.rewardProposeId, rewardType: this.rewardType, branch: this.branch, rewardObjectType: 2, option: 1, isApprovalScreen: 1 };
    modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      this.modalProcessLoad = this.modalService.open(RewardProcessLoadModalComponent, MEDIUM_MODAL_OPTIONS);
      setTimeout(() => {
        this.dataImportGroupInsangnn.next(result.data.GROUP_IN_sangnn);
        this.dataImportStaffInsangnn.next(result.data.STAFF_IN_sangnn);
        this.dataImportGroupOutsangnn.next(result.data.GROUP_OUT_sangnn);
        this.dataImportStaffOutsangnn.next(result.data.STAFF_OUT_sangnn);
      }, 300);
    });
  }

  public calIsChoseOrIsSuggest(list: any) {
    if (list && list.value.length > 0) {
     const filtered = list.value.filter(item => item.isChoose == 1 || item.isSuggest == 1);
     return filtered.length;
    }
    return 0;
  }

  public calIsChose(list: any) {
    if (list && list.value.length > 0) {
     const filtered = list.value.filter(item => item.isChoose == 1);
     return filtered.length;
    }
    return 0;
  }

  public calIsSuggest(list: any) {
    if (list && list.value.length > 0) {
     const filtered = list.value.filter(item => item.isSuggest == 1);
     return filtered.length;
    }
    return 0;
  }

  /**
   * từ chối đề xuất
  */
   public cancelOffer() {
     const item = this.formSave.value;
    const ref = this.dialogService.open(popupRejectReason, {
      header: 'Lý do từ chối',
      width: '50%',
      baseZIndex: 1500,
      contentStyle: {"padding": "0"},
      data: item
    });
    ref.onClose.subscribe( (res) => {
      this.processSearch();
    })
  }

  /**
   * Xem file bằng khen
   */
  onPreviewFile() {
    const saveData = this.formSave.value;
    const lstRewardProposeSignObjectForm = [];
    const rewardForm = {};
    rewardForm['rewardProposeId'] = saveData.rewardProposeId;
    rewardForm['name'] = saveData.name;
    rewardForm['proposeOrgId'] = saveData.proposeOrgId;
    rewardForm['rewardType'] = saveData.rewardType;
    rewardForm['periodType'] = saveData.periodType;
    rewardForm['approvalOrgId'] = saveData.approvalOrgId;
    rewardForm['signOrgId'] = saveData.signOrgId;
    rewardForm['proposeYear'] = saveData.proposeYear;
    rewardForm['isApprovalScreen'] = saveData.isApprovalScreen;
    rewardForm['isRequiredSign'] = saveData.isRequiredSign;
    let isRewardTitle = false;
    // tap the trong sangnn
    this.formRewardGroupInside.controls.forEach(data => {
      data.value['rewardProposeDetailType'] = LOAI_KHEN_THUONG_CHI_TIET.TAP_THE_TRONG_VT;
      if ((saveData.rewardType == LOAI_KHEN_THUONG.TO_CHUC_DOAN ||
        saveData.rewardType == LOAI_KHEN_THUONG.TO_CHUC_PHU_NU ||
        saveData.rewardType == LOAI_KHEN_THUONG.TO_CHUC_THANH_NIEN)
        && data.value.massOrganizationId != null) {
        data.value['objectIdsangnnMember'] = data.value.massOrganizationId;
      } else if (saveData.rewardType == LOAI_KHEN_THUONG.TO_CHUC_DANG && data.value.partyOrganizationId != null) {
        data.value['objectIdsangnnMember'] = data.value.partyOrganizationId;
      } else if (saveData.rewardType == LOAI_KHEN_THUONG.CHINH_QUYEN && data.value.organizationId != null) {
        data.value['objectIdsangnnMember'] = data.value.organizationId;
      }
      if (data.value.isPreview) {
        if (data.value.rewardTitleId != null) {
          isRewardTitle = true;
        }
        lstRewardProposeSignObjectForm.push(data.value);
      }
    });
    // can bo, cong nhan vien
    this.formRewardPersonInside.controls.forEach(data => {
      data.value['rewardProposeDetailType'] = LOAI_KHEN_THUONG_CHI_TIET.KHEN_THUONG_CBNV;
      if (data.value.employeeId != null) {
        data.value['objectIdsangnnMember'] = data.value.employeeId;
      }
      if (data.value.isPreview) {
        if (data.value.rewardTitleId != null) {
          isRewardTitle = true;
        }
        lstRewardProposeSignObjectForm.push(data.value);
      }
    });

    if (CommonUtils.isNullOrEmpty(lstRewardProposeSignObjectForm)) {
      this.app.warningMessage('rewardPropose.notChooseReward');
      return;
    }
    if (!isRewardTitle) {
      this.app.warningMessage('rewardPropose.rewardTitleInValid');
      return;
    }
    rewardForm['lstRewardProposeSignObjectForm'] = lstRewardProposeSignObjectForm;
    rewardForm['offset'] = this.offset;
    rewardForm['limit'] = this.limit;
    this.rewardProposeSignService.previewFile(rewardForm).subscribe(res => {
      if (res.size > 0) {
        const modalRef = this.modalService.open(ReportPreviewCertificateComponent, LARGE_MODAL_OPTIONS);
        modalRef.componentInstance.value = res;
        modalRef.componentInstance.rewardForm = rewardForm;
        modalRef.componentInstance.isBlobFile = false;
        modalRef.componentInstance.isPreviewRewardTitle = true;
      } else {
        this.app.errorMessage("rewardPropose.canNotFindFileRewardTitle")
      }
    });
  }

}
