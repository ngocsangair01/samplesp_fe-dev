import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS } from '@app/core/app-config';
import { DocumentTypesService } from '@app/core/services/document-types/document-types.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
;

@Component({
  selector: 'document-type-search',
  templateUrl: './document-type-search.component.html',
})
export class DocumentTypeSearchComponent extends BaseComponent implements OnInit {
  branchList: any;
  listStatus = APP_CONSTANTS.DOCUMENT_STATUS_LIST;
  formSearch: FormGroup;
  status: any;
  formConfig = {
    documentTypeId: [''],
    code: [''],
    name: [''],
    isActive: [''],
    branch: [''],
  };

  constructor(
    private documentTypesService: DocumentTypesService,
    private router: Router,
    private app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode("resource.document"));
    this.setMainService(documentTypesService);
    this.formSearch = this.buildForm({}, this.formConfig);
    this.processSearch();
    this.documentTypesService.getHasPermissionBranchList().subscribe(
      res => {
        this.branchList = res.data;
      }
    );
  }


  ngOnInit() {

  }


  get f() {
    return this.formSearch.controls;
  }

  public prepareSaveOrUpdate(item?: any) {
    if (item && item.documentTypeId > 0) {
      this.documentTypesService.findOne(item.documentTypeId).subscribe(res => {
        if (res.data != null) {
          this.router.navigate(['/document/document-type-edit/', item.documentTypeId]);
        }
      });
    } else {
      this.router.navigate(['/document/document-type-add']);
    }
  }


  processDelete(item) {
    if (item && item.documentTypeId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.documentTypesService.deleteById(item.documentTypeId)
          .subscribe(res => {
            if (this.documentTypesService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      }, () => {// on rejected

      });
    }
  }

  export() {
    const reqData = this.formSearch.value;
    this.app.isProcessing(true);
    this.documentTypesService.export(reqData)
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
          saveAs(res, 'Danh_sach_danh_muc_tai_lieu');
        }
      });
  }
}
