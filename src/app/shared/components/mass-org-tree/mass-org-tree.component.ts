import { MassOrgSelectorService } from '@app/core/services/mass-organization/mass-org-selector.service';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { ContextMenu } from 'primeng/contextmenu';
import { TreeNode, MenuItem } from 'primeng/api';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { TranslationService } from 'angular-l10n';
import {CryptoService} from "@app/shared/services";

@Component({
  selector: 'mass-org-tree',
  templateUrl: './mass-org-tree.component.html',
})
export class MassOrgTreeComponent implements OnInit {
  public nodes: TreeNode[];
  public selectedNode: TreeNode;
  public isShowContextMenu = true;
  showOrgExpried = false;
  showOrgByLineOrg = false;
  items: MenuItem[];

  @Input() 
  public branch: any;
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
  constructor(private service: MassOrgSelectorService, private translation: TranslationService) { }

  ngOnInit() {
    // set hien thi het tat ca
    if(this.showAll){
      this.showOrgExpried = true;
    }
    this.actionInitAjax();
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
             isGetAll: this.isGetAll ? 1 : 0,
             branch: this.branch
           };
  }
  /**
   * action init ajax
   */
  public actionInitAjax() {
    this.service.actionInitAjax(this.getParams())
        .subscribe((res) => {
          this.nodes = CommonUtils.toTreeNode(res);
        });
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
   * nodeSelect
   * @ param event
   */
  public nodeSelect(event) {
    // TH neu click vao nganh tren cay don vi nganh doc thi khong xu ly gi
    // console.log('event', event);
    // console.log('node', event.node);
    // console.log('lineOrg', event.node.lineOrg);
    if (event.node.lineOrg) {
      return;
    }
    this.treeSelectNode.emit(event);
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
  // for context menu
  /**
  * action create Context Menu
  */
  nodeContextMenuSelect(event) {
    this.nodeContextMenuBuilder.emit(event.node);
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
}
