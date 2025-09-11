import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { APP_CONSTANTS, ACTION_FORM } from '@app/core/app-config';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '@app/app.component';
import { StaffAssessmentCriteriaService } from '@app/core/services/employee/staff-assessment-criteria.service';
import { SettingIconService } from '@app/core/services/setting/setting-icon.service';
import { ASSESSMENT_FIELD_TYPE } from '../../assessment/assessment-interface';

@Component({
  selector: 'staff-assessment-criteria-form',
  templateUrl: './staff-assessment-criteria-form.component.html',
  styleUrls: ['./staff-assessment-criteria-form.component.css']
})
export class StaffAssessmentCriteriaFormComponent extends BaseComponent implements OnInit {

  formSave: FormGroup;
  formFromTo: FormGroup;
  isEditMode: boolean = false;
  isView: boolean = false;
  fieldTypeList = APP_CONSTANTS.FIELD_TYPE_LIST
  assessmentFieldType = ASSESSMENT_FIELD_TYPE
  settingIconList: any;
  formCombobox: FormArray;
  formSpinner: FormArray;
  assessmentCriteriaGroupId: number;
  spinnerDisable: boolean = true;
  spinnerMax: number = 10;
  spinnerMin: number = 0;
  spinnerStep: number = 1;
  disabledStar: boolean = true;
  cancelStar: boolean = true;
  stars: number = 0;
  assessmentCriteriaId: number;
  isFromGroupSearch: boolean = false;
  formConfig = {
    assessmentCriteriaId: [''],
    assessmentCriteriaGroupId: ['',[ValidationService.required]],
    assessmentCriteriaCode: ['',[ValidationService.required, ValidationService.maxLength(50)]],
    assessmentCriteriaName: ['',[ValidationService.required, ValidationService.maxLength(500)]],
    assessmentCriteriaGroupCode: [''],
    note: [''],
    fieldType: ['',[ValidationService.required]],
    fieldItems: [''],
    settingIconId: [''],
    fieldDefaultValue: [''],
    fieldPlaceholderValue: [''],
    fieldSqlValue: ['', [ValidationService.maxLength(2000)]],
    assessmentCriteriaExplain: [''],
    maxLength: ['', [ValidationService.positiveInteger]],
    assessmentMinValue: ['', [ValidationService.positiveInteger]],
    assessmentMaxValue: ['', [ValidationService.positiveInteger]],
    step: ['', [ValidationService.positiveInteger]],
    scoringGuide: [''],
    assessmentCriteriaRanks: [''],
    assessmentCriteriaRows: [''],
    isKey: ['']
  }
  formComboboxConfig = {
    isFieldDefaultValue: [''],
    label: ['',[ValidationService.required]],
    value: ['',[ValidationService.required, ValidationService.positiveInteger]],
  }
  formSpinnerConfig = {
    assessmentCriteriaRankName: ['',[ValidationService.required]],
    startValue: ['',[ValidationService.required, ValidationService.positiveInteger]],
    endValue: ['',[ValidationService.required, ValidationService.positiveInteger]],
    colorPicker: ['#000000']
  }
  formFromToConfig = {
    from: [''],
    to: ['']
  }
  constructor(
    public activeModal: NgbActiveModal,
    private app: AppComponent,
    private staffAssessmentCriteriaService: StaffAssessmentCriteriaService,
    private settingIconService: SettingIconService 
  ) { 
    super(null, 'ASSESSMENT_CRITERIA');
    this.buildForms({});
    this.formSave = this.buildForm({}, this.formConfig);
    this.formFromTo = this.buildForm({}, this.formFromToConfig);
    this.buildFormFromTo({});
    this.buildFormCombobox(null);
    this.buildFormSpinner(null);
    this.settingIconService.findSettingIconListByIconType("ASSESSMENT_CRITERIA_ICON").subscribe(res => {
      this.settingIconList = res.data;
    });
  }
  
  private makeDefaultComboboxForm(): FormGroup {
    const formGroup = this.buildForm({}, this.formComboboxConfig);
    return formGroup;
  }

  public removeCombobox(index: number, item: FormGroup) {
    const controls = this.formCombobox as FormArray;
    if (controls.length === 1) {
      this.buildFormCombobox();
      const group = this.makeDefaultComboboxForm();
      controls.push(group);
      this.formCombobox = controls;
    }
    controls.removeAt(index);
  }

    /**
   * buildFormCombobox
   */
  private buildFormCombobox(data?: any) {
    if (!data) {
      data = [{}];
    }
    const controls = new FormArray([]);
    for (const item of data) {
      const group = this.makeDefaultComboboxForm();
      group.patchValue(item);
      controls.push(group);
    }
    //check trung trong fieldItems
    controls.setValidators(ValidationService.duplicateArray(
      ['value'], 'value', 'staff.assessment.criteria.value'));
    this.formCombobox = controls;
  }

  public addCombobox(index: number, item: FormGroup) {
    const controls = this.formCombobox as FormArray;
    controls.insert(index + 1, this.makeDefaultComboboxForm());
  }

