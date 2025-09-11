import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, DEFAULT_MODAL_OPTIONS } from '@app/core';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { TranslationService } from 'angular-l10n';
import { PartyAdmissionService } from '@app/core/services/party-admission/party-admission.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileImportPartyManagementComponent } from '../file-import-party-management/file-import-party-management.component';

@Component({
  selector: 'admission-sympathy-management',
  templateUrl: './admission-sympathy-management.component.html',
  styleUrls: ['./admission-sympathy-management.component.css']
})
export class AdmissionSympathyManagementComponent extends BaseComponent implements OnInit, AfterViewInit {

  formSearch: FormGroup;
  isMobileScreen: boolean = false;
  formConfig = {
    organizationId: [''],
    employeeId: [''],
  };

  statusList: any[] = [
    { statusId: '0', name: 'Tất cả' },
    { statusId: '1', name: 'Đang thực hiện' },
    { statusId: '2', name: 'Dự thảo' },
    { statusId: '3', name: 'Tạm dừng' },
    { statusId: '4', name: 'Bị hủy' },
    { statusId: '5', name: 'Kết thúc' },
  ];


  constructor(
    private app: AppComponent,
    public translation: TranslationService,
    private router: Router,
    private partyAdmissionService: PartyAdmissionService,
    private modalService: NgbModal
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyMember"));

    this.setMainService(partyAdmissionService);

    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW, []);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }
  ngAfterViewInit(): void {
    this.processSearch();
  }

  ngOnInit() {
    // //Lấy miền dữ liệu mặc định theo nv đăng nhập
    // this.defaultDomain = HrStorage.getDefaultDomainByCode(CommonUtils.getPermissionCode(this.operationKey)
    //   , CommonUtils.getPermissionCode(this.adResourceKey));
    // // // search
    // // if (this.defaultDomain) {
    // //   this.service.findOne(this.defaultDomain)
    // //     .subscribe((res) => {
    // //       const data = res.data;
    // //       if (data) {
    // //         this.f['proposeOrgId'].setValue(data.organizationId);
    // //       }
    // //       this.processSearch();
    // //     });
    // // } else {
    // //   this.processSearch();
    // // }
    
    // this.processSearch();
  }


  get f() {
    return this.formSearch.controls;
  }

  /**
   * Thêm mới
   * @param item
   */
  public add() {
    this.router.navigate(['/party-organization/admission_management/add']);
  }

  /**
   * Xem chi tiết
   * @param item
   */
  public prepareView(item) {
  }

  /**
   * Cập nhật
   * @param item
   */
  public prepareSaveOrUpdate(item) {}

  /**
   * Tạm dừng
   * @param item
   */
  suspendend(item) {
    this.app.confirm('admissionManagement.message.confirm.suspended', 'admissionManagement.message.header.suspended', () => {

    }, () => {

    }, 'admissionManagement.button.suspended', 'common.button.out')
  }


  /**
   * Hủy đợt kết nạp
   * @param item
   */
  cancelRecruitment(item) {
    this.app.confirm('admissionManagement.message.confirm.cancel', 'admissionManagement.message.header.cancel', () => {

    }, () => {

    }, 'admissionManagement.button.cancel', 'common.button.out')
  }

  /**
   * Kết thúc
   * @param item
   */
  finished(item) {
    this.app.confirm('admissionManagement.message.confirm.finished', 'admissionManagement.message.header.finished', () => {

    }, () => {

    }, 'admissionManagement.button.finished', 'common.button.out')
  }

  /**
   * Danh sách kết nạp
   * @param item
   */
  admission() {}

  /**
   * Triển khai
   * @param item
   */
  deployment(item) {
    this.app.confirm('admissionManagement.message.confirm.deployment', 'admissionManagement.message.header.deployment', () => {

    }, () => {

    }, 'admissionManagement.button.deployment', 'common.button.out')
  }

  /**
   * Xóa
   * @param item
   */
  processDelete(item) {
    this.app.confirm('admissionManagement.message.confirm.delete', 'common.label.confirm', () => {

    }, () => {

    }, 'titleDelete', 'common.button.out')
  }


  public openFormImport() {
    const modalRef = this.modalService.open(FileImportPartyManagementComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance.setFormValue(this.propertyConfigs);
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
    });
  }
}
