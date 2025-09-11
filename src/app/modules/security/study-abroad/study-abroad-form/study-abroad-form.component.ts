import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { KeyProjectService } from '@app/core/services/security/key-project.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import {StudyAbroadService} from "@app/core/services/security/studyAbroad.service";
import {NationService} from "@app/core/services/nation/nation.service";
import {SysCatService} from "@app/core/services/sys-cat/sys-cat.service";

@Component({
  selector: 'study-abroad-form',
  templateUrl: './study-abroad-form.component.html',
  styleUrls: ['./study-abroad-form.component.css']
})
export class StudyAbroadFormComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  view: boolean;
  update: boolean;
  create: boolean;
  statusList: any;
  studyBroadId: any;
  nationList: any;
  yearList: any;
  levelEducationList: any;
  specializeTrainingList: any;
  public isView: boolean = false;
  formconfig = {
    employeeId: ['', ValidationService.required],
    studyAbroadId: [],
    schoolName: ['', ValidationService.required],
    passportNumber: ['', ValidationService.required],
    passportDate: ['', ValidationService.required],
    passportPlace: ['', ValidationService.required],
    schoolAddress: ['', ValidationService.required],
    studyLevel: ['', ValidationService.required],
    country: ['', ValidationService.required],
    studyField: ['', ValidationService.required],
    fromDate: ['', ValidationService.required],
    toDate: ['', ValidationService.required],
    graduationYear: ['', ValidationService.required],
    politicalAttitude: [''],
  }

  constructor(
    private keyProjectService: KeyProjectService,
    private studyAbroadService: StudyAbroadService,
    private router: Router,
    private nationService: NationService,
    private sysCatService: SysCatService,
    public actr: ActivatedRoute,
    private app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode("resource.projectsForm"));
    this.actr.params.subscribe(params => {
      if (params && params.id != null) {
        this.studyBroadId = params.id;
        this.setFormValue(this.studyBroadId);
      }
    });
    this.nationService.getNationList().subscribe(res => this.nationList = res.data);
    this.yearList = this.getYearList();
    // Danh sach trinh do dao tao
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.CLL_ILL).subscribe(
        res => this.levelEducationList = res.data
    );
    // Danh sach chuyen nganh dao tao
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.SPECIALIZE_TRAINING).subscribe(
        res => this.specializeTrainingList = res.data
    );
    this.buildForms({});
  }

  get f() {
    return this.formSave.controls;
  }

  ngOnInit() {

    this.setFormValue(this.studyBroadId);
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
    this.formSave = this.buildForm(data, this.formconfig, ACTION_FORM.VIEW);
  }

  public setFormValue(data?: any) {
    if (data && data > 0) {
      this.studyAbroadService.findOne(data).subscribe(res => {
        this.buildForms(res.data);
      });
    }
  }

  public goBack() {
    this.router.navigate(['/security-guard/study-abroad']);
  }

  public processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.app.confirmMessage(null, () => {
      this.studyAbroadService.saveOrUpdate(this.formSave.value).subscribe(res => {
        if (this.studyAbroadService.requestIsSuccess(res) && res.data && res.data.studyAbroadId) {
          this.router.navigate([`/security-guard/study-abroad/edit/${res.data.studyAbroadId}`]);
        }
      })
    }, () => { // on rejected

    });
  }

  private getYearList() {
    const yearList = [];
    const currentYear = new Date().getFullYear();
    for (let i = (currentYear - 150); i <= (currentYear + 150); i++) {
      const obj = {
        year: i
      };
      yearList.push(obj);
    }
    return yearList;
  }
}
