import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS , LARGE_MODAL_OPTIONS, RESPONSE_TYPE} from '@app/core';
import { FileControl } from '@app/core/models/file.control';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { AssessmentReportService } from '@app/core/services/assessment-party-organization/assessment-report.service';
import { PartyMemberDecisionService } from '@app/core/services/party-organization/party-member-decision.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { SignDocumentService } from '@app/core/services/sign-document/sign-document.service';
import { AssessmentEmployeeLevelService } from '@app/core/services/assessment-employee-level/assessment-employee-level.service'
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, CryptoService, ValidationService } from '@app/shared/services';

// import { TransferAutoTabComponent } from './transfer-auto-tab/transfer-auto-tab.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignPreviewFileModalComponent } from './preview-modal/sign-preview-file-modal.component';
import { Thickness } from '@syncfusion/ej2-diagrams';
import { ReportPreviewModalComponent } from './preview-modal2/report-preview-modal.component';
import { isNumber } from 'util';
import { HelperService } from '@app/shared/services/helper.service';
import _ from 'lodash';
@Component({
  selector: 'multiple-sign',
  templateUrl: './multiple-sign.component.html',
  styleUrls: ['./multiple-sign.component.css']
})
export class MultipleSignComponent extends BaseComponent {
  @ViewChild('dataTable') dataTable: any;
  // @ViewChild('transferAutoTab')
  // transferAutoTab: TransferAutoTabComponent;
  // @ViewChild('multiDocumentPicker')
  // multiDocumentPicker: MultiDocumentPickerComponent;
  formGroup: FormGroup;
  formSigner: FormArray;
  formSignerDocument: FormArray;
  module: number;
  memberList: any[];
  files: any[];
  resultList: any = {};
  listCbb: any = [];
  listTextF: any = [];
  listMember: any[] = [];
  listConfidentiality: any[] = [];
  listUrgent: any[] = [];
  member: any;
  signType: string;
  //#203 start
  isDefaultValue: boolean = false;
  templateFileSigns: any[] = [];
  titleSignInfor = 'common.button.signInfor';
  backUrl = null;
  isMultibleFile: boolean = false;
  isAuthenVoffice: boolean = false;
  //#203 end
  lstPromulgate: any[] = [];
  formConfig = {
    signType: [null],
    signDocumentId: [''],
    assessmentOrder:[''],
    extractingTextContent: [''],
    professions: [null],
    formalityText: [null],
    confidentiality: [null],
    urgent: [null],
    textSymbols: [''],
    numberNoteSigner: [''],
    vofficeUser: ['', Validators.compose([Validators.maxLength(100)])],
    vofficePassword: ['', Validators.compose([Validators.maxLength(100)])],
    isAutoPromulgate: [''], // Ban hành tự động
    isAutoTransferDocuemnt: [''], // Tự động chuyển văn bản
  };
  formConfigSignDocument = {
    employeeCode: [null],
    employeeName: [null],
    signDocumentId: [null],
    fileAttachment: [null],
    extractingTextContent: [null, Validators.compose([Validators.required])],
    assessmentEmployeeLevelId: [null]
  }
  assessmentEmployeeLevelIds: any[] =[];
  employeeId: '';
  assessmentPeriodId: ''
  isDraft: boolean;
  url = '';
  assessmentOrder:'';
  isSignAll: any = false;
  partyOrganizationId: any = null;
  page: any = 1;
  mapDataPage = {};
  mapDataSign = [];
  first: any = 0;
  constructor(
    private formBuilder: FormBuilder,
    private appParamService: AppParamService,
    private app: AppComponent,
    private signDocumentService: SignDocumentService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private partyMemberDecisionService: PartyMemberDecisionService,
    private assessmentReport: AssessmentReportService,
    private employeeLevelServices : AssessmentEmployeeLevelService,
    private modalService: NgbModal,
    public helperService: HelperService,
  ) {
    super(null, 'SIGN_DOCUMENT');
    this.prepareData();
  }
  prepareData() {
    this.helperService.setWaitDisplayLoading(true);
    const params = this.activatedRoute.snapshot.queryParams;
    if(params.employeeId && params.assessmentPeriodId) {
      this.assessmentPeriodId = params.assessmentPeriodId;
      this.partyOrganizationId = params.partyOrganizationId;
      this.assessmentOrder = params.assessmentOrder;
      this.employeeId = params.employeeId;
      this.isDraft = params.isDraft;
      this.isSignAll = params.isSignAll * 1;
      const listObjSign = params.listId || [];
      this.assessmentEmployeeLevelIds = Array.isArray(listObjSign) ? listObjSign : [params.listId];
    }
    this.buildFormsSignDocument()
    this.buildFormSigner();
    this.buildForms({})
    this.loadOptions();
    // this.setFormDefaultValue();
    //#203 start
    this.setTitleSignInfor();
    //#203 end
    const { state } = this.router.getCurrentNavigation().extras;
    if (state && state.backUrl) {
      this.backUrl = state.backUrl;
    }
  }
  get f() {
    return this.formGroup.controls;
  }
  ngOnInit() {
    this.mapDataPage = {};
    this.mapDataSign = [];
    this.fetchDataSign();
  }
  async fetchDataSign(event?: any) {
    const formData = {
      assessmentEmployeeLevelIds : this.assessmentEmployeeLevelIds.map((item) => Number(item)),
      employeeId : this.employeeId,
      assessmentOrder: this.assessmentOrder,
      assessmentPeriodId : this.assessmentPeriodId,
      assessmentPartyorganizationId: this.partyOrganizationId,
      isSignAll: this.isSignAll
    }
    if (event) {
      if (!this.validateBeforeSave()) {
        setTimeout(() => {
          this.resultList = { ...this.resultList, first: this.first };
        }, 300);
        return;
      }
      this.updateFromDataPage();
      const { first, rows } = event;
      formData['page'] = (first / rows) + 1;
    }
    const page = formData['page'] || 1;
    try {
      let res = null;
      let hasCache = false;
      if (this.mapDataPage[page]) {
        res = this.mapDataPage[page];
      } else {
        res = await this.employeeLevelServices.prepareData(formData).toPromise();
        this.mapDataPage[page] = res;
      }
      if (this.mapDataSign instanceof Array && this.mapDataSign.length) {
        hasCache = true;
        res.data.listSigner = _.cloneDeep(this.mapDataSign);
      }
      if (res.type === RESPONSE_TYPE.SUCCESS && res.data) {
        this.resultList = {
          recordsTotal: res.data.recordsTotal,
          first: res.data.first,
          rows: res.data.row,
          page: res.data.page,
          data: res.data.listAssessmentEmployeeLevel
        };
        this.first = res.data.first;
        let lstAssessmentEmployeeLevelIds = [];
        for (const key in this.mapDataPage) {
          const item = this.mapDataPage[key];
          if (item.type === RESPONSE_TYPE.SUCCESS && item.data) {
            const tempIds = item.data.listAssessmentEmployeeLevel.map(item => item.assessmentEmployeeLevelId);
            lstAssessmentEmployeeLevelIds = lstAssessmentEmployeeLevelIds.concat(tempIds);
          }
        }
        this.assessmentEmployeeLevelIds = lstAssessmentEmployeeLevelIds;
        this.buildFormsSignDocument(res.data.listAssessmentEmployeeLevel);
        this.f['confidentiality'].setValue(res.data.confidentiality);
        this.f['formalityText'].setValue(res.data.formalityText.toString());
        this.f['professions'].setValue(res.data.professions.toString());
        this.f['urgent'].setValue(res.data.urgent);
        this.f['isAutoPromulgate'].setValue(res.data.isAutoPromulgate ? true : false);
        this.f['textSymbols'].setValue(res.data.defaultTextSymbols);
        this.buildFormSigner(res.data.listSigner);
        this.formSigner.controls.forEach(item => {
          this.loadUserVoffice(item.value.employeeId, item , !hasCache);
          item.get('isDefaultValue').setValue(true);
          item.get('isSign').setValue(1);
        });
      } else {
        this.onClose();
        return;
      }
    } finally {
      this.helperService.setWaitDisplayLoading(false);
    }
  }
  private buildForms(data?: any) {
    const group = this.buildForm(data, this.formConfig);
    this.formGroup = group;
  }
  private buildFormsSignDocument(data?: any) {
    const controls = new FormArray([]);
    if(!data || data.length === 0) {
      this.formSignerDocument = controls;
      return
    }
    for (const signerDocument of data) {
      const group = this.makeDefaultSignerDocumentForm();
      group.patchValue(signerDocument);
      controls.push(group);
    }
    this.formSignerDocument = controls;
  }
  private buildFormSigner(listSigner?: any) {
    if (!listSigner || listSigner.length === 0) {
      listSigner = [{}];
    }
    const controls = new FormArray([]);
    for (const signer of listSigner) {
      const group = this.makeDefaultSignerForm();
      if (signer.showSignImage && signer.showSignImage === 1) {
        group.controls.signImageId.setValidators(ValidationService.required);
        group.controls.signImageId.updateValueAndValidity();
      }
      group.patchValue(signer);
      controls.push(group);
    }
    this.formSigner = controls;
  }

