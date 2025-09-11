import {Component, OnInit} from '@angular/core';
import { FormGroup} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TreeNode} from 'primeng/api';
import {TrainingTopicService} from "@app/core/services/training-topic/training-topic.service";
import {BaseComponent} from "@app/shared/components/base-component/base-component.component";
import {Router} from "@angular/router";
import {AppComponent} from "@app/app.component";
import {CommonUtils, ValidationService} from "@app/shared/services";

@Component({
  selector: 'view-class',
  templateUrl: './view-class.component.html',
  styleUrls: ['./view-class.component.css']
})
export class ViewClassComponent extends BaseComponent implements OnInit {
  nodes: TreeNode[];
  selectedNode: TreeNode;
  resultList: any = [];
  form: FormGroup;
  params: any;
  permissionCreateClass =false;
  permissionUpdateClass =false;
  trainingTopicId;
  showOrgExpried;
  totalRecords: number;
  first: number = 0;
  formConfig = {
    trainingTopicId: [null],
    trainingClassId: [null],
    title: [null],
    thoroughLevel: [null],
    thoroughLevelName: [null],
    startDate: [null],
    endDate: [null],
    toEndDate: [null],
    isClassId: [false],
    isTitle: [false],
    classId: [null],
    isThoroughOrganizationId: [false],
    isStartDate: [false],
    isEndDate: [false],
    first: [0],
    limit: [10],
  }
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
      name: "name",
      header: "label.training-class.class-name",
      width: "200px"
    },
    {
      name: "classId",
      header: "label.training-class.class-id",
      width: "200px"
    },
    {
      name: "url",
      header: "label.training-class.class-url",
      width: "250px"
    },
    {
      name: "startDate",
      header: "label.training-topic.from-date",
      width: "150px"
    },
    {
      name: "endDate",
      header: "label.training-topic.to-date",
      width: "150px"
    },
    {
      name: "numberAmount",
      header: "label.training-class.number-amount",
      width: "150px"
    },
    {
      name: "averageAmount",
      header: "label.training-class.average-amount",
      width: "150px"
    },
    {
      name: "goodAmount",
      header: "label.training-class.good-amount",
      width: "150px"
    },
    {
      name: "excellentAmount",
      header: "label.training-class.excellent-amount",
      width: "150px"
    },
    {
      name: "failAmount",
      header: "label.training-class.fail-amount",
      width: "150px"
    }
  ];


  isMobileScreen: boolean = false;
  dataError: any;

  parseInt = parseInt;

  list = [];
  listOld = [];

  constructor(
      private service: TrainingTopicService,
      private router: Router,
      private app: AppComponent,
  ) {
    super();
    this.formSearch = this.buildForm('', this.formConfig);
    this.permissionCreateClass = this.hasPermission('action.insert','CTCT_TRAINING_CLASS');
    this.permissionUpdateClass = this.hasPermission('action.update','CTCT_TRAINING_CLASS');
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 4) {
      this.trainingTopicId = subPaths[4]
    }
    this.service.findInfoToCreateTrainingClass(this.trainingTopicId).subscribe(res => {
      if(res.data) {
        this.formSearch.controls['title'].setValue(res.data.titleTrainingTopic)
        this.formSearch.controls['thoroughLevelName'].setValue(res.data.thoroughLevelName)
        this.processSearchClass({first: 0, rows: 10})
      }
    })

  }

  ngOnInit() {

  }



  deleteTrainingClass(trainingClass) {
    this.app.confirmDelete(null,
        () => {
          this.service.deleteTrainingClassId(trainingClass.trainingClassId)
              .subscribe(res => {
                this.processSearchClass();
              })
        },
        () => { }
    )
  }

  processSearchClass(event?) {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }

    this.formSearch.value['trainingTopicId'] = this.trainingTopicId
    if(event){
      this.formSearch.value['first'] = event.first;
      this.formSearch.value['limit'] = event.rows;
    }
    this.service.searchListTrainingClass(this.formSearch.value, event).subscribe(res => {
      this.resultList = res;
    });
  }


  navigateToCreatePage(rowData?) {
    {{debugger}}
    if(rowData && rowData.trainingClassId) {
      this.router.navigateByUrl(`/employee/training-topic/create-update-class/${rowData.trainingTopicId}/${rowData.trainingClassId}`);
    }
    else {
      this.router.navigateByUrl(`/employee/training-topic/create-update-class/${rowData.trainingTopicId}`);
    }
  }

  navigateToViewPage(rowData?) {
    this.router.navigateByUrl(`/employee/training-topic/view-class/${rowData.trainingClassId}`);
  }



  get f() {
    return this.formSearch.controls;
  }

  previous() {
    this.router.navigateByUrl('/employee/training-topic');
  }


  sumStt(a: number, b: number) {
    a = Math.floor(a/10) + a%10;
    b = parseInt(String(b));
    return a + b;
  }

  sum(a: number, b: number) {
    a = parseInt(String(a));
    b = parseInt(String(b));
    return a + b;
  }

}
