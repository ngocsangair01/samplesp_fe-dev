
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DEFAULT_MODAL_OPTIONS } from '@app/core';
import { RequestDemocraticMeetingService } from '@app/core/services/population/request-democratic-meeting.service';
import { RequestResolutionsMonthManage } from '@app/modules/party/resolutions-month/request-resolutions-month/request-resolutions-month-manage/request-resolutions-month-manage.component';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrgTreeSelectorComponent } from '../org-tree-selector/org-tree-selector.component';

@Component({
  selector: 'request-democratic-meeting-manage',
  templateUrl: './request-democratic-meeting-manage.component.html',
  styleUrls: ['./request-democratic-meeting-manage.component.css']
})
export class RequestDemocraticMeetingManageComponent extends BaseComponent implements OnInit {
  requestDemocraticMeetingId: Number;
  organizationId: Number;
  formSave: FormGroup;
  lstReason: any;
  requestResolutionsMonthId: Number;
  formConfig = {
    requestResolutionsMonthId: [''],
    lstNodeCheck: [''],
    description: ['']
  };
  @ViewChild('orgTree')
  orgTree: OrgTreeSelectorComponent;
  public orgSelector;

  constructor(
    public activeModal: NgbActiveModal,
    public actr: ActivatedRoute,
    private modalService: NgbModal,
    private requestDemocraticMeetingService: RequestDemocraticMeetingService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.requestDemocraticMeeting"));
    this.formSave = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {

  }

  get f() {
    return this.formSave.controls;
  }

  public setManageForm(requestId, orgId) {
    this.requestDemocraticMeetingId = requestId;
    this.organizationId = orgId;
    this.orgTree.rootId = orgId;
    this.orgTree.requestId = requestId;
    this.orgTree.actionInitAjax();
  }

  preparePopManage(item) {
    this.actionActiveModal(item);
  }

  // action mo
  actionActiveModal(item) {

    const modalRef = this.modalService.open(RequestResolutionsMonthManage, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance.setManageForm(item.requestDemocraticMeetingId, item.organizationId);
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
    });
  }

  public processExport() {
    const params = CommonUtils.buildParams({ requestDemocraticMeetingId: this.requestDemocraticMeetingId, organizationId: this.organizationId });
    this.requestDemocraticMeetingService.export(params).subscribe(res => {
      saveAs(res, 'quan_ly_tien_do.xls');
    });
  }
}
