import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { CatAllowanceService } from '@app/core/services/allowance/cat-allowance.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { DialogService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicApiService } from '@app/core';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { AllowanceService } from '@app/core/services/allowance/allowance.service';
import { forkJoin } from 'rxjs';
import { CommonUtils, ValidationService } from '@app/shared/services';


@Component({
  selector: 'allowance-form',
  templateUrl: './allowance-form.component.html',
  styleUrls: ['./allowance-form.component.css']
})
export class AllowanceFormComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('orgSelector') orgSelector

  @ViewChild('empSelector') empSelector
  id;
  allowanceForm: FormGroup;
  formConfig;
  yearOptions = [];
  catAllowanceOptions = [];
  empTypeOptions = [];
  relationshipOptions = []
  positionSuggestions;

  constructor(
    private dynamicApiService: DynamicApiService,
    private appParamService: AppParamService,
    private app: AppComponent,
    private servie: AllowanceService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super()
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.setYearOptions();
    this.setFormConfig();
    this.allowanceForm = this.buildForm('', this.formConfig);
  }

  ngAfterViewInit(): void {
    forkJoin(
      [
        this.dynamicApiService.getByCode('get-cat-allowance'),
        this.dynamicApiService.getByCode('get-emp-type')
      ]
    ).subscribe(res => {
      this.catAllowanceOptions = res[0];
      this.empTypeOptions = res[1];
      if (this.id != 'create'){
        this.bindingForm();
      }
    })
  }

  bindingForm() {
    this.servie.findOne(this.id).subscribe(res => {
      this.allowanceForm.controls.id.setValue(res.empAllowanceId);
      this.allowanceForm.controls.year.setValue(this.yearOptions.find(e => e.value == res.year));
      this.allowanceForm.controls.catAllowance.setValue(this.catAllowanceOptions.find(e => e.id == res.catAllowanceId))
      this.dynamicApiService.getByCode('get-family-relationship', { employeeId: res.empId })
      .subscribe(data => {
        this.relationshipOptions = data;
        if (res.familyRelationshipId){
          this.allowanceForm.controls.familyRelationship
          .setValue(this.relationshipOptions.find(e => e.familyRelationshipId == res.familyRelationshipId))
        }
      })
      this.empSelector.setProperty(res.employeeCode);
      setTimeout(() => {
        this.allowanceForm.controls.subject.setValue(
          this.empTypeOptions.find(e => e.code == this.allowanceForm.controls.employee.value.empTypeCode)
        )
      }, 500)
      this.allowanceForm.controls.organization.setValue(res.orgId);
      this.orgSelector.onChangeOrgId();
      this.allowanceForm.controls.position.setValue({
        positionId: res.positionId,
        positionName: res.positionName
      })
      this.allowanceForm.controls.reason.setValue(res.reason)
      this.allowanceForm.controls.decisionNumber.setValue(res.decisionNumber)
      this.allowanceForm.controls.totalAllowance.setValue(res.totalAllowance)
      this.allowanceForm.controls.decisionDate.setValue(
        new Date(res.decisionDate.split("/")[1] + "/"+ res.decisionDate.split("/")[0] +"/"+res.decisionDate.split("/")[2]))
    })
  }

  save() {
    if(CommonUtils.isValidForm(this.allowanceForm)){
      this.app.confirmMessage(null,
        () => {
          this.servie.saveOrUpdate(this.buildParam())
          .subscribe(res => { 
            if(res.code == "success")
            this.router.navigate(['/allowance/management']);
          })
        },
        () => { }
      )
    }

  }

  buildParam() {
    let param: any = {};
    param.id = this.allowanceForm.value.id;
    param.year = this.allowanceForm.value.year.value;
    param.catAllowanceId = this.allowanceForm.value.catAllowance.id;
    param.employeeCode = this.allowanceForm.value.employee.employeeCode;
    param.subject = this.allowanceForm.value.subject.code;
    param.positionId = this.allowanceForm.value.position.positionId;
    param.organizationId = this.allowanceForm.value.organization;
    if (this.allowanceForm.value.familyRelationship){
      param.familyRelationshipId = this.allowanceForm.value.familyRelationship.familyRelationshipId;
    }
    param.reason = this.allowanceForm.value.reason;
    param.totalAllowance = this.allowanceForm.value.totalAllowance;
    param.decisionDate = this.allowanceForm.value.decisionDate;
    param.decisionNumber = this.allowanceForm.value.decisionNumber;
    return param;
  }

  setFormConfig() {
    this.formConfig = {
      id: [null],
      year: [null, ValidationService.required],
      catAllowance: [null, ValidationService.required],
      employee: [null, ValidationService.required],
      subject: [null, ValidationService.required],
      position: [null, ValidationService.required],
      organization: [null, ValidationService.required],
      familyRelationship: [null],
      reason: [null],
      totalAllowance: [null, ValidationService.required],
      decisionDate: [null, ValidationService.required],
      decisionNumber: [null],
    }


  }

  previous() {
    history.back();
  }

  setYearOptions() {
    let currentYear = new Date().getFullYear();
    for (let i = currentYear - 2; i < currentYear + 5; i++) {
      this.yearOptions.push({ value: i });
    }
  }

  getPosition(event) {
    this.dynamicApiService.getByCode('get-position', { positionName: event.query })
      .subscribe(res => {
        this.positionSuggestions = res;
      })
  }

  onChangeEmployee() {

    this.allowanceForm.controls.position.setValue({
      positionId: this.allowanceForm.controls.employee.value.positionId,
      positionName: this.allowanceForm.controls.employee.value.positionName
    })

    this.allowanceForm.controls.subject.setValue(
      this.empTypeOptions.find(e => e.code == this.allowanceForm.controls.employee.value.empTypeCode)
    )

    // this.allowanceForm.controls.organization.setValue(this.allowanceForm.controls.employee.value.orgId);
    this.orgSelector.onChangeOrgId()
    this.dynamicApiService.getByCode('get-family-relationship', { employeeId: this.allowanceForm.controls.employee.value.employeeId })
      .subscribe(res => {
        this.relationshipOptions = res
      })
  }
}