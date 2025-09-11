import {Component, EventEmitter, Input, OnChanges, Output, ViewChildren} from '@angular/core';
import {FormArray, FormBuilder} from '@angular/forms';
import {OrganizationService} from '@app/core';
import {DEFAULT_MODAL_OPTIONS} from '@app/core/app-config';

import {CommonUtils} from '@app/shared/services/common-utils.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EmployeeSelectorModalComponent} from './employee-selector-modal/employee-selector-modal.component';
import {CompetitionProgramService} from "@app/core/services/competition-program/competition-program.service";

@Component({
  selector: 'employee-selector',
  templateUrl: './employee-selector.component.html',
  styleUrls: ['./multi-employee-selector.component.scss'],
})
export class EmployeeSelectorComponent implements OnChanges {
  @Input()
  public property: FormArray;

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
  list = [];
  displayList = [];

  constructor(
      private service: CompetitionProgramService
      , private modalService: NgbModal
      , private fb: FormBuilder
  ) {
  }

  /**
   * delete
   */
  delete() {
    this.displayList = [];
    while (this.property.length !== 0) {
      this.property.removeAt(0);
    }
    // this.property.setControl(0, this.fb.array(this.list.map(item => item)));
    // this.property.setValue([{abc: 123}]);
    this.onChange.emit(event);
  }

  /**
   * onChange orgId then load org name
   */
  public onChangeOrgId() {
    // debugger
    // thuc hien lay ten don vi de hien thi
    if (!this.property || this.property.length === 0) {
      return;
    }

    this.list = this.property.value;
    this.displayList = this.property.value[0].subjectSelectionType;
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
  public onFocus(event) {
    // Sửa bug khi vào 1 form thì sẽ tự động autofocus !
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
    const modalRef = this.modalService.open(EmployeeSelectorModalComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance
        .setInitValue({
          operationKey: this.operationKey
          , adResourceKey: this.adResourceKey
          , filterCondition: this.filterCondition
          , rootId: this.rootId
          , checkPermission: this.checkPermission
          , objectType: this.list
        });

    modalRef.result.then((item) => {
      if (!item) {
        return;
      }
      this.list = item;
      this.displayList = item[0].subjectSelectionType;
      this.property = CommonUtils.clearFormArray(this.property);
      item.forEach(element => {
        this.property.push(this.fb.control(element));
      });
      this.onChange.emit(this.property);
    });
  }

  removeTag(id) {
    this.displayList = this.displayList.filter(item => (item !== id))
    this.list[0].subjectSelectionType = this.displayList

    this.property = CommonUtils.clearFormArray(this.property);
    this.list.forEach(element => {
      this.property.push(this.fb.control(element));
    });
    this.onChange.emit(this.property);
  }
}
