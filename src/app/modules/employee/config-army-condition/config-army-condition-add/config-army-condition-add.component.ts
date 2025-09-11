
import { ActivatedRoute } from '@angular/router';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { AppComponent } from '@app/app.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService } from '@app/shared/services/helper.service';
import { ConfigArmyConditionService } from '@app/core/services/employee/config-army-condition.service';
import { EmpArmyProposedService } from '@app/core/services/employee/emp-army-proposed.service';
import { APP_CONSTANTS } from '@app/core';

@Component({
  selector: 'config-army-condition-add',
  templateUrl: './config-army-condition-add.component.html',
  styleUrls: ['./config-army-condition-add.component.css']
})
export class ConfigArmyConditionAddComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  formConfigArmyCondition: FormArray;
  listType: any;
  listDataType: any;
  listGroupType : [] = APP_CONSTANTS.CONFIG_ARMY_CONDITION_GROUP_TYPE;
  type: any;
  isUpdate: boolean = false;
  isInsert: boolean = false;
  isMobileScreen: boolean = false;
  formConfig = {
    type: ['', ValidationService.required],
    configArmyConditionRemove: [null],
    configArmyConditionList: [null],
  }

  formArrayConfig = {
    configArmyConditionId: [''],
    type: [''],
    dataType: ['', ValidationService.required],
    code: ['', ValidationService.required],
    name: ['', ValidationService.required],
    placeholder: [''],
    groupType: [null, ValidationService.required],
    conditionMaxLength : [null, ValidationService.positiveInteger, ValidationService.required],
    isRequired: ['']
  }

  constructor(
    public activeModal: NgbActiveModal,
    private configArmyConditionService: ConfigArmyConditionService,
    private empArmyProposedService: EmpArmyProposedService,
    public actr: ActivatedRoute,
    public app: AppComponent,
    private helperService: HelperService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.configArmyConditionConfig"));
    this.setMainService(configArmyConditionService);
    this.buildForms({});
    this.buildFormsConfigArmyCondition([]);
    this.empArmyProposedService.getListType().subscribe(res => {
      this.listType = res.data;
    });
    this.configArmyConditionService.getDataTypeList().subscribe(res => {
      this.listDataType = res.data;
    })
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
  }

  /**
   * Set form value after pop-up
   * @param data 
   */
  private setFormValue(type) {
    if (type) {
      this.type = type;
      this.formSave.get('type').setValue(type);
      this.configArmyConditionService.findByType(type).subscribe(res => {
        if(res.data) {
          this.buildFormsConfigArmyCondition(res.data);
        }
      });
    }
  }

  // quay lai
  public goBack() {
    this.activeModal.close();
  }

  // them moi or sua
  processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    if (!CommonUtils.isValidForm(this.formConfigArmyCondition)) {
      return;
    }
    this.formConfigArmyCondition.value.forEach(item => {
      item.type = this.formSave.value.type;
    });
    this.formSave.get('configArmyConditionList').setValue(this.formConfigArmyCondition.value);
    this.app.confirmMessage(null, () => { // on accept
      if (!CommonUtils.isValidForm(this.formSave)) {
        return;
      } else {
        this.configArmyConditionService.saveOrUpdate(this.formSave.value)
          .subscribe(res => {
            if (this.configArmyConditionService.requestIsSuccess(res)) {
              this.helperService.reloadHeaderNotification('complete');
              this.activeModal.close(res);
            }
          });
      } () => {

      }
    }, () => {
      // on rejected
    });
  }

  private buildForms(data?: any): void {
    this.formSave = this.buildForm(data, this.formConfig);
  }

  get f() {
    return this.formSave.controls;
  }

  /**
   * buildFormsConfigArmyCondition
   */
   private buildFormsConfigArmyCondition(configArmyConditionList?: any[]) {
    const controls = new FormArray([]);
    if (!configArmyConditionList || configArmyConditionList.length === 0) {
      const group = this.makeDefaultFormConfig();
      controls.push(group);
    } else {
      for (const configArmyCondition of configArmyConditionList) {
        const group = this.makeDefaultFormConfig();
        group.patchValue(configArmyCondition);
        controls.push(group);
      }
    }
    this.formConfigArmyCondition = controls;
  }

  public addConfigArmyCondition(item?) {
    const controls = this.formConfigArmyCondition as FormArray;
    let itemValue = this.makeDefaultFormConfig();
    controls.insert(controls.controls.indexOf(item) + 1, itemValue);
  }

  /**
   * remove formGroup assessment level
   */
  public removeConfigArmyCondition(item) {
    const id = item.get('configArmyConditionId').value;
    if(id) {
      let listId = this.formSave.get('configArmyConditionRemove').value;
      if(!listId) {
        listId = [];
      }
      listId.push(item.get('configArmyConditionId').value);
      this.formSave.get('configArmyConditionRemove').setValue(listId);
    }
    const controls = this.formConfigArmyCondition as FormArray;
    const index = controls.controls.indexOf(item);
    controls.removeAt(index);
    if (controls.length === 0) {
      this.buildFormsConfigArmyCondition(null);
    }
  }

  private makeDefaultFormConfig(): FormGroup {
    const formGroup = this.buildForm({}, this.formArrayConfig);
    return formGroup;
  }
}