import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM } from '@app/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { TranslationService } from 'angular-l10n';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'admission-management',
  templateUrl: './admission-management.component.html',
  styleUrls: ['./admission-management.component.css']
})
export class AdmissionManagementComponent extends BaseComponent implements OnInit {

  formSearch: FormGroup;
  isMobileScreen: boolean = false;
  formConfig = {
    admissionBatchName: ['', [ValidationService.maxLength(200)]],
    partyOrganizationId: [''],
    admissionDate: [null],
    deadlineDate: [null],
    status: ['0'],
    isPartyOrganizationId: [false],
  };

  statusList: any[] = [
    { statusId: '0', name: 'Tất cả' },
    { statusId: '1', name: 'Đang thực hiện' },
    { statusId: '2', name: 'Dự thảo' },
    { statusId: '3', name: 'Tạm dừng' },
    { statusId: '4', name: 'Bị hủy' },
    { statusId: '5', name: 'Kết thúc' },
  ];

  resultList = {
    data: [
      {
        admissionBatchName: 'Đợt kết nạp ngày 02/09/2025',
        admissionDate: 1591635600000,
        deadlineDate: 1591635600000,
        partyOrganizationName: 'Đảng bộ TCT Viễn thông - Đảng bộ tập đoàn',
        attachment: '',
        status: '1',
        createdDate: 1591635600000
      },
      {
        admissionBatchName: 'Đợt kết nạp ngày 02/09/2025',
        admissionDate: 1591635600000,
        deadlineDate: 1591635600000,
        partyOrganizationName: 'Đảng bộ TCT Viễn thông - Đảng bộ tập đoàn',
        attachment: '',
        status: '2',
        createdDate: 1591635600000
      },
      {
        admissionBatchName: 'Đợt kết nạp ngày 02/09/2025',
        admissionDate: 1591635600000,
        deadlineDate: 1591635600000,
        partyOrganizationName: 'Đảng bộ TCT Viễn thông - Đảng bộ tập đoàn',
        attachment: '',
        status: '3',
        createdDate: 1591635600000
      },
      {
        admissionBatchName: 'Đợt kết nạp ngày 02/09/2025',
        admissionDate: 1591635600000,
        deadlineDate: 1591635600000,
        partyOrganizationName: 'Đảng bộ TCT Viễn thông - Đảng bộ tập đoàn',
        attachment: '',
        status: '4',
        createdDate: 1591635600000
      },
      {
        admissionBatchName: 'Đợt kết nạp ngày 02/09/2025',
        admissionDate: 1591635600000,
        deadlineDate: 1591635600000,
        partyOrganizationName: 'Đảng bộ TCT Viễn thông - Đảng bộ tập đoàn',
        attachment: '',
        status: '5',
        createdDate: 1591635600000
      }
    ],
    draw: null,
    extendData: {},
    first: "0",
    headerConfig: null,
    json: "",
    recordsFiltered: "5",
    recordsTotal: "5"
  }

  constructor(
    private app: AppComponent,
    public translation: TranslationService,
    private router: Router,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyMember"));
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW, []);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
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
}
