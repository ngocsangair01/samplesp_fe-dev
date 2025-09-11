import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, AdSchedulerService, DEFAULT_MODAL_OPTIONS, FROM_SOURCE, LARGE_MODAL_OPTIONS, OrganizationService, PROPOSE_SIGN_STATUS, SELECTION_STATUS } from '@app/core';

import { HrStorage } from '@app/core/services/HrStorage';

import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';


import { DialogService } from "primeng/api";

@Component({
  selector: 'ad-scheduler-search',
  templateUrl: './ad-scheduler-search.component.html',
  styleUrls: ['./ad-scheduler-search.css']
})
export class AdSchedulerSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  adSchedulerId: number;
  listIsActive: any;
  formconfig = {
    adSchedulerId: [null],
    crontabtimer: [null],
    isActive: [null],
    created: [null],
    createdBy: [null],
    updated: [null],
    updatedBy: [null],
    name: [""],
    isName: [false],  
    dateLastRun: [null],
    executionTime: [null],
    clusterCode: [null],
    runPath: [null],
    processing: [false],
    frequencyType: [null],
    frequency: [null],
    dateNextRun: [null],
    weekday: [null],
    scheduleType: [null],
    monthDay: [null],
    logPath: [null],
    logSubfFix: [null]
  }
 
  private operationKey = 'action.view';
  private adResourceKey = 'resource.adScheduler';
  private defaultDomain: any;
  promulgateBy: any;
  constructor(
    private adSchedulerService: AdSchedulerService,
    private app: AppComponent,
    private router: Router,   
    public dialogService: DialogService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.adScheduler"));
    this.setMainService(adSchedulerService);
    this.listIsActive = APP_CONSTANTS.AD_SCHEDULER_LIST_ACTIVESTATUS;  
    this.formSearch = this.buildForm({}, this.formconfig, ACTION_FORM.VIEW);
  }

  ngOnInit() {
    //Lấy miền dữ liệu mặc định theo nv đăng nhập
    this.defaultDomain = HrStorage.getDefaultDomainByCode(CommonUtils.getPermissionCode(this.operationKey)
      , CommonUtils.getPermissionCode(this.adResourceKey));
    // search
    this.processSearch();
  }

  get f() {
    return this.formSearch.controls;
  }

  public prepareSaveOrUpdate(item?: any) {
    if (item && item.adSchedulerId > 0) {
      this.adSchedulerService.findOne(item.adSchedulerId).subscribe(res => {
        
          this.router.navigate(['/settings/ad-scheduler/edit-scheduler/', item.adSchedulerId]);
       
      });
    } else{
      this.router.navigate(['/settings/ad-scheduler/add-scheduler']);   
    }
      
  }

  public decision() {
    this.router.navigate(['/settings/ad-scheduler/']);
  }

  public processView(item?: any) {
    this.adSchedulerService.findOne(item.adSchedulerId)
      .subscribe(res => {       
          this.router.navigate(['/settings/ad-scheduler/view-scheduler/', item.adSchedulerId]);        
      });
  }

  public processDelete(item) {
    if (item && item.adSchedulerId > 0) {
      this.adSchedulerService.findOne(item.adSchedulerId).subscribe(res => {
        if (res.data != null) {
          this.app.confirmDelete(null, () => { // accept
            this.adSchedulerService.deleteById(item.adSchedulerId)
              .subscribe(res => {
                if (this.adSchedulerService.requestIsSuccess(res)) {
                  this.processSearch(null);
                }
              })
          }, () => {
            // rejected
          })
        } else {
          this.processSearch();
          return;
        }
      });
    }
  }
  
  public genData(event: any) {
    if (event && event.codeField) {
      this.promulgateBy = event.codeField;
      this.f['promulgateBy'].patchValue(this.promulgateBy);
    } else {
      this.f['promulgateBy'].patchValue("");
    }
  }

  processSearch(event?) {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    let param = this.formSearch ? this.formSearch.value : null;
    this.adSchedulerService.search(param, event).subscribe(res => {
      this.resultList = res;
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }
}
