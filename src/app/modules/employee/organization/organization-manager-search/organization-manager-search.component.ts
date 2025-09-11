import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {ACTION_FORM, APP_CONSTANTS} from '@app/core';
import { HrStorage } from '@app/core/services/HrStorage';
import { OrganizationService } from '@app/core/services/hr-organization/organization/organization.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';

@Component({
  selector: 'organization-manager-search',
  templateUrl: './organization-manager-search.component.html',
  styleUrls: ['./organization-manager-search.component.css']
})
export class OrganizationManagerSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  organizationId: any;
  checkVfsAccountingType = '';
  listOrgLevelReal = APP_CONSTANTS.ORG_LEVEL_REAL;
  lstAccountingType =  [{id: "Độc lập", name: "Độc lập"},
    {id: "Phụ thuộc", name: "Phụ thuộc"},
    {id: null, name: "Khác"},
  ];
  formConfig = {
    organizationId: [''],
    name: [''],
    code:[''],
    vfsRequester:[''],
    vfsDepartment:[''],
    vfsSegment:[''],
    vfsSalesRegion:[''],
    bankAccountNumber:[''],
    bank:[''],
    bankAccountName:[''],
    accountantEmail:[''],
    accountingType:[''],
    isActive:[''],
    unionByUnit:[''],
    transferToSubOrg:[''],
    fundCenter:[''],
    costCenter:[''],
    sap_bpartner: [''],
    branch_code: [''],
    bankKey: [''],
    allowanceRequester: [''],
    bankAccountAllowance: [''],
    bankKeyAllowance: [''],
    vfsAccountingType: [''],
    orgLevelReal: [''],
    outgoingsangnnpay: [''],
    outgoingsangnnpayAccount: [''],
    outgoingBank: [''],
    outgoingBankAccount: [''],
    profitCenter: [''],
  };
  branchCode: any;
  defaultDomain: any;
  private operationKey = 'action.view';
  private adResourceKey = 'resource.managerOrganization';

  constructor(
    public actr: ActivatedRoute
    , private organizationService: OrganizationService
    ,private app: AppComponent
    , private helperService: HelperService
    , private router: Router) {
    super(null, CommonUtils.getPermissionCode("resource.managerOrganization"));
    this.setMainService(organizationService);
    this.buildForms();
    this.defaultDomain = HrStorage.getDefaultDomainByCode(CommonUtils.getPermissionCode(this.operationKey)
      , CommonUtils.getPermissionCode(this.adResourceKey));
    if (this.defaultDomain) {
      this.f['organizationId'].setValue(this.defaultDomain);
    }
    // tim kiem phuc vu cho select node tren tree
    this.doSearch();
  }
  
  doSearch() {
    this.actr.params.subscribe(params => {
      if (params && params.id != null) {
        this.organizationService.findOne(params.id).subscribe(res => {
          this.organizationId = res.data.organizationId;
          this.buildForms(res.data);
          console.log(res.data)
          this.branchCode =res.data.branch_code
        })
      } else {
        this.helperService.reloadTreeParty('complete');
      }
      this.helperService.resetParty();
      this.formSearch.controls['organizationId'].setValue(null);
    });
  }

  ngOnInit() {
  }

  get f() {
    return this.formSearch.controls;
  }

  private buildForms(data?: any): void {
    if(data){
      this.formSearch = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, []);
      this.checkVfsAccountingType = data.vfsAccountingType;
      const filesControl = new FileControl(null);
      if (data && data.fileAttachment) {
        if (data.fileAttachment.fileImage) {
          filesControl.setFileAttachment(data.fileAttachment.fileImage);
        }
      }
      this.formSearch.addControl('fileImage', filesControl);
    }else{
      this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW);

      const filesControl = new FileControl(null, ValidationService.required);
      this.formSearch.addControl('fileImage', filesControl);
    }
    
  }

  prepareSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    if(this.formSearch.value.transferToSubOrg){
      if(!this.formSearch.value.bankAccountNumber || !this.formSearch.value.bank|| !this.formSearch.value.bankAccountName||!this.formSearch.value.bankKey||this.formSearch.value.bankAccountNumber =="" || this.formSearch.value.bank =="" || this.formSearch.value.bankAccountName ==""|| this.formSearch.value.bankKey ==""){
        this.app.warningMessage('','Bắt buộc nhập Số tài khoản ngân hàng nhận tiền, Ngân hàng, Tên chủ tài khoản, Mã ngân hàng!');
        return;
      }
    }
    if(this.checkVfsAccountingType != ''  && this.checkVfsAccountingType != null && (this.formSearch.value.bankKey == "" || this.formSearch.value.bankKey == null)){
      this.app.warningMessage('','Bắt buộc nhập mã ngân hàng đối với trường hợp này!');
    }else{
      const formInput = {...this.formSearch.value}
      console.log(formInput)
      formInput['organizationId'] = this.organizationId;
      if(this.formSearch.value.orgLevelReal == null){
        this.app.confirmMessage('', () => {// on accept
          this.organizationService.saveOrUpdateFormFile(formInput)
              .subscribe(res => {
                if (this.organizationService.requestIsSuccess(res)) {
                }
                this.doSearch()
              });
        }, () => {// on rejected

        });
      }else{
        const formValue = {
          organizationId: this.formSearch.value.organizationId,
          orgLevelReal: this.formSearch.value.orgLevelReal
        }
        this.organizationService.isSmallThanParentId(formValue).subscribe(res => {
          if(res.data){
            this.app.confirmMessage('', () => {// on accept
              this.organizationService.saveOrUpdateFormFile(formInput)
                  .subscribe(res => {
                    if (this.organizationService.requestIsSuccess(res)) {
                    }
                    this.doSearch()
                  });
            }, () => {// on rejected

            });
          }else{
            this.app.warningMessage('', ' Đơn vị con không được chọn cấp lên trên đơn vị cha!');
          }
        })
      }
    }
  }
}
