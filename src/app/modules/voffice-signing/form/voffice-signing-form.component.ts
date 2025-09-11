import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import {
  ACTION_FORM,
  APP_CONSTANTS,
  DEFAULT_MODAL_OPTIONS,
  LARGE_MODAL_OPTIONS,
  MEDIUM_MODAL_OPTIONS,
  SMALL_MODAL_OPTIONS
} from '@app/core';
import { FileControl } from '@app/core/models/file.control';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { AssessmentReportService } from '@app/core/services/assessment-party-organization/assessment-report.service';
import { PartyMemberDecisionService } from '@app/core/services/party-organization/party-member-decision.service';
import { TransferPartyMemberService } from '@app/core/services/party-organization/transfer-party-member.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { SignDocumentService } from '@app/core/services/sign-document/sign-document.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, CryptoService, ValidationService } from '@app/shared/services';
import { MultiDocumentPickerComponent } from './document-picker/multi-document-picker.component';
import { VofficeSigningPreviewModalComponent } from '@app/modules/voffice-signing/preview-modal/voffice-signing-preview-modal.component';

import { TransferAutoTabComponent } from './transfer-auto-tab/transfer-auto-tab.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {PassSignModalComponent} from "@app/modules/voffice-signing/passSign-modal/pass-sign-modal.component";
@Component({
  selector: 'voffice-signing-form',
  templateUrl: './voffice-signing-form.component.html',
  styleUrls: ['./voffice-signing-form.component.css']
})
export class VofficeSigningFormComponent extends BaseComponent {
  @ViewChild('transferAutoTab')
  transferAutoTab: TransferAutoTabComponent;
  @ViewChild('multiDocumentPicker')
  multiDocumentPicker: MultiDocumentPickerComponent;

  formGroup: FormGroup;
  formSigner: FormArray;
  module: number;
  memberList: any[];
  files: any[];
  resultList: any;
  listCbb: any = [];
  listTextF: any = [];
  listMember: any[] = [];
  listConfidentiality: any[] = [];
  member: any;
  signType: string;
  //#203 start
  isDefaultValue: boolean = false;
  templateFileSigns: any[] = [];
  titleSignInfor = 'common.button.signInfor';
  backUrl = null;
  isMultibleFile: boolean = false;
  isAuthenVoffice: boolean = false;
  isMobileScreen: boolean = false;
  //#203 end
  lstPromulgate: any[] = [];
  formFile = {
    appendixFileForm: [],
    attachedDocuments: [],
    fileAttachment: [],
    listSignFile: [],
    signFile: []
  }
  formConfig = {
    signType: [null],
    signDocumentId: [''],
    extractingTextContent: ['', Validators.compose([Validators.required, Validators.maxLength(250)])],
    professions: [null, Validators.compose([Validators.required])],
    formalityText: [null, Validators.compose([Validators.required])],
    confidentiality: [null, Validators.compose([Validators.required])],
    textSymbols: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
    vofficeUser: ['', Validators.compose([Validators.maxLength(100)])],
    vofficePassword: ['', Validators.compose([Validators.maxLength(100)])],
    numberNoteSigner: [''],
    isAutoPromulgate: [''], // Ban hành tự động
    isAutoTransferDocuemnt: [''], // Tự động chuyển văn bản
  };

  disableSignTypes: ['report-submission', 'reward-propose-sign', 'reward-propose']; // danh sách loại trình ký chặn chặn thêm, xóa file phụ lục

