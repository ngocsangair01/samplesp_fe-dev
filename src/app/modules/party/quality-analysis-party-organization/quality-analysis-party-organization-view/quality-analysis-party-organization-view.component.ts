import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QualityAnalysisPartyOrgService } from '@app/core/services/party-organization/quality-analysis-party-org.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'quality-analysis-party-organization-view',
  templateUrl: './quality-analysis-party-organization-view.component.html',
  styleUrls: ['./quality-analysis-party-organization-view.component.css']
})
export class QualityAnalysisPartyOrganizationViewComponent extends BaseComponent implements OnInit {
  data: [];
  recordsTotal: any;
  resultList: any;
  parseInt = parseInt;
  partyOrganizationName: String = 'Danh sách chất lượng ';
  @ViewChild('ptable') dataTable: any;
  @Input() public importQualityAnalysisPartyOrgId;

  formSearch: FormGroup;
  formConfig = {
    importQualityAnalysisPartyOrgId: [''],
  };

  constructor(
    private qualityAnalysisPartyOrgService: QualityAnalysisPartyOrgService,
    public activeModal: NgbActiveModal,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.qualityAnalysisParty"));
  }

  ngOnInit() {
    this.formSearch = this.buildForm({ importQualityAnalysisPartyOrgId: this.importQualityAnalysisPartyOrgId }, this.formConfig);
    this.processSearchQualityAnalysisPartyOrg();
    this.qualityAnalysisPartyOrgService.getPartyOrganizationNameByImportQualityAnalysisPartyOrgId(this.importQualityAnalysisPartyOrgId).subscribe(res => {
      this.partyOrganizationName += res.data;
    });
  }

  public processSearchQualityAnalysisPartyOrg(event?): void {
    const importQualityAnalysisPartyOrgId = this.formSearch.get('importQualityAnalysisPartyOrgId').value;
    if (importQualityAnalysisPartyOrgId == null) {
      return;
    }
    this.formSearch.get('importQualityAnalysisPartyOrgId').setValue(importQualityAnalysisPartyOrgId);
    const params = this.formSearch ? this.formSearch.value : null;
    this.qualityAnalysisPartyOrgService.searchQualityAnalysisPartyOrganization(params, event).subscribe(res => {
      this.resultList = res;
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }

  public processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const formData = Object.assign({}, this.formSearch.value);
    formData['importQualityAnalysisPartyOrgId'] = this.importQualityAnalysisPartyOrgId;
    const params = CommonUtils.buildParams(CommonUtils.convertData(formData));
    this.qualityAnalysisPartyOrgService.exportQualityAnalysisPartyOrganization(params).subscribe(res => {
      saveAs(res, 'Danh_sach_chat_luong_to_chuc_dang.xlsx');
    });
  }

  public goBack() {
    this.activeModal.close();
  }
}
