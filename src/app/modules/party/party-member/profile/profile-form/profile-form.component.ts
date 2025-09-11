import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { EmployeeInfoService } from './../../../../../core/services/employee-info/employee-info.service';
import { PartyMemberProfileService } from './../../../../../core/services/party-member-profile/party-member-profile.service';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { FormGroup, Validator, Validators } from '@angular/forms';
import { FileControl } from '@app/core/models/file.control';
import { ACTION_FORM } from '@app/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '@app/app.component';
import { PartyMemberProfileTypeService } from '@app/core/services/party-member-profile-type/party-member-profile-type.service';

@Component({
  selector: 'profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})
export class ProfileFormComponent extends BaseComponent implements OnInit {
  employeeId: any;
  partyMemberProfileTypeName: string;
  standardName: string;
  isMobileScreen: boolean = false;
  formSave: FormGroup;
  formConfig = {
    partyMemberProfileId: [''],
    employeeId: ['', ValidationService.required],
    partyMemberProfileTypeId: ['', [ValidationService.required]],
    textSymbols: ['', [ValidationService.maxLength(100)]],
    extractingTextContent: ['', [ValidationService.maxLength(250)]],
    promulgateStatus: [''],
    promulgateDate: [''],
    partyOrganizationId: ['', [ValidationService.required]]
  }
  constructor(
    public activeModal: NgbActiveModal,
    private partyMemberProfileService: PartyMemberProfileService,
    private partyMemberProfileTypeService: PartyMemberProfileTypeService,
    private curriculumVitaeService: CurriculumVitaeService,
    private app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyMemberProfile"));
    this.setMainService(partyMemberProfileService);
    this.formSave = this.buildForm({}, this.formConfig);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
  }

  get f () {
    return this.formSave.controls;
  }

  private buildForms(data?: any): void {
    const fileAttachMents = new FileControl(null);
    const file = new FileControl(null, [Validators.required])
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, []);
    this.formSave.addControl('fileAttachMents', fileAttachMents);
    this.formSave.addControl('file', file);
  }

  public setFormValue(data: any) {
    // get infor on title
    this.employeeId = data.employeeId
    this.partyMemberProfileTypeService.findOne(data.partyMemberProfileTypeId).subscribe(resProfileType => {
      this.curriculumVitaeService.getEmployeeInfoById(data.employeeId).subscribe(res => {
        this.standardName = ` của ${res.data.fullName} (${res.data.email.split('@')[0]})`;
        this.partyMemberProfileTypeName = resProfileType.data.name;
      })
    })
    this.buildForms(data);
    this.buildFormFile(data);
  }

  /**
   * build form file
   * @param data include file and fileAttachments
   */
  private buildFormFile(data) {
    // buld file
    const file = new FileControl(null, [Validators.required]);
    this.formSave.addControl('file', file);
    if (data.files) {
      (this.formSave.controls['file'] as FileControl).setFileAttachment(data.files);
    }
    // build fileAttachments
    const fileAttachments = new FileControl(null);
    this.formSave.addControl('fileAttachments', fileAttachments);
    if (data && data.fileAttachment && data.fileAttachment.fileAttachments) {
      (this.formSave.controls['fileAttachments'] as FileControl).setFileAttachment(data.fileAttachment.fileAttachments);
    }
  }

  /**
   * processSaveOrUpdate
   * @param formData
   */
  processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.app.confirmMessage(null, () => { // on accepted
      this.partyMemberProfileService.saveOrUpdateFormFile(this.formSave.value).subscribe(
        res => {
          if (this.partyMemberProfileService.requestIsSuccess(res)) {
            this.activeModal.close(res)
          }
        }
      );
    }, () => {
    });
  }

  processOnchangePromulgateStatus() {
    if (this.formSave.controls['promulgateStatus'].value) {
      this.formSave.removeControl('promulgateDate');
      const promulgateDate = new FileControl(null, [Validators.required]);
      this.formSave.addControl('promulgateDate', promulgateDate);
    } else {
      this.formSave.removeControl('promulgateDate');
      const promulgateDate = new FileControl(null, []);
      this.formSave.addControl('promulgateDate', promulgateDate);
    }
  }

}