  private makeDefaultSpinnerForm(): FormGroup {
    const formGroup = this.buildForm({}, this.formSpinnerConfig, ACTION_FORM.INSERT, [ValidationService.notAffterNumber('startValue', 'endValue', 'staff.assessment.criteria.end.value')]);
    return formGroup;
  }

  public removeSpinner(index: number, item: FormGroup) {
    const controls = this.formSpinner as FormArray;
    if (controls.length === 1) {
      this.buildFormSpinner();
      const group = this.makeDefaultSpinnerForm();
      controls.push(group);
      this.formSpinner = controls;
    }
    controls.removeAt(index);
  }

  /**
   * buildFormSpinner
   */
  private buildFormSpinner(data?: any) {
    if (!data) {
      data = [{}];
    }
    const controls = new FormArray([]);
    for (const item of data) {
      const group = this.makeDefaultSpinnerForm();
      group.patchValue(item);
      controls.push(group);
    }
    controls.setValidators(ValidationService.notAffterNumber('startValue', 'endValue', 'staff.assessment.criteria.end.value'));
    this.formSpinner = controls;
  }

  public addSpinner(index: number, item: FormGroup) {
    const controls = this.formSpinner as FormArray;
    controls.insert(index + 1, this.makeDefaultSpinnerForm());
  }

  /**
   * buildForm
   */
  private buildForms(data?: any): void {
    if(data.fieldType === APP_CONSTANTS.FIELD_TYPE.SPINNER) {
      const formSpinner = {
        assessmentCriteriaId: [''],
        assessmentCriteriaGroupId: ['',[ValidationService.required]],
        assessmentCriteriaCode: ['',[ValidationService.required, ValidationService.maxLength(50)]],
        assessmentCriteriaName: ['',[ValidationService.required, ValidationService.maxLength(500)]],
        assessmentCriteriaGroupCode: [''],
        note: [''],
        fieldType: ['',[ValidationService.required]],
        fieldItems: [''],
        settingIconId: [''],
        fieldDefaultValue: [''],
        fieldPlaceholderValue: [''],
        fieldSqlValue: [''],
        assessmentCriteriaExplain: [''],
        maxLength: ['', [ValidationService.positiveInteger]],
        assessmentMinValue: ['', [ValidationService.positiveInteger]],
        assessmentMaxValue: ['', [ValidationService.positiveInteger, ValidationService.required, Validators.min(1)]],
        step: ['', [ValidationService.positiveInteger]],
        scoringGuide: [''],
        assessmentCriteriaRanks: [''],
        assessmentCriteriaRows: [''],
        isKey: ['']
      }
      this.formSave = this.buildForm(data, formSpinner, ACTION_FORM.INSERT, [ValidationService.notAffterNumber('assessmentMinValue','assessmentMaxValue', 'staff.assessment.criteria.big.assessment.value'),
      ValidationService.notAffterNumber('step','assessmentMaxValue', 'staff.assessment.criteria.big.assessment.value')]);
    } else if (data.fieldType === APP_CONSTANTS.FIELD_TYPE.STAR) {
        const formStar = {
          assessmentCriteriaId: [''],
          assessmentCriteriaGroupId: ['',[ValidationService.required]],
          assessmentCriteriaCode: ['',[ValidationService.required, ValidationService.maxLength(50)]],
          assessmentCriteriaName: ['',[ValidationService.required, ValidationService.maxLength(500)]],
          assessmentCriteriaGroupCode: [''],
          note: [''],
          fieldType: ['',[ValidationService.required]],
          fieldItems: [''],
          settingIconId: [''],
          fieldDefaultValue: [''],
          fieldPlaceholderValue: [''],
          fieldSqlValue: [''],
          assessmentCriteriaExplain: [''],
          maxLength: ['', [ValidationService.positiveInteger]],
          assessmentMinValue: ['', [ValidationService.positiveInteger]],
          assessmentMaxValue: ['', [ValidationService.positiveInteger, ValidationService.required, Validators.min(1)]],
          step: ['', [ValidationService.positiveInteger]],
          scoringGuide: [''],
          assessmentCriteriaRanks: [''],
          assessmentCriteriaRows: [''],
          isKey: ['']
        }
	    this.formSave = this.buildForm(data, formStar)
    } else if (data.fieldType === APP_CONSTANTS.FIELD_TYPE.TEXTAREA) {
      const formTextArea = {
        assessmentCriteriaId: [''],
        assessmentCriteriaGroupId: ['',[ValidationService.required]],
        assessmentCriteriaCode: ['',[ValidationService.required, ValidationService.maxLength(50)]],
        assessmentCriteriaName: ['',[ValidationService.required, ValidationService.maxLength(500)]],
        assessmentCriteriaGroupCode: [''],
        note: [''],
        fieldType: ['',[ValidationService.required]],
        fieldItems: [''],
        settingIconId: [''],
        fieldDefaultValue: [''],
        fieldPlaceholderValue: [''],
        fieldSqlValue: [''],
        assessmentCriteriaExplain: [''],
        maxLength: ['', [ValidationService.positiveInteger]],
        assessmentMinValue: ['', [ValidationService.positiveInteger]],
        assessmentMaxValue: ['', [ValidationService.positiveInteger]],
        step: ['', [ValidationService.positiveInteger]],
        scoringGuide: [''],
        assessmentCriteriaRanks: [''],
        assessmentCriteriaRows: ['', [ValidationService.positiveInteger, ValidationService.required, Validators.min(1), Validators.max(50)]],
        isKey: ['']
      } 
      this.formSave = this.buildForm(data, formTextArea)
    } else if (data.fieldType === APP_CONSTANTS.FIELD_TYPE.TY_LE) {
      const formTyle = {
        assessmentCriteriaId: [''],
        assessmentCriteriaGroupId: ['',[ValidationService.required]],
        assessmentCriteriaCode: ['',[ValidationService.required, ValidationService.maxLength(50)]],
        assessmentCriteriaName: ['',[ValidationService.required, ValidationService.maxLength(500)]],
        assessmentCriteriaGroupCode: [''],
        note: [''],
        fieldType: ['',[ValidationService.required]],
        fieldItems: [''],
        settingIconId: [''],
        fieldDefaultValue: ['',[ValidationService.positiveInteger, Validators.min(0), Validators.max(100)]],
        fieldPlaceholderValue: [''],
        fieldSqlValue: [''],
        assessmentCriteriaExplain: [''],
        maxLength: ['', [ValidationService.positiveInteger]],
        assessmentMinValue: ['', [ValidationService.positiveInteger]],
        assessmentMaxValue: ['', [ValidationService.positiveInteger]],
        step: ['', [ValidationService.positiveInteger]],
        scoringGuide: [''],
        assessmentCriteriaRanks: [''],
        assessmentCriteriaRows: [''],
        isKey: ['']
      } 
      this.formSave = this.buildForm(data, formTyle)
    }  else {
      this.formSave = this.buildForm(data, this.formConfig);
    }
  }

