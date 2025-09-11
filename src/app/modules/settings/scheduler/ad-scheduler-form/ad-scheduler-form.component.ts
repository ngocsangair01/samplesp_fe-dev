import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileControl } from '@app/core/models/file.control';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, LOAI_KHEN_THUONG_CHI_TIET, LOAI_KHEN_THUONG, REWARD_PROPOSE_SIGN_STATUS, FROM_SOURCE, LARGE_MODAL_OPTIONS, MEDIUM_MODAL_OPTIONS, SAP_STATEMENT_STATUS, AdSchedulerService } from '@app/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import _ from 'lodash';
import { HelperService } from '@app/shared/services/helper.service';
import { DialogService } from "primeng/api";
import { AdSchedulerConfirmComponent } from '../ad-scheduler-confirm/ad-scheduler-confirm';

@Component({
  selector: 'ad-scheduler-form',
  templateUrl: './ad-scheduler-form.component.html',
  styleUrls: ['./ad-scheduler-form.css']
})
export class AdSchedulerFormComponent extends BaseComponent implements OnInit {
  resetFormArray: Subject<any> = new Subject<any>();
  setData: Subject<any> = new Subject<any>();
  processingData: Subject<any> = new Subject<any>();
  formAdSchedulerLog: Subject<any> = new Subject<any>();
  saveData: Subject<boolean> = new Subject<boolean>();
  loadDataIntoForm: Subject<any> = new Subject<any>();
  adSchedulerLog: FormArray;
  formSave: FormGroup;
  isUpdate: boolean;
  isInsert: boolean;
  isView: boolean;
  runJob: boolean;
  isEditDecision: boolean;
  selectedRows: [];
  isGroup: boolean;
  isSign: boolean;
  processingStatusList: any;
  adSchedulerId: any;
  formConfig = {
    name: [null, [ValidationService.required]],
    cronTabTimer: [null, [ValidationService.required]],
    isActive: [null],
    executionTime: [0],
    description: [null],
    data: [null],
    dateLastRun: [null],
    clusterCode: [null, [ValidationService.required]],
    runPath: [null, [ValidationService.required]],
    maxDuration: [0, [ValidationService.required]],
    processing: [null],
    frequencyType: [null],
    frequency: [0],
    dateNextRun: [null],
    weekday: [null],
    scheduleType: [null],
    monthDay: [null],
    logPath: [null, [ValidationService.required]],
    logSubfFix: [null, [ValidationService.required]],
  };

  numIndex = 1;
  firstRowIndex = 0;
  pageSize = 10;
  offset: any = 0;
  limit: any = 50;
  modalProcessLoad: NgbModalRef;
  constructor(
    private adSchedulerService: AdSchedulerService,
    public actr: ActivatedRoute,
    private app: AppComponent,
    private router: Router,
    private modalService: NgbModal,
    public dialogService: DialogService,
    public helperService: HelperService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.adScheduler"));
    this.formSave = this.buildForm({}, this.formConfig)
    this.buildForms({});
    this.processingStatusList = APP_CONSTANTS.SCHEDULER_PROCESSING_STATUS;
    console.log(this.processingStatusList);

  }

