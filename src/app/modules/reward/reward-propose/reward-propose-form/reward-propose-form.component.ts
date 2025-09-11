import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import {
  ACTION_FORM,
  APP_CONSTANTS,
  LOAI_KHEN_THUONG_CHI_TIET,
  REWARD_PROPOSE_STATUS,
  DEFAULT_MODAL_OPTIONS,
  PROPOSE_STATUS,
  LOAI_KHEN_THUONG,
  LARGE_MODAL_OPTIONS,
  MEDIUM_MODAL_OPTIONS, OrganizationService
} from '@app/core';
import { FileControl } from '@app/core/models/file.control';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { OrgSelectorComponent } from '@app/shared/components/org-selector/org-selector.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { Subject } from 'rxjs';
import { SortEvent } from 'primeng/api';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RewardSuggestImportManageComponent } from '../reward-propose-form/file-import-reward-management/file-import-reward-management.component';
import { RewardDecideListComponent } from '../reward-propose-form/reward-decide-list/reward-decide-list.component';
import { Thickness } from '@syncfusion/ej2-diagrams';
import { retry } from 'rxjs/operators';
import { PartyOrgSelectorComponent } from '@app/shared/components/party-org-selector/party-org-selector.component';
import { MassOrgSelectorComponent } from '@app/shared/components/mass-org-selector/mass-org-selector.component';
import {ReportPreviewCertificateComponent} from "@app/modules/reward/reward-general-preview/report-preview-certificate";
import {RewardProposeSignService} from "@app/core/services/reward-propose-sign/reward-propose-sign.service";
import { HelperService } from '@app/shared/services/helper.service';
import { RewardProcessLoadModalComponent } from '../../reward-propose/reward-process-load-modal/reward-process-load-modal.component';
import _ from 'lodash';
@Component({
  selector: 'reward-propose-form',
  templateUrl: './reward-propose-form.component.html',
  styleUrls: ['./reward-propose-form.component.css']
})
export class RewardProposeFormComponent extends BaseComponent implements OnInit {
  // @Input() rewardType;
  @ViewChild('signOrgElement') signOrgElement: OrgSelectorComponent;
  @ViewChild('signPartyOrgElement') signPartyOrgElement: PartyOrgSelectorComponent;
  @ViewChild('signMassOrgElement') signMassOrgElement: MassOrgSelectorComponent;
  rootId = APP_CONSTANTS.ORG_ROOT_ID
  resetFormArray: Subject<any> = new Subject<any>();
  resetFormDecide: Subject<any> = new Subject<any>();
  setData: Subject<any> = new Subject<any>();
  processingData: Subject<any> = new Subject<any>();
  pageFocus: Subject<any> = new Subject<any>();
  dataImportGroupInsangnn: Subject<any> = new Subject<any>();
  dataImportStaffInsangnn: Subject<any> = new Subject<any>();
  dataImportGroupOutsangnn: Subject<any> = new Subject<any>();
  dataImportStaffOutsangnn: Subject<any> = new Subject<any>();
  dataRewardCost: Subject<any> = new Subject<any>();
  formRewardDecideTable: Subject<any> = new Subject<any>();
  rewardProposeId: number;
  isView: boolean = false;
  isEdit: boolean = false;
  isInsert: boolean = false;
  isApprove: boolean = false;
  isDisable: boolean = false;
  rewardTypeList: any;
  listYear: any;
  formSave: FormGroup;
  numIndex = 1;