  /**
   * buildFormDate
   */
  public buildFormFromTo(data?: any): void {
    this.formFromTo = this.buildForm(data, this.formFromToConfig, null, [ ValidationService.notAffterNumber('from', 'to', 'staff.assessment.criteria.to.date')]);
  }

  ngOnInit() {
  }

  get f () {
    return this.formSave.controls;
  }
  get fFromTo () {
    return this.formFromTo.controls;
  }
  setFormCriteriaValue(data) {
    if (data && data.assessmentCriteriaId > 0) {
      if(data.fieldType === APP_CONSTANTS.FIELD_TYPE.RADIO_BUTTON || data.fieldType === APP_CONSTANTS.FIELD_TYPE.COMBOBOX) {
        data.fieldItems = JSON.parse(data.fieldItems);
        this.buildFormCombobox(data.fieldItems)
      } else if(data.fieldType === APP_CONSTANTS.FIELD_TYPE.SPINNER || data.fieldType === APP_CONSTANTS.FIELD_TYPE.STAR ) {
        data.assessmentCriteriaRanks = JSON.parse(data.assessmentCriteriaRanks);
        this.buildFormSpinner(data.assessmentCriteriaRanks)
        if (data.fieldType === APP_CONSTANTS.FIELD_TYPE.SPINNER && data.assessmentMaxValue > 0) {
          this.spinnerDisable = false;
          this.spinnerMax = parseFloat(data.assessmentMaxValue + '');
          this.spinnerMin = parseFloat(data.assessmentMinValue + '');
        }
        if (data.fieldType === APP_CONSTANTS.FIELD_TYPE.STAR && data.assessmentMaxValue > 0) {
          this.disabledStar = false;
          this.cancelStar = false;
          this.stars = data.assessmentMaxValue;
        }
      } else if (data.fieldType === APP_CONSTANTS.FIELD_TYPE.TIME || data.fieldType === APP_CONSTANTS.FIELD_TYPE.DATE || data.fieldType === APP_CONSTANTS.FIELD_TYPE.DATETIME) {
        if (data.fieldDefaultValue != null) {
          data.fieldDefaultValue = new Date(Number(data.fieldDefaultValue));
        }
      } else if (data.fieldType === APP_CONSTANTS.FIELD_TYPE.FROM_TO) {
        data.fieldDefaultValue = JSON.parse(data.fieldDefaultValue);
        this.buildFormFromTo(data.fieldDefaultValue)
      }
      this.formSave.controls['fieldType'].setValue(data.fieldType);
      this.buildForms(data);
      this.isEditMode = true;
    } else {
      this.buildForms(data);
    }
  }

