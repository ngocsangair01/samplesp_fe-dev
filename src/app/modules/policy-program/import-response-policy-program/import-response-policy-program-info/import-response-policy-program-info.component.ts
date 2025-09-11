import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS, DEFAULT_MODAL_OPTIONS } from '@app/core';
import { FileControl } from '@app/core/models/file.control';
import { ImportResponsePolicyProgramService } from '@app/core/services/policy-program/import-response-policy-program.service';
import { ResponsePolicyProgramService } from '@app/core/services/policy-program/response-policy-program.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImportResponsePolicyProgramAddComponent } from '../import-response-policy-program-add/import-response-policy-program-add.component';
import { ImportResponsePolicyProgramImportComponent } from '../import-response-policy-program-import/import-response-policy-program-import.component';



@Component({
  selector: 'import-response-policy-program-info',
  templateUrl: './import-response-policy-program-info.component.html'
})
export class ImportResponsePolicyProgramInfoComponent extends BaseComponent implements OnInit {
  formInfo: FormGroup;
  requestPolicyProgramId: any;
  responsePolicyProgramId: any;
  responsePolicyStatus: any;
  organizationId: any;

  formConfig = {
    requestPolicyProgramId: [''],
    organizationId: [''],
    requestDate: [''],
    policyProgramType: [''],
    finishDate: [''],
    code: [''],
    name: [''],
    lstNodeCheck: [''],
    description: ['']
  };
  policyProgramTypeList: [];
  constructor(
    private router: Router,
    public actr: ActivatedRoute,
    private modalService: NgbModal,
    private app: AppComponent,
    private importResponsePolicyProgramService: ImportResponsePolicyProgramService,
    private categoryService: CategoryService,
    private responsePolicyProgramService: ResponsePolicyProgramService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.requestPolicyProgram"));
    this.setMainService(importResponsePolicyProgramService);
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.LOAI_CHINH_SACH).subscribe(res => {
      this.policyProgramTypeList = res.data;
    });
    this.actr.params.subscribe(params => {
      if (params && params.id != null) {
        this.responsePolicyProgramId = params.id;
      }
    });
    this.formInfo = this.buildForm({}, this.formConfig);
    this.buildForms({});
    // lay requestPolicyProgramId tu service by responseId
    this.responsePolicyProgramService.findOne(this.responsePolicyProgramId).subscribe(res => {
      this.requestPolicyProgramId = res.data.requestPolicyProgramId;
      this.responsePolicyStatus = res.data.status;
      this.organizationId = res.data.organizationId;
      this.setFormValue(this.requestPolicyProgramId);
    })
  }

  ngOnInit() {
    this.searchById();
  }
  buildForms(data?) {
    const attachFileControl = new FileControl(null);
    if (data && data.fileAttachment && data.fileAttachment.attachFile) {
      attachFileControl.setFileAttachment(data.fileAttachment.attachFile);
    }
    this.formInfo.addControl('attachFile', attachFileControl);
  }
  public setFormValue(data?: any) {
    if (data && data > 0) {
      this.importResponsePolicyProgramService.findBeanById(data)
        .subscribe(res => {
          this.formInfo = this.buildForm(res.data, this.formConfig);
          // set gia trị file
          const attachFileControl = new FileControl(null);
          if (res.data && res.data.fileAttachment && res.data.fileAttachment.attachFile) {
            attachFileControl.setFileAttachment(res.data.fileAttachment.attachFile);
          }
          this.formInfo.addControl('attachFile', attachFileControl);
        })
    } else {
      const attachFileControl = new FileControl(null);
      this.formInfo.addControl('attachFile', attachFileControl);
    }
  }

  public searchById(event?): void {

    const params = { responsePolicyProgramId: this.responsePolicyProgramId }
    this.importResponsePolicyProgramService.processSearchByImportResponsePolicyProgramBean(params, event).subscribe(res => {
      this.resultList = res;
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }

  get f() {
    return this.formInfo.controls;
  }

  prepareSaveOrUpdate(item?: any) {
    if (item && item.importResponsePolicyProgramId > 0) {
      this.importResponsePolicyProgramService.findOne(item.importResponsePolicyProgramId)
        .subscribe(res => {
          if (res.data != null) {
            this.activeModal(res.data);
          } else {
            this.searchById();
          }
        });
    } else {
      const data = {
        responsePolicyProgramId: this.responsePolicyProgramId
      };
      this.activeModal(data);
    }
  }

  /**
   * Show modal
   * data
   */
  private activeModal(data?: any) {

    const modalRef = this.modalService.open(ImportResponsePolicyProgramAddComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance.organizationId = this.organizationId;
    if (data) {
      modalRef.componentInstance.setFormValue(data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.importResponsePolicyProgramService.requestIsSuccess(result)) {
        this.searchById();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }

  processDelete(item) {
    if (item && item.importResponsePolicyProgramId > 0) {
      this.app.confirmDelete(null, () => { // on accepted
        this.importResponsePolicyProgramService.deleteById(item.importResponsePolicyProgramId)
          .subscribe(res => {
            if (this.importResponsePolicyProgramService.requestIsSuccess(res)) {
              this.searchById();
              if (this.dataTable) {
                this.dataTable.first = 0;
              }
            }
          });
      }, () => { // on rejected
      });
    }
  }

  /**
    * show model
    * data
    */
  private activeImportModal() {
    const modalRef = this.modalService.open(ImportResponsePolicyProgramImportComponent, DEFAULT_MODAL_OPTIONS);
    if (this.responsePolicyProgramId) {
      modalRef.componentInstance.setFormValue(this.propertyConfigs, { responsePolicyProgramId: this.responsePolicyProgramId });
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.importResponsePolicyProgramService.requestIsSuccess(result)) {
        this.searchById();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }

  public goBack() {
    this.router.navigate(['/policy-program/response-policy-program']);
  }
}
