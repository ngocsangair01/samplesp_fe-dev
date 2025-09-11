import { Component, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS } from '@app/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { OrgSelectorComponent } from '@app/shared/components/org-selector/org-selector.component';
import { ValidationService } from '@app/shared/services';

@Component({
  selector: 'organization-tab',
  templateUrl: './organization-tab.component.html',
})
export class OrganizationTabComponent extends BaseComponent implements OnInit {
activeTab = 1;
  lstFormConfig: FormArray;
  formOrgRelationConfig = {
    organizationId: ['', [ValidationService.required]],
    sendMethod: [1],
    organizationName: [''],
    type: [APP_CONSTANTS.TRANSFER_DOCUMENT_TYPE.TO_CHUC],
  };
  SEND_METHOD = APP_CONSTANTS.SEND_METHOD
  @ViewChildren(OrgSelectorComponent) orgTags: QueryList<OrgSelectorComponent>;

  @Input()
  private lstData: any[];

  constructor(
    private app: AppComponent
  ) { 
    super(null, "SIGN_DOCUMENT");
  }

  ngOnInit() {
    if(this.lstData) {
      this.lstData = this.lstData.filter(x => x.type == APP_CONSTANTS.TRANSFER_DOCUMENT_TYPE.TO_CHUC);
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

  /**
   * Set tên khi chọn đối tượng
   * @param event 
   * @param item 
   */
  onChaneOrganization(event, item, _index) {
    if(!this.isDuplicate()){
      item.controls.organizationName.setValue(event.name);
    } else {
      item.controls.organizationId.setValue('');
      this.orgTags.find((element, index) => index === _index).onChangeOrgId();
      this.app.warningMessage('vofficeSign.duplicateOrg');
    }
  }

  public get getLstData() {
    return this.lstFormConfig.value.filter(x => x.organizationId);
  }

  /**
   * Hàm lấy id văn bản đã chọn
   */
  get lstSelected() {
    if(this.getLstData) {
      return this.getLstData.map(x => x.organizationId)
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
