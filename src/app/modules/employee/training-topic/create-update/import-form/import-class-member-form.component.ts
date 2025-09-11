import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AppComponent} from '@app/app.component';
import {
  ACTION_FORM, DEFAULT_MODAL_OPTIONS,
  LOAI_DOI_TUONG_KHEN_THUONG,
  LOAI_KHEN_THUONG,
  NHOM_KHEN_THUONG,
  RESOURCE,
  RESPONSE_TYPE
} from '@app/core';
import {AppParamService} from '@app/core/services/app-param/app-param.service';
import {RewardCategoryService} from '@app/core/services/reward-category/reward-category.service';
import {RewardGeneralService} from '@app/core/services/reward-general/reward-general.service';
import {BaseComponent} from '@app/shared/components/base-component/base-component.component';
import {CommonUtils, ValidationService} from '@app/shared/services';
import * as moment from 'moment';
import {SortEvent} from 'primeng/api';
import {Subject} from 'rxjs';
import _ from 'lodash';
import {
  FileImportPopupComponent
} from "@app/modules/employee/training-topic/create-update/file-import-popup/file-import-popup.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TrainingTopicService} from "@app/core/services/training-topic/training-topic.service";

@Component({
  selector: 'import-class-member-form',
  templateUrl: './import-class-member-form.component.html',
  styleUrls: ['./import-class-member-form.component.css']
})
export class ImportClassMemberFormComponent extends BaseComponent implements OnInit {
  @Input() dataToLoadIntoForm;
  @Input() saveData: Subject<boolean> = new Subject<boolean>();
  @Input() loadDataIntoForm: Subject<any> = new Subject<any>();
  @Input() dataToSave;
  @Input() isView;
  @Input() trainingTopicOrgIds;
  @Input() chooseParent;
  @Input() editable;
  @Input() isQuickDeploy;
  @Input() function : () => void;
  @Output('dataPersion') onChange = new EventEmitter<any>();

  mapRewardTypeBranch = { 1: 0, 2: 3, 3: 1, 4: 2, 5: 5 };
  formPosition: FormArray;
  numIndex = 1;
  branch: any;
  bo: any;
  orderField: string;
  trainingTopicId;
  view: boolean;
  rewardTitleIdList: any;
  objectId: any;
  isPartyOrganization: boolean;
  isOrganization: boolean;
  rewardCategory: any;
  @Output() onRefresh: EventEmitter<any> = new EventEmitter();
  firstRowIndex = 0;
  pageSize = 50;
  formConfig = {
    employeeId: [''],
    employeeName: [''],
    employeeCode:[''],
    organizationName:[''],
    organizationId: [''],
    currentPosition: [''],
    partyOrganizationName: [''],
    partyPosition: [''],
    partyOrganizationDB:[''],
    fileImport: [null, ValidationService.required]
  };
  private boolSubject: Subject<any>;

  constructor(
    private router: Router,
    private app: AppComponent,
    public actr: ActivatedRoute,
    public appParamService: AppParamService,
    public trainingTopicService: TrainingTopicService,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) {
    super(actr, RESOURCE.MASS_MEMBER, ACTION_FORM.INSERT);
    this.buildFormPosition();
    this.boolSubject = new Subject<any>();
  }

