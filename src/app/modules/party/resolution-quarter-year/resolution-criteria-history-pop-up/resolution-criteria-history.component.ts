import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { TransferPartyMemberService } from '@app/core/services/party-organization/transfer-party-member.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { CriteriaPlanService } from '@app/core/services/party-organization/criteria-plan.service';

@Component({
  selector: 'resolution-criteria-history',
  templateUrl: './resolution-criteria-history.component.html',
  styleUrls: ['./resolution-criteria-history.component.css']
})
export class ResolutionCriteriaHistoryComponent extends BaseComponent implements OnInit {
  data: [];
  recordsTotal: any;
  resultList: any;
  formSearch: FormGroup;
  formConfig = {
    cateCriteriaId: [''],
  };

  constructor(
    private criteriaPlanService: CriteriaPlanService,
    public activeModal: NgbActiveModal,
  ) {
    super();
    this.formSearch = this.buildForm({}, this.formConfig);
  }

  public setCateId(CateId) {
    this.formSearch.controls["cateCriteriaId"].setValue(CateId);
  }

  ngOnInit() {
    this.processSearchHis();
  }

  public processSearchHis(event?) {
    const params = this.formSearch ? this.formSearch.value : null;
    this.criteriaPlanService.showHistoryCriteria(params, event).subscribe(res => {
      this.resultList = res;
      this.data = res.data;
      this.recordsTotal = res.recordsTotal;
    });
    if (this.dataTable) {
      this.dataTable.first = 0;
    }
  }
}
