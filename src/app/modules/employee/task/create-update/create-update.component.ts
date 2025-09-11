import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import {
  ACTION_FORM, APP_CONSTANTS, PartyOrganizationService,
} from '@app/core';
import { AppComponent } from '@app/app.component';
import { DialogService } from 'primeng/api';
import { HelperService } from '@app/shared/services/helper.service';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { FileControl } from '@app/core/models/file.control';
import { Router } from '@angular/router';
import { TranslationService } from 'angular-l10n';
import { ThoroughContentService } from '@app/core/services/thorough-content/thorough-content.service';
import { ExamQuestionSetService } from '@app/core/services/thorough-content/exam-question-set.service';
import { HrStorage } from '@app/core/services/HrStorage';
import { PartyMemebersService } from '@app/core/services/party-organization/party-members.service';
import { MultiFileChooserV2Component } from '@app/shared/components/file-chooser/multi-file-chooser-v2.component';
import { TaskService } from '@app/core/services/thorough-content/task.service';
import { PartyOrgSelectorComponent } from '@app/shared/components/party-org-selector/party-org-selector.component';

@Component({
  selector: 'create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.css']
})
export class CreateOrUpdateComponent extends BaseComponent implements OnInit {
  @ViewChild('multiFileChooser') multiFileChooser: MultiFileChooserV2Component;
  employeeId: number;
  viewMode;
  updateMode;
  formGroup: FormGroup;
  header;
  isCreate = false;
  isMobileScreen: boolean = false;
  isAssignee = false;
  formConfig = {
    taskId: [null],
    title: [null, ValidationService.required], // tiêu đề, tên công việc 
    branch: [null, ValidationService.required], // lĩnh vực
    type: [null, ValidationService.required], // Loại công việc
    assignor: ['', [ValidationService.required]], // Người giao
    assignee: [''],
    assignmentUnit: [null, ValidationService.required], // đơn vị giao
    assignedUnit: [null, ValidationService.required], // đơn vị thực hiện
    assignedTime: [null, ValidationService.required], // Ngày bắt đầu
    deadline: [null, ValidationService.required], // Hạn hoàn thành
    status: [{ id: 0, name: this.translation.translate('label.thorough-content.task.status-0') }, ValidationService.required], // trạng thái 
    priority: [null, ValidationService.required], // Mức ưu tiên 
    description: [null], // Mô tả 
  };

  branchOptions = [{ value: 1, label: this.translation.translate('label.thorough-content.branch-1'), disabled: false },
    { value: 2, label: this.translation.translate('label.thorough-content.branch-2'), disabled: false },
    { value: 3, label: this.translation.translate('label.thorough-content.branch-3'), disabled: false },
    { value: 4, label: this.translation.translate('label.thorough-content.branch-4'), disabled: false },
    { value: 5, label: this.translation.translate('label.thorough-content.branch-5'), disabled: false },
    { value: 6, label: this.translation.translate('label.thorough-content.branch-6'), disabled: false },
    { value: 7, label: this.translation.translate('label.thorough-content.branch-7'), disabled: false }];

  taskOptions = [{ id: 1, name: this.translation.translate('label.thorough-content.task-1') },
    { id: 2, name: this.translation.translate('label.thorough-content.task-2') },
  ];

  statusOptions = [{ id: 0, name: this.translation.translate('label.thorough-content.task.status-0') },
    { id: 1, name: this.translation.translate('label.thorough-content.task.status-1') },
    { id: 2, name: this.translation.translate('label.thorough-content.task.status-2') },
  ];

  priorityOptions = [{ id: 1, name: this.translation.translate('label.thorough-content.task.priority-1') },
  { id: 2, name: this.translation.translate('label.thorough-content.task.priority-2') },
  { id: 3, name: this.translation.translate('label.thorough-content.task.priority-3') }];

  examQuestionSetOptions = [];

  get names(): FormArray {
    return this.formGroup.get('names') as FormArray;
  }

  // typeOptions = [{ id: 1, name: this.translation.translate('label.thorough-content.type-1') },
  //   { id: 2, name: this.translation.translate('label.thorough-content.type-2') }];

  emptyFilterMessage = this.translation.translate('selectFilter.emptyFilterMessage');
  taskId = null;

  userInfo = {employeeId: null, organizationId: null};

  parentThoroughDate;
  resourceCode = 'CTCT_THOROUGH_CONTENT';
  userDomain;

