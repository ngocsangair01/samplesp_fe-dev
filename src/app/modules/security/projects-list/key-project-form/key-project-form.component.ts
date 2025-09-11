import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { KeyProjectService } from '@app/core/services/security/key-project.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'key-project-form',
  templateUrl: './key-project-form.component.html',
})
export class KeyProjectFormComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  view: boolean;
  update: boolean;
  listKeyProjectType: any;
  statusList: any;
  keyProjectId: any;
  public isView: boolean = false;
  formconfig = {
    keyProjectId: [''],
    code: ['', ValidationService.required],
    name: ['', ValidationService.required],
    startDate: ['', ValidationService.required],
    endDate: [''],
    type: ['', ValidationService.required],
    organizationId: ['', ValidationService.required],
  }

  constructor(
    private keyProjectService: KeyProjectService,
    private router: Router,
    public actr: ActivatedRoute,
    private app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode("resource.projectsForm"));
    this.listKeyProjectType = APP_CONSTANTS.KEY_PROJECT_TYPE;
    this.actr.params.subscribe(params => {
      if (params && params.id != null) {
        this.keyProjectId = params.id;
        this.setFormValue(this.keyProjectId);
      }

    });
    this.buildForms({});
  }

  get f() {
    return this.formSave.controls;
  }

  ngOnInit() {
    this.setFormValue(this.keyProjectId);
    const subPaths = this.router.url.split('/');
    if (subPaths.length >= 3) {
      if (subPaths[3] == 'view') {
        this.view = true;
      } else if (subPaths[3] == 'edit') {
        this.update = true;
      }
    }
  }

  public buildForms(data?: any) {
    this.formSave = this.buildForm(data, this.formconfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('startDate', 'endDate', 'protectsecurity.mainproject.label.nkt')]);
  }

  public setFormValue(data?: any) {
    if (data && data > 0) {
      this.keyProjectService.findOne(data).subscribe(res => {
        this.buildForms(res.data);
      });
    }
  }

  public goBack() {
    this.router.navigate(['/security-guard/key-projects']);
  }

  public processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.app.confirmMessage(null, () => {
      this.keyProjectService.saveOrUpdate(this.formSave.value).subscribe(res => {
        if (this.keyProjectService.requestIsSuccess(res)) {
          this.router.navigate(['/security-guard/key-projects']);
        }
      })
    }, () => { // on rejected

    });
  }
}