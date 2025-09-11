import {Component, OnInit} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TreeNode} from 'primeng/api';
import {TrainingTopicService} from "@app/core/services/training-topic/training-topic.service";
import {BaseComponent} from "@app/shared/components/base-component/base-component.component";
import {TranslationService} from "angular-l10n";
import {CommonUtils, ValidationService} from "@app/shared/services";
import {Subject} from "rxjs";
import {AppComponent} from "@app/app.component";
import {Router} from "@angular/router";

@Component({
  selector: 'import-result-class-modal',
  templateUrl: './import-result-class-modal.component.html',
})
export class ImportResultClassModalComponent extends BaseComponent implements OnInit {
  nodes: TreeNode[];
  selectedNode: TreeNode;
  formResult: FormArray;
  loadDataIntoForm: Subject<any> = new Subject<any>();
  resultList: any = [];
  orderField;
  empTypeList : boolean = true;
  params: any;
  numIndex = 1;
  firstRowIndex = 0;
  pageSize = 50;
  trainingTopicId;
  dataToLoadIntoForm: any;
  showOrgExpried;
  totalRecords: number;
  first: number = 0;
  formConfig = {
    trainingTopicId: [null],
    trainingClassId: [null, ValidationService.required],
    className: [null],
    classId: [null],
    title: [null],
    url : [null],
    fileImport: [null, ValidationService.required],
    lstResultImport :[]
  }

  tableColumnsConfig   = [
    {
      header: "common.table.index",
      width: "50px"
    },
    {
      name: "employeeCode",
      header: "EmployeeBO.employeeCode",
      width: "100px"
    },
    {
      name: "employeeName",
      header: "EmployeeBO.fullName",
      width: "300px"
    },
    {
      name:"organizationName",
      header: "common.label.unit",
      width: "250px"
    },
    {
      name: "score",
      header: "label.training-class-member.result",
      width: "50px"
    },
    {
      name: "actualDate",
      header: "label.training-class-member.time-test",
      width: "300px"
    },
  ];


  trainingClassOptions = []

  emptyFilterMessage = this.translation.translate('selectFilter.emptyFilterMessage');

  dataError: any;

  parseInt = parseInt;

  list = [];
  listOld = [];

  constructor(
      private app: AppComponent,
      public activeModal: NgbActiveModal,
      private service: TrainingTopicService,
      public translation: TranslationService,
      private router: Router,
  ) {
    super();
  }

  ngOnInit() {
    this.formSearch = this.buildForm('', this.formConfig);
    this.buildFormResult();
    // if(this.dataToLoadIntoForm){
    //   this.setDataToForm(this.dataToLoadIntoForm);
    // }
    // // this.saveData.subscribe(response => {
    // //   if (response) {
    // //     this.processSaveOrUpdate(response)
    // //   }
    // // })
    // this.loadDataIntoForm.subscribe(res => {
    //   if(res){
    //     this.setDataToForm(res);
    //     const control = this.formResult.controls;
    //   }else{
    //     this.buildFormResult();
    //   }
    //
    // })
    // this.orderField = "obj.code, obj.name";
  }

  setInitValue(params: { trainingTopicId: ''}) {
    // debugger
    this.params = params;
    this.trainingTopicId = params.trainingTopicId;
    if(this.trainingTopicId) {
      this.processSearch(this.trainingTopicId);
    }

  }




  public processSearch(trainingTopicId): void {
    // Xu ly trong truong hop click search thi lay them thong tin cau hinh datatable
    // if (!event) {
    //   event = this.getEventDatatable(this.dataTable);
    // }
    this.service.findListTrainingClassByTrainingTopic(trainingTopicId).subscribe(res => {
      if(res) {
        this.formSearch.controls['title'].setValue(res.titleTrainingTopic) ;
        this.trainingClassOptions = res.lstTrainingClassBean ? res.lstTrainingClassBean.map(item => {
          return {
            value: item.trainingClassId,
            label: item.name,
            url: item.url,
          };
        }) : null;
      }
    });

  }

