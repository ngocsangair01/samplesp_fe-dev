import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, AdSchedulerService, LOAI_DANH_MUC_KHEN_THUONG, LOAI_DOI_TUONG_KHEN_THUONG, NHOM_KHEN_THUONG, RESOURCE } from '@app/core';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { SortEvent } from 'primeng/api';
import { Observable, Subject, Subscription } from 'rxjs';
import { PropagandaRewardFormService } from '@app/core/services/propaganda/propaganda-reward-form.service';
import { NationService } from '@app/core/services/nation/nation.service';
import { RewardCategoryService } from '@app/core/services/reward-category/reward-category.service';
import { RewardGeneralService } from '@app/core/services/reward-general/reward-general.service';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { Table } from 'primeng/table';
import _ from 'lodash';
@Component({
  selector: 'ad-scheduler-log',
  templateUrl: './ad-scheduler-log.component.html',
  styleUrls: ['./ad-scheduler-log.component.css']
})
export class AdSchedulerLogComponent extends BaseComponent implements OnInit {  @Input() rewardType;
  @Input() adSchedulerLogList: Subject<any> = new Subject<any>();
  @Output() adSchedulerLog = new EventEmitter();
  formSearchNguoiHuong: FormGroup;
  formAdSchedulerLogOut: FormArray;
  adSchedulerId: any;
  tableAdSchedulerLog: Array<any>;


  numIndex = 1;
  isView: boolean = false;
  isEdit: boolean = false;
  isInsert: boolean = false;
  firstRowIndex = 0;
  pageSize = 50;
  formSearchConfig = {
    keyword: [null]
  };

  constructor(
    private app: AppComponent,
    private router: Router,
    public actr: ActivatedRoute,
    public appParamService: AppParamService,
    private adSchedulerService: AdSchedulerService,
  ) {
    super(actr, RESOURCE.MASS_MEMBER, ACTION_FORM.INSERT);
    this.formSearchNguoiHuong = this.buildForm({}, this.formSearchConfig);
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 3) {
      this.isView = subPaths[4] === 'view-decision';
      this.isEdit = subPaths[4] === 'edit-decision';
      this.isInsert = subPaths[4] === 'add-decided';
    }
    this.adSchedulerLogList.subscribe((res) => {
      this.tableAdSchedulerLog = this.tableAdSchedulerLog && this.tableAdSchedulerLog.length > 0 ? this.tableAdSchedulerLog.concat(res) : res
    })
  
  } 
  public downloadLogFile(index: number, item: FormGroup) {
    const formData = Object.assign({}, item.value);
    const params = {};
    params['logpath'] = item['logpath'];
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
}
