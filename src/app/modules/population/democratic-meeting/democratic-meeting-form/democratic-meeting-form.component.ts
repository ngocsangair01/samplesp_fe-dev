import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS } from '@app/core';
import { FileControl } from '@app/core/models/file.control';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { DemocraticMeetingService } from '@app/core/services/population/democratic-meeting.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { AccordionTab } from 'primeng/primeng';

@Component({
  selector: 'democratic-meeting-form',
  templateUrl: './democratic-meeting-form.component.html',
  styleUrls: ['./democratic-meeting-form.component.css']
})
export class DemocraticMeetingFormComponent extends BaseComponent implements OnInit {
  //CODE chu tich
  CATEGORY_CHAIR_CODE: string = 'CHUTRI';
  //CODE BCH
  CATEGORY_BASIS_CODE: string = 'CHUTICH';
  positionMeetingOrgList: any;
  positionMeetingBasisList: any;
  formSave: FormGroup;
  formWorker: FormGroup;
  formContentDialogue: FormGroup;
  formEmployeesDiaglog: FormArray;
  formEmployeesBasis: FormArray;
  formImplementationOrganization: FormGroup;
  democraticMeetingId;
  @ViewChild('compositionDialogueTab') compositionDialogueTab: AccordionTab;
  @ViewChild('contentDialogueTab') contentDialogueTab: AccordionTab;
  @ViewChild('implementationOrganizationTab') implementationOrganizationTab: AccordionTab;

  formWorkerConfig = {
    totalEmployee: [null, [ValidationService.required, ValidationService.maxLength(5), ValidationService.positiveInteger],],
    totalEmployeeAttending: [null, [ValidationService.required, ValidationService.maxLength(5), ValidationService.positiveInteger]],
    totalEmployeeAbsent: [null, [ValidationService.maxLength(5), ValidationService.positiveInteger]],
    absentReason: [null, [ValidationService.required, ValidationService.maxLength(500)]],
  }

  formConfig = {
    democraticMeetingId: [null, [ValidationService.required]],
    documentNumber: [null, [ValidationService.required, ValidationService.maxLength(50)]],
    name: [null, [ValidationService.required, ValidationService.maxLength(200)]],
    organizationName: [null, [ValidationService.required]],
    employeeId: [null, [ValidationService.required]],
    dateMeeting: [null, [ValidationService.required]],
    meetingVenue: [null, [ValidationService.required, ValidationService.maxLength(500)]],
    isMeeting: [null],
  }

  formContentDialogueConfig = {
    totalQuestion: [null, [ValidationService.required, ValidationService.maxLength(5), ValidationService.positiveInteger],],
    totalQuestionAnswered: [null, [ValidationService.required, ValidationService.maxLength(5), ValidationService.positiveInteger]],
    totalQuestionUnanswered: [null, [ValidationService.maxLength(5), ValidationService.positiveInteger]],
    contentDialogue: [null, [ValidationService.required, ValidationService.maxLength(10000)]],
  }

  formImplementationOrganizationConfig = {
    implementationOrganization: [null, [ValidationService.required, ValidationService.maxLength(10000)]],
  }
  public isView: boolean = false;
  
