import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { AssessmentFormulaService } from '@app/core/services/assessment-formula/assessment-formula.service';
import { AssessmentPeriodService } from '@app/core/services/assessmentPeriod/assessment-period.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { SettingIconService } from '@app/core/services/setting/setting-icon.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import {CommonUtils, CryptoService, ValidationService} from '@app/shared/services';
import { environment } from '@env/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssessmentCriteriaGroupMappingComponent } from '../assessment-criteria-group-mapping/assessment-criteria-group-mapping.component';
import { AssessmentEmployeeMappingComponent } from '../assessment-employee-mapping/assessment-employee-mapping.component';
import { ACTION_FORM, APP_CONSTANTS, CONFIG, DEFAULT_MODAL_OPTIONS } from './../../../../../core/app-config';
import _ from 'lodash';
import {HrStorage} from "@app/core/services/HrStorage";

@Component({
  selector: 'assessment-period-form',
  templateUrl: './assessment-period-form.component.html',
  styleUrls: ['./assessment-period-form.component.css']
})
export class AssessmentPeriodFormComponent extends BaseComponent implements OnInit {
  public AVATAR_API_URL = environment.serverUrl['political'] + CONFIG.API_PATH['employee-image'] + '/';
  assessmentPeriodId: any;
  formSave: FormGroup;
  formEmployee: FormGroup;
  isHasEmployeeMapping: boolean = false;
  yearList: Array<any>;
  isInsert: boolean = false;
  isEdit: boolean = false;
  isView: boolean = false;
  firstIndex: String;
  firstAssessmentLevelName: String;
  fnSearch;
  // criteria group mapping
  criteriaGroupMappingList: any;
  assessmentTypePartyListIds:any;
  assessmentTypeSQListIds:any;
  formConfig = {
    assessmentPeriodId: [''],
    assessmentPeriodName: ['', [ValidationService.required, Validators.maxLength(500)]],
    formulaId: ['', [ValidationService.required]],
    assessmentTypeId: ['', [ValidationService.required]],
    effectiveDate: ['', [ValidationService.required]],
    expiredDate: [''],
    sendEmail: [''],
    sendSms: [''],
    settingIconId: ['', [ValidationService.required]],
    description: [''],
    extractingTextContent: ['', [ValidationService.required, Validators.maxLength(250)]],
    professions: ['', [ValidationService.required]],
    formalityText: ['', [ValidationService.required]],
    textSymbols: ['', [ValidationService.required, Validators.maxLength(100)]],
    closingDate: [''],
    year: ['', [ValidationService.required]],
    isAutoPromulgate:[''],
    isPartyMemberAssessment: [''],
    assessmentObject: [''],
    levelType: [1,[ValidationService.required]]//Mặc định là loại thường
  }
  formEmployeeConfig = {
    assessmentPeriodId: [''],
    employeeCode: ['', [Validators.maxLength(100)]],
  }
  formulaList: any;
  signImageList: any;
  settingIconList: any;
  assessmentTypeList: any;
  assessmentEmployeeList: any = {};
  // formArray
  formAssessmentLevelGroup: FormArray;
  isHasFormula: boolean = false;
  credentials: any = {};
  formAssessmentSQL: FormArray;
  listCbb: any = [];
  listTextF: any = [];
  levelRoleList: any = [];
  isPartyMemberAssessmentList: any;
  assessmentObjectList: any;
  isMobileScreen: boolean = false;

