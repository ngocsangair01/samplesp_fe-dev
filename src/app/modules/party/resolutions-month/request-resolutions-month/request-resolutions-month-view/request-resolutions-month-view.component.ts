import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { APP_CONSTANTS, ACTION_FORM } from '@app/core';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { RequestResolutionMonthService } from '@app/core/services/party-organization/request-resolution-month.service';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { PartyTreeSelectorComponent } from '@app/shared/components/party-tree-selector/party-tree-selector.component';

@Component({
  selector: 'request-resolutions-month-view.component',
  templateUrl: './request-resolutions-month-view.component.html'
})
export class RequestResolutionMonthViewComponent extends BaseComponent implements OnInit {
  @ViewChild('orgTree')
  orgTree: PartyTreeSelectorComponent;
  @ViewChild('partyOrgSelector')
  public partyOrgSelector;
  formSave: FormGroup;
  requestResolutionsMonthId: Number;
  formConfig = {
    requestResolutionsMonthId: [''],
    partyOrganizationId: [''],
    requestDate: [''],
    finishDate: [''],
    code: [''],
    name: [''],
    lstNodeCheck: [''],
    description: ['']
  };

  constructor(
    public actr: ActivatedRoute
    , private requestResolutionMonthService: RequestResolutionMonthService
    , private router: Router
    , private app: AppComponent) {
    super(null);
    this.setMainService(requestResolutionMonthService);
    this.buildForms({});
    this.actr.params.subscribe(params => {
      if (params && params.id != null) {
        this.requestResolutionsMonthId = params.id;
      }
    });
  }

  ngOnInit() {
    this.setFormValue(this.requestResolutionsMonthId);
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
    this.router.navigate(['/party-organization/request-resolutions-month']);
  }

  validateBeforeSave() {
    const isValidForm = CommonUtils.isValidForm(this.formSave) && this.checkValidTree();
    return isValidForm;
  }

  public setFormValue(data?: any) {
    if (data && data > 0) {
      this.requestResolutionMonthService.findBeanById(data)
        .subscribe(res => {
          this.formSave = this.buildForm(res.data, this.formConfig, ACTION_FORM.INSERT,
            [ValidationService.notAffter('requestDate', 'finishDate', 'app.requestResolutionMonth.finishDate')]);
          this.orgTree.rootId = this.f.partyOrganizationId.value;
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
    this.orgTree.rootId = this.f.partyOrganizationId.value;
    this.orgTree.selectedNode = [];
    this.orgTree.actionInitAjax();
  }

  public checkValidTree() {
    if (this.orgTree.selectedNode == null || this.orgTree.selectedNode.length == 0) {
      this.app.errorMessage('requestResolutionMonth.notSelectionTree');
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