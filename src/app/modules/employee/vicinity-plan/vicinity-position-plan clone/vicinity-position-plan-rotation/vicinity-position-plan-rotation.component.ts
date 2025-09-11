import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM } from '@app/core/app-config';
import { VicinityPositionPlanService } from '@app/core/services/vicinityPlan/vicinity-position-plan.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'vicinity-position-plan-rotation-clone',
  templateUrl: './vicinity-position-plan-rotation.component.html'
})
export class VicinityPositionPlanRotationCloneComponent extends BaseComponent implements OnInit {

  formRotation: FormGroup;
  formConfig = {
    vicinityPlanMappingId: [''],
    type: [''],
    note: [''],
    startDate: ['', [ValidationService.required]],
    endDate: [''],
    vicinityPositionPlanId: [''],
    documentId: [''],
    textNumberGiven: [''],
    describeReason: [''],
    organizationName: [''],
    documentName: [''],
    positionName: [''],
    documentNumber: [''],
    fullName: [''],
    positionId: [''],
    employeeId: [''],
    excludedReason: [''],
    description: [''],
    credibilityRatio: ['']
  };

  constructor(
    public actr: ActivatedRoute,
    private router: Router,
    private app: AppComponent,
    private vicinityPositionPlanService: VicinityPositionPlanService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
    this.formRotation = this.buildForm({}, this.formConfig, ACTION_FORM.INSERT, ValidationService.notAffter('startDate', 'endDate', 'party.member.start.date.to.label'));
  }

  ngOnInit() {
    this.actr.params.subscribe(params => {
      if (params['vicinityPlanMappingId']) {
        this.buildFormsDetail(params['vicinityPlanMappingId']);
      }
    });
  }

  get f() {
    return this.formRotation.controls;
  }

  validateBeforeSave(): boolean {
    const isValidFormSave = CommonUtils.isValidForm(this.formRotation);

    if (!isValidFormSave)
      return false;
    return true;
  }

  processSaveOrUpdate() {
    // Xet file vao form
    if (!this.validateBeforeSave()) {
      return;
    }

    this.app.confirmMessage(null, () => { // on accepted
      this.vicinityPositionPlanService.updateRotation(this.formRotation.value).subscribe(res => {
        if (this.vicinityPositionPlanService.requestIsSuccess(res)) {
          this.router.navigate(['/employee/vicinity-position-plan-clone/detail/', this.f['vicinityPositionPlanId'].value]);
        }
      });
    }, () => {
    });
  }

  public goBack() {
    this.router.navigate(['/employee/vicinity-position-plan-clone/detail/', this.f['vicinityPositionPlanId'].value]);
  }

  private buildFormsDetail(vicinityPlanMappingId?: any) {
    if (vicinityPlanMappingId) {
      this.vicinityPositionPlanService.getDetailRotation(vicinityPlanMappingId).subscribe(res => {
        if (res.data) {
          if (res.data.type !== null) {
            res.data.type = res.data.type.toString();
          }
          if (res.data.excludedReason !== null) {
            res.data.excludedReason = res.data.excludedReason.toString();
          }
          this.formRotation = this.buildForm(res.data, this.formConfig);
        }
      });
    }
  }
}
