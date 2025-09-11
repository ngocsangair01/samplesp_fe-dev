import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { KeyProjectEmployeeService } from '@app/core/services/security/keyProjectEmployee.service';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ValidationService } from '@app/shared/services';

@Component({
  selector: 'personnel-involved-search',
  templateUrl: './personnel-involved-search.component.html',
  styleUrls: ['./personnel-involved-search.component.css']
})
export class PersonnelInvolvedSearchComponent extends BaseComponent implements OnInit {
  selectedGop: [];
  formSearch: FormGroup;
  resultList: any;
  listClassify = APP_CONSTANTS.CLASSIFY_TYPE;
  rootId = APP_CONSTANTS.ORG_ROOT_ID
  listChangeAdd = [];
  formconfig = {
    keyProjectEmployeeId: [''],
    organizationId: [''],
    employeeId: [''],
    employeeCode: [''],
    classify: [''],
    projectsCode: [''],
    projectsName: [''],
    startDateFrom: [''],
    startDateTo: [''],
    endDateFrom: [''],
    endDateTo: [''],
    classifyName: [''],

  }

  constructor(
    private keyProjectEmployeeService: KeyProjectEmployeeService,
    private router: Router,
    private app: AppComponent,
    public actr: ActivatedRoute,
  ) {
    super(actr, CommonUtils.getPermissionCode("resource.securityProtection"));
    this.setMainService(keyProjectEmployeeService);
    this.formSearch = this.buildForm({}, this.formconfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('startDateFrom', 'startDateTo', 'personnelInvolved.start.date.to'),
      ValidationService.notAffter('endDateFrom', 'endDateTo', 'personnelInvolved.end.date.to')]);
    this.processSearch();
  }

  ngOnInit() {
  }

  get f() {
    return this.formSearch.controls;
  }
  /**
   * Xuất báo cáo
   */
  public processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.keyProjectEmployeeService.export(params).subscribe(res => {
      saveAs(res, 'Danh_Sach_Nhan_Su_Tham_Gia_Du_An_Trong_Diem.xls');
    });
  }

  /**
   * Import
   */
  public import() {
    this.router.navigate(['/security-guard/key-projects/personnel-involved/import']);
  }

  processDelete() {
    if (this.listChangeAdd.length == 0) {
      this.app.messError('ERROR', 'app.notification.notSelected');
    } else {
      this.app.confirmDelete(null, () => {// on accepted
        var listIds = this.listChangeAdd.map(a => a.keyProjectEmployeeId);
        this.keyProjectEmployeeService.deleteList(listIds)
          .subscribe(res => {
            if (this.keyProjectEmployeeService.requestIsSuccess(res)) {
              this.listChangeAdd = [];
              this.processSearch(null);
            }
          });
      }, () => {// on rejected
      });
    }
  }
}