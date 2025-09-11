import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PartyOrganizationService, PartyOrgSelectorService } from '@app/core';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TreeNode } from 'primeng/api';
import {CryptoService} from "@app/shared/services";

@Component({
  selector: 'multi-party-org-selector-modal',
  templateUrl: './multi-party-org-selector-modal.component.html',
})
export class MultiPartyOrgSelectorModalComponent implements OnInit {
  
  nodes: TreeNode[];
  selectedNode: TreeNode;
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
    this.processSearch(null);
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
      this.list = Object.assign([], params.list);
      this.listOld = Object.assign([], params.list);
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
      });
  }
  /**
   * actionLazyRead
   * @ param event
   */
  actionLazyRead(event) {
    const params = this.params;
    params.nodeId = event.node.nodeId;
    // this.params.filterCondition = CryptoService.encrAesEcb(this.params.filterCondition);
    if (event.node.children && event.node.children.length > 0) {
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
      params.checkPermission = this.params.checkPermission;
      if (this.params.rootId) {
        params.rootId = this.params.rootId;
      }
      this.service.search(params, event).subscribe(res => {
        this.resultList = res;
        for (let data of this.resultList.data) {
          for (let objSelect of this.list) {
            if (data.partyOrganizationId === objSelect.partyOrganizationId) {
              data.check = true;
            }
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
  /**
   * nodeSelect
   * @ param event
   */
  nodeSelect(event) {
    this.isSingleClickNode++;
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
      this.partyOrgService.findOne(event.node.nodeId)
        .subscribe(res => {
          if (this.partyOrgService.requestIsSuccess(res)) {
            item = { partyOrganizationId: res.data.partyOrganizationId, code: res.data.code, name: res.data.name, check: true };
            let index = this.list.findIndex(x => x.partyOrganizationId === item.partyOrganizationId);
            if (index < 0) {
              this.list.push(item);
            }
            this.chose();
          }
        });
    }
  }

  change(event, item) {
    if (event.currentTarget.checked) {
      this.list.push(item);
    } else {
      let index = this.list.findIndex(x => x.partyOrganizationId === item.partyOrganizationId);
      this.list.splice(index, 1);
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

}
