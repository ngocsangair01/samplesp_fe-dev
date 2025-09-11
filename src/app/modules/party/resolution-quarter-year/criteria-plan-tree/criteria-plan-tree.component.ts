import { TreeNode, MenuItem } from 'primeng/api';
import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { CommonUtils } from '@app/shared/services';
import { TranslationService } from 'angular-l10n';
import { Tree, UITreeNode } from 'primeng/tree'
import { CriteriaPlanService } from '@app/core/services/party-organization/criteria-plan.service';
import { InputSpecialDirective } from '@app/shared/directive/input-special.directive';
import { FormControl, FormGroup } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { ContextMenu } from 'primeng/contextmenu';

@Component({
  selector: 'criteria-plan-tree',
  templateUrl: './criteria-plan-tree.component.html'
})
export class CriteriaPlanTreeComponent implements OnInit {

  nodes: TreeNode[];
  selectedNode: TreeNode;
  editableNode: TreeNode;
  dataNodes: TreeNode[];
  items: MenuItem[];
  isValidInput: boolean = false;
  
  isPlanTypeChangeName = false;
  @Output()
  onEditNode: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
  @Output()
  public nodeContextMenuBuilder: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
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
  isSingleClickNode = true;
  rootNode: any;
  defaultEditNode: any;
  @ViewChild(Tree) tree: Tree;
  @ViewChild("cm")
  cm: ContextMenu;
  constructor(private translation: TranslationService
            , private service: CriteriaPlanService
            , private app: AppComponent) { }

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
    };
    // this.actionInitAjax();
  }

  /**
   * set root node
   */
  setRootNode(root) {
    this.rootNode.label = root.resolutionsName;
    this.rootNode.data = root.organizationId;
    this.rootNode.nodeId = root.requestResolutionsId;
    this.nodes = [this.rootNode];
  }
  /**
   * setDataNodes
   * param dataNodes
   */
  setDataNodes(requestResolutionBO, dataNodes) {
    this.dataNodes = CommonUtils.toTreeNode(dataNodes);
    // TH set root node
    if (requestResolutionBO) {
      this.rootNode.children = dataNodes;
      this.rootNode.data = requestResolutionBO.requestResolutionsId;
      this.rootNode.nodeId = requestResolutionBO.requestResolutionsId;
      this.rootNode.label = requestResolutionBO.resolutionsName;
      this.rootNode.title = requestResolutionBO.resolutionsName;
      this.nodes = [this.rootNode];
    } else {
      this.nodes = this.dataNodes;
    }
  }
  /**
  * action create Context Menu
  */
  nodeContextMenuSelect(event) {
    const labelAdd = this.translation.translate('transferPartyMembers.addCriteria');
    const labelAddBefore = this.translation.translate('transferPartyMembers.addCriteriaBefore');
    const labelAddAfter = this.translation.translate('transferPartyMembers.addCriteriaAfter');
    const labelEdit = this.translation.translate('transferPartyMembers.editCriteria');
    const labelDelete = this.translation.translate('transferPartyMembers.deleteCriteria');
    const menuAddChild  = { icon: 'fa info fa-plus', command: () => this.addChild(event.node), label: labelAdd };
    const menuAddBefore = { icon: 'fa info fa-plus', command: () => this.treeAddSibling(event.node, true), label: labelAddBefore };
    const menuAddAfter =  { icon: 'fa info fa-plus', command: () => this.treeAddSibling(event.node, false), label: labelAddAfter };
    // const menuEdit =      { icon: 'fa info fa-edit', command: () => this.editNode(event.node), label: labelEdit };
    const menuDelete =    { icon: 'fa danger fa-trash-alt', command: () => this.processRemoveNode(event.node), label: labelDelete};

    if (this.isPlanTypeChangeName) {
      this.items = [];
      return;
    }
    // Root Menu
    if (event.node.isRoot) {
      this.items = [ menuAddChild ];
      return;
    }

    // add new
    if (event.node.nodeId === 0) {
      this.items = [ menuAddChild, menuAddBefore, menuAddAfter, menuDelete ];
      return;
    }

    // if (event.node.children && event.node.children.length > 0) {
    //   this.items = [ menuAddChild, menuAddBefore, menuAddAfter ];
    //   return;
    // }
    this.items = [ menuAddChild, menuAddBefore, menuAddAfter, menuDelete ];
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
    const childNode = this.getDefaultNode(parentNode);
    parentNode.children = parentNode.children || [];
    parentNode.expanded = true;
    childNode['index'] = parentNode.children.length + 1;
    parentNode.children.push(childNode);
  }
  public getDefaultNode (parentNode?: any) {
    return {
        data: '0'
      , nodeId: 0
      , label: 'Tiêu chí mới'
      , leaf: true
      , icon: 'glyphicons glyphicons-list-alt'
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
    this.tree.draggableNodes = true;
    this.tree.droppableNodes = true;
    if (node.label === '') { // set ve mac dinh khi khong nhap ten
      node.label = this.defaultEditNode;
    }
    // const iChars = '!#$^*[]\\{}\"?<>\'';
    // for (let j = 0; j < node.label.length; j++) {
    //   if (iChars.indexOf(node.label.charAt(j)) >= 0) {
    //     this.isValidInput = true;
    //     return this.app.errorMessage('validate.isValidInput');
    //   } else {
    //     this.isValidInput = false;
    //   }
    // }
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

    /**
  * action create Context Menu
  */
 nodeContextMenuSelect2(event) {
  if (event.node.lineOrg) {
    this.cm.hide();
    return;
  }
  this.cm.show();
  this.nodeContextMenuBuilder.emit(event.node);
  }
}
