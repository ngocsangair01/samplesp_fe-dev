import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { DEFAULT_MODAL_OPTIONS } from '@app/core';
import { FileControl } from '@app/core/models/file.control';
import { HrStorage } from '@app/core/services/HrStorage';
import { CriteriaPlanService } from '@app/core/services/party-organization/criteria-plan.service';
import { ResponseResolutionQuarterYearService } from '@app/core/services/party-organization/request-resolution-quarter-year.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslationService } from 'angular-l10n';
import { CriteriaPlanTreeComponent } from '../criteria-plan-tree/criteria-plan-tree.component';
import { ResolutionCriteriaHistoryComponent } from '../resolution-criteria-history-pop-up/resolution-criteria-history.component';

@Component({
  selector: 'resolution-quarter-year-criteria',
  templateUrl: './resolution-quarter-year-criteria.component.html',
  styleUrls: ['./resolution-quarter-year-criteria.component.css']
})
export class ResolutionQuarterYearCriteriaComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

  formShow: FormGroup;
  isHaveHistory: Number;
  isMobileScreen: boolean = false;
  formConfig = {
    requestResolutionsId: [''],
    organizationId: ['', [ValidationService.required]],
    resolutionsNumber: ['', [ValidationService.required, ValidationService.maxLength(100)]],
    resolutionsName: ['', [ValidationService.required, ValidationService.maxLength(200)]],
    finishDate: ['', [ValidationService.required]]
  };

  formSaveCriteria: FormGroup;
  formConfigCriteria = {
    cateCriteriaId: [''],
    requestResolutionsId: [''],
    organizationId: [''],
    parentId: [''],
    criteriaParentName: ['', ValidationService.maxLength(500)],
    criteriaName: ['', ValidationService.maxLength(500)],
    isInputContent: [''],
    criteriaOrder: [''],
    content: [''],
    type: ['']
  };

  @ViewChild('tree')
  public tree: CriteriaPlanTreeComponent;

  public test: Event;

  @ViewChildren('orgSelector')
  public orgSelector;

  @ViewChild('criteriaName')
  criteriaName: any;

  @ViewChild('content')
  content: any;

  public requestResolutionsId: any;
  public criteriaId: any;
  public isView: boolean = false;
  public isRoot: boolean = true;
  public isSaveTree: boolean;
  public createPlan: boolean = false;
  public isInsertContentCriteria: boolean = false;
  public checkPermission: boolean = true;
  public havePermission: boolean = false;
  public isValidInput: boolean = false;
  public nodeSelected: any;
  public isInputContent: string = this.translation.translate('resolutionQuarterYear.isInputContentNotAllow');
  public isChecked: boolean = false;
  public rootId: any;
  private navigationSubscription;
  private operationKey = 'action.view';
  private adResourceKey = 'resource.partyOrganization';
  constructor(private router: Router
    , public actr: ActivatedRoute
    , private app: AppComponent
    , private responseResolutionQuarterYearService: ResponseResolutionQuarterYearService
    , private translation: TranslationService
    , private criteriaPlanService: CriteriaPlanService
    , public modalService: NgbModal
  ) {
    super(null, CommonUtils.getPermissionCode("resource.requestResolutionQuarterYear"));
    this.isHaveHistory = 0;
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.buildFormShow({});
        this.buildFormCriteria({});

        const params = this.actr.snapshot.params;
        if (params && CommonUtils.isValidId(params.id)) {
          this.requestResolutionsId = params.id;
        }
        if (this.actr.snapshot.paramMap.get('action') === 'create-plan') {
          this.createPlan = true;
          this.isInsertContentCriteria = false;
        } else if (this.actr.snapshot.paramMap.get('action') === 'perform-criteria') {
          this.criteriaId = this.actr.snapshot.paramMap.get('criteriaId');
          this.createPlan = false;
          this.isInsertContentCriteria = true;
        } else if (this.actr.snapshot.paramMap.get('action') === 'view-detail') {
          this.isView = true;
          this.createPlan = false;
          this.isInsertContentCriteria = false;
        }
        this.processCreateCriteriaTree();
      }
    });
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    if (this.createPlan || this.isView) {
      this.responseResolutionQuarterYearService.findOne(this.requestResolutionsId).subscribe(res => {
        if (res.data) {
          this.buildFormShow(res.data);
        }
      })
    } else {
      this.responseResolutionQuarterYearService.findByCateCriteriaId(this.criteriaId).subscribe(res => {
        if (res.data) {
          this.buildFormShow(res.data);
        }
      })
    }
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
  }

  get f() {
    return this.formShow.controls;
  }

  get fCriteria() {
    return this.formSaveCriteria.controls;
  }

  /**
   * Hàm onchange Nhập nội dung tiêu chí
   * @param e 
   * @param orgSelector 
   */
  onChangeIsInputContent(e, orgSelector) {
    this.isChecked = e.checked;
    if (this.isChecked) {
      this.isInputContent = this.translation.translate('resolutionQuarterYear.isInputContentAllow');
      this.formSaveCriteria.removeControl('organizationId');
      this.formSaveCriteria.addControl('organizationId', new FormControl(null, [ValidationService.required]));
    } else {
      this.isInputContent = this.translation.translate('resolutionQuarterYear.isInputContentNotAllow');
      orgSelector.delete();
    }
  }

  /**
   * buildFormShow
   * @param event
   */
  private buildFormShow(data?: any): void {
    this.formShow = this.buildForm(data, this.formConfig);
  }

  /**
   * buildFormCriteria
   * @param data 
   * @param validate 
   */
  private buildFormCriteria(data?: any, validate?: boolean): void {
    this.formSaveCriteria = this.buildForm(data, this.formConfigCriteria);
    this.formSaveCriteria.addControl('file', new FileControl(null));
    if (validate === this.createPlan) {
      this.formSaveCriteria.removeControl('criteriaName');
      this.formSaveCriteria.addControl('criteriaName', new FormControl(data.criteriaName, [ValidationService.required]));
    } else if (validate === this.isInsertContentCriteria) {
      this.formSaveCriteria.removeControl('content');
      this.formSaveCriteria.addControl('content', new FormControl(data.content, [ValidationService.required]));
      // this.formSaveCriteria.removeControl('file');
      // this.formSaveCriteria.addControl('file', new FileControl(null, [ValidationService.required]));
    }
    if (data.fileAttachment && data.fileAttachment.file) {
      (this.formSaveCriteria.controls['file'] as FileControl).setFileAttachment(data.fileAttachment.file);
    }
  }

  /**
   * Sửa thông tin tiêu chí
   * param orgDraffId
   */
  public editCriteria(event) {
    // set node selected for child companent
    this.nodeSelected = event;
    if (this.nodeSelected === this.tree.rootNode) {
      this.isRoot = true;
      return this.app.warningMessage('resolutionQuarterYear.pleaseChooseCriteria');
    }
    this.criteriaPlanService.findOne(this.nodeSelected.nodeId).subscribe(res => {
      if (res.data) {
        this.isRoot = false;
        //Check theo miền dữ liệu để xem có được phép nhập vào nội dung tiêu chí
        const grantedDomain = HrStorage.getGrantedDomainByCode(CommonUtils.getPermissionCode(this.operationKey)
          , CommonUtils.getPermissionCode(this.adResourceKey));
        const tmp = ',' + grantedDomain + ',';
        if (res.data.organizationId && res.data.organizationId !== null && res.data.organizationId !== ''
          && tmp.indexOf(',' + res.data.organizationId + ',') > -1) {
          this.havePermission = true;
        } else {
          this.havePermission = false;
        }


        if (this.createPlan) {
          this.buildFormCriteria(res.data, this.createPlan);
          setTimeout(() => {
            this.criteriaName.nativeElement.focus();
          }, 500);
        } else if (this.isInsertContentCriteria) {
          this.buildFormCriteria(res.data, this.isInsertContentCriteria);
          setTimeout(() => {
            this.content.nativeElement.focus();
          }, 500);
        } else {
          this.buildFormCriteria(res.data);
        }
        // check xem co show lich su hay khong
        this.isHaveHistory = res.data.isInputContent;
        if (res.data.isInputContent || res.data.isInputContent === 1) {
          this.isChecked = true;
          this.isInputContent = this.translation.translate('resolutionQuarterYear.isInputContentAllow');
        } else {
          this.isChecked = false;
          this.isInputContent = this.translation.translate('resolutionQuarterYear.isInputContentNotAllow');
        }
      }
    })
  }

  /**
    * Xu ly hien thi tab commonInfo
    * Sau khi save tree hoac clone
    */
  public rebuildAfterSaveTree() {
    // xu ly focus mac dinh vao cay goc
    // this.tree.selectedNode = this.tree.rootNode;
    // set node selected for child companent
    // this.nodeSelected = this.tree.rootNode;
    this.processCreateCriteriaTree();


  }

  /**
   * convertTreeNodeToValue
   * param nodes
   */
  private convertTreeNodeToValue(nodes: any) {
    if (!nodes) {
      return null;
    }
    const values = [];
    for (const node of nodes) {
      const data = {
        nodeId: node.nodeId
        , data: node.data
        , expanded: node.expanded ? 1 : 0
        , label: node.label
        , children: this.convertTreeNodeToValue(node.children)
      };
      values.push(data);
    }
    return values;
  }

  /**
   * Lưu thông tin cây đơn vị
   */
  public saveTree() {
    const formSave = {};
    formSave['nodes'] = this.convertTreeNodeToValue(this.tree.dataNodes);
    if (this.tree.isValidInput) {
      return;
    }
    // const iChars = '!#$^*[]\\{}\"?<>\'';
    // for(let obj of formSave['nodes']) {
    //   for (let j = 0; j < obj.label.length; j++) {
    //     if (iChars.indexOf(obj.label.charAt(j)) >= 0) {
    //       this.isValidInput = true;
    //       return this.app.errorMessage('validate.isValidInput');
    //     } else {
    //       this.isValidInput = false;
    //     }
    //   }
    // }

    if (!CommonUtils.isValidForm(formSave)) {
      return;
    }
    this.app.confirmMessage(null, () => {
      this.criteriaPlanService.saveTreeCriteriaPlanById(this.requestResolutionsId, formSave)
        .subscribe((res) => {
          if (this.criteriaPlanService.requestIsSuccess(res)) {
            this.rebuildAfterSaveTree();
          }
        });
    }, null);
  }

  /**
   * Xử lý hiển thị cây tiêu chí
   */
  public processCreateCriteriaTree() {
    if (this.createPlan || this.isView) {
      this.responseResolutionQuarterYearService.findOne(this.requestResolutionsId)
        .subscribe(res => {
          if (this.criteriaPlanService.requestIsSuccess(res)) {
            this.buildFormShow(res.data);

            this.rootId = res.data.organizationId;
            // Trường hợp đang trạng thái đang soạn thảo thì mới được thêm mới tiêu chí
            if (res.data.status === 1 && this.createPlan) {
              this.tree.isSaveTree = true;
              this.isSaveTree = true;
            } else if (res.data.status === 2 && this.isInsertContentCriteria) {
              this.tree.isSaveTree = false;
              this.isSaveTree = false;
            }

            if (this.createPlan || this.isView) {
              // Xu ly cay don vi
              this.criteriaPlanService.findTreeCriteriaById(res.data.requestResolutionsId)
                .subscribe(nodes => {
                  this.tree.setDataNodes(res.data, nodes);
                  // xu ly focus mac dinh vao cay goc
                  this.tree.selectedNode = this.tree.rootNode;
                  // set node selected for child companent
                });
            } else if (this.isInsertContentCriteria) {
              // Xu ly cay don vi
              this.criteriaPlanService.findCriteriaTreeByCriteriaId(res.data.requestResolutionsId, this.criteriaId)
                .subscribe(nodes => {
                  this.tree.setDataNodes(res.data, nodes);
                  const node = this.findNodeByNodeId(this.criteriaId, nodes, false);
                  // xu ly focus mac dinh vao cay goc
                  this.tree.selectedNode = node;
                  this.editCriteria(node);
                });
            }
          }
        });
    } else {
      this.responseResolutionQuarterYearService.findByCateCriteriaId(this.criteriaId)
        .subscribe(res => {
          if (this.criteriaPlanService.requestIsSuccess(res)) {
            this.buildFormShow(res.data);

            this.rootId = res.data.organizationId;
            // Trường hợp đang trạng thái đang soạn thảo thì mới được thêm mới tiêu chí
            if (res.data.status === 1 && this.createPlan) {
              this.tree.isSaveTree = true;
              this.isSaveTree = true;
            } else if (res.data.status === 2 && this.isInsertContentCriteria) {
              this.tree.isSaveTree = false;
              this.isSaveTree = false;
            }

            if (this.createPlan || this.isView) {
              // Xu ly cay don vi
              this.criteriaPlanService.findTreeCriteriaById(res.data.requestResolutionsId)
                .subscribe(nodes => {
                  this.tree.setDataNodes(res.data, nodes);
                  // xu ly focus mac dinh vao cay goc
                  this.tree.selectedNode = this.tree.rootNode;
                  // set node selected for child companent
                });
            } else if (this.isInsertContentCriteria) {
              // Xu ly cay don vi
              this.criteriaPlanService.findCriteriaTreeByCriteriaId(res.data.requestResolutionsId, this.criteriaId)
                .subscribe(nodes => {
                  this.tree.setDataNodes(res.data, nodes);
                  const node = this.findNodeByNodeId(this.criteriaId, nodes, false);
                  // xu ly focus mac dinh vao cay goc
                  this.tree.selectedNode = node;
                  this.editCriteria(node);
                });
            }
          }
        });
    }

  }

  /**
   * Validate chọn đơn vị thực hiện nghị quyết
   * @param data 
   * @param orgSelect 
   */
  public onChangeOrgDoCriteria(data, orgSelect) {
    if (data.organizationId && data.organizationId === this.rootId) {
      this.app.errorMessage('resolutionQuarterYear.mustNotLikeOrgRequestResolution');
      orgSelect.delete();
    }
  }

  private isChangeParent(curentNode, newNode) {
    if (!curentNode) {
      return false;
    }
    const curentParentId = curentNode.parent ? curentNode.parent.nodeId : this.tree.rootNode.nodeId;
    const newParentId = newNode.orgParentId ? newNode.orgParentId : this.tree.rootNode.nodeId;
    return curentParentId !== newParentId;
  }

  /**
   * Tìm kiếm node cần để select
   * @param nodeId 
   * @param listNode 
   * @param remove 
   */
  private findNodeByNodeId(nodeId: any, listNode, remove: boolean): any {
    const id = Number(nodeId);
    for (let i = 0; i < listNode.length; i++) {
      const node = listNode[i];
      if (node.nodeId === id) {
        if (remove) {
          listNode.splice(i, 1);
        }
        return node;
      } else if (node.children && node.children.length > 0) {
        const find = this.findNodeByNodeId(id, node.children, remove);
        if (find) {
          return find;
        }
      }
    }
  }

  /**
   * Action insert or update
   */
  public processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSaveCriteria)) {
      return;
    }
    this.formSaveCriteria.controls['requestResolutionsId'].setValue(this.requestResolutionsId);
    if (this.isInsertContentCriteria) {
      this.formSaveCriteria.controls['type'].setValue(1);
    }

    this.app.confirmMessage(null, () => { // on accepted
      this.criteriaPlanService.saveOrUpdateFormFile(this.formSaveCriteria.value).subscribe(res => {
        if (this.criteriaPlanService.requestIsSuccess(res)) {
          this.criteriaPlanService.findOne(res.data.cateCriteriaId).subscribe(resp => {
            if (resp.data) {

              this.buildFormCriteria(resp.data);
              if (resp.data.isInputContent || resp.data.isInputContent === 1) {
                this.isChecked = true;
                this.isInputContent = this.translation.translate('resolutionQuarterYear.isInputContentAllow');
              } else {
                this.isChecked = false;
                this.isInputContent = this.translation.translate('resolutionQuarterYear.isInputContentNotAllow');
              }
              this.processCreateCriteriaTree();
            }
          })
        }
      });
    }, () => {
      // on rejected   
    }
    );
  }

  /**
   * Quay lại màn hình ngoài
   * @param item 
   */
  public goBack() {
    if (this.createPlan || this.isView) {
      this.router.navigate(['/party-organization/resolution-quarter-year']);
    } else if (this.isInsertContentCriteria) {
      this.router.navigate(['/party-organization/cate-criteria']);
    }
  }

  /**
   * Hiển thị lịch sử tiêu chí
   */
  public showCriteriaHistory() {
    const modalRef = this.modalService.open(ResolutionCriteriaHistoryComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance.setCateId(this.formSaveCriteria.controls["cateCriteriaId"].value);
  }

  /**
   * Báo cáo nghị quyết quý năm
   */
  public export() {
    this.responseResolutionQuarterYearService.exportFileDocx(this.requestResolutionsId).subscribe(res => {
      saveAs(res, 'Báo_cáo_nghị_quyết_quý_năm.docx');
    })
  }
}
