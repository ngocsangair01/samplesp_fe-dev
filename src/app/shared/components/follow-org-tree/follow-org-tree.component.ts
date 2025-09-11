import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { PartyOrgSelectorService } from '@app/core';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { TreeNode, MenuItem } from 'primeng/api';
import { TranslationService } from 'angular-l10n';
import { ContextMenu } from 'primeng/contextmenu';
import {CryptoService} from "@app/shared/services";

@Component({
  selector: 'follow-org-tree',
  templateUrl: './follow-org-tree.component.html',
  styleUrls: ['./follow-org-tree.component.css']
})
export class FollowOrgTreeComponent implements OnInit {
  public nodes: TreeNode[];
  public selectedNode: TreeNode;
  public isShowContextMenu = true;
  showOrgExpried = false;
  showOrgByLineOrg = false;
  items: MenuItem[];
  @Input()
  public onNodeSelect: Function;
  @Input()
  public isGetAll: boolean = false;
  @Input()
  public showAll: boolean = false;
  @Input()
  public height: string;
  @Input()
  public rootId: string;
  @Output()
  public treeSelectNode: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
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

  @Input()
  public allowShowLineOrg = true;
  @ViewChild("cm2")
  cm2: ContextMenu;

  constructor( private service: PartyOrgSelectorService, private translation: TranslationService) {
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    // set hien thi het tat ca
    if(this.showAll) {
      this.showOrgExpried = true;
    }
    if (!this.showOrgByLineOrg) {
      this.actionInitAjax();
    } else {
      this.actionInitAjaxByLineOrg();
    }
    this.height = this.height || '800';
  }
  /**
   * getParams
   */
  private getParams() {
    return { operationKey: this.operationKey,
             adResourceKey: this.adResourceKey,
             filterCondition: (this.filterCondition ? CryptoService.encrAesEcb(this.filterCondition) : CryptoService.encrAesEcb('')),
             nodeId: '',
             rootId: this.rootId,
             showOrgExpried: this.showOrgExpried,
             isGetAll: this.isGetAll ? 1 : 0
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
    this.service.actionInitAjax(this.getParams())
        .subscribe((res) => {
          this.nodes = CommonUtils.toTreeNode(res);
          // const form = {
          //   node : res[0]
          // }
          // this.nodeSelect(form)
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
    // TH neu click vao nganh tren cay don vi nganh doc thi khong su ly gi
    if (event.node.lineOrg) {
      return;
    }
    this.treeSelectNode.emit(event);
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
}
