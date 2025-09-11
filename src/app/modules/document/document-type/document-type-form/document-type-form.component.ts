
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { DocumentTypesService } from '@app/core/services/document-types/document-types.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { ValidationService } from '@app/shared/services/validation.service';

@Component({
  selector: 'document-type-form',
  templateUrl: './document-type-form.component.html',
  styleUrls: ['./document-type-form.component.css']
})
export class DocumentTypeFormComponent extends BaseComponent implements OnInit {
  listStatus = APP_CONSTANTS.DOCUMENT_STATUS_LIST;
  formSave: FormGroup;
  documentTypeId: any;
  branchList: any;
  isUpdate: boolean;
  isInsert: boolean;
  formConfig = {
    documentTypeId: [''],
    code: [''],
    name: ['', [ValidationService.required, ValidationService.maxLength(200)]],
    isActive: [''],
    branch: ['', [ValidationService.required]],
  };

  constructor(
    private documentTypesService: DocumentTypesService,
    public actr: ActivatedRoute,
    private router: Router,
    private app: AppComponent) {
    super(null, CommonUtils.getPermissionCode("resource.document"));
    this.setFormValue({});
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.documentTypeId = params.id;
        }
      }
    });
    this.documentTypesService.getHasPermissionBranchList().subscribe(
      res => {
        this.branchList = res.data;
      }
    )
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 2) {
      this.isUpdate = subPaths[2] === 'document-type-edit';
      this.isInsert = subPaths[2] === 'document-type-add';
    }
    this.setFormValue(this.documentTypeId);

  }

  get f() {
    return this.formSave.controls;
  }

  /**
   * buildForm
   */
  private buildForms(data?: any): void {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, []);
  }

  /**
   * setFormValue
   * param data
   */
  public setFormValue(data?: any) {
    this.buildForms({});
    if (data && data > 0) {
      this.documentTypesService.findOne(data)
        .subscribe(res => {
          this.buildForms(res.data);
        })
    }
  }

  public processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }

    this.app.confirmMessage(null, () => { // on accepted
      this.documentTypesService.saveOrUpdate(this.formSave.value)
        .subscribe(res => {
          if (this.documentTypesService.requestIsSuccess(res)) {
            this.goBack();
          }
        });
    }, () => {
      // on rejected   
    });
  }

  public goBack() {
    this.router.navigate(['/document/document-type']);
  }
}