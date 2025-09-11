import { FileControl } from './../../../core/models/file.control';
import { CommonUtils, CryptoService, } from '@app/shared/services';
import { AppComponent } from './../../../app.component';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SignDocumentService } from '@app/core/services/sign-document/sign-document.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CategoryTypeService } from '@app/core/services/setting/category-type.service';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { TransferPartyMemberService } from '@app/core/services/party-organization/transfer-party-member.service';
import { ACTION_FORM } from '@app/core';

@Component({
  selector: 'sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})

export class SignComponent extends BaseComponent implements OnInit {
  formGroup: FormGroup;
  formSigner: FormArray;
  module: number;
  memberList: any[];
  files: any[];
  resultList: any;
  listCbb: any = [];
  listTextF: any = [];
  listMember: any[] = [];
  member: any;
  signType: string;
  isMobileScreen: boolean = false;
  formConfig = {
    signType: [null],
    signDocumentId: [''],
    extractingTextContent: ['', Validators.compose([Validators.required, Validators.maxLength(250)])],
    professions: [null, Validators.compose([Validators.required])],
    formalityText: [null, Validators.compose([Validators.required])],
    textSymbols: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
    vofficeUser: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
    vofficePassword: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
  };

  /**
   * contructor
   * @ param formBuilder
   */
  constructor(private formBuilder: FormBuilder,
    private appParamService: AppParamService,
    private categoryTypeService: CategoryTypeService,
    private app: AppComponent,
    private signDocumentService: SignDocumentService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private transferPartyMemberService: TransferPartyMemberService,
  ) {
    super(null, 'SIGN_DOCUMENT');
    const params = this.activatedRoute.snapshot.params;
    if (params && CommonUtils.isValidId(params.signType)) {
      this.signType = params.signType;
    }
    this.loadOptions();
    this.setFormValue();
    this.buildFormSigner(null);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }
  ngOnInit() {

  }

  ngAfterViewInit() {
    //$("input:text:visible:first").focus();
  }

  get f() {
    return this.formGroup.controls;
  }

  private buildForms(data?: any) {
    this.formGroup = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, []);
    const signFile = new FileControl(null, [Validators.required]);
    let fileAttachment = new FileControl(null);
    if (this.signType && this.signType === 'resolution-month') {
      fileAttachment = new FileControl(null, [Validators.required]);
    }
    const appendixFileForm = new FileControl(null);
    const attachedDocuments = new FileControl(null);
    if (data && data.fileAttachment) {
      if (data.fileAttachment.signFile) {
        signFile.setFileAttachment(data.fileAttachment.signFile);
      }
      if (data.fileAttachment.fileAttachment) {
        fileAttachment.setFileAttachment(data.fileAttachment.fileAttachment);
      }
      if (data.fileAttachment.appendixFileForm) {
        appendixFileForm.setFileAttachment(data.fileAttachment.appendixFileForm);
      }
      if (data.fileAttachment.attachedDocuments) {
        attachedDocuments.setFileAttachment(data.fileAttachment.attachedDocuments);
      }
    }
    this.formGroup.addControl('signFile', signFile);
    this.formGroup.addControl('fileAttachment', fileAttachment);
    this.formGroup.addControl('appendixFileForm', appendixFileForm);
    this.formGroup.addControl('attachedDocuments', attachedDocuments);
  }

  /**
   * buildFormSigner
   */
  private buildFormSigner(listSigner: any) {
    if (!listSigner) {
      listSigner = [{}];
    }
    const controls = new FormArray([]);
    for (const signer of listSigner) {
      const group = this.makeDefaultSignerForm();
      group.patchValue(signer);
      controls.push(group);
    }
    this.formSigner = controls;
  }

  /**
   * makeDefaultSignerForm
   */
  private makeDefaultSignerForm(): FormGroup {
    return this.formBuilder.group({
      employeeId: [null, Validators.compose([Validators.required])],
      userVofficeId: [null, Validators.compose([Validators.required])],
      signImageIndex: [null],
    });
  }

  /**
   * addSigner
   * param index
   * param item
   */
  public addSigner(index: number, item: FormGroup) {
    const controls = this.formSigner as FormArray;
    controls.insert(index + 1, this.makeDefaultSignerForm());
  }

  /**
   * removeSigner
   * param index
   * param item
   */
  public removeSigner(index: number, item: FormGroup) {
    const controls = this.formSigner as FormArray;
    if (controls.length === 1) {
      this.buildFormSigner(null);
    }
    controls.removeAt(index);

  }

  /**
   * upSigner
   * param index
   */
  public upSigner(index: number) {
    if (index === 0) {
      return;
    }
    const formArray = this.formSigner as FormArray;
    const signerTemp = formArray.controls[index];
    formArray.controls[index] = formArray.controls[index - 1];
    formArray.controls[index - 1] = signerTemp;
  }

  /**
   * downSigner
   * param index
   */
  public downSigner(index: number) {
    const formArray = this.formSigner as FormArray;
    if (index === formArray.length) {
      return;
    }
    const signerTemp = formArray.controls[index];
    formArray.controls[index] = formArray.controls[index + 1];
    formArray.controls[index + 1] = signerTemp;
  }

  /**
   * loadOptions
   */
  private loadOptions() {
    // Danh sách Ngành
    this.appParamService.appParams('SIGN_BRANCH').subscribe(res => {
      this.listCbb = [];
      this.listCbb = res.data
    });

    // Danh sách Hình thức văn bản
    this.appParamService.appParams('TEXT_FORM').subscribe(res => {
      this.listTextF = [];
      this.listTextF = res.data
    });
  }

  /**
   * loadUserVoffice
   */
  public loadUserVoffice(data, item: any) {
    this.signDocumentService.findVofficeUser(data.selectField).subscribe(res => {
      const listVofficeUser = [];
      for (const vofficeUser of res.data) {
        listVofficeUser.push({
          value: vofficeUser.adOrgId + '@' + vofficeUser.userId + '@' + vofficeUser.sysRoleId+ '@' + vofficeUser.adOrgName + '@' + vofficeUser.jobTile,
          label: vofficeUser.jobTile == null ? vofficeUser.adOrgName : vofficeUser.jobTile + ' - ' + vofficeUser.adOrgName
        });
      }
      item.listVofficeUser = listVofficeUser;
    });
  }

  /**
   * onSignature
   */
  public onSignature() {
    if (!this.validateBeforeSave()) {
      return;
    }
    const formSave = this.formGroup.value;
      formSave['listSigner'] = this.formSigner.value;
      formSave['vofficePassword'] =  CryptoService.encrAesEcb(this.f['vofficePassword'].value);

    this.app.confirmMessage('common.message.confirm.sign', () => {// on accepted
      this.signDocumentService.approval(formSave)
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
            } else if (formSave.signType === 'reward-propose') {
              this.router.navigate(['/reward/reward-propose']);
            } else {
              this.router.navigate(['/home-page']);
            }
          }
        });
    }, () => {
      // on rejected
    });
  }

  /**
   * onClose
   */
  public onClose() {
    if (this.signType) {
      if (this.signType === 'resolution-month') {
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
      } else if (this.signType === 'woman-mass-criteria-response') {
        this.router.navigate(['/mass/woman/mass-criteria-response']);
      } else if (this.signType === 'youth-mass-criteria-response') {
        this.router.navigate(['/mass/youth/mass-criteria-response']);
      } else if (this.signType === 'union-mass-criteria-response') {
        this.router.navigate(['/mass/union/mass-criteria-response']);
      } else if (this.signType === 'response-policy-program') {
        this.router.navigate(['/policy-program/response-policy-program']);
      } else if (this.signType === 'transfer-party-member') {
        this.router.navigate(['/party-organization/transfer-party-member']);
      } else if (this.signType === 'reward-propose') {
        this.router.navigate(['/reward/reward-propose']);
      } else {
        this.router.navigate(['/home-page']);
      }
    } else {
      this.router.navigate(['/home-page']);
    }
  }

  /**
   * validateBeforeSave
   */
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
        }
        this.buildForms(res.data);
        this.formGroup.controls['signType'].setValue(this.signType);
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
}