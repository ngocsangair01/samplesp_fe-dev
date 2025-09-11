import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AppComponent} from '@app/app.component';
import {
  ACTION_FORM,
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

@Component({
  selector: 'reward-general-form-position',
  templateUrl: './reward-general-form-position.component.html',
  styleUrls: ['./reward-general-form-position.component.css']
})
export class RewardGeneralFormPositionComponent extends BaseComponent implements OnInit {
  @Input() rewardType;
  @Input() isPersonal;
  @Input() isGroup;
  @Input() isViewPersonal;
  @Input() isViewGroup;
  @Input() dataToLoadIntoForm;
  @Input() resetFormSubject: Subject<any> = new Subject<any>();
  @Input() saveData: Subject<boolean> = new Subject<boolean>();
  @Input() loadDataIntoForm: Subject<any> = new Subject<any>();
  @Input() onDecisionDate: Subject<any> = new Subject<any>();
  @Input() dataToSave;
  @Input() decisionDate;
  @Output('dataPersion') onChange = new EventEmitter<any>();

  mapRewardTypeBranch = { 1: 0, 2: 3, 3: 1, 4: 2, 5: 5 };
  formPosition: FormArray;
  numIndex = 1;
  branch: any;
  bo: any;
  orderField: string;
  view: boolean;
  rewardTitleIdList: any;
  objectId: any;
  isPartyOrganization: boolean;
  isOrganization: boolean;
  rewardCategory: any;
  @Output() onRefresh: EventEmitter<any> = new EventEmitter();
  firstRowIndex = 0;
  pageSize = 50;
  isView: boolean = false;
  formCache = {
    employeeId: '',
    decisionDate: '',
    rewardType: '',
    isInside: '',
  };
  private boolSubject: Subject<any>;

  constructor(
    private router: Router,
    private app: AppComponent,
    public actr: ActivatedRoute,
    public appParamService: AppParamService,
    public rewardCategoryService: RewardCategoryService,
    public rewardGeneralService: RewardGeneralService
  ) {
    super(actr, RESOURCE.MASS_MEMBER, ACTION_FORM.INSERT);
    this.buildFormPosition();
    this.boolSubject = new Subject<any>();
    this.decisionDate = this.boolSubject.asObservable();
  }

  ngOnInit() {
    this.view = false;
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 3) {
      this.isView = subPaths[3] === 'view';
    }
    this.onDecisionDate.subscribe(async () => {
      await this.renderDataView()
    })
    this.resetFormSubject.subscribe(data => {
      this.resetForm();
      this.rewardType = data.rewardType;
      this.buildFormPosition();
      this.branch = this.mapRewardTypeBranch[data.rewardType];
      let objectType;
      if (this.branch == 0) {
        this.isPartyOrganization = true;
        this.isOrganization = false;
      } else if (this.branch == LOAI_KHEN_THUONG.CHINH_QUYEN) {
        this.isOrganization = true;
        this.isPartyOrganization = false;
      }
      else {
        this.isOrganization = false;
        this.isPartyOrganization = false;
      }
      if (this.isPersonal || this.isViewPersonal) {
        // ca nhan
        objectType = LOAI_DOI_TUONG_KHEN_THUONG.CA_NHAN;
      }
      else if (this.isGroup || this.isViewGroup){
        // tap the
        objectType = LOAI_DOI_TUONG_KHEN_THUONG.TAP_THE;
      }
      // lay danh hieu/hinh thuc khen thuong
      this.getListRewardCategory(
          data.isInside != null && data.isInside === 1? NHOM_KHEN_THUONG.TRONG_TAP_DOAN : NHOM_KHEN_THUONG.NGOAI_TAP_DOAN, objectType, data.rewardType).subscribe(res => {
        this.rewardTitleIdList = res;
        const control = this.formPosition.controls;
        control.map(item => this.handleChaneValue(item));
      })
    });
    this.saveData.subscribe(response => {
      if (response) {
        this.processSaveOrUpdate();
      }
    })
    this.loadDataIntoForm.subscribe(res => {
      if(res){
        this.setDataToForm(res);
        const control = this.formPosition.controls;
        control.map(item => this.handleChaneValue(item));
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
      employeeId: [null],
      objectId: [null],
      branch: [this.branch],
      massMemberId: [null],
      rewardTitleId: [null, [ValidationService.required]],
      rewardFormId: [null],
      massOrganizationId: [null],
      massPositionId: [null],
      sortOrder: [this.numIndex],
      description: [null, [ValidationService.maxLength(2000)]],
      rewardGeneralId: [null],
      rewardType: [null],
      periodType: [null],
      decisionDate: [null],
      decisionYear: [null],
      rewardLevelName: [null],
      decisionNumber: [null],
      rewardLevelId: [null],
      rewardObjectType: [null],
      rewardMoney: [null, [ValidationService.positiveInteger, ValidationService.maxLength(15)]],
      employeeName: [null],
      organizationName:[null],
      positionName:[null],
      partyOrganizationId: [null],
      organizationId: [null],
      rewardTitleName: [null],
      attachedFiles: [null],
      rewardCategory: [""],
      rewardTitleIdList: [],
      massOrgName: [null],
      orgName:[null],
      partyOrgName:[null],
    };
    let validate = [null, [ValidationService.required]];
    if (this.isPersonal || this.isViewPersonal) {
      group.employeeId = validate;
    } else if (this.isGroup || this.isViewGroup){
      if (this.rewardType == 1) {
        group.partyOrganizationId = validate;
      } else if (this.rewardType == 2 || this.rewardType == 3 || this.rewardType == 4) {
        group.massOrganizationId = validate;
      } else {
        group.organizationId = validate;
      }
    }
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
    if (this.isPersonal || this.isViewPersonal) {
      controls.setValidators([
        ValidationService.duplicateArray(['employeeId', 'rewardTitleId'], 'rewardTitleId', 'rewardGeneral.rewardTitle'),
      ]);
    } else if (this.isGroup || this.isViewGroup){
      if (this.rewardType == 1) {
        controls.setValidators([
          ValidationService.duplicateArray(['partyOrganizationId', 'rewardTitleId'], 'rewardTitleId', 'rewardGeneral.rewardTitle'),
        ]);
      } else if (this.rewardType == 2 || this.rewardType == 3 || this.rewardType == 4) {
        controls.setValidators([
          ValidationService.duplicateArray(['massOrganizationId', 'rewardTitleId'], 'rewardTitleId', 'rewardGeneral.rewardTitle'),
        ]);
      } else if (this.rewardType == 5) {
        controls.setValidators([
          ValidationService.duplicateArray(['organizationId', 'rewardTitleId'], 'rewardTitleId', 'rewardGeneral.rewardTitle'),
        ]);
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
    this.customSort(_event);
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      const value1 = data1.value[event.field];
      const value2 = data2.value[event.field];
      let result = null;

      if (value1 == null && value2 != null) {
        result = -1;

      } else if (value1 != null && value2 == null) {
        result = 1;
      } else if (value1 == null && value2 == null) {
        result = 0;
      } else {
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
      }
      return (event.order * result);
    });
  }

  public onChangeMassOrg(data, massOrgSelector) {

    if (data.massOrganizationId) {
      const currentDate = moment(new Date(), 'DD/MM/YYYY');
      if (data.expritedDate === null) {
        const effectiveDate = moment(new Date(data.effectiveDate), 'DD/MM/YYYY');
        if (effectiveDate.isAfter(currentDate)) {
          this.app.errorMessage('partymember.partyOrganizationNotEffectYet');
          massOrgSelector.delete();
        }
      } else {
        const expiredDate = moment(new Date(data.expritedDate), 'DD/MM/YYYY');
        if (expiredDate.isSameOrBefore(currentDate)) {
          this.app.errorMessage('partymember.partyOrganizationExpired');
          massOrgSelector.delete();
        }
      }
    }
    this.formPosition.controls.forEach(element => {
      if (this.rewardType == 1 && element.value['partyOrganizationId'] == data.partyOrganizationId) {
        element.patchValue({
          partyOrgName: data.name,
          partyOrganizationId: data.partyOrganizationId
        })
      } else if ((this.rewardType == 2 || this.rewardType == 3 || this.rewardType == 4) && element.value['massOrganizationId'] == data.massOrganizationId) {
        element.patchValue({
          massOrgName: data.name,
          massOrganizationId: data.massOrganizationId
        })
      } else if (this.rewardType == 5 && element.value['organizationId'] == data.organizationId) {
        element.patchValue({
          orgName: data.name,
          organizationId: data.organizationId
        })
      }
    });
  }

  public getListRewardCategory(rewardGroup: number, rewardObjectType: number, rewardType) {
    const data = {rewardGroup: rewardGroup, rewardObjectType: rewardObjectType, rewardType: rewardType};
    return this.rewardCategoryService.getListRewardCategory(data);
  }

  public processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formPosition)) {
      return;
    }
    this.app.confirmMessage(null, () => { // on accepted
      const rewardForm = {};
      rewardForm['rewardGeneralId'] = this.dataToSave.rewardGeneralId;
      rewardForm['rewardType'] = this.dataToSave.rewardType;
      rewardForm['attachedFiles'] = this.dataToSave.attachedFiles;
      rewardForm['decisionNumber'] = this.dataToSave.decisionNumber;
      rewardForm['decisionYear'] = this.dataToSave.decisionYear;
      rewardForm['decisionDate'] = this.dataToSave.decisionDate;
      rewardForm['rewardLevelId'] = this.dataToSave.rewardLevelId;
      rewardForm['periodType'] = this.dataToSave.periodType;
      rewardForm['decisionId'] = this.dataToSave.decisionId;
      rewardForm['decisionName'] = this.dataToSave.decisionName;
      rewardForm['decisionPerson'] = this.dataToSave.decisionPerson;
      rewardForm['isInside'] = this.dataToSave.isInside;
      const listObject = [];
      this.formPosition.value.forEach(data => {
        if (this.isPersonal || this.isViewPersonal) {
          data['rewardObjectType'] = LOAI_DOI_TUONG_KHEN_THUONG.CA_NHAN;
          data['objectId'] = data['employeeId'];
        }
        else if (this.isGroup || this.isViewGroup){
          data['rewardObjectType'] = LOAI_DOI_TUONG_KHEN_THUONG.TAP_THE;
          if (this.isPartyOrganization) {
            data['objectId'] = data['partyOrganizationId']
          }
          else if (this.isOrganization) {
            data['objectId'] = data['organizationId']
          }
          else {
            data['objectId'] = data['massOrganizationId']
          }
        }
        listObject.push(data);
      });
      rewardForm['listObject'] = listObject;
      this.rewardGeneralService.saveAll(rewardForm)
        .subscribe(res => {
          if (this.rewardGeneralService.requestIsSuccess(res)) {
            this.goBack();
          }
        });
    }, () => {
      // on rejected
    });
  }

  public goBack() {
    this.router.navigate(['/reward/reward-general']);
  }

  patchValueEmploye(event, organizationName: any = "", organizationId: any = "", positionName: any = "") {
    const employeeId = event ? event.selectField : this.formCache['employeeId'];
    const employeeName = event ? event.nameField : this.formCache['employeeName'];
    this.formPosition.controls.forEach(element => {
      if (element.value['employeeId'] == employeeId) {
        element.patchValue({
          employeeName: employeeName,
          organizationName: organizationName,
          positionName: positionName,
          organizationId: organizationId
        });
      }
    });
  }

  async renderDataView(event?) {
    if (this.decisionDate.value) {
      const dateString = moment(new Date(this.decisionDate.value)).format('DD/MM/YYYY');
      this.formCache['decisionDate'] = dateString;
      this.formCache['rewardType'] = this.rewardType;
    }
    if (!this.formCache['employeeId'] || !this.formCache['decisionDate']) {
      this.patchValueEmploye(event);
      return;
    }
    const rest = await this.rewardGeneralService.findUnitWork(this.formCache).toPromise();
    if (rest.type == RESPONSE_TYPE.SUCCESS) {
      const restData = rest.data;
      if (restData) {
        this.patchValueEmploye(event, restData.organizationName, restData.organizationId, restData.positionName);
      }
    }
  }

  async onChangeEmployee(event) {
    if (event.selectField) {
      this.formCache['employeeId'] = event.selectField;
      this.formCache['employeeName'] = event.nameField;
    }
    await this.renderDataView();
  }

  public genData(event?){

    const dateString = moment(new Date(this.decisionDate.value)).format('DD/MM/YYYY');
    if (event) {
      this.formCache['employeeId'] = event.selectField;
      this.formCache['decisionDate'] = dateString;
    }
    if(this.formCache['employeeId'] && this.formCache['decisionDate']){
      this.rewardGeneralService.findUnitWork(this.formCache).subscribe(res => {
         if(res.data){
          this.patchValueEmploye(event, res.data.organizationName || '', res.data.organizationId || '', res.data.positionName || '');
         }else {
          this.patchValueEmploye(event, '', '');
          return;
         }
     })
    } else if(event.selectField){
      this.formPosition.controls.forEach(element => {
        if (element.value['employeeId'] == event.selectField) {
          element.patchValue({
            employeeName: event.nameField
          })
        }
      });
    }
  }

  resetForm() {
    this.formPosition.controls.forEach(element => {
      element.patchValue({
        massOrganizationId: '',
        rewardTitleId: '',
        rewardFormId: '',
        description: '',
        rewardMoney: '',
        partyOrganizationId: ''
      })
    });
  }

  setDataToForm(data) {
    let control = new FormArray([]);
    this.formPosition = control;
    const formConfig = this.makeDefaultForm();
    if(this.isPersonal ||this.isGroup) {
      data.forEach(element => {
        const group = _.cloneDeep(formConfig);
        group.patchValue({
          description: element.description,
          rewardMoney: element.rewardMoney,
          rewardTitleId: element.rewardTitleId,
          rewardFormId: element.rewardFormId,
          employeeId: element.employeeId,
          employeeName: element.employeeName,
          organizationName: element.organizationName,
          positionName: element.positionName,
          partyOrganizationId: element.objectId,
          organizationId: element.objectId,
          massOrganizationId: element.objectId,
          rewardCategory: element.rewardCategory.toString(),
          rewardTitleName: element.rewardTitleName,
          rewardObjectType: element.rewardObjectType,
        });
        control.push(group);
      });
    } else {
      const group = _.cloneDeep(formConfig);
      group.patchValue({
        description: data.description,
        rewardMoney: data.rewardMoney,
        rewardTitleId: data.rewardTitleId,
        rewardFormId: data.rewardFormId,
        employeeId: data.objectId,
        employeeName: data.employeeName,
        organizationName: data.organizationName,
        positionName: data.positionName,
        partyOrganizationId: data.objectId,
        organizationId: data.objectId,
        massOrganizationId: data.objectId,
        rewardCategory: data.rewardCategory.toString(),
        rewardTitleName: data.rewardTitleName,
        rewardObjectType: data.rewardObjectType,
      });
      control.push(group);
    }
    this.formPosition = control;
    if (this.isPersonal || this.isViewPersonal) {
      this.formPosition.setValidators([
        ValidationService.duplicateArray(['employeeId', 'rewardTitleId'], 'rewardTitleId', 'rewardGeneral.rewardTitle'),
      ]);
    } else if (this.isGroup || this.isViewGroup){
      if (this.rewardType == 1) {
        this.formPosition.setValidators([
          ValidationService.duplicateArray(['partyOrganizationId', 'rewardTitleId'], 'rewardTitleId', 'rewardGeneral.rewardTitle'),
        ]);
      } else if (this.rewardType == 2 || this.rewardType == 3 || this.rewardType == 4) {
        this.formPosition.setValidators([
          ValidationService.duplicateArray(['massOrganizationId', 'rewardTitleId'], 'rewardTitleId', 'rewardGeneral.rewardTitle'),
        ]);
      } else if (this.rewardType == 5) {
        this.formPosition.setValidators([
          ValidationService.duplicateArray(['organizationId', 'rewardTitleId'], 'rewardTitleId', 'rewardGeneral.rewardTitle'),
        ]);
      }
    }
  }

  public handleChaneValue(item) {
    if (this.rewardType) {
      const value = item.value.rewardCategory;
      const dataTemp = this.rewardTitleIdList.filter(e => e.rewardCategory == value)
      item.controls.rewardTitleIdList.setValue(dataTemp)
    }
  }
  getAmountOfMoney(item) {
    const rewardTitleId = item.controls['rewardTitleId'].value;
    const rewardTitleList = item.controls['rewardTitleIdList'].value;
    const amountOfMoney = rewardTitleList.find(e => e.rewardCategoryId == rewardTitleId).offerMoney;
    item.controls['rewardMoney'].setValue(amountOfMoney);
    const rewardTitleName = rewardTitleList.find(e => e.rewardCategoryId == rewardTitleId).name
    item.controls['rewardTitleName'].setValue(rewardTitleName);
  }
}
