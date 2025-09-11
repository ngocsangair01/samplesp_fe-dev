import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { TransferPartyMemberService } from '@app/core/services/party-organization/transfer-party-member.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'transfer-party-member-history',
  templateUrl: './transfer-party-member-history.component.html',
  styleUrls: ['./transfer-party-member-history.component.css']
})
export class TransferPartyMemberHistoryComponent extends BaseComponent implements OnInit {
  data: [];
  recordsTotal: any;
  resultList: any;
  parseInt = parseInt;
  @ViewChild('ptable') dataTable: any;
  @Input() public transferPartyMemberId;
  @Input() public employeeName;

  formSearch: FormGroup;
  formConfig = {
    transferPartyMemberId: [''],
    partyOrganizationName: [''],
    approvedDate: ['', []],
    approvalOrder: ['', []],
    status: [''],
    note: [''],
  };

  constructor(
    private transferPartyMemberService: TransferPartyMemberService,
    public activeModal: NgbActiveModal,
  ) {
    super();
  }

  ngOnInit() {
    this.formConfig.transferPartyMemberId = this.transferPartyMemberId;
    this.formSearch = this.buildForm(this.formConfig, { transferPartyMemberId: [''] });
    this.processSearchHis();
  }

  public processSearchHis(event?) {
    const params = this.formSearch ? this.formSearch.value : null;
    this.transferPartyMemberService.showHistoryTransferPartySigner(params, event).subscribe(res => {
      this.resultList = res;
      this.data = res.data;
      this.recordsTotal = res.recordsTotal;
    });
    if (this.dataTable) {
      this.dataTable.first = 0;
    }
  }
}
