import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { FileControl } from '@app/core/models/file.control';
import { RequestPolicyProgramService } from '@app/core/services/policy-program/request-democratic-meeting.service';
import { RequestDemocraticMeetingService } from '@app/core/services/population/request-democratic-meeting.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { PolicyOrgTreeSelectorComponent } from '../../policy-org-tree-selector/policy-org-tree-selector.component';

@Component({
  selector: 'request-policy-program-form',
  templateUrl: './request-policy-program-form.component.html',
})
export class RequestPolicyProgramFormComponent extends BaseComponent implements OnInit {
  isInsert: boolean = false;
  isEdit: boolean = false;
  isView: boolean = false;
  policyProgramTypeList: [];
  @ViewChild('orgTree')
  orgTree: PolicyOrgTreeSelectorComponent;
  @ViewChild('orgSelector')
  public orgSelector;
  formSave: FormGroup;
  requestPolicyProgramId: Number;
  formConfig = {
    requestPolicyProgramId: [''],
    organizationId: ['', [Validators.required]],
    requestDate: ['', [Validators.required]],
    policyProgramType: ['', [ValidationService.required]],
    finishDate: ['', [ValidationService.afterCurrentDate, ValidationService.required]],
    code: ['', [Validators.required, Validators.maxLength(50)]],
    name: ['', [Validators.required, Validators.maxLength(200)]],
    lstNodeCheck: ['', [Validators.required]],
    description: [null, ValidationService.maxLength(1000)]
  };

  constructor(
    public actr: ActivatedRoute
    , private requestPolicyProgramService: RequestPolicyProgramService
    , private requestDemocaticMeetingService: RequestDemocraticMeetingService
    , private router: Router
    , private app: AppComponent
    , private categoryService: CategoryService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.requestDemocraticMeeting"));
    this.setMainService(requestPolicyProgramService);
    this.buildForms({});
    this.actr.params.subscribe(params => {
      if (params && params.id != null) {
        this.requestPolicyProgramId = params.id;
      }
    });
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.LOAI_CHINH_SACH).subscribe(res => {
      this.policyProgramTypeList = res.data;
    });
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 2) {
      this.isInsert = subPaths[2] === 'request-policy-program-add';
      this.isEdit = subPaths[2] === 'request-policy-program-edit';
      if (subPaths[2] === 'request-policy-program-view') {
        this.isView = true;
      }
    }
    this.setFormValue(this.requestPolicyProgramId);
  }

  get f() {
    return this.formSave.controls;
  }

  getListTree() {
    const lstNodeCheck: Array<Number> = [];
    this.orgTree.selectedNode.forEach(element => {
      lstNodeCheck.push(parseInt(element.data));
    });
    return lstNodeCheck;
  }

  goBack() {
    this.router.navigate(['/policy-program/request-policy-program']);
  }

  processSaveOrUpdate() {
    this.f.lstNodeCheck.setValue(this.getListTree());
    if (!this.validateBeforeSave()) {
      return;
    }
    const formInput = this.formSave.value;
    this.app.confirmMessage('', () => {// on accept
      this.requestPolicyProgramService.saveOrUpdateFormFile(formInput)
        .subscribe(res => {
          if (this.requestPolicyProgramService.requestIsSuccess(res)) {
            this.goBack();
          }
        });
    }, () => {// on rejected

    });
  }


  validateBeforeSave() {
    const isValidForm = CommonUtils.isValidForm(this.formSave) && this.checkValidTree();
    return isValidForm;
  }

  public setFormValue(data?: any) {
    if (data && data > 0) {
      this.requestPolicyProgramService.findBeanById(data)
        .subscribe(res => {
          if (this.requestPolicyProgramService.requestIsSuccess(res)) {
            this.formSave = this.buildForm(res.data, this.formConfig, ACTION_FORM.INSERT,
              [ValidationService.notAffter('requestDate', 'finishDate', 'app.requestResolutionMonth.finishDate')]);
            this.orgTree.rootId = this.f.organizationId.value;
            this.orgTree.actionInitAjax();
            // set gia trị file
            const attachFileControl = new FileControl(null);
            if (res.data && res.data.fileAttachment && res.data.fileAttachment.attachFile) {
              attachFileControl.setFileAttachment(res.data.fileAttachment.attachFile);
            }
            this.formSave.addControl('attachFile', attachFileControl);
          }
        })
    } else {
      this.formSave = this.buildForm({}, this.formConfig, ACTION_FORM.INSERT,
        [ValidationService.notAffter('requestDate', 'finishDate', 'app.requestResolutionMonth.finishDate')]);
      const attachFileControl = new FileControl(null);
      this.formSave.addControl('attachFile', attachFileControl);
    }
  }

  public loadTree() {
    this.orgTree.rootId = this.f.organizationId.value;
    this.orgTree.selectedNode = [];
    this.orgTree.actionInitAjax();
  }

  // kiem tra chon duy nhat to chuc root
  public checkValidTree() {
    if (this.orgTree.selectedNode != null && this.orgTree.selectedNode.length == 1 && this.orgTree.selectedNode[0].parent == null) {
      this.app.errorMessage('democraticMeeting.onlyParent');
      return false;
    }
    return true;
  }

  buildForms(data?) {
    this.formSave = this.buildForm({}, this.formConfig, ACTION_FORM.INSERT,
      [ValidationService.notAffter('requestDate', 'finishDate', 'app.requestResolutionMonth.requestedDate')]);
    const attachFileControl = new FileControl(null);
    if (data && data.fileAttachment && data.fileAttachment.attachFile) {
      attachFileControl.setFileAttachment(data.fileAttachment.attachFile);
    }
    this.formSave.addControl('attachFile', attachFileControl);
  }

  /**
   * onChangeUnit
   */
  onChangeUnit(event, orgSelector) {
    if (event.organizationId > 0) {
      this.requestDemocaticMeetingService.checkOrgLeaf({ organizationId: event.organizationId }).subscribe(res => {
        if (res.type === 'SUCCESS') {
          this.loadTree();
        } else {
          orgSelector.delete();
        }
      });
    }
  }
}