  ngOnInit() {
    this.view = false;
    if(this.dataToLoadIntoForm){
      this.setDataToForm(this.dataToLoadIntoForm);
    }
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 3) {
      this.isView = subPaths[3] === 'view';
    }
    if (subPaths.length > 4) {
      this.trainingTopicId = subPaths[4]
    }
    this.saveData.subscribe(response => {
      if (response) {
        this.processSaveOrUpdate(response)
      }
    })
    this.loadDataIntoForm.subscribe(res => {
      if(res){
        {{debugger}}
        this.setDataToForm(res);
        const control = this.formPosition.controls;
      }else{
        this.buildFormPosition();
      }

    })
    this.orderField = "obj.code, obj.name";
  }


  /**
   * makeDefaultForm
   */
  private makeDefaultForm(): FormGroup {
    let group = {
      employeeId: [''],
      employeeName: [''],
      employeeCode: [''],
      organizationName: [''],
      organizationId: [''],
      partyOrganizationId: [''],
      currentPosition: [''],
      partyOrganizationName: [''],
      partyPosition: [''],
      partyOrganizationDB:[''],
      score: ['']
    };
    let validate = [null, [ValidationService.required]];
    console.log(this.dataToLoadIntoForm)
    return this.buildForm({}, group);
  }

  public buildFormPosition(listData?: any) {
    const controls = new FormArray([]);
    if (!listData || listData.length === 0) {
      const group = this.makeDefaultForm();
      controls.push(group);
    } else {
      for (const i in listData) {
        const param = listData[i];
        const group = this.makeDefaultForm();
        group.patchValue(param);
        controls.push(group);
        this.numIndex++;
      }
    }

    this.formPosition = controls;
  }

  /**
   * addGroup
   * param index
   * param item
   */
  public add(index: number, item: FormGroup) {
    const controls = this.formPosition as FormArray;
    this.numIndex++;
    controls.insert(index + 1, this.makeDefaultForm());
    this.sortDataTable();
    const maxPage = Math.ceil(this.formPosition.controls.length / this.pageSize);
    this.firstRowIndex = (maxPage - 1) * this.pageSize;
  }

  /**
   * removeGroup
   * param index
   * param item
   */
  public remove(index: number, item: FormGroup) {
    const controls = this.formPosition as FormArray;
    if (controls.length === 1) {
      this.formPosition.reset();
      this.numIndex = 1;
      const group = this.makeDefaultForm();
      const control = new FormArray([]);
      control.push(group);
      this.formPosition = control;
      return;
    }
    this.numIndex--;
    controls.removeAt(index);
    this.sortDataTable();
  }
  private sortDataTable() {
    const _event = {
      data: this.formPosition.controls,
      field: 'sortOrder',
      mode: 'single',
      order: 1
    };
    // this.customSort(_event);
  }


  public goBack() {
    this.router.navigate(['/reward/reward-general']);
  }

  //
  // async onChangeEmployee(event) {
  //   if (event.selectField) {
  //     this.formCache['employeeId'] = event.selectField;
  //     this.formCache['employeeName'] = event.nameField;
  //   }
  //   await this.renderDataView();
  // }



  setDataToForm(data) {
    let control = new FormArray([]);
    this.formPosition = control;
    const formConfig = this.makeDefaultForm();

    data.forEach(element => {
      const group = _.cloneDeep(formConfig);
      group.patchValue({
        employeeId: element.employeeId,
        employeeCode: element.employeeCode,
        employeeName: element.employeeName,
        organizationId: element.organizationId,
        partyOrganizationId: element.partyOrganizationId,
        currentPosition: element.positionName,
        partyOrganizationName: element.partyOrganizationName,
        organizationName: element.organizationName,
        partyOrganizationDB: element.partyOrganizationDB,
        score: element.score
      });
      control.push(group);
    });
    this.formPosition = control;
  }

  public openFormImport() {
    const modalRef = this.modalService.open(FileImportPopupComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance.setInitValue(this.trainingTopicOrgIds);
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      this.setDataImportToForm(result);
    });
  }

  public exportForm() {
    let rewardObjectType;
    let fileName = "Danh_sach_dao_tao";
    const form = {
      trainingTopicId: this.trainingTopicId,
      trainingTopicOrgIds: this.trainingTopicOrgIds
    }
    const credentials = Object.assign({}, form);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.trainingTopicService.exportFormClassImport(params).subscribe(res => {
      saveAs(res, fileName);
    });
  }
  public setDataImportToForm(res) {
    this.setDataToForm(res.data);
    // this.dataToLoadIntoForm = res;
    // this.loadDataIntoForm.next(res.data);
  }

  public processSaveOrUpdate(res) {
    if (!CommonUtils.isValidForm(this.formPosition)) {
      return;
    }
    let classMemberForm = {};
    classMemberForm = res;
    const listObject = [];
    this.formPosition.value.forEach(data => {
      listObject.push(data);
    });
    {{debugger}}
    classMemberForm['classMemberBeanList'] = listObject;
    this.trainingTopicService.saveOrUpdateFormFile(classMemberForm)
        .subscribe(res => {
          if (this.trainingTopicService.requestIsSuccess(res)) {
            this.router.navigateByUrl(`/employee/training-topic/view/${res.data.trainingTopicId}`)
          }
        });
  }
}
