import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { AssessmentSumaryService } from '@app/core/services/assessment-sumary/assessment-sumary.service';
import { AssessmentPeriodService } from '@app/core/services/assessmentPeriod/assessment-period.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'assessment-sumary-form',
  templateUrl: './assessment-sumary-form.component.html',
  styleUrls: ['./assessment-sumary-form.component.css']
})
export class AssessmentSumaryFormComponent extends BaseComponent implements OnInit {
  formAssessmentSumary: FormGroup;
  assessmentPeriodList = [];
  yearList: Array<any>;
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  assessmentSumaryId: any;
  isView = false;
  isUpdate = false;
  isMobileScreen: boolean = false;

  formAssessmentSumaryConfig = {
    assessmentSumaryId: [''],
    employeeId: ['', Validators.required],
    assessmentPeriodId: [null, Validators.required],
    assessmentYear: ['', Validators.required],
    assessmentResult: ['', Validators.required],
    assessmentPoint: ['', [ValidationService.required, ValidationService.positiveNumber,Validators.max(999.99) ]],
    transCode: ['', ValidationService.maxLength(100)],
  };

  constructor(
    public assessmentPeriodService: AssessmentPeriodService,
    private app: AppComponent,
    public assessmentSumaryService: AssessmentSumaryService,
    private router: Router) {
    super(null, CommonUtils.getPermissionCode("resource.assessmentSumary"));
    this.yearList = this.getYearList();
    // get periodList da ban hanh
    this.assessmentPeriodService.getAssessmentPeriodListPromulgated()
    .subscribe(res => {
      this.assessmentPeriodList = res;
    })
    this.setFormValue({});
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 4) {
      this.assessmentSumaryId = subPaths[3]
      this.isUpdate = subPaths[4] === 'edit';
      this.isView = subPaths[4] === 'view';
      this.setFormValue(this.assessmentSumaryId);
    }
  }

  get f() {
    return this.formAssessmentSumary.controls;
  }

  /**
   * setFormValue
   * param data
   */
   public async setFormValue(data?: any) {
    if (data && data > 0) {
      await this.assessmentSumaryService.findOne(data)
        .subscribe(async res => {
          this.buildForms({...res.data, assessmentPoint: String(res.data.assessmentPoint)},);
          // this.getTotal();
        });
    } else {
      this.buildForms({});
    }
  }

  private buildForms(data?: any): void {
    this.formAssessmentSumary = this.buildForm(data, this.formAssessmentSumaryConfig);
    const filesControl = new FileControl(null);
    if (data && data.fileAttachment) {
      if (data.fileAttachment.assessmentSumaryFile) {
        filesControl.setFileAttachment(data.fileAttachment.assessmentSumaryFile);
      }
    }
    this.formAssessmentSumary.addControl('files', filesControl);
  }

  /**
   * goBack
   */
  public goBack() {
    this.router.navigate(['/party-organization/assessment-sumary']);
  }

  public goView(assessmentSumaryId: any) {
    this.router.navigate([`/party-organization/assessment-sumary/${assessmentSumaryId}/view`]);
  }

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

  processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formAssessmentSumary)) {
      return;
    }
    this.app.confirmMessage(null, () => { // on accepted
      this.assessmentSumaryService.saveOrUpdateFormFile(this.formAssessmentSumary.value)
        .subscribe(res => {
          if (this.assessmentSumaryService.requestIsSuccess(res) && res.data && res.data.assessmentSumaryId) {
            this.goView(res.data.assessmentSumaryId);
          }
        });
    }, () => {
    });
  }

  navigate() {
    this.router.navigate(['/party-organization/assessment-sumary/', this.assessmentSumaryId, 'edit']);
  }
}