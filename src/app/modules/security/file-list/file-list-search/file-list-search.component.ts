import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'file-list-search',
  templateUrl: './file-list-search.component.html',
})
export class FileListSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;

  formconfig = {
    employeeCode: [''],
    employeeName: [''],
    organizationId: [''],
  }
  constructor(
    public actr: ActivatedRoute,
    private curriculumVitaeService: CurriculumVitaeService,
    private fileStorage: FileStorageService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.securityProtection"));
    this.setMainService(curriculumVitaeService);
    this.formSearch = this.buildForm({}, this.formconfig);
    this.processFileSearch();
  }

  ngOnInit() {
    this.processFileSearch();
  }
  get f() {
    return this.formSearch.controls;
  }
  public downloadFile(fileData) {
    this.fileStorage.downloadFile(fileData.secretId).subscribe(res => {
      saveAs(res, fileData.fileName);
    });
  }

  public processFileSearch(event?): void {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const params = this.formSearch ? this.formSearch.value : null;
    this.curriculumVitaeService.processFileSearch(params, event).subscribe(res => {
      this.resultList = res;
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }
  public processExportFiles() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }

    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.curriculumVitaeService.exportfile(params).subscribe(res => {
      saveAs(res, 'Danh sách file tải lên.xlsx');
    });
  }
}
