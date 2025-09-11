import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { DEFAULT_MODAL_OPTIONS } from '@app/core';
import { MassCriteriaResponseService } from '@app/core/services/mass-organization/mass-criteria-response.service';
import { MassCriteriaService } from '@app/core/services/mass-organization/mass-criteria.service';
import { MassRequestService } from '@app/core/services/mass-organization/mass-request.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MassCriteriaTreeComponent } from '../mass-criteria-tree/mass-criteria-tree.component';
import { MassOrgTreeSelectorComponent } from '../mass-org-tree-selector/mass-org-tree-selector.component';
import { MassCriteriaResponseViewComponent } from './mass-criteria-response-view/mass-criteria-response-view.component';

@Component({
  selector: 'mass-request-view',
  templateUrl: './mass-request-view.component.html'
})
export class MassRequestViewComponent extends BaseComponent implements OnInit {
  formInfoRequest: FormGroup;
  formSaveCriteria: FormGroup;
  isLeaf: boolean = false;
  @ViewChild('orgTree')
  orgTree: MassOrgTreeSelectorComponent;

  formConfigInfoRequest = {
    massRequestId: [''],
    massOrganizationId: [''],
    branch: [''],
    signVoffice: [''],
    description: [''],
    massRequestCode: ['', ValidationService.maxLength(50)],
    massRequestName: ['', ValidationService.maxLength(200)],
    finishDate: [''],
  };
  formConfigCriteria = {
    massCriteriaId: [''],
    massOrganizationId: [''],
    criteriaName: [''],
    parentCriteriaName: [''],
    criteriaOrder: [''],
  };

  @ViewChild('tree')
  public tree: MassCriteriaTreeComponent;

  public branch: any;
  public massRequestId: any;
  public massCriteriaId: any;
  public massOrganizationId: any;
  public isView: boolean = false;
  public isRoot: boolean = true;
  public isSaveTree: boolean;
  public createPlan: boolean = false;
  public isInsertContentCriteria: boolean = false;
  public havePermission: boolean = false;
  public criteriaPlanObject: any;
  public rootId: any;
  public nodeSelected: any;

  formConfig = {
    massCriteriaId: [''],
    branch: ['']
  };

  constructor(private router: Router
    , public actr: ActivatedRoute
    , private app: AppComponent
    , private criteriaPlanService: MassCriteriaService
    , private massRequestService: MassRequestService
    , public modalService: NgbModal
    , private massCriteriaResponseService: MassCriteriaResponseService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.massRequestCriteria"));
    this.setMainService(massCriteriaResponseService);
    this.formSearch = this.buildForm({}, this.formConfig);
    this.buildFormsInfoRequest({});
    this.buildFormsCriteria({});

    const subPaths = this.router.url.split('/');
    const params = this.actr.snapshot.params;
    if (params && CommonUtils.isValidId(params.id)) {
      this.massRequestId = params.id;
    }
    if (subPaths[4] === 'view-detail') {
      this.createPlan = false;
      this.isView = true;
      this.isInsertContentCriteria = false;
    }

    if (subPaths.length >= 2) {
      if (subPaths[2] === 'woman') {
        this.branch = 1;
      }
      if (subPaths[2] === 'youth') {
        this.branch = 2;
      }
      if (subPaths[2] === 'union') {
        this.branch = 3;
      }
    }
    this.processCreateCriteriaTree();
  }

  ngOnInit() {
  }

  /**
   * buildFormsInfoRequest
   * @param data 
   */
  public buildFormsInfoRequest(data?: any) {
    this.formInfoRequest = this.buildForm(data, this.formConfigInfoRequest);
  }

  /**
   * buildFormsCriteria
   * @param data 
   */
  public buildFormsCriteria(data?: any) {
    this.formSaveCriteria = this.buildForm(data, this.formConfigCriteria);
  }

  get f() {
    return this.formInfoRequest.controls;
  }

  get fCriteria() {
    return this.formSaveCriteria.controls;
  }

  /**
   * Xử lý hiển thị cây tiêu chí
   */
  public processCreateCriteriaTree() {
    this.massRequestService.findOne(this.massRequestId)
      .subscribe(res => {
        if (this.criteriaPlanService.requestIsSuccess(res)) {
          this.buildFormsInfoRequest(res.data);
          const signVoffice = String(res.data.signVoffice);
          this.formInfoRequest.controls['signVoffice'].setValue(signVoffice);
          this.buildFormsCriteria(res.data);
          this.rootId = res.data.massOrganizationId;
          if (this.createPlan || this.isView) {
            // Xu ly cay don vi
            this.criteriaPlanService.findTreeMassCriteriaById(res.data.massRequestId)
              .subscribe(nodes => {
                this.tree.setDataNodes(res.data, nodes);
                // xu ly focus mac dinh vao cay goc
                this.tree.selectedNode = this.tree.rootNode;
                // set node selected for child companent
              });
          } else if (this.isInsertContentCriteria) {
            // Xu ly cay don vi
            this.criteriaPlanService.findMassCriteriaTreeByMassCriteriaId(res.data.massRequestId, this.massCriteriaId)
              .subscribe(nodes => {
                this.tree.setDataNodes(res.data, nodes);
                const node = this.findNodeByNodeId(this.massCriteriaId, nodes, false);
                // xu ly focus mac dinh vao cay goc
                this.tree.selectedNode = node;
                this.massCriteriaId = node.nodeId;
              });
          }
        }
      });
  }

