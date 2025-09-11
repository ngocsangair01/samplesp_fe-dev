import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { TemplateNotifyService } from '@app/core/services/admin/template-notify.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { ValidationService } from '@app/shared/services/validation.service';

@Component({
  selector: 'template-notify-form',
  templateUrl: './template-notify-form.component.html',
})
export class TemplateNotifyFormComponent extends BaseComponent implements OnInit {
  templateNotifyId: any;
  isView = false;
  isUpdate = false;
  isInsert = false;
  isRequirePartyOrg = false;
  formSave : any;
  formConfig = {
    templateNotifyId: [''],
    code: ['', [ValidationService.required, ValidationService.maxLength(50)]],
    name: ['', [ValidationService.required, ValidationService.maxLength(255)]],
    organizationId: ['', [ValidationService.required, ValidationService.maxLength(50)]],
    smsContent: ['', [ValidationService.maxLength(1000)]],
    emailSubject: ['', [ValidationService.maxLength(500)]],
    emailContentFile: [''],
    emailContent: ['',],
    fileName: [''],
    templateNotifySqlList: [''],
    listTempLateFile: [''],
    arrTemplateNotifySqlIds: ['']
  };
  arrTemplateNotifySqlIds: any;
  lstFormSqlConfig: FormArray;
  formSqlConfig = {
    sqlQuery: [''],
    templateNotifyId: [''],
    templateNotifySqlId: [''],
  };

  constructor(
    private templateNotifyService: TemplateNotifyService,
    public actr: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private app: AppComponent) {
    super(null, CommonUtils.getPermissionCode("resource.document"));
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.templateNotifyId = params.id;
        } else {
          this.setFormValue({});
        }
      }
    });
    this.buildFormSaveConfig();
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (this.activatedRoute.snapshot.paramMap.get('view') === 'view') {
      this.isView = true;
    }
    this.setFormValue(this.templateNotifyId);
  }

  get f() {
    return this.formSave.controls;
  }

  /**
   * buildForm
   */
  private buildForms(data?: any): void {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT);

  }

  /**
   * setFormValue
   * param data
   */
  public setFormValue(data?: any) {
    this.buildForms({});
    if (data && data > 0) {
      let type;
      if (this.isView) {
        type = 'view';
      } else {
        type = 'notView';
      }
      this.templateNotifyService.findOne(data)
        .subscribe(res => {
          this.buildForms(res.data);
          this.buildFormSaveConfig(res.data.templateNotifySqlList);
        });
    }
  }

  processSaveOrUpdate() {
    if (!this.formSave.get('emailContent').value && !this.formSave.get('emailContentFile').value) {
      this.formSave.removeControl('emailContentFile');
      this.formSave.addControl('emailContentFile', new FormControl(null));
    }
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.formSave.get('arrTemplateNotifySqlIds').setValue(this.arrTemplateNotifySqlIds)
    this.formSave.get('templateNotifySqlList').setValue(this.lstFormSqlConfig.value);
    this.app.confirmMessage(null, () => { // on accepted
      this.templateNotifyService.saveOrUpdateFormFile(this.formSave.value)
        .subscribe(res => {
          if (this.templateNotifyService.requestIsSuccess(res)) {
            this.goBack();
          }
        });
    }, () => {

    });
  }

  public goBack() {
    this.router.navigate(['/admin/template-notify']);
  }

  private makeDefaultFormSqlConfig(): FormGroup {
    const formGroup = this.buildForm({}, this.formSqlConfig);
    return formGroup;
  }

  public addRow(index: number, item: FormGroup) {
    const controls = this.lstFormSqlConfig as FormArray;
    controls.insert(index + 1, this.makeDefaultFormSqlConfig());
  }

  public removeRow(index: number, item: FormGroup) {
    const controls = this.lstFormSqlConfig as FormArray;
    if (controls.length === 1) {
      this.buildFormSaveConfig();
      const group = this.makeDefaultFormSqlConfig();
      controls.push(group);
      this.lstFormSqlConfig = controls;
    }

    if (item.value.templateNotifySqlId != "" && item.value.templateNotifySqlId != undefined) {
      if (this.arrTemplateNotifySqlIds == undefined || this.arrTemplateNotifySqlIds == "") {
        this.arrTemplateNotifySqlIds = item.value.templateNotifySqlId;
      } else {
        this.arrTemplateNotifySqlIds += "," + item.value.templateNotifySqlId;
      }
    }
    controls.removeAt(index);
  }

  private buildFormSaveConfig(list?: any) {
    if (!list || list.length == 0) {
      this.lstFormSqlConfig = new FormArray([this.makeDefaultFormSqlConfig()]);
    } else {
      const controls = new FormArray([]);
      for (const i in list) {
        const formTableConfig = list[i];
        const group = this.makeDefaultFormSqlConfig();
        group.patchValue(formTableConfig);
        controls.push(group);
      }
      this.lstFormSqlConfig = controls;
    }
  }

  
  public downloadFile(templateNotifyId) {
    const url = `${this.templateNotifyService.serviceUrl}/email-content/${templateNotifyId}`;
    window.location.href = url;
  }

  b64toBlob(b64Data: any, contentType: any, sliceSize: any){
    contentType = contentType || "";
    var sliceSize = sliceSize || 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
  
    for (
      var offset = 0;
      offset < byteCharacters.length;
      offset += sliceSize
    ) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
  
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      var byteArray = new Uint8Array(byteNumbers);
  
      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };
}