  editableThoroughed = false;

  filterCondition = " AND 0=1";

  constructor(
    private app: AppComponent,
    public dialogService: DialogService,
    public helperService: HelperService,
    // private fileStorageService: FileStorageService,
    private router: Router,
    private service: TaskService,
    private thoroughContentService: ThoroughContentService,
    private examQuestionSetService: ExamQuestionSetService,
    private partyMemebersService: PartyMemebersService,
    private formBuilder: FormBuilder,
    private partyOrganizationService: PartyOrganizationService,
    public translation: TranslationService
  ) {
    super();
    this.setMainService(this.service);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;

    this.userInfo = HrStorage.getUserToken().userInfo;
    console.log("data nhan vien tai khoan test", HrStorage.getUserToken());
    this.userDomain = HrStorage.getUserToken().userPermissionList.find(item => item.resourceCode == this.resourceCode);
    this.viewMode = this.router.url == '/employee/thorough-content/view';

    this.formGroup = this.formBuilder.group({
      ...this.formConfig,
      names: this.formBuilder.array([])
    });
    const filesControl = new FileControl(null);
    this.formGroup.addControl('fileList', filesControl);

    this.thoroughContentService.getBranchList().subscribe(resBranch => {
      this.branchOptions.forEach(item => {
        if (!resBranch.data.includes(item.value)) {
          item.disabled = true;
        }
      });
    });
    
  }

  ngOnInit() {

    if (history.state.taskId) {

      this.header = "Cập nhật công việc";
      this.viewMode = history.state.modeView;
      if(this.viewMode == 1){
        this.header = "Xem chi tiết công việc";
      }
      this.updateMode = history.state.updateMode;
      this.taskId = history.state.taskId;
      this.service.findOne(history.state.taskId).subscribe(res => {
        this.buildFormTaskSet(res.data);
        const filesControl = new FileControl(null);
        if (res.data && res.data.fileAttachment) {
          if (res.data.fileAttachment.attachmentFileList) {
            filesControl.setFileAttachment(res.data.fileAttachment.attachmentFileList);
          }
        }
        this.formGroup.addControl('fileList', filesControl);
        this.formGroup.get('assignmentUnit').valueChanges.subscribe(value => {
          if (value) {
            this.filterCondition = ` AND obj.employee_id IN (SELECT pm.employee_id
              FROM party_member pm
              JOIN party_organization po ON pm.party_organization_id = po.party_organization_id
              WHERE po.org_path LIKE CONCAT('%/', ${value} , '/%'))`;
          } else {
            this.filterCondition = " AND 0=1";
          }
        });

        if(res.data.assignedUnit != undefined && res.data.assignedUnit != null){
          this.formGroup.setControl('assignedUnit', this.formBuilder.array([res.data.assignedUnit]));
        }
        if(res.data.assignee != undefined && res.data.assignee != null){
          this.formGroup.setControl('assignee', this.formBuilder.array([res.data.assignee]));
        }
        this.setNames(res.data.names);
        this.initUpdate();
        if(res.data.type == 1){

          this.formGroup.get('assignee').setValidators([ValidationService.required]);

          this.formGroup.setControl('assignedUnit', this.formBuilder.array([]));
          this.formGroup.get('assignedUnit').clearValidators();
          this.formGroup.get('assignedUnit').setErrors(null);
          this.isAssignee = true;

        }else{

          this.formGroup.get('assignedUnit').setValidators([ValidationService.required]);

          this.formGroup.setControl('assignee', this.formBuilder.array([]));

          this.formGroup.get('assignee').clearValidators();
          this.formGroup.get('assignee').setErrors(null);
          this.isAssignee = false;

        }

      })
    } else if(history.state.taskId == null && history.state.createdByStr == "ROBOT" ) {
      this.header = "Thông tin biểu mẫu"
      this.viewMode = history.state.modeView;
      this.buildFormTaskSet(history.state);

      const filesControl = new FileControl(null);
      if (history.state && history.state.fileAttachment) {
        if (history.state.fileAttachment.attachmentFileList) {
          filesControl.setFileAttachment(history.state.fileAttachment.attachmentFileList);
        }
      }
      this.formGroup.addControl('fileList', filesControl);
      if(history.state.assignedUnit != undefined && history.state.assignedUnit != null){
        this.formGroup.setControl('assignedUnit', this.formBuilder.array([history.state.assignedUnit]));
      }
      if(history.state.assignee != undefined && history.state.assignee != null){
        this.formGroup.setControl('assignee', this.formBuilder.array([history.state.assignee]));
      }
      // this.setNames(history.state.names);
      this.initUpdate();
      if(history.state.type == 1){

        this.formGroup.get('assignee').setValidators([ValidationService.required]);

        this.formGroup.setControl('assignedUnit', this.formBuilder.array([]));
        this.formGroup.get('assignedUnit').clearValidators();
        this.formGroup.get('assignedUnit').setErrors(null);
        this.isAssignee = true;

      }else{

        this.formGroup.get('assignedUnit').setValidators([ValidationService.required]);

        this.formGroup.setControl('assignee', this.formBuilder.array([]));

        this.formGroup.get('assignee').clearValidators();
        this.formGroup.get('assignee').setErrors(null);
        this.isAssignee = false;

      }
    } else {
      this.formGroup.controls['assignee'] = new FormArray([]);
      this.formGroup.controls['assignedUnit'] = new FormArray([]);
      this.header = "Thông tin thêm mới";
      this.isCreate = true;
      
      this.formGroup.get('assignmentUnit').valueChanges.subscribe(value => {
        if (value) {
          this.filterCondition = ` AND obj.employee_id IN (SELECT pm.employee_id
            FROM party_member pm
            JOIN party_organization po ON pm.party_organization_id = po.party_organization_id
            WHERE po.org_path LIKE CONCAT('%/', ${value} , '/%')) AND obj.status = 1`;
        } else {
          this.filterCondition = " AND 0=1";
        }
      });
    }
  }

