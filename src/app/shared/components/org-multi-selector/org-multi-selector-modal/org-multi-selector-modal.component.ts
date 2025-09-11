import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChildren } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrgSelectorService, OrganizationService } from '@app/core';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { TreeNode } from 'primeng/api';
import {CryptoService} from "@app/shared/services";

@Component({
  selector: 'org-multi-selector-modal',
  templateUrl: './org-multi-selector-modal.component.html',
})
export class OrgMultiSelectorModalComponent implements OnInit {
  nodes: TreeNode[];
  selectedNode: TreeNode;
  showOrgExpried = false;
  fillterShowOrgExpried = ' curdate() BETWEEN effective_start_date and IFNULL(effective_end_date, curdate())';
  defaultFillter: string;
  resultList: any = {};
  form: FormGroup;
  params: any;
  placeholdercode: string;
  placeholdername: string;
  isSingleClickNode = 0;
  checkFocus = 0; // focus vao code
  selectedOrgArr = [];
  selectedOrg = '';
  codeChange = '';
  nameChange = '';
  @ViewChildren('inputCodeSearch') inputCodeSearch;
  @ViewChildren('inputNameSearch') inputNameSearch;
  @ViewChildren('row') row;
  constructor(
      public activeModal: NgbActiveModal
    , private formBuilder: FormBuilder
    , private service: OrgSelectorService
    , private orgService: OrganizationService
    ) { }

  ngOnInit() {
    this.buildForm();
    this.processSearch(null);
  }
  /**
   * set init value
   */
  setInitValue(params: {operationKey: '', adResourceKey: '', filterCondition: '', rootId: '', checkPermission: ''}
              , nodeStr: any, nodes?: any) {
    this.params = params;
    this.placeholdercode = 'orgSelectorPlaceholder.codeOrgPlaceholder';
    this.placeholdername = 'orgSelectorPlaceholder.nameOrgPlaceholder';
    this.defaultFillter = this.params.filterCondition || '';
    this.actionInitAjax();
    if (nodes && nodes.length > 0) {
      this.selectedOrgArr = nodes;
      this.selectedOrg = CommonUtils.joinStringFromArray(this.selectedOrgArr, 'code');
    } else if (CommonUtils.isNullOrEmpty(!nodeStr)) {
      this.orgService.findByIds(nodeStr).subscribe (res => {
        this.selectedOrgArr = res.data;
        this.selectedOrg = CommonUtils.joinStringFromArray(this.selectedOrgArr, 'code');
      });
    }
  }

  /**
   * action init ajax
   */
  private actionInitAjax() {
    const filter = this.defaultFillter;
    this.params.filterCondition = CryptoService.encrAesEcb(filter);
    this.service.actionInitAjax(this.params)
        .subscribe((res) => {
          this.nodes = CommonUtils.toTreeNode(res);
        });
  }
  /**
   * actionLazyRead
   * @ param event
   */
  public actionLazyRead(event) {
    const params = this.params;
    // params.filterCondition = CryptoService.encrAesEcb(this.params.filterCondition);
    params.nodeId = event.node.nodeId;
    if(event.node.children && event.node.children.length > 0){
      return;
    }
    this.service.actionLazyRead(params)
      .subscribe((res) => {
        event.node.children = CommonUtils.toTreeNode(res);
      });
    this.focusInputSearch();
  }
/****************** CAC HAM COMMON DUNG CHUNG ****/
  /**
   * buildForm
   */
  private buildForm(): void {
    this.form = this.formBuilder.group({
      code: [''],
      name: [''],
      showOrgExpried: false
    });

    this.form.get('code').valueChanges.subscribe(value => {
      this.codeChange = value;
      setTimeout(() => {
        if(this.codeChange === value){
          this.processSearch(null);
        }
      }, 1000);
    });
    this.form.get('name').valueChanges.subscribe(value => {
      this.nameChange = value;
      setTimeout(() => {
        if(this.nameChange === value){
          this.processSearch(null);
        }
      }, 1000);
    });
  }
  /**
   * processSearch
   * @ param event
   */
  public processSearch(event) {
    if (CommonUtils.isValidForm(this.form)) {
      const params = this.form.value;
      if (this.selectedNode) {
        params.nodeId = this.selectedNode.data;
      }
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
      if (this.params.checkPermission) {
        params.checkPermission = this.params.checkPermission;
      }
      if (this.params.rootId) {
        params.rootId = this.params.rootId;
      }
      this.service.search(params, event).subscribe(res => {
        this.resultList = res;
        this.focusInputSearch();
      });
    }
  }
  /**
   * chose
   * @ param item
   */
  public chose(item) {
    const isExisted = this.isSelectedOrg(item);
    if (isExisted >= 0) {
      this.selectedOrgArr.splice(isExisted, 1);
    } else {
      this.selectedOrgArr.push(item);
    }
    this.selectedOrg = CommonUtils.joinStringFromArray(this.selectedOrgArr, 'code');
    // this.activeModal.close(item);
  }
  public isSelectedOrg(item: any) {
    return this.selectedOrgArr.findIndex( x => x.organizationId === item.organizationId);
  }
  /**
   * nodeSelect
   * @ param event
   */
  public nodeSelect(event) {
    this.isSingleClickNode ++;
    setTimeout(() => {
      if (this.isSingleClickNode === 1) {
        this.isSingleClickNode = 0;
        this.processSearch(null);
        return;
      }
    }, 500);
    if (this.isSingleClickNode === 2) {
      // Truong hop double click node
      this.isSingleClickNode = 0;
      let item: any = {};
      this.orgService.findOne(event.node.nodeId)
      .subscribe(res => {
        if (this.orgService.requestIsSuccess(res)) {
          item = { organizationId: res.data.organizationId, code: res.data.code, name: res.data.name };
          this.chose(item);
          // this.activeModal.close(item);
        }
      });
    }
  }

  onShowOrgExpried(event) {
    this.showOrgExpried = event;
    this.processSearch(null);
  }

  //
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
  public closeModal() {
    this.activeModal.close(this.selectedOrgArr);
  }

}
