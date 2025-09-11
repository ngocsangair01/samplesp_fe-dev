import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { ResponseResolutionMonthService } from '@app/core/services/party-organization/response-resolution-month.service';
import { SignDocumentService } from '@app/core/services/sign-document/sign-document.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'response-resolution-month-form',
  templateUrl: './response-resolution-month-form.component.html',
})
export class ResponseResolutionMonthFormComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  responseResolutionsMonthId;
  templateFileSigns;
  signDocumentId;
  formConfig = {
    responseResolutionsMonthId: [null, [Validators.required]],
    reqName: [null],
    partyOrganizationName: [null],
    textSymbols: ['', [Validators.required ,Validators.maxLength(100)]],
    promulgateDate: [null],
    extractingTextContent: ['', [Validators.required, Validators.maxLength(250)]],
    issuedResolution: ['1'],
    title: [' '],
  }
  public isView: boolean = false;
  constructor(
    private router: Router,
    public actr: ActivatedRoute,
    private responseResolutionMonthService: ResponseResolutionMonthService,
    private signDocumentService: SignDocumentService,
    private app: AppComponent,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.requestResolutionMonth"));
    this.buildForms({});
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.responseResolutionsMonthId = params.id;
        }
      }
    });
    if (this.actr.snapshot.paramMap.get('view') === 'view') {
      this.isView = true;
    }
  }

  ngOnInit() {
    this.setFormValue(this.responseResolutionsMonthId);
  }

  buildForms(data?) {
    if (data.reqName && data.partyOrganizationName) {
      data.title = data.reqName + '_' + data.partyOrganizationName;
    }
    if (data.partyOrganizationCode) {
      data.textSymbols =  '-NQ/CB-DU.' + data.partyOrganizationCode;
    }
    if (!data.extractingTextContent || data.extractingTextContent == ''){
      data.extractingTextContent = data.reqName + '_' + data.partyOrganizationName;
    }
    this.formSave = this.buildForm(data, this.formConfig);
    const reportFileControl = new FileControl(null, [Validators.required]);
    if (data && data.fileAttachment && data.fileAttachment.reportFile) {
      reportFileControl.setFileAttachment(data.fileAttachment.reportFile);
    }
    this.formSave.addControl('reportFile', reportFileControl);
    const signFile = new FileControl(null, [Validators.required]);
    if (data && data.fileAttachment && data.fileAttachment.signFile) {
      signFile.setFileAttachment(data.fileAttachment.signFile);
    }
    this.formSave.addControl('signFile', signFile);
  }

  get f() {
    return this.formSave.controls;
  }

  processSaveOrUpdate() {
    if (this.f['issuedResolution'].value){
      if (!this.f['promulgateDate'].value){
        this.f['promulgateDate'].setErrors({'required': true});
      }
    } else {
      this.f['promulgateDate'].setErrors(null);
    }
    if (!CommonUtils.isValidForm(this.formSave)) {
      return
    }
    this.app.confirmMessage(null,
      () => { // accept
        if(this.formSave.value.issuedResolution){
          this.formSave.value.documentStatus = 5;
        } else {
          this.formSave.value.documentStatus = 0;
        }
        this.responseResolutionMonthService.saveOrUpdateFormFile(this.formSave.value).subscribe(
          res => {
            if (this.responseResolutionMonthService.requestIsSuccess(res)) {
              this.goBack();
            }
          }
        );
      }, () => { } // reject
    );
  }

  public goBack() {
    this.router.navigate(['/party-organization/response-resolutions-month']);
  }

  setFormValue(responseResolutionsMonthId) {
    if (responseResolutionsMonthId > 0) {
      this.responseResolutionMonthService.findBeanById(responseResolutionsMonthId).subscribe(
        res => {
          if (res.data) {
            this.templateFileSigns = res.data['templateFileSigns'] || [];
            this.buildForms(res.data);
            this.signDocumentId = res.data.signDocumentId;
          }
        }
      );
    }
  }
  downloadTemplateSign(item) {
    this.signDocumentService.exportSignTemplate('resolution-month', item.id).subscribe(
      res => {
        saveAs(res, item.name);
      }
    );
  }
}
