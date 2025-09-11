import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router} from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ACTION_FORM, APP_CONSTANTS, OrganizationService } from '@app/core';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';
import { AppComponent } from '@app/app.component';
import { DialogService } from 'primeng/api';
import { RewardProposeSignService } from '@app/core/services/reward-propose-sign/reward-propose-sign.service';
import { RewardProposeSignErrorComponent } from '../reward-propose-sign-error/reward-propose-sign-error';
import {VfsInvoiceService} from "@app/core/services/vfs-invoice/vfs-invoice.service";

@Component({
  selector: 'reward-decide-list.component',
  templateUrl: './select-budget-date.component.html',
  styleUrls: ['./select-budget-date.component.css']
})
export class SelectBudgetDateComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  lstReason: any;
  selectedRows:[];
  formConfig = {
    budgetDate: [null,[ValidationService.required]],
    autoPayOrder:  [false]
  };
  formTable: {data: null, recordsTotal: 0};
  isPersonal: boolean;
  lstfunCategory = APP_CONSTANTS.REWARD_FUN_CATEGORY_LIST;  
  listYear: any;
  rewardObjectType: any;
  public dataError: any;
  public criteriaPlanTree;
  public massRequestId: any;
  public partyOrganizationId: any;
  public rewardProposeSignId: any;

  constructor(
    private rewardProposeSignService: RewardProposeSignService,
    private vfsInvoiceService : VfsInvoiceService,
    public activeModal: NgbActiveModal,
    public actr: ActivatedRoute,
    private app: AppComponent,
    private router: Router,
    public dialogService: DialogService,
  ) {
    super(null, 'REQUEST_RESOLUTION_QUARTER_YEAR');
    this.formSearch = this.buildForm({}, this.formConfig);
  }
  ngOnInit(): void {
    
  }

  
  get f() {
    return this.formSearch.controls;
  }
  
  public setFormValue(propertyConfigs: any, data?: any) {   
    //debugger
    this.propertyConfigs = propertyConfigs;
    this.rewardProposeSignId = data.formSearch.rewardProposeSignId;
    this.formSearch = this.buildForm(data.formSearch, this.formConfig, ACTION_FORM.INSERT, [])
   
  }
  
  processImport() {
    const saveData = this.formSearch.value;
    const rewardForm = {};
    rewardForm['rewardProposeSignId'] = this.rewardProposeSignId;
    rewardForm['budgetDate'] = saveData.budgetDate;
    rewardForm['autoPayOrder'] = saveData.autoPayOrder;
    
    if (!saveData.budgetDate) {
      this.app.errorMessage("rewardPropose.BudgetDate");
      return;
    }
   
      this.rewardProposeSignService.processTransferBTHTT(rewardForm)
          .subscribe(res => {
            if (this.rewardProposeSignService.requestIsSuccess(res)) {
              this.activeModal.close();
              this.router.navigate(['/reward/reward-propose-sign']);
            }
            else{
              const ref = this.dialogService.open(RewardProposeSignErrorComponent, {
                header: 'Thông báo lỗi',
                width: '50%',
                baseZIndex: 2000,
                contentStyle: {"padding": "0"},
                data: {
                  errorSAP: res.data
                }
              });
              console.log(this.rewardProposeSignId)
              this.exportInvoice()
              // this.app.errorMessage('reimbursement.error', res.data);
            }
          })
   
    
  }
  exportInvoice(){
    this.vfsInvoiceService.exportErrorInvoiceAfterPay(this.rewardProposeSignId).subscribe(res => {
      if(res && res.size > 0)
      saveAs(res, 'Danh sách hóa đơn lỗi.xls');
    })
  }
}
