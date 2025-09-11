import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS, FROM_SOURCE, LARGE_MODAL_OPTIONS, LOAI_KHEN_THUONG, LOAI_KHEN_THUONG_CHI_TIET, MEDIUM_MODAL_OPTIONS, PROPOSE_SIGN_STATUS, REWARD_PROPOSE_SIGN_STATUS, REWARD_PROPOSE_STATUS, SAP_STATEMENT_STATUS } from '@app/core';
import { FileControl } from '@app/core/models/file.control';
import { RewardProposeSignService } from '@app/core/services/reward-propose-sign/reward-propose-sign.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { OrgSelectorComponent } from '@app/shared/components/org-selector/org-selector.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { RewardSuggestImportManageComponent } from '../../reward-propose/reward-propose-form/file-import-reward-management/file-import-reward-management.component';
import { FileImportDecisionRewardComponent } from './file-import-decision-reward/file-import-decision-reward.component';
import * as moment from 'moment';
import { BaseControl } from '@app/core/models/base.control';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';
import { ReportPreviewCertificateComponent } from '../../reward-general-preview/report-preview-certificate';
import _ from 'lodash';
import { HelperService } from '@app/shared/services/helper.service';
import { RewardProcessLoadModalComponent } from '../../reward-propose/reward-process-load-modal/reward-process-load-modal.component';
import { DialogService } from "primeng/api";
import {
  RewardProposeSignErrorComponent
} from "@app/modules/reward/reward-propose-sign/reward-propose-sign-error/reward-propose-sign-error";
import {
  OrganizationService
} from '@app/core';
import { SelectBudgetDateComponent } from '../select-budget-date/select-budget-date.component';
import { SelectBudgetDateAndFundCategoryComponent } from '@app/modules/reward/reward-propose-sign/select-budget-date-and-fun-category/select-budget-date-and-funcategory.component';
import {UrlConfig} from "@env/environment";

