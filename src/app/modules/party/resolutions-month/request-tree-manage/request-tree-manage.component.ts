import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { SMALL_MODAL_OPTIONS } from '@app/core';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { TreeNode, MenuItem } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';
import { PopUpRejectComponent } from '../request-resolutions-month/pop-up-reject/pop-up-reject.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestProcessTreeService } from '@app/core/services/party-organization/request-process-tree.service';
import { FileStorageService } from '@app/core/services/file-storage.service';

@Component({
  selector: 'request-tree-manage',
  templateUrl: './request-tree-manage.component.html',
})
export class RequestTreeManageComponent implements OnInit {
  public nodes: TreeNode[];
  public selectedNode: TreeNode[];
  files: TreeNode[];
  public isShowContextMenu = true;
  isCheckAll = false;
  showOrgExpried = false;
  showOrgByLineOrg = false;
  items: MenuItem[];
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

  private approved : Number;

  constructor( private service: RequestProcessTreeService,
    private modalService: NgbModal,
    private fileStorage: FileStorageService) {
    this.selectedNode = [];
    this.approved = 4;
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    // set hien thi het tat ca
    if(this.showAll){
      this.showOrgExpried = true;
    }

    this.height = this.height || '800';
  }
  /**
   * getParams
   */
  private getParams() {
    return { operationKey: this.operationKey,
             adResourceKey: this.adResourceKey,
             filterCondition: (this.filterCondition ? this.filterCondition : ''),
             nodeId: '',
             rootId: this.rootId,
             showOrgExpried: this.showOrgExpried,
             isGetAll: this.isGetAll ? 1 : 0,
             requestId: this.requestId
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
          this.nodes = CommonUtils.toTreeNodeTable(res);
          // fill list da chon trong truong hop sua
          
          if(this.requestId != null) {
            this.fillListSelection(res);
          }
        });
  }

   /**
   * actionlazyLod
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
      if(node.selectedId != null) {
         this.selectedNode.push(node);
      }
      if (node.children && node.children.length > 0) {
        this.fillListSelection(node.children);
      }
    }
  }

preparePopReject(item) {
    this.actionActiveModal(item);
}

// action mo
actionActiveModal(item) {
  const modalRef = this.modalService.open(PopUpRejectComponent, SMALL_MODAL_OPTIONS);
  modalRef.componentInstance.setResponseResolutionsMonthId(item.selectedId);
  modalRef.result.then((result) => {
    if (!result) {
      return;
    }
    this.actionInitAjax();
  });
 }
 
     /**
   * Xu ly download file trong danh sach
   */
  public downloadFile(fileData) {
    this.fileStorage.downloadFile(fileData.secretId).subscribe(res => {
        saveAs(res , fileData.fileName);
    });
  }
}