  /**
   * Sửa thông tin tiêu chí
   * param orgDraffId
   */
  public editMassCriteria(event) {
    // set node selected for child companent
    this.nodeSelected = event;

    this.isLeaf = event.leaf;

    this.massCriteriaId = event.nodeId;
    this.formSearch = this.buildForm({ massCriteriaId: event.nodeId, branch: this.branch }, this.formConfig);
    this.massCriteriaResponseService.processSearchDetailCriteria(this.formSearch.value).subscribe(
      res => {
        this.resultList = res;
      }
    );
  }

  public processSearch(event) {
    // set node selected for child companent
    this.massCriteriaId = this.massCriteriaId;
    this.formSearch = this.buildForm({ massCriteriaId: this.massCriteriaId, branch: this.branch }, this.formConfig);
    this.massCriteriaResponseService.processSearchDetailCriteria(this.formSearch.value, event).subscribe(
      res => {
        this.resultList = res;
      }
    );
  }

  /**
   * Tìm kiếm node cần để select
   * @param nodeId 
   * @param listNode 
   * @param remove 
   */
  private findNodeByNodeId(nodeId: any, listNode, remove: boolean): any {
    const id = Number(nodeId);
    for (let i = 0; i < listNode.length; i++) {
      const node = listNode[i];
      if (node.nodeId === id) {
        if (remove) {
          listNode.splice(i, 1);
        }
        return node;
      } else if (node.children && node.children.length > 0) {
        const find = this.findNodeByNodeId(id, node.children, remove);
        if (find) {
          return find;
        }
      }
    }
  }

  /**
   * convertTreeNodeToValue
   * param nodes
   */
  private convertTreeNodeToValue(nodes: any) {
    if (!nodes) {
      return null;
    }
    const values = [];
    for (const node of nodes) {
      const data = {
        nodeId: node.nodeId
        , data: node.data
        , expanded: node.expanded ? 1 : 0
        , label: node.label
        , level: node.level
        , children: this.convertTreeNodeToValue(node.children)
      };
      values.push(data);
    }
    return values;
  }

  /**
   * Lưu thông tin cây đơn vị
   */
  public saveTree() {
    const formSave = {};
    formSave['nodes'] = this.convertTreeNodeToValue(this.tree.dataNodes);
    if (this.tree.isValidInput) {
      return;
    }
    if (!CommonUtils.isValidForm(formSave)) {
      return;
    }
    this.app.confirmMessage(null, () => {
      this.criteriaPlanService.saveTreeMassCriteriaPlanById(this.massRequestId, formSave)
        .subscribe((res) => {
          if (this.criteriaPlanService.requestIsSuccess(res)) {
            this.rebuildAfterSaveTree();
          }
        });
    }, null);
  }

  /**
  * Xu ly hien thi tab commonInfo
  * Sau khi save tree hoac clone
  */
  public rebuildAfterSaveTree() {
    this.processCreateCriteriaTree();
  }

  /**
   * Tạo tree selector
   */
  getListTree() {
    const lstNodeCheck: Array<Number> = [];
    this.orgTree.selectedNode.forEach(element => {
      lstNodeCheck.push(parseInt(element.data));
    });
    return lstNodeCheck;
  }

  goBack() {
    if (this.branch === 1) {
      this.router.navigate(['/mass/woman/mass-request']);
    } else if (this.branch === 2) {
      this.router.navigate(['/mass/youth/mass-request']);
    } else if (this.branch === 3) {
      this.router.navigate(['/mass/union/mass-request']);
    }
  }

  onChangeIsInputContent(a: any, b: any) {

  }

  /**
 * prepareView
 * param item
 */
  prepareView(item?: any) {
    if (item && item.massCriteriaResponseId > 0) {
      this.massCriteriaResponseService.findOne(item.massCriteriaResponseId)
        .subscribe(res => {
          this.activeModal(res.data);
        });
    }
  }

  /**
   * show model
   * data
   */
  private activeModal(data?: any) {
    const modalRef = this.modalService.open(MassCriteriaResponseViewComponent, DEFAULT_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.branch = this.branch;
      modalRef.componentInstance.data = data;
    }
  }

  exportCriteriaReport() {
    this.criteriaPlanService.exportCriteriaReport(this.f['massRequestId'].value).subscribe(
      res => {
        saveAs(res, 'criteria_report.xlsx');
      }
    )
  }
}
