import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { TreeNode, MenuItem, ContextMenu } from 'primeng/primeng';
import {CommonUtils, CryptoService} from '@app/shared/services';
import { Router } from '@angular/router';
import { RequestProcessTreeService } from '@app/core/services/party-organization/request-process-tree.service';
import { MassOrgSelectorService } from '@app/core/services/mass-organization/mass-org-selector.service';
import { MassCriteriaService } from '@app/core/services/mass-organization/mass-criteria.service';

@Component({
  selector: 'mass-org-tree-selector',
  templateUrl: './mass-org-tree-selector.component.html'
})
export class MassOrgTreeSelectorComponent implements OnInit {
  public nodes: TreeNode[];
  public selectedNode: TreeNode[];
  public isShowContextMenu = true;
  isCheckAll = false;
  showMassOrgExpried = false;
  showMassOrgByLineOrg = false;
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
  public disabled : boolean;

  constructor(
    private service: MassCriteriaService,
    private router: Router,
  ) {
    this.selectedNode = [];
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    // set hien thi het tat ca
    if(this.showAll){
      this.showMassOrgExpried = true;
    }
    const subPaths = this.router.url.split('/');
    this.height = this.height || '800';
  }
  /**
   * getParams
   */
  private getParams() {
    return { operationKey: this.operationKey,
             adResourceKey: this.adResourceKey,
             filterCondition: (this.filterCondition ?  CryptoService.encrAesEcb(this.filterCondition) : ''),
             nodeId: '',
             rootId: this.rootId,
             showOrgExpried: this.showMassOrgExpried,
             isGetAll: this.isGetAll ? 1 : 0,
             requestId: this.requestId
           };
  }
  /**
   * set root node
   */
  public setRootNode(rootId: string) {
    this.rootId = rootId;
    this.actionInitAjaxAll();
  }
  /**
   * action init ajax
   */
  public actionInitAjaxAll() {
    this.service.actionInitAjaxAll(this.getParams())
        .subscribe((res) => {
          this.nodes = CommonUtils.toTreeNode(res);
          if(this.requestId != null) {
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

  checkAll() {
    this.isCheckAll = !this.isCheckAll;
  }

  fillListSelection(res) {
    for (const node of res) {
      if(node.selectedId != null) {
         this.selectedNode.push(node);
      }
      if (node.children && node.children.length > 0) {
        this.fillListSelection(node.children);
      }
    }
  }

}
