import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, OrganizationService } from '@app/core';
import { DocumentService } from '@app/core/services/document/document.service';
import { ManagerPartyOrganizationService } from '@app/core/services/party-organization/manager-party-organization.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { FileControl } from '@app/core/models/file.control';
import { Thickness } from '@syncfusion/ej2-ng-diagrams';

@Component({
  selector: 'manager-party-org-form',
  templateUrl: './manager-party-org-form.component.html',
  styleUrls: ['./manager-party-org-form.component.css']
})
export class ManagerPartyOrgFormComponent extends BaseComponent implements OnInit {
  partyOrganizationId: any;
  formInput: any;
  formSave: FormGroup;
  lstFormOrgRelationConfig: FormArray;
  lstTypeParty: any;
  isUpdate: boolean;
  isInsert: boolean;
  formInfoConfig = {
    partyOrganizationId: [''],
    parentId: [''],
    type: ['', [ValidationService.required]],
    code: [''],
    name: ['', [ValidationService.required, ValidationService.maxLength(200)]],
    documentId: ['', [ValidationService.required]],
    foundingDate: ['', [ValidationService.required]],
    effectiveDate: ['', [ValidationService.required]],
    expritedDate: [''],
    partyDecisionName: [''],
    isActive: [''],
    coordinatorId: [''],
    // Đầu mối nghị quyết
    authorizationId: [''],
    //  Đầu mối bí thư
    secretaryId: [''],
    //  Đầu mối phó bí thư
    deputySecretaryId: [''],
    // đầu mối đề nghị thanh toán
    partyRequesterId: [''],
    //  Ban hành ngoài Voffice
    isSignOutVoffice: [''],
    fileImage: [''],
    order: ['',  [ValidationService.required]]
  };

  formOrgRelationConfig = {
    organizationId: ['', [ValidationService.required]],
    effectiveDate: [''],
    expiredDate: ['']
  };
  isMobileScreen: boolean = false;

