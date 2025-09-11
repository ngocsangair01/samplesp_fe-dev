import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { TreeNode, MenuItem, Tree } from 'primeng/primeng';
import { TranslationService } from 'angular-l10n';
import { AppComponent } from '@app/app.component';
import { MassCriteriaService } from '@app/core/services/mass-organization/mass-criteria.service';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'mass-criteria-tree',
  templateUrl: './mass-criteria-tree.component.html'
})
export class MassCriteriaTreeComponent extends BaseComponent implements OnInit {

  nodes: TreeNode[];
  selectedNode: TreeNode;
  editableNode: TreeNode;
  dataNodes: TreeNode[];
  items: MenuItem[];
  isValidInput: boolean = false;

  isPlanTypeChangeName = false;
  @Output()
  onEditNode: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
  @Input()
  isSaveTree: boolean;
  @Input()
  public operationKey: string;
  @Input()
  public adResourceKey: string;
  @Input()
  public filterCondition: string;
  @Input()
  public rootId: string;
  @Input()
  public height: string;

  isSingleClickNode = true;
  rootNode: any;
  defaultEditNode: any;
  @ViewChild(Tree) tree: Tree;
  constructor(private translation: TranslationService
    , private service: MassCriteriaService
    , private app: AppComponent) {
    super(null, CommonUtils.getPermissionCode("resource.massRequestCriteria"));
  }

  ngOnInit() {
    this.rootNode = {
      label: 'null'
      , data: 0
      , nodeId: 0
      , index: 0
      , expandedIcon: 'glyphicons glyphicons-folder-open'
      , collapsedIcon: 'glyphicons glyphicons-folder-closed'
      , leaf: false
      , isRoot: true
      , children: this.dataNodes
      , expanded: true
      , level: 0
    };
    this.height = this.height || '550';
  }

  /**
   * set root node
   */
  setRootNode(root) {
    this.rootNode.label = root.massRequestName;
    this.rootNode.data = root.massOrganizationId;
    this.rootNode.nodeId = root.massRequestId;
    this.nodes = [this.rootNode];
  }
  /**
   * setDataNodes
   * param dataNodes
   */
  setDataNodes(massRequestBO, dataNodes) {
    this.dataNodes = CommonUtils.toTreeNode(dataNodes);
    // TH set root node
    if (massRequestBO) {
      this.rootNode.children = dataNodes;
      this.rootNode.data = massRequestBO;
      this.rootNode.nodeId = massRequestBO.massRequestId;
      this.rootNode.label = massRequestBO.massRequestName;
      this.rootNode.title = massRequestBO.massRequestCode;
      this.nodes = [this.rootNode];
    } else {
      this.nodes = this.dataNodes;
    }
  }
  /**
  * action create Context Menu
  * active with right click on node
  */
  nodeContextMenuSelect(event) {
    const labelAdd = this.translation.translate('transferPartyMembers.addCriteria');
    const labelAddBefore = this.translation.translate('transferPartyMembers.addCriteriaBefore');
    const labelAddAfter = this.translation.translate('transferPartyMembers.addCriteriaAfter');
    const labelEdit = this.translation.translate('transferPartyMembers.editCriteria');
    const labelDelete = this.translation.translate('transferPartyMembers.deleteCriteria');
    const menuAddChild = { icon: 'fa info fa-plus', command: () => this.addChild(event.node), label: labelAdd };
    const menuAddBefore = { icon: 'fa info fa-plus', command: () => this.treeAddSibling(event.node, true), label: labelAddBefore };
    const menuAddAfter = { icon: 'fa info fa-plus', command: () => this.treeAddSibling(event.node, false), label: labelAddAfter };
    const menuDelete = { icon: 'fa danger fa-trash-alt', command: () => this.processRemoveNode(event.node), label: labelDelete };

    if (this.isPlanTypeChangeName) {
      this.items = [];
      return;
    }
    // Root Menu
    if (event.node.isRoot) {
      this.items = [menuAddChild];
      return;
    }

    if (event.node.nodeId !== 0) {
      let isHasCriteriaResponse = false;
      this.service.getListResponseByCriteriaId(event.node.nodeId).subscribe(
        res => {
          if (res.data.length > 0) {
            isHasCriteriaResponse = true;
            this.items = [menuAddBefore, menuAddAfter, menuDelete];
          }
        }
      );
      if (isHasCriteriaResponse) { return; }
    }

    if (event.node.level === 3) {
      this.items = [menuAddBefore, menuAddAfter, menuDelete];
      return;
    }

    // add new
    if (event.node.nodeId === 0) {
      this.items = [menuAddChild, menuAddBefore, menuAddAfter, menuDelete];
      return;
    }

    this.items = [menuAddChild, menuAddBefore, menuAddAfter, menuDelete];
    return;
  }

