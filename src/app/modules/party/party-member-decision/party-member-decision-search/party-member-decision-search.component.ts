import { DEFAULT_MODAL_OPTIONS, LARGE_MODAL_OPTIONS } from "@app/core/app-config";
import { PartyMemberDecisionSignFileComponent } from "./../party-member-decision-sign-file/party-member-decision-sign-file.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SignDocumentService } from "@app/core/services/sign-document/sign-document.service"
import { CommonUtils } from "./../../../../shared/services/common-utils.service"
import { Component, OnInit } from "@angular/core"
import { FormGroup } from "@angular/forms"
import { Router } from "@angular/router"
import { AppComponent } from "@app/app.component"
import { ACTION_FORM, APP_CONSTANTS } from "@app/core"
import { PartyMemberDecisionService } from "@app/core/services/party-organization/party-member-decision.service"
import { BaseComponent } from "@app/shared/components/base-component/base-component.component"
import { ValidationService } from "@app/shared/services"
import { VofficeSigningPreviewModalComponent } from "@app/modules/voffice-signing/preview-modal/voffice-signing-preview-modal.component";
import { ApprovalHistoryModalComponent } from "@app/shared/components/approval-history/approval-history.component";

@Component({
  selector: "party-member-decision-search",
  templateUrl: "./party-member-decision-search.component.html",
  styleUrls: ['./party-member-decision-search.component.css'],
})
export class PartyMemberDecisionSearchComponent extends BaseComponent implements OnInit {
  branchList: any
  signStatusList
  formSearch: FormGroup
  status: any
  signDocumentId: any;
  decisionTypeList: any[]
  formConfig = {
    symbol: [null, [ValidationService.maxLength(50)]],
    extractingTextContent: [null, [ValidationService.maxLength(250)]],
    partyOrganizationDecisionId: [null],
    implementerId: [null],
    decisionType: [0],
    documentStatus: [null],
    createdDateFromDate: [null],
    createdDateToDate: [null],
    documentCode: [null],
    startDate: [null],
    endDate: [null],
    isSymbol: [false],
    isExtractingTextContent: [false],
    isPartyOrganizationId: [false],
    isImplementerId: [false],
    isDecisionType: [false],
    isDocumentStatus:[false],
    isCreatedDateFromDate: [false],
    isCreatedDateToDate: [false],
    isStartDate: [false],
    isEndDate: [false],
    isDocumentCode: [false]
  }

  constructor(
    private partyMemberDecisionService: PartyMemberDecisionService,
    private router: Router,
    private signDocumentService: SignDocumentService,
    private app: AppComponent,
    private modalService: NgbModal,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyMemberDecision"))
    this.setMainService(partyMemberDecisionService)
    this.signStatusList = APP_CONSTANTS.DECISION_TYPE_SIGN_STATUS
    this.decisionTypeList = Object.keys(APP_CONSTANTS.DECISION_TYPE).map(key => APP_CONSTANTS.DECISION_TYPE[key])
  }
  
  
  ngOnInit() {
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter("createdDateFromDate", "createdDateToDate", "document.label.toDate")])
      this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW, [
        ValidationService.notAffter('startDate', 'endDate', 'organizationcontroller.table.to.date')]);
    this.processSearch()
  }

  get f() {
    return this.formSearch.controls
  }

  prepareSaveOrUpdateOrView(actionType: string, decisionType: number, item?: any) {
    const decisionTypeCode = this.decisionTypeList.find(item => item.value === decisionType).code
    if (item && item.partyMemberDecisionId > 0) {
      this.partyMemberDecisionService.findOne(item.partyMemberDecisionId).subscribe(res => {
        if (res.data != null) {
          this.router.navigate(["/party-organization/party-member-decision/" + decisionTypeCode + "/" + actionType + "/", item.partyMemberDecisionId])
        }
      })
    } else {
      this.router.navigate(["/party-organization/party-member-decision/" + decisionTypeCode + "/add"])
    }
  }

  prepareSign(item: any) {
    if (item && item.signDocumentId > 0) {
      this.router.navigate(["/voffice-signing/party-member-decision/", item.signDocumentId])
    }
  }

  cancelSign(item) {
    if (item && item.signDocumentId > 0) {
      this.app.confirmMessage("resolutionsMonth.cancelStream", () => { // on accepted
        this.signDocumentService.cancelStream("party-member-decision", item.signDocumentId)
          .subscribe(res => {
            if (this.signDocumentService.requestIsSuccess(res)) {
              this.processSearch()
            }
          })
      }, () => {
      })
    }
  }

  // previewFileSigning(item) {
  //   if (item && item.partyMemberDecisionId > 0) {
  //     const modalRef = this.modalService.open(PartyMemberDecisionSignFileComponent, DEFAULT_MODAL_OPTIONS);
  //     modalRef.componentInstance.getSignFileTable(item.partyMemberDecisionId)
  //   }
  // }

  /**
   * Action xem file trước khi trình ký
   * @param signDocumentId 
   */
   previewFileSigning(signDocumentId) {
    const modalRef = this.modalService.open(VofficeSigningPreviewModalComponent, LARGE_MODAL_OPTIONS);
    modalRef.componentInstance.id = signDocumentId;
  }

  public actionShowHistory(item) {
    if (item.signDocumentId == null || item.documentStatus == 0) {
      return;
    } 
    const modalRef = this.modalService.open(ApprovalHistoryModalComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance.signDocumentId = item.signDocumentId;
  }

  /**
   * Action Đồng bộ VO
   * @param item 
   */
   syncSign(item: any) {
    this.signDocumentService.syncSign(item.transCode)
      .subscribe(res => {
        this.app.successMessage('voffice.success');
      this.processSearch();
    })
  }
}
