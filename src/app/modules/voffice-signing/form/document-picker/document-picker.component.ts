import { Component, OnInit, Input, ViewChildren, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataPickerService } from '@app/core';
import { DocumentPickerModalComponent } from './document-picker-modal/document-picker-modal.component';

@Component({
  selector: 'document-picker',
  templateUrl: './document-picker.component.html'
})
export class DocumentPickerComponent implements OnInit, AfterViewInit {
  @Input()
  public property: FormControl;
  @Input()
  public nameInput: FormControl;
  @Input()
  disabled: boolean = false;
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
    const modalRef = this.modalService.open(DocumentPickerModalComponent, {
      windowClass: 'modal-800',
      backdrop: 'static',
    });
    modalRef.result.then((item) => {
      if (!item) {
        return;
      }
      this.property.setValue(item.documentId);
      // callback on chose item
      this.onChange.emit(item);
    });
  }
}
