import { Component, OnInit } from '@angular/core';
import { FormArray ,FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileControl } from '@app/core/models/file.control';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM,APP_CONSTANTS,LOAI_KHEN_THUONG_CHI_TIET, LOAI_KHEN_THUONG ,REWARD_PROPOSE_SIGN_STATUS , FROM_SOURCE, LARGE_MODAL_OPTIONS, MEDIUM_MODAL_OPTIONS,SAP_STATEMENT_STATUS} from '@app/core';
import { RewardProposeSignService } from '@app/core/services/reward-propose-sign/reward-propose-sign.service';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';
import { OrganizationService } from '@app/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { RewardDecideListComponent } from '@app/modules/reward/reward-propose/reward-propose-form/reward-decide-list/reward-decide-list.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HrStorage } from '@app/core/services/HrStorage';
import {VfsInvoiceService} from "@app/core/services/vfs-invoice/vfs-invoice.service";
import { ReportPreviewCertificateComponent } from '../../reward-general-preview/report-preview-certificate';
import _ from 'lodash';
import { HelperService } from '@app/shared/services/helper.service';
import { RewardProcessLoadModalComponent } from '../../reward-propose/reward-process-load-modal/reward-process-load-modal.component';
import {
  popupRejectReason
} from "@app/modules/reward/reward-propose-approve/reward-propose-approve-search/reward-propose-reject-reason/reward-propose-reject-reason";
import {DialogService} from "primeng/api";
import {
  RewardProposeSignErrorComponent
} from "@app/modules/reward/reward-propose-sign/reward-propose-sign-error/reward-propose-sign-error";
import { SelectBudgetDateAndFundCategoryComponent } from '@app/modules/reward/reward-propose-sign/select-budget-date-and-fun-category/select-budget-date-and-funcategory.component';
import { SelectBudgetDateComponent } from '../select-budget-date/select-budget-date.component';
import {UrlConfig} from "@env/environment";
@Component({
  selector: 'reward-propose-sign-form',
  templateUrl: './reward-propose-sign-form.component.html',
  styleUrls: ['./reward-propose-sign-form.component.css']
})
export class RewardProposeSignFormComponent extends BaseComponent implements OnInit {
  rootId = APP_CONSTANTS.ORG_ROOT_ID
  resetFormArray: Subject<any> = new Subject<any>();
  setData: Subject<any> = new Subject<any>();
  processingData: Subject<any> = new Subject<any>();
  formRewardDecideTable: Subject<any> = new Subject<any>();
  saveData: Subject<boolean> = new Subject<boolean>();
  loadDataIntoForm: Subject<any> = new Subject<any>();
  downLoadFile: Boolean;
  formSave: FormGroup;
  documentTypeId: any;
  listSAPStatementStatus:any;
  branchList: any;
  urlVfsReimbusment: any;
  URL: any;
  isUpdate: boolean;
  isInsert: boolean;
  isView: boolean;
  isEditDecision: boolean;
  paymentStatusList: any;
  sapStatementStatus: any;
  isInsertDecision: boolean;
  isViewDecision: boolean;
  isPersonal: boolean;
  selectedRows:[];
  isGroup: boolean;
  isSign: boolean;
  status: any;
  canTransferPayment: boolean;
  canTransferBTHTT: boolean;
  canGenerateFile: boolean;
  canCancelPayment: boolean;
  rejectStatement:  boolean;
  completeStatement: boolean;
  rewardType: number;
  rewardProposeSignId: any;
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
  lstRewardType = APP_CONSTANTS.REWARD_GENERAL_TYPE_LIST;
  lstPeriodType = APP_CONSTANTS.REWARD_PERIOD_TYPE_LIST;
  lstfunCategory = APP_CONSTANTS.REWARD_FUN_CATEGORY_LIST;    
  listYear: any;
  totalAmountOfMoney: any;
  listReimbursement: any;
  hidePaymentStatus: any;
  listReimbursementInvoice: any;
  selectedGop: any;
  rewardProposeSignOgrIdList: any;
  rewardTypeListByUserToInsert: any;
  sapStatus:any;
  autoPayOrder:any;
  formConfig = {
    name: [null, [ValidationService.required]],
    signName: [null],
    signOrgId: [null, [ValidationService.required]],
    proposeSignDetailFormList: [null],
    rewardProposeSignId: [null],
    status: [null],
    sapStatementStatus: [null],
    listExistId: [null],
    listNewId: [null],
    approvalOrgId: [null, [ValidationService.required]],
    rewardType: [null, [ValidationService.required]],
    periodType: [null, [ValidationService.required]],
    proposeYear: [null, [ValidationService.required]],
    paymentStatus: [0],
    isAuthority: [''],
    vfsStatementNo: [''],
    totalAmountOfMoney: [0],
    urlVfsReimbusment: [null],
    budgetDate: [null,[ValidationService.required]],
    funCategory: ['F03',[ValidationService.required]],
  };
  branch: number;
  signOrgId: any;
  listExistId: any;
  listNewId: any;
  isClickSign: boolean = false;
  rootOrgId = APP_CONSTANTS.ORG_ROOT_ID;
  mapRewardTypeBranch = { 1: 0, 2: 3, 3: 1, 4: 2, 5: 5 };
  numIndex = 1;
  firstRowIndex = 0;
  pageSize = 10;
  offset: any = 0;
  limit: any = 50;
  decisionNumber:any;
  modalProcessLoad: NgbModalRef;
  constructor(
    private rewardProposeSignService: RewardProposeSignService,
    public actr: ActivatedRoute,
    private app: AppComponent,
    private router: Router,
    private modalService: NgbModal,
    private rewardProposeService: RewardProposeService,
    private organizationService: OrganizationService,
    private vfsInvoiceService : VfsInvoiceService,
    public dialogService: DialogService,
    public helperService: HelperService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.rewardPropose"));
    this.formSave = this.buildForm({}, this.formConfig)
    this.URL = UrlConfig.clientAddress
    this.rewardProposeSignService.getDataDropdown().subscribe(res => {
      this.rewardProposeSignOgrIdList = res.data.rewardProposeSignOgrIdList;
    })
    this.buildForms({});
    this.listSAPStatementStatus = APP_CONSTANTS.SAP_STATEMENT_STATUS;
  }

