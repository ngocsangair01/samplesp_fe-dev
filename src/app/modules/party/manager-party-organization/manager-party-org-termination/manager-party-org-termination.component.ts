import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_CONSTANTS } from '@app/core';
import { PartyTermiationService } from '@app/core/services/party-organization/party_termination';
import { CategoryService } from '@app/core/services/setting/category.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import * as moment from 'moment';

@Component({
  selector: 'manager-party-org-termination',
  templateUrl: './manager-party-org-termination.component.html'
})
export class ManagerPartyOrgTerminationComponent extends BaseComponent implements OnInit {
  lstReason: any;
  formSearch: FormGroup;
  formConfig = {
    documentId: [''],
    partyOrganizationId: [''],
    effectiveDateFrom: [''],
    effectiveDateTo: [''],
    partyDecisionId: [''],
    partyName: [''],
    reason: ['']
  };
  isMobileScreen: boolean = false;
  constructor(
    private partyTermiationService: PartyTermiationService,
    private categoryService: CategoryService,
    private router: Router,
    public actr: ActivatedRoute) {
    super(null, CommonUtils.getPermissionCode("resource.partyOrganization"));
    this.setMainService(partyTermiationService);
    this.formSearch = this.buildForm({}, this.formConfig);

    // tim kiem phuc vu cho slelect node tren tree
    this.actr.params.subscribe(params => {
      if (params && params.id != null) {
        this.formSearch.controls['partyOrganizationId'].setValue(`${params.id}`);
      }
      this.processSearch();
      this.formSearch.controls['partyOrganizationId'].setValue(null);
    });
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.LY_DO_CHAM_DUT_DANG).subscribe(res => {
      this.lstReason = res.data;
    });
  }

  get f() {
    return this.formSearch.controls;
  }

  public goBack() {
    this.router.navigate(['/party-organization/party-organization-management']);
  }

  // xuat bao cao
  public processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.partyTermiationService.export(params).subscribe(res => {
      let dateTime = new Date();;
      let date = moment(dateTime).format('DDMMYYYY')
      let time = moment(dateTime).format('hhmmss')
      saveAs(res, 'Cham_dut_to_chuc_Dang' + date + "_" + time + ".xlsx");
    });
  }

}
