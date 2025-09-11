
import { ActivatedRoute } from '@angular/router';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { AppComponent } from '@app/app.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService } from '@app/shared/services/helper.service';
import { APP_CONSTANTS } from '@app/core';
import { ArmyProposedTemplateService } from '@app/core/services/employee/army-proposed-template.service';
import { ReportDynamicService } from '@app/modules/reports/report-dynamic/report-dynamic.service';

@Component({
  selector: 'army-proposed-template-add',
  templateUrl: './army-proposed-template-add.component.html',
  styleUrls: ['./army-proposed-template-add.component.css']
})
export class ArmyProposedTemplateAddComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  formSubTemplate: FormArray;
  listType: any;
  listDataType: any;
  listPrintLayout: [] = APP_CONSTANTS.SUB_TEMPLATE_PRINT_LAYOUT;
  type: any;
  isUpdate: boolean = false;
  isInsert: boolean = false;
  isMobileScreen: boolean = false;
  formConfig = {
    armyProposedTemplateId: [''],
    name: ['', ValidationService.required],
    fileAttach: ['', ValidationService.required],
    fileName: [''],
    printLayout: ['', ValidationService.required],
    type: ['', ValidationService.required],
    armySubTemplateList: [''],
    armySubTemplateIdsRemove: [''],
    effectiveDate: ['', ValidationService.required],
    expiredDate: ['']
  }

  formArrayConfig = {
    armySubTemplateId: [''],
    armyProposedTemplateId: [''],
    name: ['', ValidationService.required],
    conditionSql: ['', ValidationService.required],
  }

  constructor(
    public activeModal: NgbActiveModal,
    private armyProposedTemplateService: ArmyProposedTemplateService,
    public reportDynamicService: ReportDynamicService,
    public actr: ActivatedRoute,
    public app: AppComponent,
    private helperService: HelperService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.configArmyConditionConfig"));
    this.setMainService(armyProposedTemplateService);
    this.buildForms({});
    this.buildFormsSubTemplate([]);
    this.armyProposedTemplateService.getListType().subscribe(res => {
      this.listType = res.data;
    });
    this.armyProposedTemplateService.getListType().subscribe(res => {
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
  private setFormValue(data) {
    if (data.armyProposedTemplateId) {
      this.armyProposedTemplateService.findOne(data.armyProposedTemplateId).subscribe(res => {
        if (res.data) {
          this.buildForms(res.data);
          this.buildFormsSubTemplate(res.data.armySubTemplateList);
          if(!CommonUtils.isNullOrEmpty(res.data.fileName)) {
            this.formSave.removeControl('fileAttach');
            this.formSave.addControl('fileAttach', new FormControl(null));
          }
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
    if (!CommonUtils.isValidForm(this.formSave) && !CommonUtils.isValidForm(this.formSubTemplate)) {
      return;
    }
    this.formSave.get('armySubTemplateList').setValue(this.formSubTemplate.value);
    
    this.app.confirmMessage(null, () => { // on accept
      this.armyProposedTemplateService.saveOrUpdateFormFile(this.formSave.value)
        .subscribe(res => {
          if (this.armyProposedTemplateService.requestIsSuccess(res)) {
            this.helperService.reloadHeaderNotification('complete');
            this.activeModal.close(res);
          }
        });
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
  private buildFormsSubTemplate(armySubTemplateList?: any[]) {
    const controls = new FormArray([]);
    if (!armySubTemplateList || armySubTemplateList.length === 0) {
      const group = this.makeDefaultFormConfig();
      controls.push(group);
    } else {
      for (const subTemplate of armySubTemplateList) {
        const group = this.makeDefaultFormConfig();
        group.patchValue(subTemplate);
        controls.push(group);
      }
    }
    this.formSubTemplate = controls;
  }

  public addSubTemplate(item?) {
    const controls = this.formSubTemplate as FormArray;
    let itemValue = this.makeDefaultFormConfig();
    controls.insert(controls.controls.indexOf(item) + 1, itemValue);
  }

  /**
   * remove formGroup assessment level
   */
  public removeSubTemplate(item) {
    const id = item.get('armySubTemplateId').value;
    if (id) {
      let listId = this.formSave.get('armySubTemplateIdsRemove').value;
      if (!listId) {
        listId = [];
      }
      listId.push(item.get('armySubTemplateId').value);
      this.formSave.get('armySubTemplateIdsRemove').setValue(listId);
    }
    const controls = this.formSubTemplate as FormArray;
    const index = controls.controls.indexOf(item);
    controls.removeAt(index);
    if (controls.length === 0) {
      this.buildFormsSubTemplate([]);
    }
  }

  private makeDefaultFormConfig(): FormGroup {
    const formGroup = this.buildForm({}, this.formArrayConfig);
    return formGroup;
  }

  downloadTemplate(armyProposedTemplateId) {
    const url = `${this.armyProposedTemplateService.serviceUrl}/file-template/${armyProposedTemplateId}`;
    window.location.href = url;
  }
}
