import { MassOrganizationService } from './../../../core/services/mass-organization/mass-organization.service';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DEFAULT_MODAL_OPTIONS } from '@app/core/app-config';
import { HrStorage } from '@app/core/services/HrStorage';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MassOrgSelectorModalComponent } from './mass-org-selector-modal/mass-org-selector-modal.component';

@Component({
  selector: 'mass-org-selector',
  templateUrl: './mass-org-selector.component.html',
})
export class MassOrgSelectorComponent implements OnInit, AfterViewInit, OnChanges {
  @Input()
  public property: FormControl;

  @Input()
  public isRequiredField = false;

  @Input()
  public branch : number;

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

  constructor(
        private service: MassOrganizationService
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
      if (this.defaultValue) {
        const market = HrStorage.getSelectedMarket();
        if (!market) {
          return;
        }
        const defaultDomain = market.grantedDomainId;
        if (CommonUtils.isNullOrEmpty(defaultDomain)) {
          return;
        }
        const a = defaultDomain.split(',');
        // thuc hien lay ten don vi de hien thi
        this.service.findOne(a[0])
        .subscribe((res) => {
          const data = res.data;
          if (data) {
            this.displayName.first.nativeElement.value = data.name;
            this.property.setValue(data.organizationId);
          }
        });
      }
      return;
    }
    // thuc hien lay ten don vi de hien thi
    this.service.findOne(this.property.value)
      .subscribe(res => {
        const data = res.data;
        if (data) {
          this.displayName.first.nativeElement.value = data.name;
        }
      });
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
    const modalRef = this.modalService.open(MassOrgSelectorModalComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance
    .setInitValue({
      operationKey: this.operationKey
      , adResourceKey: this.adResourceKey
      , filterCondition: this.filterCondition
      , rootId: this.rootId
      , checkPermission: this.checkPermission
      , branch: this.branch
      , getAllMass: this.getAllMass
    });

    modalRef.result.then((node) => {
      if (!node) {
        return;
      }
      this.property.setValue(node.massOrganizationId);
      this.displayName.first.nativeElement.value = node.name;
      // callback on chose item
      this.onChange.emit(node);
    });
  }

}
