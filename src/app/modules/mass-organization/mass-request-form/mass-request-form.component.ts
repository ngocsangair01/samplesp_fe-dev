import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { MassOrganizationService } from '@app/core/services/mass-organization/mass-organization.service';
import { MassRequestService } from '@app/core/services/mass-organization/mass-request.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslationService } from 'angular-l10n';

@Component({
  selector: 'mass-request-form',
  templateUrl: './mass-request-form.component.html',
  styleUrls: ['./mass-request-form.component.css']
})
export class MassRequestFormComponent extends BaseComponent implements OnInit {

  formSave: FormGroup;
  formConfig = {
    massRequestId: [''],
    massOrganizationId: ['', [ValidationService.required]],
    branch: [''],
    signVoffice: ['', [ValidationService.required]],
    description: [''],
    massRequestCode: ['', [ValidationService.required, ValidationService.maxLength(50)]],
    massRequestName: ['', [ValidationService.required, ValidationService.maxLength(200)]],
    finishDate: ['', [ValidationService.required, ValidationService.afterCurrentDate]],
  };
  public branch: any;
  public isSignVoffice: string = this.translation.translate('massRequest.mustNotSign');
  public isChecked: boolean = false;

  constructor(public actr: ActivatedRoute,
    private app: AppComponent,
    public activeModal: NgbActiveModal,
    public translation: TranslationService,
    private massRequestService: MassRequestService,
    private massOrganizationService: MassOrganizationService) {
    super(null, CommonUtils.getPermissionCode("resource.massRequestCriteria"));
    this.buildForms({});
  }

  ngOnInit() {
  }

  public buildForms(data?: any) {
    this.formSave = this.buildForm(data, this.formConfig);
  }

  get f() {
    return this.formSave.controls;
  }

  /**
   * Set form value after pop-up
   * @param data 
   */
  private setFormValue(data) {
    if (data && data.massRequestId > 0) {
      this.buildForms(data);
      const signVoffice = String(data.signVoffice);
      this.formSave.controls['signVoffice'].setValue(signVoffice);
      this.branch = data.branch;
    } else {
      this.buildForms(data);
      this.formSave.controls['branch'].setValue(data);
      this.branch = data;
    }
  }

  /**
 * Action insert or update
 */
  public processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }

    this.app.confirmMessage(null, () => { // on accepted
      this.massRequestService.saveOrUpdate(this.formSave.value).subscribe(res => {
        if (this.massRequestService.requestIsSuccess(res)) {
          this.activeModal.close(res);
        }
      });
    }, () => {
      // on rejected   
    }
    );
  }

  onChangeMassOrg(event, massOrganizationSelector) {
    if (event && event.massOrganizationId > 0) {
      const currentDate = new Date();
      if (event.expiredDate === null) {
        const effectiveDate = new Date(event.effectiveDate);
        if (effectiveDate > currentDate) {
          this.app.errorMessage('partymember.partyOrganizationNotEffectYet');
          massOrganizationSelector.delete();
        }
      } else {
        const expiredDate = new Date(event.expiredDate);
        if (expiredDate < currentDate) {
          this.app.errorMessage('partymember.partyOrganizationExpired');
          massOrganizationSelector.delete();
        }
      }
      this.massOrganizationService.findByParentId(event.massOrganizationId).subscribe(
        res => {
          if (!(res.data.length > 0)) {
            massOrganizationSelector.delete();
          }
        }
      );
    }
  }
}