  public onChangeClass() {
    const classId = this.formSearch.controls['trainingClassId'].value;
    if(classId) {
      const url = this.trainingClassOptions.find(item => item.value == classId) ? this.trainingClassOptions.find(item => item.value == classId).url : ""
      this.formSearch.controls['url'].setValue(url)
    }
  }


  close() {
    this.activeModal.close(this.listOld);
  }

  public processSaveImport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    if(this.empTypeList) {
      this.app.warningMessage("training-topic.import");
      return;
    }
    this.formSearch.controls["lstResultImport"].setValue(this.formResult.value)
    this.formSearch.controls["trainingTopicId"].setValue(this.trainingTopicId)
    this.app.confirmMessage(null,
        () => {


      this.service.saveOrUpdateImportFormFile(this.formSearch.value)
                .subscribe(res => {
                  // if (res.code == "success" && history.state.thoroughContentId) {
                  //   this.router.navigateByUrl('/employee/thorough-content/view', { state: this.formGroup.value });
                  // } else if (res.code == "success") {
                  //   this.router.navigateByUrl('/employee/thorough-content');
                  // }
                  if (res.code == "success") {
                      this.clodeModal();
                  }});

        },
        () => {
        }
    )
  }





  get f() {
    return this.formSearch.controls;
  }

  processDownloadTemplate() {
    let rewardObjectType;
    let fileName = "Template kết quả thi";

    this.service.downloadTemplateResultImport().subscribe(res => {
      saveAs(res, fileName);
    });
  }

  public processImport() {
    if (!CommonUtils.isValidForm(this.formSearch) ) {
      return;
    }
    this.formSearch.controls["trainingTopicId"].setValue(this.trainingTopicId)

    this.service.processImportResult(this.formSearch.value).subscribe(res => {
      if (res.type == 'SUCCESS') {
        this.dataError = null;
        this.buildFormResult(res.data);
      }else {
        this.dataError = res.data;
      }
    });
  }

  public setDataToForm(res) {
    this.dataToLoadIntoForm = res;
    this.loadDataIntoForm.next(res.data);
  }

  public buildFormResult(listData?: any) {
    const controls = new FormArray([]);
    if (!listData || listData.length === 0) {
      const group  = this.makeDefaultForm();
      this.empTypeList = true;
      controls.push(group);
    } else {
      this.empTypeList = false;
      for (const i in listData) {
        const param = listData[i];
        const group = this.makeDefaultForm();
        group.patchValue(param);
        controls.push(group);
        this.numIndex++;
      }
    }

    this.formResult = controls;
  }
  private makeDefaultForm(): FormGroup {
    let group = {
      employeeId: [null],
      employeeName: [null],
      employeeCode: [null],
      organizationName: [null],
      orgFullName:[null],
      organizationId: [null],
      score: [null],
      actualDate: [null]

    };
    let validate = [null, [ValidationService.required]];
    console.log(this.dataToLoadIntoForm)
    return this.buildForm({}, group);
  }


  // public add(index: number, item: FormGroup) {
  //   const controls = this.formResult as FormArray;
  //   this.numIndex++;
  //   controls.insert(index + 1, this.makeDefaultForm());
  //   this.sortDataTable();
  //   const maxPage = Math.ceil(this.formResult.controls.length / this.pageSize);
  //   this.firstRowIndex = (maxPage - 1) * this.pageSize;
  // }

  /**
   * removeGroup
   * param index
   * param item
   */
  // public remove(index: number, item: FormGroup) {
  //   const controls = this.formResult as FormArray;
  //   if (controls.length === 1) {
  //     this.formResult.reset();
  //     this.numIndex = 1;
  //     const group = this.makeDefaultForm();
  //     const control = new FormArray([]);
  //     control.push(group);
  //     this.formResult = control;
  //     return;
  //   }
  //   this.numIndex--;
  //   controls.removeAt(index);
  //   this.sortDataTable();
  // }
  // private sortDataTable() {
  //   const _event = {
  //     data: this.formResult.controls,
  //     field: 'sortOrder',
  //     mode: 'single',
  //     order: 1
  //   };
  //   // this.customSort(_event);
  // }

  clodeModal() {
    this.activeModal.close();
  }



}
