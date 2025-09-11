import { Component, NgModuleRef, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS, LARGE_MODAL_OPTIONS ,MEDIUM_MODAL_OPTIONS} from '@app/core';
import { CategoryService } from '@app/core/services/setting/category.service';
import { SignDocumentService } from '@app/core/services/sign-document/sign-document.service';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  TransferPartyMemberWarningService
} from "@app/core/services/party-organization/transfer-party-member-warning.service";

@Component({
  selector: 'transfer-party-member-warning',
  templateUrl: './transfer-party-member-warning.component.html',
  styleUrls: ['./transfer-party-member-warning.component.css']
})
export class TransferPartyMemberWarningComponent extends BaseComponent implements OnInit {
  partyTypeList: any;
  typeList = APP_CONSTANTS.TRANSFER_PARTY_MEMBER_WARNING_TYPE;
  transferTypeList = APP_CONSTANTS.TRANSFER_PARTY_MEMBER_TYPE;
  conditionPartyMember: string;
  isMobileScreen: boolean = false;
  formSearch: FormGroup;
  formConfig = {
    employeeId: ['', []],
    type: [''],
    isTransferType: [false],
    isEmployeeId: [false],
  };
  isJobActive: [false];

  constructor(
    private transferPartyMemberWarningService: TransferPartyMemberWarningService,
    private modalService: NgbModal,
    public sysCatService: SysCatService,
    public categoryService: CategoryService,
    private router: Router,
    private app: AppComponent,
    private signDocumentService: SignDocumentService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.transferPartyMember"));
    this.setMainService(transferPartyMemberWarningService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW);
    this.processSearch();
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
  }

  get f() {
    return this.formSearch.controls;
  }


  public goBack() {
    this.router.navigate(['/party-organization/transfer-party-member']);
  }
}
