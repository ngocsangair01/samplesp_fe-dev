import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrganizationService, OrgSelectorService } from '@app/core';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TreeNode } from 'primeng/api';
import {CryptoService} from "@app/shared/services";

@Component({
  selector: 'org-selector-modal',
  templateUrl: './org-selector-modal.component.html',
})
export class OrgSelectorModalComponent implements OnInit {
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
  setInitValue(params: { operationKey: '', adResourceKey: '', filterCondition: '', rootId: '', checkPermission: '' }) {
    this.params = params;
    this.placeholdercode = 'orgSelectorPlaceholder.codeOrgPlaceholder';
    this.placeholdername = 'orgSelectorPlaceholder.nameOrgPlaceholder';
    this.defaultFillter = this.params.filterCondition || '';
    this.actionInitAjax();
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
    params.nodeId = event.node.nodeId;
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
      setTimeout(() => {
        this.processSearch(null);
      }, 1000);
    });
    
    this.form.get('name').valueChanges.subscribe(value => {
      setTimeout(() => {
        this.processSearch(null);
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
    this.activeModal.close(item);
  }

  /**
   * nodeSelect
   * @ param event
   */
  public nodeSelect(event) {
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
      this.orgService.findOne(event.node.nodeId)
        .subscribe(res => {
          if (this.orgService.requestIsSuccess(res)) {
            item = { organizationId: res.data.organizationId, code: res.data.code, name: res.data.name, effectiveDate: res.data.effectiveStartDate, expiredDate: res.data.effectiveEndDate };
            this.activeModal.close(item);
          }
        });
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
}
