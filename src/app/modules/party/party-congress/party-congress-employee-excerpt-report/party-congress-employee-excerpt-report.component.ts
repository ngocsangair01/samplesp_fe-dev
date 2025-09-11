import { Component, OnInit } from '@angular/core';
import { PartyCongressEmployeeService } from '@app/core/services/party-organization/party-congress-employee.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { CategoryService } from '@app/core/services/setting/category.service';
import { APP_CONSTANTS } from '@app/core';

@Component({
  selector: 'party-congress-employee-excerpt-report',
  templateUrl: './party-congress-employee-excerpt-report.component.html',
  styleUrls: ['./party-congress-employee-excerpt-report.component.css']
})
export class PartyCongressEmployeeExcerptReportComponent extends BaseComponent implements OnInit {
  tenureList = [];
  formConfig = {
    partyOrganizationId: ['', [ValidationService.required]],
    tenureId: ['', [ValidationService.required]],
    partyExecutiveCommitteeId: [0]
  };
  constructor(
    private partyCongressEmployeeService: PartyCongressEmployeeService,
    private categoryService: CategoryService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyCongressEmployee"));
    this.setMainService(partyCongressEmployeeService);
    this.formSearch = this.buildForm({}, this.formConfig);
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.TENURE).subscribe(
      res => this.tenureList = res.data
    );
  }

  ngOnInit() {
  }

  get f() {
    return this.formSearch.controls;
  }

  processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    this.partyCongressEmployeeService.exportListPartyCongressEmployeeExcerpt(this.formSearch.value).subscribe(
      res => {
        saveAs(res, 'Bao_cao_danh_sach_trich_ngang_dai_bieu.xlsx');
      }
    )
  }
}
