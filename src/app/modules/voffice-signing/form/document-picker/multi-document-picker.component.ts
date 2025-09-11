import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ValidationService } from '@app/shared/services';

@Component({
  selector: 'multi-document-picker',
  templateUrl: './multi-document-picker.component.html',
})
export class MultiDocumentPickerComponent extends BaseComponent implements OnInit {
@Input()
disabled: boolean = false;
activeTab = 1;
  lstFormConfig: FormArray;
  formOrgRelationConfig = {
    documentId: ['', [ValidationService.required]],
    code: [''],
    title: [''],
    signer: [''],
  };

  constructor(
    private app: AppComponent
  ) { 
    super(null, "SIGN_DOCUMENT");
  }

  ngOnInit() {
  }

  private makeDefaultFormOrgRelationConfig(): FormGroup {
    const formGroup = this.buildForm({}, this.formOrgRelationConfig);
    return formGroup;
  }

  public addRow(index: number, item: FormGroup) {
    const controls = this.lstFormConfig;
    controls.insert(index + 1, this.makeDefaultFormOrgRelationConfig());
  }

  public removeRow(index: number, item: FormGroup) {
    const controls = this.lstFormConfig;
    if (controls.length === 1) {
      this.buildFormSaveConfig();
      const group = this.makeDefaultFormOrgRelationConfig();
      controls.push(group);
      this.lstFormConfig = controls;
    }
    controls.removeAt(index);
  }

  public buildFormSaveConfig(list?: any) {
    if (!list || list.length == 0) {
      this.lstFormConfig = new FormArray([this.makeDefaultFormOrgRelationConfig()]);
    } else {
      const controls = new FormArray([]);
      for (const i in list) {
        const formTableConfig = list[i];
        const group = this.makeDefaultFormOrgRelationConfig();
        group.patchValue(formTableConfig);
        controls.push(group);
      }
      this.lstFormConfig = controls;
    }
  }

  /**
   * Lấy tên document hiển thị;
   * @param item
   */
  getNameDocument(item) {
    if(!item.controls.signer.value) {
      return item.controls.code.value;
    }
    return item.controls.code.value + ' (' + item.controls.signer.value + ')';
  }

  /**
   * Set tên khi chọn đối tượng
   * @param event 
   * @param item 
   */
  onChose(event, item) {
    const isDup = this.isDuplicate();
    if(!isDup){
      item.controls.code.setValue(event.code);
      item.controls.title.setValue(event.title);
      item.controls.signer.setValue(event.signer);
    } else {
      this.app.warningMessage('vofficeSign.duplicateDocument');
      item.controls.documentId.setValue(null);
      item.controls.title.setValue('');
      item.controls.code.setValue('');
      item.controls.signer.setValue('');
    }
  }

  /**
   * Lấy dữ liệu văn bản đã chọn
   */
  public getAllData() {
    return this.lstFormConfig.value.filter(x => x.documentId);
  }

  /**
   * Hàm lấy id văn bản đã chọn
   */
  get lstSelected() {
    if(this.getAllData()) {
      return this.getAllData().map(x => x.documentId)
    }
    return [];
  }

  /**
   * Kiểm tra chọn trùng
   * @param item 
   */
  isDuplicate() {
    if(this.lstSelected) {
      const findDuplicates = this.lstSelected.filter((value, index) => {return this.lstSelected.indexOf(value) != index})
      return findDuplicates.length > 0
    }
    return false;
  }
}
