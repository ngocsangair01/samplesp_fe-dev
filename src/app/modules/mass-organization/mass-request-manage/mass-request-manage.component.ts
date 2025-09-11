import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MassCriteriaService } from '@app/core/services/mass-organization/mass-criteria.service';
import { MassRequestService } from '@app/core/services/mass-organization/mass-request.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MassRequestTreeManageComponent } from './mass-request-tree-manage/mass-request-tree-manage.component';

@Component({
  selector: 'mass-request-manage',
  templateUrl: './mass-request-manage.component.html'
})
export class MassRequestManageComponent extends BaseComponent implements OnInit {

  formSave: FormGroup;
  lstReason: any;
  formConfig = {
    massRequestId: [''],
    lstNodeCheck: [''],
    description: ['']
  };

  @ViewChild('tree')
  public tree: MassRequestTreeManageComponent;

  public criteriaPlanTree;
  public massRequestId: any;
  public partyOrganizationId: any;
  constructor(
    public activeModal: NgbActiveModal,
    public actr: ActivatedRoute,
    private massRequestService: MassRequestService,
    private massCriteriaService: MassCriteriaService
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
    this.massRequestId = id;
  }

  /**
   * Xử lý hiển thị cây tiêu chí
   */
  public processCreateCriteriaTree(massRequestId) {
    const id = massRequestId.toString();
    this.massRequestService.findOne(id)
      .subscribe(res => {
        if (this.massCriteriaService.requestIsSuccess(res)) {
          // Xu ly cay don vi
          this.massCriteriaService.findTreeMassCriteriaById(res.data.massRequestId)
            .subscribe(nodes => {
              this.tree.setDataNodes(res.data, nodes);
            });

        }
      });
  }
}
