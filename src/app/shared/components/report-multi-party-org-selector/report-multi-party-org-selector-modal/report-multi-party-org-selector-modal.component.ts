import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PartyOrganizationService, PartyOrgSelectorService } from '@app/core';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TreeNode } from 'primeng/api';
import _ from 'lodash';
import {CryptoService} from "@app/shared/services";
@Component({
  selector: 'report-multi-party-org-selector-modal',
  templateUrl: './report-multi-party-org-selector-modal.component.html',
})
export class ReportMultiPartyOrgSelectorModalComponent implements OnInit {

  nodes: TreeNode[];
  listSelectedNode: TreeNode[]= [];
  selectedNode: any = {}
  showOrgExpried = false;
  fillterShowOrgExpried = ' CURDATE() BETWEEN effective_date and IFNULL(exprited_date, CURDATE())';
  defaultFillter: string;
  resultList: any = {};
  form: FormGroup;
  params: any;
  placeholdercode: string;
  placeholdername: string;
  isSingleClickNode = 0;
  checkFocus = 0; // focus vao code
  codeChange = '';
  nameChange = '';
  @ViewChildren('inputCodeSearch') inputCodeSearch;
  @ViewChildren('inputNameSearch') inputNameSearch;
  @ViewChildren('row') row;
  list = [];
  listOld = [];
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private service: PartyOrgSelectorService,
    private partyOrgService: PartyOrganizationService
  ) {

  }

  ngOnInit() {
    this.buildForm();
    // this.processSearch(null);
  }
  /**
   * set init value
   */
  setInitValue(params: { operationKey: '', adResourceKey: '', filterCondition: '', rootId: '', checkPermission: '', list: '' }) {
    this.params = params;
    this.placeholdercode = 'orgSelectorPlaceholder.codePartyOrgPlaceholder';
    this.placeholdername = 'orgSelectorPlaceholder.namePartyOrgPlaceholder';
    this.defaultFillter = this.params.filterCondition || '';
    if (params.list) {
      this.list = _.cloneDeep(params.list);
      this.listOld = _.cloneDeep(params.list);
    }
    this.actionInitAjax();
  }

  /**
   * action init ajax
   */
  actionInitAjax() {
    const filter = this.defaultFillter;
    this.params.filterCondition = CryptoService.encrAesEcb(filter);
    this.service.actionInitAjax(this.params)
      .subscribe((res) => {
        this.nodes = CommonUtils.toTreeNode(res);
        this.fillListSelection(this.nodes);
        this.selectedNode = res[0];
        this.processSearch(null);
      });
  }

  fillListSelection(res) {
    for (const item of res) {
      const mapNode = this.list.some(ele => ele.nodeId === item.nodeId);
      if (mapNode) {
        this.listSelectedNode.push(item);
      }
      if (item.children && item.children.length) {
        this.fillListSelection(item.children);
      }
    }
  }
  /**
   * actionLazyRead
   * @ param event
   */
  actionLazyRead(event) {
    const params = this.params;
    params.nodeId = event.node.nodeId;
    if (event.node.children && event.node.children.length > 0) {
      return;
    }
    this.service.actionLazyRead(params).subscribe((res) => {
        event.node.children = CommonUtils.toTreeNode(res);
        this.fillListSelection(event.node.children);
      });
    this.focusInputSearch();
  }

  /****************** CAC HAM COMMON DUNG CHUNG ****/
  /**
   * buildForm
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      code: [''],
      name: [''],
      showOrgExpried: false
    });

    this.form.get('code').valueChanges.subscribe(value => {
      this.codeChange = value;
      setTimeout(() => {
        if (value === this.codeChange) {
          this.processSearch(null);
        }
      }, 1000);
    });
    this.form.get('name').valueChanges.subscribe(value => {
      this.nameChange = value;
      setTimeout(() => {
        if (value === this.nameChange) {
          this.processSearch(null);
        }
      }, 1000);
    });
  }

  /**
   * processSearch
   * @ param event
   */
  processSearch(event) {
    if (CommonUtils.isValidForm(this.form)) {
      const params = this.form.value;
      if (this.showOrgExpried) {
        params.filterCondition = CryptoService.encrAesEcb(this.defaultFillter);
      } else {
        if (this.defaultFillter && this.fillterShowOrgExpried) {
          params.filterCondition = CryptoService.encrAesEcb(this.defaultFillter + ' AND ' + this.fillterShowOrgExpried);
        } else {
          params.filterCondition = CryptoService.encrAesEcb(this.fillterShowOrgExpried);
        }
      }
      if (this.params.operationKey) {
        params.operationKey = this.params.operationKey;
      }
      if (this.params.adResourceKey) {
        params.adResourceKey = this.params.adResourceKey;
      }
      params.checkPermission = this.params.checkPermission;
      if (this.params.rootId) {
        params.rootId = this.params.rootId;
      }
      if (this.selectedNode) {
        params.nodeId = this.selectedNode.data;
      }
      this.service.search(params, event).subscribe(res => {
        this.resultList = res;
        if (this.listSelectedNode && this.listSelectedNode instanceof Array) {
          const mapOrgId = {};
          this.list.forEach(ele => {
            mapOrgId[ele.partyOrganizationId] = ele;
          });
          for (let i = 0; i < this.listSelectedNode.length; i++) {
            const ele: any = this.listSelectedNode[i];
            if (ele.styleClass === "org-has-expried" && !this.showOrgExpried) {
              continue;
            }
            if (!mapOrgId[ele.nodeId]) {
              this.list.push({
                organizationId: ele.nodeId,
                partyOrganizationId: ele.nodeId,
                name: ele.label,
                check: true,
                nodeId:  ele.nodeId
              });
              mapOrgId[ele.nodeId] = ele;
            }
          }
          if (this.resultList && this.resultList.data instanceof Array) {
            this.resultList.data.forEach((item: any) => {
              const partyOrganizationId = item.partyOrganizationId;
              const mapItem = mapOrgId[partyOrganizationId];
              if (mapItem) {
                item.check = true;
              }
            });
          }
        }
        this.focusInputSearch();
      });
    }
  }
  /**
   * chose
   * @ param item
   */
  chose() {
    this.activeModal.close(this.list);
  }

  recursiveFindNode(node, mapParentFind) {
    let tempList = [];
    node = node instanceof Array ? node : [node];
    for (const key in node) {
      if (node[key].styleClass === "org-has-expried" && !this.showOrgExpried) {
        continue;
      }
      if (!mapParentFind[node[key].nodeId]) {
        tempList.push(node[key]);
      }
      if (node[key].children && node[key].children instanceof Array && node[key].children.length) {
        const recuitList =  this.recursiveFindNode(node[key].children, mapParentFind);
        tempList = tempList.concat(recuitList);
      }
    }
    return tempList;
  }

  /**
   * nodeSelect
   * @ param event
   */
  nodeSelect(event) {
    const mapParentFind = {};
    this.listSelectedNode.forEach((ele: any) => {
      mapParentFind[ele.nodeId] = ele;
    })
    const lstNodes = this.recursiveFindNode(event.node, mapParentFind);
    if (lstNodes.length) {
      lstNodes.forEach(item => {
        this.listSelectedNode.push(item);
        const newItem = { partyOrganizationId: item.nodeId, nodeId: item.nodeId, name: item.label, check: true };
        this.list.push(newItem);
      });
    }
    this.tickOrOffSearchList();
    setTimeout(() => {
      this.selectedNode = event.node;
      this.processSearch(null);
    }, 500);
  }

  nodeUnSelect(event) {
    const indexOf = this.list.findIndex(ele => ele.partyOrganizationId === event.node.nodeId);
    if (indexOf !== -1) {
      this.list.splice(indexOf, 1);
      this.tickOrOffSearchList();
    }
  }

  tickOrOffSearchList() {
    const listChange = this.resultList;
    if (listChange && listChange.data instanceof Array) {
      const selectMap = {};
      this.list.forEach(ele => {
        selectMap[ele.partyOrganizationId] = ele;
      });
      listChange.data.forEach(ele => {
        const check = selectMap[ele.partyOrganizationId];
        ele.check = check;
      });
      this.resultList = _.cloneDeep(listChange);
    }
  }

  findDataNode(data, parent) {
    if (parent && parent instanceof Array && parent.length) {
      for (const key in parent) {
        if (parent[key].nodeId === data.partyOrganizationId) {
          return parent[key];
        } else if (parent[key].children && parent[key].children instanceof Array && parent[key].children.length) {
          const result = this.findDataNode(data, parent[key].children);
          if (result) {
            return result;
          }
        }
      }
    }
  }

  change(event, item) {
    const indexNodeSelect = this.listSelectedNode.findIndex((ele: any) => ele.partyOrganizationId === item.partyOrganizationId);
    const mapNode = this.findDataNode(item, this.nodes);
    if (event.currentTarget.checked) {
      const tempItem = {
        ...item,
        nodeId: item.partyOrganizationId,
        check: true
      };
      if (indexNodeSelect === -1 && mapNode) {
        tempItem['nodeId'] = mapNode.nodeId;
        this.listSelectedNode.push(mapNode);
      }
      this.list.push(tempItem);
    } else {
      let index = this.list.findIndex(x => x.partyOrganizationId === item.partyOrganizationId);
      this.list.splice(index, 1);
      if (mapNode) {
        this.listSelectedNode.splice(indexNodeSelect, 1);
      }
    }
  }

  onShowOrgExpried(event) {
    this.showOrgExpried = event;
    this.processSearch(null);
  }

  focusInputSearch() {
    setTimeout(() => {
      if (this.checkFocus === 0) {
        this.inputCodeSearch.first.nativeElement.focus();
      } else {
        this.inputNameSearch.first.nativeElement.focus();
      }
    }, 400);
  }

  changeIndex(index) { // tính index của element đang focus
    let currentIndex = -1; // chưa có item nào được focus
    for (let i = 0; i < this.row._results.length; i++) {
      const item = this.row._results[i];
      if (item.nativeElement.classList.contains('datapickerSelected')) {
        item.nativeElement.classList.remove('datapickerSelected');
        currentIndex = i;
        break;
      }
    }
    let nextIndex = currentIndex += index;
    nextIndex = (nextIndex <= 0) ? 0 : (nextIndex >= this.row._results.length ? this.row._results.length - 1 : nextIndex);
    this.row._results[nextIndex].nativeElement.classList.add('datapickerSelected');
  }

  onSelectEnter() {
    for (const item of this.row._results) {
      if (item.nativeElement.className.includes('datapickerSelected')) {
        item.nativeElement.firstElementChild.firstElementChild.click();
        this.inputCodeSearch.first.nativeElement.focus();
        return;
      }
    }
    this.processSearch(null);
  }

  close() {
    this.activeModal.close(this.listOld);
  }

  chooseAll(event) {
    this.list = [];
    if (event.currentTarget.checked) {
      this.list = this.resultList.data;
    }
    this.resultList.data.forEach(e => {
      e.check = event.currentTarget.checked
    })
  }
}
