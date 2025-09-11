import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { AssessmentPeriodService } from '@app/core/services/assessmentPeriod/assessment-period.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileControl } from '@app/core/models/file.control';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'assessment-period-import',
  templateUrl: './assessment-period-import.component.html',
  styleUrls: ['./assessment-period-import.component.css']
})
export class AssessmentPeriodImportComponent extends BaseComponent implements OnInit {
  formImport: FormGroup;
  dataError: any;
  formConfig = {
    assessmentPeriodId: [''],
    assessmentPeriodName: [''],
    partyOrganizationId: ['', ValidationService.required]
  };
  constructor(
    private router: Router,
    private app: AppComponent,
    private assessmentPeriodService: AssessmentPeriodService,
    public activeModal: NgbActiveModal,
    ) {
    
    super(null, 'ASSESSMENT_PERIOD');
    this.setMainService(assessmentPeriodService);
    this.formImport = this.buildForm({}, this.formConfig);
    this.formImport.addControl('fileImport', new FileControl(null, [Validators.required]));
  }

  ngOnInit() {
  }

  private buildForms(data?: any) {
    this.formImport = this.buildForm(data, this.formConfig);
    this.formImport.addControl('fileImport', new FileControl(null, [Validators.required]));
  }

  get f () {
    return this.formImport.controls;
  }
  
  processDownloadTemplate() {
    const params = this.formImport.value;
    delete params['fileImport'];
    this.formImport.removeControl('fileImport');
    this.formImport.addControl('fileImport', new FormControl(null));
    this.assessmentPeriodService.downloadTemplateImport(params).subscribe(
      res => {
        saveAs(res, 'assessment_period_import.xls');
      }
    );
    this.formImport.controls['fileImport'].setValidators(ValidationService.required);
  }
    /**
   * setFormValue
   * param data
   */
  public setFormValue(propertyConfigs: any, data: any) {
    this.propertyConfigs = propertyConfigs;
    this.buildForms(data);
  }
  cancel(){
    this.activeModal.close();
  }
  processImport() {
    this.formImport.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.assessmentPeriodService.processImport(this.formImport.value).subscribe(
        res => {
          if (this.assessmentPeriodService.requestIsSuccess(res)) {
            this.activeModal.close();
            this.router.navigate(['/employee/assessment/manager-field/assessment-period']);
          } else {
            this.dataError = res.data;
          }
        }
      );
    }, () => {// on reject
    });
  }

}