  getViewCriteria(data) {
    if (data && data.assessmentCriteriaId > 0) {
      if(data.fieldType === APP_CONSTANTS.FIELD_TYPE.RADIO_BUTTON || data.fieldType === APP_CONSTANTS.FIELD_TYPE.COMBOBOX) {
        data.fieldItems = JSON.parse(data.fieldItems);
        this.buildFormCombobox(data.fieldItems)
      } else if(data.fieldType === APP_CONSTANTS.FIELD_TYPE.SPINNER || data.fieldType === APP_CONSTANTS.FIELD_TYPE.STAR ) {
        data.assessmentCriteriaRanks = JSON.parse(data.assessmentCriteriaRanks);
        this.buildFormSpinner(data.assessmentCriteriaRanks)
        if (data.fieldType === APP_CONSTANTS.FIELD_TYPE.SPINNER && data.assessmentMaxValue > 0) {
          this.spinnerDisable = false;
          this.spinnerMax = parseFloat(data.assessmentMaxValue + '');
          this.spinnerMin = parseFloat(data.assessmentMinValue + '');
        }
        if (data.fieldType === APP_CONSTANTS.FIELD_TYPE.STAR && data.assessmentMaxValue > 0) {
          this.disabledStar = false;
          this.cancelStar = false;
          this.stars = data.assessmentMaxValue;
        }
      } else if(data.fieldType === APP_CONSTANTS.FIELD_TYPE.TIME || data.fieldType === APP_CONSTANTS.FIELD_TYPE.DATE || data.fieldType === APP_CONSTANTS.FIELD_TYPE.DATETIME) {
         data.fieldDefaultValue = new Date(Number(data.fieldDefaultValue));
      } else if (data.fieldType === APP_CONSTANTS.FIELD_TYPE.FROM_TO) {
        data.fieldDefaultValue = JSON.parse(data.fieldDefaultValue)
        this.buildFormFromTo(data.fieldDefaultValue)
      }
    }
    this.formSave.controls['fieldType'].setValue(data.fieldType);
    this.buildForms(data);
    this.isView = true;
  }

  checkOnlyCheckbox(e, index, formControlName) {
    if (e.target.checked) {
      const controls = this.formCombobox as FormArray;
      for (let i = 0; i < controls.length; i++) {
        if (index !== i) {
          controls.controls[i].get(formControlName).setValue(false);
        }
      }
    }
  }

  public onChangeAssessmentMaxValue(val: number) {
    if (this.formSave.controls['assessmentMinValue'].value > 0){
      setTimeout(() =>this.formSave.controls['fieldDefaultValue'].setValue(parseFloat(this.formSave.controls['assessmentMinValue'].value + '')), 0)
     } else {
      setTimeout(() =>this.formSave.controls['fieldDefaultValue'].setValue(0), 0)
     }
    if (this.formSave.controls["fieldType"].value === APP_CONSTANTS.FIELD_TYPE.SPINNER) {
      if (val && val > 0) {
        this.spinnerDisable = false;
        this.spinnerMax = parseFloat(val + '');
      } else {
        this.spinnerDisable = true;
        this.spinnerMax = parseFloat('100');
      }
    }
  }

  public onChangeAssessmentMinValue(val: number) {
    if (this.formSave.controls['assessmentMinValue'].value > 0 || this.formSave.controls['assessmentMinValue'].value < 0 ){
      this.formSave.controls['assessmentMinValue'].setValue(parseFloat(val + ''));
    }
    this.formSave.controls['assessmentMinValue'].setValue(val);
    if (this.formSave.controls['assessmentMinValue'].value > 0){
      setTimeout(() =>this.formSave.controls['fieldDefaultValue'].setValue(parseFloat(val + '')), 0)
     } else {
      setTimeout(() =>this.formSave.controls['fieldDefaultValue'].setValue(0), 0)
     }
    if (this.formSave.controls["fieldType"].value === APP_CONSTANTS.FIELD_TYPE.SPINNER) {
      if (val) {
        this.spinnerMin = parseFloat(val + '');
      } else {
        this.spinnerMin = parseFloat('0');
      }
    }
  }

  public onChangeAssessmentStepValue(val: number) {
    if (this.formSave.controls["fieldType"].value === APP_CONSTANTS.FIELD_TYPE.SPINNER) {
      this.spinnerStep = val || 1.0;
      this.spinnerStep = parseFloat(this.spinnerStep + '');
    }
  }

  public onChangeAssessmentMaxValueOfStar(val: number) {
    this.formSave.removeControl('fieldDefaultValue');
    this.formSave.addControl('fieldDefaultValue', new FormControl(null));
    if (this.formSave.controls["fieldType"].value === APP_CONSTANTS.FIELD_TYPE.STAR) {
      if(val > 0) {
        this.disabledStar = false;
        this.stars = 0;
        this.cancelStar = true;
        setTimeout(() => this.stars = val, 0)
      } else {
        this.disabledStar = true;
        this.stars = 0;
        this.cancelStar = false;
      }
    }
  }

  /**
   * Dispaly data fieldDefaultValue of Spinner component
   * @param e 
   */
  public handleChange(e) {
    this.formSave.controls["fieldDefaultValue"].setValue(e.value);
  }

