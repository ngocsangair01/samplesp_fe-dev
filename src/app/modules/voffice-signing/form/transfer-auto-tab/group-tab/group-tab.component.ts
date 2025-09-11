import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS } from '@app/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'group-tab',
  templateUrl: './group-tab.component.html',
})
export class GroupTabComponent extends BaseComponent implements OnInit {
  @Input()
  public disabled: boolean = false;
  activeTab = 1;
  lstFormConfig: FormArray;
  formOrgRelationConfig = {
    groupId: ['', [ValidationService.required]],
    sendMethod: [1],
    groupName: [''],
    groupNote: [''],
    type: [APP_CONSTANTS.TRANSFER_DOCUMENT_TYPE.NHOM]
  };
  SEND_METHOD = APP_CONSTANTS.SEND_METHOD

  @Input()
  private lstData: any[];

  constructor(
    private app: AppComponent
  ) { 
    super(null, "SIGN_DOCUMENT");
  }

  ngOnInit() {
    if(this.lstData) {
      this.lstData = this.lstData.filter(x => x.type == APP_CONSTANTS.TRANSFER_DOCUMENT_TYPE.NHOM);
    }
    this.buildFormSaveConfig(this.lstData);
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

  private buildFormSaveConfig(list?: any) {
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

  public get getLstData() {
    return this.lstFormConfig.value.filter(x => x.groupId);
  }

  /**
   * Set thông tin khi chọn group
   * @param event 
   * @param item 
   */
  onSelectValue(event, item) {
    if(!this.isDuplicate()) {
      item.controls.groupName.setValue(event.name);
      item.controls.groupNote.setValue(event.description);
    } else {
      item.controls.groupId.setValue(null);
      item.controls.groupName.setValue(null);
      item.controls.groupNote.setValue(null);
      this.app.warningMessage('vofficeSign.duplicateGroup');
    }
  }

  /**
   * Hàm lấy id văn bản đã chọn
   */
  get lstSelected() {
    if(this.getLstData) {
      return this.getLstData.map(x => x.groupId)
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
