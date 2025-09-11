import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { MassCriteriaService } from '@app/core/services/mass-organization/mass-criteria.service';
import { MassRequestService } from '@app/core/services/mass-organization/mass-request.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
;
import { MassCriteriaTreeComponent } from '../mass-criteria-tree/mass-criteria-tree.component';
import { MassOrgTreeSelectorComponent } from '../mass-org-tree-selector/mass-org-tree-selector.component';

@Component({
  selector: 'mass-request-criteria-plan',
  templateUrl: './mass-request-criteria-plan.component.html',
  styleUrls: ['./mass-request-criteria-plan.component.css']
})
export class MassRequestCriteriaPlanComponent extends BaseComponent implements OnInit {

  formInfoRequest: FormGroup;
  formSaveCriteria: FormGroup;
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
    nodeCheckList: [''],
    criteriaName: ['', [Validators.required]],
    parentCriteriaName: [''],
    criteriaOrder: [''],
    isSignVoffice: ['', [Validators.required]],
    rootMassOrgId: [''],
  };

  @ViewChild('tree')
  public tree: MassCriteriaTreeComponent;
  @ViewChild('criteriaName')
  public criteriaName: any;

  public branch: any;
  public massRequestId: any;
  public massCriteriaId: any;
  public massOrganizationId: any;
  public isView: boolean = false;
  public isRoot: boolean = true;
  public isLeaf: boolean = false;
  public isSaveTree: boolean;
  public createPlan: boolean = false;
  public isInsertContentCriteria: boolean = false;
  public criteriaPlanObject: any;
  public rootId: any;
  public nodeSelected: any;
  public isSavedTree: boolean = false; // kiểm tra xem cây tiêu chí có được save trước khi chọn tiêu chí

  constructor(private router: Router
    , public actr: ActivatedRoute
    , private app: AppComponent
    , private criteriaPlanService: MassCriteriaService
    , private massRequestService: MassRequestService
    , public modalService: NgbModal) {
    super(null, CommonUtils.getPermissionCode("resource.massRequestCriteria"));
    this.buildFormsInfoRequest({});
    this.buildFormsCriteria({});
    const subPaths = this.router.url.split('/');
    const params = this.actr.snapshot.params;
    if (params && CommonUtils.isValidId(params.id)) {
      this.massRequestId = params.id;
    }
    if (subPaths[4] === 'create-plan') {
      this.createPlan = true;
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
    if (!this.isLeaf) {
      this.fCriteria['nodeCheckList'].clearValidators();
      this.fCriteria['nodeCheckList'].updateValueAndValidity();
    } else {
      this.fCriteria['nodeCheckList'].setValidators(Validators.required);
      this.fCriteria['nodeCheckList'].updateValueAndValidity();
    }
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

          // Trường hợp đang trạng thái đang soạn thảo thì mới được thêm mới tiêu chí
          if (res.data.status === 1 && this.createPlan) {
            this.tree.isSaveTree = true;
            this.isSaveTree = true;
          } else if (res.data.status === 2 && this.isInsertContentCriteria) {
            this.tree.isSaveTree = false;
            this.isSaveTree = false;
          }

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
                // this.editMassCriteria(node);
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
    this.isLeaf = event.leaf;
    this.isSavedTree = false;
    this.nodeSelected = event;
    if (this.nodeSelected === this.tree.rootNode) {
      this.isRoot = true;
      return this.app.warningMessage('resolutionQuarterYear.pleaseChooseCriteria');
    }
    this.isRoot = false;
    if (this.nodeSelected.nodeId !== 0) {
      this.criteriaPlanService.findOne(this.nodeSelected.nodeId).subscribe(res => {
        if (res.data) {
          this.isSavedTree = true;
          this.buildFormsCriteria(res.data);
          this.massCriteriaId = event.nodeId;
          this.massOrganizationId = this.f['massOrganizationId'].value;
          setTimeout(() => {
            this.criteriaName.nativeElement.focus();
          }, 500);
          if (this.isLeaf) {
            setTimeout(() => {
              this.orgTree.requestId = event.nodeId;
              this.orgTree.selectedNode = [];
              this.orgTree.actionInitAjaxAll();
            }, 300);
          }
        }
      });
    }
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
            this.buildFormsCriteria({
              massCriteriaId: '',
              nodeCheckList: '',
              criteriaName: '',
              parentCriteriaName: '',
              criteriaOrder: '',
              isSignVoffice: '',
              rootMassOrgId: '',
            });
          }
        });
    }, null);
  }

  /**
  * Xu ly hien thi tab commonInfo
  * Sau khi save tree hoac clone
  */
  public rebuildAfterSaveTree() {
    // xu ly focus mac dinh vao cay goc
    // this.tree.selectedNode = this.tree.rootNode;
    // set node selected for child companent
    // this.nodeSelected = this.tree.rootNode;
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

  processSaveOrUpdate() {
    let nodeCheckList;
    if (this.isLeaf) {
      nodeCheckList = this.getListTree();
      if (nodeCheckList.length === 1 && nodeCheckList.indexOf(this.f['massOrganizationId'].value) !== -1) {
        this.app.warningMessage('massCriteria.mustChoseChildOrg');
        return;
      }
    }
    this.fCriteria['nodeCheckList'].setValue(nodeCheckList);
    this.fCriteria['isSignVoffice'].setValue(this.f['signVoffice'].value);
    this.fCriteria['rootMassOrgId'].setValue(this.f['massOrganizationId'].value);
    if (!CommonUtils.isValidForm(this.formSaveCriteria)) {
      return;
    }
    this.app.confirmMessage(null,
      () => {
        this.criteriaPlanService.saveOrUpdate(this.formSaveCriteria.value).subscribe(
          res => {
            if (this.criteriaPlanService.requestIsSuccess(res)) {
              if (this.isLeaf) {
                this.orgTree.selectedNode = [];
              }
              this.isRoot = true;
              this.buildFormsCriteria({
                massCriteriaId: '',
                nodeCheckList: '',
                criteriaName: '',
                parentCriteriaName: '',
                criteriaOrder: '',
                isSignVoffice: '',
                rootMassOrgId: '',
              });
              this.rebuildAfterSaveTree();
            }
          }
        );
      }, () => { }
    );

  }

  exportCriteriaReport() {
    this.criteriaPlanService.exportCriteriaReport(this.f['massRequestId'].value).subscribe(
      res => {
        saveAs(res, 'criteria_report.xlsx');
      }
    )
  }
}
