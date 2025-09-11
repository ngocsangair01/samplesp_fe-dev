import { Component, OnInit, Input, ViewChildren, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataPickerService } from '@app/core';
import { GroupPickerModalComponent } from './group-picker-modal/group-picker-modal.component';

@Component({
  selector: 'group-picker',
  templateUrl: './group-picker.component.html',
})
export class GroupPickerComponent implements OnInit, AfterViewInit {
  @Input()
  public disabled: boolean = false;
  @Input()
  public property: FormControl;
  @Input()
  public nameInput: FormControl;
  @Output()
  public onChange: EventEmitter<any> = new EventEmitter<any>();
  @ViewChildren('buttonChose')
  public buttonChose;

  constructor(
    private modalService: NgbModal
    , private service: DataPickerService
  ) {
  }

  ngOnInit() {
  }

  innitData() {
  }

   /**
   * onFocus
   */
  public onFocus() {
    this.buttonChose.first.nativeElement.focus();
    this.buttonChose.first.nativeElement.click();
  }

  /**
   * ngAfterViewInit
   */
  ngAfterViewInit() {
  }

  /**
   * onChose
   * param item
   */
  public onChose() {
    const modalRef = this.modalService.open(GroupPickerModalComponent, {
      backdrop: 'static',
    });
    modalRef.result.then((item) => {
      if (!item) {
        return;
      }
      this.property.setValue(item.groupId);
      // callback on chose item
      this.onChange.emit(item);
    });
  }
}
