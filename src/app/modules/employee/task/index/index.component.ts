import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Router } from '@angular/router';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { AppComponent } from '@app/app.component';
import { DialogService } from 'primeng/api';
import {CommonUtils, ValidationService} from "../../../../shared/services";
import { TranslationService } from 'angular-l10n';
import { ThoroughContentService } from '@app/core/services/thorough-content/thorough-content.service';
import { TaskService } from '@app/core/services/thorough-content/task.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateProgressCompoment } from './update-progress.component';
import { DEFAULT_MODAL_OPTIONS } from '@app/core';
import { HrStorage } from '@app/core/services/HrStorage';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent extends BaseComponent implements OnInit {
  isHidden: boolean = false;
  isMasO: boolean = false;
  isPartyO: boolean = false;
  isOrg: boolean = false;
  rewardType: any;
  branch: any;
  formConfig = {
    title: [null],
    branch: [null],
    assignmentUnit: [null], //Don vi giao viec
    assignor: [null], //Nguoi giao
    assignedUnit: [null], //Don vi thuc hien
    assignee: [null], //Dau moi thuc hien
    fromCreateDate: [null, ValidationService.required],
    toCreateDate: [null, ValidationService.required],
    fromDeadline: [null],
    toDeadline: [null],
    status: [[]],
    priority: [null],   
    type: [{ id: 1, name: this.translation.translate('label.thorough-content.task-1') }, ValidationService.required], // trạng thái 

    employeeId: [null],
    isAssignment: [1],
    defaultDomain: [null],

    isTitle: [false],
    isBranch: [false],
    isAssignmentUnit: [false],
    isAssignor: [false],
    isAssignedUnit: [false],
    isAssignee: [false],
    isFromCreateDate: [false],
    isToCreateDate: [false],
    isFromDeadline: [false],
    isToDeadline: [false],
    isStatus: [false],
    isPriority: [false],
    isType: [false],

    first: [0],
    limit: [10],
  }
  
  isMobileScreen: boolean = false;
  userDomain;
  resourceCode = 'CTCT_THOROUGH_CONTENT';
  filterCondition = "AND 0=1 ORDER BY obj.created_date DESC";
  tableColumnsConfigType1 = [
    {
      header: "common.label.table.action",
      width: "50px"
    },
    {
      header: "common.table.index",
      width: "50px"
    },
    {
      name: "title",
      header: "label.thorough-content.status",
      width: "200px"
    },
    {
      name: "deadline",
      header: "label.thorough-content.task.deadline",
      width: "200px"
    },
    {
      name: "priority",
      header: "label.thorough-content.task.priority",
      width: "200px"
    },
    {
      name: "title",
      header: "label.thorough-content.task.title",
      width: "200px"
    },
    {
      name: "assignorName",
      header: "label.thorough-content.task.assignor",
      width: "200px"
    },
    {
      name: "assignmentUnitName",
      header: "label.thorough-content.task.assignment-unit",
      width: "200px"
    },
    {
      name: "assignedTime",
      header: "label.thorough-content.task.assigned-time",
      width: "150px"
    },
    {
      name: "actualEndTime",
      header: "label.thorough-content.task.actual-end-time",
      width: "200px"
    },
    {
      name: "branchName",
      header: "label.thorough-content.branch",
      width: "200px"
    },
  ];
  tableColumnsConfigType2 = [
    {
      header: "common.label.table.action",
      width: "50px"
    },
    {
      header: "common.table.index",
      width: "50px"
    },
    {
      name: "title",
      header: "label.thorough-content.status",
      width: "200px"
    },
    {
      name: "deadline",
      header: "label.thorough-content.task.deadline",
      width: "200px"
    },
    {
      name: "priority",
      header: "abel.thorough-content.task.priority",
      width: "200px"
    },
    {
      name: "title",
      header: "label.thorough-content.task.title",
      width: "200px"
    },
    {
      name: "assignorName",
      header: "label.thorough-content.task.assignor",
      width: "200px"
    },
    {
      name: "assignmentUnitName",
      header: "label.thorough-content.task.assignment-unit",
      width: "200px"
    },
    {
      name: "assignedUnitName",
      header: "label.thorough-content.task.assigned-unit",
      width: "200px"
    },
    {
      name: "assigneeName",
      header: "label.thorough-content.task.assignee",
      width: "150px"
    },
    {
      name: "assignedTime",
      header: "label.thorough-content.task.assigned-time",
      width: "150px"
    },
    {
      name: "actualEndTime",
      header: "label.thorough-content.task.actual-end-time",
      width: "200px"
    },
    {
      name: "branchName",
      header: "label.thorough-content.branch",
      width: "200px"
    },
  ];

  branchNotUpdatableList = [];

  branchOptions = [{ value: 1, label: this.translation.translate('label.thorough-content.branch-1'), disabled: false },
    { value: 2, label: this.translation.translate('label.thorough-content.branch-2'), disabled: false },
    { value: 3, label: this.translation.translate('label.thorough-content.branch-3'), disabled: false },
    { value: 4, label: this.translation.translate('label.thorough-content.branch-4'), disabled: false },
    { value: 5, label: this.translation.translate('label.thorough-content.branch-5'), disabled: false },
    { value: 6, label: this.translation.translate('label.thorough-content.branch-6'), disabled: false },
    { value: 7, label: this.translation.translate('label.thorough-content.branch-7'), disabled: false }];

    statusOptions = [{ id: 0, name: this.translation.translate('label.thorough-content.task.status-0') },
    { id: 1, name: this.translation.translate('label.thorough-content.task.status-1') },
    { id: 2, name: this.translation.translate('label.thorough-content.task.status-2') },
    { id: 3, name: this.translation.translate('label.thorough-content.task.status-3') },
  ];

  priorityOptions = [{ id: 1, name: this.translation.translate('label.thorough-content.task.priority-1') },
  { id: 2, name: this.translation.translate('label.thorough-content.task.priority-2') },
  { id: 3, name: this.translation.translate('label.thorough-content.task.priority-3') }];

  typeOptions = [{id: 0, name: this.translation.translate('label.thorough-content.status-0')},
    {id: 1, name: this.translation.translate('label.thorough-content.status-1')}];
  taskOptions = [{ id: 1, name: this.translation.translate('label.thorough-content.task-1') },
    { id: 2, name: this.translation.translate('label.thorough-content.task-2') },
  ];

  emptyFilterMessage = this.translation.translate('selectFilter.emptyFilterMessage');

  taskType = 1;
  userInfo = {employeeId: null};
  activeButton: string = 'button1';
  


  constructor(
    private router: Router,
    private appParamService: AppParamService,
    private app: AppComponent,
    private thoroughContentService: ThoroughContentService,
    public dialogService: DialogService,
    private service: TaskService,
    private modalService: NgbModal,
    public translation: TranslationService
  ) {
    super();
    this.setMainService(this.service);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
    this.userInfo = HrStorage.getUserToken().userInfo;
    this.userDomain = HrStorage.getUserToken().userPermissionList.find(item => item.resourceCode == this.resourceCode);
    console.log('data resource cua nguoi dung', this.userDomain);
    this.formSearch = this.buildForm('', this.formConfig);
    
    // Phan linh vuc theo mien : 
    this.thoroughContentService.getBranchList().subscribe(resBranch => {
      this.branchOptions.forEach(item => {
        if (!resBranch.data.includes(item.value)) {
          item.disabled = true;
        }
      });
      
      if (resBranch.data.length > 0) {
        this.filterCondition = `AND obj.status = 1 AND obj.required_thorough = 1
        AND EXISTS (SELECT 1 FROM party_organization po WHERE obj.organization_id = po.party_organization_id
          AND EXISTS (SELECT po2.org_path FROM party_member pm
            INNER JOIN party_member_process pmp ON pm.party_member_id = pmp.party_member_id
            INNER JOIN party_organization po2 ON pmp.party_organization_id = po2.party_organization_id
            WHERE ${this.userInfo.employeeId} = pm.employee_id
            AND po2.party_organization_id != po.party_organization_id
            AND po2.org_path LIKE CONCAT('%/', po.party_organization_id, '/%')
          )
        ) AND obj.branch IN (${resBranch.data.join(",")})
        ORDER BY obj.created_date DESC`;
      }
    });
  }

  ngOnInit() {
    this.formSearch.get('fromCreateDate').setValue(new Date(new Date().getFullYear() - 1, 0, 1).getTime());
    this.formSearch.get('toCreateDate').setValue(new Date(new Date().getFullYear() + 1, 11, 31).getTime());
    console.log(this.formSearch);
    this.getDropDownOptions();
    this.search({first: 0, rows: 10})
  }

  getDropDownOptions() {
    this.service.getBranchList().subscribe(resBranch => {
      this.branchNotUpdatableList = [];
      this.branchOptions.forEach(item => {
        if (!resBranch.data.includes(item.value)) {
          item.disabled = true;

          this.branchNotUpdatableList.push(item.value);
        }
      });
    });
  }

  navigateToCreatePage(rowData?) {
    this.router.navigateByUrl('/employee/task/create-update', { state: rowData });
  }

  navigateToUpdatePage(rowData?) {
    if(rowData.update == true){
      rowData.updateMode = 1;
      this.router.navigateByUrl('/employee/task/create-update', { state: rowData });
    }else{
      this.app.warningMessage('','Công việc chỉ được sửa bởi người tạo hoặc người thuộc đơn vị tạo và không phải là công việc tạo từ quán triệt !');
      return;
    }
  }

  navigateToViewPage(rowData?) {
      rowData.modeView = 1;
      this.router.navigateByUrl('/employee/task/create-update', { state: rowData });
  }

  perform(rowData?){
    if(rowData.createdByStr != "ROBOT"){
      this.app.warningMessage('','Công việc chỉ được thực hiện khi tạo từ quán triệt !');
      return;
    }else{
      this.router.navigateByUrl('/employee/thorough-content/view', { state: rowData });
    }
  }

  updateProgress(rowData?){
    if(rowData.updateProgress == true){
      if(rowData.taskProgressId == undefined || rowData.taskProgressId == null){
        const modalRef = this.modalService.open(UpdateProgressCompoment, DEFAULT_MODAL_OPTIONS);
        modalRef.componentInstance.app = this.app;
        modalRef.componentInstance.setInitValue('insert', rowData);
      }else{
        const modalRef = this.modalService.open(UpdateProgressCompoment, DEFAULT_MODAL_OPTIONS);
        modalRef.componentInstance.app = this.app;
        modalRef.componentInstance.setInitValue('update', rowData);
      }
    }else{
      this.app.warningMessage('','Công việc chỉ được cập nhật bởi người được giao hoặc người thuộc đơn vị được giao và không phải là công việc tạo từ quán triệt !');
      return;
    }
  }

  clonePopup(rowData?){
    this.router.navigateByUrl('/employee/thorough-content/clone', { state: rowData });
  }



  quickDeploy(rowData?) {
    this.router.navigateByUrl('/employee/thorough-content/quick-deploy', { state: rowData });
  }

  search(event?) {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    console.log(this.formSearch.value);
    if(event){
      this.formSearch.value['first'] = event.first;
      this.formSearch.value['limit'] = event.rows;
    }
    this.formSearch.value['employeeId'] = this.userInfo.employeeId;
    this.formSearch.value['defaultDomain'] = this.userDomain.defaultDomain;
    this.service.search(this.formSearch.value, event).subscribe(res => {
      this.resultList = res;
    });
  }

  searchWorkAssignment(event?) {
    if(event){
      this.formSearch.value['first'] = event.first;
      this.formSearch.value['limit'] = event.rows;
    }
    this.formSearch.value['employeeId'] = this.userInfo.employeeId;
    this.formSearch.value['defaultDomain'] = this.userDomain.defaultDomain;
    this.activeButton = "button1";
    this.formSearch.value['isAssignment'] = 1;
    this.taskType = 1;
    this.service.search(this.formSearch.value, event).subscribe(res => {
      this.resultList = res;
    });
  }

  searchWorkAssigned(event?) {
    if(event){
      this.formSearch.value['first'] = event.first;
      this.formSearch.value['limit'] = event.rows;
    }
    this.formSearch.value['employeeId'] = this.userInfo.employeeId;
    this.formSearch.value['defaultDomain'] = this.userDomain.defaultDomain;
    this.activeButton = "button2";
    this.formSearch.value['isAssignment'] = 0;
    this.taskType = 0;
    this.service.search(this.formSearch.value, event).subscribe(res => {
      this.resultList = res;
    });
  }

  deleteTask(task) {
    if(task.delete != true){
      this.app.confirmDelete(null,
        () => {
          this.service.deleteById(task.taskId)
            .subscribe(res => {
                this.search({first: 0, rows: this.formSearch.value.limit});
            })
        },
        () => { }
      );
    }else{
      this.app.warningMessage('','Công việc được tạo từ quán triệt không được phép xóa!');
      return;
    }
    
  }

  viewProgress(rowData?) {
    this.router.navigateByUrl('/employee/progress-track', { state: rowData });
  }

  get f() {
    return this.formSearch.controls;
  }

  setValueToField(item, data) {
    this.formSearch.get(item).setValue(data);
  }

}