  constructor(private formBuilder: FormBuilder,
    private appParamService: AppParamService,
    private app: AppComponent,
    private signDocumentService: SignDocumentService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private transferPartyMemberService: TransferPartyMemberService,
    private categoryService: CategoryService,
    private partyMemberDecisionService: PartyMemberDecisionService,
    private assessmentReport: AssessmentReportService,
    private modalService: NgbModal,
  ) {
    super(null, 'SIGN_DOCUMENT');
    const params = this.activatedRoute.snapshot.params;
    if (params && CommonUtils.isValidId(params.signType)) {
      this.signType = params.signType;
    }
    this.loadOptions();
    this.setFormValue();
    this.buildFormSigner();
    //#203 start
    this.setTitleSignInfor();
    //#203 end
    const { state } = this.router.getCurrentNavigation().extras;
    if (state && state.backUrl) {
      this.backUrl = state.backUrl;
    }
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  get f() {
    return this.formGroup.controls;
  }

  private buildForms(data?: any) {
    this.formGroup = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, []);
    const signFile = new FileControl(null, [Validators.required]);
    const listSignFile = new FileControl(null, [Validators.required]);
    const attachedDocuments = new FileControl(null);
    const appendixFileForm = new FileControl(null);
    if (data && data.fileAttachment) {
      if (data.fileAttachment.signFile) {
        signFile.setFileAttachment(data.fileAttachment.signFile);
        this.formFile.signFile = data.fileAttachment.signFile
      }
      if (data.fileAttachment.listSignFile) {
        listSignFile.setFileAttachment(data.fileAttachment.listSignFile);
        this.formFile.listSignFile = data.fileAttachment.listSignFile.filter((item) => {
          return item.id && item.id > 0;
        })
      }
      if (data.fileAttachment.attachedDocuments) {
        attachedDocuments.setFileAttachment(data.fileAttachment.attachedDocuments);
        this.formFile.attachedDocuments = data.fileAttachment.attachedDocuments.filter((item) => {
          return item.id && item.id > 0;
        })
      }
      if (data.fileAttachment.appendixFileForm) {
        appendixFileForm.setFileAttachment(data.fileAttachment.appendixFileForm);
        this.formFile.appendixFileForm = data.fileAttachment.appendixFileForm.filter((item) => {
          return item.id && item.id > 0;
        })
      }
    }
    // Điều kiện check mode trình ký nhiều file hay 1 file
    if(this.isMultibleFile){
      this.formGroup.addControl('listSignFile', listSignFile);
    } else {
      this.formGroup.addControl('signFile', signFile);
    }
    this.formGroup.addControl('attachedDocuments', attachedDocuments);

    this.formGroup.addControl('appendixFileForm', appendixFileForm);
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
      //#203 end
    });
  }

  public addSigner(index: number) {
    const controls = this.formSigner as FormArray;
    controls.insert(index + 1, this.makeDefaultSignerForm());
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
    const signerTempValue = formArray.value[index];
    const signerTempControls = formArray.controls[index];
    formArray.value[index] = formArray.value[index - 1];
    formArray.value[index - 1] = signerTempValue;
    formArray.controls[index] = formArray.controls[index - 1];
    formArray.controls[index - 1] = signerTempControls;

    //#211 start
    this.reMakeSignFileAttachmentFile();
    // #211 end
    this.reMakeSignerFileAttachmentFile();
  }

  public downSigner(index: number) {
    const formArray = this.formSigner as FormArray;
    if (index === formArray.length) {
      return;
    }
    const signerTempValue = formArray.value[index];
    const signerTempControls = formArray.controls[index];
    formArray.value[index] = formArray.value[index + 1];
    formArray.value[index + 1] = signerTempValue;
    formArray.controls[index] = formArray.controls[index + 1];
    formArray.controls[index + 1] = signerTempControls;

    // #211 start
    this.reMakeSignFileAttachmentFile();
    // #211 end
    this.reMakeSignerFileAttachmentFile();
  }

  private loadOptions() {
    // Danh sách Ngành
    this.appParamService.appParams('SIGN_BRANCH').subscribe(res => {
      this.listCbb = [];
      this.listCbb = res.data;
    });

    // Danh sách Hình thức văn bản
    this.appParamService.appParams('TEXT_FORM').subscribe(res => {
      this.listTextF = [];
      this.listTextF = res.data;
    });

    // Danh sách Độ mật
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.CONFIDENTIALITY).subscribe(res => {
        this.listConfidentiality = [];
        this.listConfidentiality = res.data;
    });
  }

  loadUserVoffice(selectField, item: any, isFirstLoad?: boolean) {
    if (selectField) {
      this.signDocumentService.findVofficeUser(selectField).subscribe(res => {
        const listVofficeUser = [];
        for (const vofficeUser of res.data) {
          listVofficeUser.push({
            value: vofficeUser.adOrgId + '@' + vofficeUser.userId + '@' + vofficeUser.sysRoleId+ '@' + vofficeUser.adOrgName + '@' + vofficeUser.jobTile,
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
          if (isFirstLoad && item.signatureImages.length > 0) {
            item.get('signImageId').setValue(item.signatureImages[0].staffImageSignId);
            item.get('showSignImage').setValue(1);
            // #211 start
            this.reMakeSignFileAttachmentFile();
            // #211 end
            this.reMakeSignerFileAttachmentFile();
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
    //this.f['vofficeUser'].setValidators([Validators.required, Validators.maxLength(100)]);
    //this.f['vofficeUser'].updateValueAndValidity();
    //this.f['vofficePassword'].setValidators([Validators.required, Validators.maxLength(100)]);
    //this.f['vofficePassword'].updateValueAndValidity();
    if (!this.validateBeforeSave()) {
      return;
    }
    this.app.confirmMessage('common.message.confirm.sign', () => {// on accepted
      const formSave = this.formGroup.value;

      formSave['listSigner'] = this.formSigner.value;
      formSave['vofficePassword'] = CryptoService.encrAesEcb(this.f['vofficePassword'].value);
       // #209 Bổ sung danh sách nhận văn bản cho trình ký RNQ
       if(this.isFromResolution) {
        formSave['listTransferAuto'] = this.transferAutoTab? this.transferAutoTab.getAllDataList() : [];
        formSave['lstDocumentAttachment'] = this.multiDocumentPicker? this.multiDocumentPicker.getAllData() : [];
      }
      // #209 end
      // #211 Start
      if (this.isFromAssessment) {
        formSave['lstDocumentAttachment'] = this.multiDocumentPicker? this.multiDocumentPicker.getAllData() : [];
      }
      // #211 end
      if (this.isFromAssessmentSigner) {
        formSave['lstDocumentAttachment'] = this.multiDocumentPicker? this.multiDocumentPicker.getAllData() : [];
      }
      this.signDocumentService.sign(formSave)
        .subscribe(res => {
          if (this.signDocumentService.requestIsSuccess(res)) {
            if (this.backUrl) {
              this.router.navigate([this.backUrl], {state: {activetTab: 2}});
            } else if (formSave.signType === 'resolution-month') {
              this.router.navigate(['/party-organization/response-resolutions-month']);
            } else if (formSave.signType === 'democratic-meeting') {
              this.router.navigate(['/population/democratic-meeting']);
            } else if (formSave.signType === 'reward-proposal') {
              this.router.navigate(['/propaganda/reward-proposal']);
            } else if (formSave.signType === 'reward-decide') {
              this.router.navigate(['/propaganda/reward-decide']);
            } else if (formSave.signType === 'reward-request-payment') {
              this.router.navigate(['/propaganda/reward-request-payment']);
            } else if (formSave.signType === 'quality-analysis-party-member') {
              this.router.navigate(['/party-organization/quality-analysis-party-member']);
            } else if (formSave.signType === 'import-quality-analysis-party-org') {
              this.router.navigate(['/party-organization/quality-analysis-party-organization']);
            } else if (formSave.signType === 'import-reward-party-org') {
              this.router.navigate(['/party-organization/reward-party-organization']);
            } else if (formSave.signType === 'import-reward-party-member') {
              this.router.navigate(['/party-organization/reward-party-member']);
            } else if (formSave.signType === 'woman-mass-criteria-response') {
              this.router.navigate(['/mass/woman/mass-criteria-response']);
            } else if (formSave.signType === 'youth-mass-criteria-response') {
              this.router.navigate(['/mass/youth/mass-criteria-response']);
            } else if (formSave.signType === 'union-mass-criteria-response') {
              this.router.navigate(['/mass/union/mass-criteria-response']);
            } else if (formSave.signType === 'response-policy-program') {
              this.router.navigate(['/policy-program/response-policy-program']);
            } else if (formSave.signType === 'transfer-party-member') {
              this.router.navigate(['/party-organization/transfer-party-member']);
            } else if (formSave.signType === 'party-member-decision') {
              this.router.navigate(['/party-organization/party-member-decision']);
            } else if (formSave.signType === 'assessment-party-organization') {
              this.router.navigate(['/party-organization/assessment-party-organization']);
            } else if (formSave.signType === 'emp-army-proposed') {
              this.router.navigate(['/employee/emp-army-proposed']);
            } else if (formSave.signType === 'assessment-party-signer') {
              this.router.navigate(['/party-organization/assessment-party-signer']);
            }  else if (formSave.signType === 'subsidized-suggest') {
              this.router.navigate(['/subsidized/subsidized-suggest']);
            }  else if (formSave.signType === 'report-submission') {
              this.router.navigate(['/report/report-submission']);
            } else if (formSave.signType === 'reward-propose') {
              this.router.navigate(['/reward/reward-propose']);
            } else if (formSave.signType === 'reward-propose-sign') {
              this.router.navigate(['/reward/reward-propose-sign']);
            } else if (formSave.signType === 'welfare-policy-proposal') {
                this.router.navigate(['/population/welfare-policy-proposal']);
            } else if (formSave.signType === 'allowance-proposal-sign') {
                this.router.navigate(['/population/allowance-proposal-sign']);
            }else if (formSave.signType === 'allowance-proposal') {
                this.router.navigate(['/population/allowance-proposal']);
            } else if (this.signType === 'competition-registration') {
                this.router.navigate(['/competition-unit-registration']);
            } else if (this.signType === 'competition-result') {
                this.router.navigate(['/competition-unit-registration']);
            } else {
              this.router.navigate(['/home-page']);
            }
          }
        });
    }, () => {
      // on rejected
    });
  }

  public onClose() {
    if (this.signType) {
      if (this.backUrl) {
        this.router.navigate([this.backUrl], {state: {activetTab: 2}});
      } else if (this.signType === 'resolution-month') {
        this.router.navigate(['/party-organization/response-resolutions-month']);
      } else if (this.signType === 'democratic-meeting') {
        this.router.navigate(['/population/democratic-meeting']);
      } else if (this.signType === 'reward-proposal') {
        this.router.navigate(['/propaganda/reward-proposal']);
      } else if (this.signType === 'reward-decide') {
        this.router.navigate(['/propaganda/reward-decide']);
      } else if (this.signType === 'reward-request-payment') {
        this.router.navigate(['/propaganda/reward-request-payment']);
      } else if (this.signType === 'quality-analysis-party-member') {
        this.router.navigate(['/party-organization/quality-analysis-party-member']);
      } else if (this.signType === 'import-quality-analysis-party-org') {
        this.router.navigate(['/party-organization/quality-analysis-party-organization']);
      } else if (this.signType === 'import-reward-party-org') {
        this.router.navigate(['/party-organization/reward-party-organization']);
      } else if (this.signType === 'import-reward-party-member') {
        this.router.navigate(['/party-organization/reward-party-member']);
      } else if (this.signType === 'mass-criteria-response') {
        this.router.navigate(['/mass/woman/mass-criteria-response']);
      } else if (this.signType === 'response-policy-program') {
        this.router.navigate(['/policy-program/response-policy-program']);
      } else if (this.signType === 'transfer-party-member') {
        this.router.navigate(['/party-organization/transfer-party-member']);
      } else if (this.signType === 'party-member-decision') {
        this.router.navigate(['/party-organization/party-member-decision']);
      } else if (this.signType === 'assessment-party-organization') {
        this.router.navigate(['/party-organization/assessment-party-organization']);
      } else if (this.signType === 'emp-army-proposed') {
        this.router.navigate(['/employee/emp-army-proposed']);
      } else if (this.signType === 'assessment-party-signer') {
        this.router.navigate(['/party-organization/assessment-party-signer']);
      } else if (this.signType === 'subsidized-suggest') {
        this.router.navigate(['/subsidized/subsidized-suggest']);
      } else if (this.signType === 'report-submission') {
        this.router.navigate(['/report/report-submission']);
      } else if (this.signType === 'reward-propose-sign') {
        this.router.navigate(['/reward/reward-propose-sign']);
      } else if (this.signType === 'reward-propose') {
        this.router.navigate(['/reward/reward-propose']);
      } else if (this.signType === 'competition-registration') {
        this.router.navigate(['/competition-unit-registration']);
      } else if (this.signType === 'welfare-policy-proposal') {
        this.router.navigate(['/population/welfare-policy-proposal']);
      }else if (this.signType === 'allowance-proposal-sign') {
        this.router.navigate(['/population/allowance-proposal-sign']);
      }else if (this.signType === 'allowance-proposal') {
        this.router.navigate(['/population/allowance-proposal']);
      }else if (this.signType === 'competition-result') {
        this.router.navigate(['/competition-unit-registration']);
      } else {
        this.router.navigate(['/home-page']);
      }
    } else {
      this.router.navigate(['/home-page']);
    }
  }

  private validateBeforeSave(): boolean {
    const f1 = CommonUtils.isValidForm(this.formGroup);
    const f2 = CommonUtils.isValidForm(this.formSigner);
    return f1 && f2;
  }

  public setFormValue() {
    this.buildForms({});
    const params = this.activatedRoute.snapshot.params;
    if (params && CommonUtils.isValidId(params.signDocumentId)) {
      this.formGroup.controls['signDocumentId'].setValue(parseInt(params.signDocumentId));
    }
    if (this.signType) {
      this.formGroup.controls['signType'].setValue(this.signType);
    }
    this.signDocumentService.findOneAndGetFile({
      signType: this.formGroup.controls['signType'].value,
      signDocumentId: parseInt(this.formGroup.controls['signDocumentId'].value)
    }).subscribe(res => {
      if (res.data) {
        if (res.data['formalityText'] != null) {
          res.data['formalityText'] = res.data['formalityText'].toString();
        }
        if (res.data['professions'] != null) {
          res.data['professions'] = res.data['professions'].toString();
        }else {
          res.data['professions'] = "623"
        }

        if (res.data['confidentiality'] != null) {
          res.data['confidentiality'] = res.data['confidentiality'];
        }else {
          res.data['confidentiality'] = 1
        }

        if (res.data['isAutoPromulgate'] != null) {
          res.data['isAutoPromulgate'] = res.data['isAutoPromulgate'];
        }else {
          res.data['isAutoPromulgate'] = 1
        }


        //#203 start
        this.isDefaultValue = res.data['defaultValue'] || false;
        this.templateFileSigns = res.data['templateFileSigns'] || [];
        this.isMultibleFile = res.data['multibleFile'] || false
        //#203 end
        // 209 start
        this.lstPromulgate = res.data['lstSignDocumentPromulgateBO'] || [];
        if(this.isFromResolution || this.isFromAssessment || this.isFromAssessmentSigner) { // #211 modify
          this.multiDocumentPicker.buildFormSaveConfig(res.data['lstDocumentAttachmentBO']);
        }
        //
        this.buildForms(res.data);
        this.formGroup.controls['signType'].setValue(this.signType);

        if (res.data.signerDocuments) {
          this.buildFormSigner(res.data.signerDocuments);
          for (let control of this.formSigner.controls) {
            this.loadUserVoffice(control.get('employeeId').value, control);
          }
        }
      }
    })
  }

  processDownloadTransferPartyMemberTemplate() {
    this.transferPartyMemberService.exportSignTemplate(this.f['signDocumentId'].value).subscribe(
      res => {
        saveAs(res, 'transfer_party_member.pdf');
      }
    );
  }

  saveOrUpdate() {
    this.f['vofficeUser'].clearValidators();
    this.f['vofficeUser'].updateValueAndValidity();
    this.f['vofficePassword'].clearValidators();
    this.f['vofficePassword'].updateValueAndValidity();
    if (!this.validateBeforeSave()) {
      return;
    }

    this.app.confirmMessage('common.message.confirm.save', () => {// on accepted
      const formSave = this.formGroup.value;
      formSave['attachedDocumentsOld'] = this.formFile.attachedDocuments
      formSave['listSignFileOld'] = this.formFile.listSignFile
      formSave['signFileOld'] = this.formFile.signFile
      formSave['listSigner'] = this.formSigner.value;
      formSave['vofficePassword'] = CryptoService.encrAesEcb(this.f['vofficePassword'].value);
      formSave['appendixFileFormOld'] = this.formFile.appendixFileForm
      // #209 Bổ sung danh sách nhận văn bản cho trình ký RNQ
      if(this.isFromResolution) {
        formSave['listTransferAuto'] = this.transferAutoTab? this.transferAutoTab.getAllDataList() : [];
        formSave['lstDocumentAttachment'] = this.multiDocumentPicker? this.multiDocumentPicker.getAllData() : [];
      }
      // #209 end
      // #211 start
      if (this.isFromAssessment) {
        formSave['lstDocumentAttachment'] = this.multiDocumentPicker? this.multiDocumentPicker.getAllData() : [];
      }
      // #211 end
      if (this.isFromAssessmentSigner) {
        formSave['lstDocumentAttachment'] = this.multiDocumentPicker? this.multiDocumentPicker.getAllData() : [];
      }

      this.signDocumentService.saveOrUpdateFormFile(formSave)
        .subscribe(res => {
          if (this.signDocumentService.requestIsSuccess(res)) {
            if (formSave.signType === 'resolution-month') {
              this.router.navigate(['/party-organization/response-resolutions-month']);
            } else if (formSave.signType === 'democratic-meeting') {
              this.router.navigate(['/population/democratic-meeting']);
            } else if (formSave.signType === 'reward-proposal') {
              this.router.navigate(['/propaganda/reward-proposal']);
            } else if (formSave.signType === 'reward-decide') {
              this.router.navigate(['/propaganda/reward-decide']);
            } else if (formSave.signType === 'reward-request-payment') {
              this.router.navigate(['/propaganda/reward-request-payment']);
            } else if (formSave.signType === 'quality-analysis-party-member') {
              this.router.navigate(['/party-organization/quality-analysis-party-member']);
            } else if (formSave.signType === 'import-quality-analysis-party-org') {
              this.router.navigate(['/party-organization/quality-analysis-party-organization']);
            } else if (formSave.signType === 'import-reward-party-org') {
              this.router.navigate(['/party-organization/reward-party-organization']);
            } else if (formSave.signType === 'import-reward-party-member') {
              this.router.navigate(['/party-organization/reward-party-member']);
            } else if (formSave.signType === 'woman-mass-criteria-response') {
              this.router.navigate(['/mass/woman/mass-criteria-response']);
            } else if (formSave.signType === 'youth-mass-criteria-response') {
              this.router.navigate(['/mass/youth/mass-criteria-response']);
            } else if (formSave.signType === 'union-mass-criteria-response') {
              this.router.navigate(['/mass/union/mass-criteria-response']);
            } else if (formSave.signType === 'response-policy-program') {
              this.router.navigate(['/policy-program/response-policy-program']);
            } else if (formSave.signType === 'transfer-party-member') {
              this.router.navigate(['/party-organization/transfer-party-member']);
            } else if (formSave.signType === 'party-member-decision') {
              this.router.navigate(['/party-organization/party-member-decision']);
            } else if (formSave.signType === 'assessment-party-organization') {
              this.router.navigate(['/party-organization/assessment-party-organization']);
            } else if (formSave.signType === 'assessment-party-signer') {
              this.router.navigate(['/party-organization/assessment-party-signer']);
            } else if (formSave.signType === 'subsidized-suggest') {
              this.router.navigate(['/subsidized/subsidized-suggest']);
            } else if (formSave.signType === 'report-submission') {
              this.router.navigate(['/report/report-submission']);
            } else if (formSave.signType === 'reward-propose') {
              this.router.navigate(['/reward/reward-propose']);
            } else if (formSave.signType === 'reward-propose-sign') {
              this.router.navigate(['/reward/reward-propose-sign']);
            } else if (this.signType === 'competition-result') {
              this.router.navigate(['/competition-unit-registration']);
            } else if (this.signType === 'competition-registration') {
              this.router.navigate(['/competition-unit-registration']);
            } else if (formSave.signType === 'welfare-policy-proposal') {
              this.router.navigate(['/population/welfare-policy-proposal']);
            }else if (formSave.signType === 'allowance-proposal-sign') {
              this.router.navigate(['/population/allowance-proposal-sign']);
            }else if (formSave.signType === 'allowance-proposal') {
              this.router.navigate(['/population/allowance-proposal']);
            }else if (formSave.signType === 'emp-army-proposed') {
              this.router.navigate(['/employee/emp-army-proposed']);
            } else {
              this.router.navigate(['/home-page']);
            }
          }
        });
    }, () => {
      // on rejected
    });
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

  // onUploadSignFile() {
  //   const formSave = this.formGroup.value;
  //   if (formSave.signFile != null) {
  //       this.signDocumentService.countSignNote(formSave)
  //       .subscribe(res => {
  //         console.log('countSignNote', res);
  //         this.formGroup.get('numberNoteSigner').setValue(res.data);
  //       });
  //   }
  // }

  // validateNumberNoteSigner() {
  //   var numberSignerReq = this.formGroup.get('numberNoteSigner').value;
  //   var numberSignerSelected = this.formSigner.value.length;
  //   var numberImageSign = this.formSigner.value.filter(x => x.signImageId).length;
  //   if (numberSignerReq != 0 && numberSignerReq > numberSignerSelected) {
  //       this.app.errorMessage('vofficeSigning.validate.numberSignerSelected', numberSignerReq || '0');
  //       return false;
  //   } else if (numberImageSign != numberSignerReq) {
  //       this.app.errorMessage('vofficeSigning.validate.numberSignImage', numberSignerReq || '0');
  //       return false;
  //   }
  //   return true;
  // }

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
    this.f['vofficeUser'].clearValidators();
    this.f['vofficeUser'].updateValueAndValidity();
    this.f['vofficePassword'].clearValidators();
    this.f['vofficePassword'].updateValueAndValidity();
    if (!this.validateBeforeSave()) {
      return;
    }
      const formSave = this.formGroup.value;
      formSave['listSigner'] = this.formSigner.value;
      formSave['vofficePassword'] = CryptoService.encrAesEcb(this.f['vofficePassword'].value);
      // #209 Bổ sung danh sách nhận văn bản cho trình ký RNQ
      if(this.isFromResolution) {
        formSave['listTransferAuto'] = this.transferAutoTab? this.transferAutoTab.getAllDataList() : [];
        formSave['lstDocumentAttachment'] = this.multiDocumentPicker? this.multiDocumentPicker.getAllData() : [];
      }
      // #209 end
      // #211 start
      if (this.isFromAssessment) {
        formSave['lstDocumentAttachment'] = this.multiDocumentPicker? this.multiDocumentPicker.getAllData() : [];
      }
      // #211 end
      if (this.isFromAssessmentSigner) {
        formSave['lstDocumentAttachment'] = this.multiDocumentPicker? this.multiDocumentPicker.getAllData() : [];
      }
      this.signDocumentService.saveOrUpdateFormFile(formSave)
       .subscribe(res => {
        if (this.signDocumentService.requestIsSuccess(res)) {
          this.setFormValue();
          const modalRef = this.modalService.open(VofficeSigningPreviewModalComponent, LARGE_MODAL_OPTIONS);
          modalRef.componentInstance.id = formSave.signDocumentId;
        }
    })
  }

  /**
   * Chặn thao tác thêm, xóa file phụ lục khi trình ký
   */
  disableActionFileAppendix() {
    return this.disableSignTypes.some(el => el === this.signType);
  }


  passSign() {
    // this.f['vofficeUser'].clearValidators();
    // this.f['vofficeUser'].updateValueAndValidity();
    // this.f['vofficePassword'].clearValidators();
    // this.f['vofficePassword'].updateValueAndValidity();
    if (!this.validateBeforeSave()) {
      return;
    }
    const modalRef = this.modalService.open(PassSignModalComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      else {
          const formSave = this.formGroup.value;
          formSave['promulgateDate'] = result.promulgateDate
          formSave['promulgateEmployeeId'] = result.employeeId
          formSave['decisionNumber'] = result.decisionNumber
          formSave['attachedDocumentsOld'] = this.formFile.attachedDocuments
          formSave['listSignFileOld'] = this.formFile.listSignFile
          formSave['signFileOld'] = this.formFile.signFile
          formSave['listSigner'] = this.formSigner.value;
          formSave['vofficePassword'] = CryptoService.encrAesEcb(this.f['vofficePassword'].value);
          formSave['appendixFileFormOld'] = this.formFile.appendixFileForm
          // #209 Bổ sung danh sách nhận văn bản cho trình ký RNQ
          if(this.isFromResolution) {
            formSave['listTransferAuto'] = this.transferAutoTab? this.transferAutoTab.getAllDataList() : [];
            formSave['lstDocumentAttachment'] = this.multiDocumentPicker? this.multiDocumentPicker.getAllData() : [];
          }
          // #209 end
          // #211 start
          if (this.isFromAssessment) {
            formSave['lstDocumentAttachment'] = this.multiDocumentPicker? this.multiDocumentPicker.getAllData() : [];
          }
          // #211 end
          if (this.isFromAssessmentSigner) {
            formSave['lstDocumentAttachment'] = this.multiDocumentPicker? this.multiDocumentPicker.getAllData() : [];
          }
          console.log("formSave", formSave);

          this.signDocumentService.passSign(formSave).subscribe(res => {
                if (this.signDocumentService.requestIsSuccess(res)) {
                  if (formSave.signType === 'resolution-month') {
                    this.router.navigate(['/party-organization/response-resolutions-month']);
                  } else if (formSave.signType === 'democratic-meeting') {
                    this.router.navigate(['/population/democratic-meeting']);
                  } else if (formSave.signType === 'reward-proposal') {
                    this.router.navigate(['/propaganda/reward-proposal']);
                  } else if (formSave.signType === 'reward-decide') {
                    this.router.navigate(['/propaganda/reward-decide']);
                  } else if (formSave.signType === 'reward-request-payment') {
                    this.router.navigate(['/propaganda/reward-request-payment']);
                  } else if (formSave.signType === 'quality-analysis-party-member') {
                    this.router.navigate(['/party-organization/quality-analysis-party-member']);
                  } else if (formSave.signType === 'import-quality-analysis-party-org') {
                    this.router.navigate(['/party-organization/quality-analysis-party-organization']);
                  } else if (formSave.signType === 'import-reward-party-org') {
                    this.router.navigate(['/party-organization/reward-party-organization']);
                  } else if (formSave.signType === 'import-reward-party-member') {
                    this.router.navigate(['/party-organization/reward-party-member']);
                  } else if (formSave.signType === 'woman-mass-criteria-response') {
                    this.router.navigate(['/mass/woman/mass-criteria-response']);
                  } else if (formSave.signType === 'youth-mass-criteria-response') {
                    this.router.navigate(['/mass/youth/mass-criteria-response']);
                  } else if (formSave.signType === 'union-mass-criteria-response') {
                    this.router.navigate(['/mass/union/mass-criteria-response']);
                  } else if (formSave.signType === 'response-policy-program') {
                    this.router.navigate(['/policy-program/response-policy-program']);
                  } else if (formSave.signType === 'transfer-party-member') {
                    this.router.navigate(['/party-organization/transfer-party-member']);
                  } else if (formSave.signType === 'party-member-decision') {
                    this.router.navigate(['/party-organization/party-member-decision']);
                  } else if (formSave.signType === 'assessment-party-organization') {
                    this.router.navigate(['/party-organization/assessment-party-organization']);
                  } else if (formSave.signType === 'assessment-party-signer') {
                    this.router.navigate(['/party-organization/assessment-party-signer']);
                  } else if (formSave.signType === 'subsidized-suggest') {
                    this.router.navigate(['/subsidized/subsidized-suggest']);
                  } else if (formSave.signType === 'report-submission') {
                    this.router.navigate(['/report/report-submission']);
                  } else if (formSave.signType === 'reward-propose') {
                    this.router.navigate(['/reward/reward-propose']);
                  } else if (formSave.signType === 'reward-propose-sign') {
                    this.router.navigate(['/reward/reward-propose-sign']);
                  } else if (this.signType === 'competition-result') {
                    this.router.navigate(['/competition-unit-registration']);
                  } else if (this.signType === 'competition-registration') {
                    this.router.navigate(['/competition-unit-registration']);
                  } else if (formSave.signType === 'welfare-policy-proposal') {
                    this.router.navigate(['/population/welfare-policy-proposal']);
                  }else if (formSave.signType === 'allowance-proposal-sign') {
                    this.router.navigate(['/population/allowance-proposal-sign']);
                  }else if (formSave.signType === 'allowance-proposal') {
                    this.router.navigate(['/population/allowance-proposal']);
                  }else if (formSave.signType === 'emp-army-proposed') {
                    this.router.navigate(['/employee/emp-army-proposed']);
                  }else {
                    this.router.navigate(['/home-page']);
                  }
                }
              });
      }
    });
    // modalRef.componentInstance.id = formSave.signDocumentId;
    //
    // this.app.confirmMessage('common.message.confirm.save', () => {// on accepted

    // }, () => {
    //   // on rejected
    // });
  }
}