  /**
   * Event processUpdate
   */
  public processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    } 
    if (this.formSave.controls["fieldType"].value === APP_CONSTANTS.FIELD_TYPE.COMBOBOX || this.formSave.controls["fieldType"].value === APP_CONSTANTS.FIELD_TYPE.RADIO_BUTTON) {
      const validateFormCombobox = CommonUtils.isValidForm(this.formCombobox);
      if (!validateFormCombobox) {
        return;
      }
    } else if (this.formSave.controls["fieldType"].value === APP_CONSTANTS.FIELD_TYPE.SPINNER || this.formSave.controls["fieldType"].value === APP_CONSTANTS.FIELD_TYPE.STAR)  {
      const valdiateFormSpinner = CommonUtils.isValidForm(this.formSpinner);
      if (!valdiateFormSpinner) {
        return;
      }
    } else if (this.formSave.controls["fieldType"].value === APP_CONSTANTS.FIELD_TYPE.FROM_TO )  {
      const valdiateFromTo = CommonUtils.isValidForm(this.formFromTo);
      if (!valdiateFromTo) {
        return;
      }
    }
  
    this.app.confirmMessage(null, () => { // on accepted
      if (this.formSave.controls["fieldType"].value === APP_CONSTANTS.FIELD_TYPE.COMBOBOX || this.formSave.controls["fieldType"].value === APP_CONSTANTS.FIELD_TYPE.RADIO_BUTTON) {
        this.formSave.controls["fieldPlaceholderValue"].setValue(null);
        this.formSave.controls["assessmentMinValue"].setValue(null);
        this.formSave.controls["assessmentMaxValue"].setValue(null);
        this.formSave.controls["step"].setValue(null);
        // list FieldItems
        let lstFieldItems: Array<any> = [];
        // fieldDefaultValue
        this.formCombobox.controls.forEach(item => {
          lstFieldItems.push(item.value);
        })
        // get fieldDefaultValue with isFieldDefaultValue = true
        let fieldDefaultValue = null;
        lstFieldItems.forEach(item => {
          if (item['isFieldDefaultValue']) {
            fieldDefaultValue = item.value;
            return;
          }
        })
        this.formSave.controls["fieldDefaultValue"].setValue(fieldDefaultValue);
        this.formSave.controls["fieldItems"].setValue(JSON.stringify(lstFieldItems));
        this.formSave.controls["assessmentCriteriaRanks"].setValue(null);
        this.formSave.controls["assessmentCriteriaRows"].setValue(null);
      } else if (this.formSave.controls["fieldType"].value === APP_CONSTANTS.FIELD_TYPE.TEXTBOX) {
        this.formSave.controls["assessmentMinValue"].setValue(null);
        this.formSave.controls["assessmentMaxValue"].setValue(null);
        this.formSave.controls["step"].setValue(null);
        this.formSave.controls["fieldItems"].setValue(null);
        this.formSave.controls["assessmentCriteriaRanks"].setValue(null);
        this.formSave.controls["assessmentCriteriaRows"].setValue(null);
      } else if (this.formSave.controls["fieldType"].value === APP_CONSTANTS.FIELD_TYPE.DATE) {
        this.formSave.controls["maxLength"].setValue(null);
        this.formSave.controls["assessmentCriteriaExplain"].setValue(null);
        this.formSave.controls["fieldPlaceholderValue"].setValue(null);
        this.formSave.controls["assessmentMinValue"].setValue(null);
        this.formSave.controls["assessmentMaxValue"].setValue(null);
        this.formSave.controls["step"].setValue(null);
        this.formSave.controls["fieldItems"].setValue(null);
        this.formSave.controls["assessmentCriteriaRanks"].setValue(null);
        let defaultValue = null
        if (this.formSave.controls["fieldDefaultValue"].value) {
          defaultValue = Number(this.formSave.controls["fieldDefaultValue"].value)
        }
        this.formSave.controls["fieldDefaultValue"].setValue(defaultValue)
        this.formSave.controls["assessmentCriteriaRows"].setValue(null);
      } else if (this.formSave.controls["fieldType"].value === APP_CONSTANTS.FIELD_TYPE.DATETIME) {
        this.formSave.controls["maxLength"].setValue(null);
        this.formSave.controls["assessmentCriteriaExplain"].setValue(null);
        this.formSave.controls["fieldPlaceholderValue"].setValue(null);
        this.formSave.controls["assessmentMinValue"].setValue(null);
        this.formSave.controls["assessmentMaxValue"].setValue(null);
        this.formSave.controls["step"].setValue(null);
        this.formSave.controls["fieldItems"].setValue(null);
        this.formSave.controls["assessmentCriteriaRanks"].setValue(null);
        let defaultValue = null
        if (this.formSave.controls["fieldDefaultValue"].value) {
          defaultValue = Number(this.formSave.controls["fieldDefaultValue"].value)
        }
        this.formSave.controls["fieldDefaultValue"].setValue(defaultValue)
        this.formSave.controls["assessmentCriteriaRows"].setValue(null);
      } else if (this.formSave.controls["fieldType"].value === APP_CONSTANTS.FIELD_TYPE.TIME) {
        this.formSave.controls["maxLength"].setValue(null);
        this.formSave.controls["assessmentCriteriaExplain"].setValue(null);
        this.formSave.controls["fieldPlaceholderValue"].setValue(null);
        this.formSave.controls["assessmentMinValue"].setValue(null);
        this.formSave.controls["assessmentMaxValue"].setValue(null);
        this.formSave.controls["step"].setValue(null);
        this.formSave.controls["fieldItems"].setValue(null);
        this.formSave.controls["assessmentCriteriaRanks"].setValue(null);
        let defaultValue = null
        if (this.formSave.controls["fieldDefaultValue"].value) {
          defaultValue = Number(this.formSave.controls["fieldDefaultValue"].value)
        }
        this.formSave.controls["fieldDefaultValue"].setValue(defaultValue)
        this.formSave.controls["assessmentCriteriaRows"].setValue(null);
      } else if (this.formSave.controls["fieldType"].value === APP_CONSTANTS.FIELD_TYPE.SPINNER) {
        this.formSave.controls["maxLength"].setValue(null);
        this.formSave.controls["fieldPlaceholderValue"].setValue(null);
        let lstAssessmentCriteriaRanks: Array<any> = [];
        this.formSpinner.controls.forEach(item => {
          lstAssessmentCriteriaRanks.push(item.value);
        })
        this.formSave.controls["assessmentCriteriaRanks"].setValue(JSON.stringify(lstAssessmentCriteriaRanks));
        this.formSave.controls["fieldItems"].setValue(null);
        this.formSave.controls["assessmentCriteriaRows"].setValue(null);
      } else if (this.formSave.controls["fieldType"].value === APP_CONSTANTS.FIELD_TYPE.TEXTAREA) {
        this.formSave.controls["assessmentMinValue"].setValue(null);
        this.formSave.controls["assessmentMaxValue"].setValue(null);
        this.formSave.controls["step"].setValue(null);
        this.formSave.controls["fieldItems"].setValue(null);
        this.formSave.controls["assessmentCriteriaRanks"].setValue(null);
      } else if (this.formSave.controls["fieldType"].value === APP_CONSTANTS.FIELD_TYPE.STAR) {
        this.formSave.controls["maxLength"].setValue(null);
        this.formSave.controls["fieldPlaceholderValue"].setValue(null);
        this.formSave.controls["assessmentMinValue"].setValue(null);
        this.formSave.controls["step"].setValue(null);
        let lstAssessmentCriteriaRanks: Array<any> = [];
        this.formSpinner.controls.forEach(item => {
          lstAssessmentCriteriaRanks.push(item.value);
        })
        this.formSave.controls["assessmentCriteriaRanks"].setValue(JSON.stringify(lstAssessmentCriteriaRanks));
        this.formSave.controls["fieldItems"].setValue(null);
        this.formSave.controls["assessmentCriteriaRows"].setValue(null);
      } else if (this.formSave.controls["fieldType"].value === APP_CONSTANTS.FIELD_TYPE.FROM_TO) {
        let from = null;
        if (this.formFromTo.controls['from'].value) {
          from = Number(this.formFromTo.controls['from'].value);
        }
        let to = null;
        if (this.formFromTo.controls['to'].value) {
          to = Number(this.formFromTo.controls['to'].value);
        }
        let fieldDefault = {
          from: from,
          to: to
        }
        this.formSave.controls["fieldDefaultValue"].setValue(JSON.stringify(fieldDefault));
        this.formSave.controls["maxLength"].setValue(null);
        this.formSave.controls["fieldPlaceholderValue"].setValue(null);
        this.formSave.controls["assessmentMinValue"].setValue(null);
        this.formSave.controls["assessmentMaxValue"].setValue(null);
        this.formSave.controls["step"].setValue(null);
        this.formSave.controls["fieldItems"].setValue(null);
        this.formSave.controls["assessmentCriteriaRanks"].setValue(null);
        this.formSave.controls["assessmentCriteriaRows"].setValue(null);
      } else if (this.formSave.controls["fieldType"].value === APP_CONSTANTS.FIELD_TYPE.TY_LE) {
        this.formSave.controls["maxLength"].setValue(null);
        this.formSave.controls["assessmentMinValue"].setValue(null);
        this.formSave.controls["assessmentMaxValue"].setValue(null);
        this.formSave.controls["step"].setValue(null);
        this.formSave.controls["fieldItems"].setValue(null);
        this.formSave.controls["assessmentCriteriaRanks"].setValue(null);
        this.formSave.controls["assessmentCriteriaRows"].setValue(null);
      }
      this.staffAssessmentCriteriaService.saveOrUpdate(this.formSave.value)
        .subscribe(res => {
          if (this.staffAssessmentCriteriaService.requestIsSuccess(res)) {
            this.activeModal.close(res);
          }
        });
        }, () => {
        // on rejected   
      });
  }

  /**
   * 
   * @param assessmentCriteriaGroupId 
   * @param assessmentCriteriaGroupCode 
   */
  setFormValue(assessmentCriteriaGroupId, assessmentCriteriaGroupCode) {
    this.isFromGroupSearch = true
    this.formSave.controls["assessmentCriteriaGroupCode"].setValue(assessmentCriteriaGroupCode);
    this.formSave.controls["assessmentCriteriaGroupId"].setValue(assessmentCriteriaGroupId);
  }
   /**
   * 
   * @param item 
   */
  trimZeros(item) {
    item.controls['value'].setValue(item.value.value.replace(/[^\d]+|^0+(?!$)/g, ''));
  }

   /**
   * 
   * @param item 
   */
  trimZerosStartValue(item) {
    item.controls['startValue'].setValue(item.value.startValue.replace(/[^\d]+|^0+(?!$)/g, ''));
  }

   /**
   * 
   * @param item 
   */
  trimZerosEndValue(item) {
    item.controls['endValue'].setValue(item.value.endValue.replace(/[^\d]+|^0+(?!$)/g, ''));
  }
     /**
   * 
   * @param item 
   */
  trimZerosFieldDefaultValue(value) {
    value.setValue(value.replace(/[^\d]+|^0+(?!$)/g, ''));
  }

  /**
   * Event change field type
   */
  public onChangeFieldType (event?) {
    if (!event) {
      return
    }
    if (event === APP_CONSTANTS.FIELD_TYPE.COMBOBOX) {
      this.formSave.removeControl('fieldDefaultValue');
      this.formSave.addControl('fieldDefaultValue', new FormControl(null));
      this.formSave.removeControl('assessmentCriteriaExplain');
      this.formSave.addControl('assessmentCriteriaExplain', new FormControl(null));
      this.formSave.removeControl('assessmentMaxValue');
      this.formSave.addControl('assessmentMaxValue', new FormControl(null));
      this.buildFormCombobox(null);
      this.buildFormSpinner(null);
      this.formSave.controls['assessmentMaxValue'].updateValueAndValidity();
      this.formSave.controls['assessmentCriteriaRows'].updateValueAndValidity();
    } else if (event === APP_CONSTANTS.FIELD_TYPE.TEXTBOX) {
      this.formSave.removeControl('fieldDefaultValue');
      this.formSave.addControl('fieldDefaultValue', new FormControl(null));
      this.formSave.removeControl('fieldPlaceholderValue');
      this.formSave.addControl('fieldPlaceholderValue', new FormControl(null));
      this.formSave.removeControl('assessmentCriteriaExplain');
      this.formSave.addControl('assessmentCriteriaExplain', new FormControl(null));
      this.formSave.removeControl('maxLength');
      this.formSave.addControl('maxLength', new FormControl(null, [ValidationService.positiveInteger]));
      this.formSave.removeControl('assessmentMaxValue');
      this.formSave.addControl('assessmentMaxValue', new FormControl(null));
      this.buildFormCombobox(null);
      this.buildFormSpinner(null);
      this.formSave.controls['fieldDefaultValue'].updateValueAndValidity();
      this.formSave.controls['fieldPlaceholderValue'].updateValueAndValidity();
      this.formSave.controls['assessmentCriteriaExplain'].updateValueAndValidity();
      this.formSave.controls['assessmentMaxValue'].updateValueAndValidity();
      this.formSave.controls['assessmentCriteriaRows'].updateValueAndValidity();
    } else if (event === APP_CONSTANTS.FIELD_TYPE.DATE) {
      this.formSave.removeControl('fieldDefaultValue');
      this.formSave.addControl('fieldDefaultValue', new FormControl(null));
      this.formSave.removeControl('assessmentMaxValue');
      this.formSave.addControl('assessmentMaxValue', new FormControl(null));
      this.buildFormCombobox(null);
      this.buildFormSpinner(null);
      this.formSave.controls['assessmentCriteriaRows'].updateValueAndValidity();
      this.formSave.controls['assessmentMaxValue'].updateValueAndValidity();
    } else if (event === APP_CONSTANTS.FIELD_TYPE.DATETIME) {
      this.formSave.removeControl('fieldDefaultValue');
      this.formSave.addControl('fieldDefaultValue', new FormControl(null));
      this.formSave.removeControl('assessmentMaxValue');
      this.formSave.addControl('assessmentMaxValue', new FormControl(null));
      this.buildFormCombobox(null);
      this.buildFormSpinner(null);
      this.formSave.controls['assessmentCriteriaRows'].updateValueAndValidity();
      this.formSave.controls['assessmentMaxValue'].updateValueAndValidity();
    } else if (event === APP_CONSTANTS.FIELD_TYPE.TIME) {
      this.formSave.removeControl('fieldDefaultValue');
      this.formSave.addControl('fieldDefaultValue', new FormControl(new Date()));
      this.formSave.removeControl('assessmentMaxValue');
      this.formSave.addControl('assessmentMaxValue', new FormControl(null));
      this.buildFormCombobox(null);
      this.buildFormSpinner(null);
      this.formSave.controls['assessmentCriteriaRows'].updateValueAndValidity();
      this.formSave.controls['assessmentMaxValue'].updateValueAndValidity();
    } else if (event === APP_CONSTANTS.FIELD_TYPE.SPINNER) {
      this.formSave.removeControl('fieldDefaultValue');
      this.formSave.addControl('fieldDefaultValue', new FormControl(0));
      this.formSave.removeControl('assessmentMinValue');
      this.formSave.addControl('assessmentMinValue', new FormControl(null, [ValidationService.positiveInteger]));
      this.formSave.removeControl('assessmentMaxValue');
      this.formSave.addControl('assessmentMaxValue', new FormControl(null, [ValidationService.required, ValidationService.positiveInteger, Validators.min(1) ]));
      this.formSave.setValidators([ValidationService.notAffterNumber('assessmentMinValue','assessmentMaxValue', 'staff.assessment.criteria.big.assessment.value'),
      ValidationService.notAffterNumber('step','assessmentMaxValue', 'staff.assessment.criteria.big.assessment.value')]);
      this.formSave.removeControl('step');
      this.formSave.addControl('step', new FormControl(null, [ValidationService.positiveInteger]));
      this.buildFormSpinner(null);
      this.buildFormCombobox(null);
      this.formSave.controls['assessmentCriteriaRows'].updateValueAndValidity();
    } else if (event === APP_CONSTANTS.FIELD_TYPE.TEXTAREA ) {
      this.formSave.removeControl('fieldDefaultValue');
      this.formSave.addControl('fieldDefaultValue', new FormControl(null));
      this.formSave.removeControl('fieldPlaceholderValue');
      this.formSave.addControl('fieldPlaceholderValue', new FormControl(null));
      this.formSave.removeControl('assessmentCriteriaExplain');
      this.formSave.addControl('assessmentCriteriaExplain', new FormControl(null));
      this.formSave.removeControl('maxLength');
      this.formSave.addControl('maxLength', new FormControl(null, [ValidationService.positiveInteger]));
      this.formSave.removeControl('assessmentMaxValue');
      this.formSave.addControl('assessmentMaxValue', new FormControl(null));
      this.formSave.removeControl('assessmentCriteriaRows');
      this.formSave.addControl('assessmentCriteriaRows', new FormControl(null, [ValidationService.required, ValidationService.positiveInteger, Validators.min(1),  Validators.max(50)]));
      this.buildFormCombobox(null);
      this.buildFormSpinner(null);
      this.formSave.controls['fieldDefaultValue'].updateValueAndValidity();
      this.formSave.controls['fieldPlaceholderValue'].updateValueAndValidity();
      this.formSave.controls['assessmentCriteriaExplain'].updateValueAndValidity();
      this.formSave.controls['assessmentMaxValue'].updateValueAndValidity();
    } else if (event === APP_CONSTANTS.FIELD_TYPE.STAR ) {
      this.cancelStar = false;
      this.stars = 0;
      this.formSave.removeControl('fieldDefaultValue');
      this.formSave.addControl('fieldDefaultValue', new FormControl(null));
      this.formSave.removeControl('assessmentMaxValue');
      this.formSave.addControl('assessmentMaxValue', new FormControl(null, [ValidationService.required, ValidationService.positiveInteger]));
      this.buildFormSpinner(null);
      this.buildFormCombobox(null);
      this.formSave.controls['assessmentCriteriaRows'].updateValueAndValidity();
    } else if (event === APP_CONSTANTS.FIELD_TYPE.RADIO_BUTTON) {
      this.formSave.removeControl('fieldDefaultValue');
      this.formSave.addControl('fieldDefaultValue', new FormControl(null));
      this.formSave.removeControl('assessmentCriteriaExplain');
      this.formSave.addControl('assessmentCriteriaExplain', new FormControl(null));
      this.formSave.removeControl('assessmentMaxValue');
      this.formSave.addControl('assessmentMaxValue', new FormControl(null));
      this.buildFormCombobox(null);
      this.buildFormCombobox(null);
      this.formSave.controls['assessmentMaxValue'].updateValueAndValidity();
      this.formSave.controls['assessmentCriteriaRows'].updateValueAndValidity();
    } else if (event === APP_CONSTANTS.FIELD_TYPE.FROM_TO) {
      this.formSave.removeControl('fieldDefaultValue');
      this.formSave.addControl('fieldDefaultValue', new FormControl(null));
      this.formSave.removeControl('assessmentCriteriaExplain');
      this.formSave.addControl('assessmentCriteriaExplain', new FormControl(null));
      this.buildFormCombobox(null);
      this.buildFormSpinner(null);
      this.formSave.controls['assessmentCriteriaRows'].updateValueAndValidity();
      this.formSave.controls['assessmentCriteriaExplain'].updateValueAndValidity();
    } else if (event === APP_CONSTANTS.FIELD_TYPE.TY_LE) {
      this.formSave.removeControl('fieldDefaultValue');
      this.formSave.addControl('fieldDefaultValue', new FormControl(null, [ValidationService.positiveInteger, Validators.min(0), Validators.max(100)]));
      this.formSave.removeControl('assessmentCriteriaExplain');
      this.formSave.addControl('assessmentCriteriaExplain', new FormControl(null));
      this.buildFormCombobox(null);
      this.buildFormSpinner(null);
      this.formSave.controls['assessmentCriteriaRows'].updateValueAndValidity();
      this.formSave.controls['assessmentCriteriaExplain'].updateValueAndValidity();
    } else {}
  }

}