  //thaida
  assessmentLevelTypeList:any =[];
  constructor(
      private categoryService: CategoryService,
      private router: Router,
      private actRou: ActivatedRoute,
      private app: AppComponent,
      private assessmentPeriodService: AssessmentPeriodService,
      private formBuilder: FormBuilder,
      private assessmentFormulaService: AssessmentFormulaService,
      private modalService: NgbModal,
      private settingIconService: SettingIconService,
      private appParamService: AppParamService
  ) {
    super(null, 'ASSESSMENT_PERIOD');
    this.setMainService(assessmentPeriodService);
    this.buildForms({}); // buildForms screen
    this.buildFormsAssessmentLevelGroup(null); // buildForms assessmentLevel
    this.buildFormsAssessmentPeriodSql(null)
    this.isPartyMemberAssessmentList = APP_CONSTANTS.IS_PARTY_MEMBER_ASSESSMENT_LIST;
    this.assessmentObjectList = APP_CONSTANTS.ASSESSMENT_OBJECT;
    this.assessmentLevelTypeList = APP_CONSTANTS.ASSESSMENT_LEVEL_TYPE_LIST;
    this.yearList = this.getYearList();
    // this.router.events.subscribe((e: any) => {
    //   if (e instanceof NavigationEnd) {
    const params = this.actRou.snapshot.params;
    if (params) {
      this.assessmentPeriodId = params.id;
    }
    //   }
    // })

    this.buildFormEmployee({}) // build form employee
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.ASSESSMENT_PERIOD_TYPE).subscribe(res => {
      this.assessmentTypeList = res.data;
    });
    this.appParamService.appParams("ASSESSMENT_TYPE_PARTY_MEMBER  ").subscribe(res => {
      if(res.data[0] && res.data[0].parValue){
        this.assessmentTypePartyListIds = res.data[0].parValue.split(",");
      }
    });
    this.appParamService.appParams("ASSESSMENT_TYPE_SQ").subscribe(res => {
      if(res.data[0] && res.data[0].parValue){
        this.assessmentTypeSQListIds = res.data[0].parValue.split(",");
      }
    });
    this.signImageList = APP_CONSTANTS.SIGN_IMAGE
    this.levelRoleList = APP_CONSTANTS.LEVEL_ROLE
    this.firstIndex = APP_CONSTANTS.ASSESSMENT_VALUE_DEFAULT.index;
    this.firstAssessmentLevelName = APP_CONSTANTS.ASSESSMENT_VALUE_DEFAULT.assessmentLevelName
    // get formula list
    this.assessmentFormulaService.findAll().subscribe(res => {
      this.formulaList = res.data
    })
    // get icon list
    this.settingIconService.findSettingIconListByIconType("ASSESSMENT_PERIOD_ICON").subscribe(res => {
      this.settingIconList = res.data;
    });
    // Danh sách Ngành
    this.appParamService.appParams('SIGN_BRANCH').subscribe(res => {
      this.listCbb = res.data
    });

