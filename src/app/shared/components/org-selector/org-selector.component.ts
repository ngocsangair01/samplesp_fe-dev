import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OrganizationService } from '@app/core';
import { DEFAULT_MODAL_OPTIONS } from '@app/core/app-config';
import { HrStorage } from '@app/core/services/HrStorage';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrgSelectorModalComponent } from './org-selector-modal/org-selector-modal.component';

@Component({
  selector: 'org-selector',
  templateUrl: './org-selector.component.html',
})
export class OrgSelectorComponent implements OnInit, AfterViewInit, OnChanges {
  private defaultValueName: string;
  @Input()
  public property: FormControl;

  @Input()
  public isRequiredField = false;

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

  @ViewChildren('displayName')
  public displayName;
  @ViewChildren('buttonChose')
  public buttonChose;

  constructor(
        private service: OrganizationService
      , private modalService: NgbModal
  ) {
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    if (this.defaultValue) {
      let defaultDomain = HrStorage.getDefaultDomainByCode(CommonUtils.getPermissionCode(this.operationKey)
                                                          ,CommonUtils.getPermissionCode(this.adResourceKey));
      if (CommonUtils.isNullOrEmpty(defaultDomain)) {
        return;
      }
      this.service.findOne(defaultDomain).subscribe(res => {
        // thuc hien lay ten don vi de hien thi
        if (res && res.data) {
            this.defaultValueName = res.data.name;
            if (this.displayName) {
              this.displayName.first.nativeElement.value = this.defaultValueName;
            }
        }
      });
    }
  }
  /**
   * ngAfterViewInit
   */
  ngAfterViewInit() {
  }
  /**
   * delete
   */
  delete() {
    this.property.setValue('');
    this.displayName.first.nativeElement.value = '';
    // this.onChangeOrgId();
    this.onChange.emit(event);
  }
  /**
   * onChange orgId then load org name
   */
  public onChangeOrgId() {
    if (!this.property) {
      return;
    }
    if (CommonUtils.isNullOrEmpty(this.property.value)) {
      if (this.displayName) {
        this.displayName.first.nativeElement.value = '';
      }
      if (this.defaultValue) {
        let defaultDomain = HrStorage.getDefaultDomainByCode(CommonUtils.getPermissionCode(this.operationKey)
                                                            ,CommonUtils.getPermissionCode(this.adResourceKey));
        if (CommonUtils.isNullOrEmpty(defaultDomain)) {
          return;
        }
        this.property.setValue(defaultDomain);
      }
    } else {
      // thuc hien lay ten don vi de hien thi
      this.service.findOne(this.property.value).subscribe(res => {
        // thuc hien lay ten don vi de hien thi
        if (res) {
          const data = res.data;
          if (data) {
            this.displayName.first.nativeElement.value = data.name;
            this.property.setValue(data.organizationId);
          }
        }
      });
    }
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
    // Sửa bug này sẽ tạo thành bug khác => Click vào gõ được :) => Comment this shiet util find other solution
    // if (!event.relatedTarget && !event.sourceCapabilities) {
    //   return;
    // } else {
      this.buttonChose.first.nativeElement.focus();
      this.buttonChose.first.nativeElement.click();
    // }
  }
  /**
   * onChose
   */
  public onChose() {
    const modalRef = this.modalService.open(OrgSelectorModalComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance
    .setInitValue({
      operationKey: this.operationKey
      , adResourceKey: this.adResourceKey
      , filterCondition: this.filterCondition
      , rootId: this.rootId
      , checkPermission: this.checkPermission
    });

    modalRef.result.then((node) => {
      if (!node) {
        return;
      }
      this.property.setValue(node.organizationId);
      this.displayName.first.nativeElement.value = node.name;
      // callback on chose item
      this.onChange.emit(node);
    });
  }

}