  constructor(
    private categoryService: CategoryService,
    public actr: ActivatedRoute,
    private orgService: OrganizationService,
    private documentService: DocumentService,
    private managerPartyOrgService: ManagerPartyOrganizationService,
    private app: AppComponent,
    // private activeModal: NgbActiveModal,
    private router: Router) {
    super(null, CommonUtils.getPermissionCode("resource.partyOrganization"));
    this.actr.params.subscribe(params => {
      if (params && params.id != null) {
        this.partyOrganizationId = params.id;
      }
    });

    this.formSave = this.buildForm({}, this.formInfoConfig, ACTION_FORM.INSERT,
      [ValidationService.notAffter('foundingDate', 'effectiveDate', 'partyOrganization.noAfterEffect')]);

    this.buildFormSaveConfig();
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    this.setFormValue(this.partyOrganizationId);
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 3) {
      this.isUpdate = subPaths[3] === 'edit';
      this.isInsert = subPaths[3] === 'add';
    }
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.LOAI_HINH_TO_CHUC_DANG).subscribe(res => {
      this.lstTypeParty = res.data;
    });
    // this.lstTypeParty = [
    //   {id: 1, name: "Đảng bộ TĐ"},
    //   {id: 2, name: "Đảng bộ TCVTT"},
    //   {id: 3, name: "DBCS"}
    // ]
  }

  public goBack() {
    this.router.navigate(['/party-organization/party-organization-management']);
  }

  get f() {
    return this.formSave.controls;
  }

  private makeDefaultFormOrgRelationConfig(): FormGroup {
    const formGroup = this.buildForm({}, this.formOrgRelationConfig);
    return formGroup;
  }

  public addRow(index: number, item: FormGroup) {
    const controls = this.lstFormOrgRelationConfig as FormArray;
    controls.insert(index + 1, this.makeDefaultFormOrgRelationConfig());
  }

  public removeRow(index: number, item: FormGroup) {
    const controls = this.lstFormOrgRelationConfig as FormArray;
    if (controls.length === 1) {
      this.buildFormSaveConfig();
      const group = this.makeDefaultFormOrgRelationConfig();
      controls.push(group);
      this.lstFormOrgRelationConfig = controls;
    }
    controls.removeAt(index);
  }

  private buildFormSaveConfig(list?: any) {
    if (!list || list.length == 0) {
      this.lstFormOrgRelationConfig = new FormArray([this.makeDefaultFormOrgRelationConfig()]);
    } else {
      const controls = new FormArray([]);
      for (const i in list) {
        const formTableConfig = list[i];
        const group = this.makeDefaultFormOrgRelationConfig();
        group.patchValue(formTableConfig);
        controls.push(group);
      }
      this.lstFormOrgRelationConfig = controls;
    }
  }

  processSaveOrUpdate() {
    if (!this.validateBeforeSave()) {
      return;
    }
    const formInput = {};
    if(!this.formSave.value.fileImage){
      this.formSave.removeControl('fileImage');
    }

    formInput['partyOrganizationForm'] = this.formSave.value;
    formInput['lstPartyMappingOrgForm'] = this.lstFormOrgRelationConfig.value;
    
    this.app.confirmMessage('', () => {// on accept
      this.managerPartyOrgService.saveOrUpdateFormFile(formInput)
        .subscribe(res => {
          if (this.managerPartyOrgService.requestIsSuccess(res) && res.data && res.data.partyOrganizationId) {
            // this.activeModal.close(res);
            this.router.navigate([`/party-organization/party-organization-management/view/${res.data.partyOrganizationId}`]);
          }
        });
    }, () => {// on rejected

    });
  }

  setDateInfo(item: FormGroup) {
    item.controls['effectiveDate'].setValue(null);
    item.controls['expiredDate'].setValue(null);
    this.orgService.findData(item.controls['organizationId'].value).subscribe(res => {
      if (this.documentService.requestIsSuccess(res)) {
        item.controls['effectiveDate'].setValue(res.data.effectiveStartDate);
        item.controls['expiredDate'].setValue(res.data.effectiveEndDate);
      }
    });
  }


  filterDataDocument() {
    // set null lai
    this.f.partyDecisionName.setValue(null);

    this.documentService.findByNumber(this.formSave.controls['documentId'].value).subscribe(res => {
      if (this.documentService.requestIsSuccess(res)) {
        this.f.partyDecisionName.setValue(res.data.partyDecisionName);
      }
    });
  }

  validateBeforeSave() {
    const isValidForm = CommonUtils.isValidForm(this.formSave);
    const isValidFormArray = CommonUtils.isValidForm(this.lstFormOrgRelationConfig);
    return isValidFormArray && isValidForm;
  }

  genCodeParty() {
    let temp;
    let code = "";
    let myName: Array<string> = [];
    myName = this.f.name.value.split(" ");
    for (let i = 0; i < myName.length; i++) {
      temp = myName[i];
      code += temp.charAt(0);
    }
    code = code.toUpperCase();
    this.f.code.setValue(CommonUtils.removeAccents(code).replace(/[^a-zA-Z]+/g, ""));
  }

  /**
   * setFormValue
   * param data
   */
  public setFormValue(data?: any) {
    if (data && data > 0) {
      this.managerPartyOrgService.prepareSave(data)
        .subscribe(res => {
          // this.buildForms(res.data);
          this.formSave = this.buildForm(res.data.partyOrganizationForm, this.formInfoConfig, ACTION_FORM.INSERT,
            [ValidationService.notAffter('foundingDate', 'effectiveDate', 'partyOrganization.noAfterEffect'),
            ValidationService.notAffter('effectiveDate', 'expritedDate', 'partyOrganization.noAfterExpired')]);
            this.formSave.removeControl('fileImage');
            const filesControl = new FileControl(null);
            if (res.data && res.data.partyOrganizationForm && res.data.partyOrganizationForm.fileAttachment && res.data.partyOrganizationForm.fileAttachment.fileImage) {
              filesControl.setFileAttachment(res.data.partyOrganizationForm.fileAttachment.fileImage);
              this.formSave.addControl('fileImage', filesControl);
            }
                  this.buildFormSaveConfig(res.data.lstPartyMappingOrgForm);
        })
    } else {
      this.formSave = this.buildForm({}, this.formInfoConfig, ACTION_FORM.INSERT,
        [ValidationService.notAffter('foundingDate', 'effectiveDate', 'partyOrganization.noAfterEffect'),
        ValidationService.notAffter('effectiveDate', 'expritedDate', 'partyOrganization.noAfterExpired')]);
      this.buildFormSaveConfig();
    }
  }
}