@Component({
  selector: 'decided-sign-outside-form',
  templateUrl: './decided-sign-outside-form.component.html',
  styleUrls: ['./decided-sign-outside-form.component.css']
})
export class DecidedSignOutsideFormComponent extends BaseComponent implements OnInit {
  @ViewChild('signOrgElement') signOrgElement: OrgSelectorComponent;
  rootId = APP_CONSTANTS.ORG_ROOT_ID
  pageFocus: Subject<any> = new Subject<any>();
  resetFormArray: Subject<any> = new Subject<any>();
  canTransferPayment: boolean;
  canGenerateFile: boolean;
  canTransferBTHTT: boolean;
  rejectStatement: boolean;
  completeStatement: boolean;
  listReimbursement: any;
  selectedRows: [];
  URL: any;
  setData: Subject<any> = new Subject<any>();
  processingData: Subject<any> = new Subject<any>();
  importGroupInsangnn: Subject<any> = new Subject<any>();
  importStaffInsangnn: Subject<any> = new Subject<any>();
  importGroupOutsangnn: Subject<any> = new Subject<any>();
  importStaffOutsangnn: Subject<any> = new Subject<any>();
  dataRewardCost: Subject<any> = new Subject<any>();
  saveData: Subject<boolean> = new Subject<boolean>();
  resetFormSubject: Subject<number> = new Subject<number>();
  loadDataIntoForm: Subject<any> = new Subject<any>();
  forwardLoadOrgazation: Subject<any> = new Subject<any>();
  formSave: FormGroup;
  isView: boolean = false;
  isEdit: boolean = false;
  isInsert: boolean = false;
  rewardTypeList: any;  
  promulgateBy: any;
  listYear: any;
  showReimbusment: Boolean;
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
  rewardType: number;
  rewardProposeSignId: any
  resultListDetail: any = this.resultList;
  mapRewardTypeBranch = { 1: 0, 2: 3, 3: 1, 4: 2, 5: 5 };
  branch: number;
  signOrgId: any;
  totalAmountOfMoney: any;
  lstRewardType = APP_CONSTANTS.REWARD_GENERAL_TYPE_LIST;
  lstPeriodType = APP_CONSTANTS.REWARD_PERIOD_TYPE_LIST;
  lstfunCategory = APP_CONSTANTS.REWARD_FUN_CATEGORY_LIST;  
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  listStatus: any;
  listSAPStatementStatus: any;
  hasRewardPositionEmployee: boolean = false;
  rewardTypeListByUserToInsert: any;
  vfsStatementNo: any;
  formConfig = {
    name: [null, [ValidationService.required, ValidationService.maxLength(200)]],
    signOrgId: [null, [ValidationService.required]],
    rewardProposeSignId: [null],
    status: [null],
    sapStatementStatus: [null],
    approvalOrgId: [null, [ValidationService.required]],
    rewardType: [null, [ValidationService.required]],
    periodType: [null, [ValidationService.required]],
    proposeYear: [null, [ValidationService.required]],
    decisionNumber: [null, [ValidationService.required]],
    promulgateDate: [null, [ValidationService.required]],
    promulgateBy: [null, [ValidationService.required]],
    fromSource: [null],
    closingDate: [null],
    budgetDate: [null,[ValidationService.required]],
    funCategory: ['F03',[ValidationService.required]],    
    createdDate: [null],
    createdBy: [null],
    paymentStatus: [0],
    vfsStatementNo: [''],
    isAuthority: [''],
    totalAmountOfMoney: [null],
  };
  status: any;
  sapStatementStatus: any;
  autoPayOrder: any;
  activeIndex: number;
  numIndex = 1;
  firstRowIndex = 0;
  pageSize = 10;
  offset: any = 0;
  limit: any = 50;
  modalProcessLoad: NgbModalRef;
  constructor(
    private rewardProposeSignService: RewardProposeSignService,
    public actr: ActivatedRoute,
    private app: AppComponent,
    private router: Router,
    private modalService: NgbModal,
    private rewardProposeService: RewardProposeService,
    public helperService: HelperService,
    public dialogService: DialogService,
    private orgService: OrganizationService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.rewardPropose"));
    this.buildForms({});
    this.URL = UrlConfig.clientAddress
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 3) {
      this.isView = subPaths[4] === 'view-decision';
      this.isEdit = subPaths[4] === 'edit-decision';
      this.isInsert = subPaths[4] === 'add-decided';
      if (!this.isInsert) {
        this.helperService.setWaitDisplayLoading(true);
        this.modalProcessLoad = this.modalService.open(RewardProcessLoadModalComponent, MEDIUM_MODAL_OPTIONS);
        this.rewardProposeSignId = subPaths[5];
        this.setDataTopAllForms();
      }
      this.getYearList();
      this.listStatus = APP_CONSTANTS.PROPOSE_SIGN_LIST_STATUS;
      this.listSAPStatementStatus = APP_CONSTANTS.SAP_STATEMENT_STATUS;
    }
  }

  ngOnInit() {
    this.buildForms({});
    this.rewardProposeService.getRewardTypeList().subscribe(res => {
      this.rewardTypeListByUserToInsert = this.lstRewardType.filter((item) => {
        return res.includes(item.id)
      })
    })
    this.processingData.subscribe(async info => {
      this.modalProcessLoad.componentInstance.updateView(info);
    })
  }

  get f() {
    return this.formSave.controls;
  }

  /**
 * buildForm
 */
  private buildForms(data?: any): void {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, [])
    const fileAttachment = new FileControl(null, ValidationService.required);
    const fileAppendix = new FileControl(null);
    if (data && data.fileAttachment) {
      if (data.fileAttachment.attachedFiles) {
        fileAttachment.setFileAttachment(data.fileAttachment.attachedFiles);
      }
      if (data.fileAttachment.fileAppendix) {
        fileAppendix.setFileAttachment(data.fileAttachment.fileAppendix);
      }
    }
    this.formSave.addControl('attachedFiles', fileAttachment);
    this.formSave.addControl('fileAppendix', fileAppendix);
  }

  public goBack() {
    this.router.navigate(['/reward/reward-propose-sign']);
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


  public onOrganizationChange() {
    const signOgrId = this.formSave.controls['signOrgId'].value;
    if (!CommonUtils.isNullOrEmpty(signOgrId)) {
      const form = { signOrgId: signOgrId }
      this.rewardProposeSignService.processSearchDetail(form).subscribe(res => {
        this.resultListDetail = res.data;
      });
    } else {
      this.resultListDetail = [];
    }
  }

  public processSaveOrUpdate(option) {
    let formArrayCheck;
    let isInvalidForm = false;
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    if (!CommonUtils.isValidForm(this.formRewardGroupInside)) {
      this.activeIndex = 0;
      this.app.warningMessage('formRewardProposeGroupInside');
      isInvalidForm = true;
      formArrayCheck = this.formRewardGroupInside;
    }
    if (!CommonUtils.isValidForm(this.formRewardGroupOutside)) {
      this.activeIndex = 2;
      this.app.warningMessage('formRewardProposeGroupOutside');
      isInvalidForm = true;
      formArrayCheck = this.formRewardGroupOutside;
    }
    if (!CommonUtils.isValidForm(this.formRewardPersonOutside)) {
      this.activeIndex = 3;
      this.app.warningMessage('formRewardProposePersonOutside');
      isInvalidForm = true;
      formArrayCheck = this.formRewardPersonOutside;
    }
    if (!CommonUtils.isValidForm(this.formRewardPersonInside)) {
      this.activeIndex = 1;
      this.app.warningMessage('formRewardProposePersonInside');
      isInvalidForm = true;
      formArrayCheck = this.formRewardPersonInside;
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
      this.pageFocus.next({ stt: stt, activeIndex: this.activeIndex });
      return;
    }
    console.log("this.formRewardGroupInside",this.formRewardGroupInside)
    console.log("this.formRewardPersonInside",this.formRewardPersonInside)
    let flagIsValid = true;
    const saveData = this.formSave.value;
    const lstRewardProposeSignObjectForm = [];
    const rewardForm = {};
    rewardForm['rewardProposeSignId'] = saveData.rewardProposeSignId;
    rewardForm['name'] = saveData.name;
    rewardForm['proposeOrgId'] = saveData.proposeOrgId;
    rewardForm['rewardType'] = saveData.rewardType;
    rewardForm['periodType'] = saveData.periodType;
    rewardForm['approvalOrgId'] = saveData.approvalOrgId;
    rewardForm['signOrgId'] = saveData.signOrgId;
    rewardForm['proposeYear'] = saveData.proposeYear;
    rewardForm['isOutside'] = 1;
    rewardForm['isAuthority'] = saveData.isAuthority;
    rewardForm['decisionNumber'] = saveData.decisionNumber;
    rewardForm['promulgateDate'] = saveData.promulgateDate;
    rewardForm['closingDate'] = saveData.closingDate;
    rewardForm['budgetDate'] = saveData.budgetDate;
    rewardForm['promulgateBy'] = this.promulgateBy;
    rewardForm['createdBy'] = saveData.createdBy;
    rewardForm['createdDate'] = saveData.createdDate;
    rewardForm['funCategory'] = saveData.funCategory;
    
    if (option == 1) {
      rewardForm['status'] = PROPOSE_SIGN_STATUS.DU_THAO;
    } else {
      rewardForm['status'] = PROPOSE_SIGN_STATUS.DA_KY_DUYET;
    }
    if(this.status == 5 || this.status == 3){
      rewardForm['status'] = this.status;
    }
    rewardForm['attachedFiles'] = saveData.attachedFiles;
    rewardForm['fileAppendix'] = saveData.fileAppendix;
    rewardForm['fromSource'] = FROM_SOURCE.QD_NGOAI;
    // tap the trong sangnn
    if (CommonUtils.isValidForm(this.formRewardGroupInside) && this.formRewardGroupInside != null && this.formRewardGroupInside.length > 0) {
      // can bo, cong nhan vien
      if (CommonUtils.isValidForm(this.formRewardPersonInside)) {
        this.formRewardPersonInside.controls.forEach(data => {
          data.value['rewardProposeDetailType'] = LOAI_KHEN_THUONG_CHI_TIET.KHEN_THUONG_CBNV;
          if (data.value.employeeId != null) {
            data.value['objectIdsangnnMember'] = data.value.employeeId;
          }
          lstRewardProposeSignObjectForm.push(data.value);
        });
      } else {
        return;
      }
      // tap the ngoai sangnn
      if (CommonUtils.isValidForm(this.formRewardGroupOutside)) {
        this.formRewardGroupOutside.controls.forEach(data => {
          data.value['rewardProposeDetailType'] = LOAI_KHEN_THUONG_CHI_TIET.TAP_THE_NGOAI_VT;
          lstRewardProposeSignObjectForm.push(data.value);
        });
      } else {
        return;
      }
      // ca nhan ngoai sangnn
      if (CommonUtils.isValidForm(this.formRewardPersonOutside)) {
        this.formRewardPersonOutside.controls.forEach(data => {
          data.value['rewardProposeDetailType'] = LOAI_KHEN_THUONG_CHI_TIET.CA_NHAN_NGOAI_VT;
          lstRewardProposeSignObjectForm.push(data.value);
        });
      } else {
        return;
      }
      // chi phí
      if (CommonUtils.isValidForm(this.formRewardCost)) {
        this.formRewardCost.controls.forEach(data => {
          data.value['rewardProposeDetailType'] = LOAI_KHEN_THUONG_CHI_TIET.CHI_PHI;
          lstRewardProposeSignObjectForm.push(data.value);
        });
      } else {
        return;
      }

      var count = 0;
      if(this.formRewardPersonInside.length > 0) {
        // can bo, cong nhan vien
        if (CommonUtils.isValidForm(this.formRewardPersonInside)) {
          this.formRewardPersonInside.controls.forEach(data => {
            data.value['rewardProposeDetailType'] = LOAI_KHEN_THUONG_CHI_TIET.KHEN_THUONG_CBNV;
            if (data.value.employeeId != null) {
              data.value['objectIdsangnnMember'] = data.value.employeeId;
            }
            if (saveData.rewardType == 5  && data.value['rewardTitleName'] == 'Khen thưởng bằng hiện vật' && data.value['rewardCategory'] =='2' && (data.value['receiveBonusOrgId'] === null || data.value['receiveBonusOrgId'] == '')) {
              this.activeIndex = 0;
              this.app.warningMessage('formRewardProposePersonInside.receiveBonusOrgId');
              isInvalidForm = true;
              formArrayCheck = this.formRewardPersonInside;
              flagIsValid = false;
            }
          });
        } else {
          return;
        }
      }
      if(flagIsValid) {
        this.formRewardGroupInside.controls.forEach(data => {
          if (data.value['organizationId'] != null) {
            this.orgService.findVfsAccountingTypeById(data.value['organizationId']).subscribe(res => {
              count = count + 1;
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
              /*if (saveData.rewardType != 5 && (data.value['representativeId'] === null || data.value['representativeId'] === '')) {
                this.activeIndex = 0;
                this.app.warningMessage('formRewardProposeGroupInside.representativeId');
                isInvalidForm = true;
                formArrayCheck = this.formRewardGroupInside;
                count = 0
              }*/
              if (saveData.rewardType == 5 && res.data.vfsAccountingType !== "Phụ thuộc" && res.data.vfsAccountingType !== "Độc lập" && (data.value['representativeId'] === null || data.value['representativeId'] === '') && data.value['rewardTitleName'] != 'Khen thưởng bằng hiện vật') {
                this.activeIndex = 0;
                this.app.warningMessage('formRewardProposeGroupInside.representativeId');
                isInvalidForm = true;
                formArrayCheck = this.formRewardGroupInside;
                flagIsValid = false;
              }
              if (saveData.rewardType == 5  && data.value['rewardTitleName'] == 'Khen thưởng bằng hiện vật' && data.value['rewardCategory'] =='2' && (data.value['receiveBonusOrgId'] === null || data.value['receiveBonusOrgId'] == '')) {
                this.activeIndex = 0;
                this.app.warningMessage('formRewardProposeGroupInside.receiveBonusOrgId');
                isInvalidForm = true;
                formArrayCheck = this.formRewardGroupInside;
                flagIsValid = false;
              }
              lstRewardProposeSignObjectForm.push(data.value);
              if (count === this.formRewardGroupInside.length) {
                if (!flagIsValid) {
                  this.app.warningMessage('formRewardProposeGroupInside');
                  flagIsValid = true;
                  return;
                } else {
                  if (!CommonUtils.isNullOrEmpty(lstRewardProposeSignObjectForm)) {
                    this.app.confirmMessage(null, () => { // on accepted
                      rewardForm['lstRewardProposeSignObjectForm'] = lstRewardProposeSignObjectForm;
                      this.rewardProposeSignService.saveOrUpdateFormFile(rewardForm).subscribe(res => {
                        if (this.rewardProposeSignService.requestIsSuccess(res)) {
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
              }

            });
          }
          else {
            count = count + 1;
            if (saveData.rewardType != 5 && (data.value['representativeId'] === null || data.value['representativeId'] === '') && data.value['rewardTitleName'] != 'Khen thưởng bằng hiện vật') {
              this.activeIndex = 0;
              this.app.warningMessage('formRewardProposeGroupInside.representativeId');
              isInvalidForm = true;
              formArrayCheck = this.formRewardGroupInside;
              flagIsValid = false;
            }
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

            if ((data.value['rewardTitleName'] != 'Khen thưởng bằng hiện vật' && data.value['rewardCategory'] != 2
                    || data.value['rewardTitleName'] != 'Khen thưởng bằng hiện vật' && data.value['rewardCategory'] == 2)
                && ((data.value['representativeId'] == null || data.value['representativeId'] == ''))) {

            } else {
              if (data.value['rewardTitleName'] == 'Khen thưởng bằng hiện vật' && data.value['rewardCategory'] == 2) {
                if (data.value['receiveBonusOrgId'] == null || data.value['receiveBonusOrgId'] == '') {
                  flagIsValid = false;
                }
              }
            }
            lstRewardProposeSignObjectForm.push(data.value);
            if (count === this.formRewardGroupInside.length) {
              if (!flagIsValid) {
                this.app.warningMessage('formRewardProposeGroupInside');
                flagIsValid = true;
                return;
              } else {
                if (!CommonUtils.isNullOrEmpty(lstRewardProposeSignObjectForm)) {
                  this.app.confirmMessage(null, () => { // on accepted
                    rewardForm['lstRewardProposeSignObjectForm'] = lstRewardProposeSignObjectForm;
                    this.rewardProposeSignService.saveOrUpdateFormFile(rewardForm).subscribe(res => {
                      if (this.rewardProposeSignService.requestIsSuccess(res)) {
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
            }

          }
        });
      }
    } else {
      // can bo, cong nhan vien
      if (CommonUtils.isValidForm(this.formRewardPersonInside)) {
        this.formRewardPersonInside.controls.forEach(data => {
          data.value['rewardProposeDetailType'] = LOAI_KHEN_THUONG_CHI_TIET.KHEN_THUONG_CBNV;
          if (data.value.employeeId != null) {
            data.value['objectIdsangnnMember'] = data.value.employeeId;
          }
          if (saveData.rewardType == 5  && data.value['rewardTitleName'] == 'Khen thưởng bằng hiện vật' && data.value['rewardCategory'] =='2' && (data.value['receiveBonusOrgId'] === null || data.value['receiveBonusOrgId'] == '')) {
            this.activeIndex = 0;
            this.app.warningMessage('formRewardProposePersonInside.receiveBonusOrgId');
            isInvalidForm = true;
            formArrayCheck = this.formRewardPersonInside;
            flagIsValid = false;
          }
          lstRewardProposeSignObjectForm.push(data.value);
        });
        if(!flagIsValid) {
          flagIsValid = true;
          return;
        }
      } else {
        return;
      }
      // tap the ngoai sangnn
      if (CommonUtils.isValidForm(this.formRewardGroupOutside)) {
        this.formRewardGroupOutside.controls.forEach(data => {
          data.value['rewardProposeDetailType'] = LOAI_KHEN_THUONG_CHI_TIET.TAP_THE_NGOAI_VT;
          lstRewardProposeSignObjectForm.push(data.value);
        });
      } else {
        return;
      }
      // ca nhan ngoai sangnn
      if (CommonUtils.isValidForm(this.formRewardPersonOutside)) {
        this.formRewardPersonOutside.controls.forEach(data => {
          data.value['rewardProposeDetailType'] = LOAI_KHEN_THUONG_CHI_TIET.CA_NHAN_NGOAI_VT;
          lstRewardProposeSignObjectForm.push(data.value);
        });
      } else {
        return;
      }
      // chi phí
      if (CommonUtils.isValidForm(this.formRewardCost)) {
        this.formRewardCost.controls.forEach(data => {
          data.value['rewardProposeDetailType'] = LOAI_KHEN_THUONG_CHI_TIET.CHI_PHI;
          lstRewardProposeSignObjectForm.push(data.value);
        });
      } else {
        return;
      }

      if (!CommonUtils.isNullOrEmpty(lstRewardProposeSignObjectForm)) {
        this.app.confirmMessage(null, () => { // on accepted
          rewardForm['lstRewardProposeSignObjectForm'] = lstRewardProposeSignObjectForm;
          this.rewardProposeSignService.saveOrUpdateFormFile(rewardForm).subscribe(res => {
            if (this.rewardProposeSignService.requestIsSuccess(res)) {
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

  }

  public onRewardTypeChange() {
    const rewardType = this.formSave.controls['rewardType'].value;
    if(rewardType === 1){
      this.lstfunCategory = APP_CONSTANTS.REWARD_FUN_CATEGORY_LIST_OTHER;
      this.formSave.controls['funCategory'].setValue('F72')
    }else{
      this.lstfunCategory = APP_CONSTANTS.REWARD_FUN_CATEGORY_LIST;
      if(!this.formSave.controls['funCategory'].value){
        this.formSave.controls['funCategory'].setValue('F03')
      }
    }
    this.branch = this.mapRewardTypeBranch[rewardType];
    const data = { rewardType: rewardType, branch: this.branch , status:this.status};
    this.resetFormArray.next(data);
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
    const closingDate = this.formSave.controls['closingDate'].value;
    if (!rewardType && !closingDate) {
      this.app.warningMessage('pleaseRewaedProposefieldAndClosingDate');
      return;
    }
    if (!rewardType) {
      this.app.warningMessage('pleaseRewaedProposefield');
      return;
    }
    if (!closingDate) {
      this.app.warningMessage('pleaseClosingDate');
      return;
    }
    const modalRef = this.modalService.open(FileImportDecisionRewardComponent, DEFAULT_MODAL_OPTIONS);
    const dateString = this.formSave.value.closingDate ? moment(new Date(this.formSave.value.closingDate)).format('DD/MM/YYYY') : null;
    const data = { rewardType: rewardType, branch: this.branch, rewardObjectType: 2, option: 1, closingDate: dateString };
    modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      this.modalProcessLoad = this.modalService.open(RewardProcessLoadModalComponent, MEDIUM_MODAL_OPTIONS);
      setTimeout(() => {
        this.importGroupInsangnn.next(result.data.GROUP_IN_sangnn);
        this.importStaffInsangnn.next(result.data.STAFF_IN_sangnn);
        this.importGroupOutsangnn.next(result.data.GROUP_OUT_sangnn);
        this.importStaffOutsangnn.next(result.data.STAFF_OUT_sangnn);
      }, 300);
    });
  }
  public setDataTopAllForms() {
    this.rewardProposeSignService.findOne(this.rewardProposeSignId)
      .subscribe((res) => {
        if(!res.data.funCategory){
          res.data.funCategory = 'F03';
        }
        this.status = res.data.status;
        if(res.data.status != null && (res.data.status == 3|| res.data.status == 5)){
          this.isView = true;
          this.isEdit = false;
        }
        this.sapStatementStatus = res.data.sapStatementStatus;
        const lstRewardProposeSignObject = res.data.lstRewardProposeSignObject;
        if (lstRewardProposeSignObject && lstRewardProposeSignObject.length) {
          this.hasRewardPositionEmployee = lstRewardProposeSignObject.some(item => item.rewardProposeDetailType == 2)
          if (this.hasRewardPositionEmployee) {
            this.formConfig['closingDate'] = [null, [ValidationService.required]];
          }
        }
        if (res.data.vfsStatementNo) {
          this.vfsStatementNo = res.data.vfsStatementNo
        }
        this.listReimbursement = res.data.reimbursementList || [];
        this.canTransferBTHTT = res.data.vfsStatementNo != null && res.data.status == 5 && res.data.sapStatementStatus != "99" ? true : false;
        this.canGenerateFile = res.data.isGenerateFile != 1 && (res.data.status == 3 || res.data.status == 5);
        this.canTransferPayment = (res.data.fromSource != null && res.data.fromSource == 2 ) ? (res.data.status == 3 ? true : false ) : ((res.data.vfsStatementNo == null && res.data.sapStatementStatus != "06" && res.data.sapStatementStatus != "07")   ? true : false);
        if (res.data.reimbursementList != null) {
          this.showReimbusment = true;
        }
        if (res.data.stateVfsReimbusment != null && ["03- Submitted to Accounting", "04- HR approved", "06- Accounting approved", "08- Submitted to V-office", "09- V-office approved"].includes(res.data.stateVfsReimbusment)) {
          this.canTransferPayment = false;
          this.canTransferBTHTT = false;
        }
        if ((res.data.vfsStatementNo != null && res.data.status == 4) || (res.data.isDeleteVfsReimbusment == null && res.data.status == 5)) {
          this.completeStatement = true;
        }
        if (res.data.vfsReimbusmentId != null) {
          if (res.data.stateVfsReimbusment != null && "09- V-office approved" == res.data.stateVfsReimbusment) {
            this.completeStatement = true;
          } else {
            this.completeStatement = false;
          }
        }

        if (res.data.vfsStatementNo != null && (res.data.status == 2 || res.data.status == 4) && res.data.sapStatementStatus != "06" && res.data.sapStatementStatus != "07") {
          this.rejectStatement = true;
        }
        this.totalAmountOfMoney = res.data.totalAmountOfMoney;
        this.buildForms(res.data);
        this.signOrgId = res.data.signOrgId;
        this.onRewardTypeChange();
        this.promulgateBy = res.data.employeeCode;
        this.setData.next(res);
        this.helperService.setWaitDisplayLoading(false);
      });
  }

  onChangeClosingDate() {
    this.forwardLoadOrgazation.next();
  }

  public genData(event?: any) {
    this.promulgateBy = event.codeField
  }

  onChangeRewardEmployeePosition(data) {
    this.hasRewardPositionEmployee = data && data.value && data.value.length;
    const { closingDate } = this.formSave.value;
    this.formSave.removeControl('closingDate');
    const newClosingDateControl = new BaseControl();
    if (this.hasRewardPositionEmployee) {
      newClosingDateControl.setValidators(ValidationService.required);
    }
    newClosingDateControl.setValue(closingDate);
    this.formSave.addControl('closingDate', newClosingDateControl);
  }

  public transferBTHTT(item) {
    const modalRef = this.modalService.open(SelectBudgetDateComponent, {windowClass:'dialog-xl slide-in-right', backdrop: 'static'});
    const formSearch = {      
      rewardProposeSignId: item.rewardProposeSignId   ,
      budgetDate: item.budgetDate           
    };
    const data = { formSearch: formSearch};
    if (data) {
      modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      
    });
    // this.app.confirmMessage("app.rewardBTHTT.confirmHasNotPermission", () => { // accept
    //   this.rewardProposeSignService.processTransferBTHTT(item.rewardProposeSignId)
    //     .subscribe(res => {
    //       if (this.rewardProposeSignService.requestIsSuccess(res)) {
    //         this.app.successMessage('reimbursement.success');
    //         location.reload();
    //       }
    //       else {
    //         const ref = this.dialogService.open(RewardProposeSignErrorComponent, {
    //           header: 'Thông báo lỗi',
    //           width: '50%',
    //           baseZIndex: 2000,
    //           contentStyle: { "padding": "0" },
    //           data: {
    //             errorSAP: res.data
    //           }
    //         });
    //         // this.app.errorMessage('reimbursement.error', res.data);
    //       }
    //     })
    // }, () => {
    //   // rejected
    // })
  }
  // chuyển thanh toán
  public transferPayment(item) {
    const modalRef = this.modalService.open(SelectBudgetDateAndFundCategoryComponent, {windowClass:'dialog-xl slide-in-right', backdrop: 'static'});
      const formSearch = {
        proposeOrgId: null,
        rewardProposeSignId: item.rewardProposeSignId ,
        funCategory: item.funCategory ,
        budgetDate: item.budgetDate,
        rewardType: item.rewardType
      };
      const data = { formSearch: formSearch};
      if (data) {
        modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
      }
      modalRef.result.then((result) => {
        if (!result) {
          return;
        }
        window.location.reload();
      });
   

    // this.app.confirmMessage("app.rewardPayment.confirmHasNotPermission", () => { // accept
    //   this.rewardProposeSignService.processTransferPayment(item.rewardProposeSignId)
    //     .subscribe(res => {
    //       if (this.rewardProposeSignService.requestIsSuccess(res)) {
    //         this.app.successMessage('createReimbursement.success');
    //         this.router.navigate(['/reward/reward-propose-sign/decided-sign-outside/view-decision/', item.rewardProposeSignId]);
    //       }
    //       else {
    //         const ref = this.dialogService.open(RewardProposeSignErrorComponent, {
    //           header: 'Thông báo lỗi',
    //           width: '50%',
    //           baseZIndex: 2000,
    //           contentStyle: { "padding": "0" },
    //           data: {
    //             errorSAP: res.data
    //           }
    //         });
    //         // this.app.errorMessage('reimbursement.error', res.data);
    //       }
    //     })
    // }, () => {
    //   // rejected
    // })


    
  }

  public doRejectStatement(item) {
    this.app.confirmMessage("app.rewardBTHTT.confirmRejectStatement", () => { // accept
      this.rewardProposeSignService.processRejectStatement(item.rewardProposeSignId)
        .subscribe(res => {
          if (this.rewardProposeSignService.requestIsSuccess(res)) {
            this.app.successMessage('rejectstatement.success');
            this.router.navigate(['/reward/reward-propose-sign']);
          }
          else {
            const ref = this.dialogService.open(RewardProposeSignErrorComponent, {
              header: 'Thông báo lỗi',
              width: '50%',
              baseZIndex: 2000,
              contentStyle: { "padding": "0" },
              data: {
                errorSAP: res.data
              }
            });
            // this.app.errorMessage('reimbursement.error', res.data);
          }
        })
    }, () => {
      // rejected
    })
  }

  public docompleteStatement(item) {
    this.app.confirmMessage("app.rewardBTHTT.confirmCompleteStatement", () => { // accept
      this.rewardProposeSignService.completeStatement(item.rewardProposeSignId)
        .subscribe(res => {
          if (this.rewardProposeSignService.requestIsSuccess(res)) {
            this.app.successMessage('completeStatement.success');
            this.router.navigate(['/reward/reward-propose-sign']);
          }
          else {
            const ref = this.dialogService.open(RewardProposeSignErrorComponent, {
              header: 'Thông báo lỗi',
              width: '50%',
              baseZIndex: 2000,
              contentStyle: { "padding": "0" },
              data: {
                errorSAP: res.data
              }
            });
            // this.app.errorMessage('reimbursement.error', res.data);
          }
        })
    }, () => {
      // rejected
    })
  }


  /**
   * Preview file
   */
  onPreviewFile(isPreviewAll = false) {
    let isInvalidForm = false;
    if (!CommonUtils.isValidForm(this.formRewardGroupInside)) {
      this.activeIndex = 0;
      this.app.warningMessage('formRewardProposeGroupInside');
      isInvalidForm = true;
    }
    if (!CommonUtils.isValidForm(this.formRewardPersonInside)) {
      this.activeIndex = 1;
      this.app.warningMessage('formRewardProposePersonInside');
      isInvalidForm = true;
    }
    if (isInvalidForm) {
      return;
    }
    const saveData = this.formSave.value;
    const lstRewardProposeSignObjectForm = [];
    const rewardForm = {};
    rewardForm['rewardProposeSignId'] = saveData.rewardProposeSignId;
    rewardForm['name'] = saveData.name;
    rewardForm['proposeOrgId'] = saveData.proposeOrgId;
    rewardForm['rewardType'] = saveData.rewardType;
    rewardForm['periodType'] = saveData.periodType;
    rewardForm['approvalOrgId'] = saveData.approvalOrgId;
    rewardForm['signOrgId'] = saveData.signOrgId;
    rewardForm['proposeYear'] = saveData.proposeYear;
    rewardForm['decisionNumber'] = saveData.decisionNumber;
    rewardForm['promulgateDate'] = saveData.promulgateDate;
    rewardForm['closingDate'] = saveData.closingDate;
    rewardForm['promulgateBy'] = this.promulgateBy;
    rewardForm['createdBy'] = saveData.createdBy;
    rewardForm['createdDate'] = saveData.createdDate;
    rewardForm['fromSource'] = FROM_SOURCE.QD_NGOAI;
    rewardForm['offset'] = this.offset;
    rewardForm['limit'] = this.limit;
    let isRewardTitle = false;
    // tap the trong sangnn
    this.formRewardGroupInside.controls.forEach(data => {
      const dataValue = data.value;
      dataValue.rewardProposeDetailType = LOAI_KHEN_THUONG_CHI_TIET.TAP_THE_TRONG_VT;
      if ((saveData.rewardType == LOAI_KHEN_THUONG.TO_CHUC_DOAN ||
        saveData.rewardType == LOAI_KHEN_THUONG.TO_CHUC_PHU_NU ||
        saveData.rewardType == LOAI_KHEN_THUONG.TO_CHUC_THANH_NIEN)
        && dataValue.massOrganizationId != null) {
        dataValue.objectIdsangnnMember = dataValue.massOrganizationId;
      } else if (saveData.rewardType == LOAI_KHEN_THUONG.TO_CHUC_DANG && dataValue.partyOrganizationId != null) {
        dataValue.objectIdsangnnMember = dataValue.partyOrganizationId;
      } else if (saveData.rewardType == LOAI_KHEN_THUONG.CHINH_QUYEN && dataValue.organizationId != null) {
        dataValue.objectIdsangnnMember = dataValue.organizationId;
      }
      delete dataValue.rewardTitleIdList;
      if (dataValue.isPreview || isPreviewAll) {
        if (dataValue.rewardTitleId != null) {
          isRewardTitle = true;
        }
        lstRewardProposeSignObjectForm.push(dataValue);
      }
    });
    // can bo, cong nhan vien
    this.formRewardPersonInside.controls.forEach(data => {
      const dataValue = data.value;
      dataValue.rewardProposeDetailType = LOAI_KHEN_THUONG_CHI_TIET.KHEN_THUONG_CBNV;
      if (dataValue.employeeId != null) {
        dataValue.objectIdsangnnMember = dataValue.employeeId;
      }
      delete dataValue.rewardTitleIdList;
      if (dataValue.isPreview || isPreviewAll) {
        if (dataValue.rewardTitleId != null) {
          isRewardTitle = true;
        }
        lstRewardProposeSignObjectForm.push(dataValue);
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
    rewardForm['fromSource'] = FROM_SOURCE.QD_DE_XUAT;
    this.rewardProposeSignService.previewFile(rewardForm).subscribe(res => {
      if (res.size > 0) {
        const modalRef = this.modalService.open(ReportPreviewCertificateComponent, LARGE_MODAL_OPTIONS);
        modalRef.componentInstance.value = res;
        modalRef.componentInstance.rewardForm = rewardForm;
        modalRef.componentInstance.isBlobFile = false;
        modalRef.componentInstance.isPreviewRewardTitle = true;
      } else {
        this.app.errorMessage("rewardPropose.canNotFindFileRewardTitle");
      }
    });
  }
   openModal(errorMsg: any) {
    if(errorMsg) {
      const ref = this.dialogService.open(RewardProposeSignErrorComponent, {
        header: 'Mô tả lỗi',
        width: '50%',
        baseZIndex: 2000,
        contentStyle: {"padding": "0"},
        data: {
          errorSAP: errorMsg
        }
      });
    }
  }
  public generateFileReward(item) {
    this.app.confirmMessage("app.rewardBTHTT.confirmGenerateFileReward", () => { // accept
      this.rewardProposeSignService.generateFileReward(item.rewardProposeSignId)
          .subscribe(res => {
            if (this.rewardProposeSignService.generateFileReward(res)) {
              this.app.successMessage('generateFile.success');
              this.router.navigate(['/reward/reward-propose-sign']);
            }
            else {

               this.app.errorMessage('generateFile.error');
            }
          })
    }, () => {
      // rejected
    })
  }
}
