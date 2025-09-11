import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ACTION_FORM, DEFAULT_MODAL_OPTIONS } from '@app/core';
import { HrStorage } from '@app/core/services/HrStorage';
import { ManagerPartyOrganizationService } from '@app/core/services/party-organization/manager-party-organization.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ManagerPartyOrgDeleteComponent } from '../manager-party-org-delete/manager-party-org-delete.component';

@Component({
  selector: 'manager-party-org-search',
  templateUrl: './manager-party-org-search.component.html'
})
export class ManagerPartyOrgSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  formConfig = {
    partyOrganizationId: [''],
    organizationId: [''],
    foundingDateFrom: [''],
    foundingDateTo: [''],
    code: [''],
    name: ['']
  };
  defaultDomain: any;
  private operationKey = 'action.view';
  private adResourceKey = 'resource.partyOrganization';
  isMobileScreen: boolean = false;

  constructor(
    public actr: ActivatedRoute
    , private managerPartyOrgService: ManagerPartyOrganizationService
    , private modalService: NgbModal
    , private helperService: HelperService
    , private router: Router) {
    super(null, CommonUtils.getPermissionCode("resource.partyOrganization"));
    this.setMainService(managerPartyOrgService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('foundingDateFrom', 'foundingDateTo', 'partyOrganization.toDate')]);

    this.defaultDomain = HrStorage.getDefaultDomainByCode(CommonUtils.getPermissionCode(this.operationKey)
      , CommonUtils.getPermissionCode(this.adResourceKey));
    if (this.defaultDomain) {
      this.f['organizationId'].setValue(this.defaultDomain);
    }
    // tim kiem phuc vu cho select node tren tree
    this.actr.params.subscribe(params => {
      if (params && params.id != null) {
        this.formSearch.controls['partyOrganizationId'].setValue(`${params.id}`);
      } else {
        this.helperService.reloadTreeParty('complete');
      }
      this.helperService.resetParty();
      this.processSearch();
      this.formSearch.controls['partyOrganizationId'].setValue(null);
    });
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    //Lấy miền dữ liệu mặc định theo nv đăng nhập
    // this.defaultDomain = HrStorage.getDefaultDomainByCode(CommonUtils.getPermissionCode(this.operationKey)
    // ,CommonUtils.getPermissionCode(this.adResourceKey));
    // if (this.defaultDomain) {
    //   this.organizationService.findOne(this.defaultDomain)
    //     .subscribe((res) => {
    //       const data = res.data;
    //       if (data) {
    //         this.f['organizationId'].setValue(data.organizationId);
    //       }
    //       this.processSearch();
    //     });
    // } else {
    //   this.processSearch();
    // }
  }

  get f() {
    return this.formSearch.controls;
  }

  /**
   * prepareSaveOrUpdate
   * param item
   */
  public prepareSaveOrUpdate(item?: any) {
    if (item && item.partyOrganizationId > 0) {
      this.router.navigate(['/party-organization/party-organization-management/edit/', item.partyOrganizationId]);
    } else {
      this.router.navigate(['/party-organization/party-organization-management/add']);
    }
  }

  public prepareView(item) {
    this.router.navigate(['/party-organization/party-organization-management/view/', item.partyOrganizationId]);
  }

  public terminateView() {
    this.router.navigate(['/party-organization/party-organization-management/terminate']);
  }

  // mo pop-up xoa to chuc Dang
  preparePopUpDelete(item) {
    this.actionActiveModal(item);
  }

  // action mo
  actionActiveModal(item) {
    const modalRef = this.modalService.open(ManagerPartyOrgDeleteComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance.setPartyOrgIdAndEffectDate(item.partyOrganizationId, item.effectiveDate);
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.managerPartyOrgService.requestIsSuccess(result)) {
        this.processSearch();
      }
    });
  }

  // xuat bao cao
  public processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.managerPartyOrgService.export(params).subscribe(res => {
      let dateTime = new Date();;
      let date = moment(dateTime).format('DDMMYYYY')
      let time = moment(dateTime).format('hhmmss')
      saveAs(res, 'Quan_ly_to_chuc_Dang_' + date + "_" + time);
    });
  }

  // private processSearchNode () {
  //   if (!CommonUtils.isValidForm(this.formSearch)) {
  //     return;
  //   }
  //   const params = this.formSearch ? this.formSearch.value : null;
  //   this.managerPartyOrgService.search(params, event).subscribe(res => {
  //     this.resultList = res;
  //   });
  //   if (!event) {
  //     if (this.dataTable) {
  //       this.dataTable.first = 0;
  //     }
  //   }
  // }
}