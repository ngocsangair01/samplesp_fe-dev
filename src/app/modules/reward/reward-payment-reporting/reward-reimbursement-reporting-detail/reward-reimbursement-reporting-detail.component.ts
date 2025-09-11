import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {NavigationEnd, Router} from '@angular/router';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS } from '@app/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import {VfsReimbursementService} from "@app/core/services/vfs-reimbursement/vfs-reimbursement.service";
import {RewardProposeSignService} from "@app/core/services/reward-propose-sign/reward-propose-sign.service";
import {VfsInvoiceService} from "@app/core/services/vfs-invoice/vfs-invoice.service";
import {VfsPitAppendixService} from "@app/core/services/vfs-pit-appendix/vfs-pit-appendix.service";
import {
  RewardProposeSignErrorComponent
} from "@app/modules/reward/reward-propose-sign/reward-propose-sign-error/reward-propose-sign-error";
import {DialogService} from "primeng/api";

@Component({
  selector: 'reward-payment-reporting',
  templateUrl: './reward-reimbursement-reporting-detail.component.html',
  styleUrls: ['./reward-reimbursement-reporting-detail.component.css']
})
export class RewardReimbursementReportingDetailComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  paymentStatusList: any;
  vfsReimbursementId : any;
  numIndex = 1;
  firstRowIndex = 0;
  pageSize = 10;
  selectedRows:any;
  listReimbursement:any;
  typeList:any;
  listReimbursementInvoice: any;
  listRewardProposeSign: any;
  listVfsPitAppendix: any;
  formConfig = {
    rewardProposeSignId: [null],
    organizationId: [null],
    departmentValue: [null],
    type:[null],
    requesterValue:[null],
    email: [null],
    documentNo:[null],
    documentNoStatement:[null],
    transDate:[null],
    description:[null],
    synKeyInvoiceGroup:[null],
    totalAmount:[null],
    paymentStatus: [null],
    syncError: [null],
    fundReservationLine:[null]
  };
  constructor(
    private router: Router,
    private app: AppComponent,
    private vfsReimbursementService: VfsReimbursementService,
    private vfsInvoiceService : VfsInvoiceService,
    private vfsPitAppendixService : VfsPitAppendixService,
    private rewardProposeSignService : RewardProposeSignService,
    private dialogService: DialogService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.rewardGeneral"));
    this.formSearch = this.buildForm({}, this.formConfig)
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 3) {
      this.vfsReimbursementId = subPaths[3];
    }
    this.rewardProposeSignService.search().subscribe(res=>{
      this.listRewardProposeSign = res.data;
    })
  }

  ngOnInit() {
    this.typeList = [
      {label:"Thanh toán cho đối tác", value: '0'},
      {label:"Trực tiếp", value: '2'},
    ]

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
    if(this.vfsReimbursementId != null){
      this.vfsReimbursementService.findById(this.vfsReimbursementId).subscribe(res=>{
        this.formSearch = this.buildForm(res,this.formConfig);
        this.vfsInvoiceService.searchByReimbursementId(this.vfsReimbursementId).subscribe(res => {
          this.listReimbursementInvoice = res
        })
        this.vfsPitAppendixService.searchByReimbursementId(this.vfsReimbursementId).subscribe(res=>{
          this.listVfsPitAppendix = res;
        })
      })

    }
  }
  get f() {
    return this.formSearch.controls;
  }
  public onProposeOrgChange(event) {
    if (event.organizationId > 0) {
      this.formSearch.controls['organizationId'].setValue(event.organizationId);
    }
  }
  public transferPayment(){
    // console.log(this.vfsReimbursementId)
    this.vfsReimbursementService.transferReimbursementToSap(this.vfsReimbursementId).subscribe(res=>{

    })
  }

  exportInvoice(){
    const reqData = {'vfsReimbursementId': this.vfsReimbursementId}
    this.vfsInvoiceService.export(reqData).subscribe(res => {
      saveAs(res, 'Danh sách hóa đơn.xls');
    })
  }

  openModal(errorMsg: any) {
    if(errorMsg) {
      const ref = this.dialogService.open(RewardProposeSignErrorComponent, {
        header: 'Mô tả chi tiết lỗi',
        width: '50%',
        baseZIndex: 2000,
        contentStyle: {"padding": "0"},
        data: {
          errorSAP: errorMsg
        }
      });
    }
  }
}
