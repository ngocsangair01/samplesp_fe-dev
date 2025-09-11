import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { ReportManagerService } from '@app/core/services/report/report-manager.service';

@Component({
  selector: 'report-manager-history',
  templateUrl: './report-manager-history.component.html',
})
export class ReportManagerHistoryComponent extends BaseComponent implements OnInit{
  data: [];
  recordsTotal: any;
  resultList: any;
  parseInt = parseInt;
  @ViewChild('ptable') dataTable: any;
  @Input() public reportSubmissionId;

  formSearch: FormGroup;
  formConfig = {
    reportSubmissionId: [''],
    createdDate: ['', []],
    createdBy: ['', []],
    status: [''],
    statusName: [,],
    description: [''],
    updatedDate: [''],
  };

  constructor(
    public activeModal: NgbActiveModal,
    private service: ReportManagerService,

  ) {
    super();
  }

  ngOnInit() {
    this.formConfig.reportSubmissionId = this.reportSubmissionId;
    this.formSearch = this.buildForm(this.formConfig, { reportSubmissionId: [''] });
    this.processSearchHis();
  }

  public processSearchHis(event?) {
    const params = this.formSearch ? this.formSearch.value : null;    
    this.service.showSubmissionHistory(params, event).subscribe(res => {      
      this.resultList = res;
      this.data = res.data;
      this.recordsTotal = res.recordsTotal;
    });
    if (this.dataTable) {
      this.dataTable.first = 0;
    }
  }
}
