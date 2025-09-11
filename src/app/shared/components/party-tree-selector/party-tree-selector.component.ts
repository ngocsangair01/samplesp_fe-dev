import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { TreeNode, MenuItem } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';
import { RequestProcessTreeService } from '@app/core/services/party-organization/request-process-tree.service';
import { Router } from '@angular/router';

@Component({
  selector: 'party-tree-selector',
  templateUrl: './party-tree-selector.component.html',
})
export class PartyTreeSelectorComponent implements OnInit {
  public nodes: TreeNode[];
  // 202 start
  @Input()
  public listSelectedId: number[];
  // 202 end
  public selectedNode: TreeNode[];
  public isShowContextMenu = true;
  isCheckAll = false;
  showOrgExpried = false;
  showOrgByLineOrg = false;
  items: MenuItem[];
  isView: boolean = false;
  @Input()
  public onNodeSelect: Function;
  @Input()
  public isGetAll: Boolean;
  @Input()
  public showAll: Boolean;
  @Input()
  public height: string;
  @Input()
  public rootId: string;
  @Output()
  public treeCheckNode: EventEmitter<TreeNode[]> = new EventEmitter<TreeNode[]>();
  @Output()
  public nodeContextMenuBuilder: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
  @Output()
  public nodeContextMenuBuilder2: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
  showCm2 = true;
  @Input()
  public operationKey: string;
  @Input()
  public adResourceKey: string;
  @Input()
  public filterCondition: string;
  // id don vi ra nnghi quyet
  @Input()
  public requestId: Number;

  @Input()
  public allowShowLineOrg = true;
  @ViewChild("cm2")
  cm2: ContextMenu;
  //disable
  @Input()
  public disabled: boolean;
  //Danh sách loại tổ chức đảng có thể được checkbox
  private listTypeCanCheck: number[];

  // #202 start
  @Input()
  public isAutoInit: boolean = false;
  @Input()
  public treeHeight: number = 400;
  // #202 start

  constructor(
    private service: RequestProcessTreeService,
    private router: Router,
  ) {
    this.selectedNode = [];
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    // set hien thi het tat ca
    if (this.showAll) {
      this.showOrgExpried = true;
    }
    const subPaths = this.router.url.split('/');
    this.isView = subPaths[2] === 'request-resolutions-month-view';
    this.height = this.height || '800';
    if(this.isAutoInit){
      this.actionInitAjaxAllChildren();
    }
  }

   /**
   * action init ajax all children
   */
  public actionInitAjaxAllChildren() {
    this.service.actionInitAjaxAllChildren(this.getParams())
      .subscribe((res) => {
        this.nodes = this.buildTreeAndcheckSelectedNode(res);
      });
  }

  /**
   * getParams
   */
  private getParams() {
    return {
      operationKey: this.operationKey,
      adResourceKey: this.adResourceKey,
      filterCondition: (this.filterCondition ? this.filterCondition : ''),
      nodeId: '',
      rootId: this.rootId,
      showOrgExpried: this.showOrgExpried,
      isGetAll: this.isGetAll ? 1 : 0,
      requestId: this.requestId,
      extraFilterCondition: (this.listTypeCanCheck ? this.listTypeCanCheck.toString() : ''),
    };
  }
  /**
   * set root node
   */
  public setRootNode(rootId: string) {
    this.rootId = rootId;
    this.actionInitAjax();
  }
  /**
   * action init ajax
   */
  public actionInitAjax() {
    this.service.actionInitAjaxAll(this.getParams())
      .subscribe((res) => {
        this.nodes = CommonUtils.toTreeNode(res);
        // fill list da chon trong truong hop sua

        if (this.requestId != null) {
          this.fillListSelection(res);
        }
      });
  }
  /**
   * actionLazyRead
   * @ param event
   */
  public actionLazyRead(event) {
    const params = this.getParams();
    params.nodeId = event.node.nodeId;
    this.service.actionLazyRead(params)
      .subscribe((res) => {
        event.node.children = CommonUtils.toTreeNode(res);
      });
  }

