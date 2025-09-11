import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { CatAllowanceService } from '@app/core/services/subsidized/cat-allowance.service';
import { SubsidizedPeriodService } from '@app/core/services/subsidized/subsidized-period.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'subsidized-period-form',
  templateUrl: './subsidized-period-form.component.html',
  styleUrls: ['./subsidized-period-form.component.css']
})
export class SubsidizedPeriodFormComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  subsidizedPeriodId: any;
  isUpdate: boolean = false;
  isInsert: boolean = false;
  isView: boolean = false;
  showSoTienValidate = false;
  listYear: any;
  beneficiaryTypeList: any;
  currentYear = new Date().getFullYear();
  operationKey = 'action.view';
  adResourceKey = 'resource.subsidized';
  subsidizedTypeList: any;
  formConfig = {
    name: [null, [ValidationService.required]],
    decisionOrgId: [null, [ValidationService.required]],
    beneficiaryType: [null, [ValidationService.required]],
    listSubsidizedBeneficialOgrId: [null, [ValidationService.required]],
    decisionYear: [this.currentYear, [ValidationService.required]],
    subsidizedType: [null, [ValidationService.required]],
    subsidizedPeriodId: [null]
  };

  constructor(
    private subsidizedPeriodService: SubsidizedPeriodService,
    public actr: ActivatedRoute,
    private router: Router,
    private app: AppComponent,
    private fb: FormBuilder,
    private catAllowanceService: CatAllowanceService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.subsidized"));
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.subsidizedPeriodId = params.id;
        } else {
          this.setFormValue({});
        }
      }
    });

  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 3) {
      this.isView = subPaths[3] === 'view';
      this.isUpdate = subPaths[3] === 'edit';
      this.isInsert = subPaths[3] === 'add';
    }
    this.setFormValue(this.subsidizedPeriodId);
    this.listYear = this.getYearList();
    this.catAllowanceService.getDataForDropdownCatAllowance({isActive: 1}).subscribe(res => {
      this.subsidizedTypeList = res;
    });
    this.beneficiaryTypeList = APP_CONSTANTS.BENEFCIARY_TYPE_LIST;
  }

  get f() {
    return this.formSave.controls;
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

  /**
   * buildForm
   */
  private buildForms(data?: any): void {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, []);
    this.formSave.controls['listSubsidizedBeneficialOgrId'] = new FormArray([]);
  }

  /**
   * setFormValue
   * param data
   */
  public setFormValue(data?: any) {
    this.buildForms({});
    if (data && data > 0) {
      this.subsidizedPeriodService.findOne(data)
        .subscribe(res => {
          this.buildForms(res.data);
          this.formSave.controls['listSubsidizedBeneficialOgrId'] = new FormArray([]);

          //load danh sach don vi huong
          if (res.data.listSubsidizedBeneficialOgrId && res.data.listSubsidizedBeneficialOgrId.length > 0) {
            this.formSave.setControl('listSubsidizedBeneficialOgrId', this.fb.array(res.data.listSubsidizedBeneficialOgrId.map(item => item) || []));
          }
        })
    }
  }

  public validateFormSave() {
    let result = true;
    if (!CommonUtils.isValidForm(this.formSave)) {
      result = false;
    }
    if (this.formSave.controls['listSubsidizedBeneficialOgrId'].value.length == 0) {
      this.showSoTienValidate = true;
      result = false;
    }
    return result;
  }

  public processSaveOrUpdate() {
    if (this.validateFormSave() == false) {
      return;
    }
    this.formSave.value['listSubsidizedBeneficialOgrId'] = this.formSave.get('listSubsidizedBeneficialOgrId').value;
    this.app.confirmMessage(null, () => { // on accepted
      this.subsidizedPeriodService.saveOrUpdate(this.formSave.value)
        .subscribe(res => {
          if (this.subsidizedPeriodService.requestIsSuccess(res) && res.data && res.data.subsidizedPeriodId) {
            this.goView(res.data.subsidizedPeriodId);
          }
        });
    }, () => {
      // on rejected   
    });
  }

  public goBack() {
    this.router.navigate(['/subsidized/subsidized-period']);
  }

  public goView(subsidizedPeriodId: any) {
    this.router.navigate([`/subsidized/subsidized-period/view/${subsidizedPeriodId}`]);
  }

  public onDecisionOrgChange(){
    this.formSave.controls['listSubsidizedBeneficialOgrId'].reset();
  }

  navigate() {
    this.router.navigate(['/subsidized/subsidized-period/edit', this.subsidizedPeriodId]);
  }
}
