import { Component, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS } from '@app/core';
import { SignDocumentService } from '@app/core/services/sign-document/sign-document.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { DataPickerComponent } from '@app/shared/components/data-picker/data-picker.component';
import { ValidationService } from '@app/shared/services';

@Component({
  selector: 'individual-tab',
  templateUrl: './individual-tab.component.html',
})
export class IndividualTabComponent extends BaseComponent implements OnInit {
  activeTab = 1;
  lstFormConfig: FormArray;
  formOrgRelationConfig = {
    employeeId: ['', [ValidationService.required]],
    sendMethod: [1],
    orgName: [''],
    orgId: [''],
    employeeName: [''],
    type: [APP_CONSTANTS.TRANSFER_DOCUMENT_TYPE.CA_NHAN]
  };
  SEND_METHOD = APP_CONSTANTS.SEND_METHOD

  @Input()
  private lstData: any[];
  @ViewChildren(DataPickerComponent) empTags: QueryList<DataPickerComponent>;

  constructor(
    private app: AppComponent,
    private signDocumentService: SignDocumentService,
  ) { 
    super(null, "SIGN_DOCUMENT");
  }

  ngOnInit() {
    if(this.lstData) {
      this.lstData = this.lstData.filter(x => x.type == APP_CONSTANTS.TRANSFER_DOCUMENT_TYPE.CA_NHAN);
    }
    this.buildFormSaveConfig(this.lstData);
  }

  private makeDefaultFormOrgRelationConfig(): FormGroup {
    const formGroup = this.buildForm({}, this.formOrgRelationConfig);
    return formGroup;
  }

  public addRow(index: number, item: FormGroup) {
    const controls = this.lstFormConfig as FormArray;
    controls.insert(index + 1, this.makeDefaultFormOrgRelationConfig());
  }

  public removeRow(index: number, item: FormGroup) {
    const controls = this.lstFormConfig as FormArray;
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
    return this.lstFormConfig.value.filter(x => x.employeeId);
  }

  public onSelect(event, item, _index) {
    if(!this.isDuplicate()) {
      item.controls.employeeName.setValue(event.nameField);
      this.signDocumentService.findOrgNameByEmployeeId(event.selectField).subscribe(res => {
        if(res.data){
          item.controls.orgName.setValue(res.data.name);
          item.controls.orgId.setValue(res.data.organizationId);
        }
      })
    } else {
      item.controls.employeeId.setValue(null);
      item.controls.orgName.setValue(null);
      item.controls.orgId.setValue(null);
      this.empTags.find((element, index) => index === _index).onChangeDataId();
      this.app.warningMessage('vofficeSign.duplicateIndividual');
    }
   
  }

  /**
   * Hàm lấy id văn bản đã chọn
   */
  get lstSelected() {
    if(this.getLstData) {
      return this.getLstData.map(x => x.employeeId)
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