  ngOnInit() {
    this.buildForms({});
    this.paymentStatusList = [
      {label:"Chưa tạo bảng THTT", value: 0},
      {label:"Tài chính chưa duyệt", value: 1},
      {label:"TC đã duyệt", value: 2},
      {label: "Lỗi khi tạo bảng THTT", value: 3},
      {label:"Hủy tính thuế", value: 4},
      {label:"Dữ liệu lỗi", value: 5},
      {label:"Đã tính thuế TNCN thành công", value: 6},
      {label:"Đã hạch toán", value: 7},
      {label:"Đã ký Voffice", value: 8},
      {label:"Đã tạo Đề nghị chuyển tiền", value: 9},
      {label:"Đã chi tiền", value: 10},
    ]
    this.listYear = this.getYearList()
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 3) {
      this.isView = subPaths[3] === 'view-sign';
      this.isUpdate = subPaths[3] === 'edit-sign';
      this.isInsert = subPaths[3] === 'add-sign';
      if (!this.isInsert) {
        this.modalProcessLoad = this.modalService.open(RewardProcessLoadModalComponent, MEDIUM_MODAL_OPTIONS);
        this.helperService.setWaitDisplayLoading(true);
        this.rewardProposeSignId = subPaths[4]
        this.setDataTopAllForms();
      }else{
        
      }
    }
    this.rewardProposeService.getRewardTypeList().subscribe(res => {
      this.rewardTypeListByUserToInsert = this.lstRewardType.filter((item) => {
        return res.includes(item.id)
      })
    });
    this.processingData.subscribe(async info => {
      // await this.wait(500);
      this.modalProcessLoad.componentInstance.updateView(info);
    });
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
  public setDataTopAllForms() {
    this.rewardProposeSignService.findOne(this.rewardProposeSignId).subscribe(res => {
          if(res.data.decisionNumber != null){
            this.decisionNumber = res.data.decisionNumber
          }
          console.log("res.data",res.data)
            this.status = res.data.status;
          if(res.data.status != null && res.data.status == 3){
            this.hidePaymentStatus = true
          }
          if(res.data.status != null && (res.data.status == 3|| res.data.status == 5)){
            this.isView = true;
          this.isUpdate = false;
          }
          if(!res.data.funCategory){
            res.data.funCategory = 'F03';
          }
          this.canTransferBTHTT =  res.data.vfsStatementNo != null && res.data.sapStatementStatus != "99" && res.data.status == 3 ? true: false;
          this.canGenerateFile = res.data.isGenerateFile != 1 && (res.data.status == 3 || res.data.status == 5);
          this.canTransferPayment =  res.data.vfsStatementNo == null && res.data.sapStatementStatus != "99" && (res.data.paymentStatus == 0 || res.data.paymentStatus == 3) ? true: false;
          if(res.data.stateVfsReimbusment != null &&  ["03- Submitted to Accounting","04- HR approved","06- Accounting approved","08- Submitted to V-office","09- V-office approved"].includes(res.data.stateVfsReimbusment)){
            this.canTransferPayment = false;
            this.canTransferBTHTT = false;
          }
          this.sapStatementStatus = res.data.sapStatementStatus;
          const lstRewardProposeSynthetic = res.data.lstRewardProposeSignDetail || [];
          this.listReimbursement = res.data.reimbursementList || [];
          this.formRewardDecide = lstRewardProposeSynthetic.map((item) => {
            return item.rewardProposeId
          })
          let item = this.listReimbursement.find((item) => item.sapStatus==='E')
          this.sapStatus = item == null ? null : item.sapStatus
          this.urlVfsReimbusment = this.rewardProposeSignService.serviceUrl.replace("","") ;
          this.signOrgId = res.data.signOrgId;
          this.isSign = (res.data.status == 5 || res.data.status == 4) && res.data.fromSource == 1? true : false;
          this.buildForms(res.data);
          if ((res.data.vfsStatementNo != null && res.data.status == 4) || (res.data.vfsStatementNo != null  && res.data.isDeleteVfsReimbusment == null && res.data.status == 5)) {
                    this.completeStatement = true;
          }
          if(res.data.vfsReimbusmentId != null){
                if((res.data.stateVfsReimbusment != null && "09- V-office approved" == res.data.stateVfsReimbusment) || (this.sapStatus != null &&  this.sapStatus == 'E')){
                    this.completeStatement = true;
                }else{
                    this.completeStatement = false;
                }
          }
          this.totalAmountOfMoney = res.data.totalAmountOfMoney;
          if(res.data.vfsStatementNo != null && ( res.data.status == 2 ||  res.data.status == 4) && res.data.sapStatementStatus != "06" && res.data.sapStatementStatus != "07"){
                      this.rejectStatement = true;
          }
          this.formRewardDecideTable.next(lstRewardProposeSynthetic);
          res.data['lstRewardProposeDetail'] = res.data.lstRewardProposeSignObject;
          const rewardType = this.formSave.controls['rewardType'].value;
          const branch = this.mapRewardTypeBranch[rewardType];
          const data = { rewardType: rewardType, branch: branch };
          this.resetFormArray.next(data);
          this.setData.next(res);
          this.helperService.setWaitDisplayLoading(false);
    });
  }
  get f() {
    return this.formSave.controls;
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
    this.resetForm()
    this.checkRenderForm()
  }
  /**
 * buildForm
 */
  private buildForms(data?: any): void {
    if(data && data.vfsStatementNo){
      data.vfsStatementNo = data.vfsStatementNo
    }
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, [])
    if(data.rewardType === 1){
      this.lstfunCategory = APP_CONSTANTS.REWARD_FUN_CATEGORY_LIST_OTHER;
      if(!this.formSave.controls['funCategory'].value){
        this.formSave.controls['funCategory'].setValue('F72')
      }
    }else{
      this.lstfunCategory = APP_CONSTANTS.REWARD_FUN_CATEGORY_LIST;
      if(!this.formSave.controls['funCategory'].value){
        this.formSave.controls['funCategory'].setValue('F03')
      }
    }
    const fileAttachment = new FileControl(null);
    if (data && data.fileAttachment) {
      if (data.fileAttachment.attachedFiles) {
        fileAttachment.setFileAttachment(data.fileAttachment.attachedFiles);
      }
    }
    this.formSave.addControl('attachedFiles', fileAttachment);
  }

  public goBack() {
    this.router.navigate(['/reward/reward-propose-sign']);
  }
  public goView(rewardProposeSignId: any) {
    this.router.navigate([`/reward/reward-propose-sign/view-sign/${rewardProposeSignId}`]);
  }
  // public onOrganizationChange() {
  //   const signOgrId = this.formSave.controls['signOrgId'].value;
  //   if (!CommonUtils.isNullOrEmpty(signOgrId)) {
  //     const form = { signOrgId: signOgrId }
  //     // this.rewardProposeSignService.processSearchDetail(form).subscribe(res => {
  //     //   this.resultListDetail = res.data;
  //     // });
  //   } else {
  //     // this.resultListDetail = [];
  //   }
  // }

  public processSaveOrUpdate() {
    let isInvalidForm = false;
    if (!CommonUtils.isValidForm(this.formRewardGroupInside)) {
      isInvalidForm = true;
    } else if (!CommonUtils.isValidForm(this.formRewardGroupOutside)) {
      isInvalidForm = true;
    } else if (!CommonUtils.isValidForm(this.formRewardPersonOutside)) {
      isInvalidForm = true;
    } else if (!CommonUtils.isValidForm(this.formRewardPersonInside)) {
      isInvalidForm = true;
    } else if (!CommonUtils.isValidForm(this.formRewardCost)) {
      isInvalidForm = true;
    }
    console.log("this.formRewardGroupInside",this.formRewardGroupInside)
    console.log("this.formRewardPersonInside",this.formRewardPersonInside)
    if (this.formRewardDecide.length == 0) {
      this.app.warningMessage('rewardPropose.haveNotSelectedSuggestions');
      isInvalidForm = true;
    }
    if (isInvalidForm) {
      return;
    }
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    const rewardForm = {};
    rewardForm['rewardProposeIdList'] = this.formRewardDecide
    const saveData = this.formSave.value;
    rewardForm['rewardProposeSignId'] = saveData.rewardProposeSignId;
    rewardForm['rewardProposeId'] = saveData.rewardProposeId;
      rewardForm['name'] = saveData.name;
      rewardForm['isAuthority'] = saveData.isAuthority;
      rewardForm['rewardType'] = saveData.rewardType;
      rewardForm['periodType'] = saveData.periodType;
      rewardForm['approvalOrgId'] = saveData.approvalOrgId;
      rewardForm['signOrgId'] = saveData.signOrgId;
      rewardForm['proposeYear'] = saveData.proposeYear;
      rewardForm['budgetDate'] = saveData.budgetDate;
      rewardForm['funCategory'] = saveData.funCategory;
      
      if(saveData.status == null){
           rewardForm['status'] = REWARD_PROPOSE_SIGN_STATUS.SOAN_TRINH_KY;
      }else{
            rewardForm['status'] = saveData.status;
      }
      if(this.status == 5 || this.status == 3){
        rewardForm['status'] = this.status;
        rewardForm['ignoreCreateRewardGeneral'] = "Y";
      }

      rewardForm['attachedFiles'] = saveData.attachedFiles;
      const lstRewardProposeDetail = [];
      if (CommonUtils.isValidForm(this.formRewardGroupInside)) {
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
          if (saveData.rewardType == 5  && data.value['rewardTitleName'] == 'Khen thưởng bằng hiện vật' && data.value['rewardCategory'] =='2' && (data.value['receiveBonusOrgId'] === null || data.value['receiveBonusOrgId'] == '')) {
            this.app.warningMessage('formRewardProposeGroupInside.receiveBonusOrgId');
            return;
          }
          delete dataValue.rewardTitleIdList;
          lstRewardProposeDetail.push(dataValue);
        });
      }
      // can bo, cong nhan vien
      if (CommonUtils.isValidForm(this.formRewardPersonInside)) {
        this.formRewardPersonInside.controls.forEach(data => {
          const dataValue = data.value;
          dataValue.rewardProposeDetailType = LOAI_KHEN_THUONG_CHI_TIET.KHEN_THUONG_CBNV;
          if (dataValue.employeeId != null) {
            dataValue.objectIdsangnnMember = dataValue.employeeId;
          }
          if (saveData.rewardType == 5  && data.value['rewardTitleName'] == 'Khen thưởng bằng hiện vật' && data.value['rewardCategory'] =='2' && (data.value['receiveBonusOrgId'] === null || data.value['receiveBonusOrgId'] == '')) {
            this.app.warningMessage('formRewardProposeGroupInside.receiveBonusOrgId');
            isInvalidForm = true;
            return;
          }
          delete dataValue.rewardTitleIdList;
          lstRewardProposeDetail.push(dataValue);
        });
      } else {
        return;
      }
      // tap the ngoai sangnn
      if (CommonUtils.isValidForm(this.formRewardGroupOutside)) {
        this.formRewardGroupOutside.controls.forEach(data => {
          const dataValue = data.value;
          dataValue.rewardProposeDetailType = LOAI_KHEN_THUONG_CHI_TIET.TAP_THE_NGOAI_VT;
          delete dataValue.rewardTitleIdList;
          lstRewardProposeDetail.push(dataValue);
        });
      } else {
        return;
      }
    // chi phí
    if (CommonUtils.isValidForm(this.formRewardCost)) {
      this.formRewardCost.controls.forEach(data => {
        const dataValue = data.value;
        dataValue.rewardProposeDetailType = LOAI_KHEN_THUONG_CHI_TIET.CHI_PHI;
        delete dataValue.rewardTitleIdList;
        lstRewardProposeDetail.push(dataValue);
      });
    } else {
      return;
    }
      // ca nhan ngoai sangnn
      if (CommonUtils.isValidForm(this.formRewardPersonOutside)) {
        this.formRewardPersonOutside.controls.forEach(data => {
          const dataValue = data.value;
          dataValue.rewardProposeDetailType = LOAI_KHEN_THUONG_CHI_TIET.CA_NHAN_NGOAI_VT;
          delete dataValue.rewardTitleIdList;
          lstRewardProposeDetail.push(dataValue);
        });
      } else {
        return;
      }
      if(!CommonUtils.isNullOrEmpty(lstRewardProposeDetail)) {
        this.app.confirmMessage(null, () => { // on accepted
          rewardForm['lstRewardProposeSignObjectForm'] = lstRewardProposeDetail;
          rewardForm['fromSource'] = FROM_SOURCE.QD_DE_XUAT;
          this.rewardProposeSignService.saveOrUpdateFormFile(rewardForm).subscribe(res => {
            if (this.rewardProposeSignService.requestIsSuccess(res) && res.data && res.data.rewardProposeSignId) {
              if(this.isClickSign) {
                // thực hiện gen file phụ lục trình ký
                this.rewardProposeSignService.actionSignVoffice(res.data.rewardProposeSignId).subscribe(resp => {
                  if(this.rewardProposeSignService.requestIsSuccess(resp)) {
                    const signDocumentId = resp.data;
                    this.router.navigateByUrl('voffice-signing/reward-propose-sign/' + signDocumentId, { state: {backUrl:'reward/reward-propose-sign'} });
                  }
                })
              } else {
                this.goView(res.data.rewardProposeSignId);
              }
            }
          });
        }, () => {
        });
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
  renderDataDecide(data) {
    this.formRewardDecide = data.map((item) => {
      return item.rewardProposeId
    })
    this.renderData()
  }
  addRewardDecide() {
    const isValidRewardType = CommonUtils.isValidForm(this.f['rewardType'])
    const isValidApprovalOrgId = CommonUtils.isValidForm(this.f['approvalOrgId'])
    const isValidProposeYear = CommonUtils.isValidForm(this.f['proposeYear'])
    const isValidPeriodType = CommonUtils.isValidForm(this.f['periodType'])
    if (isValidRewardType && isValidApprovalOrgId && isValidProposeYear && isValidPeriodType) {
      const modalRef = this.modalService.open(RewardDecideListComponent, {windowClass:'dialog-xl slide-in-right', backdrop: 'static'});
      const formSearch = {
        proposeYear: this.f['proposeYear'].value,
        periodType: this.f['periodType'].value,
        rewardProposeSignId: this.formSave.value.rewardProposeSignId ? this.formSave.value.rewardProposeSignId : null,
        // proposeOrgId: this.f['proposeOrgId'].value,
        approvalOrgId: this.f['approvalOrgId'].value,
        status: APP_CONSTANTS.REWARD_PROPOSE_STATUS2[5].id,
        isChoose: 1,
        isDecisionScreen: 1,
        ignoreList: this.formRewardDecide.length > 0 ? this.formRewardDecide : "",
        rewardType: this.f['rewardType'].value,
        isAuthority: this.f['isAuthority'].value,
      };
      const data = { formSearch: formSearch};
      modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
      // modalRef.componentInstance.isDisable = true;
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
    }
  }
  public onSign() {
    this.isClickSign = true;
    this.processSaveOrUpdate();
  }
  public renderData() {
    this.modalProcessLoad = this.modalService.open(RewardProcessLoadModalComponent, MEDIUM_MODAL_OPTIONS);
    const formData = {
      rewardProposeIdList : this.formRewardDecide,
      rewardType: this.f['rewardType'].value,
      isChoose: 1
    }
    this.rewardProposeService.getDatatablesByListSignOrg(formData).subscribe((data) => {
      this.setData.next(data);
    })
  }
  public checkRenderForm() {
    if(this.isInsert && this.f['approvalOrgId'].valid && this.f['proposeYear'].valid && this.f['periodType'].valid && this.f['rewardType'].valid) {
      const formSearch = {
        proposeYear: this.f['proposeYear'].value,
        periodType: this.f['periodType'].value,
        rewardProposeSignId: this.formSave.value.rewardProposeSignId ? this.formSave.value.rewardProposeSignId : null,
        approvalOrgId: this.f['approvalOrgId'].value,
        status: APP_CONSTANTS.REWARD_PROPOSE_STATUS2[5].id,
        isChoose: 1,
        isDecisionScreen: 1,
        rewardType: this.f['rewardType'].value,
        fullPage: 1
      }
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
    }
  }
  public resetForm() {
    this.formRewardDecide = [];
    const rewardType = this.formSave.controls['rewardType'].value;
    const branch = this.mapRewardTypeBranch[rewardType];
    const data = { rewardType: rewardType, branch: branch };
    this.resetFormArray.next(data);
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
    
  }



  public doRejectStatement(item) {
      this.app.confirmMessage("app.rewardBTHTT.confirmRejectStatement", () => { // accept
        this.rewardProposeSignService.processRejectStatement(item.rewardProposeSignId)
            .subscribe(res => {
              if (this.rewardProposeSignService.requestIsSuccess(res)) {
                this.app.successMessage('rejectstatement.success');
                this.router.navigate(['/reward/reward-propose-sign']);
              }
              else{
                const ref = this.dialogService.open(RewardProposeSignErrorComponent, {
                  header: 'Thông báo lỗi',
                  width: '50%',
                  baseZIndex: 2000,
                  contentStyle: {"padding": "0"},
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
                  else{
                    const ref = this.dialogService.open(RewardProposeSignErrorComponent, {
                      header: 'Thông báo lỗi',
                      width: '50%',
                      baseZIndex: 2000,
                      contentStyle: {"padding": "0"},
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


  public transferPayment(item) {

    const modalRef = this.modalService.open(SelectBudgetDateAndFundCategoryComponent, {windowClass:'dialog-xl slide-in-right', backdrop: 'static'});
    const formSearch = {
      proposeOrgId: null,
      rewardProposeSignId: item.rewardProposeSignId   ,
      funCategory: item.funCategory ,
      budgetDate: item.budgetDate,
      rewardType: item.rewardType
    };
    const data = { formSearch: formSearch};
    if (data) {
      modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
    }
    modalRef.result.then((result) => {
      return;
      // if (!result) {
      //
      // }else{
      //   this.setDataTopAllForms();
      // }
      
    });
 
    // this.app.confirmMessage("app.rewardPayment.confirmHasNotPermission", () => { // accept
    //   this.rewardProposeSignService.processTransferPayment(item.rewardProposeSignId)
    //       .subscribe(res => {
    //         if (this.rewardProposeSignService.requestIsSuccess(res)) {
    //           this.app.successMessage('createReimbursement.success');
    //           this.router.navigate(['/reward/reward-propose-sign']);
    //         }
    //         else{
    //           const ref = this.dialogService.open(RewardProposeSignErrorComponent, {
    //             header: 'Thông báo lỗi',
    //             width: '50%',
    //             baseZIndex: 2000,
    //             contentStyle: {"padding": "0"},
    //             data: {
    //               errorSAP: res.data
    //             }
    //           });
    //           // this.app.errorMessage('reimbursement.error', res.data);
    //         }
    //       })
    // }, () => {
    //   // rejected
    // })
  }

  public validateTransferPayment(){
    return true;
  }
  // public viewListInvoice(data) {
  //   this.vfsInvoiceService.searchByReimbursementId(data.vfsReimbursementId).subscribe(res => {
  //     this.listReimbursementInvoice = res
  //   })
  // }
  public onPreviewFile(isPreviewAll = false) {
    let isInvalidForm = false;
    if (!CommonUtils.isValidForm(this.formRewardGroupInside)) {
      isInvalidForm = true;
    } else if (!CommonUtils.isValidForm(this.formRewardPersonInside)) {
      isInvalidForm = true;
    }
    if (isInvalidForm) {
      return;
    }
    const rewardForm = {};
    rewardForm['rewardProposeIdList'] = this.formRewardDecide
    const saveData = this.formSave.value;
    rewardForm['rewardProposeSignId'] = saveData.rewardProposeSignId;
    rewardForm['rewardProposeId'] = saveData.rewardProposeId;
    rewardForm['name'] = saveData.name;
    rewardForm['rewardType'] = saveData.rewardType;
    rewardForm['periodType'] = saveData.periodType;
    rewardForm['approvalOrgId'] = saveData.approvalOrgId;
    rewardForm['signOrgId'] = saveData.signOrgId;
    rewardForm['proposeYear'] = saveData.proposeYear;
    rewardForm['decisionNumber'] = this.decisionNumber;
     if(saveData.status == null){
               rewardForm['status'] = REWARD_PROPOSE_SIGN_STATUS.SOAN_TRINH_KY;
     }else{
                rewardForm['status'] = saveData.status;
     }

    rewardForm['signOrgName'] = saveData.signOrgName;
    rewardForm['offset'] = this.offset;
    rewardForm['limit'] = this.limit;
    const lstRewardProposeDetail = [];
    let isRewardTitle = false;
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
      if (dataValue.isPreview || isPreviewAll)  {
        if (dataValue.rewardTitleId != null) {
          isRewardTitle = true;
        }
        lstRewardProposeDetail.push(dataValue);
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
        lstRewardProposeDetail.push(dataValue);
      }
    });
    if (CommonUtils.isNullOrEmpty(lstRewardProposeDetail)) {
      this.app.warningMessage('rewardPropose.notChooseReward');
      return;
    }
    if (!isRewardTitle) {
      this.app.warningMessage('rewardPropose.rewardTitleInValid');
      return;
    }
    rewardForm['lstRewardProposeSignObjectForm'] = lstRewardProposeDetail;
    rewardForm['fromSource'] = FROM_SOURCE.QD_DE_XUAT;
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
