import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormGroup } from '@angular/forms';
import { AssessmentFormulaService } from '@app/core/services/employee/assessment-formula.service';
import { AppComponent } from '@app/app.component';
import { Router } from '@angular/router';
import { ValidationService } from '@app/shared/services';

@Component({
  selector: 'assessment-formula-search',
  templateUrl: './assessment-formula-search.component.html',
  styleUrls: ['./assessment-formula-search.component.css']
})
export class AssessmentFormulaSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  constructor(
    private assessmentFormulaService: AssessmentFormulaService,
    private app: AppComponent,
    private router: Router,
  )
  {
    super(null,"ASSESSMENT_FORMULA");
    this.setMainService(assessmentFormulaService);
    this.formSearch = this.buildForm({}, this.formConfig);
  }
  formConfig = {
    assessmentFormulaId: [''],
    assessmentFormulaName: ['', ValidationService.maxLength(500)],
    assessmentCriteriaGroupName: ['', ValidationService.maxLength(500)] ,
    isAssessmentFormulaName: [false],
    isAssessmentCriteriaGroupName: [false]
  }
  ngOnInit() {
    this.processSearch();
  }
  // get form
  get f () {
    return this.formSearch.controls;
  }
  /**
   * processSaveOrUpdate
   */
  public prepareSaveOrUpdate(item) {
    if (item && item.assessmentFormulaId > 0) {
      this.router.navigate(['/employee/assessment-formula/edit/', item.assessmentFormulaId]);
    } else {
      this.router.navigate(['/employee/assessment-formula/add']);
    }
  }
  /**
   * processDelete
   */
  processDelete(item) {
    if (item && item.assessmentFormulaId > 0) {
      this.app.confirmDelete(null, () => {
        this.assessmentFormulaService.deleteById(item.assessmentFormulaId)
          .subscribe(res => {
            if (this.assessmentFormulaService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
    })};
  }
}