  lstRewardType = APP_CONSTANTS.REWARD_GENERAL_TYPE_LIST;
  lstPeriodType = APP_CONSTANTS.REWARD_PERIOD_TYPE_LIST;
  tuChoiXetDuyet = REWARD_PROPOSE_STATUS.TU_CHOI_XET_DUYET;
  daDuyetXetDuyet = REWARD_PROPOSE_STATUS.DA_DUYET_XET_DUYET;
  saveData: Subject<boolean> = new Subject<boolean>();
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
  //Form de xuat tong hop
  formRewardDecide: any[] = [];
  isPersonal: boolean;
  dataToLoadIntoForm: any;
  loadDataIntoForm: any;
  rewardProposeIdExist: any;
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  rewardTypeListByUserToInsert: any;
  listStatus: any;
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
    isRequiredSign: [0],
    isSynthetic: [0],
    createdBy: [null],
    createdDate: [null],
    proposalType: [null],
  }
  proposalTypeOptions = [
      { name: "DX1–Tập đoàn ra quyết định", value: 1 },
      { name: "DX2–Tập đoàn ủy quyền TCT ra quyết định", value: 2 },
      { name: "DX3-Đơn vị độc lập ra quyết định", value: 3 },
  ]
  mapRewardTypeBranch = { 1: 0, 2: 3, 3: 1, 4: 2, 5: 5 };
  defaultStatus = PROPOSE_STATUS.DU_THAO;
  isHideDescription: any;
  isAgreeToApprove: any;
  signOrgId: any;
  proposeOrgId: any;
  branch: number;
  isChecked: boolean = true;
  isClickSignDocument: boolean = false;
  isRequiredProposalType: boolean = false;
  isShowButtonSign: boolean = true;
  activeIndex: number;
  rootPartyId = APP_CONSTANTS.PARTY_ORG_ROOT_ID;
  rootOrgId = APP_CONSTANTS.ORG_ROOT_ID;
  modalProcessLoad: NgbModalRef;
  constructor(
    public actr: ActivatedRoute,
    public helperService: HelperService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private app: AppComponent,
    private modalService: NgbModal,
    private rewardProposeService: RewardProposeService,
    private orgService: OrganizationService,
    private rewardProposeSignService : RewardProposeSignService) {
    super(null, CommonUtils.getPermissionCode("resource.rewardPropose"));
    this.setMainService(rewardProposeService);
    this.buildFormSave({});
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 3) {
      this.isView = subPaths[3] === 'view';
      this.isEdit = subPaths[3] === 'edit';
      this.isInsert = subPaths[3] === 'add';
      this.rewardProposeIdExist = subPaths[4];
    }
    if (!this.isInsert) {
      this.modalProcessLoad = this.modalService.open(RewardProcessLoadModalComponent, MEDIUM_MODAL_OPTIONS);
    }
  }

  ngOnInit() {
    if (!this.isInsert) {
      this.helperService.setWaitDisplayLoading(true);
      this.setDataTopAllForms();
      this.processingData.subscribe(async info => {
        // await this.wait(500);
        this.modalProcessLoad.componentInstance.updateView(info);
      })
    }
    this.isHideDescription = true;
    this.listYear = this.getYearList();
    this.rewardProposeService.getRewardTypeList().subscribe(res => {
      this.rewardTypeListByUserToInsert = this.lstRewardType.filter((item) => {
        return res.includes(item.id)
      })
    })
    this.listStatus = APP_CONSTANTS.PROPOSE_STATUS_LIST;
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
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, [])
    const fileAttachment = new FileControl(null);
    if (data && data.fileAttachment) {
      if (data.fileAttachment.attachedFiles) {
        fileAttachment.setFileAttachment(data.fileAttachment.attachedFiles);
      }
    }
    this.formSave.addControl('attachedFiles', fileAttachment);
  }
  public makeDefaultForm() {
    let group = {
      name: [null],
      approvalOrgName: [null],
      proposeOrgName: [null],
      rewardType: [null],
      periodType: [null],
      proposeYear: [null],
      status: [null],
      rewardProposeId:[null, [ValidationService.required]]
    }
    return this.buildForm({}, group);
  }
  public goBack() {
    this.router.navigate(['/reward/reward-propose']);
  }

  public navigateEdit(rewardProposeId: any) {
    this.router.navigate([`/reward/reward-propose/edit/${rewardProposeId}`]);
  }

  public goView(rewardProposeId: any) {
    this.router.navigate([`/reward/reward-propose/view/${rewardProposeId}`]);
  }

  public onRewardTypeChange() {
    const rewardType = this.formSave.controls['rewardType'].value;
    const branch = this.mapRewardTypeBranch[rewardType];
    const data = { rewardType: rewardType, branch: branch };
    this.resetFormArray.next(data);
  }

  public setDataTopAllForms() {//tinhbv: cũ, xem chi tiết bản ghi
    this.rewardProposeService.findOne(this.rewardProposeIdExist)
      .subscribe((res) => {
        const lstRewardProposeSynthetic = res.data.lstRewardProposeSynthetic
        this.formRewardDecide = lstRewardProposeSynthetic.map((item) => {
          return item.rewardProposeId
        })
        this.signOrgId = res.data.signOrgId;
        this.buildFormSave(res.data);
        this.formRewardDecideTable.next(lstRewardProposeSynthetic)
        const rewardType = this.formSave.controls['rewardType'].value;
        const branch = this.mapRewardTypeBranch[rewardType];
        const data = { rewardType: rewardType, branch: branch };
        this.resetFormArray.next(data);
        this.setData.next(res);
        this.helperService.setWaitDisplayLoading(false);
      });

  }

  public onProposeOrgChange(event) {
    // if (event.organizationId > 0) {
    //   this.formSave.controls['signOrgId'].setValue(event.organizationId);
    //   this.signOrgElement.onChangeOrgId();
    // }
    if (event.partyOrganizationId > 0) {
      this.formSave.controls['signOrgId'].setValue(event.partyOrganizationId);
      this.signPartyOrgElement.onChangeOrgId();
    }
    if (event.massOrganizationId > 0) {
      this.formSave.controls['signOrgId'].setValue(event.massOrganizationId);
      this.signMassOrgElement.onChangeOrgId();
    }
  }

  onSignOgrChange(event) {
    if (event.organizationId > 0) {
      this.signOrgId = event.proposeOrgId;
    };
  }

  public processSaveOrUpdate(option) {
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
    }
    else if (!CommonUtils.isValidForm(this.formRewardCost)) {
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
    const rewardForm = {};
    if(this.f['isSynthetic']) {
      rewardForm['rewardProposeIdList'] = this.formRewardDecide
    }
    this.isRequiredProposalType = false;
    if(this.f['periodType'] && this.f['periodType'].value === 1 && !this.f['proposalType'].value ){
      this.isRequiredProposalType = true;
    }
    if (CommonUtils.isValidForm(this.formSave) && !this.isRequiredProposalType &&
      (CommonUtils.isValidForm(this.formRewardGroupInside) || CommonUtils.isValidForm(this.formRewardGroupOutside) ||
        CommonUtils.isValidForm(this.formRewardPersonInside) || CommonUtils.isValidForm(this.formRewardPersonOutside))) {
      const saveData = this.formSave.value;
      rewardForm['rewardProposeId'] = saveData.rewardProposeId;
      rewardForm['name'] = saveData.name;
      rewardForm['proposeOrgId'] = saveData.proposeOrgId;
      rewardForm['rewardType'] = saveData.rewardType;
      rewardForm['proposalType'] = saveData.proposalType;
      rewardForm['periodType'] = saveData.periodType;
      rewardForm['approvalOrgId'] = saveData.approvalOrgId;
      rewardForm['signOrgId'] = saveData.signOrgId;
      rewardForm['proposeYear'] = saveData.proposeYear;
      if(option == 2 && !this.f['isRequiredSign'].value && saveData.proposeOrgId == saveData.approvalOrgId) {// trường hợp gửi đề xuất
        rewardForm['status'] = PROPOSE_STATUS.DA_XET_CHON;
      } else if (option == 1 && !this.f['isRequiredSign'].value && saveData.proposeOrgId == saveData.approvalOrgId) {// trường hợp bấm lưu lại
        rewardForm['status'] = this.defaultStatus;
      } else {
        rewardForm['status'] = this.defaultStatus;
      }
      rewardForm['option'] = option;
      rewardForm['attachedFiles'] = saveData.attachedFiles;
      rewardForm['isRequiredSign'] = saveData.isRequiredSign ? 1 : 0;
      rewardForm['isSynthetic'] = saveData.isSynthetic ? 1 : 0;
      const lstRewardProposeDetail = [];
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
      } else {
        return;
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
        let count = 0
        let isValid = false
        let isValidFormRewardGroupInside = true
        let isValidFormRewardPersonInside = true
        if(rewardForm['rewardType'] === 5) {
          if(this.formRewardGroupInside.length > 0 && this.formRewardPersonInside.length == 0){

              this.formRewardGroupInside.controls.forEach(data => {
                // if(data.value['representativeId'] === null || data.value['representativeId'] === ''){
                //   this.app.warningMessage('formRewardProposeGroupInside.representativeId');
                //   isInvalidForm = true;
                //   return;
                // }
                this.orgService.findVfsAccountingTypeById(data.value['organizationId']).subscribe(res => {
                  // {{debugger}}
                  // if((data.value['rewardTitleName'] != 'Khen thưởng bằng hiện vật' && data.value['rewardCategory'] != 2)
                  //     &&((data.value['representativeId'] === null || data.value['representativeId'] === '') && (res.data['vfsAccountingType'] === null || res.data['vfsAccountingType'] === ''))){
                  //   this.activeIndex = 0;
                  //   this.app.warningMessage('formRewardProposeGroupInside');
                  //   isInvalidForm = true;
                  //   formArrayCheck = this.formRewardGroupInside;
                  //   count = 0
                  // }
                  // else

                  if(saveData.rewardType == 5 && res.data.vfsAccountingType !== "Phụ thuộc" && res.data.vfsAccountingType !== "Độc lập"&&  (data.value['representativeId'] === null || data.value['representativeId'] === '') && data.value['rewardTitleName'] != 'Khen thưởng bằng hiện vật'){
                    this.activeIndex = 0;
                    this.app.warningMessage('formRewardProposeGroupInside.representativeId');
                    isInvalidForm = true;
                    formArrayCheck = this.formRewardGroupInside;
                    isValidFormRewardGroupInside = false
                    count = 0
                  }
                  else{
                    if(data.value['rewardTitleName'] == 'Khen thưởng bằng hiện vật' && data.value['rewardCategory'] == 2){
                      if(data.value['receiveBonusOrgId'] == null || data.value['receiveBonusOrgId'] == ''){
                        this.activeIndex = 0;
                        this.app.warningMessage('formRewardProposeGroupInside.receiveBonusOrgId');
                        isInvalidForm = true;
                        formArrayCheck = this.formRewardGroupInside;
                        isValidFormRewardGroupInside = false
                        count = 0
                      }
                      else {
                        count++
                      }
                    }else {
                      count++
                    }
                  }
                  if(count === this.formRewardGroupInside.length){
                    count = 0
                    isValidFormRewardGroupInside = true
                    this.app.confirmMessage(null, () => { // on accepted
                      const rewardProposeDetailForm = _.cloneDeep(lstRewardProposeDetail);
                      rewardProposeDetailForm.forEach(item => {
                        delete item['rewardTitleIdList'];
                      });
                      rewardForm['lstRewardProposeDetail'] = rewardProposeDetailForm;
                      this.rewardProposeService.saveAll(rewardForm).subscribe(res => {
                        if (this.rewardProposeService.requestIsSuccess(res) && res.data && res.data.rewardProposeId) {
                          if(this.isClickSignDocument) {
                            // thực hiện gen file phụ lục trình ký
                            this.rewardProposeService.actionSignVoffice(res.data.rewardProposeId).subscribe(resp => {
                              if(this.rewardProposeService.requestIsSuccess(resp)) {
                                const signDocumentId = resp.data;
                                this.router.navigateByUrl('voffice-signing/reward-propose/' + signDocumentId, { state: {backUrl:'reward/reward-propose'} });
                              }
                            })
                          } else {
                            this.goView(res.data.rewardProposeId);
                          }
                        }
                      });
                    }, () => {
                      // on rejected
                      this.isClickSignDocument = false;
                    });
                  }
                })
              })
          }
          else if(this.formRewardGroupInside.length > 0 && this.formRewardPersonInside.length > 0){
            this.formRewardPersonInside.controls.forEach(data => {

              if((data.value['rewardTitleName'] != 'Khen thưởng bằng hiện vật' && data.value['rewardCategory'] != 2)
                  && (data.value['representativeId'] === null || data.value['representativeId'] === '')){
                this.activeIndex = 0;
                this.app.warningMessage('formRewardProposePersonInside');
                isInvalidForm = true;
                formArrayCheck = this.formRewardPersonInside;
                count = 0
                isValidFormRewardPersonInside = false
              }else if ((data.value['representativeId'] === null || data.value['representativeId'] === '') && data.value['rewardTitleName'] != 'Khen thưởng bằng hiện vật'){
                this.activeIndex = 0;
                this.app.warningMessage('formRewardProposePersonInside.representativeId');
                isInvalidForm = true;
                formArrayCheck = this.formRewardPersonInside;
                count = 0
                isValidFormRewardPersonInside = false
              }else{
                if(data.value['rewardTitleName'] == 'Khen thưởng bằng hiện vật' && data.value['rewardCategory'] == 2){
                  if(data.value['receiveBonusOrgId'] == null || data.value['receiveBonusOrgId'] == ''){
                    this.activeIndex = 0;
                    this.app.warningMessage('formRewardProposePersonInside.receiveBonusOrgId');
                    isInvalidForm = true;
                    formArrayCheck = this.formRewardPersonInside;
                    count = 0
                    isValidFormRewardPersonInside = false
                  }
                  else {
                    count++
                  }
                }else {
                  count++
                }
              }
              if(count === this.formRewardPersonInside.length ){
                count = 0
                isValidFormRewardPersonInside = true
                this.app.confirmMessage(null, () => { // on accepted
                  const rewardProposeDetailForm = _.cloneDeep(lstRewardProposeDetail);
                  rewardProposeDetailForm.forEach(item => {
                    delete item['rewardTitleIdList'];
                  });
                  rewardForm['lstRewardProposeDetail'] = rewardProposeDetailForm;
                  this.rewardProposeService.saveAll(rewardForm).subscribe(res => {
                    if (this.rewardProposeService.requestIsSuccess(res) && res.data && res.data.rewardProposeId) {
                      if(this.isClickSignDocument) {
                        // thực hiện gen file phụ lục trình ký
                        this.rewardProposeService.actionSignVoffice(res.data.rewardProposeId).subscribe(resp => {
                          if(this.rewardProposeService.requestIsSuccess(resp)) {
                            const signDocumentId = resp.data;
                            this.router.navigateByUrl('voffice-signing/reward-propose/' + signDocumentId, { state: {backUrl:'reward/reward-propose'} });
                          }
                        })
                      } else {
                        this.goView(res.data.rewardProposeId);
                      }
                    }
                  });
                }, () => {
                  // on rejected
                  this.isClickSignDocument = false;
                });
              }
            })
            if(isValidFormRewardPersonInside) {
              this.formRewardGroupInside.controls.forEach(data => {
                // if(data.value['representativeId'] === null || data.value['representativeId'] === ''){
                //   this.app.warningMessage('formRewardProposeGroupInside.representativeId');
                //   isInvalidForm = true;
                //   return;
                // }
                this.orgService.findVfsAccountingTypeById(data.value['organizationId']).subscribe(res => {
                  // {{debugger}}
                  // if((data.value['rewardTitleName'] != 'Khen thưởng bằng hiện vật' && data.value['rewardCategory'] != 2)
                  //     &&((data.value['representativeId'] === null || data.value['representativeId'] === '') && (res.data['vfsAccountingType'] === null || res.data['vfsAccountingType'] === ''))){
                  //   this.activeIndex = 0;
                  //   this.app.warningMessage('formRewardProposeGroupInside');
                  //   isInvalidForm = true;
                  //   formArrayCheck = this.formRewardGroupInside;
                  //   count = 0
                  // }
                  // else

                  if(saveData.rewardType == 5 && res.data.vfsAccountingType !== "Phụ thuộc" && res.data.vfsAccountingType !== "Độc lập"&&  (data.value['representativeId'] === null || data.value['representativeId'] === '') && data.value['rewardTitleName'] != 'Khen thưởng bằng hiện vật'){
                    this.activeIndex = 0;
                    this.app.warningMessage('formRewardProposeGroupInside.representativeId');
                    isInvalidForm = true;
                    formArrayCheck = this.formRewardGroupInside;
                    isValidFormRewardGroupInside = false
                    count = 0
                  }
                  else{
                    if(data.value['rewardTitleName'] == 'Khen thưởng bằng hiện vật' && data.value['rewardCategory'] == 2){
                      if(data.value['receiveBonusOrgId'] == null || data.value['receiveBonusOrgId'] == ''){
                        this.activeIndex = 0;
                        this.app.warningMessage('formRewardProposeGroupInside.receiveBonusOrgId');
                        isInvalidForm = true;
                        formArrayCheck = this.formRewardGroupInside;
                        isValidFormRewardGroupInside = false
                        count = 0
                      }
                      else {
                        count++
                      }
                    }else {
                      count++
                    }
                  }
                  if(count === this.formRewardGroupInside.length){
                    count = 0
                    isValidFormRewardGroupInside = true
                    this.app.confirmMessage(null, () => { // on accepted
                      const rewardProposeDetailForm = _.cloneDeep(lstRewardProposeDetail);
                      rewardProposeDetailForm.forEach(item => {
                        delete item['rewardTitleIdList'];
                      });
                      rewardForm['lstRewardProposeDetail'] = rewardProposeDetailForm;
                      this.rewardProposeService.saveAll(rewardForm).subscribe(res => {
                        if (this.rewardProposeService.requestIsSuccess(res) && res.data && res.data.rewardProposeId) {
                          if(this.isClickSignDocument) {
                            // thực hiện gen file phụ lục trình ký
                            this.rewardProposeService.actionSignVoffice(res.data.rewardProposeId).subscribe(resp => {
                              if(this.rewardProposeService.requestIsSuccess(resp)) {
                                const signDocumentId = resp.data;
                                this.router.navigateByUrl('voffice-signing/reward-propose/' + signDocumentId, { state: {backUrl:'reward/reward-propose'} });
                              }
                            })
                          } else {
                            this.goView(res.data.rewardProposeId);
                          }
                        }
                      });
                    }, () => {
                      // on rejected
                      this.isClickSignDocument = false;
                    });
                  }
                })
              })
            }
          }else if(this.formRewardGroupInside.length == 0 && this.formRewardPersonInside.length > 0) {
            this.formRewardPersonInside.controls.forEach(data => {

              if((data.value['rewardTitleName'] != 'Khen thưởng bằng hiện vật' && data.value['rewardCategory'] != 2)
                  && (data.value['representativeId'] === null || data.value['representativeId'] === '')){
                this.activeIndex = 0;
                this.app.warningMessage('formRewardProposePersonInside');
                isInvalidForm = true;
                formArrayCheck = this.formRewardPersonInside;
                isValidFormRewardGroupInside = false
                count = 0
              }else if ((data.value['representativeId'] === null || data.value['representativeId'] === '') && data.value['rewardTitleName'] != 'Khen thưởng bằng hiện vật'){
                this.activeIndex = 0;
                this.app.warningMessage('formRewardProposePersonInside.representativeId');
                isInvalidForm = true;
                formArrayCheck = this.formRewardPersonInside;
                isValidFormRewardGroupInside = false
                count = 0
              }else{
                if(data.value['rewardTitleName'] == 'Khen thưởng bằng hiện vật' && data.value['rewardCategory'] == 2){
                  if(data.value['receiveBonusOrgId'] == null || data.value['receiveBonusOrgId'] == ''){
                    this.activeIndex = 0;
                    this.app.warningMessage('formRewardProposePersonInside.receiveBonusOrgId');
                    isInvalidForm = true;
                    formArrayCheck = this.formRewardPersonInside;
                    count = 0
                  }
                  else {
                    count++
                  }
                }else {
                  count++
                }
              }
              if(count === this.formRewardPersonInside.length ){
                count = 0
                this.app.confirmMessage(null, () => { // on accepted
                  const rewardProposeDetailForm = _.cloneDeep(lstRewardProposeDetail);
                  rewardProposeDetailForm.forEach(item => {
                    delete item['rewardTitleIdList'];
                  });
                  rewardForm['lstRewardProposeDetail'] = rewardProposeDetailForm;
                  this.rewardProposeService.saveAll(rewardForm).subscribe(res => {
                    if (this.rewardProposeService.requestIsSuccess(res) && res.data && res.data.rewardProposeId) {
                      if(this.isClickSignDocument) {
                        // thực hiện gen file phụ lục trình ký
                        this.rewardProposeService.actionSignVoffice(res.data.rewardProposeId).subscribe(resp => {
                          if(this.rewardProposeService.requestIsSuccess(resp)) {
                            const signDocumentId = resp.data;
                            this.router.navigateByUrl('voffice-signing/reward-propose/' + signDocumentId, { state: {backUrl:'reward/reward-propose'} });
                          }
                        })
                      } else {
                        this.goView(res.data.rewardProposeId);
                      }
                    }
                  });
                }, () => {
                  // on rejected
                  this.isClickSignDocument = false;
                });
              }
            })
          }else { // check trường hợp còn lại khi không có formRewardGroupInside hoặc formRewardPersonInside
            this.app.confirmMessage(null, () => { // on accepted
              const rewardProposeDetailForm = _.cloneDeep(lstRewardProposeDetail);
              rewardProposeDetailForm.forEach(item => {
                delete item['rewardTitleIdList'];
              });
              rewardForm['lstRewardProposeDetail'] = rewardProposeDetailForm;
              this.rewardProposeService.saveAll(rewardForm).subscribe(res => {
                if (this.rewardProposeService.requestIsSuccess(res) && res.data && res.data.rewardProposeId) {
                  if(this.isClickSignDocument) {
                    // thực hiện gen file phụ lục trình ký
                    this.rewardProposeService.actionSignVoffice(res.data.rewardProposeId).subscribe(resp => {
                      if(this.rewardProposeService.requestIsSuccess(resp)) {
                        const signDocumentId = resp.data;
                        this.router.navigateByUrl('voffice-signing/reward-propose/' + signDocumentId, { state: {backUrl:'reward/reward-propose'} });
                      }
                    })
                  } else {
                    this.goView(res.data.rewardProposeId);
                  }
                }
              });
            }, () => {
              // on rejected
              this.isClickSignDocument = false;
            });
          }
        }else {
          if(this.formRewardGroupInside.length >0) {
            this.formRewardGroupInside.controls.forEach(data => {

              if((data.value['rewardTitleName'] != 'Khen thưởng bằng hiện vật' && data.value['rewardCategory'] != 2)
                  && (data.value['representativeId'] === null || data.value['representativeId'] === '')){
                this.activeIndex = 0;
                this.app.warningMessage('formRewardProposeGroupInside');
                isInvalidForm = true;
                formArrayCheck = this.formRewardGroupInside;
                isValidFormRewardGroupInside = false
                count = 0
              }else if ((data.value['representativeId'] === null || data.value['representativeId'] === '') && data.value['rewardTitleName'] != 'Khen thưởng bằng hiện vật'){
                this.activeIndex = 0;
                this.app.warningMessage('formRewardProposeGroupInside.representativeId');
                isInvalidForm = true;
                formArrayCheck = this.formRewardGroupInside;
                isValidFormRewardGroupInside = false
                count = 0
              }else{
                if(data.value['rewardTitleName'] == 'Khen thưởng bằng hiện vật' && data.value['rewardCategory'] == 2){
                  if(data.value['receiveBonusOrgId'] == null || data.value['receiveBonusOrgId'] == ''){
                    this.activeIndex = 0;
                    this.app.warningMessage('formRewardProposeGroupInside.receiveBonusOrgId');
                    isInvalidForm = true;
                    formArrayCheck = this.formRewardGroupInside;
                    isValidFormRewardGroupInside = false
                    count = 0
                  }
                  else {
                    count++
                  }
                }else {
                  count++
                }
              }
              if(count === this.formRewardGroupInside.length ){
                count = 0
                isValidFormRewardGroupInside = true
                // this.app.confirmMessage(null, () => { // on accepted
                //   const rewardProposeDetailForm = _.cloneDeep(lstRewardProposeDetail);
                //   rewardProposeDetailForm.forEach(item => {
                //     delete item['rewardTitleIdList'];
                //   });
                //   rewardForm['lstRewardProposeDetail'] = rewardProposeDetailForm;
                //   this.rewardProposeService.saveAll(rewardForm).subscribe(res => {
                //     if (this.rewardProposeService.requestIsSuccess(res) && res.data && res.data.rewardProposeId) {
                //       if(this.isClickSignDocument) {
                //         // thực hiện gen file phụ lục trình ký
                //         this.rewardProposeService.actionSignVoffice(res.data.rewardProposeId).subscribe(resp => {
                //           if(this.rewardProposeService.requestIsSuccess(resp)) {
                //             const signDocumentId = resp.data;
                //             this.router.navigateByUrl('voffice-signing/reward-propose/' + signDocumentId, { state: {backUrl:'reward/reward-propose'} });
                //           }
                //         })
                //       } else {
                //         this.goView(res.data.rewardProposeId);
                //       }
                //     }
                //   });
                // }, () => {
                //   // on rejected
                //   this.isClickSignDocument = false;
                // });
              }
            })
          }
          if(this.formRewardPersonInside.length > 0){
            this.formRewardPersonInside.controls.forEach(data => {

              if((data.value['rewardTitleName'] != 'Khen thưởng bằng hiện vật' && data.value['rewardCategory'] != 2)
                  && (data.value['representativeId'] === null || data.value['representativeId'] === '')){
                this.activeIndex = 0;
                this.app.warningMessage('formRewardProposePersonInside');
                isInvalidForm = true;
                formArrayCheck = this.formRewardPersonInside;
                isValidFormRewardPersonInside = false
                count = 0
              }else if ((data.value['representativeId'] === null || data.value['representativeId'] === '') && data.value['rewardTitleName'] != 'Khen thưởng bằng hiện vật'){
                this.activeIndex = 0;
                this.app.warningMessage('formRewardProposePersonInside.representativeId');
                isInvalidForm = true;
                formArrayCheck = this.formRewardPersonInside;
                isValidFormRewardPersonInside = false
                count = 0
              }else{
                if(data.value['rewardTitleName'] == 'Khen thưởng bằng hiện vật' && data.value['rewardCategory'] == 2){
                  if(data.value['receiveBonusOrgId'] == null || data.value['receiveBonusOrgId'] == ''){
                    this.activeIndex = 0;
                    this.app.warningMessage('formRewardProposePersonInside.receiveBonusOrgId');
                    isInvalidForm = true;
                    formArrayCheck = this.formRewardPersonInside;
                    isValidFormRewardPersonInside = false
                    count = 0
                  }
                  else {
                    count++
                  }
                }else {
                  count++
                }
              }
              if(count === this.formRewardPersonInside.length){
                count = 0
                isValidFormRewardPersonInside = true
                // this.app.confirmMessage(null, () => { // on accepted
                //   const rewardProposeDetailForm = _.cloneDeep(lstRewardProposeDetail);
                //   rewardProposeDetailForm.forEach(item => {
                //     delete item['rewardTitleIdList'];
                //   });
                //   rewardForm['lstRewardProposeDetail'] = rewardProposeDetailForm;
                //   this.rewardProposeService.saveAll(rewardForm).subscribe(res => {
                //     if (this.rewardProposeService.requestIsSuccess(res) && res.data && res.data.rewardProposeId) {
                //       if(this.isClickSignDocument) {
                //         // thực hiện gen file phụ lục trình ký
                //         this.rewardProposeService.actionSignVoffice(res.data.rewardProposeId).subscribe(resp => {
                //           if(this.rewardProposeService.requestIsSuccess(resp)) {
                //             const signDocumentId = resp.data;
                //             this.router.navigateByUrl('voffice-signing/reward-propose/' + signDocumentId, { state: {backUrl:'reward/reward-propose'} });
                //           }
                //         })
                //       } else {
                //         this.goView(res.data.rewardProposeId);
                //       }
                //     }
                //   });
                // }, () => {
                //   // on rejected
                //   this.isClickSignDocument = false;
                // });
              }
            })
          }
          console.log("isValidFormRewardPersonInside",isValidFormRewardPersonInside)
          console.log("isValidFormRewardGroupInside",isValidFormRewardGroupInside)
          isValid = isValidFormRewardPersonInside && isValidFormRewardGroupInside
          if(isValid){
            this.app.confirmMessage(null, () => { // on accepted
              const rewardProposeDetailForm = _.cloneDeep(lstRewardProposeDetail);
              rewardProposeDetailForm.forEach(item => {
                delete item['rewardTitleIdList'];
              });
              rewardForm['lstRewardProposeDetail'] = rewardProposeDetailForm;
              this.rewardProposeService.saveAll(rewardForm).subscribe(res => {
                if (this.rewardProposeService.requestIsSuccess(res) && res.data && res.data.rewardProposeId) {
                  if(this.isClickSignDocument) {
                    // thực hiện gen file phụ lục trình ký
                    this.rewardProposeService.actionSignVoffice(res.data.rewardProposeId).subscribe(resp => {
                      if(this.rewardProposeService.requestIsSuccess(resp)) {
                        const signDocumentId = resp.data;
                        this.router.navigateByUrl('voffice-signing/reward-propose/' + signDocumentId, { state: {backUrl:'reward/reward-propose'} });
                      }
                    })
                  } else {
                    this.goView(res.data.rewardProposeId);
                  }
                }
              });
            }, () => {
              // on rejected
              this.isClickSignDocument = false;
            });
          }
        }

      } else {
        this.app.warningMessage("inValidAllTab");
        return;
      }
    }
    else {
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

  public positionChange() {
    const isAgreeToApprove = this.formSave.controls['statusApprove'].value;
    if (isAgreeToApprove == 1) {
      this.isHideDescription = true;
      this.formSave.controls['note'].setValue(null);
    } else if (isAgreeToApprove == 2) {
      this.isHideDescription = false;
      this.formSave.controls['note'].setValue(null);
    }
  }
  public openFormImport() {
    const rewardType = this.formSave.controls['rewardType'].value;
    if (!rewardType) {
      this.app.warningMessage('pleaseRewaedProposefield');
      return;
    }
    const modalRef = this.modalService.open(RewardSuggestImportManageComponent, DEFAULT_MODAL_OPTIONS);
    const data = { rewardType: rewardType, branch: this.branch, rewardObjectType: 2, option: 1 };
    modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      this.dataImportGroupInsangnn.next(result.data.GROUP_IN_sangnn);
      this.dataImportStaffInsangnn.next(result.data.STAFF_IN_sangnn);
      this.dataImportGroupOutsangnn.next(result.data.GROUP_OUT_sangnn);
      this.dataImportStaffOutsangnn.next(result.data.STAFF_OUT_sangnn);
      this.dataRewardCost.next(result.data.REWARD_COST);
    });
  }
  public onChangeRequiredSign(event) {
    this.formSave.value.isRequiredSign = event.target['checked'];
  }
  public onChangeSynthetic(event) {
    this.formRewardDecide = [];
    this.resetFormDecide.next()
    // this.onRewardTypeChange();
    this.formSave.value.isSynthetic = event.target['checked'];
    this.checkRenderData()
  }
  public checkRenderData(){
    if(this.isInsert && this.formSave.value.isSynthetic && this.f['proposeOrgId'].valid && this.f['rewardType'].valid && this.f['proposeYear'].valid && this.f['periodType'].valid) {
      this.isDisable = true;
      const formSearch = {
        proposeOrgId: null,
        rewardProposeId: this.formSave.value.rewardProposeId ? this.formSave.value['rewardProposeId'] : null,
        rewardType: this.f['rewardType'].value,
        approvalOrgId: this.f['proposeOrgId'].value,
        proposeYear: this.f['proposeYear'].value,
        periodType: this.f['periodType'].value,
        status: APP_CONSTANTS.REWARD_PROPOSE_STATUS2[5].id,
        isSuggest: 1,
        isSuggestScreen: 1,
        fullPage: 1,
      };
      this.rewardProposeService.getDatatablesConfirmed(formSearch).subscribe((res) => {
        if (!res.data) {
          return;
        }
        this.formRewardDecideTable.next(res.data);
        const listId = res.data.map((item) => {
          return item.rewardProposeId
        })
        this.formRewardDecide = listId;
        this.renderData()
      })
    } else {
      this.isDisable = false
    }
  }
  addRewardDecide() {
    const isValidProposeOrgId = CommonUtils.isValidForm(this.f['proposeOrgId'])
    const rewardType = CommonUtils.isValidForm(this.f['rewardType'])
    // const approvalOrgId = CommonUtils.isValidForm(this.f['approvalOrgId'])
    const proposeYear = CommonUtils.isValidForm(this.f['proposeYear'])
    const periodType = CommonUtils.isValidForm(this.f['periodType'])
    if (isValidProposeOrgId && rewardType && proposeYear && periodType) {
      const modalRef = this.modalService.open(RewardDecideListComponent, {windowClass:'dialog-xl slide-in-right', backdrop: 'static'});
      const formSearch = {
        proposeOrgId: null,
        rewardProposeId: this.formSave.value.rewardProposeId ? this.formSave.value['rewardProposeId'] : null,
        rewardType: this.f['rewardType'].value,
        approvalOrgId: this.f['proposeOrgId'].value,
        proposeYear: this.f['proposeYear'].value,
        periodType: this.f['periodType'].value,
        status: APP_CONSTANTS.REWARD_PROPOSE_STATUS2[5].id,
        isSuggest: 1,
        isSuggestScreen: 1,
        ignoreList: this.formRewardDecide.length > 0 ? this.formRewardDecide : ""
      };
      const data = { formSearch: formSearch};
      modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
      modalRef.result.then((result) => {
        if (!result) {
          return;
        }
        this.formRewardDecideTable.next(result);
        const listId = result.map((item) => {
          return item.rewardProposeId
        })
        this.formRewardDecide = this.formRewardDecide && this.formRewardDecide.length > 0 ? this.formRewardDecide.concat(listId) : listId;
        this.renderData()
      });
    } else {
      return
    }
  }
  signDocument(option) {
    this.isClickSignDocument = true
    this.processSaveOrUpdate(option)
  }
  sendApprove(option) {
    this.defaultStatus = PROPOSE_STATUS.CHO_XET_CHON;
    this.processSaveOrUpdate(option)
  }
  renderDataDecide(data) {
    this.formRewardDecide = data.map((item) => {
      return item.rewardProposeId
    })
    this.renderData()
    this.isDisable = this.formRewardDecide.length > 0 ? true : false
  }
  public renderData() {
    const formData = {
      rewardProposeIdList : this.formRewardDecide,
      rewardType: this.f['rewardType'].value,
      isSuggest: 1
    }
    this.rewardProposeService.getDatatablesByListSignOrg(formData).subscribe((data) => {
      this.onRewardTypeChange();
      this.setData.next(data);
    })
  }

  /**
   *
   * @param event
   */
  onChangeOrgApproval(event) {
    if (event.organizationId > 0) {
      this.formSave.controls['signOrgId'].setValue(event.organizationId);
      this.signOrgElement.onChangeOrgId();
    }
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