  private makeDefaultSignerForm(): FormGroup {
    return this.formBuilder.group({
      employeeId: [null, Validators.compose([Validators.required])],
      userVofficeId: [null, Validators.compose([Validators.required])],
      signImageId: [null],
      //#203 start
      showSignImage: [null],
      isSign: [null],
      isDefaultValue: [null],
      //#203 end
    });
  }
  private makeDefaultSignerDocumentForm(): FormGroup {
    const formGroup = this.buildForm({}, this.formConfigSignDocument);
    return formGroup;
  }
  public addSigner(index: number) {
    const controls = this.formSigner as FormArray;
    controls.insert(index, this.makeDefaultSignerForm());
    index = index + 1
  }

  public removeSigner(index: number) {
    const controls = this.formSigner as FormArray;
    if (controls.length === 1) {
      this.buildFormSigner();
    }
    controls.removeAt(index);

    // #211 start
    this.reMakeSignFileAttachmentFile();
    // #211 end
    this.reMakeSignerFileAttachmentFile();
  }

  public upSigner(index: number) {
    if (index === 0) {
      return;
    }
    const formArray = this.formSigner as FormArray;
    const signerTemp = formArray.controls[index];
    formArray.controls[index] = formArray.controls[index - 1];
    formArray.controls[index - 1] = signerTemp;

    // #211 start
    this.reMakeSignFileAttachmentFile();
    // #211 end
    this.reMakeSignerFileAttachmentFile();
  }

