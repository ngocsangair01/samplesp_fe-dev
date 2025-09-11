import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RequestResolutionMonthService } from '@app/core/services/party-organization/request-resolution-month.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestTreeManageComponent } from '../../request-tree-manage/request-tree-manage.component';

@Component({
  selector: 'request-resolutions-month-manage',
  templateUrl: './request-resolutions-month-manage.component.html'
})
export class RequestResolutionsMonthManage extends BaseComponent implements OnInit {
  formSave: FormGroup;
  lstReason: any;
  requestResolutionsMonthId: Number;
  formConfig = {
    requestResolutionsMonthId: [''],
    lstNodeCheck: [''],
    description: [''],
    rootId: [''],
    requestId: ['']
  };
  @ViewChild('orgTree')
  orgTree: RequestTreeManageComponent;
  public partyOrgSelector;
  constructor(
    public activeModal: NgbActiveModal,
    public actr: ActivatedRoute,
    private requestResolutionMonthService: RequestResolutionMonthService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.requestResolutionMonth"));
    this.formSave = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {
  }

  get f() {
    return this.formSave.controls;
  }

  public setManageForm(requestId, partyId) {
    this.orgTree.rootId = partyId;
    this.orgTree.requestId = requestId;
    const requestResolutionsMonthId = requestId;
    const partyOrganizatioId = partyId;
    this.formSave.controls['requestId'].setValue(requestResolutionsMonthId);
    this.formSave.controls['rootId'].setValue(partyOrganizatioId);
    this.orgTree.actionInitAjax();
  }

  public reportProgressManage() {
    this.requestResolutionMonthService.exportReportProgressManage(this.formSave.value).subscribe(res => {
      saveAs(res, 'Bao_cao_tien_do_nghi_quyet_thang.xlsx')
    })
  }
}