    // Danh sách Hình thức văn bản
    this.appParamService.appParams('TEXT_FORM').subscribe(res => {
      this.listTextF = res.data
    });
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  get fEmp() {
    return this.formEmployee.controls;
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 5) {
      this.isInsert = subPaths[5] === 'add';
      this.isEdit = subPaths[5] === 'edit';
      this.isView = subPaths[5] === 'view';
    }
    this.setFormValue(this.assessmentPeriodId);
  }

  get f() {
    return this.formSave.controls;
  }

  /**
   * Build forms
   */
  private buildForms(data?: any): void {
    data['professions'] = data['professions'] ? data['professions'].toString() : ''
    data['formalityText'] = data['formalityText'] ? data['formalityText'].toString() : ''
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, ValidationService.notAffter('effectiveDate', 'expiredDate', 'common.label.endDate'))
    const fileHeader = new FileControl(null, ValidationService.required);
    if (data && data.fileAttachment) {
      if (data.fileAttachment.fileHeaderName) {
        fileHeader.setFileAttachment(data.fileAttachment.fileHeaderName);
      }
    }
    this.formSave.addControl('fileHeader', fileHeader);

    const fileFooter = new FileControl(null);
    if (data && data.fileAttachment) {
      if (data.fileAttachment.fileFooterName) {
        fileFooter.setFileAttachment(data.fileAttachment.fileFooterName);
      }
    }
    this.formSave.addControl('fileFooter', fileFooter);
  }

  private buildFormEmployee(data: any): void {
    this.formEmployee = this.buildForm(data, this.formEmployeeConfig);
    this.formEmployee.controls['assessmentPeriodId'].setValue(this.assessmentPeriodId)
    this.formEmployee.get('employeeCode').valueChanges.subscribe(value => {
      this.processSearchTimeout();
    });
  }
  /**
   * Search timeout employee assessment
   */
  public processSearchTimeout() {
    if (this.fnSearch) {
      clearTimeout(this.fnSearch);
    }
    this.fnSearch = setTimeout(() => {
      const paramsSearch = this.formEmployee.value;
      this.processSearchEmp(paramsSearch)

    }, 1000);
  }

  /**
   * process assessmentLevelList before build
   */
  private processDataLevelBeforeBuild(data) {
    data.forEach(item => {
      item.assessmentCriteriaGroupList.forEach((e, index) => {
        e.assessmentCriteriaGroupOrder = index + 1
        // process group
        if (e.assessmentCriteriaGroupDisplay > 0) {
          e.listChangeDisplay = e.assessmentCriteriaList.filter(item => CommonUtils.nvl(item.assessmentLevelMappingCriteriaId) > 0)
          e.listChangeDisplay.forEach((element, idx) => {
            element.assessmentCriteriaOrder = idx + 1
          });
        } else {
          e.assessmentCriteriaGroupDisplay = 0;
        }
      });
    });
  }
  /**
   * set Form value
   */
  public setFormValue(data?: any) {
    if (data && data > 0) {
      this.assessmentPeriodService.findAllInformationByAssessmentPeriodId(data).subscribe(res => {
        if (res.data.formulaId) {
          this.isHasFormula = true
        } else {
          this.isHasFormula = false
        }
        this.assessmentPeriodService.getStaffMapping({ assessmentPeriodId: this.assessmentPeriodId }).subscribe(resEmp => {
          this.assessmentEmployeeList = resEmp
          if (this.assessmentEmployeeList.data && this.assessmentEmployeeList.data.length > 0) {
            this.isHasEmployeeMapping = true
          }
          this.assessmentFormulaService.getCriteriaMappingInfoByAssessmentFormulaId(res.data.formulaId)
              .subscribe(res => {
                this.criteriaGroupMappingList = res;
              })
        })
        // modify before build
        this.processDataLevelBeforeBuild(res.data.assessmentLevelList)
        this.buildForms(res.data);
        this.buildFormsAssessmentLevelGroup(res.data.assessmentLevelList)
        this.buildFormsAssessmentPeriodSql(res.data.assessmentPeriodSqlList);
      })
    } else {
      this.buildForms({});
    }
  }

  /**
   * Build form assessmentLevel
   */
  private buildFormsAssessmentLevelGroup(assessmentLevelGroupList?: any[]) {
    if (!assessmentLevelGroupList) {
      assessmentLevelGroupList = [{
        assessmentLevelId: null,
        assessmentLevelName: APP_CONSTANTS.ASSESSMENT_VALUE_DEFAULT.assessmentLevelName,
        hasSign: APP_CONSTANTS.ASSESSMENT_VALUE_DEFAULT.hasSign,
        joinAssessment: APP_CONSTANTS.ASSESSMENT_VALUE_DEFAULT.joinAssessment,
        displaySignImage: APP_CONSTANTS.ASSESSMENT_VALUE_DEFAULT.displaySignImage,
        signImage: APP_CONSTANTS.ASSESSMENT_VALUE_DEFAULT.signImage,
        assessmentOrder: APP_CONSTANTS.ASSESSMENT_VALUE_DEFAULT.orderAssessment,
        assessmentCriteriaGroupList: this.criteriaGroupMappingList || [],
        listChangeDisplay: this.criteriaGroupMappingList || [],
        formTypeList: [{ formTypeName: '' }]
      }];
    }
    let controls = new FormArray([])
    assessmentLevelGroupList.forEach((emp, index) => {
      if (emp.hasSign === 0) {
        emp['isDisableHasSign'] = true
      } else {
        emp['isDisableHasSign'] = false
        emp['isDisableJoinAssessment'] = true
        emp['isDisableDisplaySignImage'] = false
      }
      const assessmentOrderValidateList = [Validators.required, ValidationService.number, ValidationService.positiveInteger, Validators.max(127)]
      if (index > 0) {
        assessmentOrderValidateList.push(Validators.min(2))
      }
      const initGroup = this.makeDefaultAssessmentLevelGroupForm(assessmentOrderValidateList);
      const group = this.buildFileAndFormTypeAssessment(initGroup, emp);
      group.patchValue(emp);
      controls.push(group);
    })
    this.formAssessmentLevelGroup = controls;
  }

  /**
   * build file assessment
   * @param group
   */
  buildFileAndFormTypeAssessment(_group, data) {
    const group = _.cloneDeep(_group)
    const fileAssessmentLevel = new FileControl(null);
    const fileAssessmentLevelList = new FileControl(null);
    if (data && data.fileAttachment && data.fileAttachment.fileAssessmentLevel && data.fileAttachment.fileAssessmentLevel[0]) {
      fileAssessmentLevelList.setFileAttachment(data.fileAttachment.fileAssessmentLevel);
    }
    group.addControl('fileAssessmentLevel', fileAssessmentLevel);
    group.addControl('fileAssessmentLevelList', fileAssessmentLevelList);

    // build form type
    if (data && data.formTypeList) {
      let formType = new FormArray([]);
      data.formTypeList.forEach(item => {
        formType.push(this.initFormTypeList())
      });
      group.addControl('formTypeList', formType);
    } else {
      group.addControl('formTypeList', new FormArray([this.initFormTypeList()]));
    }
    return group;
  }

  private initFormTypeList() {
    return new FormGroup({
      formTypeName: new FormControl('', [ValidationService.required])
    });
  }

  /**
   * Initial form assessmentLevel
   */
  private makeDefaultAssessmentLevelGroupForm(assessmentOrderValidateList: any[]): FormGroup {
    const group = {
      assessmentLevelId: [null],
      assessmentLevelName: ['', [ValidationService.required, Validators.maxLength(50)]],
      hasSign: [null],
      joinAssessment: [null],
      displaySignImage: [null],
      signImage: [null, [Validators.required]],
      assessmentOrder: [null, assessmentOrderValidateList],
      assessmentCriteriaGroupList: [[]],
      isDisableHasSign: [true],
      isDisableJoinAssessment: [false],
      isDisableDisplaySignImage: [false],
      assessmentCompleteDate: [null, [ValidationService.required]],
      levelRole: [1],
      haveClose: [1],
    };
    return this.formBuilder.group(group);
  }

  /**
   * add new formGroup assessment level
   */
  public addAssessmentLevel(item?) {
    const controls = this.formAssessmentLevelGroup as FormArray;
    const assessmentOrderValidateList = [Validators.required, Validators.min(2), ValidationService.positiveInteger, Validators.max(127)]
    let itemValue = this.makeDefaultAssessmentLevelGroupForm(assessmentOrderValidateList);
    itemValue.patchValue({
      assessmentLevelId: null,
      hasSign: APP_CONSTANTS.ASSESSMENT_VALUE_DEFAULT.hasSign,
      joinAssessment: APP_CONSTANTS.ASSESSMENT_VALUE_DEFAULT.joinAssessment,
      displaySignImage: APP_CONSTANTS.ASSESSMENT_VALUE_DEFAULT.displaySignImage,
      signImage: APP_CONSTANTS.ASSESSMENT_VALUE_DEFAULT.signImage,
      assessmentOrder: controls.value.length + 1,
      assessmentCriteriaGroupList: this.processDataAfterOnchangeFormula(this.criteriaGroupMappingList || []),
    })
    const rowInsert = this.buildFileAndFormTypeAssessment(itemValue, null)
    controls.insert(item ? controls.controls.indexOf(item) + 1 : controls.length, rowInsert);
  }

  /**
   * remove formGroup assessment level
   */
  public removeAssessmentLevel(item) {
    const index = this.formAssessmentLevelGroup.controls.indexOf(item);
    const controls = this.formAssessmentLevelGroup as FormArray;
    if (controls.length === 0) {
      this.buildFormsAssessmentLevelGroup(null);
    }
    controls.removeAt(index);
    if (this.formAssessmentLevelGroup.controls.length === 0) {
      this.buildFormsAssessmentLevelGroup(null)
    }
  }

  /**
   * modify criteriaGroup
   */
  public setUpCriteriaGroup(item, index, formType) {
    if (item.assessmentCriteriaGroupList.length > 0) {
      const modalRef = this.modalService.open(AssessmentCriteriaGroupMappingComponent, DEFAULT_MODAL_OPTIONS);
      const data = this.getDataCriteriaGroupByFormType(item.assessmentCriteriaGroupList, formType)
      modalRef.componentInstance.setDataList(data)
      modalRef.result.then((result) => {
        if (!result) {
          return;
        }
        const myPromise = new Promise((resolve, reject) => {
          result.forEach(element => {
            element.formType = element.assessmentCriteriaGroupDisplay === 1 ? formType : null;
          });

          resolve(result);
        });
        myPromise.then((data: any) => {
          // item.assessmentCriteriaGroupList = data
          const ids = [];
          data.forEach(element => {
            ids.push(element.assessmentCriteriaGroupId);
          });
          const dataFilter = item.assessmentCriteriaGroupList.filter(i => !ids.includes(i.assessmentCriteriaGroupId));
          const datas = dataFilter.concat(data)
          item.assessmentCriteriaGroupList = datas
          this.formAssessmentLevelGroup.controls[index].setValue(item);
        })
      });
    }
  }

  /**
   * build data from assessmentCriteriaGroupList with formType
   * @param data = assessmentCriteriaGroupList
   * @param formType 1: form 1 | 2: form 2 | 3: form 3
   */
  getDataCriteriaGroupByFormType(data, formType) {
    switch (formType) {
      case 1:
        // nhung records chưa đc dùng hoặc những record được đánh display nhưng chưa có formType hoặc những records thuộc form 1.
        const dataForm1 = data.filter(item => item.assessmentCriteriaGroupDisplay === 0 || (item.assessmentCriteriaGroupDisplay === 1 && !item.formType) || item.formType === 1);
        return dataForm1;
      default:
        // những records chưa đc dùng hoặc những records thuộc form 3
        const dataForm = data.filter(item => item.assessmentCriteriaGroupDisplay === 0 || item.formType === formType);
        return dataForm;
    }
  }

  processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    if (!CommonUtils.isValidForm(this.formAssessmentLevelGroup)) {
      return;
    }
    if (!CommonUtils.isValidForm(this.formAssessmentSQL)) {
      return;
    }
    // control hasSign and joinAssessment
    const index = this.formAssessmentLevelGroup.controls.findIndex(item => !item.value.hasSign && !item.value.joinAssessment)

    if (index && index >= 0) {
      this.app.warningMessage('assessmentPeriod.another')
      return;
    }

    if(this.formSave.controls['levelType'].value === 1){
      const indexHas7 = this.formAssessmentLevelGroup.controls.findIndex(item => item.value.assessmentOrder === 7);
      if (indexHas7 && indexHas7 >= 0) {
        this.app.warningMessage('assessmentPeriod.levelType')
        return;
      }
    }

    const formSave = {}
    // modify assessmentPeriodForm
    this.formSave.controls['sendEmail'].setValue(this.formSave.value.sendEmail ? 1 : 0)
    this.formSave.controls['sendSms'].setValue(this.formSave.value.sendSms ? 1 : 0)
    formSave['assessmentPeriodForm'] = this.formSave.value;
    // modify formAssessmentLevelGroup
    this.formAssessmentLevelGroup.value.forEach(element => {
      element.displaySignImage = element.displaySignImage ? 1 : 0
      element.joinAssessment = element.joinAssessment ? 1 : 0
      element.hasSign = element.hasSign ? 1 : 0
      if (element.assessmentCriteriaGroupList) {
        element.strAssessmentCriteriaGroupList = JSON.stringify(element.assessmentCriteriaGroupList)
      }
      element.assessmentCriteriaGroupList = null
    });
    formSave['assessmentLevelFormList'] = this.formAssessmentLevelGroup.value;
    formSave['assessmentPeriodSqlList'] = this.formAssessmentSQL.value;
    this.app.confirmMessage(null,
        () => { // accept
          this.assessmentPeriodService.saveOrUpdateFormFile(formSave).subscribe(
              res => {
                if (this.assessmentPeriodService.requestIsSuccess(res) && res.data && res.data.assessmentPeriodId) {
                  this.goView(res.data.assessmentPeriodId);
                }
              }
          );
        }, () => { } // reject
    );
  }

  /**
   * modify data to prepare process save or update
   * modify each criteria group
   */
  processDataAfterOnchangeFormula(dataResult) {
    dataResult.forEach(element => {
      element.assessmentCriteriaList = element.listChangeDisplay;
      element.formType = 1;
    });
    return dataResult;
  }

  goBack() {
    this.router.navigate(['/employee/assessment/manager-field/assessment-period']);
  }

  goView(assessmentPeriodId: any) {
    this.router.navigate([`/employee/assessment/manager-field/assessment-period/view/${assessmentPeriodId}`]);
  }

  /**
   * control choose hasSign
   */
  public onchangeHasSign(item) {
    const idx = this.formAssessmentLevelGroup.value.indexOf(item.value);
    if (item.value.hasSign === false) {
      item.controls['displaySignImage'].setValue(false);
    }
    this.formAssessmentLevelGroup.controls[idx] = item;
  }

  /**
   * Onchange assessmentFormula -> get assessment criteria group mapping
   */
  public onchangeFormula(assessmentFormulaId) {
    if (assessmentFormulaId) {
      this.isHasFormula = true
    } else {
      this.isHasFormula = false
    }
    this.assessmentFormulaService.getCriteriaMappingInfoByAssessmentFormulaId(assessmentFormulaId)
        .subscribe(res => {
          this.criteriaGroupMappingList = res;
          // refresh and update
          let dataList = this.formAssessmentLevelGroup.value;
          dataList.forEach((element, index) => {
            element.assessmentCriteriaGroupList = this.processDataAfterOnchangeFormula(res)
            this.formAssessmentLevelGroup.controls[index].setValue(element);
          });
        })
  }

  /**
   * show popup setup employee assessment
   */
  public setupEmployeeAssessment(employeeId) {
    // Show popup
    let dataRequest = {
      assessmentPeriodId: this.assessmentPeriodId,
      employeeId: employeeId
    }
    const modalRef = this.modalService.open(AssessmentEmployeeMappingComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance.setDataList(dataRequest)
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      this.setFormValue(this.assessmentPeriodId);
    });
  }

  public processSearchEmp(event?): void {
    this.formEmployee.controls['assessmentPeriodId'].setValue(this.assessmentPeriodId)
    const params = this.formEmployee ? this.formEmployee.value : null
    this.credentials = Object.assign({}, params)
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0
      }
    }
    const searchData = CommonUtils.convertData(this.credentials)
    if (event) {
      searchData._search =CryptoService.encrAesEcb(JSON.stringify(event))
    }
    const buildParams = CommonUtils.buildParams(searchData);
    this.assessmentPeriodService.getStaffMapping(buildParams).subscribe(res => {
      this.assessmentEmployeeList = res;
    })
  }

  /**
   * Initial form assessment period sql
   */
  private makeDefaultAssessmentSQLForm(): FormGroup {
    return this.formBuilder.group({
      assessmentPeriodSqlId: [null],
      assessmentPeriodId: [null],
      sqlCommand: [null, ValidationService.required],
      sortOrder: [null],
    });
  }

  /**
   * buildFormsAssessmentPeriodSql
   */
  private buildFormsAssessmentPeriodSql(assessmentPeriodSqlList?: any[]) {
    const controls = new FormArray([]);
    if (!assessmentPeriodSqlList || assessmentPeriodSqlList.length === 0) {
      const group = this.makeDefaultAssessmentSQLForm();
      controls.push(group);
    } else {
      for (const assessmentPeriodSql of assessmentPeriodSqlList) {
        const group = this.makeDefaultAssessmentSQLForm();
        group.patchValue(assessmentPeriodSql);
        controls.push(group);
      }
    }
    this.formAssessmentSQL = controls;
  }

  public addAssessmentPeriodSql(item?) {
    const controls = this.formAssessmentSQL as FormArray;
    let itemValue = this.makeDefaultAssessmentSQLForm();
    controls.insert(controls.controls.indexOf(item) + 1, itemValue);
  }

  /**
   * remove formGroup assessment level
   */
  public removeAssessmentPeriodSql(item) {
    const controls = this.formAssessmentSQL as FormArray;
    const index = controls.controls.indexOf(item);
    controls.removeAt(index);
    if (controls.length === 0) {
      this.buildFormsAssessmentPeriodSql(null);
    }
  }

  public onchangeDisplaySignImage(item) {
    const idx = this.formAssessmentLevelGroup.value.indexOf(item.value);
    if (item.value.displaySignImage === true) {
      item.controls['hasSign'].setValue(true);
    }
    this.formAssessmentLevelGroup.controls[idx] = item;
  }

  public getFormTypeList(form) {
    return form.controls.formTypeList.controls;
  }

  public addFormType(form, index) {
    const controls = form.controls.formTypeList;
    controls.insert(index + 1, this.initFormTypeList());
    if (form.value.assessmentCriteriaGroupList.length > 0) {
      form.value.assessmentCriteriaGroupList.forEach(element => {
        if (element.formType && element.formType > (index + 1)) {
          element.formType = element.formType + 1;
        }
      });
    }
  }

  public removeFormType(form, index) {
    const controls = form.controls.formTypeList;
    controls.removeAt(index);
    if (form.value.assessmentCriteriaGroupList.length > 0) {
      form.value.assessmentCriteriaGroupList.forEach(element => {
        if (element.formType && element.assessmentCriteriaGroupDisplay === 1) {
          if (element.formType === (index + 1)) {
            element.assessmentCriteriaGroupDisplay = 0;
            element.listChangeDisplay = [];
            element.assessmentCriteriaList.forEach(item => {
              item['assessmentLevelMappingCriteriaAgain'] = 0;
            });
            element.formType = null;
          } else if (element.formType > (index + 1)) {
            element.formType = element.formType - 1;
          }
        }
      });
    }
  }
  private getYearList() {
    const yearList = [];
    const currentYear = new Date().getFullYear();
    for (let i = (currentYear - 50); i <= (currentYear + 50); i++) {
      const obj = {
        year: i
      };
      yearList.push(obj);
    }
    return yearList;
  }
  public handleChaneAssessmentType(){
    if(this.formSave.value.assessmentTypeId != null){
      if(this.assessmentTypePartyListIds.includes(this.formSave.value.assessmentTypeId.toString())){
        this.formSave.controls["assessmentObject"].setValue(2);
      }
      else if(this.assessmentTypeSQListIds.includes(this.formSave.value.assessmentTypeId.toString())){
        this.formSave.controls["assessmentObject"].setValue(3);
      }
      else {
        this.formSave.controls["assessmentObject"].setValue(1);
      }
    }
  }

  navigate() {
    this.router.navigate(['/employee/assessment/manager-field/assessment-period/edit/', this.assessmentPeriodId]);
  }
}
