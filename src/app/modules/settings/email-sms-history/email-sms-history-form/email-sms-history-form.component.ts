import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS } from '@app/core/app-config';
import { GroupOrgPositionService } from '@app/core/services/group-org-position/group-org-position.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { GeneralStandardPositionGroupService } from '@app/core/services/setting/general-standard_position_group.service';
import { PrivateStandardPositionGroupService } from '@app/core/services/setting/private-standard_position_group.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { ValidationService } from '@app/shared/services/validation.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EmailSmsHistoryService} from "@app/core/services/setting/email-sms-history.service";
import {AppComponent} from "@app/app.component";
import {HelperService} from "@app/shared/services/helper.service";
import {FileControl} from "@app/core/models/file.control";

@Component({
  selector: 'email-sms-history-form',
  templateUrl: './email-sms-history-form.component.html',
  styleUrls: ['./email-sms-history-form.component.css']
})

export class EmailSmsHistoryFormComponent extends BaseComponent implements OnInit {
  formSave: any;
  isEdit: boolean = false;
  isView: boolean = false;
  isAdd: boolean = false;
  typeList: any;
  statusList: any;
  formConfig = {
    emailSmsHistoryId: [''],
    category: ['', [ValidationService.required]],
    type: ['', [ValidationService.required]],
    title: ['', [ValidationService.required]],
    content: ['', [ValidationService.required]],
    employeeId: ['', [ValidationService.required]],
    employeeCode: ['', [ValidationService.required]],
    employeeName: ['', [ValidationService.required]],
    status: [0, [ValidationService.required]],
  };

  constructor(
    public actr: ActivatedRoute,
    private router: Router,
    public app: AppComponent,
    private emailSmsHistoryService: EmailSmsHistoryService,
    private helperService: HelperService,
  ) {
    super();
    this.statusList = APP_CONSTANTS.STATUS_SEND
    this.typeList = APP_CONSTANTS.TYPE_SEND
    this.buildForms({});
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 2) {
      this.isView = subPaths[2] === 'email-sms-history-view';
      this.isEdit = subPaths[2] === 'email-sms-history-edit';
      this.isAdd = subPaths[2] === 'email-sms-history-add';
    }
    if(this.isView || this.isEdit){
      this.emailSmsHistoryService.findOne(Number(subPaths[3])).subscribe(res => {
        this.buildForms(res.data)
      })
    }
  }

  get f() {
    return this.formSave.controls;
  }

  /**
   * buildForm
   */
  private buildForms(data?: any): void {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT);
    const fileAttachment = new FileControl(null);
    if (data && data.fileAttachment) {
      if (data.fileAttachment.fileAttachment) {
        fileAttachment.setFileAttachment(data.fileAttachment.fileAttachment);
      }
    }
    this.formSave.addControl('fileAttachment', fileAttachment);
  }

  public goBack() {
    this.router.navigate(['/settings/email-sms-history']);
  }


  processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    let data = {
      emailSmsHistoryId: this.formSave.get('emailSmsHistoryId').value ? this.formSave.get('emailSmsHistoryId').value : '',
      category: this.formSave.get('category').value ? this.formSave.get('category').value : '',
      type: this.formSave.get('type').value ? this.formSave.get('type').value : '',
      title: this.formSave.get('title').value ? this.formSave.get('title').value : '',
      content: this.formSave.get('content').value ? this.formSave.get('content').value : '',
      employeeId: this.formSave.get('employeeId').value ? this.formSave.get('employeeId').value : '',
      employeeCode: this.formSave.get('employeeCode').value ? this.formSave.get('employeeCode').value : '',
      employeeName: this.formSave.get('employeeName').value ? this.formSave.get('employeeName').value : '',
      status: this.formSave.get('status').value ? this.formSave.get('status').value : '',
      }

    if (this.formSave.get('fileAttachment').value) {
      data['files'] = this.formSave.get('fileAttachment').value; // file attachment
    }
    this.app.confirmMessage(null, () => { // on accept
      this.emailSmsHistoryService.saveOrUpdateFormFile(data)
          .subscribe(res => {
            if (this.emailSmsHistoryService.requestIsSuccess(res)) {
              this.helperService.reloadHeaderNotification('complete');
              this.goBack()
            }
          });
      () => {

      }
    }, () => {
      // on rejected
    });
  }
}
