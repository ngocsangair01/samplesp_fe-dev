import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Router } from '@angular/router';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { AppComponent } from '@app/app.component';
import { DialogService } from 'primeng/api';
import {CommonUtils,ValidationService} from "../../../../shared/services";
import { TranslationService } from 'angular-l10n';
import { TrainingTopicService } from '@app/core/services/training-topic/training-topic.service';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  EmployeeSelectorModalComponent
} from "@app/shared/components/employee-selector/employee-selector-modal/employee-selector-modal.component";
import {DEFAULT_MODAL_OPTIONS} from "@app/core";
import {
  ViewClassComponent
} from "@app/modules/employee/training-topic/training-class/view-class/view-class.component";
import {
  ImportResultClassModalComponent
} from "@app/modules/employee/training-topic/training-class/import-result-class-modal/import-result-class-modal.component";


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
  permissionInsert = false;
  permissionUpdate =false;
  permissionCreateClass =false;
  permissionView = false;
  rewardType: any;
  branch: any;
  formConfig = {
    title: [null],
    thoroughLevel: [null],
    fromStartDate: [null, ValidationService.required],
    toStartDate: [null, ValidationService.required],
    fromEndDate: [null],
    toEndDate: [null],
    parentId: [null],
    issueLevel: [null],
    isTitle: [false],
    isThoroughOrganizationId: [false],
    isFromStartDate: [false],
    isToStartDate: [false],
    isFromEndDate: [false],
    isToEndDate: [false],
    isStatus: [false],
    status: [null],
    requiredThorough: [null],
    isParentId: [false],
    isIssueLevel: [false],
    isYear: [false],
    isObjectType: [false],
    objectTypeTraining: [null],
    year: [null],
    first: [0],
    limit: [10],
  }
  businessTypeOptions
  typeOfReportOptions;
  isMobileScreen: boolean = false;
  tableColumnsConfig   = [
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
      header: "label.training-topic.name",
      width: "200px"
    },
    {
      name: "organizationName",
      header: "label.training-topic.org-tkqt",
      width: "200px"
    },
    {
      name: "objectTypeName",
      header: "label.training-topic.training-objects",
      width: "200px"
    },
    {
      name: "issueLevelName",
      header: "label.training-topic.group",
      width: "200px"
    },
    {
      name: "startDate",
      header: "label.training-topic.deadline-from",
      width: "150px"
    },
    {
      name: "endDate",
      header: "label.training-topic.deadline-to",
      width: "150px"
    },
    {
      name: "finishNumberDate",
      header: "label.training-topic.closing-date",
      width: "200px"
    },
    {
      name: "approveEmployeeName",
      header: "label.training-topic.approveEmployee",
      width: "150px"
    },
    {
      name: "statusName",
      header: "label.training-topic.status",
      width: "150px"
    },
    {
      name: "kpiNumber",
      header: "label.training-topic.kpi-number",
      width: "150px"
    },
    {
      name: "kpiAverage",
      header: "label.training-topic.kpi-average",
      width: "150px"
    },
    {
      name: "kpiGood",
      header: "label.training-topic.kpi-good",
      width: "150px"
    },
    {
      name: "kpiExcellent",
      header: "label.training-topic.kpi-excellent",
      width: "150px"
    },
  ];

  branchNotUpdatableList = [];

  issueLevelOptions = [{ value: 1, label: this.translation.translate('label.training-topic.issue-level-1'), disabled: false },
    { value: 2, label: this.translation.translate('label.training-topic.issue-level-2'), disabled: false },
    { value: 3, label: this.translation.translate('label.training-topic.issue-level-3'), disabled: false }];

  objectTypeOptions = [
    {id: "482", name: this.translation.translate('label.training-topic.object-type-1')},
    {id: "483", name: this.translation.translate('label.training-topic.object-type-2')},
    {id: "484", name: this.translation.translate('label.training-topic.object-type-3')},
    {id: "485", name: this.translation.translate('label.training-topic.object-type-4')},
    {id: "486", name: this.translation.translate('label.training-topic.object-type-5')},
    {id: "481", name: this.translation.translate('label.training-topic.object-type-6')},
  ];

  statusOptions = [{id: 0, name: this.translation.translate('label.training-topic.status-0')},
    {id: 1, name: this.translation.translate('label.training-topic.status-1')},
    {id: 2, name: this.translation.translate('label.training-topic.status-2')},
    {id: 3, name: this.translation.translate('label.training-topic.status-3')},
  ];

  trainingYearOptions = [];

  filterCondition = " AND obj.required_thorough = 1 and obj.status = 1  ORDER BY obj.created_date DESC";
  emptyFilterMessage = this.translation.translate('selectFilter.emptyFilterMessage');
  constructor(
    private router: Router,
    private appParamService: AppParamService,
    private app: AppComponent,
    public dialogService: DialogService,
    private service: TrainingTopicService,
    public translation: TranslationService,
    public modalService: NgbModal,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.trainingTopic"));
    this.setMainService(this.service);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
    this.permissionView = this.hasPermission('action.view','CTCT_TRAINING_CLASS')
    this.permissionInsert = this.hasPermission('action.insert','CTCT_TRAINING_TOPIC' );
    this.permissionUpdate = this.hasPermission('action.update','CTCT_TRAINING_TOPIC' );
    this.permissionCreateClass = this.hasPermission('action.insert','CTCT_TRAINING_CLASS');
  }

  ngOnInit() {
    this.formSearch = this.buildForm('', this.formConfig);
    this.formSearch.get('fromStartDate').setValue(new Date(new Date().getFullYear() - 1, 0, 1).getTime());
    this.formSearch.get('toStartDate').setValue(new Date(new Date().getFullYear() + 1, 11, 31).getTime());
    const currentYear = new Date().getFullYear();
    this.formSearch.controls["year"].setValue(currentYear);
    this.trainingYearOptions = Array.from({length: 11}, (_, i) => ({value: currentYear + i}))
    this.search({first: 0, rows: 10})
  }
  get f() {
    return this.formSearch.controls;
  }

  search(event?) {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    if(event){
      this.formSearch.value['first'] = event.first;
      this.formSearch.value['limit'] = event.rows;
    }
    this.service.search(this.formSearch.value, event).subscribe(res => {
      this.resultList = res;
    });
  }

  getDropDownOptions() {
  }

  navigateToCreatePage(rowData?) {
    if(rowData && rowData.trainingTopicId) {
      this.router.navigateByUrl(`/employee/training-topic/create-update/${rowData.trainingTopicId}`);
    }
    else {
      this.router.navigateByUrl(`/employee/training-topic/create-update`);
    }
  }

  navigateToViewPage(rowData?) {
    this.router.navigateByUrl(`/employee/training-topic/view/${rowData.trainingTopicId}`);
  }

  clonePopup(rowData?){
    this.router.navigateByUrl(`/employee/training-topic/clone/${rowData.trainingTopicId}`);
    // if (CommonUtils.nvl(rowData.thoroughContentId) > 0) {
    //   this.app.confirmMessage("common.message.confirm.clone", () => {// on accepted
    //     this.service.clone(rowData.thoroughContentId)
    //         .subscribe(res => {
    //           if (this.service.requestIsSuccess(res)) {
    //             this.search(null);
    //           }
    //         });
    //   }, () => {// on rejected
    //   });
    // }
  }

  onChangeThoroughLevel() {
    let value = this.formSearch.controls['thoroughLevel'].value;
    if (value) {
      //phan quyen
      this.filterCondition = ` AND obj.required_thorough = 1 and obj.status = 1 and obj.thorough_level in (select po.parent_id from party_organization po where po.party_organization_id = ${value})  ORDER BY obj.created_date DESC`

    } else {
      this.filterCondition = " AND obj.required_thorough = 1 and obj.status = 1  ORDER BY obj.created_date DESC";
    }
  }

  quickDeploy(rowData?) {
    this.router.navigateByUrl(`/employee/training-topic/quick-deploy/${rowData.trainingTopicId}`);
  }

  createClass(rowData?) {
    this.router.navigateByUrl(`/employee/training-topic/create-class/${rowData.trainingTopicId}`);
  }

  // search(event?) {
  //   if (!CommonUtils.isValidForm(this.formSearch)) {
  //     return;
  //   }
  //   if(event){
  //     this.formSearch.value['first'] = event.first;
  //     this.formSearch.value['limit'] = event.rows;
  //   }
  //   this.service.search(this.formSearch.value, event).subscribe(res => {
  //     this.resultList = res;
  //   });
  // }

  deleteTrainingTopic(trainingTopic) {
    this.app.confirmDelete(null,
        () => {
          this.service.deleteById(trainingTopic.trainingTopicId)
              .subscribe(res => {
                this.processSearch();
              })
        },
        () => { }
    )
  }
  viewClass(rowData?) {
    this.router.navigateByUrl(`/employee/training-topic/view-list-class/${rowData.trainingTopicId}`);
  }


  importResultClass(rowData?) {
    const modalRef = this.modalService.open(ImportResultClassModalComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance
        .setInitValue({
          trainingTopicId: rowData.trainingTopicId
        });

    modalRef.result.then((item) => {
      if (!item) {
        return;
      }
    });
  }
}