  public downSigner(index: number) {
    const formArray = this.formSigner as FormArray;
    if (index === formArray.length) {
      return;
    }
    const signerTemp = formArray.controls[index];
    formArray.controls[index] = formArray.controls[index + 1];
    formArray.controls[index + 1] = signerTemp;

    // #211 start
    this.reMakeSignFileAttachmentFile();
    // #211 end
    this.reMakeSignerFileAttachmentFile();
  }

  private loadOptions() {
    // Danh sách Ngành
    this.appParamService.appParams('SIGN_BRANCH').subscribe(res => {
      this.listCbb = res.data;
    });

    // Danh sách Hình thức văn bản
    this.appParamService.appParams('TEXT_FORM').subscribe(res => {
      this.listTextF = res.data;
    });

    // Danh sách Độ mật
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.CONFIDENTIALITY).subscribe(res => {
        this.listConfidentiality = res.data;
    });
    // Danh sách Độ khẩn
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.URGENT_LEVEL_TYPE).subscribe(res => {
      this.listUrgent = res.data;
    });
  }

  loadUserVoffice(selectField, item: any, isFirstLoad?: boolean) {
    if (selectField) {
      this.signDocumentService.findVofficeUser(selectField).subscribe(res => {
        const listVofficeUser = [];
        for (const vofficeUser of res.data) {
          listVofficeUser.push({
            value: vofficeUser.adOrgId + '@' + vofficeUser.userId + '@' + vofficeUser.sysRoleId + '@' + vofficeUser.adOrgName + '@' + vofficeUser.jobTile,
            label: vofficeUser.jobTile == null ? vofficeUser.adOrgName : vofficeUser.jobTile + ' - ' + vofficeUser.adOrgName
          });
        }
        item.listVofficeUser = listVofficeUser;
      });

      this.signDocumentService.findNewestVofficeSignature(selectField).subscribe(res => {
        if (res.data && res.data.length > 0) {
          item.signatureImages = res.data;
          item.signatureImages.forEach(element => {
            element.attachBytes = "data:image/png;base64," + element.attachBytes;
          });
          //#203 start
          if (isFirstLoad && item.signatureImages.length > 0 && item.value.isDefaultValue) {
            item.get('signImageId').setValue(item.signatureImages[0].staffImageSignId);
            item.get('showSignImage').setValue(1);
            // #211 start
            this.reMakeSignFileAttachmentFile();
            // #211 end
            this.reMakeSignerFileAttachmentFile();
          } else {

          }
          //#203 end
        } else {
            item.signatureImages = [];
            item.get('signImageId').setValue(null);
            item.get('showSignImage').setValue(null);
        }
      });
    }
  }

  /**
   * hàm kiểm tra form trình ký có phải tình ký nghị quyết không
   */
  get isFromResolution()
  {
    return this.signType === 'resolution-month';
  }

  // #211 Start
  /**
   * hàm kiểm tra form trình ký có phải tình ký tổng hợp xếp loại Đảng viên không
   */
  get isFromAssessment()
  {
    return this.signType === 'assessment-party-organization';
  }
  // #211 end

  /**
   * Hàm trả về key file phụ lục theo chức năng
   */
  get keyFileExtra() {
    if(this.isFromResolution) {
      return 'vofficeSign.label.reportFileAttachment';
    }
    return 'common.label.attachmentFileAppendix';
  }

  /**
   * hàm kiểm tra có phải ban hành tự đông không?
   */
  get isAutoPromulgate()
  {
    return this.f['isAutoPromulgate'].value == 1;
  }

  /**
   * hàm kiểm tra có phải tự động chuyển văn bản không?
   */
  get isAutoTransferDocuemnt()
  {
    return this.f['isAutoTransferDocuemnt'].value == 1;
  }

  /**
   * hàm kiểm tra có phải là văn bản thường không
   */
  get isNormalConfidentiality()
  {
    return this.f['confidentiality'].value == 1;
  }

  /**
   * hàm kiểm tra form trình ký có phải tình ký tổng hợp xếp loại Đảng viên không
   */
   get isFromAssessmentSigner()
   {
     return this.signType === 'assessment-party-signer';
   }

  get isReportSubmission()
  {
    return this.signType === 'report-submission';
  }

  get isRewardProposeSign()
  {
    return this.signType === 'reward-propose-sign';
  }
  /**
   * Hàm submit tài khoản voffice
   */
  submitVoffice() {
    if(this.f['vofficeUser'].value && this.f['vofficePassword'].value) {
      const formSubmit = {
        vofficeUser: this.f['vofficeUser'].value,
        vofficePassword: CryptoService.encrAesEcb(this.f['vofficePassword'].value)
      };
      this.signDocumentService.submitVoffice(formSubmit).subscribe(res => {
        if (this.signDocumentService.requestIsSuccess(res)) {
          this.isAuthenVoffice = true;
        } else {
          this.isAuthenVoffice = false;
          this.f['vofficeUser'].setValue('');
          this.f['vofficePassword'].setValue('');
        }
      });
    } else {
      this.isAuthenVoffice = false;
    }
  }

  public onSignature() {
    if (!this.validateBeforeSave()) {
      return;
    }
    this.updateFromDataPage();
    let formSignerDocument = [];
    for (const key in this.mapDataPage) {
      formSignerDocument = formSignerDocument.concat(this.mapDataPage[key].data.listAssessmentEmployeeLevel);
    }
    this.app.confirmMessage('common.message.confirm.sign', () => {// on accepted
      const formSave = {};
      const saveData = this.formGroup.value;
      formSave['assessmentEmployeeLevelIds'] = this.assessmentEmployeeLevelIds;
      formSave['assessmentPeriodId'] = this.assessmentPeriodId;
      formSave['assessmentPartyorganizationId'] = this.partyOrganizationId;
      formSave['employeeId'] = this.employeeId;
      formSave['assessmentOrder'] = this.assessmentOrder;
      formSave['listSinger'] = this.mapDataSign;
      formSave['listSignerDocument'] = formSignerDocument;
      if (this.isSignAll) {
        this.employeeLevelServices.processSignAll(formSave).subscribe((res) => {
          if(res.type === RESPONSE_TYPE.SUCCESS) {
            const message = res.data.message;
            message && this.app.message(RESPONSE_TYPE.SUCCESS, message);
            this.onClose();
          }
        })
      } else {
        this.employeeLevelServices.sign(formSave).subscribe((res) => {
          if(res.type === RESPONSE_TYPE.SUCCESS) {
            this.onClose();
          }
        })
      }
    }, () => {

    });
  }

  public onClose() {
    if (this.isDraft) {
      this.router.navigate(['/assessment']);
    } else {
      this.router.navigate(['/employee/assessment/manager-field/assessment-period/member']);
    }
  }

  private validateBeforeSave(): boolean {
    const f1 = CommonUtils.isValidForm(this.formGroup);
    const f2 = CommonUtils.isValidForm(this.formSigner);
    const f3 = CommonUtils.isValidForm(this.formSignerDocument);
    return f1 && f2 && f3;
  }

  public setFormValue() {

  }
  onChangeEmployee(data, item: any) {
    this.loadUserVoffice(data.selectField, item, true);
  }

  //#203 start
  downloadTemplateSign(item) {
    switch (this.signType) {
      case 'party-member-decision':
        this.partyMemberDecisionService.exportSignTemplate(this.formGroup.controls['signDocumentId'].value, item.id).subscribe(
          res => {
              saveAs(res, item.name);
            }
        );
        break;
      default:
        this.signDocumentService.exportSignTemplate(this.signType, item.id).subscribe(
          res => {
            saveAs(res, item.name);
          }
        );
        break;
    }
  }

  onChangeSignImage(item) {
    if (!item.get('showSignImage').value == true) {
      item.get('signImageId').setValue(null);
      item.controls.signImageId.clearValidators();
      item.controls.signImageId.updateValueAndValidity();
    } else {
      item.controls.signImageId.setValidators(ValidationService.required);
      item.controls.signImageId.updateValueAndValidity();
    }
    // #211 start
    this.reMakeSignFileAttachmentFile();
    // #211 end
    this.reMakeSignerFileAttachmentFile();
  }
  setTitleSignInfor() {
    if (this.signType) {
      switch (this.signType) {
        case 'resolution-month':
          this.titleSignInfor = 'resolutionsMonth.titleSignInfor';
          break;
        case 'party-member-decision':
          this.partyMemberDecisionService.findBySignDocumentId(this.formGroup.controls['signDocumentId'].value).subscribe(res => {
            this.titleSignInfor = 'partyMemberDecision.signTitle.' + res.data.decisionType;
          })
          break;
        default:
          this.titleSignInfor = 'common.button.signInfor';
      }
    }
  }
  //#203 end

  // #211 start
  private reMakeSignFileAttachmentFile() {
    if (this.isFromAssessment && this.formSigner.value.length > 0) {
      const signerList = [];
      this.formSigner.value.forEach(signer => {
        if (signer['showSignImage']) {
          signerList.push(signer['employeeId']);
        }
      });
      if (signerList.length >= 0) {
        const reMakeFileForm = {
          signerList: signerList,
          signDocumentId: parseInt(this.formGroup.controls['signDocumentId'].value)
        }
        this.assessmentReport.makeSignFileAttachmentFile(reMakeFileForm)
          .subscribe(res => {
            if (this.assessmentReport.requestIsSuccess(res)) {
              const listSignFile = new FileControl(null, [Validators.required]);
              const attachedDocuments = new FileControl(null);
              if (res.data && res.data.fileAttachment) {
                if (res.data.fileAttachment.listSignFile) {
                  listSignFile.setFileAttachment(res.data.fileAttachment.listSignFile);
                }
                if (res.data.fileAttachment.attachedDocuments) {
                  attachedDocuments.setFileAttachment(res.data.fileAttachment.attachedDocuments);
                }
              }
              this.formGroup.removeControl('listSignFile');
              this.formGroup.removeControl('attachedDocuments');
              this.formGroup.addControl('listSignFile', listSignFile);
              this.formGroup.addControl('attachedDocuments', attachedDocuments);
            }
        })
      }
    }
  }
  // #211 end
  private reMakeSignerFileAttachmentFile() {
    if (this.isFromAssessmentSigner && this.formSigner.value.length > 0) {
      const signerList = [];
      this.formSigner.value.forEach(signer => {
        if (signer['showSignImage']) {
          signerList.push(signer['employeeId']);
        }
      });
      if (signerList.length >= 0) {
        const reMakeFileForm = {
          signerList: signerList,
          signDocumentId: parseInt(this.formGroup.controls['signDocumentId'].value)
        }
        this.assessmentReport.makeSignerFileAttachmentFile(reMakeFileForm)
          .subscribe(res => {
            if (this.assessmentReport.requestIsSuccess(res)) {
              const listSignFile = new FileControl(null, [Validators.required]);
              const attachedDocuments = new FileControl(null);
              if (res.data && res.data.fileAttachment) {
                if (res.data.fileAttachment.listSignFile) {
                  listSignFile.setFileAttachment(res.data.fileAttachment.listSignFile);
                }
                if (res.data.fileAttachment.attachedDocuments) {
                  attachedDocuments.setFileAttachment(res.data.fileAttachment.attachedDocuments);
                }
              }

              this.formGroup.removeControl('listSignFile');
              this.formGroup.removeControl('attachedDocuments');
              this.formGroup.addControl('listSignFile', listSignFile);
              this.formGroup.addControl('attachedDocuments', attachedDocuments);
            }
        })
      }
    }
  }
  preview() {
    if (!this.validateBeforeSave()) {
      return;
    }
    const formSave = {};
    const saveData = this.formGroup.value;
    formSave['assessmentEmployeeLevelIds'] = this.assessmentEmployeeLevelIds;
    formSave['listSinger'] = this.formSigner.value;
    formSave['assessmentOrder'] = this.assessmentOrder;
    formSave['listSignerDocument'] = this.formSignerDocument.value;
    this.employeeLevelServices.save(formSave).subscribe((res) => {
    })
    const modalRef = this.modalService.open(SignPreviewFileModalComponent, LARGE_MODAL_OPTIONS);
    modalRef.componentInstance.assessmentEmployeeLevelIds = this.assessmentEmployeeLevelIds;
  }
  previewFile(file) {
    const modalRef = this.modalService.open(ReportPreviewModalComponent, LARGE_MODAL_OPTIONS);
    modalRef.componentInstance.file = file;
  }
  updateFromDataPage() {
    const currentPage = this.resultList.page;
    this.mapDataPage[currentPage].data.listAssessmentEmployeeLevel = _.cloneDeep(this.formSignerDocument.value);
    this.mapDataSign = _.cloneDeep(this.formSigner.value);
  }
}