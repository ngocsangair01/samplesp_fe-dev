import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM } from '@app/core';
import { KeyProjectService } from '@app/core/services/security/key-project.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import {StudyAbroadService} from "@app/core/services/security/studyAbroad.service";
import {WorkedAbroadService} from "@app/core/services/security/workedAbroad.service";
import {NationService} from "@app/core/services/nation/nation.service";

@Component({
  selector: 'worked-abroad-form',
  templateUrl: './worked-abroad-form.component.html',
  styleUrls: ['./worked-abroad-form.component.css']
})
export class WorkedAbroadFormComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  view: boolean;
  update: boolean;
  create: boolean;
  statusList: any;
  nationList: any;
  workedAbroadId: any;
  public isView: boolean = false;
  formConfig = {
    employeeId: ['', ValidationService.required],
    workedAbroadId: [],
    passportNumber: ['', ValidationService.required],
    passportDate: ['', ValidationService.required],
    passportPlace: ['', ValidationService.required],
    country: ['', ValidationService.required],
    fromDate: ['', ValidationService.required],
    toDate: ['', ValidationService.required],
    organizationBefore: ['', ValidationService.required],
    address: ['', ValidationService.required],
    politicalAttitude: [''],
  }

  constructor(
    private keyProjectService: KeyProjectService,
    private workedAbroadService: WorkedAbroadService,
    private nationService: NationService,
    private router: Router,
    public actr: ActivatedRoute,
    private app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode("resource.projectsForm"));
    this.actr.params.subscribe(params => {
      if (params && params.id != null) {
        this.workedAbroadId = params.id;
        this.setFormValue(this.workedAbroadId);
      }
    });
    this.nationService.getNationList().subscribe(res => this.nationList = res.data);
    this.buildForms({});
  }

  get f() {
    return this.formSave.controls;
  }

  ngOnInit() {

    this.setFormValue(this.workedAbroadId);
    const subPaths = this.router.url.split('/');
    if (subPaths.length >= 3) {
      if (subPaths[3] == 'view') {
        this.view = true;
      } else if (subPaths[3] == 'edit') {
        this.update = true;
      }else{
        this.create = true;
      }
    }
  }

  public buildForms(data?: any) {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.VIEW);
  }

  public setFormValue(data?: any) {
    if (data && data > 0) {
      this.workedAbroadService.findOne(data).subscribe(res => {
        this.buildForms(res.data);
      });
    }
  }

  public goBack() {
    this.router.navigate(['/security-guard/worked-abroad']);
  }

  public processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.app.confirmMessage(null, () => {
      this.workedAbroadService.saveOrUpdate(this.formSave.value).subscribe(res => {
        if (this.workedAbroadService.requestIsSuccess(res) && res.data && res.data.workedAbroadId) {
          this.router.navigate([`/security-guard/worked-abroad/edit/${res.data.workedAbroadId}`]);
        }
      })
    }, () => { // on rejected

    });
  }
}
