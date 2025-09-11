import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { FileControl } from '@app/core/models/file.control';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { DocumentTypesService } from '@app/core/services/document-types/document-types.service';
import { DocumentService } from '@app/core/services/document/document.service';
import { HrStorage } from '@app/core/services/HrStorage';
import { CategoryService } from '@app/core/services/setting/category.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { ValidationService } from '@app/shared/services/validation.service';

@Component({
  selector: 'document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.css']
})
export class DocumentFormComponent extends BaseComponent implements OnInit {
  downLoadFile: Boolean;
  arrUserEmail: any;
  nameUserEmail: any;
  documentId: any;
  formSave: FormGroup;
  typeList: any;
  partyOrganizationIdOld: any;
  confidentialityList: any;
  branchList: any;
  documentTypeList: any;
  isView = false;
  isUpdate = false;
  isInsert = false;
  isRequirePartyOrg = false;
  isMobileScreen: boolean = false;
  formConfig = {
    documentId: [''],
    documentTypeId: ['', []],
    documentNumber: ['', [ValidationService.required, Validators.maxLength(100)]],
    name: ['', [ValidationService.required, ValidationService.maxLength(200)]],
    partyOrganizationId: [null, [ValidationService.maxLength(20)]],
    signerId: ['', [ValidationService.maxLength(20)]],
    type: ['', [ValidationService.required, ValidationService.maxLength(4)]],
    confidentiality: ['', [ValidationService.required, ValidationService.maxLength(4)]],
    branch: ['', [ValidationService.required, ValidationService.maxLength(4)]],
    effectiveDate: ['', []],
    expritedDate: [''],
    isPublic: [0],
    organizationId: ['', [ValidationService.required]],
  };

  constructor(
    private documentService: DocumentService,
    private documentTypesService: DocumentTypesService,
    private categoryService: CategoryService,
    public actr: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private app: AppComponent,
    private appParamService: AppParamService) {
    super(null, CommonUtils.getPermissionCode("resource.document"));
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.documentId = params.id;
        } else {
          this.setFormValue({});
        }
      }
    });
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.DOCUMENT_TYPE).subscribe(res => {
      this.typeList = res.data;
    });
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.CONFIDENTIALITY).subscribe(res => {
      this.confidentialityList = res.data;
    });
    this.documentTypesService.getHasPermissionBranchList().subscribe(
      res => {
        this.branchList = res.data;
      }
    )
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (this.activatedRoute.snapshot.paramMap.get('view') === 'view') {
      this.isView = true;
    }
    if (subPaths.length > 2) {
      this.isUpdate = subPaths[2] === 'document-edit';
      this.isInsert = subPaths[2] === 'document-add';
    }
    this.setFormValue(this.documentId);
    this.appParamService.appParams("ACTION_WITH_BRANCH_OFFICIALS_DOCUMENTS").subscribe(
      res => {
        let userEmail = HrStorage.getUserToken().userInfo.email;
        let arr = userEmail.split("@");
        this.nameUserEmail = arr[0];
        this.arrUserEmail = res.data[0].parValue;
      }
    );
  }

  get f() {
    return this.formSave.controls;
  }

  /**
   * buildForm
   */
  private buildForms(data?: any): void {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, [ValidationService.notAffter('effectiveDate', 'expritedDate', 'document.label.expriredDateForm')]);

    const filesControl = new FileControl(null);
    if (data && data.fileAttachment) {
      if (data.fileAttachment.documentFile) {
        filesControl.setFileAttachment(data.fileAttachment.documentFile);
      }
    }
    this.formSave.addControl('files', filesControl);
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
      this.documentService.findOneDocument({ documentId: data, type: type })
        .subscribe(res => {
          this.buildForms(res.data);
          if (res.data['branch'] != null && res.data['branch'] == 1) {
            this.isRequirePartyOrg = true;
          }
          if (res.data['partyOrganizationId'] != null) {
            this.partyOrganizationIdOld = res.data['partyOrganizationId'];
          }
          if (res.data['branch'] != null) {
            this.documentTypesService.getByBranchId(res.data['branch']).subscribe(res => {
              this.documentTypeList = res.data;
              this.documentTypeList.sort(function (a, b) {
                return a.name.localeCompare(b.name);
              });
            });
          }
          if (res.data.documentTypeId != null) {
            this.documentTypesService.findOne(res.data.documentTypeId).subscribe(res => {
              this.downLoadFile = this.checkAction(res.data);
            })
          }
        });
    }
  }

  processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.app.confirmMessage(null, () => { // on accepted
      this.documentService.saveOrUpdateFormFile(this.formSave.value)
        .subscribe(res => {
          if (this.documentService.requestIsSuccess(res) && res.data && res.data.documentId) {
            this.goView(res.data.documentId);
          }
        });
    }, () => {

    });
  }

  public goBack() {
    this.router.navigate(['/document/document']);
  }

  public goView(documentId: any) {
    this.router.navigate([`/document/document-view/${documentId}/view`]);
  }

  public onChangeBranch(event) {
    if (event != null) {
      this.documentTypesService.getByBranchId(event).subscribe(res => {
        this.documentTypeList = res.data;
        this.documentTypeList.sort(function (a, b) {
          return a.name.localeCompare(b.name);
        });
      });
    } else {
      this.documentTypeList = [];
    }
    const partyOrganizationId = this.formSave.controls['partyOrganizationId'].value;
    if (event === this.branchList[0].code) {
      this.isRequirePartyOrg = true;
      this.formSave.removeControl('partyOrganizationId');
      this.formSave.addControl('partyOrganizationId', new FormControl(partyOrganizationId, [Validators.required]));
      if (this.partyOrganizationIdOld != null) {
        this.formSave.controls['partyOrganizationId'].setValue(this.partyOrganizationIdOld);
      }
    } else {
      this.isRequirePartyOrg = false;
      this.formSave.removeControl('partyOrganizationId');
      this.formSave.addControl('partyOrganizationId', new FormControl(partyOrganizationId));
      this.formSave.controls['partyOrganizationId'].setValue(null);
    }
  }

  public checkAction(item) {
    let DDCB = "Điều động cán bộ";
    let QHCB = "Quy hoạch cán bộ";
    if (item.branch === 2) {
      if (item.name === DDCB || item.name === QHCB) {
        let c = this.searchString(this.arrUserEmail, this.nameUserEmail);
        if (c) {
          return true;
        } else {
          return false;
        }
      }
    }
    return true;
  }

  // search nhi phan
  public searchString(str: string, subStr: string) {
    if (str.indexOf(subStr) != -1) {
      return true;
    }
    return false;
  }

  navigate() {
    this.router.navigate(['/document/document-edit', this.documentId]);
  }
}
