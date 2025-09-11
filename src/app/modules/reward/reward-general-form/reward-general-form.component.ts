import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS, LOAI_DANH_MUC_KHEN_THUONG } from '@app/core';
import { FileControl } from '@app/core/models/file.control';
import { RewardCategoryService } from '@app/core/services/reward-category/reward-category.service';
import { RewardGeneralService } from '@app/core/services/reward-general/reward-general.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { RewardImportManageComponent } from './file-import-management/reward-import-manage.component';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';
import {AppParamService} from "@app/core/services/app-param/app-param.service";


@Component({
  selector: 'reward-general-form',
  templateUrl: './reward-general-form.component.html',
  styleUrls: ['./reward-general-form.component.css']
})
export class RewardGeneralFormComponent extends BaseComponent implements OnInit {
  resetFormSubject: Subject<any> = new Subject<any>();
  saveData: Subject<boolean> = new Subject<boolean>();
  loadDataIntoForm: Subject<any> = new Subject<any>();
  onDecisionDate: Subject<any> = new Subject<any>();
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  formSave: FormGroup;
  isInsert: boolean;
  isEdit: boolean;
  isPersonal: boolean;
  isGroup: boolean;
  isViewPersonal: boolean;
  isViewGroup: boolean;
  isRequiredDecision: boolean = false;
  isRequiredIsInside: boolean = false;
  rewardType: number;
  rewardTypeList = APP_CONSTANTS.REWARD_GENERAL_TYPE_LIST;
  periodTypeList = APP_CONSTANTS.REWARD_PERIOD_TYPE_LIST;
  isInsideList = [
    {id: 1, name: "Trong TĐ"},
    {id: 0, name: "Ngoài TĐ"}
  ];
  decisionList: any;
  listYear: any;
  dataToSave: any;
  dataToLoadIntoForm: any;
  mapRewardTypeBranch = { 1: 0, 2: 3, 3: 1, 4: 2, 5: 5 };
  rewardGeneralId: any;
  rewardTypeListByUserToInsert: any;
  formConfig = {
    rewardGeneralId: [''],
    rewardType: [''],
    periodType: ['', [ValidationService.required]],
    decisionId: [''],
    decisionName: [''],
    decisionPerson: [''],
    isInside: [0],
    decisionDate: ['', [ValidationService.required, ValidationService.beforeCurrentDate]],
    decisionYear: [this.currentYear, [ValidationService.required]],
    decisionNumber: ['', [ValidationService.maxLength(200), ValidationService.required]],
  };
   isEmptyRewardType: any;

  constructor(
    private rewardCategoryService: RewardCategoryService,
    private modalService: NgbModal,
    public actr: ActivatedRoute,
    private router: Router,
    private rewardGeneralService: RewardGeneralService,
    private rewardProposeService: RewardProposeService,
    private appParamService : AppParamService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.rewardGeneral"));
    this.buildForms({});
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.rewardGeneralId = params.id;
        } else {
          this.setFormValue({});
        }
      }
    });
  }

  ngOnInit() {
    // this.buildForms({});
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 3) {
      this.isInsert = true;
      this.isEdit = true;
      this.isPersonal = subPaths[3] === 'reward-personal-add'
      this.isGroup = subPaths[3] === 'reward-group-add'
      this.isViewPersonal = subPaths[3] === 'reward-personal-edit'
      this.isViewGroup = subPaths[3] === 'reward-group-edit'
    }
    this.setFormValue(this.rewardGeneralId);
    this.getYearList();
    this.appParamService.findAllByParType("EXTERNAL_REWARD_CODE").subscribe(res =>{
      this.decisionList = res.data
    })
    this.rewardProposeService.getRewardTypeList().subscribe(res => {
      this.rewardTypeListByUserToInsert = this.rewardTypeList.filter((item) => {
        return res.includes(item.id)
      })
    })
  }

  get f() {
    return this.formSave.controls;
  }

  /**
 * buildForm
 */
  private buildForms(data?: any): void {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, [])
    const fileAttachment = new FileControl(null);
    if (data && data.fileAttachment) {
      if (data.fileAttachment.attachedFiles) {
        fileAttachment.setFileAttachment(data.fileAttachment.attachedFiles);
      }
    }
    this.formSave.addControl('attachedFiles', fileAttachment);
  }

  public openFormImport() {
    if (!this.formSave.controls['rewardType'].value) {
      this.isEmptyRewardType = true;
      return;
    }
    const modalRef = this.modalService.open(RewardImportManageComponent, DEFAULT_MODAL_OPTIONS);
    const rewardType = this.formSave.controls['rewardType'].value;
    const isInside = this.formSave.controls['isInside'].value;
    modalRef.componentInstance.setFormValue(this.propertyConfigs,
      { rewardType: rewardType,isInside: isInside, branch: this.mapRewardTypeBranch[rewardType] });
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      this.setDataToForm(result);
    });
  }

  public setDataToForm(res) {
    this.dataToLoadIntoForm = res;
    this.loadDataIntoForm.next(res.data);
  }

  /**
   * setFormValue
   * param data
   */
   public setFormValue(data?: any) {
    this.buildForms({});
    if (data && data > 0) {
      this.rewardGeneralService.findOne(data).subscribe((res) => {
        this.buildForms(res.data);
        this.onChangeObjectType();
        this.loadDataIntoForm.next(res.data);
      })
    }
  }
  public goBack() {
    this.router.navigate(['/reward/reward-general']);
  }

  public onChangeObjectType() {
    let rewardType = this.formSave.controls['rewardType'].value;
    if (rewardType) {
      this.isEmptyRewardType = false;
    }
    let isInside = this.formSave.controls['isInside'].value;
    this.resetFormSubject.next({'rewardType': rewardType, 'isInside': isInside});
  };
  
  public processSaveOrUpdate() {
    this.isEmptyRewardType = false;
    this.isRequiredIsInside = false;
    this.isRequiredDecision = false;
    if (!this.formSave.controls['rewardType'].value) {
      this.isEmptyRewardType = true;
    }
    if (this.formSave.controls['isInside'].value == null) {
      this.isRequiredIsInside = true;
    }
    if(this.formSave.controls['isInside'].value != null && this.formSave.controls['isInside'].value === 0 && !this.formSave.controls['decisionId'].value){
      this.isRequiredDecision = true;
    }
    if(this.formSave.controls['isInside'].value != null && this.formSave.controls['isInside'].value === 0 && this.formSave.controls['decisionId'].value){
      this.formSave.controls['decisionName'].setValue(this.decisionList.filter(item => item.parId === this.formSave.controls['decisionId'].value)[0].parValue)
    }
    if (!CommonUtils.isValidForm(this.formSave) || this.isRequiredDecision || this.isRequiredIsInside) {
      return;
    }
    else {
      this.dataToSave = this.formSave.value;
      this.saveData.next(this.dataToSave);
      
    }
  }

  private getYearList() {
    this.listYear = [];
    const currentYear = new Date().getFullYear();
    for (let i = (currentYear - 20); i <= (currentYear); i++) {
      const obj = {
        year: i
      };
      this.listYear.push(obj);
    }
    return this.listYear;
  }

  onChangeDecisionDate() {
    setTimeout(() => {
      this.onDecisionDate.next();
    }, 300)
  }
}
