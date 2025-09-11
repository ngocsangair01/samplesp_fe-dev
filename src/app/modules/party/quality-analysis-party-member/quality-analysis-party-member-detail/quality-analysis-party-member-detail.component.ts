import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { QualityAnalysisPartyMemberService } from '@app/core/services/party-organization/quality-analysis-party-member.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'quality-analysis-party-member-detail',
  templateUrl: './quality-analysis-party-member-detail.component.html',
  styleUrls: ['./quality-analysis-party-member-detail.component.css']
})
export class QualityAnalysisPartyMemberDetailComponent extends BaseComponent implements OnInit {

  data: [];
  recordsTotal: any;
  resultList: any;
  @ViewChild('ptable') dataTable: any;
  @Input() public importQualityAnalysisPartyMemberId: any;
  formConfig = {
    importQualityAnalysisPartyMemberId: ['']
  };
  constructor(
    public activeModal: NgbActiveModal,
    private qualityAnalysisPartyMemberService: QualityAnalysisPartyMemberService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.qualityAnalysisParty"));
  }

  ngOnInit() {
    this.formSearch = this.buildForm({ 'importQualityAnalysisPartyMemberId': this.importQualityAnalysisPartyMemberId }, this.formConfig);
    this.processSearchListQualityPartyMember();
  }

  processSearchListQualityPartyMember(event?) {
    const params = this.formSearch ? this.formSearch.value : null;
    this.qualityAnalysisPartyMemberService.getListQualityAnalysisPartyMember(params, event)
      .subscribe(res => {
        this.resultList = res;
        this.data = res.data;
        this.recordsTotal = res.recordsTotal;
      });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }

  /**
   * Export
   */
  public processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const formData = Object.assign({}, this.formSearch.value);
    const params = CommonUtils.buildParams(CommonUtils.convertData(formData));
    this.qualityAnalysisPartyMemberService.exportQualityAnalysisPartyMember(params).subscribe(res => {
      saveAs(res, 'danh_sach_chat_luong_Dang_vien.xlsx');
    });
  }
}
