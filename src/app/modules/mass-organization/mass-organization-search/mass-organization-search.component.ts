import { HelperService } from '@app/shared/services/helper.service';
import { CommonUtils } from './../../../shared/services/common-utils.service';
import { MassOrganizationService } from '@app/core/services/mass-organization/mass-organization.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ValidationService } from '@app/shared/services';
import { ACTION_FORM } from '@app/core';

@Component({
  selector: 'mass-organization-search',
  templateUrl: './mass-organization-search.component.html',
  styleUrls: ['./mass-organization-search.component.css']
})
export class MassOrganizationSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  typeList: any;
  branch: any; // chuyen man
  resultList: any;
  formconfig = {
    massOrganizationId: [''],
    parentId: [''],
    parentName: [''],
    code: [''],
    name: [''],
    type: [''],
    employeeId: [''],
    phoneNumber: [''],
    email: [''],
    effectiveDate: [''],
    expiredDate: [''],
    toEffectiveDate: [''],
    branch: [''],
    fullName: [''],
    cateName: ['']
  }
  constructor(
    public actr: ActivatedRoute,
    private massOrganizationService: MassOrganizationService,
    private router: Router,
    private app: AppComponent,
    private helperService: HelperService,
  ) {
    super(actr, CommonUtils.getPermissionCode("resource.massOrganization"), ACTION_FORM.VIEW);
    this.setMainService(massOrganizationService);
    this.formSearch = this.buildForm({}, this.formconfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('effectiveDate', 'toEffectiveDate', 'common.label.toDate')]);
    // this.typeList = APP_CONSTANTS.TYPEORGANIZATION;
    const subPaths = this.router.url.split('/');
    if (subPaths.length >= 2) {
      if (subPaths[2] === 'organization-women') {
        this.branch = 1;
      }
      if (subPaths[2] === 'organization-youth') {
        this.branch = 2;
      }
      if (subPaths[2] === 'organization-union') {
        this.branch = 3;
      }
    }
    this.formSearch.controls['branch'].setValue(this.branch);
    // this.branch = 1;
    this.getTypeWithBranch(this.branch);
    // tim kiem phuc vu cho slelect node tren tree
    this.actr.params.subscribe(params => {
      if (params && params.id != null) {
        this.formSearch.controls['massOrganizationId'].setValue(`${params.id}`);
        this.formSearch.controls['parentId'].setValue(`${params.id}`);
      } else {
        this.helperService.reloadTreeMass('complete');
      }
      this.helperService.resetMass();
      this.processSearch();
      this.formSearch.controls['massOrganizationId'].setValue(null);
      this.formSearch.controls['parentId'].setValue(null);
    });
  }

  ngOnInit() {

  }

  get f() {
    return this.formSearch.controls;
  }

  public processDelete(item) {
    if (item && item.massOrganizationId > 0) {
      this.app.confirmDelete(null, () => {
        this.massOrganizationService.deleteById(item.massOrganizationId).subscribe(res => {
          if (this.massOrganizationService.requestIsSuccess(res)) {
            this.processSearch(null);
            this.helperService.reloadTreeMass('complete');
          }
        })
      }, () => {
        // rejected
      });
    }
  }

  public getTypeWithBranch(type: any) {
    this.massOrganizationService.getTypeWithBranch(type).subscribe(res => {
      this.typeList = res.data;
    });
  }

  public prepareSaveOrUpdate(item?: any) {
    if (item && item.massOrganizationId > 0) {
      this.massOrganizationService.findOne(item.massOrganizationId).subscribe(res => {
        if (res.data != null) {
          if (this.branch == 1) {
            this.router.navigate(['/mass/organization-women/mass-organization-edit/', item.massOrganizationId]);
          }
          if (this.branch == 2) {
            this.router.navigate(['/mass/organization-youth/mass-organization-edit/', item.massOrganizationId]);
          }
          if (this.branch == 3) {
            this.router.navigate(['/mass/organization-union/mass-organization-edit/', item.massOrganizationId]);
          }
        }
      });
    } else {
      if (this.branch == 1) {
        this.router.navigate(['/mass/organization-women/mass-organization-add']);
      }
      if (this.branch == 2) {
        this.router.navigate(['/mass/organization-youth/mass-organization-add']);
      }
      if (this.branch == 3) {
        this.router.navigate(['/mass/organization-union/mass-organization-add']);
      }
    }
  }

  public processView(item?: any) {
    // this.router.navigate(['/mass/organization-women/mass-organization-view/', item.massOrganizationId]);
    if (this.branch == 1) {
      this.router.navigate(['/mass/organization-women/mass-organization-view/', item.massOrganizationId]);
    }
    if (this.branch == 2) {
      this.router.navigate(['/mass/organization-youth/mass-organization-view/', item.massOrganizationId]);
    }
    if (this.branch == 3) {
      this.router.navigate(['/mass/organization-union/mass-organization-view/', item.massOrganizationId]);
    }
  }

  public processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.massOrganizationService.export(params).subscribe(res => {
      if (this.branch == 1) {
        saveAs(res, 'Danh_sach_to_chuc_phu_nu.xlsx');
      }
      if (this.branch == 2) {
        saveAs(res, 'Danh_sach_to_chuc_thanh_nien.xlsx');
      }
      if (this.branch == 3) {
        saveAs(res, 'Danh_sach_to_chuc_cong_doan.xlsx');
      }
    });
  }

  public genPhoneAndEmail(event: any) {
    this.massOrganizationService.getEmployee(event.selectField).subscribe(res => {
      this.formSearch.controls['phoneNumber'].setValue(res.phoneNumber);
      this.formSearch.controls['email'].setValue(res.email);
    });
  }

  /**
  * Import
  */
  public import() {
    let url = "";
    if (this.branch == 1) {
      url = 'organization-women'
    }
    if (this.branch == 2) {
      url = 'organization-youth'
    }
    if (this.branch == 3) {
      url = 'organization-union'
    }
    this.router.navigate(['/mass/' + url + '/mass-organization-import']);
  }
}
