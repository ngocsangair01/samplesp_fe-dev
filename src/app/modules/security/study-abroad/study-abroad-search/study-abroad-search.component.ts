import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ValidationService } from '@app/shared/services';
import {StudyAbroadService} from "../../../../core/services/security/studyAbroad.service";

@Component({
  selector: 'study-abroad-search',
  templateUrl: './study-abroad-search.component.html',
  styleUrls: ['./study-abroad-search.component.css']
})
export class StudyAbroadSearchComponent extends BaseComponent implements OnInit {
  selectedGop: [];
  formSearch: FormGroup;
  resultList: any;
  listClassify = APP_CONSTANTS.CLASSIFY_TYPE;
  rootId = APP_CONSTANTS.ORG_ROOT_ID
  listChangeAdd = [];
  formconfig = {
    employeeId: [''],
    organizationId: [''],
    fromDate: [''],
    toDate: [''],
    isEmployeeId: [false],
    isOrganizationId: [false],
    isFromDate: [false],
    isToDate: [false],
  }

  constructor(
    private studyAbroadService: StudyAbroadService,
    private router: Router,
    private app: AppComponent,
    public actr: ActivatedRoute,
  ) {
    super(actr, CommonUtils.getPermissionCode("resource.securityProtection"));
    this.setMainService(studyAbroadService);
    this.formSearch = this.buildForm({}, this.formconfig, ACTION_FORM.VIEW)
    //   [ValidationService.notAffter('startDateFrom', 'startDateTo', 'personnelInvolved.start.date.to'),
    //   ValidationService.notAffter('endDateFrom', 'endDateTo', 'personnelInvolved.end.date.to')]);
    this.processSearch();
  }

  ngOnInit() {
  }

  get f() {
    return this.formSearch.controls;
  }
  /**
   * Xuất báo cáo
   */
  public processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    this.studyAbroadService.export(this.formSearch.value).subscribe(res => {
      saveAs(res, 'CBNV từng học tập ở nước ngoài.xls');
    });
  }

  /**
   * Import
   */
  public import() {
    this.router.navigate(['/security-guard/study-abroad/import']);
  }
  //
  // processDelete() {
  //   if (this.listChangeAdd.length == 0) {
  //     this.app.messError('ERROR', 'app.notification.notSelected');
  //   } else {
  //     this.app.confirmDelete(null, () => {// on accepted
  //       var listIds = this.listChangeAdd.map(a => a.keyProjectEmployeeId);
  //       this.keyProjectEmployeeService.deleteList(listIds)
  //         .subscribe(res => {
  //           if (this.keyProjectEmployeeService.requestIsSuccess(res)) {
  //             this.listChangeAdd = [];
  //             this.processSearch(null);
  //           }
  //         });
  //     }, () => {// on rejected
  //     });
  //   }
  // }
  public prepareAdd(item?: any) {
    if (item && item.keyProjectId > 0) {
      // this.keyProjectService.findOne(item.keyProjectId).subscribe(res => {
      //   if (res.data != null) {
      //     this.router.navigate(['/security-guard/key-project/edit/', item.keyProjectId]);
      //   }
      // });
    } else {
      this.router.navigate(['/security-guard/study-abroad/add'])
    }
  }

  processDelete(item) {
    if (item && item.studyAbroadId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.studyAbroadService.deleteById(item.studyAbroadId)
            .subscribe(res => {

              if (this.studyAbroadService.requestIsSuccess(res)) {
                this.processSearch(null);
              }
            });
      }, () => {// on rejected
      });
    }
  }

  public prepareSaveOrUpdate(item?: any) {
    if (item && item.studyAbroadId > 0) {
      this.router.navigate(['/security-guard/study-abroad/edit/', item.studyAbroadId]);
    } else {
      this.router.navigate(['/security-guard/study-abroad/add']);
    }
  }
}
