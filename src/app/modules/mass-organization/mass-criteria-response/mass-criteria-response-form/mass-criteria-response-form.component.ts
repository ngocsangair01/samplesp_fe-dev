import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { MassCriteriaResponseService } from '@app/core/services/mass-organization/mass-criteria-response.service';
import { MassCriteriaService } from '@app/core/services/mass-organization/mass-criteria.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { MassCriteriaTreeComponent } from './../../mass-criteria-tree/mass-criteria-tree.component';

@Component({
  selector: 'mass-criteria-response-form',
  templateUrl: './mass-criteria-response-form.component.html',
  styleUrls: ['./mass-criteria-response-form.component.css']
})
export class MassCriteriaResponseFormComponent extends BaseComponent implements OnInit {

  @ViewChild('tree')
  public tree: MassCriteriaTreeComponent;
  public branch: any;
  public massCriteriaResponseId: number;
  public isHide: any;
  public isView: any;

  formMassRequestInfo: FormGroup;
  formMassRequestConfig = {
    massRequestId: [''],
    massOrganizationId: [''],
    branch: [''],
    signVoffice: [''],
    description: [''],
    massRequestCode: ['', ValidationService.maxLength(100)],
    massRequestName: ['', ValidationService.maxLength(200)],
    finishDate: ['']
  };

  formSaveCriteria: FormGroup;
  formConfigCriteria = {
    massCriteriaId: [''],
    massOrganizationId: [''],
    signDocumentId: [''],
    massCriteriaResponseId: [''],
    criteriaParentName: ['', ValidationService.maxLength(500)],
    criteriaName: ['', ValidationService.maxLength(500)],
    content: ['', [ValidationService.required, ValidationService.maxLength(5000)]],
    status: ['']
  };

  constructor(
    private router: Router,
    private app: AppComponent,
    public actr: ActivatedRoute,
    private criteriaPlanService: MassCriteriaService,
    private massCriteriaResponseService: MassCriteriaResponseService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.massRequestCriteria"));
    this.isHide = false;
    this.formMassRequestInfo = this.buildForm({}, this.formMassRequestConfig);
    this.formSaveCriteria = this.buildForm({}, this.formConfigCriteria);
    // If it is a NavigationEnd event re-initalise the component
    const subPaths = this.router.url.split('/');
    const params = this.actr.snapshot.params;
    if (params && CommonUtils.isValidId(params.massCriteriaResponseId)) {
      this.massCriteriaResponseId = params.massCriteriaResponseId;
      if (subPaths.length >= 2) {
        if (subPaths[2] === 'woman') {
          this.branch = 1;
        }
        if (subPaths[2] === 'youth') {
          this.branch = 2;
        }
        if (subPaths[2] === 'union') {
          this.branch = 3;
        }
        if (subPaths.length >= 4) {
          this.isView = subPaths[4] === 'view';
        }
      }
    }
    this.processCreateCriteriaTree();
  }

  ngOnInit() {
  }

  get f() {
    return this.formMassRequestInfo.controls;
  }

  get fCriteria() {
    return this.formSaveCriteria.controls;
  }

  /**
 * buildFormsInfoRequest
 * @param data 
 */
  public buildFormMassRequestInfo(data?: any) {
    this.formMassRequestInfo = this.buildForm(data, this.formMassRequestConfig);
  }

  /**
   * buildFormsCriteria
   * @param data 
   */
  public buildFormsCriteria(data?: any) {
    this.formSaveCriteria = this.buildForm(data, this.formConfigCriteria);
  }

  /**
   * Xử lý hiển thị cây tiêu chí
   */
  public processCreateCriteriaTree() {
    this.massCriteriaResponseService.findOne(this.massCriteriaResponseId)
      .subscribe(res => {
        if (this.criteriaPlanService.requestIsSuccess(res)) {
          this.buildFormMassRequestInfo(res.data);
          this.formMassRequestInfo.controls['signVoffice'].setValue(String(res.data.signVoffice));
          this.buildFormsCriteria(res.data);
          // Xu ly cay don vi
          this.massCriteriaResponseService.findMassRequestByMassCriteriaResponseId(this.massCriteriaResponseId)
            .subscribe(result => {
              if (this.criteriaPlanService.requestIsSuccess(result)) {
                if (result) {
                  // Tim node goc la thong tin yeu cau
                  this.criteriaPlanService.findMassCriteriaTreeByMassCriteriaId(res.data.massRequestId, res.data.massCriteriaId)
                    .subscribe(nodes => {
                      // Xu ly lay cac node con tieu chi
                      if (nodes) {
                        this.tree.setDataNodes(result.data, nodes);
                        const node = this.findNodeByNodeId(res.data.massCriteriaId, nodes, false);
                        // Xu ly focus mac dinh
                        this.tree.selectedNode = node;
                      }
                    });
                }
              }
            });
        }
      });
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
   * On selected node
   * @param event 
   */
  onSelectMassCriteria(event) {
    if (event && event.nodeId != this.formSaveCriteria.controls['massCriteriaId'].value) {
      this.isHide = true;
    } else {
      this.isHide = false;
    }
  }

  /**
   * Nhập nội dung tiêu chí
   * mass-criteria-response
   */
  processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSaveCriteria)) {
      return;
    }
    this.app.confirmMessage(null,
      () => {
        this.massCriteriaResponseService.saveOrUpdate(this.formSaveCriteria.value).subscribe(
          res => {
            if (this.massCriteriaResponseService.requestIsSuccess(res)) {
              this.goBack();
            }
          }
        );
      }, () => { }
    );
  }

  finishMassCriteria() {
    if (!CommonUtils.isValidForm(this.formSaveCriteria)) {
      return;
    }
    this.app.confirmMessage('massCriteriaResponse.confirmFinish',
      () => {
        this.massCriteriaResponseService.finishMassCriteria(this.formSaveCriteria.value)
          .subscribe(
            res => {
              if (this.massCriteriaResponseService.requestIsSuccess(res)) {
                this.goBack();
              }
            }
          );
      }, () => { }
    );
  }

  goBack() {
    if (this.branch === 1) {
      this.router.navigate(['/mass/woman/mass-criteria-response']);
    } else if (this.branch === 2) {
      this.router.navigate(['/mass/youth/mass-criteria-response']);
    } else if (this.branch === 3) {
      this.router.navigate(['/mass/union/mass-criteria-response']);
    }
  }
}
