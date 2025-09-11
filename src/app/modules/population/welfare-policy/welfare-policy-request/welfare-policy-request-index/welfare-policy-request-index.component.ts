import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ACTION_FORM, LARGE_MODAL_OPTIONS, RequestReportService } from '@app/core';
import { Router } from '@angular/router';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { AppComponent } from '@app/app.component';
import { DialogService } from 'primeng/api';
import {FileStorageService} from "@app/core/services/file-storage.service";
import { CommonUtils } from '@app/shared/services';
import { WelfarePolicyCategoryService } from '@app/core/services/population/welfare-policy-category.service';
import { WelfarePolicyRequestService } from '@app/core/services/population/welfare-policy-request.service';
import { WelfarePolicyRequestFormComponent } from '../welfare-policy-request-form/welfare-policy-request-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {HrStorage} from "../../../../../core/services/HrStorage";
@Component({
  selector: 'welfare-policy-request-index',
  templateUrl: './welfare-policy-request-index.component.html',
  styleUrls: ['./welfare-policy-request-index.component.css']
})
export class WelfarePolicyRequestComponent extends BaseComponent implements OnInit {
  welfarePolicyRequestFormComponent: WelfarePolicyRequestFormComponent;
  welfarePolicyCategoryList : any;
  userLogin = HrStorage.getUserToken().employeeCode
  formConfig = {
    organizationId: [null],
    employeeId: [null],
    welfarePolicyCategoryId: [''],
    status: [null],
    startDate: [null],
    endDate: [null],
    chairmanType: [null],
    documentState: [null],
    isStartDate: [false],
    isWelfarePolicyCategory: [false],
    isStatus: [false],
    isEndDate: [false],
    isOrganizationId: [false],
    isEmployeeId: [false],
    isChairmanType: [false],
    isDocumentState: [false],
  }
  statusList = [
    { name: 'Dự thảo', value: 0 },
    { name: 'Chờ tiếp nhận', value: 1 },
    { name: 'Đã tiếp nhận', value: 2 },
    { name: 'Bị từ chối', value: 3 },
    { name: 'Đã thăm hỏi', value: 4 },
    { name: 'Chờ thanh toán (ứng với đã lập đề nghị chi)', value: 5 },
    { name: 'Đã thanh toán', value: 6 },
  ]
  chairmanTypeList = [
    { name: 'Đơn vị', value: 2 },
    { name: 'Ban giám đốc', value: 1 }
  ]
  documentStateList = [
    { name: 'Đủ', value: 1 },
    { name: 'Thiếu', value: 2 }
  ]
  tableColumnsConfig = [
    {
      header: "common.label.table.action",
      width: "50px"
    },
    {
      header: "common.table.index",
      width: "50px"
    },
    {
      name: "employeeName",
      header: "label.welfare.policy.request.employee",
      width: "200px"
    },
    {
      name: "empOrganizationName",
      header: "common.label.unit",
      width: "200px"
    },
    {
      name: "organizationName",
      header: "label.welfare.policy.request.organization",
      width: "200px"
    },
    {
      name: "welfarePolicyCategoryName",
      header: "label.welfare.policy.request.welfarePolicyCategory",
      width: "200px"
    },
    {
      name: "welfarePolicyProposalName",
      header: "label.welfare.policy.proposal.welfarePolicyProposal",
      width: "200px"
    },
    {
      name: "objectType",
      header: "label.welfare.policy.category.objectType",
      width: "200px"
    },
    {
      name: "relationshipName",
      header: "label.welfare.policy.category.relationship",
      width: "200px"
    },
    {
      name: "objectName",
      header: "label.welfare.policy.requestList.objectName",
      width: "200px"
    },
    {
      name: "requestDate",
      header: "label.welfare.policy.request.requestDate",
      width: "200px"
    },
    {
      name: "status",
      header: "label.welfare.policy.request.status",
      width: "200px"
    },
    {
      name: "documentState",
      header: "label.welfare.policy.request.documentState",
      width: "200px"
    },
    {
      name: "reason",
      header: "profile.table.note",
      width: "200px"
    },
    {
      name: "chairmanTypeName",
      header: "label.welfare.policy.request.chairmanType",
      width: "200px"
    },
    {
      name: "amountTotal",
      header: "label.welfare.policy.request.amountTotal",
      width: "200px"
    }
  ]

  constructor(
    private router: Router,
    private appParamService: AppParamService,
    private requestReportService: RequestReportService,
    private app: AppComponent,
    public dialogService: DialogService,
    private welfarePolicyCategoryService: WelfarePolicyCategoryService,
    private service: WelfarePolicyRequestService,
    private fileStorage: FileStorageService,
    public modalService: NgbModal
  ) {
    super(null, CommonUtils.getPermissionCode("resource.welfarePolicyRequest"));
    this.setMainService(this.service);
    this.formSearch = this.buildForm('', this.formConfig, ACTION_FORM.VIEW);
  }

  ngOnInit() {
    this.welfarePolicyCategoryService.findAllByType(1).subscribe(res => {
      this.welfarePolicyCategoryList = res.filter(data => data.type == 1)
      this.formSearch = this.buildForm('', this.formConfig, ACTION_FORM.VIEW);
      this.search()
    });
    this.service.refreshList.subscribe(res => {
      if (res) {
        this.search()
      }
    })
  }

  get f() {
    return this.formSearch.controls;
  }

  navigateToCreatePage() {
    this.router.navigateByUrl('/population/welfare-policy-request/create');
  }

  navigateToUpdatePage(rowData?) {
    this.router.navigateByUrl(`/population/welfare-policy-request/update/${rowData.welfarePolicyRequestId}`);
  }

  navigateToViewPage(rowData?) {
    this.router.navigateByUrl(`/population/welfare-policy-request/view/${rowData.welfarePolicyRequestId}`);
  }

  search(event?) {
    this.service.search(this.formSearch.value, event).subscribe(res => {
      this.resultList = res;
    });
  }

  deleteWelfarePolicyRequest(rowData) {
    this.app.confirmDelete(null,
      () => {
        this.service.deleteById(rowData.welfarePolicyRequestId)
          .subscribe(res => {
              this.search();
          })
      },
      () => { }
    )
  }

  public processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.service.export(params).subscribe(res => {
      saveAs(res, 'Danh_sach_de_nghi_chinh_sach_trong_don_vi.xlsx');
    });
  }

  openPopup(data: any, index: any) {
    this.activeModalAdditional(data, index);
  }

  activeModalAdditional(data?: any, index?: any) {
    if (index === 1) {
      this.app.confirm('label.welfare.policy.request.confirmStatus.message', 'label.welfare.policy.request.confirmStatus.title', () => {// on accepted
        const modalRef = this.modalService.open(WelfarePolicyRequestFormComponent, LARGE_MODAL_OPTIONS);
        if (data) {
          modalRef.componentInstance.setFormValue(data, index);
        }
        modalRef.result.then((result: any) => {
          if (!result) {
            return;
          }
        });
      }, () => {// on rejected
      });
    } else {
      const modalRef = this.modalService.open(WelfarePolicyRequestFormComponent, LARGE_MODAL_OPTIONS);
      if (data) {
        modalRef.componentInstance.setFormValue(data, index);
      } else {
        modalRef.componentInstance.setFormBirthDayValue(index);
      }
      modalRef.result.then((result: any) => {
        if (!result) {
          return;
        }
        this.search();
      });
    }
  }


}