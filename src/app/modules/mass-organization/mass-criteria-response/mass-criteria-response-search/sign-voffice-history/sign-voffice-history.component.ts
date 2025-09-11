import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { SignDocumentService } from '@app/core/services/sign-document/sign-document.service';

@Component({
  selector: 'sign-voffice-history',
  templateUrl: './sign-voffice-history.component.html',
})
export class SignVofficeHistoryComponent extends BaseComponent implements OnInit{
  data: [];
  recordsTotal: any;
  resultList: any;
  parseInt = parseInt;
  @ViewChild('ptable') dataTable: any;
  @Input() public signDocumentId;

  formSearch: FormGroup;
  formConfig = {
    signDocumentId: [''],
    createdDate: ['', []],
    createdBy: ['', []],
    status: [''],
    statusName: [,],
    description: [''],
  };

  constructor(
    public activeModal: NgbActiveModal,
    private signDocumentService:  SignDocumentService,

  ) {
    super();
  }

  ngOnInit() {
    this.formConfig.signDocumentId = this.signDocumentId;
    this.formSearch = this.buildForm(this.formConfig, { signDocumentId: [''] });
    this.processSearchHis();
  }

  public processSearchHis(event?) {
    const params = this.formSearch ? this.formSearch.value : null;    
    this.signDocumentService.showVofficeHistory(params, event).subscribe(res => {      
      this.resultList = res;
      this.data = res.data;
      this.recordsTotal = res.recordsTotal;
    });
    if (this.dataTable) {
      this.dataTable.first = 0;
    }
  }
}
