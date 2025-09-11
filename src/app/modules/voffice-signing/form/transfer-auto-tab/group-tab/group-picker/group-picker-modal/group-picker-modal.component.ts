import { Component, Input, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SignDocumentService } from '@app/core/services/sign-document/sign-document.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'group-picker-modal',
  templateUrl: './group-picker-modal.component.html',
})
export class GroupPickerModalComponent {
  form: FormGroup;
  resultList: any = [];
  placeholder: string;
  LIMIT = 10;
  START_RECORD = 0;
  isLoading = false;
  formSearch: any = {
    groupType: [-1],
    cvGroup: ["1"],
    cvGroupPublic: ["1"],
    cvGroupPrivate: ["1"],
    startRecord: [this.START_RECORD],
    pageSize: [this.LIMIT],
    keyword: [""]
  };
  constructor(
    private service: SignDocumentService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal) {
    this.buildForm();
    this.processSearch();
  }
  
  ngOnInit() {
    window.addEventListener('scroll', this.scroll, true);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }

  scroll = (event): void => {
    const scrollTop = ~~(event.srcElement.scrollTop / 1)
    if(!this.isLoading && event.srcElement.scrollHeight - scrollTop == event.srcElement.clientHeight){
      this.onPaging();
    }
  };
  
  /**
   * buildForm
   */
  private buildForm(): void {
    this.form = this.formBuilder.group(this.formSearch);
  }

  /**
   * Hàm tìm kiếm khi phân trang
   * @param $envent 
   */
  onPaging() {
    const startRecord = this.form.controls.startRecord.value;
    this.form.controls.startRecord.setValue(startRecord + this.LIMIT);
    // Gọi api tìm kiếm
    this.processSearch();
  }

  /**
   * Reset phân trang khi tìm kiếm lại
   */
  resetPaging() {
    this.resultList = [];
    document.getElementsByClassName("ui-table-scrollable-body")[0].scrollTop = 0
    this.form.controls.startRecord.setValue(this.START_RECORD);
    this.form.controls.pageSize.setValue(this.LIMIT);
  }

  /**
   * Tìm kiếm khi nhập key word
   */
  onSearchKeyword() {
    this.resetPaging();
    // Gọi api tìm kiếm
    this.processSearch();
  }

  /**
   * hàm tìm kiém
   */
  public processSearch() {
    this.isLoading = true;
    this.service.getDocumentReceiverVoffice(this.form.value).subscribe(res => {
      this.isLoading = false;
      if(res.data) {
        const lstData = JSON.parse(res.data);
        this.resultList = this.resultList.concat(lstData);
      }
    });
  }

  /**
   * @ param item
   */
  public chose(item) {
    this.activeModal.close(item);
  }
}
