import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS } from '@app/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import {VfsReimbursementService} from "@app/core/services/vfs-reimbursement/vfs-reimbursement.service";
import {RewardProposeSignService} from "@app/core/services/reward-propose-sign/reward-propose-sign.service";

@Component({
  selector: 'reward-payment-reporting',
  templateUrl: './reward-payment-reporting.component.html',
  styleUrls: ['./reward-payment-reporting.component.css']
})
export class RewardPaymentReportingComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  paymentStatusList: any;
  approveStatusList: any;
  accountingStatusList: any;
  signerStatusList: any;
  apcashStatusList: any;
  typeList: any;

  numIndex = 1;
  firstRowIndex = 0;
  pageSize = 10;
  selectedRows:any;
  listReimbursement:any;
  listRewardProposeSign: any;
  formConfig = {
    rewardProposeSignId: [null],
    organizationId: [null],
    requesterValue:[null],
    email: [null],
    documentNo:[null],
    transDate:[null],
    description:[null],
    synKeyInvoiceGroup:[null],
    totalAmount:[null],
    paymentStatus: [null],
    type: [null],
    departmentValue: [null],
    approveStatus: [null],
    accountingStatus: [null],
    signerStatus: [null],
    apcashStatus: [null],
    isRewardProposeSignId: [false],
    isOrganizationId: [false],
    isRequesterValue: [false],
    isEmail: [false],
    isDocumentNo: [false],
    isTransDate: [false],
    isDescription: [false],
    isSynKeyInvoiceGroup: [false],
    isTotalAmount: [false],
    isPaymentStatus: [false],
    isApproveStatus: [false],
    isAccountingStatus: [false],
    isSignerStatus: [false],
    isApcashStatus: [false]
  };
  constructor(
    private router: Router,
    private app: AppComponent,
    private vfsReimbursementService: VfsReimbursementService,
    private rewardProposeSignService : RewardProposeSignService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.rewardGeneral"));
    this.formSearch = this.buildForm({}, this.formConfig)
  }

  ngOnInit() {
    this.paymentStatusList = [
      {label:"Chưa tạo bảng THTT", value: 0},
      {label:"Tài chính chưa duyệt", value: 1},
      {label:"TC đã duyệt", value: 2},
      {label: "Lỗi khi tạo bảng THTT", value: 3},
      {label:"Hủy tính thuế", value: 4},
      {label:"Dữ liệu lỗi", value: 5},
      {label:"Đã tính thuế TNCN thành công", value: 6},
      {label:"Đã hạch toán", value: 7},
      {label:"Đã ký Voffice", value: 8},
      {label:"Đã tạo Đề nghị chuyển tiền", value: 9},
      {label:"Đã chi tiền", value: 10},
    ]

    this.approveStatusList = [
      {label:"Chưa đề nghị duyệt", value: 'DR'},
      {label:"Đề nghị duyệt", value: 'RQ'},
      {label:"Đã duyệt", value: 'PO'},
      {label:"Từ chối", value: 'DN'},
    ]

    this.accountingStatusList = [
      {label:"Đã hạch toán", value: 'Y'},
      {label:"Chưa hạch toán", value: 'N'},
    ]

    this.signerStatusList = [
      {label:"Chưa ký", value: '0'},
      {label:"Văn thư từ chối", value: '1'},
      {label:"Lãnh đạo từ chối", value: '2'},
      {label:"Đã phê duyệt", value: '3'},
      {label:"Hủy luồng", value: '4'},
      {label:"Đã ban hành", value: '5'},
      {label:"Chờ ký", value: '10'},
    ]

    this.apcashStatusList = [
      {label:"Đã chi", value: 'Y'},
      {label:"Chưa chi", value: 'N'},
    ]

    this.typeList = [
      {label:"Thanh toán cho đối tác", value: '0'},
      {label:"Trực tiếp", value: '2'},
    ]


    this.rewardProposeSignService.search().subscribe(res=>{
      this.listRewardProposeSign = res.data.filter(gop => {
        return gop.status == 3;
      });
    })
  }
  get f() {
    return this.formSearch.controls;
  }
  public onProposeOrgChange(event) {
    if (event.organizationId > 0) {
      this.formSearch.controls['organizationId'].setValue(event.organizationId);
    }
  }
  public processSearch() {
    this.vfsReimbursementService.search(this.formSearch.value).subscribe(res=>{
      this.listReimbursement = res.data
    })
  }
  public prepareView(item){
    this.router.navigate(['/reward/reward-payment-reporting/', item.vfsReimbursementId]);
  }
}
