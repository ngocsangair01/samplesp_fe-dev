import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { FormGroup } from '@angular/forms';
import { AssessmentPeriodService } from '@app/core/services/assessmentPeriod/assessment-period.service';

import { AssessmentSumaryService } from '@app/core/services/assessment-sumary/assessment-sumary.service';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { AppComponent } from '@app/app.component';

@Component({
  selector: 'assessment-sumary-search',
  templateUrl: './assessment-sumary-search.component.html',
    styleUrls: ['./assessment-sumary-search.component.css']
})
export class AssessmentSumarySearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  formConfig = {
    assessmentPeriodId: [''],
    assessmentYear: [''],
    employeeId: [''],
      isAssessmentPeriodId: [false],
      isAssessmentYear: [false],
      isEmployeeId: [false],
  };
  assessmentPeriodList = [];
  yearList: Array<any>;
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  isMobileScreen: boolean = false;
  constructor(
    public assessmentSumaryService: AssessmentSumaryService,
    public assessmentPeriodService: AssessmentPeriodService,
    private fileStorage: FileStorageService,
    private router: Router,
    private app: AppComponent,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.assessmentSumary"));
    this.setMainService(assessmentSumaryService);
    this.formSearch = this.buildForm({}, this.formConfig);
    this.yearList = this.getYearList();
    // get periodList da ban hanh
    this.assessmentPeriodService.getAssessmentPeriodListPromulgated()
    .subscribe(res => {
      this.assessmentPeriodList = res;
    })
    this.processSearch(null);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
  }

  get f() {
    return this.formSearch.controls;
  }

  // #229 end
  private getYearList() {
    const yearList = [];
    for (let i = (this.currentYear - 20); i <= (this.currentYear + 20); i++) {
      const obj = {
        year: i
      };
      yearList.push(obj);
    }
    return yearList;
  }

  /**
   * Xu ly download file trong danh sach
   */

   public downloadFile(fileData) {
    this.fileStorage.downloadFile(fileData.secretId).subscribe(res => {
      saveAs(res, fileData.fileName);
    });
  }

  /**
   * Thêm mới
   * @param item
   */
   public add() {
    this.router.navigate(['/party-organization/assessment-sumary/add']);
  }

  /**
   * Sửa
   * @param item
   */
   public edit(item) {
    this.router.navigate(['/party-organization/assessment-sumary/', item.assessmentSumaryId, 'edit']);
  }

  /**
   * Xem chi tiết
   * @param item
   */
   public processView(item) {
    this.router.navigate(['/party-organization/assessment-sumary/', item.assessmentSumaryId, 'view']);
  }
  /**
   * Xóa
   * @param item
   */
  delete(item?: any) {
    if (item && item.assessmentSumaryId > 0) {
      this.app.confirmDelete('common.message.confirm.delete', () => {// on accepted
        this.assessmentSumaryService.deleteById(item.assessmentSumaryId)
          .subscribe(res => {
            if (this.assessmentSumaryService.requestIsSuccess(res)) {
              this.processSearch();
            }
          });
      }, () => {// on rejected
      });
    }
  }

  /**
   *
   */
   processExport() {
    const reqData = this.formSearch.value;
    this.assessmentSumaryService.export(reqData).subscribe(res => {
      saveAs(res, 'Danh sách kết quả đánh giá');
    });
  }

  /**
   * Import
   */
   public import() {
    this.router.navigate(['/party-organization/assessment-sumary/import']);
  }
}