  ngOnInit() {
    this.buildForms({});
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 3) {
      this.isView = subPaths[3] === 'view-scheduler';
      this.isUpdate = subPaths[3] === 'edit-scheduler';
      this.isInsert = subPaths[3] === 'add-scheduler';
      if (!this.isInsert) {
        // this.helperService.setWaitDisplayLoading(true);
        this.adSchedulerId = subPaths[4]
        this.setDataTopAllForms();
      }
    }
    // this.processingData.subscribe(async info => {
    //   this.modalProcessLoad.componentInstance.updateView(info);
    // });
  }

  public setDataTopAllForms() {
    this.adSchedulerService.findOne(this.adSchedulerId).subscribe(res => {
      const listAdSchedulerLog = res.data.listDetailBo;
      this.formAdSchedulerLog.next(listAdSchedulerLog)
      if (res.processing != 'Y') {
        this.runJob = true;
      }
      this.buildForms(res.data);
      this.setData.next(res);
    });
  }
  get f() {
    return this.formSave.controls;
  }


  private buildForms(data?: any): void {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, [])
  }

  public goBack() {
    this.router.navigate(['/settings/ad-scheduler']);
  }

  public processSaveOrUpdate() {
    let isInvalidForm = false;

    if (isInvalidForm) {
      return;
    }
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    const adSchedulerForm = {};
    const saveData = this.formSave.value;
    adSchedulerForm['adSchedulerId'] = this.adSchedulerId;
    adSchedulerForm['cronTabTimer'] = saveData.cronTabTimer;
    adSchedulerForm['isActive'] = saveData.isActive;
    adSchedulerForm['name'] = saveData.name;
    adSchedulerForm['description'] = saveData.description;
    adSchedulerForm['dateLastRun'] = saveData.dateLastRun;
    adSchedulerForm['executionTime'] = saveData.executionTime;
    adSchedulerForm['clusterCode'] = saveData.clusterCode;
    adSchedulerForm['runPath'] = saveData.runPath;
    adSchedulerForm['processing'] = saveData.processing;
    adSchedulerForm['frequencyType'] = saveData.frequencyType;
    adSchedulerForm['frequency'] = saveData.frequency;
    adSchedulerForm['dateNextRun'] = saveData.dateNextRun;
    adSchedulerForm['weekday'] = saveData.weekday;
    adSchedulerForm['scheduleType'] = saveData.scheduleType;
    adSchedulerForm['monthDay'] = saveData.monthDay;
    adSchedulerForm['logPath'] = saveData.logPath;
    adSchedulerForm['logSubfFix'] = saveData.logSubfFix;
    adSchedulerForm['maxDuration'] = saveData.maxDuration;
    this.app.confirmMessage(null, () => {
      this.adSchedulerService.saveOrUpdateFormFile(adSchedulerForm).subscribe(res => {
        this.router.navigate(['/settings/ad-scheduler']);
        this.app.successMessage('insertSuccess');
      });
    }, () => {
    });

  }

  public confirmRunJob() {
    const adSchedulerForm = {};
    const saveData = this.formSave.value;
    adSchedulerForm['adSchedulerId'] = this.adSchedulerId;
    adSchedulerForm['cronTabTimer'] = saveData.cronTabTimer;
    adSchedulerForm['isActive'] = saveData.isActive;
    adSchedulerForm['name'] = saveData.name;
    adSchedulerForm['description'] = saveData.description;
    adSchedulerForm['dateLastRun'] = saveData.dateLastRun;
    adSchedulerForm['executionTime'] = saveData.executionTime;
    adSchedulerForm['clusterCode'] = saveData.clusterCode;
    adSchedulerForm['runPath'] = saveData.runPath;
    adSchedulerForm['processing'] = saveData.processing;
    adSchedulerForm['frequencyType'] = saveData.frequencyType;
    adSchedulerForm['frequency'] = saveData.frequency;
    adSchedulerForm['dateNextRun'] = saveData.dateNextRun;
    adSchedulerForm['weekday'] = saveData.weekday;
    adSchedulerForm['scheduleType'] = saveData.scheduleType;
    adSchedulerForm['monthDay'] = saveData.monthDay;
    adSchedulerForm['logPath'] = saveData.logPath;
    adSchedulerForm['logSubfFix'] = saveData.logSubfFix;
    adSchedulerForm['maxDuration'] = saveData.maxDuration;
    this.app.confirmMessage("app.setting.adScheduler.confirmRunJob", () => { // accept
      this.adSchedulerService.confirmRunJob(adSchedulerForm)
        .subscribe(res => {
          if (res.data && res.data.data === "Success") {
            this.app.successMessage("app.setting.adScheduler.runJobSucuess", "Chạy tiến trình thành công !!!");
          } else {
            if (res.data && res.data.data === "Process") {
              this.app.errorMessage("app.setting.adScheduler.jobIsRunning", "Tiến trình đang chạy !!!");
            } else {
              this.app.errorMessage("app.setting.adScheduler.runJobError", "Chạy tiến trình thất bại !!!");
            }

          }
          this.setDataTopAllForms();
        })
    }, () => {
      // rejected
    })
  }


  public downloadLogFile() {

    const formData = Object.assign({}, this.formSave.value);
    const params = CommonUtils.buildParams(CommonUtils.convertData(formData));
    this.app.confirmMessage("app.setting.adScheduler.downloadLog", () => { // accept
      this.adSchedulerService.downloadLogFile(params)
        .subscribe(res => {
          console.log(res);
          saveAs(res, 'log.zip');
        })
    }, () => {
      // rejected
    })
  }


  public confirmKillJob() {
    const adSchedulerForm = {};
    const saveData = this.formSave.value;
    adSchedulerForm['adSchedulerId'] = this.adSchedulerId;
    adSchedulerForm['cronTabTimer'] = saveData.cronTabTimer;
    adSchedulerForm['isActive'] = saveData.isActive;
    adSchedulerForm['name'] = saveData.name;
    adSchedulerForm['description'] = saveData.description;
    adSchedulerForm['dateLastRun'] = saveData.dateLastRun;
    adSchedulerForm['executionTime'] = saveData.executionTime;
    adSchedulerForm['clusterCode'] = saveData.clusterCode;
    adSchedulerForm['runPath'] = saveData.runPath;
    adSchedulerForm['processing'] = saveData.processing;
    adSchedulerForm['frequencyType'] = saveData.frequencyType;
    adSchedulerForm['frequency'] = saveData.frequency;
    adSchedulerForm['dateNextRun'] = saveData.dateNextRun;
    adSchedulerForm['weekday'] = saveData.weekday;
    adSchedulerForm['scheduleType'] = saveData.scheduleType;
    adSchedulerForm['monthDay'] = saveData.monthDay;
    adSchedulerForm['logPath'] = saveData.logPath;
    adSchedulerForm['logSubfFix'] = saveData.logSubfFix;
    this.app.confirmMessage("app.setting.adScheduler.confirmKillJob", () => { // accept
      this.adSchedulerService.confirmKillJob(adSchedulerForm)
        .subscribe(res => {
          if (res.data && res.data.data === "Success") {
            this.app.successMessage("app.setting.adScheduler.killJobSucuess", "Kill tiến trình thành công !!!");
          } else {
            if (res.data && res.data.data === "Process") {
              this.app.errorMessage("app.setting.adScheduler.killJobError", "Kill trình đang chạy !!!");
            } else {
              this.app.errorMessage("app.setting.adScheduler.killJobError", "Kill tiến trình thất bại !!!");
            }

          }
          this.setDataTopAllForms();
        })
    }, () => {
      // rejected
    })
  }



}
