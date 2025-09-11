import { Component, EventEmitter, Input, OnChanges, Output, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { DataPickerService } from '@app/core';
import { CommonUtils } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MultiDataPickerModalComponent } from './multi-data-picker-modal/multi-data-picker-modal.component';

@Component({
  selector: 'multi-data-picker',
  templateUrl: './multi-data-picker.component.html',
  styleUrls: ['./multi-data-picker.component.scss'],
})
export class MultiDataPickerComponent implements OnChanges {
  @Input()
  public systemCode: string;
  @Input()
  public property: FormArray;
  @Input()
  public isRequiredField = false;
  @Input()
  public operationKey: string;
  @Input()
  public adResourceKey: string;
  @Input()
  public objectBO: string;
  @Input()
  public codeField: string;
  @Input()
  public nameField: string;
  @Input()
  public emailField: string;
  @Input()
  public orderField: string;
  @Input()
  public selectField: string;
  @Input()
  public filterCondition: string;
  @Input()
  public isDisplayCode: false;
  @Input()
  public nameData: string;
  @Input()
  public disabled = false;
  @Input()
  public isSearchByPartyDomainData: string;
  @Input()
  public isNotSearchByOrgDomainData: string;
  @Input()
  public autoFocus = false;
  @Output()
  public onChange: EventEmitter<any> = new EventEmitter<any>();

  public list = [];
  @ViewChildren('displayName')
  public displayName;
  @ViewChildren('buttonChose')
  public buttonChose;

  constructor(
    private modalService: NgbModal,
    private service: DataPickerService,
    private fb: FormBuilder
  ) {
  }

  /**
   * onChange dataId then load data name
   */
  public onChangeDataId() {
    if (!this.property || this.property.length === 0) {
      this.list = [];
      return;
    }

    // thuc hien lay ten don vi de hien thi
    this.service.findByListId({
      operationKey: this.operationKey
      , adResourceKey: this.adResourceKey
      , filterCondition: this.filterCondition
      , objectBO: this.objectBO
      , codeField: this.codeField
      , nameField: this.nameField
      , orderField: this.orderField
      , selectField: this.selectField
    }, this.property.value).subscribe((data) => {
      if (data) {
        this.list = data;
      }
    });
  }
  /**
   * onChose
   * param item
   */
  public onChose() {
    const modalRef = this.modalService.open(MultiDataPickerModalComponent, {
      backdrop: 'static',
    });
    modalRef
      .componentInstance
      .setInitValue({
        operationKey: this.operationKey
        , adResourceKey: this.adResourceKey
        , filterCondition: this.filterCondition
        , objectBO: this.objectBO
        , codeField: this.codeField
        , nameField: this.nameField
        , emailField: this.emailField
        , orderField: this.orderField
        , selectField: this.selectField
        , nameData: this.nameData
        , systemCode: this.systemCode
        , isSearchByPartyDomainData: this.isSearchByPartyDomainData
        , isNotSearchByOrgDomainData: this.isNotSearchByOrgDomainData
        , list: this.list
      });
    modalRef.result.then((item) => {
      this.list = item;
      this.property = CommonUtils.clearFormArray(this.property);
      item.map(x => x.selectField).forEach(element => {
        this.property.push(this.fb.control(element));
      });
      this.onChange.emit(item);
    });
  }
  /**
   * delete
   */
  public delete(event) {
    this.list = [];
    while (this.property.length !== 0) {
      this.property.removeAt(0);
    }
    this.onChange.emit(event);
  }
  /**
   * ngOnChanges
   */
  ngOnChanges() {
    if (this.systemCode) {
      this.service.setSystemCode(this.systemCode);
    }
    this.onChangeDataId();
  }

  removeTag(id) {
    this.list = this.list.filter(item => (item.selectField !== id))
    this.property = CommonUtils.clearFormArray(this.property);
    this.list.forEach(element => {
      this.property.push(this.fb.control(element.selectField));
    });
    this.onChange.emit(this.list);
  }

}
