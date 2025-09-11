import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { HrStorage } from '@app/core/services/HrStorage';
import { PersonalPunishmentService } from '@app/core/services/punishment/personal-punishment.service';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'personal-punishment-search',
  templateUrl: './personal-punishment-search.component.html',
  styleUrls: ['./personal-punishment-search.component.css']
})
export class PersonalPunishmentSearchComponent extends BaseComponent implements OnInit {
  punishmentTypeList: any;
  punishmentFormList: any;
  partyPunishmentFormList: any;
  decissionLevelList: any;
  formConfig = {
    organizationId: [''],
    employeeName: [''],
    employeeCode: [''],
    isPartyMember: [''],
    decissionNumber: [''],
    documentNumber: [''],
    decissionLevelId: [''],
    signedDateFrom: [''],
    signedDateTo: [''],
    signer: [''],
    punishmentTypeId: [''],
    reason: [''],
    physicalResponsibility: [''],
    punishmentFormId: [''],
    partyPunishmentFormId: [''],
    isOrganizationId: [false],
    isEmployeeName: [false],
    isEmployeeCode: [false],
    isShowPartyMember: [false],
    isDecissionNumber: [false],
    isDocumentNumber: [false],
    isDecissionLevelId: [false],
    isSignedDateFrom: [false],
    isSignedDateTo: [false],
    isSigner: [false],
    isPunishmentTypeId: [false],
    isReason: [false],
    isPhysicalResponsibility: [false],
    isPunishmentFormId: [false],
    isPartyPunishmentFormId: [false]
  };
  private defaultDomain: any;
  private grantedDomain: any;
  private operationKey = 'action.view';
  private adResourceKey = 'resource.punishment';

  constructor(
    public actr: ActivatedRoute,
    private personalPunishmentService: PersonalPunishmentService,
    private fileStorage: FileStorageService,
    private router: Router,
    private app: AppComponent,
    private sysCatService: SysCatService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.punishment"));
    this.setMainService(personalPunishmentService);

    //Lấy miền dữ liệu mặc định theo nv đăng nhập
    this.defaultDomain = HrStorage.getDefaultDomainByCode(CommonUtils.getPermissionCode(this.operationKey)
      , CommonUtils.getPermissionCode(this.adResourceKey));

    //Lấy miền dữ liệu theo nv đăng nhập
    this.grantedDomain = HrStorage.getGrantedDomainByCode(CommonUtils.getPermissionCode(this.operationKey)
      , CommonUtils.getPermissionCode(this.adResourceKey));

    this.sysCatService.getSysCatListBySysCatTypeIdSortOrderOrName(APP_CONSTANTS.PERSONAL_PUNISHMENT.CQD).subscribe(res => {
      this.decissionLevelList = res.data;
    });
    this.sysCatService.getSysCatListBySysCatTypeIdSortOrderOrName(APP_CONSTANTS.PERSONAL_PUNISHMENT.LP).subscribe(res => {
      this.punishmentTypeList = res.data;
    });
    this.sysCatService.getSysCatListBySysCatTypeIdSortOrderOrName(APP_CONSTANTS.PERSONAL_PUNISHMENT.KLCQ).subscribe(res => {
      this.punishmentFormList = res.data;
    });
    this.sysCatService.getSysCatListBySysCatTypeIdSortOrderOrName(APP_CONSTANTS.PERSONAL_PUNISHMENT.KLD).subscribe(res => {
      this.partyPunishmentFormList = res.data;
    });
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('signedDateFrom', 'signedDateTo', 'common.label.toDate')]);
    if (this.defaultDomain) {
      this.f['organizationId'].setValue(this.defaultDomain);
    }
    this.processSearch(null);
  }

  ngOnInit() {
  }

  get f() {
    return this.formSearch.controls;
  }


  public prepareSaveOrUpdate(item?: any) {
    if (item && item.punishmentId > 0) {
      this.router.navigate(['/monitoring-inspection/personal-punishment-managerment/edit/', item.punishmentId]);
    } else {
      this.router.navigate(['/monitoring-inspection/personal-punishment-managerment/add']);
    }
  }

  public processExport() {
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.personalPunishmentService.processExport(params).subscribe(res => {
      saveAs(res, 'danh_sach_ky_luat_ca_nhan.xlsx');
    });
  }

  public import() {
    this.router.navigate(['/monitoring-inspection/personal-punishment-managerment/import']);
  }

  processDelete(item) {
    if (item && item.punishmentId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.personalPunishmentService.deleteById(item.punishmentId)
          .subscribe(res => {

            if (this.personalPunishmentService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      }, () => {// on rejected
      });
    }
  }

  checkUserDomain(orgPath) {
    if (orgPath) {
      var orgList = [];
      orgList = orgPath.split('/');
      let idDomain = this.grantedDomain.split(',');
      if (orgPath.includes(idDomain[0] + "") || orgPath.includes(idDomain[1] + "")) {
        return true;
      }
    }
    return false;
  }

  public downloadFile(fileData) {
    this.fileStorage.downloadFile(fileData.secretId).subscribe(res => {
      saveAs(res, fileData.fileName);
    });
  }

}
