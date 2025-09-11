import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { TransferPartyMemberService } from '@app/core/services/party-organization/transfer-party-member.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { MassCriteriaResponseService } from '@app/core/services/mass-organization/mass-criteria-response.service';
import { SignDocumentService } from '@app/core/services/sign-document/sign-document.service';
import _ from "lodash"
@Component({
  selector: 'approval-history',
  templateUrl: './approval-history.component.html',
})
export class ApprovalHistoryModalComponent extends BaseComponent implements OnInit {
  data: [];
  recordsTotal: any;
  resultList: any;
  tranCode: any;
  parseInt = parseInt;
  @ViewChild('ptable') dataTable: any;
  @Input() public signDocumentId;

  formSearch: FormGroup;
  formConfig = {
    signDocumentId: [''],
    employeeName: [''],
    employeeCode: [''],
    email: [''],
    state: [''],
    tranCode: [''],
  };

  constructor(
    private signDocumentService: SignDocumentService,
    public activeModal: NgbActiveModal,
  ) {
    super();
  }
  
  ngOnInit() {
    this.formSearch = this.buildForm(this.formConfig, { tranCode: [''] });
    this.processSearchHis();
  }
  
  public processSearchHis(event?) {
    this.signDocumentService.showHistory(event, this.signDocumentId).subscribe(res => {
      this.resultList = res;
      this.data = res.data;
      this.recordsTotal = res.recordsTotal;
    });
    if (this.dataTable) {
      this.dataTable.first = 0;
    }
  }
}
