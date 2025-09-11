import { FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, HostListener, EventEmitter, Output, ViewChild } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { TranslationService } from 'angular-l10n';
import { Router, ActivatedRoute } from '@angular/router';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS } from '@app/core/app-config';
import { DocumentService } from '@app/core/services/document/document.service';
import { DocumentTypesService } from '@app/core/services/document-types/document-types.service';
import { ValidationService } from '@app/shared/services/validation.service';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { EmployeeInfoService, OrganizationService } from '@app/core';
import { TreeViewComponent } from './tree-view/tree-view.component';
@Component({
  selector: 'organization-chart',
  templateUrl: './organization-chart.component.html',
})
export class OrganizationChartComponent extends BaseComponent implements OnInit {
  @ViewChild('treeView')
  treeView: TreeViewComponent;

  organizationId: any;
  listExpiredType: Array<Object> = APP_CONSTANTS.ORG_EXPIRED_TYPE;
  listRelationType: Array<Object> = APP_CONSTANTS.ORG_RELATION_TYPE;
  orgInfo = {
    organizationId: '',
    code: '',
    name: '',
    shortName: '',
    orgManager: '',
    orgParent: '',
    lineUnit: '',
    decisionNumber: '',
    decisionSigner: '',
    decisionDate: '',
    totalBoundary: '',
    effectiveDate: '',
    expiredDate: '',
    address: '',
    phoneNumber: '',
    description: '',
  };
  // Animation Variable
  paneDragging = false;
  paneTransform;
  zoom = 1;
  paneX = 0;
  paneY = 0;

  constructor(
    // public activeModal: NgbActiveModal,
    private empService: EmployeeInfoService,
    private orgService: OrganizationService,
    private sanitizer: DomSanitizer
    ) {
      super();
      this.buildOrgInfo({});
  }

  
  ngOnInit() {
        // Get parent org if orgParentId is not null
        if (this.organizationId) {
          this.orgService.findOne(this.organizationId)
          .subscribe(result => {
            if (this.orgService.requestIsSuccess(result)) {
              this.orgInfo.orgParent = result.data.name;
            }
          });
        }
  }

  public buildOrgInfo(data: any) {
    this.orgInfo.organizationId = data.organizationId;
    this.orgInfo.code = data.code;
    this.orgInfo.name = data.name;
    this.orgInfo.shortName = data.shortName;
    this.orgInfo.decisionNumber = data.decisionNumber;
    this.orgInfo.decisionSigner = data.decisionSigner;
    this.orgInfo.decisionDate = data.decisionDate;
    this.orgInfo.effectiveDate = data.effectiveDate;
    this.orgInfo.expiredDate = data.expiredDate;
    this.orgInfo.address = data.address;
    this.orgInfo.phoneNumber = data.phoneNumber;
    this.orgInfo.description = data.description;
  }

  // Host Listener for Browser
  @HostListener('mousewheel', ['$event']) onMouseWheelChrome(event: any) {
    this.onmousewheel(event);
  }

  @HostListener('DOMMouseScroll', ['$event']) onMouseWheelFirefox(event: any) {
    this.onmousewheel(event);
  }

  @HostListener('onmousewheel', ['$event']) onMouseWheelIE(event: any) {
    this.onmousewheel(event);
  }

  // Animation Function
  public onmousewheel(event) {
    let delta;
    event.preventDefault();
    delta = event.detail || event.wheelDelta;
    this.zoom += delta / 1000 / 2;
    this.zoom = Math.min(Math.max(this.zoom, 0.2), 3);
    this.makeTransform();
  }

  public onmousemove(event) {
    if (this.paneDragging) {
        const {movementX, movementY} = event;
        this.paneX += movementX;
        this.paneY += movementY;
        this.makeTransform();
    }
  }

  public onmouseup(event) {
    this.paneDragging = false;
  }

  public preventMouse(event) {
    event.stopPropagation();
  }

  public onmousedown(event) {
    this.paneDragging = true;
  }

  public makeTransform() {
    this.paneTransform = this.sanitizer.bypassSecurityTrustStyle(`translate(${this.paneX}px, ${this.paneY}px) scale(${this.zoom})`);
  }
  
  public LoadRoot(orgParentId){
    this.treeView.loadRootTree(orgParentId);
  }
}
