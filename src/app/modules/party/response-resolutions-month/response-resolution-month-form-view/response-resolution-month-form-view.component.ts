import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { ResponseResolutionMonthService } from '@app/core/services/party-organization/response-resolution-month.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import * as moment from 'moment';

@Component({
  selector: 'response-resolution-month-form-view',
  templateUrl: './response-resolution-month-form-view.component.html',
  styleUrls: ['./response-resolution-month-form-view.component.css']
})
export class ResponseResolutionMonthFormViewComponent extends BaseComponent implements OnInit {
  formView: FormGroup;
  responseResolutionsMonthId;
  formConfig = {
    implementDate: [''],
    massOrganizationEmployee: [''],
    responseResolutionsMonthId: [''],
    finishDate: [''],
    requestDate: [''],
    reqName: [''],
    partyOrganizationName: [''],
    partyOrganizationCode: [''],
    actualFinishDate: [''],
    extractingTextContent: [''],
    textSymbols: [' '],
    status: ['']
  };
  title ='';
  reportFile = [];
  resolutionFile = [];
  constructor(
    private router: Router,
    public actr: ActivatedRoute,
    private responseResolutionMonthService: ResponseResolutionMonthService,
    private fileStorage: FileStorageService,
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
  }

  ngOnInit() {
    this.setFormValue(this.responseResolutionsMonthId);
  }

  buildForms(data?) {
    const RESOLUTION_MONTH_STATUS = [
      { value: 0, lable: "Chưa yêu cầu" },
      { value: 1, lable: "Không thực hiện" },
      { value: 2, lable: "Ban hành quá hạn" },
      { value: 3, lable: "Ban hành đúng hạn" },
      { value: 4, lable: "Ban hành bổ sung" },
    ];
    if (data.status) {
      data.status = RESOLUTION_MONTH_STATUS[data.status].lable;
    }
    if (data.reqName && data.partyOrganizationName) {
      this.title = data.reqName + '_' + data.partyOrganizationName;
    }
    this.formView = this.buildForm(data, this.formConfig);
    const reportFileControl = new FileControl(null, [Validators.required]);
    if (data && data.fileAttachment && data.fileAttachment.reportFile) {
      reportFileControl.setFileAttachment(data.fileAttachment.reportFile);
    }
    this.formView.addControl('reportFile', reportFileControl);
    const resolutionFile = new FileControl(null, [Validators.required]);
    if (data && data.fileAttachment && data.fileAttachment.signFile) {
      resolutionFile.setFileAttachment(data.fileAttachment.signFile);
    }
    this.formView.addControl('resolutionFile', resolutionFile);
  }

  get f() {
    if (this.formView){
      return this.formView.controls;
    }
  }
  public goBack() {
    this.router.navigate(['/party-organization/response-resolutions-month']);
  }
  public downloadFile(fileData) {
    this.fileStorage.downloadFile(fileData.secretId).subscribe(res => {
      saveAs(res, fileData.fileName);
    });
  }
  setFormValue(responseResolutionsMonthId) {
    if (responseResolutionsMonthId > 0) {
      this.responseResolutionMonthService.findBeanById(responseResolutionsMonthId).subscribe(
        res => {
          if (res.data) {
            if (res.data.actualFinishDate) {
              res.data.actualFinishDate = moment(new Date(res.data.actualFinishDate)).format('DD/MM/YYYY');
            }
            if (res.data.implementDate) {
              res.data.implementDate = moment(new Date(res.data.implementDate)).format('DD/MM/YYYY');
            }
            if (res.data.finishDate) {
              res.data.finishDate = moment(new Date(res.data.finishDate)).format('DD/MM/YYYY');
            }
            if (res.data.massOrganizationEmployee) {
              const i = res.data.massOrganizationEmployee.indexOf('@');
              res.data.massOrganizationEmployee = res.data.massOrganizationEmployee.substr(0, i) + ')';
            }
            this.reportFile = res.data.fileAttachment.reportFile;
            this.resolutionFile = res.data.fileAttachment.signFile;
            this.buildForms(res.data);
          }
        }
      );
    }
  }
}
