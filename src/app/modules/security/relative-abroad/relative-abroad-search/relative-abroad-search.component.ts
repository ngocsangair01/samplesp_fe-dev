import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '@app/app.component';
import {WorkedAbroadService} from "@app/core/services/security/workedAbroad.service";
import {EmpTypesService} from "@app/core/services/emp-type.service";
import {CommonUtils} from "@app/shared/services";
import {RelativeAbroadService} from "@app/core/services/security/relativeAbroad.service";

@Component({
  selector: 'relative-abroad-search',
  templateUrl: './relative-abroad-search.component.html',
  styleUrls: ['./relative-abroad-search.component.css']
})
export class RelativeAbroadSearchComponent extends BaseComponent implements OnInit {
  selectedGop: [];
  formSearch: FormGroup;
  resultList: any;
  rootId = APP_CONSTANTS.ORG_ROOT_ID
  listChangeAdd = [];
  empTypeList: any = {};
  formConfig = {
    employeeId: [''],
    organizationId: [''],
    empTypeId: [''],
    isEmployeeId: [false],
    isOrganizationId: [false],
    isEmpTypeId: [false]
  }

  constructor(
    private relativeAbroadService: RelativeAbroadService,
    private empTypeService: EmpTypesService,
    private router: Router,
    private app: AppComponent,
    public actr: ActivatedRoute,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.securityProtection"));
    this.setMainService(relativeAbroadService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW)
    // Danh sách diện đối tượng
    this.empTypeService.getListEmpType().subscribe(res => this.empTypeList = res);
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
    this.relativeAbroadService.export(this.formSearch.value).subscribe(res => {
      saveAs(res, 'Thông tin người thân đang ở nước ngoài.xls');
    });
  }

  /**
   * Import
   */
  public import() {
    this.router.navigate(['/security-guard/relative-abroad/import']);
  }

  public prepareAdd(item?: any) {
      this.router.navigate(['/security-guard/relative-abroad/add'])
  }

  processDelete(item) {
    if (item && item.relativeAbroadId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.relativeAbroadService.deleteById(item.relativeAbroadId)
            .subscribe(res => {
              if (this.relativeAbroadService.requestIsSuccess(res)) {
                this.processSearch(null);
              }
            });
      }, () => {// on rejected
      });
    }
  }

  public prepareSaveOrUpdate(item?: any) {
    if (item && item.relativeAbroadId > 0) {
      this.router.navigate(['/security-guard/relative-abroad/edit/', item.relativeAbroadId]);
    } else {
      this.router.navigate(['/security-guard/relative-abroad/add']);
    }
  }
}
