import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { DocumentTypesService } from '@app/core/services/document-types/document-types.service';
import { DocumentService } from '@app/core/services/document/document.service';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { ValidationService } from '@app/shared/services/validation.service';
import { HrStorage } from './../../../core/services/HrStorage';
;

@Component({
  selector: 'document-search',
  templateUrl: './document-search.component.html',
  styleUrls: ['./document-search.component.css']
})
export class DocumentSearchComponent extends BaseComponent implements OnInit {
  typeList: any;
  arrUserEmail: any;
  nameUserEmail: any;
  confidentialityList: any;
  branchList: any;
  documentTypeList: any;
  isMobileScreen: boolean = false;
  formConfig = {
    documentId: [''],
    documentTypeId: [''],
    documentNumber: ['', [Validators.maxLength(100)]],
    name: ['', [Validators.maxLength(200)]],
    type: [''],
    confidentiality: [''],
    branch: [''],
    effectiveDate: [''],
    expritedDate: [''],
    organizationId: [''],
    isDocumentTypeId: [false],
    isDocumentNumber: [false],
    isName: [false],
    isType: [false],
    isConfidentiality: [false],
    isBranch: [false],
    isEffectiveDate: [false],
    isExpritedDate: [false],
    isOrganizationId: [false]
  };

  constructor(
    private documentTypesService: DocumentTypesService,
    private documentService: DocumentService,
    private categoryService: CategoryService,
    private router: Router,
    private app: AppComponent,
    private fileStorage: FileStorageService,
    private appParamService: AppParamService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.document"));
    this.setMainService(documentService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('effectiveDate', 'expritedDate', 'document.label.toDate')]);
    this.processSearch();
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
    return this.formSearch.controls;
  }

  public prepareSaveOrUpdate(item?: any) {
    if (item && item.documentId > 0) {
      this.router.navigate(['/document/document-edit/', item.documentId]);
    } else {
      this.router.navigate(['/document/document-add']);
    }
  }

  public prepareView(item) {
    this.router.navigate(['/document/document-view/', item.documentId, 'view']);
  }

  processDelete(item) {
    if (item && item.documentId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.documentService.deleteById(item.documentId)
          .subscribe(res => {
            if (this.documentService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      }, () => {// on rejected

      });
    }
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
  }

  export() {
    const reqData = this.formSearch.value;
    this.app.isProcessing(true);
    this.documentService.export(reqData)
      .subscribe((res) => {
        this.app.isProcessing(false);
        if (res.type === 'application/json') {
          const reader = new FileReader();
          reader.addEventListener('loadend', (e) => {
            const text = e.srcElement['result'];
            const json = JSON.parse(text);
            this.documentTypesService.processReturnMessage(json);
          });
          reader.readAsText(res);
        } else {
          saveAs(res, 'quan_ly_tai_lieu');
        }
      });
  }

  /**
   * Xu ly download file trong danh sach
   */
  public downloadFile(fileData) {
    this.fileStorage.downloadFile(fileData.secretId).subscribe(res => {
      saveAs(res, fileData.fileName);
    });
  }

  // check user edit and delete for branch can bo.
  public checkAction(item) {
    let DDCB = "Điều động cán bộ";
    let QHCB = "Quy hoạch cán bộ";
    if (item.branch === 2) {
      if (item.documentTypeName === DDCB || item.documentTypeName === QHCB) {
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
}