  /**
   * onEditNode
   * @ param currentNode
   */
  private editNode(currentNode) {
    this.onEditNode.emit(currentNode);
  }

  /**
   * addchild
   * @ param event
   * @ param type
   * @ param isDefault
   */
  private addChild(parentNode: any) {
    if (parentNode.level === 3) {
      return;
    }
    const childNode = this.getDefaultNode(parentNode);
    parentNode.children = parentNode.children || [];
    parentNode.expanded = true;
    childNode['index'] = parentNode.children.length + 1;
    childNode['level'] = parentNode.level + 1;
    parentNode.children.push(childNode);
  }

  public getDefaultNode(parentNode?: any) {
    return {
      data: '0'
      , nodeId: 0
      , label: 'Tiêu chí mới'
      , leaf: true
      , icon: 'glyphicons glyphicons-list-alt'
      , level: 0
    };
  }

  private treeAddSibling(currentNode, isBefore) {
    const parentNode = currentNode.parent;
    const newNode = this.getDefaultNode(parentNode);
    const children = parentNode.children;
    const index = children.indexOf(currentNode);
    if (isBefore) {
      newNode['index'] = currentNode.index;
      children.splice(index, 0, newNode);
    } else {
      if (currentNode.nodeId) {
        newNode['index'] = currentNode.index + 1;
      } else {
        newNode['index'] = currentNode.index;
      }
      if (index < children.length - 1) {
        children.splice(index + 1, 0, newNode);
      } else {
        children.push(newNode);
      }
    }
  }

  /**
   * Xử lý khi xóa node
   * param node
   */
  public processRemoveNode(currentNode) {
    const parentNode = currentNode.parent;
    const children = parentNode.children;
    const index = children.indexOf(currentNode);
    children.splice(index, 1);
    return;
  }

  public setEditNode(node) {
    this.isSingleClickNode = false;
    this.tree.draggableNodes = false;
    this.tree.droppableNodes = false;
    if (node.isRoot) { // TH la cay goc
      return;
    }
    if (!this.isSaveTree) {
      return;
    }

    if (this.isPlanTypeChangeName && node.parent && !node.isRoot) {
      return;
    }
    this.defaultEditNode = node.label; // luu lai label cua node khi dbclick sua ten
    this.editableNode = node;
  }

  onBlurInputTree(node) {
    const newLabel = node.label;
    this.tree.draggableNodes = true;
    this.tree.droppableNodes = true;
    if (node.label === '') { // set ve mac dinh khi khong nhap ten
      node.label = this.defaultEditNode;
    }
    if (newLabel.length > 500) {
      node.label = this.defaultEditNode;
      this.app.errorMessage('massCriteriaTree.uotOfLength');
    }
    this.editableNode = null;
  }

  /**
   * Xu ly  chon node
   */
  treeSelectNode(node) {
    this.isSingleClickNode = true;
    setTimeout(() => {
      if (this.isSingleClickNode) {
        this.editNode(node);
      }
    }, 250);
  }
}
