import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CriteriaPlanService } from '@app/core/services/party-organization/criteria-plan.service';
import { ResponseResolutionQuarterYearService } from '@app/core/services/party-organization/request-resolution-quarter-year.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ResolutionsQuarterYearTreeManageComponent } from '../resolutions-quarter-year-tree-manage/resolutions-quarter-year-tree-manage.component';

@Component({
  selector: 'resolutions-quarter-year-manage',
  templateUrl: './resolutions-quarter-year-manage.component.html'
})
export class ResolutionsQuarterYearManageComponent extends BaseComponent implements OnInit {

  formSave: FormGroup;
  lstReason: any;
  requestResolutionsMonthId: Number;
  formConfig = {
    requestResolutionsId: [''],
    lstNodeCheck: [''],
    description: ['']
  };

  @ViewChild('tree')
  public tree: ResolutionsQuarterYearTreeManageComponent;

  public criteriaPlanTree;
  public requestResolutionsId: any;
  public partyOrganizationId: any;
  constructor(
    public activeModal: NgbActiveModal,
    public actr: ActivatedRoute,
    private responseResolutionQuarterYearService: ResponseResolutionQuarterYearService,
    private criteriaPlanService: CriteriaPlanService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.requestResolutionQuarterYear"));
    this.formSave = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {
  }

  get f() {
    return this.formSave.controls;
  }

  public setManageForm(requestId, orgId) {
    this.tree.requestId = orgId;
    this.tree.rootId = requestId;
    // this.tree.actionInitAjax(); 
    this.processCreateCriteriaTree(requestId);
    const id = requestId;
    this.requestResolutionsId = id;
  }

  /**
   * Xử lý hiển thị cây tiêu chí
   */
  public processCreateCriteriaTree(requestResolutionsId) {
    const id = requestResolutionsId.toString();
    this.responseResolutionQuarterYearService.findOne(id)
      .subscribe(res => {
        if (this.criteriaPlanService.requestIsSuccess(res)) {
          // Xu ly cay don vi
          this.criteriaPlanService.findTreeCriteriaById(res.data.requestResolutionsId)
            .subscribe(nodes => {
              this.tree.setDataNodes(res.data, nodes);
            });

        }
      });
  }

  public reportProgressManage() {
    this.responseResolutionQuarterYearService.exportReportProgressManage(this.requestResolutionsId).subscribe(res => {
      saveAs(res, 'Bao_cao_tien_do_nghi_quyet_quy_nam.xlsx');
    })
  }
}
