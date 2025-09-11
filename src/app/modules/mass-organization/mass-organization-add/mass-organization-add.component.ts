import { HelperService } from './../../../shared/services/helper.service';
import { ACTION_FORM } from '@app/core/app-config';
import { AppComponent } from './../../../app.component';
import { DocumentService } from '@app/core/services/document/document.service';
import { OrganizationService } from './../../../core/services/hr-organization/organization/organization.service';
import { MassOrganizationService } from '@app/core/services/mass-organization/mass-organization.service';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { FormGroup, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Router, ActivatedRoute } from '@angular/router';
import { FileControl } from '@app/core/models/file.control';

@Component({
  selector: 'mass-organization-add',
  templateUrl: './mass-organization-add.component.html',
  styleUrls: ['./mass-organization-add.component.css']
})
export class MassOrganizationAddComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  branch: any;
  view: boolean;
  massOrganizationId: any;
  typeList: any;
  lstFormOrgRelationConfig: FormArray;
  list: [];
  update: boolean;
  formconfig = {
    massOrganizationId: [''],
    parentId: [''],
    code: ['', [ValidationService.required]],
    name: ['', [ValidationService.required]],
    type: ['', [ValidationService.required]],
    employeeId: [''],
    phoneNumber: [''],
    email: [''],
    description: [''],
    effectiveDate: ['', [ValidationService.required]],
    expiredDate: ['', []],
    branch: [''],
    cateName: ['']
  }
  formOrgRelationConfig = {
    organizationId: ['', [ValidationService.required]],
    effectiveDate: [''],
    expiredDate: ['']
  };

  constructor(
    private MassOrganizationService: MassOrganizationService,
    private router: Router,
    public actr: ActivatedRoute,
    private orgService: OrganizationService,
    private documentService: DocumentService,
    private app: AppComponent,
    private helperService: HelperService
  ) {
    super();
    // this.branch = 1;
    const subPaths = this.router.url.split('/');
    if (subPaths.length >= 2) {
      if (subPaths[2] === 'organization-women') {
        this.branch = 1;
      }
      if (subPaths[2] === 'organization-youth') {
        this.branch = 2;
      }
      if (subPaths[2] === 'organization-union') {
        this.branch = 3;
      }
    }
    this.actr.params.subscribe(params => {
      if (params && params.id != null) {
        this.massOrganizationId = params.id;
      }
    });
    this.buildForms({});
    this.buildFormSaveConfig();
    // this.typeList = APP_CONSTANTS.TYPEORGANIZATION;
    this.f['branch'].setValue(this.branch);
    this.getTypeWithBranch(this.branch);

  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 3) {
      this.view = subPaths[3] === 'mass-organization-view';
    }
    this.setFormValue(this.massOrganizationId);
  }

  get f() {
    return this.formSave.controls;
  }

  public getTypeWithBranch(type: any) {
    this.MassOrganizationService.getTypeWithBranch(type).subscribe(res => {
      this.typeList = res.data;
    });
  }

  public buildForms(data?: any) {
    this.formSave = this.buildForm(data, this.formconfig, ACTION_FORM.INSERT,
      [ValidationService.notAffter('effectiveDate', 'expiredDate', 'massOrganization.check.expiredDate')]);
    const fileAttachment = new FileControl(null);
    if (data && data.fileAttachment) {
      if (data.fileAttachment.fileImage) {
        fileAttachment.setFileAttachment(data.fileAttachment.fileImage);
      }
    }
    this.formSave.addControl('fileImage', fileAttachment);
    this.formSave.controls.branch.setValue(this.branch)
    this.formSave.controls.massOrganizationId.setValue(this.massOrganizationId)
  }

  public setFormValue(data?: any) {
    if (data && data > 0) {
      this.MassOrganizationService.findOne(data)
        .subscribe(res => {
          this.buildForms(res.data);
          if (res.data.employeeId > 0) {
            this.genPhoneAndEmail({ selectField: res.data.employeeId });
          }
        });
      this.MassOrganizationService.lstMassMappingOrg(data)
        .subscribe(res => {
          this.list = res;
          this.buildFormSaveConfig(this.list);
        });
    }
  }

  // quay lai
  public goBack() {
    if (this.branch == 1) {
      this.router.navigate(['/mass/organization-women']);
      this.helperService.reloadTreeMass('complete');
    }
    if (this.branch == 2) {
      this.router.navigate(['/mass/organization-youth']);
      this.helperService.reloadTreeMass('complete');
    }
    if (this.branch == 3) {
      this.router.navigate(['/mass/organization-union']);
      this.helperService.reloadTreeMass('complete');
    }
  }

  public setDateInfo(item: FormGroup) {
    item.controls['effectiveDate'].setValue(null);
    item.controls['expiredDate'].setValue(null);
    this.orgService.findData(item.controls['organizationId'].value).subscribe(res => {
      if (this.documentService.requestIsSuccess(res)) {
        item.controls['effectiveDate'].setValue(res.data.effectiveStartDate);
        item.controls['expiredDate'].setValue(res.data.effectiveEndDate);
      }
    });
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
        group.controls["effectiveDate"].setValue(formTableConfig.effectiveStartDate);
        group.controls["expiredDate"].setValue(formTableConfig.effectiveEndDate);
        controls.push(group);
      }
      this.lstFormOrgRelationConfig = controls;
    }
  }
  private makeDefaultFormOrgRelationConfig(): FormGroup {
    const formGroup = this.buildForm({}, this.formOrgRelationConfig);
    return formGroup;
  }

  validateBeforeSave() {
    const isValidForm = CommonUtils.isValidForm(this.formSave);
    const isValidFormArray = CommonUtils.isValidForm(this.lstFormOrgRelationConfig);
    return isValidForm && isValidFormArray;
  }
  public processSaveOrUpdate() {
    if (!this.validateBeforeSave()) {
      return;
    }
    const formInput = {};
    formInput['massOrganizationForm'] = this.formSave.value;
    formInput['lstMassMappingOrgForm'] = this.lstFormOrgRelationConfig.value;
    this.app.confirmMessage('', () => { // accept
      this.MassOrganizationService.saveOrUpdateFormFile(formInput)
      .subscribe(res => {
          if (this.MassOrganizationService.requestIsSuccess(res) && res.data && res.data.massOrganizationId) {
            if (this.branch == 1) {
              this.router.navigate([`/mass/organization-women/mass-organization-view/${res.data.massOrganizationId}`]);
              this.helperService.reloadTreeMass('complete');
            }
            if (this.branch == 2) {
              this.router.navigate([`/mass/organization-youth/mass-organization-view/${res.data.massOrganizationId}`]);
              this.helperService.reloadTreeMass('complete');
            }
            if (this.branch == 3) {
              this.router.navigate([`/mass/organization-union/mass-organization-view/${res.data.massOrganizationId}`]);
              this.helperService.reloadTreeMass('complete');
            }
          }
        });
    }, () => { // reject

    });
  }

  public genCodeMass() { // gen name => code
    let temp;
    let code = "";
    let myName: Array<string> = [];
    myName = this.f['name'].value.split(" ");
    for (let i = 0; i < myName.length; i++) {
      temp = myName[i];
      code += temp.charAt(0);
    }
    code = code.toUpperCase();
    this.f['code'].setValue(CommonUtils.removeAccents(code).replace(/[^a-zA-Z|-]+/g, ""));
  }

  public genPhoneAndEmail(event: any) {
    if (event.selectField) {
      this.MassOrganizationService.getEmployee(event.selectField).subscribe(res => {
        this.formSave.controls['phoneNumber'].setValue(res.phoneNumber);
        this.formSave.controls['email'].setValue(res.email);
      });
    } else {
      this.formSave.controls['phoneNumber'].setValue(null);
      this.formSave.controls['email'].setValue(null);
    }
  }

  navigate() {
    if (this.branch == 1) {
      this.router.navigate(['/mass/organization-women/mass-organization-edit/', this.massOrganizationId]);
    }
    if (this.branch == 2) {
      this.router.navigate(['/mass/organization-youth/mass-organization-edit/', this.massOrganizationId]);
    }
    if (this.branch == 3) {
      this.router.navigate(['/mass/organization-union/mass-organization-edit/', this.massOrganizationId]);
    }
  }
}
