import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { WarningManagerService } from '@app/modules/reports/warning-manager/warning-manager.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';

@Component({
  selector: 'search-warning',
  templateUrl: './search-warning.component.html'
})
export class SearchWarningComponent extends BaseComponent implements OnInit {
  resultList: any = {};
  @ViewChild('pTable') dataTable: any;
  formConfig = {
    code: ['', ValidationService.maxLength(50)],
    name: ['', ValidationService.maxLength(200)],
    warningType: [''],
    status: [''],
    branchCode: ['']
  }
  view: boolean;
  public colorList: any;
  branchList: any;
  selectedValue: number = null;
  constructor(public actr: ActivatedRoute,
    private router: Router,
    private app: AppComponent,
    private helperService: HelperService,
    private warningManagerService: WarningManagerService
  ) {
    super(actr, CommonUtils.getPermissionCode("resource.warningManager"));
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW);
    this.colorList = APP_CONSTANTS.WARNING_MANAGE_COLOR;
    this.warningManagerService.getListBranchCode().subscribe(
      res => {
        this.branchList = res;
      }
    )
  }

  ngOnInit() {
    this.processSearch();
  }
  processSearch(event?) {
    if (CommonUtils.isValidForm(this.formSearch)) {
      if (!CommonUtils.isValidForm(this.formSearch)) {
        return;
      }
      this.warningManagerService.search(this.formSearch.value, event).subscribe(res => {
        this.resultList = res;
      });

      if (!event) {
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    }
  }
  get f() {
    return this.formSearch.controls;
  }
  public prepareSaveOrUpdate(item?: any) {
    if (item && item.warningManagerId > 0) {
      return this.router.navigate(['reports/warning-manager/edit/', item.warningManagerId]);
    }
    return this.router.navigate(['reports/warning-manager/add']);
  }

  public detail(item?: any) {
    if (item && item.warningManagerId > 0) {
      return this.router.navigate(['reports/warning-manager/view/', item.warningManagerId]);
    }
    return this.router.navigate(['reports/warning-manager/add']);
  }
  processDelete(item) {
    if (item && item.warningManagerId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.warningManagerService.deleteById(item.warningManagerId)
          .subscribe(res => {
            if (this.warningManagerService.requestIsSuccess(res)) {
              this.helperService.reloadTreeOrganization(res);
              this.processSearch();
            }
          });
      }, null);
    }
  }
}
