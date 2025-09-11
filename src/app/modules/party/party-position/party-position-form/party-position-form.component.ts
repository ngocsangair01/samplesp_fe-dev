import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM } from '@app/core';
import { PartyPositionService } from '@app/core/services/party-organization/party-position.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { ValidationService } from '@app/shared/services/validation.service';

@Component({
  selector: 'party-position-form',
  templateUrl: './party-position-form.component.html',
  styleUrls: ['./party-position-form.component.css']
})
export class PartyPositionFormComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  partyPositionId: any;
  partyTypeList: any;
  isEditMode: boolean = false;
  isView: boolean = false;
  isUpdate: boolean = false;
  isInsert: boolean = false;
  isMobileScreen: boolean = false;
  formConfig = {
    partyPositionId: ['', [ValidationService.maxLength(20)]],
    code: ['', [ValidationService.required, ValidationService.maxLength(50)]],
    name: ['', [ValidationService.required, ValidationService.maxLength(200)]],
    effectiveDate: ['', [ValidationService.beforeCurrentDate, ValidationService.required]],
    expritedDate: [''],
    sortOrder: ['', [ValidationService.positiveInteger, Validators.min(1), ValidationService.maxLength(11)]],
  };

  constructor(
    private partyPositionService: PartyPositionService,
    public actr: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private app: AppComponent) {
    super(null, CommonUtils.getPermissionCode("resource.partyPosition"));
    this.buildForms({});
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.partyPositionId = params.id;
        }
      }
    });
    if (this.activatedRoute.snapshot.paramMap.get('view') === 'view') {
      this.isView = true;
      this.isEditMode = false;
    }
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 2) {
      this.isUpdate = subPaths[2] === 'party-position-edit';
      this.isInsert = subPaths[2] === 'party-position-add';
      this.isView = subPaths[2] === 'party-position-view';
    }
    this.setFormValue(this.partyPositionId);
  }

  get f() {
    return this.formSave.controls;
  }

  /**
   * buildForm
   */
  private buildForms(data?: any): void {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT,
      [ValidationService.notAffter('effectiveDate', 'expritedDate', 'partyPosition.label.expiredDate')]);
  }

  /**
   * setFormValue
   * param data
   */
  public setFormValue(data?: any) {
    if (data && data > 0) {
      this.partyPositionService.findOne(data)
        .subscribe(res => {
          this.buildForms(res.data);
          this.isEditMode = true;
        })
    }
  }

  public processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.app.confirmMessage(null, () => { // on accepted
      this.partyPositionService.saveOrUpdate(this.formSave.value)
        .subscribe(res => {
          if (this.partyPositionService.requestIsSuccess(res) && res.data && res.data.partyPositionId) {
            this.goView(res.data.partyPositionId);
          }
        });
    }, () => {
      // on rejected   
    });
  }

  public goBack() {
    this.router.navigate(['/party-organization/party-position']);
  }

  public goView(partyPositionId: any) {
    this.router.navigate([`/party-organization/party-position-view/${partyPositionId}/view`]);
  }

  navigate() {
    this.router.navigate(['/party-organization/party-position-edit', this.partyPositionId]);
  }
}