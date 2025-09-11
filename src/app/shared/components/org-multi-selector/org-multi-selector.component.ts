import { FormControl } from '@angular/forms';
import { Component, OnInit, Input, ViewChildren, AfterViewInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrgMultiSelectorModalComponent } from './org-multi-selector-modal/org-multi-selector-modal.component';
import { DEFAULT_MODAL_OPTIONS } from '@app/core/app-config';
import { OrganizationService } from '@app/core';
import { HrStorage } from '@app/core/services/HrStorage';

@Component({
  selector: 'org-multi-selector',
  templateUrl: './org-multi-selector.component.html',
})
export class OrgMultiSelectorComponent implements OnInit, AfterViewInit, OnChanges {
  @Input()
  public property: FormControl;
  @Input()
  public isRequiredField = false;
  @Input()
  public operationKey: string;
  @Input()
  public adResourceKey: string;
  @Input()
  public rootId: string;
  @Input()
  public filterCondition: string;
  @Output()
  public onChange: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  public disabled = false;
  // Huynq73: Check lay full don vi - khong phan quyen (phuc vu Bao cao dong)
  @Input()
  public checkPermission = true;
  @ViewChildren('displayName')
  public displayName;
  @ViewChildren('buttonChose')
  public buttonChose;
  selectedNodes = [];
  constructor(
        private service: OrganizationService
      , private modalService: NgbModal
  ) {
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
  }
  /**
   * ngAfterViewInit
   */
  ngAfterViewInit() {
    // this.onChangeOrgId();
  }
  /**
   * delete
   */
  delete() {
    this.property.setValue('');
    this.onChangeOrgId();
    this.onChange.emit(event);
  }
  /**
   * onChange orgId then load org name
   */
  public onChangeOrgId() {
    if (!this.property || CommonUtils.isNullOrEmpty(this.property.value)) {
      if (this.displayName) {
        this.displayName.first.nativeElement.value = '';
      }
      return;
    }
    // thuc hien lay ten don vi de hien thi
    this.displayName.first.nativeElement.value = this.property.value;
  }
  /**
   * ngOnChanges
   */
  ngOnChanges() {
    this.onChangeOrgId();
  }
  /**
   * onFocus
   */
  public onFocus() {
    this.buttonChose.first.nativeElement.focus();
    this.buttonChose.first.nativeElement.click();
  }
  /**
   * onChose
   */
  public onChose() {
    const modalRef = this.modalService.open(OrgMultiSelectorModalComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance
    .setInitValue({
      operationKey: this.operationKey
      , adResourceKey: this.adResourceKey
      , filterCondition: this.filterCondition
      , rootId: this.rootId
      , checkPermission: this.checkPermission
    }, this.property.value, this.selectedNodes);

    modalRef.result.then((nodes) => {
      if (!nodes) {
        return;
      }
      this.selectedNodes = nodes;
      this.property.setValue(CommonUtils.joinStringFromArray(nodes, 'organizationId'));
      this.displayName.first.nativeElement.value = CommonUtils.joinStringFromArray(nodes, 'organizationId');
      // callback on chose item
      this.onChange.emit(nodes);
    });
  }

}