  /**
   * actionLazyRead
   * @ param event
   */
  public actionLazyReadWhenAddChild(nodeCurrent, node) {
    const params = this.getParams();
    params.nodeId = nodeCurrent.nodeId;
    this.service.actionLazyRead(params)
      .subscribe((res) => {
        nodeCurrent.children = CommonUtils.toTreeNode(res);
        nodeCurrent.children.push(node);
        nodeCurrent.expanded = true;
      });
  }
  /**
   * nodeSelect
   * @ param event
   */
  public nodeSelect(event) {
    this.treeCheckNode.emit(this.selectedNode);
  }
  // for context menu
  /**
  * action create Context Menu
  */
  nodeContextMenuSelect(event) {
    this.nodeContextMenuBuilder.emit(event.node);
  }

  // Xu ly hien thi cay don vi theo nganh doc

  /**
   * action init ajax by line org
   */
  private actionInitAjaxByLineOrg() {
    this.service.actionInitAjaxByLineOrg(this.getParams())
      .subscribe((res) => {
        this.nodes = CommonUtils.toTreeNode(res);
      });
  }
  /**
   * actionLazyRead by line org
   * @ param event
   */
  public actionLazyReadByLineOrg(event) {
    if (!event.node.parent) {
      this.actionInitAjaxByLineOrg();
      return;
    }
    const params = this.getParams();
    params.nodeId = event.node.nodeId;
    params['lineOrg'] = event.node.lineOrg;
    params['lineOrgId'] = event.node.lineOrgId;
    params['orgLevelManage'] = event.node.orgLevelManage;
    params['lineOrgRootId'] = event.node.lineOrgRootId;
    this.service.actionLazyReadByLineOrg(params)
      .subscribe((res) => {
        event.node.children = CommonUtils.toTreeNode(res);
      });
  }

  // for context menu
  /**
  * action create Context Menu
  */
  nodeContextMenuSelect2(event) {
    if (event.node.lineOrg) {
      this.cm2.hide();
      return;
    }
    this.cm2.show();
    this.nodeContextMenuBuilder2.emit(event.node);
  }

  showOrgByLineOrgChange(e) {
    if (!this.showOrgByLineOrg) {
      this.actionInitAjax();
    } else {
      this.actionInitAjaxByLineOrg();
    }
  }

  checkAll() {
    this.isCheckAll = !this.isCheckAll;
  }

  fillListSelection(res) {
    for (const node of res) {
      // set disable cho những tổ chức không có loại phù hợp
      if(this.listTypeCanCheck && !this.listTypeCanCheck.includes(node.type)){
        node['selectable'] = false;
      }
      if (node.selectedId != null) {
        this.selectedNode.push(node);
      }
      if (node.children && node.children.length > 0) {
        this.fillListSelection(node.children);
      }
    }
  }

  /**
   * action change conditional
   * @param conditionStr 
   */
  public changeFilterCondition(conditionStr: string) {
    this.filterCondition = conditionStr;
  }

  /**
   * Set list tổ chức đảng có thể check
   * @param _listTypeCanCheck
   */
  public setListTypeCanCheck(_listTypeCanCheck: number[]) {
    this.listTypeCanCheck = _listTypeCanCheck;
  }

  /**
   * #202 hàm xử lý fill nhưng id đã được chọn
   */
  public buildTreeAndcheckSelectedNode(res: any): any {
    for (const node of res) {
      // Xử lý fill checked
      if(this.listSelectedId && this.listSelectedId.includes(node.nodeId)){
        this.selectedNode.push(node);
      }
      if (!node.leaf) {
        delete node.icon;
        if (node.children && node.children.length > 0) {
          node.children = this.buildTreeAndcheckSelectedNode(node.children);
        }
      }
    }
    return res;
  }
}