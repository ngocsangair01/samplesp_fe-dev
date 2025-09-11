import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormGroup, FormArray } from '@angular/forms';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { AssessmentFormulaService } from '@app/core/services/employee/assessment-formula.service';
import { AppComponent } from '@app/app.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { StaffAssessmentCriteriaService } from '@app/core/services/employee/staff-assessment-criteria.service';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StaffAssessmentCriteriaFormComponent } from '../../staff-assessment-criteria/staff-assessment-criteria-form/staff-assessment-criteria-form.component';
import { APP_CONSTANTS, DEFAULT_MODAL_OPTIONS } from '@app/core';

@Component({
  selector: 'assessment-formula-form',
  templateUrl: './assessment-formula-form.component.html',
  styleUrls: ['./assessment-formula-form.component.css']
})
export class AssessmentFormulaFormComponent extends BaseComponent implements OnInit {
  formSave : FormGroup;
  
  update: boolean;
  isView: boolean = true;
  lstExpressionEvaluate: FormArray;
  lstAssessmentCriteriaGroup: any[] = [];
  assessmentCriteriaGroupId: any;
  assessmentFormulaId: any;
  assessmentExpressionTypeList: any;
  assessmentCriteriaGroupIdList : any[] = [];
  existCriteriaSql :string = "AND EXISTS(SELECT 1 FROM assessment_criteria ac WHERE ac.assessment_criteria_group_id = obj.assessment_criteria_group_id) ";
  filterCondition: string = "AND obj.assessment_criteria_group_status = 2";
  criteriaDisplayList: any[] = [];
  formConfig = {
    assessmentFormulaId: [''],
    assessmentFormulaName: ['', ValidationService.required, ValidationService.maxLength(500)],
    assessmentCriteriaGroupId: [''],
    assessmentCriteriaGroupName: [''],
    assessmentCriteriaName: [''],
  };

  formExpressionEvaluate = {
    assessmentVariableName: ['', ValidationService.required, ValidationService.maxLength(50)],
    assessmentExpressionType : [''],
    assessmentExpressionEvaluateValue: ['', ValidationService.required, ValidationService.maxLength(1000)],
    assessmentDescription: ['', ValidationService.maxLength(1000)],
    assessmentExpressionEvaluateOrder: ['']
  };

