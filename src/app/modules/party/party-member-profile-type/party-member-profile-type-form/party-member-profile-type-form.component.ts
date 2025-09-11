import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { PartyMemberProfileTypeService } from '@app/core/services/party-member-profile-type/party-member-profile-type.service';
import { FormGroup, Validators } from '@angular/forms';
import { FileControl } from '@app/core/models/file.control';
import { CategoryService } from '@app/core/services/setting/category.service';
import { APP_CONSTANTS } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '@app/app.component';

@Component({
  selector: 'party-member-profile-type-form',
  templateUrl: './party-member-profile-type-form.component.html',
  styleUrls: ['./party-member-profile-type-form.component.css']
})
export class PartyMemberProfileTypeFormComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  groupOptions: [];
  partyMemberProfileTypeId: any;
  isMobileScreen: boolean = false;
  formConfig = {
    partyMemberProfileTypeId: [''],
    symbol: [null, [Validators.maxLength(50), ValidationService.required]],
    name: [null, [Validators.maxLength(200), ValidationService.required]],
    groupId: [null, [ValidationService.required]],
    status: [null, [ValidationService.required]],
    hardCopy: [null, [ValidationService.required]],
    sortOrder: [null, [ValidationService.required, ValidationService.positiveInteger]],
    officePromulgateTemplate: [null, [Validators.maxLength(200)]]
  };
  constructor(
    public partyMemberProfileTypeService: PartyMemberProfileTypeService,
    private categoryService: CategoryService,
    public actr: ActivatedRoute,
    private router: Router,
    private app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyMemberProfileType"));
    const params = this.actr.snapshot.params;
    if (params) {
      this.partyMemberProfileTypeId = params.id;
    } 
    this.setMainService(partyMemberProfileTypeService);
    this.buildForms({});
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.PARTY_MEMBER_PROFILE_TYPE_GROUP_TYPE).subscribe(res => {
      this.groupOptions = res.data;
    });
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    if (this.partyMemberProfileTypeId && this.partyMemberProfileTypeId > 0) {
      this.partyMemberProfileTypeService.findOne(this.partyMemberProfileTypeId).subscribe(
        res => {
          if (this.partyMemberProfileTypeService.requestIsSuccess(res)) {
            this.buildForms(res.data);
          } else {
            this.goBack();
          }
        }
      );
    }
  }

  get f() {
    return this.formSave.controls;
  }

  buildForms(data) {
    this.formSave = this.buildForm(data, this.formConfig);
    const fileControl = new FileControl(null, ValidationService.required);
    if (data && data.fileAttachment && data.fileAttachment.fileAttachments) {
      fileControl.setFileAttachment(data.fileAttachment.fileAttachments);
    }
    this.formSave.addControl('fileAttachments', fileControl);
  }

  processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.app.confirmMessage(null
      , () => {
        this.partyMemberProfileTypeService.saveOrUpdateFormFile(this.formSave.value).subscribe(
          res => {
            if (this.partyMemberProfileTypeService.requestIsSuccess(res) && res.data && res.data.partyMemberProfileTypeId) {
              this.goEdit(res.data.partyMemberProfileTypeId);
            }
          }
        );
      }
      , () => {}
    );
  }

  goBack() {
    this.router.navigate(['/party-organization/party-member-profile-type']);
  }

  goEdit(partyMemberProfileTypeId: any) {
    this.router.navigate([`/party-organization/party-member-profile-type/edit/${partyMemberProfileTypeId}`]);
  }

}
