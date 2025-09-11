import { DEFAULT_MODAL_OPTIONS } from '@app/core/app-config';
import { Component, OnInit, Input, ViewChildren, AfterViewInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { DataPickerService } from '@app/core';
import {
  ParentTrainingTopicPickerModalComponent
} from "@app/shared/components/parent-traing-topic-picker/parent-training-topic-picker-modal/parent-training-topic-picker-modal.component";


@Component({
  selector: 'parent-training-topic-picker',
  templateUrl: './parent-training-topic-picker.component.html',
})
export class ParentTrainingTopicPickerComponent implements OnInit, AfterViewInit, OnChanges {
  @Input()
  public systemCode: string;
  @Input()
  public property: FormControl;
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
  public mobileNumberField: string;
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
  public isPartyMember: string = 'false';
  @Input() 
  public autoFocus = false;
  @Output()
  public onChange: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  public propertyName: FormControl;
  @Input()
  public type: string = '';

  @ViewChildren('displayName')
  public displayName;
  @ViewChildren('buttonChose')
  public buttonChose;

  constructor(
    private modalService: NgbModal
    , private service: DataPickerService
  ) {
  }

  ngOnInit() {
  }
  /**
   * ngAfterViewInit
   */
  ngAfterViewInit() {
  }
  /**
   * onChange dataId then load data name
   */
  public onChangeDataId() {
    if (CommonUtils.isNullOrEmpty(this.property.value)) {
      if (this.displayName) {
        this.displayName.first.nativeElement.value = '';
      }
      return;
    }
    // thuc hien lay ten don vi de hien thi
    this.service.findByNationId(CommonUtils.getNationId(), this.property.value, {
            operationKey: this.operationKey
          , adResourceKey: this.adResourceKey
          , filterCondition: this.filterCondition
          , objectBO: this.objectBO
          , codeField: this.codeField
          , nameField: this.nameField
          , orderField: this.orderField
          , selectField: this.selectField
        })
        .subscribe((data) => {
          if (data) {
            if (this.isDisplayCode) {
              this.displayName.first.nativeElement.value = data.codeField;
            } else {
              this.displayName.first.nativeElement.value = data.nameField;
            }
          }
        });
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
   * param item
   */
  public onChose() {
    const modalRef = this.modalService.open(ParentTrainingTopicPickerModalComponent, {
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
        , mobileNumberField: this.mobileNumberField
        , orderField: this.orderField
        , selectField: this.selectField
        , nameData: this.nameData
        , systemCode: this.systemCode
        , isSearchByPartyDomainData: this.isSearchByPartyDomainData
        , isNotSearchByOrgDomainData: this.isNotSearchByOrgDomainData
        , isPartyMember: this.isPartyMember
      });
    modalRef.result.then((item) => {
      if (!item) {
        return;
      }
      this.property.setValue(item.selectField);
      // thangdt lay name
      if (this.isDisplayCode) {
        this.displayName.first.nativeElement.value = item.codeField;
        if(this.propertyName){
          this.propertyName.setValue(item.codeField)
        }
       
      } else {
        this.displayName.first.nativeElement.value = item.nameField;
        if(this.propertyName){
          this.propertyName.setValue(item.nameField)
        }
       
      }
      // callback on chose item
      this.onChange.emit(item);
    });
  }
  /**
   * delete
   */
  public delete(event) {
    this.property.setValue('');
    if(this.propertyName){
      this.propertyName.setValue('')
    }
    this.onChangeDataId();
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
}
