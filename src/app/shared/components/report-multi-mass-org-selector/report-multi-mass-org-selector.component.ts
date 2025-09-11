import { MassOrganizationService } from './../../../core/services/mass-organization/mass-organization.service';
import { Component, EventEmitter, Input, OnChanges, Output, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { DEFAULT_MODAL_OPTIONS } from '@app/core/app-config';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportMultiMassOrgSelectorModalComponent } from './report-multi-mass-org-selector-modal/report-multi-mass-org-selector-modal.component';

@Component({
  selector: 'report-multi-mass-org-selector',
  templateUrl: './report-multi-mass-org-selector.component.html',
  styleUrls: ['./report-multi-mass-org-selector.component.scss'],
})
export class ReportMultiMassOrgSelectorComponent implements OnChanges {
  @Input()
  public property: FormArray;

  @Input()
  public isRequiredField = false;

  @Input()
  public branch : number;
  branchOld: number

  @Input()
  public operationKey: string;

  @Input()
  public adResourceKey: string;

  @Input()
  public defaultValue: boolean;

  @Input()
  public rootId: string;

  @Input()
  public filterCondition: string;

  @Output()
  public onChange: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  public disabled = false;

  @Input() 
  public autoFocus = false;
  // Huynq73: Check lay full don vi - khong phan quyen (phuc vu Bao cao dong)
  @Input()
  public checkPermission = true;

  @Input()
  public getAllMass = false;

  @ViewChildren('displayName')
  public displayName;
  @ViewChildren('buttonChose')
  public buttonChose;
  list = [];
  constructor(
        private service: MassOrganizationService
      , private modalService: NgbModal
      , private fb: FormBuilder
  ) {
  }

  /**
   * delete
   */
  delete() {
    this.list = []
    while (this.property.length !== 0) {
      this.property.removeAt(0);
    }
    this.onChange.emit(event);
  }
  /**
   * onChange orgId then load org name
   */
  public onChangeOrgId() {
    // thuc hien lay ten don vi de hien thi
    if (!this.property || this.property.length === 0) {
      return;
    }

    let list = [];

    for (const iterator of this.property.value) {
      this.service.findOne(iterator)
        .subscribe((res) => {
          const data = res.data;
          list.push({ massOrganizationId: data.massOrganizationId, code: data.code, name: data.name, check: true, nodeId: data.massOrganizationId });
        });
    }
    this.list = list;
  }
  /**
   * ngOnChanges
   */
  ngOnChanges() {
    this.onChangeOrgId();
  }
  ngDoCheck() {
    this.branchOld = this.branchOld ? this.branchOld : this.branch
    if(this.branch != this.branchOld) {
      this.property = CommonUtils.clearFormArray(this.property);
      this.list = []
      this.branchOld = this.branch
    }
  }
  /**
   * onFocus
   */
  public onFocus(event) {
    // Sửa bug khi vào 1 form thì sẽ tự động autofocus !
    // Sửa bug này sẽ tạo thành bug khác => Click vào gõ được :) => Comment this shiet util find other solution
    if (!event.relatedTarget && !event.sourceCapabilities) {
      return;
    } else {
      this.buttonChose.first.nativeElement.focus();
      this.buttonChose.first.nativeElement.click();
    }
  }
  /**
   * onChose
   */
  public onChose() {
    const modalRef = this.modalService.open(ReportMultiMassOrgSelectorModalComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance
    .setInitValue({
      operationKey: this.operationKey
      , adResourceKey: this.adResourceKey
      , filterCondition: this.filterCondition
      , rootId: this.rootId
      , checkPermission: this.checkPermission
      , list: this.list
      , branch: this.branch
      , getAllMass: this.getAllMass
    });

    modalRef.result.then((item) => {
      if (!item) {
        return;
      }
      this.list = item;
      this.property = CommonUtils.clearFormArray(this.property);
      item.map(x => x.massOrganizationId).forEach(element => {
        this.property.push(this.fb.control(element));
      });
      this.onChange.emit(item);
    });
  }

  removeTag(id) {
    this.list = this.list.filter(item => (item.massOrganizationId !== id))
    this.property = CommonUtils.clearFormArray(this.property);
    this.list.forEach(element => {
      this.property.push(this.fb.control(element.massOrganizationId));
    });
    this.onChange.emit(this.list);
  }

  public removeAll() {
    this.list = []
  }
}