  constructor(
    private curriculumVitaeService: CurriculumVitaeService,
    private formBuilder: FormBuilder,
    private router: Router,
    public actr: ActivatedRoute,
    private democraticMeetingService: DemocraticMeetingService,
    private app: AppComponent,
    private categoryService: CategoryService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.requestDemocraticMeeting"));
    this.buildForms({});
    this.buildFormDiaglog({});
    this.buildFormEmpsDiaglog(null);
    this.buildFormEmpsBasis(null);
    this.buildFormContentDialogue({});
    this.buildFormImplementationOrganization({});
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.democraticMeetingId = params.id;
        }
      }
    });
    if (this.actr.snapshot.paramMap.get('view') === 'view') {
      this.isView = true;
    }
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.CHUCVU_TOCHUC_HOPDANCHU).subscribe(res => {
      this.positionMeetingOrgList = res.data;
    });
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.CHUCVU_BCH_HOPDANCHU).subscribe(res => {
      this.positionMeetingBasisList = res.data;
    });
  }

  ngOnInit() {
    this.setFormValue(this.democraticMeetingId);
  }

  buildForms(data?) {
    this.formSave = this.buildForm(data, this.formConfig);
  }
  buildFormDiaglog(data?) {
    this.formWorker = this.buildForm(data, this.formWorkerConfig);
    const attachFileControl = new FileControl(null, [Validators.required]);
    if (data && data.fileAttachment && data.fileAttachment.employeeListFile) {
      attachFileControl.setFileAttachment(data.fileAttachment.employeeListFile);
    }
    this.formWorker.addControl('files', attachFileControl);
  }

  buildFormContentDialogue(data?) {
    this.formContentDialogue = this.buildForm(data, this.formContentDialogueConfig);
  }

  buildFormImplementationOrganization(data?) {
    this.formImplementationOrganization = this.buildForm(data, this.formImplementationOrganizationConfig);
  }

  get f() {
    return this.formSave.controls;
  }

  get fD() {
    return this.formWorker.controls;
  }

  get fCD() {
    return this.formContentDialogue.controls;
  }

  get fI() {
    return this.formImplementationOrganization.controls;
  }
  /**
   * Tinh tong so cbcnv vang mat
   */
  public changeTotal() {
    if (this.formWorker.get('totalEmployee').value != null && this.formWorker.get('totalEmployeeAttending').value != null) {
      const totalEmployee = this.formWorker.get('totalEmployee').value;
      const totalEmployeeAttending = this.formWorker.get('totalEmployeeAttending').value;
      const totalEmployeeAbsent = totalEmployee - totalEmployeeAttending;
      this.formWorker.get('totalEmployeeAbsent').setValue(totalEmployeeAbsent);
    }
  }

  /**
   * Tinh tong so cau hoi chua duoc tra loi
   */

  public changeTotalQuestion() {
    if (this.formContentDialogue.get('totalQuestion').value != null && this.formContentDialogue.get('totalQuestionAnswered').value != null) {
      const totalQuestion = this.formContentDialogue.get('totalQuestion').value;
      const totalQuestionAnswered = this.formContentDialogue.get('totalQuestionAnswered').value;
      const totalQuestionUnanswered = totalQuestion - totalQuestionAnswered;
      this.formContentDialogue.get('totalQuestionUnanswered').setValue(totalQuestionUnanswered);
    }
  }

  validateBeforeSave(): boolean {
    // Tab thành phần đối thoại
    if (!CommonUtils.isValidForm(this.formEmployeesDiaglog)
      || !CommonUtils.isValidForm(this.formEmployeesBasis)
      || !CommonUtils.isValidForm(this.formWorker)) {
      // Bật tab Thành phần đối thoại nếu có lỗi validate
      this.contentDialogueTab.selected = false;
      this.compositionDialogueTab.selected = true;
      this.implementationOrganizationTab.selected = false;
      return false;
    }
    // Tab nội dung, diễn biến cuộc đối thoại
    if (!CommonUtils.isValidForm(this.formContentDialogue)) {
      this.contentDialogueTab.selected = true;
      this.compositionDialogueTab.selected = false;
      this.implementationOrganizationTab.selected = false;
      return false;
    }
    // Tab tổ chức thực hiện
    if (!CommonUtils.isValidForm(this.formImplementationOrganization)) {
      this.contentDialogueTab.selected = false;
      this.compositionDialogueTab.selected = false;
      this.implementationOrganizationTab.selected = true;
      return false;
    }
    if (!CommonUtils.isValidForm(this.formSave)) {
      return false;
    }
    return true;
  }

  processSaveOrUpdate() {
    if (!this.validateBeforeSave()) {
      return;
    }

    const formSave = {};
    formSave['democraticMeetingId'] = this.democraticMeetingId;
    formSave['documentNumber'] = this.formSave.get('documentNumber').value;
    formSave['name'] = this.formSave.get('name').value;
    formSave['employeeId'] = this.formSave.get('employeeId').value;
    formSave['dateMeeting'] = this.formSave.get('dateMeeting').value;
    formSave['meetingVenue'] = this.formSave.get('meetingVenue').value;
    formSave['totalEmployee'] = this.formWorker.get('totalEmployee').value;
    formSave['totalEmployeeAttending'] = this.formWorker.get('totalEmployeeAttending').value;
    formSave['totalEmployeeAbsent'] = this.formWorker.get('totalEmployeeAbsent').value;
    formSave['absentReason'] = this.formWorker.get('absentReason').value;
    formSave['files'] = this.formWorker.get('files').value;
    formSave['contentDialogue'] = this.formContentDialogue.get('contentDialogue').value;
    formSave['totalQuestion'] = this.formContentDialogue.get('totalQuestion').value;
    formSave['totalQuestionAnswered'] = this.formContentDialogue.get('totalQuestionAnswered').value;
    formSave['totalQuestionUnanswered'] = this.formContentDialogue.get('totalQuestionUnanswered').value;
    formSave['implementationOrganization'] = this.formImplementationOrganization.get('implementationOrganization').value;
    formSave['listDemocraticMeetingDialogue'] = this.formEmployeesDiaglog.value;
    formSave['listDemocraticMeetingBasis'] = this.formEmployeesBasis.value;
    formSave['isMeeting'] = this.formSave.get('isMeeting').value;
    //Check 2 chu tri
    let isDublicateChair = false;
    const meetingPositionChairId = this.findCategoryIDByCode('CHUTRI', this.positionMeetingOrgList);
    isDublicateChair = this.changeMeetingPosition(meetingPositionChairId);
    if (isDublicateChair) {
      return;
    }
    //Check 2 CHU TICH
    let isDublicateChairman = false;
    const meetingPositionChairmanId = this.findCategoryIDByCode('CHUTICH', this.positionMeetingBasisList);
    isDublicateChairman = this.changeMeetingPositionBasis(meetingPositionChairmanId);
    if (isDublicateChairman) {
      return;
    }
    this.app.confirmMessage(null,
      () => { // accept
        this.democraticMeetingService.saveOrUpdateFormFile(formSave).subscribe(
          res => {
            if (this.democraticMeetingService.requestIsSuccess(res)) {
              this.goBack();
            }
          }
        );
      }, () => { } // reject
    );
  }

  public goBack() {
    this.router.navigate(['/population/democratic-meeting']);
  }

  setFormValue(democraticMeetingId) {
    if (democraticMeetingId > 0) {
      this.democraticMeetingService.findBeanById(democraticMeetingId).subscribe(
        res => {
          if (res.data) {
            this.buildForms(res.data);
            this.buildFormDiaglog(res.data);
            if (res.data.listDemocraticMeetingDialogue != "") {
              this.buildFormEmpsDiaglog(res.data.listDemocraticMeetingDialogue);
            }
            if (res.data.listDemocraticMeetingBasis != "") {
              this.buildFormEmpsBasis(res.data.listDemocraticMeetingBasis);
            }
            this.buildFormContentDialogue(res.data);
            this.buildFormImplementationOrganization(res.data);
          }
        }
      );
    }
  }

  /**
* makeDefaultEmpsForm
*/
  private makeDefaultEmpsDiaglogForm(): FormGroup {
    return this.formBuilder.group({
      employeeId: [null, Validators.compose([Validators.required])],
      mainPositionName: [null],
      meetingPositionId: [null, [ValidationService.required]],
      meetingPositionCode: [null]
    });
  }
  /**
   * addEmp
   * param index
   * param item
   */
  public addEmp(index: number, item: FormGroup) {
    const controls = this.formEmployeesDiaglog as FormArray;
    controls.insert(index + 1, this.makeDefaultEmpsDiaglogForm());
  }

  /**
   * removeEmp
   * param index
   * param item
   */
  public removeEmp(index: number, item: FormGroup) {
    const controls = this.formEmployeesDiaglog as FormArray;
    if (controls.length === 1) {
      this.buildFormEmpsDiaglog(null);
    }
    controls.removeAt(index);
  }

  /**
  * buildFormEmps
  */
  private buildFormEmpsDiaglog(listEmp?: any) {
    if (!listEmp) {
      listEmp = [{}];
    }
    const controls = new FormArray([]);
    for (const emp of listEmp) {
      const group = this.makeDefaultEmpsDiaglogForm();
      group.patchValue(emp);
      controls.push(group);
    }
    controls.setValidators(ValidationService.duplicateArray(
      ['employeeId'], 'employeeId', 'recieveNotificationGroup.duplicateEmployee'));
    this.formEmployeesDiaglog = controls;
  }

  /**
 * makeDefaultEmpsForm
 */
  private makeDefaultEmpsBasisForm(): FormGroup {
    return this.formBuilder.group({
      employeeId: [null, Validators.compose([Validators.required])],
      mainPositionName: [null],
      meetingPositionId: [null, [ValidationService.required]],
    });
  }
  /**
   * addEmp
   * param index
   * param item
   */
  public addEmpBasis(index: number, item: FormGroup) {
    const controls = this.formEmployeesBasis as FormArray;
    controls.insert(index + 1, this.makeDefaultEmpsBasisForm());
  }

  /**
   * removeEmp
   * param index
   * param item
   */
  public removeEmpBasis(index: number, item: FormGroup) {
    const controls = this.formEmployeesBasis as FormArray;
    if (controls.length === 1) {
      this.buildFormEmpsBasis(null);
    }
    controls.removeAt(index);
  }

  /**
  * buildFormEmps
  */
  private buildFormEmpsBasis(listEmp?: any) {
    if (!listEmp) {
      listEmp = [{}];
    }
    const controls = new FormArray([]);
    for (const emp of listEmp) {
      const group = this.makeDefaultEmpsDiaglogForm();
      group.patchValue(emp);
      controls.push(group);
    }
    controls.setValidators(ValidationService.duplicateArray(
      ['employeeId'], 'employeeId', 'recieveNotificationGroup.duplicateEmployee'));
    this.formEmployeesBasis = controls;
  }
  /**
   * Lay thông tin nhân viên
   * @param event 
   * @param item 
   */
  public loadUserInfo(event, item: FormGroup) {
    if (event && event.selectField > 0) {
      this.curriculumVitaeService.getEmployeeMainPositionInfo(event.selectField).subscribe(res => {
        item.controls['mainPositionName'].setValue(res.data.mainPositionName);
      })
    } else {
      item.controls['mainPositionName'].setValue(null);
    }
  }

  /**
   * Tai bieu mau 
   */
  processDownloadTemplate() {
    this.democraticMeetingService.downloadTemplateImport().subscribe(res => {
      saveAs(res, 'template_danh_sach_CBCNV.xls');
    });
  }

  //Validate 2 chu tri
  public changeMeetingPosition(event) {
    let isDublicate = false;
    this.positionMeetingOrgList.forEach(poM => {
      if (poM.categoryId == event) {
        if (poM.code === 'CHUTRI') {
          if (this.formEmployeesDiaglog.value.length == 0) {
            return;
          }
          if (this.formEmployeesDiaglog.value.filter(contentDialog => contentDialog.meetingPositionId === event).length < 2) {
            return;
          } else {
            isDublicate = true;
          }
        }
      }
    });
    if (isDublicate) {
      this.app.errorMessage('recieveNotificationGroup.duplicateChair');
    }
    return isDublicate;
  }

  //Validate 2 chu tri
  public changeMeetingPositionBasis(event) {
    let isDublicate = false;
    this.positionMeetingBasisList.forEach(poM => {
      if (poM.categoryId == event) {
        if (poM.code === 'CHUTICH') {
          if (this.formEmployeesBasis.value.length == 0) {
            return;
          }
          if (this.formEmployeesBasis.value.filter(contentDialog => contentDialog.meetingPositionId === event).length < 2) {
            return;
          } else {
            isDublicate = true;
          }
        }
      }
    });
    if (isDublicate) {
      this.app.errorMessage('recieveNotificationGroup.duplicateChairman');
    }
    return isDublicate;
  }

  //Tim Ma Theo ID
  public findCategoryCodeById(cateId: number, categoryList: any) {
    if (categoryList.length == 0) {
      return;
    }
    return categoryList.filter(contentDialog => contentDialog.meetingPositionId === cateId)[0].code;
  }
  //Tim ID theo Mã
  public findCategoryIDByCode(code: string, categoryList: any) {
    if (categoryList.length == 0) {
      return;
    }
    return categoryList.filter(contentDialog => contentDialog.code === code)[0].categoryId;
  }
}