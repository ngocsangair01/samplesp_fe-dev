import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import {ACTION_FORM, APP_CONSTANTS} from '@app/core';
import { KeyProjectService } from '@app/core/services/security/key-project.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import {WorkedAbroadService} from "@app/core/services/security/workedAbroad.service";
import {RelativeAbroadService} from "@app/core/services/security/relativeAbroad.service";
import {NationService} from "@app/core/services/nation/nation.service";
import {SysCatService} from "@app/core/services/sys-cat/sys-cat.service";

@Component({
  selector: 'relative-abroad-form',
  templateUrl: './relative-abroad-form.component.html',
  styleUrls: ['./relative-abroad-form.component.css']
})
export class RelativeAbroadFormComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  view: boolean;
  update: boolean;
  create: boolean;
  statusList: any;
  workedAbroadId: any;
  nationList: any;
  relationshipList: any;
  public isView: boolean = false;
  formConfig = {
    employeeId: ['', ValidationService.required],
    relativeAbroadId: [],
    relativeName: ['', ValidationService.required],
    relationship: ['', ValidationService.required],
    nationality: ['', ValidationService.required],
    reasonAbroad: ['', ValidationService.required],
    address: ['', ValidationService.required],
    organizationName: [''],
    country: ['', ValidationService.required],
    organizationAddress: [''],
    timeAbroad: ['', ValidationService.required],
    expenseAbroad: ['', ValidationService.required],
    settlementTime: [''],
    passportNumber: ['', ValidationService.required],
    passportDate: ['', ValidationService.required],
    passportPlace: ['', ValidationService.required],
    politicalAttitude: [''],
  }

  constructor(
    private keyProjectService: KeyProjectService,
    private relativeAbroadService: RelativeAbroadService,
    private router: Router,
    public actr: ActivatedRoute,
    private nationService: NationService,
    private sysCatService: SysCatService,
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
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.RELATION_SHIP).subscribe(
        res => this.relationshipList = res.data
    );
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
      this.relativeAbroadService.findOne(data).subscribe(res => {
        this.buildForms(res.data);
      });
    }
  }

  public goBack() {
    this.router.navigate(['/security-guard/relative-abroad']);
  }

  public processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.app.confirmMessage(null, () => {
      this.relativeAbroadService.saveOrUpdate(this.formSave.value).subscribe(res => {
        if (this.relativeAbroadService.requestIsSuccess(res) && res.data && res.data.relativeAbroadId) {
          this.router.navigate([`/security-guard/relative-abroad/edit/${res.data.relativeAbroadId}`]);
        }
      })
    }, () => { // on rejected

    });
  }
}
