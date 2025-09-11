import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { EmpManagementVerticalService } from '@app/core/services/security/emp-management-vertical.service';
import { HrStorage } from '@app/core/services/HrStorage';

@Component({
  selector: 'management-vertical-search',
  templateUrl: './management-vertical-search.component.html'
})
export class ManagementVerticalSearchComponent extends BaseComponent implements OnInit {

  defaultDomain: any;
  private operationKey = 'action.view';
  private adResourceKey = 'resource.empManagementVertical';
  public listYear: any;
  formConfig = {
    organizationId: [''],
    year: [''],
    employeeCode: [''],
    employeeName: ['']
  }
  constructor(
    public actr: ActivatedRoute,
    private router: Router,
    public empManagementVerticalService: EmpManagementVerticalService
  ) {
    super(actr, CommonUtils.getPermissionCode("resource.empManagementVertical"));
    this.setMainService(empManagementVerticalService);
    this.formSearch = this.buildForm({}, this.formConfig);
    this.defaultDomain = HrStorage.getDefaultDomainByCode(
      CommonUtils.getPermissionCode(this.operationKey),
      CommonUtils.getPermissionCode(this.adResourceKey)
    );
    if (this.defaultDomain) {
      this.f['organizationId'].setValue(this.defaultDomain);
    }
    this.listYear = CommonUtils.getYearList(10, 0).sort(function (a, b) { return b.year - a.year });
  }

  ngOnInit() {
    this.processSearch();
  }

  get f() {
    return this.formSearch.controls;
  }

  prepareSaveOrUpdate(id?: number) {
    if(id) {
      this.router.navigate(['/security-guard/management-vertical/edit/', id]);
    } else {
      this.router.navigate(['/security-guard/management-vertical/add']);
    }
  }

  processImport() {
    this.router.navigate(['/security-guard/management-vertical/import']);
  }

  /**
   * Xuất file màn hình tìm kiếm
   */
  public processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }

    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.empManagementVerticalService.export(params).subscribe(res => {
      saveAs(res, 'Danh_sach_quan_ly_nganh_doc_bao_ve_an_ninh.xlsx');
    });
  }
}
