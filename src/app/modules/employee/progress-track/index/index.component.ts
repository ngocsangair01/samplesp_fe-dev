import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Router } from '@angular/router';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { AppComponent } from '@app/app.component';
import { DialogService, TreeNode } from 'primeng/api';
import {CommonUtils, CryptoService, ValidationService} from "../../../../shared/services";
import { TranslationService } from 'angular-l10n';
import { ThoroughContentService } from '@app/core/services/thorough-content/thorough-content.service';
import { PartyOrgSelectorService, SMALL_MODAL_OPTIONS } from '@app/core';
import { FormBuilder } from '@angular/forms';
import { EmpThoroughContentService } from '@app/core/services/thorough-content/emp-thorough-content.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SendReminderModaComponent } from '../create-update/modal/send-reminder-modal.component';

@Component({
  selector: 'index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent extends BaseComponent implements OnInit {
  nodes: TreeNode[];
  selectedNode: TreeNode;
  showOrgExpried = false;
  fillterShowOrgExpried = ' curdate() BETWEEN effective_date and IFNULL(exprited_date, curdate())';
  params: any = { operationKey: '', adResourceKey: '', filterCondition: '', rootId: '', checkPermission: '' };

  isHidden: boolean = false;
  isMasO: boolean = false;
  isPartyO: boolean = false;
  isOrg: boolean = false;
  rewardType: any;
  branch: any;
  formConfig = {
    parentId: [null, ValidationService.required],
    partyOrgName: [null],
    nodeId: [null],

    isParentId: [false],
    isPartyOrgName: [false],

    first: [0],
    limit: [10],
  }
  businessTypeOptions
  typeOfReportOptions;
  isMobileScreen: boolean = false;
  tableColumnsConfig = [
    {
      header: "common.label.table.action",
      width: "50px"
    },
    {
      header: "common.table.index",
      width: "50px"
    },
    {
      name: "organizationName",
      header: "app.organization.controller.name",
      width: "200px"
    },
    {
      name: "title",
      header: "label.thorough-content.title-thorough",
      width: "200px"
    },
    {
      name: "typeThoroughName",
      header: "label.thorough-content.type-thorough",
      width: "200px"
    },
    {
      name: "targetTypeThoroughName",
      header: "label.thorough-content.target-type-thorough",
      width: "200px"
    },
    {
      name: "thoroughDate",
      header: "label.thorough-content.thorough-date",
      width: "150px"
    },
    {
      name: "endDate",
      header: "label.thorough-content.end-date",
      width: "150px"
    },
    {
      name: "processOnOrg",
      header: "label.thorough-content.process-on-org",
      width: "150px"
    },
    {
      name: "total",
      header: "label.thorough-content.total",
      width: "150px"
    },
    {
      name: "confirmed",
      header: "label.thorough-content.confirmed",
      width: "150px"
    },
    {
      name: "notConfirmed",
      header: "label.thorough-content.not-confirmed",
      width: "150px"
    },
  ];

  branchOptions = [{id: 1, name: this.translation.translate('label.thorough-content.branch-1')},
    {id: 2, name: this.translation.translate('label.thorough-content.branch-2')},
    {id: 3, name: this.translation.translate('label.thorough-content.branch-3')},
    {id: 4, name: this.translation.translate('label.thorough-content.branch-4')},
    {id: 5, name: this.translation.translate('label.thorough-content.branch-5')},
    {id: 6, name: this.translation.translate('label.thorough-content.branch-6')},
    {id: 7, name: this.translation.translate('label.thorough-content.branch-7')}];
  
  typeThoroughOptions = [
      // { id: 1, name: this.translation.translate('label.thorough-content.type-thorough-1') },
    { id: 2, name: this.translation.translate('label.thorough-content.type-thorough-2') },
    { id: 3, name: this.translation.translate('label.thorough-content.type-thorough-3') },
    { id: 4, name: this.translation.translate('label.thorough-content.type-thorough-4') },
    { id: 5, name: this.translation.translate('label.thorough-content.type-thorough-5') },
    { id: 6, name: this.translation.translate('label.thorough-content.type-thorough-6') },
    { id: 8, name: this.translation.translate('label.thorough-content.type-thorough-8') },
    { id: 7, name: this.translation.translate('label.thorough-content.type-thorough-7') }];

  statusOptions = [{id: 0, name: this.translation.translate('label.thorough-content.status-0')},
    {id: 1, name: this.translation.translate('label.thorough-content.status-1')}];

  issueLevelOptions = [{id: 1, name: this.translation.translate('label.thorough-content.issue-level-1')},
    {id: 2, name: this.translation.translate('label.thorough-content.issue-level-2')},
    {id: 3, name: this.translation.translate('label.thorough-content.issue-level-3')}];

  emptyFilterMessage = this.translation.translate('selectFilter.emptyFilterMessage');

  filterCondition = "AND obj.status = 1 ORDER BY obj.created_date DESC";

  constructor(
    private router: Router,
    private appParamService: AppParamService,
    private app: AppComponent,
    private formBuilder: FormBuilder,
    public dialogService: DialogService,
    private service: ThoroughContentService,
    private partyOrgSelectorService: PartyOrgSelectorService,
    private empThoroughContentService: EmpThoroughContentService,
    public translation: TranslationService,
    public modalService: NgbModal
  ) {
    super();
    this.setMainService(this.service);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;

    this.formSearch = this.buildForm('', this.formConfig);
    if (history.state.thoroughContentId) {
      this.formSearch.get('parentId').setValue(history.state.thoroughContentId);
    }

    this.service.getBranchList().subscribe(resBranch => {
      if (resBranch.data.length > 0) {
        this.filterCondition = `AND obj.status = 1
        AND obj.branch IN (${resBranch.data.join(",")})
        ORDER BY obj.created_date DESC`;
      }
    });

    this.actionInitAjax();
  }

  /**
   * action init ajax
   */
   private actionInitAjax() {
    const filter = '';
    this.params.filterCondition = CryptoService.encrAesEcb(filter);
    this.partyOrgSelectorService.actionInitAjax(this.params)
      .subscribe((res) => {
        this.nodes = CommonUtils.toTreeNode(res);
        this.selectedNode = this.nodes.reduce((a, b) => parseInt(a.data) < parseInt(b.data) ? a : b);
        this.formSearch.get('nodeId').setValue(parseInt(this.selectedNode.data));
        this.search({first: 0, rows: 10});
      });
  }

  /**
   * actionLazyRead
   * @ param event
   */
   public actionLazyRead(event) {
    const params = this.params;
    params.nodeId = event.node.nodeId;
    this.partyOrgSelectorService.actionLazyRead(params)
      .subscribe((res) => {
        event.node.children = CommonUtils.toTreeNode(res);
      });
  }

  /**
   * nodeSelect
   * @ param event
   */
   public nodeSelect(event) {
     this.formSearch.get('nodeId').setValue(event.node.nodeId);

     this.selectedNode = event.node;
     
    this.search({first: 0, rows: this.formSearch.value.limit});
  }

  ngOnInit() {
  }

  navigateToViewPage(rowData?) {
    this.router.navigateByUrl('/employee/progress-track/view', { state: rowData });
  }

  search(event?) {
    let isCheck = false;
    if (!CommonUtils.isValidForm(this.formSearch) || isCheck) {
      return;
    }
    if(event){
      this.formSearch.value['first'] = event.first;
      this.formSearch.value['limit'] = event.rows;
    }
    this.service.searchProcess(this.formSearch.value, event).subscribe(res => {
      this.resultList = res;
    });
  }

  get f() {
    return this.formSearch.controls;
  }

  viewList(rowData?) {
    this.router.navigateByUrl('/employee/progress-track/unconfirmed-list', { state: rowData });
  }

  sendReminder(rowData?) {
    const modalRef = this.modalService.open(SendReminderModaComponent, SMALL_MODAL_OPTIONS);
    modalRef.componentInstance.setInitValue(rowData.thoroughContentId, rowData.organizationId);
  }

  exportList(rowData?) {
    const credentials = Object.assign({thoroughContentId: rowData.thoroughContentId, organizationId: rowData.organizationId});
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.empThoroughContentService.export(params, 1).subscribe(res => {
      saveAs(res, 'Danh_sach_CBNV_chua_xac_nhan.xlsx');
    });
  }
}
