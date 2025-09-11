import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { OrgTreeSelectorComponent } from '../../org-tree-selector/org-tree-selector.component';
import { RequestDemocraticMeetingService } from '@app/core/services/population/request-democratic-meeting.service';

@Component({
  selector: 'request-democratic-meeting-view',
  templateUrl: './request-democratic-meeting-view.component.html',
  styleUrls: ['./request-democratic-meeting-view.component.css']
})
export class RequestDemocraticMeetingViewComponent extends BaseComponent implements OnInit {
  @ViewChild('orgTree')
  orgTree: OrgTreeSelectorComponent;
  @ViewChild('partyOrgSelector')
  public partyOrgSelector;
  formSave: FormGroup;
  requestDemocraticMeetingId: Number;
  formConfig = {
    requestDemocraticMeetingId: [''],
    organizationId: ['', [Validators.required]],
    requestDate: ['', [Validators.required]],
    finishDate: ['', [ValidationService.afterCurrentDate, ValidationService.required]],
    code: ['', [Validators.required, Validators.maxLength(50)]],
    name: ['', [Validators.required, Validators.maxLength(200)]],
    lstNodeCheck: ['', [Validators.required]],
    description: ['']
  };

  constructor(
    public actr: ActivatedRoute
    , private requestDemocraticMeetingService: RequestDemocraticMeetingService
    , private router: Router
    , private app: AppComponent
  ) {
    super(null);
    this.setMainService(requestDemocraticMeetingService);
    this.buildForms({});
    this.actr.params.subscribe(params => {
      if (params && params.id != null) {
        this.requestDemocraticMeetingId = params.id;
      }
    });
  }

  ngOnInit() {
    this.setFormValue(this.requestDemocraticMeetingId);
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
    this.router.navigate(['/population/request-democratic-meeting']);
  }

  processSaveOrUpdate() {
    this.f.lstNodeCheck.setValue(this.getListTree());
    if (!this.validateBeforeSave()) {
      return;
    }
    const formInput = this.formSave.value;
    this.app.confirmMessage('', () => {// on accept
      this.requestDemocraticMeetingService.saveOrUpdateFormFile(formInput)
        .subscribe(res => {
          if (this.requestDemocraticMeetingService.requestIsSuccess(res)) {
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
      this.requestDemocraticMeetingService.findBeanById(data)
        .subscribe(res => {
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
          //
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
      this.app.errorMessage('requestResolutionMonth.onlyParent');
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
  onChangeUnit(event, partyOrgSelector) {
    if (event && (event.type === APP_CONSTANTS.PARTY_ORG_TYPE.CBCS || event.type === APP_CONSTANTS.PARTY_ORG_TYPE.CBTT)) {
      this.app.errorMessage('partyOrgnization.leafPartyOrg');
      partyOrgSelector.delete();
    }
    this.loadTree();
  }
}