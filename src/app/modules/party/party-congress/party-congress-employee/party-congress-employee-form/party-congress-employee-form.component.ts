import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Router, ActivatedRoute } from '@angular/router';
import { PartyCongressEmployeeService } from '@app/core/services/party-organization/party-congress-employee.service';
import { FormGroup, Validators } from '@angular/forms';
import { FileControl } from '@app/core/models/file.control';
import { CommonUtils } from '@app/shared/services';
import { AppComponent } from '@app/app.component';
import { CategoryService } from '@app/core/services/setting/category.service';
import { APP_CONSTANTS } from '@app/core';

@Component({
  selector: 'party-congress-employee-form',
  templateUrl: './party-congress-employee-form.component.html',
})
export class PartyCongressEmployeeFormComponent extends BaseComponent implements OnInit {
  partyCongressEmployeeId: number;
  formSave: FormGroup;
  isUpdate: boolean = false;
  isInsert: boolean = false;
  tenureList = [];
  formConfig = {
    partyCongressEmployeeId: [''],
    employeeId: ['', [Validators.required]],
    partyPositionId: ['', [Validators.required]],
    partyOrganizationId: ['', [Validators.required]],
    tenureId: ['', [Validators.required]],
    rewardForm: [null, [Validators.maxLength(200)]],
    rewardDate: [null, [Validators.maxLength(200)]],
    rewardReason: [null, [Validators.maxLength(1000)]],
    disciplineForm: [null, [Validators.maxLength(200)]],
    disciplineDate: [null, [Validators.maxLength(200)]],
    disciplineReason: [null, [Validators.maxLength(1000)]],
  };
  constructor(
    private router: Router,
    private partyCongressEmployeeService: PartyCongressEmployeeService,
    public actr: ActivatedRoute,
    private app: AppComponent,
    private categoryService: CategoryService
  ) {
    super(actr, CommonUtils.getPermissionCode("resource.partyCongressEmployee"));
    const params = this.actr.snapshot.params;
    if (params) {
      this.partyCongressEmployeeId = params.id;
    } 
    this.buildForms({});
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.TENURE).subscribe(
      res => this.tenureList = res.data
    );
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 2) {
      this.isUpdate = subPaths[2] === 'party-congress-employee-edit';
      this.isInsert = subPaths[2] === 'party-congress-employee-add';
    }
    if (this.partyCongressEmployeeId && this.partyCongressEmployeeId > 0) {
      this.partyCongressEmployeeService.findOne(this.partyCongressEmployeeId).subscribe(
        res => {
          if (this.partyCongressEmployeeService.requestIsSuccess(res)) {
            this.buildForms(res.data);
          } else {
            this.goBack();
          }
        }
      );
    }
  }

  buildForms(data) {
    this.formSave = this.buildForm(data, this.formConfig);
    const fileControl = new FileControl(null);
    if (data && data.fileAttachment && data.fileAttachment.file) {
      fileControl.setFileAttachment(data.fileAttachment.file);
    }
    this.formSave.addControl('profiles', fileControl);
  }

  get f() {
    return this.formSave.controls;
  }

  goBack() {
    this.router.navigate(['party-organization/party-congress-employee'])
  }

  processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.app.confirmMessage(null
      , () => {
        this.partyCongressEmployeeService.saveOrUpdateFormFile(this.formSave.value).subscribe(
          res => {
            if (this.partyCongressEmployeeService.requestIsSuccess(res)) {
              this.goBack();
            }
          }
        );
      }
      , () => {}
    );
  }
}
