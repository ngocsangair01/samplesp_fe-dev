import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS, OrganizationService } from '@app/core';
import { DocumentService } from '@app/core/services/document/document.service';
import { ManagerPartyOrganizationService } from '@app/core/services/party-organization/manager-party-organization.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import {FileControl} from "@app/core/models/file.control";

@Component({
  selector: 'manager-party-org-view',
  templateUrl: './manager-party-org-view.component.html',
  styleUrls: ['./manager-party-org-view.component.css']
})
export class ManagerPartyOrgViewComponent extends BaseComponent implements OnInit  {
  partyOrganizationId: any;
  formInput: any;
  formSave: FormGroup;
  lstFormOrgRelationConfig: FormArray;
  lstTypeParty: any;
  formInfoConfig = {
    partyOrganizationId: [''],
    parentId: [''],
    type: ['',[ValidationService.required]],
    code: [''],
    name: ['',[ValidationService.required]],
    documentId: ['',[ValidationService.required]],
    foundingDate: [''],
    effectiveDate: ['',[ValidationService.required]],
    partyDecisionName: [''],
    coordinatorId: ['',ValidationService.required],
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
    order: ['']
  };

  formOrgRelationConfig = {
    organizationId: ['',[ValidationService.required]],
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
    private router: Router) {
    super(null, CommonUtils.getPermissionCode("resource.partyOrganization"));
    this.formSave = this.buildForm({}, this.formInfoConfig);
    this.buildFormSaveConfig();
    this.setMainService(managerPartyOrgService);

    this.actr.params.subscribe(params => {
      if (params && params.id != null) {
        this.partyOrganizationId = params.id;
      }
    });
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;

  }

  ngOnInit() {
    this.setFormValue(this.partyOrganizationId);
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

  get f () {
    return this.formSave.controls;
  }

  private makeDefaultFormOrgRelationConfig(): FormGroup {
    const formGroup = this.buildForm({}, this.formOrgRelationConfig);
    return formGroup;
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

  setDateInfo (item: FormGroup) {
      item.controls['effectiveDate'].setValue(null) ;
      item.controls['expiredDate'].setValue(null) ;
      this.orgService.findData(item.controls['organizationId'].value).subscribe(res => {
        if (this.documentService.requestIsSuccess(res)) {
          item.controls['effectiveDate'].setValue(res.data.effectiveStartDate) ;
          item.controls['expiredDate'].setValue(res.data.effectiveEndDate) ;
        }
      });
  }

  
  filterDataDocument () {
    // set null lai
    this.f.partyDecisionName.setValue(null);
    this.f.isActive.setValue(null);
    
    this.documentService.findByNumber(this.formSave.controls['documentId'].value).subscribe(res => {
      if (this.documentService.requestIsSuccess(res)) {
        this.f.partyDecisionName.setValue(res.data.partyDecisionName);
        this.f.isActive.setValue(res.data.isActive);
      }
    });
  }

  validateBeforeSave() {
    if(CommonUtils.isValidForm(this.formSave) && CommonUtils.isValidForm(this.lstFormOrgRelationConfig)){
      return true;
    }
    return false;
  }

  genCodeParty() { 
    let temp;
    let code ="";
    let myName: Array<string>  =[];
    myName = this.f.name.value.split(" ");
    for (let i = 0; i < myName.length; i++) {
        temp = myName[i];
        code += temp.charAt(0);
    }
    this.f.code.setValue(code);
  }

 /**
   * setFormValue
   * param data
   */
  public setFormValue(data?: any) {
    if (data && data > 0) {
      this.managerPartyOrgService.prepareSave(data)
        .subscribe(res => {
          this.formSave = this.buildForm(res.data.partyOrganizationForm, this.formInfoConfig);
          this.formSave.removeControl('fileImage');
          const filesControl = new FileControl(null);
          if (res.data && res.data.partyOrganizationForm && res.data.partyOrganizationForm.fileAttachment && res.data.partyOrganizationForm.fileAttachment.fileImage) {
            filesControl.setFileAttachment(res.data.partyOrganizationForm.fileAttachment.fileImage);
            this.formSave.addControl('fileImage', filesControl);
          }
          this.buildFormSaveConfig(res.data.lstPartyMappingOrgForm);
        })
    } else {
      this.formSave = this.buildForm({}, this.formInfoConfig);
      this.buildFormSaveConfig();
    }
  }

  navigate() {
    this.router.navigate(['/party-organization/party-organization-management/edit', this.partyOrganizationId]);
  }

}