  previous() {
    this.router.navigateByUrl('/employee/task');
  }

  get f() {
    return this.formGroup.controls;
  }

  save(thorough: boolean) {
    let isCheck = false;
    if (!CommonUtils.isValidForm(this.formGroup)) {
      return;
    }
    this.saveData(thorough);
  }

  saveData(thorough: boolean) {
    // check luu : 
    const deadline = this.formGroup.value['deadline'] instanceof Date ? this.formGroup.value['deadline'].getTime() : this.formGroup.value['deadline'];
    const assignedTime = this.formGroup.value['assignedTime'] instanceof Date ? this.formGroup.value['assignedTime'].getTime() : this.formGroup.value['assignedTime'];
    const isCheck = deadline > (assignedTime ? assignedTime : new Date()) && (deadline > new Date());
    if(!isCheck){
      return;
    }
    const copiedForm = this.cloneFormGroup(this.formGroup);
    // copiedForm.controls['branch'].setValue(this.formGroup.value['branch'] ? this.formGroup.value['branch'].value : null);
    // copiedForm.controls['type'].setValue(this.formGroup.value['type'] ? this.formGroup.value['type'].id : null);
    copiedForm.controls['type'].setValue(this.formGroup.value['type'] ? this.formGroup.value['type'].id : null);
    copiedForm.controls['status'].setValue(this.formGroup.value['status'] ? this.formGroup.value['status'].id : null);
    copiedForm.controls['priority'].setValue(this.formGroup.value['priority'] ? this.formGroup.value['priority'].id : null);
    copiedForm.controls['deadline'].setValue(this.formGroup.value['deadline']
      && this.formGroup.value['deadline'] instanceof Date
      ? this.formGroup.value['deadline'].getTime() : this.formGroup.value['deadline']);

    // Lưu lại : 
    console.log('data form group khi luu ', copiedForm);
    this.app.confirmMessage(null,
      () => {
        this.service.saveOrUpdateV2(copiedForm.value)
          .subscribe(res => {
            // if (res.code == "success" && history.state.thoroughContentId) {
            //   this.router.navigateByUrl('/employee/thorough-content/view', { state: this.formGroup.value });
            // } else if (res.code == "success") {
            //   this.router.navigateByUrl('/employee/thorough-content');
            // }
            if (res.code == "success") {
              this.router.navigateByUrl('/employee/task');
            }
          });
      },
      () => {
      }
    )

  }

  navigate() {
    this.router.navigateByUrl('/employee/thorough-content/create-update', { state: this.formGroup.value });
  }

  cloneFormGroup(formGroup: FormGroup): FormGroup {
    const copiedControls = {};
    Object.keys(formGroup.controls).forEach(controlName => {
      const control = formGroup.controls[controlName];
      copiedControls[controlName] = new FormControl(control.value);
    });
    return new FormGroup(copiedControls);
  }