  constructor(
    private modalService: NgbModal,
    private assessmentFormulaService: AssessmentFormulaService,
    private staffAssessmentCriteriaService: StaffAssessmentCriteriaService,
    private app: AppComponent,
    private router: Router,
    public actr: ActivatedRoute,
  ) {
    super(null, "ASSESSMENT_FORMULA")
    this.assessmentExpressionTypeList = APP_CONSTANTS.ASSESSMENT_EXPRESSION_TYPE;
    this.formSave = this.buildForm({}, this.formConfig);
    this.buildFormExpressionEvaluate();
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params.assessmentFormulaId) {
          this.assessmentFormulaId = params.assessmentFormulaId;
        }
      }
    });
   }

  get f () {
    return this.formSave.controls;
  }

  ngOnInit() {
    this.buildForms(this.assessmentFormulaId);
    const subPaths = this.router.url.split('/');
    if (subPaths.length >= 3) {
      if ( subPaths[3] ==='edit') {
        this.update = false;
      }
    }
  }

  public buildForms(assessmentFormulaId?: any) {
    if (assessmentFormulaId) {
      // Build form trường hợp edit
      this.assessmentFormulaService.findOne(this.assessmentFormulaId).subscribe(res => {
        if (res.data) {
          this.formSave = this.buildForm(res.data, this.formConfig);
          this.buildFormExpressionEvaluate(res.data.assessmentExpressionEvaluateBeanList);
          this.lstAssessmentCriteriaGroup = res.data.assessmentFormulaMappingCriteriaGroupBeanList;
          if (this.lstAssessmentCriteriaGroup.length > 0) {
            this.lstAssessmentCriteriaGroup.forEach(group => {
              this.assessmentCriteriaGroupIdList.push(group.assessmentCriteriaGroupId)
              if (group.listChangeDisplay.length > 0) {
                group.listChangeDisplay.forEach(criteria => {
                  this.criteriaDisplayList.push(criteria)
                })
              }
            })
            this.filterCondition = "AND obj.assessment_criteria_group_status = 2 AND obj.assessment_criteria_group_id NOT IN (" + this.assessmentCriteriaGroupIdList.join(",") + ")"
          }
        }
    });
  }
}

  public goBack() {
    this.router.navigate(['/employee/assessment-formula']);
  }

  /**
   * Lấy thông tin tiêu chí
   * @param event 
   * @param item 
   */
  public loadCriteriaGroup(event) {
    if (event && event.selectField > 0) {
      this.assessmentCriteriaGroupIdList.push(event.selectField)
      this.filterCondition = "AND obj.assessment_criteria_group_status = 2 AND obj.assessment_criteria_group_id NOT IN (" + this.assessmentCriteriaGroupIdList.join(",") + ")"
      const criteriaGroup = {}
      criteriaGroup['assessmentCriteriaGroupId'] = event.selectField
      criteriaGroup['assessmentCriteriaGroupCode'] = event.codeField
      criteriaGroup['assessmentCriteriaGroupName'] = event.nameField
      this.staffAssessmentCriteriaService.getListCriteriaByCriteriaGroupId(event.selectField)
      .subscribe(res => {
        if (res.length > 0) {
          res.forEach(assessmentCriteria => {
            assessmentCriteria.disabled = false
            assessmentCriteria.required = 1
            assessmentCriteria.resultFinal = 0
            this.criteriaDisplayList.push(assessmentCriteria)
          })
        }
        criteriaGroup["assessmentCriteriaList"] = res
        criteriaGroup["listChangeDisplay"] = res
      });
      this.lstAssessmentCriteriaGroup.push(criteriaGroup)
      this.lstAssessmentCriteriaGroup["assessmentCriteriaList"]
    }
  }

  /**
   * upCriteriaGroup
   * param indexCriteriaGroup
   */
  public upCriteriaGroup(indexCriteriaGroup: number) {
    if (indexCriteriaGroup === 0) {
      return;
    }
    const formArray = this.lstAssessmentCriteriaGroup;
    const signerTemp = formArray[indexCriteriaGroup];
    formArray[indexCriteriaGroup] = formArray[indexCriteriaGroup - 1];
    formArray[indexCriteriaGroup - 1] = signerTemp;
  }

  /**
   * downCriteriaGroup
   * param indexCriteriaGroup
   */
  public downCriteriaGroup(indexCriteriaGroup: number) {
    const formArray = this.lstAssessmentCriteriaGroup;
    if (indexCriteriaGroup === formArray.length) {
      return;
    }
    const signerTemp = formArray[indexCriteriaGroup];
    formArray[indexCriteriaGroup] = formArray[indexCriteriaGroup + 1];
    formArray[indexCriteriaGroup + 1] = signerTemp;
  }

  /**
   * removeCriteriaGroup
   * param indexCriteriaGroup
   * param item
   */
  public removeCriteriaGroup(indexCriteriaGroup: number, item: any) {
    const criteriaGroup = this.lstAssessmentCriteriaGroup[indexCriteriaGroup];
    this.lstAssessmentCriteriaGroup.splice(indexCriteriaGroup, 1);
    this.assessmentCriteriaGroupIdList = this.assessmentCriteriaGroupIdList.filter(id => id !== criteriaGroup.assessmentCriteriaGroupId)
    if (this.assessmentCriteriaGroupIdList.length > 0) {
      this.filterCondition = "AND obj.assessment_criteria_group_status = 2 AND obj.assessment_criteria_group_id NOT IN (" + this.assessmentCriteriaGroupIdList.join(",") + ")"
    } else {
      this.filterCondition = "AND obj.assessment_criteria_group_status = 2"
    }
    /** Process remove criteria from list display */
    this.criteriaDisplayList = this.criteriaDisplayList.filter(criteria => criteria.assessmentCriteriaGroupId !== item.assessmentCriteriaGroupId);
  }

  /**
   * upCriteria
   * param indexGroup , indexCriteria
   */
  public upCriteria(indexGroup: number, indexCriteria: number) {
    if (indexCriteria === 0) {
      return;
    }
    const groupList = this.lstAssessmentCriteriaGroup;
    const groupCurrent = groupList[indexGroup];
    const criteriaList = groupCurrent["assessmentCriteriaList"]
    const criteriaCurrent = criteriaList[indexCriteria];
    criteriaList[indexCriteria] = criteriaList[indexCriteria - 1];
    criteriaList[indexCriteria - 1] = criteriaCurrent;
  }

  /**
   * downCriteria
   * param index
   */
  public downCriteria(indexGroup: number, indexCriteria: number) {
    const groupList = this.lstAssessmentCriteriaGroup;
    const groupCurrent = groupList[indexGroup];
    const criteriaList = groupCurrent["assessmentCriteriaList"]
    if (indexCriteria === criteriaList.length - 1) {
      return;
    }
    const criteriaCurrent = criteriaList[indexCriteria];
    criteriaList[indexCriteria] = criteriaList[indexCriteria + 1];
    criteriaList[indexCriteria + 1] = criteriaCurrent;
  }

  // Build list bieu thuc
  private makeDefaultExpressionEvaluateForm(): FormGroup {
    const formGroup = this.buildForm({}, this.formExpressionEvaluate);
    return formGroup;
  }

  public addNextExpressionRow(index: number, item: FormGroup) {
    const controls = this.lstExpressionEvaluate as FormArray;
    controls.insert(index + 1, this.makeDefaultExpressionEvaluateForm());
  }

  public removeNextExpressionRow(index: number, item: FormGroup) {
    const controls = this.lstExpressionEvaluate as FormArray;
    if (controls.length === 1) {
      const group = this.makeDefaultExpressionEvaluateForm();
      controls.push(group);
      this.lstExpressionEvaluate = controls;
    }
    controls.removeAt(index);
  }

  /**
   * buildFormExpressionEvaluate
   */
  private buildFormExpressionEvaluate(data?: any) {
    if (!data) {
      data = [{}];
    }
    const controls = new FormArray([]);
    for (const item of data) {
      const group = this.makeDefaultExpressionEvaluateForm();
      group.patchValue(item);
      controls.push(group);
    }
    this.lstExpressionEvaluate = controls;
  }

  private checkDisplay(criteria: any, listChangeDisplay: any[]): boolean {
    let isDisplay: boolean = false;
    listChangeDisplay.forEach(itemDisplay => {
      if (criteria.assessmentCriteriaId === itemDisplay.assessmentCriteriaId) {
        isDisplay = true;
      }
    })
    return isDisplay
  }

  // Save data
  public processSaveOrUpdate() {
    /** Validate form before save */
    if (!this.validateBeforeSave()) {
      return;
    }
    
    // modify display from lstAssessmentCriteriaGroup
    let assessmentCriteriaGroupList = _.cloneDeep(this.lstAssessmentCriteriaGroup)
    assessmentCriteriaGroupList.forEach(element => {
      const list = element.assessmentCriteriaList.filter(item => this.checkDisplay(item, element.listChangeDisplay))
      element.assessmentCriteriaList = list
    });

    // + modify order of group and item from lstAssessmentCriteriaGroup
    assessmentCriteriaGroupList.forEach((element, index) => {
      element['assessmentCriteriaGroupOrder'] = index
      element.assessmentCriteriaList.forEach((e, idx) => {
        e['assessmentCriteriaOrder'] = idx
      });
    });
  
    const formSave = {};
    let index = 0;
    let countExpressionPoint = 0;
    let countExpressionResult = 0;
    let countExpressionLevel = 0;
    let countExpressionLevelStatus = 0;
    this.lstExpressionEvaluate.controls.forEach(item => {
      item.get('assessmentExpressionEvaluateOrder').setValue(index++);
      if (item.get('assessmentExpressionType').value === 1) {
        countExpressionResult++
      }
      if (item.get('assessmentExpressionType').value === 2) {
        countExpressionPoint++
      }
      if (item.get('assessmentExpressionType').value === 3) {
        countExpressionLevel++
      }
      if (item.get('assessmentExpressionType').value === 4) {
        countExpressionLevelStatus++
      }
    });
    // if (countExpressionPoint > 1 || countExpressionPoint < 1 || countExpressionResult > 1 || countExpressionResult < 1) {
    //   this.app.warningMessage('assessment.expression.not.choose.one');
    //   return ;
    // }
    if (countExpressionLevel > 1) {
      this.app.warningMessage('assessment.expression.level.max');
      return ;
    }
    if (countExpressionLevelStatus > 1) {
      this.app.warningMessage('assessment.expression.levelStatus.max');
      return ;
    }
    formSave['assessmentFormulaId'] = this.assessmentFormulaId;
    formSave['assessmentFormulaName'] = this.formSave.get('assessmentFormulaName').value;
    formSave['assessmentExpressionEvaluateList'] = this.lstExpressionEvaluate.value;
    formSave['assessmentFormulaMappingCriteriaGroupList'] = assessmentCriteriaGroupList;
    
    this.app.confirmMessage(null, () => { 
      this.assessmentFormulaService.saveOrUpdate(formSave).subscribe(res => {
        if (this.assessmentFormulaService.requestIsSuccess(res)) {
          this.router.navigate(['/employee/assessment-formula']);
        }
      })
    }, () => { // on rejected

    })
  }

  /**
   * validateBeforeSave
   */
  private validateBeforeSave(): boolean {
    const isValidFormSave = CommonUtils.isValidForm(this.formSave)
    // const isValidExpressionEvaluate = CommonUtils.isValidForm(this.lstExpressionEvaluate)

     /** Validate khong co nhom tieu chi nao duoc chon */
     let isValidGroup: boolean = true
     if (this.lstAssessmentCriteriaGroup.length === 0) {
      this.app.warningMessage('selectAssessmentCriteriaGroup');
      isValidGroup = false;
    }

    let isValidChangeDisplay: boolean = true
    this.lstAssessmentCriteriaGroup.forEach(element => {
      if (element.listChangeDisplay.length === 0) {
        isValidChangeDisplay = false
      }
    });
    if (!isValidChangeDisplay) {
      this.app.warningMessage('notExistAssessmentCriteria')
      return
    }

    return isValidFormSave /*&& isValidExpressionEvaluate*/ && isValidGroup && isValidChangeDisplay
  }

    /**
   * handle change list change display
   */
  public handleChangeAllListDisplay(indexGroup: number) {
    const group = this.lstAssessmentCriteriaGroup[indexGroup]
    if (group && group.assessmentCriteriaList) {
      const isChecked = group.listChangeDisplay.length > 0
      group.assessmentCriteriaList.forEach(criteria => {
        if (isChecked) {
          criteria.disabled = false
        } else {
          criteria.disabled = true
          criteria.required = 0
          criteria.resultFinal = 0
        }
      })
    }
    let arr = [];
    this.lstAssessmentCriteriaGroup.forEach(element => {
      if (element.listChangeDisplay) {
        element.listChangeDisplay.forEach((e: any) => {
          arr.push(e)
        });
      }
    });
    this.criteriaDisplayList = arr;
  }

  /**
   * handle change list change display
   */
  public handleChangeItemListDisplay(indexGroup: number, criteriaItem: any) {
    const group = this.lstAssessmentCriteriaGroup[indexGroup]
    if (group && group.listChangeDisplay) {
      const found = group.listChangeDisplay.some(itemDisplay => itemDisplay.assessmentCriteriaId === criteriaItem.assessmentCriteriaId)
      if (found) {
        criteriaItem.disabled = false
      } else {
        criteriaItem.disabled = true
        criteriaItem.required = 0
        criteriaItem.resultFinal = 0
      }
    } else {
      criteriaItem.disabled = true
      criteriaItem.required = 0
      criteriaItem.resultFinal = 0
    }
    let arr = [];
    this.lstAssessmentCriteriaGroup.forEach(element => {
      if (element.listChangeDisplay) {
        element.listChangeDisplay.forEach((e: any) => {
          arr.push(e)
        });
      }
    });
    this.criteriaDisplayList = arr;
  }

  public onClickRequireCriteria(event, criteriaItem: any) {
    if (event.target.checked) {
      criteriaItem.required = 1;
    } else {
      criteriaItem.required = 0;
    }
  }

  public onClickResultFinal(event, criteriaItem: any) {
    if (event.target.checked) {
      criteriaItem.resultFinal = 1;
    } else {
      criteriaItem.resultFinal = 0;
    }
  }

  /**
   * Chia danh sach tieu chi danh gia 
   * 
   * @param criteriaListForDisplay
   */
  public getCriteriaListForDisplay() {
    let i: number, j: number, criteriaListForDisplay = [], chunk = 2;
    if (this.criteriaDisplayList.length > 0) {
        for (i = 0, j = this.criteriaDisplayList.length; i < j; i += chunk) {
          const splitCriteriaList = this.criteriaDisplayList.slice(i, i + chunk);
          criteriaListForDisplay.push(splitCriteriaList);
        }
    }
    return criteriaListForDisplay
  }
  /**
   * Go to criteria view
   * 
   * @param criteriaId
   */
  public goToCriteriaView(criteriaId: number) { 
    if (criteriaId > 0) {
      this.staffAssessmentCriteriaService.findOne(criteriaId)
      .subscribe(res => { 
        if (res.data) {
          this.activeModal(res.data);
        }
      });
    }
  }
  /**
   * Pop-up view criteria
   * 
   * @param data
   */
  private activeModal(data?: any) {
    const modalRef = this.modalService.open(StaffAssessmentCriteriaFormComponent, DEFAULT_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.getViewCriteria(data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.staffAssessmentCriteriaService.requestIsSuccess(result)) {
        this.processSearch();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }
}
