import { PartyCongressEmployeeService } from '@app/core/services/party-organization/party-congress-employee.service';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { Router } from '@angular/router';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { CategoryService } from '@app/core/services/setting/category.service';
import { APP_CONSTANTS } from '@app/core';
import { AppComponent } from '@app/app.component';

@Component({
  selector: 'party-congress-employee-search',
  templateUrl: './party-congress-employee-search.component.html'
})
export class PartyCongressEmployeeSearchComponent extends BaseComponent implements OnInit {
  tenureList = [];
  selectedGop = [];
  partyCongressEmployeeIdList = [];
  isDisableCheckAll = true;
  formConfig = {
    partyOrganizationId: ['', null],
    fullName: ['', [ValidationService.maxLength(200)]],
    partyPositionId: ['', null],
    newPartyPosition: ['', null],
    isHaveProfile: [0],
    tenureId: [''],
  };

  constructor(
    private partyCongressEmployeeService: PartyCongressEmployeeService,
    private fileStorage: FileStorageService,
    private router: Router,
    private categoryService: CategoryService,
    private app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyCongressEmployee"));
    this.setMainService(partyCongressEmployeeService);
    this.formSearch = this.buildForm({}, this.formConfig);
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.TENURE).subscribe(
      res => this.tenureList = res.data
    );
  }

  ngOnInit() {
    this.processSearch();
  }

  get f() {
    return this.formSearch.controls;
  }

  /**
 * Xu ly download file trong danh sach
 */
  public downloadFile(fileData) {
    this.fileStorage.downloadFile(fileData.secretId).subscribe(res => {
      saveAs(res, fileData.fileName);
    });
  }

  prepareImport() {
    this.router.navigate(['/party-organization/party-congress-employee-import']);
  }

  prepareSaveOrUpdate(item?) {
    if (item && item.partyCongressEmployeeId > 0) {
      this.router.navigate(['/party-organization/party-congress-employee-edit', item.partyCongressEmployeeId]);
    } else {
      this.router.navigate(['/party-organization/party-congress-employee-add']);
    }
  }
  processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.partyCongressEmployeeService.export(params).subscribe(res => {
      saveAs(res, 'ctct_bao_cao_danh_sach_nhan_su_dai_hoi.xlsx');
    });
  }

  processConfirm() {
    for (const item of this.selectedGop) {
      if (item.isCurrentTenure === 1 && item.isConfirmed === 0) {
        this.partyCongressEmployeeIdList.push(item.partyCongressEmployeeId);
      }
    }
    if (this.partyCongressEmployeeIdList.length === 0) {
      this.app.messError('ERROR', 'app.notification.notSelected');
      return;
    }
    this.app.confirmMessage(null
      , () => {
        this.partyCongressEmployeeService.processConfirm(this.partyCongressEmployeeIdList).subscribe(
          res => {
            this.processSearch();
            this.selectedGop = [];
            this.partyCongressEmployeeIdList = [];
          }
        )
      }
      , () => { }
    );
  }

  public processSearch(event?): void {
    this.isDisableCheckAll = true;
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const params = this.formSearch ? this.formSearch.value : null;
    this.partyCongressEmployeeService.search(params, event).subscribe(res => {
      this.resultList = res;
      for (const item of this.resultList.data) {
        if (item.isConfirmed === 0 && item.isCurrentTenure === 1) {
          this.isDisableCheckAll = false;
          break;
        }
      }
      this.selectedGop = [];
      this.partyCongressEmployeeIdList = [];
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }
}