  addChecklist() {
    const name = this.formBuilder.group({
      name: ['', [Validators.required]],
      isTrue: [false]
    });
    this.names.push(name);
  }

  removeChecklist(index: number): void {
    this.names.removeAt(index);
  }

  buildFormTaskSet(data) {
    this.formGroup = this.formBuilder.group({
        taskId: [data.taskId],
        title: [data.title, ValidationService.required], // tiêu đề, tên công việc 
        branch: [data.branch, ValidationService.required], // lĩnh vực
        type: [data.type, ValidationService.required], // Loại công việc
        assignor: [data.assignor, ValidationService.required], // Người giao
        assignmentUnit: [data.assignmentUnit,  ValidationService.required], // đơn vị giao
        assignedUnit: this.formBuilder.array([]).push(this.formBuilder.control(data.assignedUnit)), // đơn vị thực hiện
        assignee: this.formBuilder.array([]).push(this.formBuilder.control(data.assignee)),
        assignedTime: [data.assignedTimeDetail,  ValidationService.required], // Ngày bắt đầu
        deadline: [data.deadlineDetail,  ValidationService.required], // Hạn hoàn thành
        status: [data.status,  ValidationService.required], // trạng thái 
        priority: [data.priority,  ValidationService.required], // Mức ưu tiên 
        description: [data.description], // Mô tả
        names: this.formBuilder.array([]), 
    });
  }

  initUpdate(){
    this.formGroup.get('status').reset(this.getSelectedItem(this.statusOptions, 'id', this.formGroup.get('status').value));
    this.formGroup.get('priority').reset(this.getSelectedItem(this.priorityOptions, 'id', this.formGroup.get('priority').value));
    this.formGroup.get('type').reset(this.getSelectedItem(this.taskOptions, 'id', this.formGroup.get('type').value));
  }

  setNames(data: any[]): void {
    const answerArray = this.formGroup.get('names') as FormArray;
  
    data.forEach(item => {
      const answerGroup = this.formBuilder.group({
        name: [item.name],        // Lấy trường 'answer'
        taskChecklistId: [item.checklistId],
        isTrue: [item.status === 1 || item.status === true]   // Chuyển 0/1 thành true/false
      });
      answerArray.push(answerGroup); // Thêm từng phần tử mới
    });
  }

  getSelectedItem(items, key, value) {
    if (value != undefined && value != null && items != null && items != undefined ) {
      for (let i = 0; i < items.length; i++) {
        if (value == items[i][key]) {
          return items[i];
        }
      }
    } else {
      return null;
    }
  }


  onDropdownChange(value: any): void {
    if (value != undefined && value.id == this.taskOptions[0].id) {
      this.formGroup.get('assignee').setValidators([ValidationService.required]);

      this.formGroup.setControl('assignedUnit', this.formBuilder.array([]));
      this.formGroup.get('assignedUnit').clearValidators();
      this.formGroup.get('assignedUnit').setErrors(null);
      this.isAssignee = true;
    }else if(value != undefined && value.id == 2){
      this.formGroup.get('assignedUnit').setValidators([ValidationService.required]);

      this.formGroup.setControl('assignee', this.formBuilder.array([]));
      this.formGroup.get('assignee').clearValidators();
      this.formGroup.get('assignee').setErrors(null);
      this.isAssignee = false;
    }
  }

  customValidateDate() {
    if (!this.formGroup.value['deadline']) {
      return false;
    }
    const deadline = this.formGroup.value['deadline'] instanceof Date ? this.formGroup.value['deadline'].getTime() : this.formGroup.value['deadline'];
    const assignedTime = this.formGroup.value['assignedTime'] instanceof Date ? this.formGroup.value['assignedTime'].getTime() : this.formGroup.value['assignedTime'];
    const isCheck = deadline > (assignedTime ? assignedTime : new Date()) && (deadline > new Date());
    return !isCheck;
  }

  limitText(event: any): void {
    const maxLength = 500;
    // Ensure the content does not exceed the maximum length
    const control = this.formGroup.get('description');
    console.log('data description', control);
    if (control && control.value && control.value.length > maxLength) {
      control.setValue(control.value.substring(0, maxLength));
    }
  }

  setValueToField(item, data) {
    this.formGroup.get(item).setValue(data);
  }

}
