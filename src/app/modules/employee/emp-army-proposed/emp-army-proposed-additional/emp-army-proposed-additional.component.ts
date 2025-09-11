
import { ActivatedRoute } from '@angular/router';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { HelperService } from '@app/shared/services/helper.service';
import { AppComponent } from '@app/app.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmpArmyProposedService } from '@app/core/services/employee/emp-army-proposed.service';

@Component({
  selector: 'emp-army-proposed-additional',
  templateUrl: './emp-army-proposed-additional.component.html',
  styleUrls: ['./emp-army-proposed-additional.component.css']
})
export class EmpArmyProposedAdditionalComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  listType: any;
  listYear = [];
  isUpdate: boolean = false;
  isInsert: boolean = false;
  isMobileScreen: boolean = false;
  formConfig = {
    type: ['', ValidationService.required],
    employeeId: ['', ValidationService.required],
    year: ['', ValidationService.required],
  }

  year: number;
  constructor(
    public activeModal: NgbActiveModal,
    private empArmyProposedService: EmpArmyProposedService,
    public actr: ActivatedRoute,
    public app: AppComponent,
    private helperService: HelperService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.empArmyProposed"));
    this.buildForms({});
    this.setMainService(empArmyProposedService);
    this.empArmyProposedService.getListType().subscribe(res => {
      this.listType = res.data;
    })
    this.year = new Date().getFullYear();
    for (let i = this.year - 5; i < this.year + 5; i++) {
      this.listYear.push({label: i, value: i});
    }
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    this.formSave.get('year').setValue(this.year);
  }

  // quay lai
  public goBack() {
    this.activeModal.close();
  }

  // them moi or sua
  processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.app.confirmMessage(null, () => { // on accept
      if (!CommonUtils.isValidForm(this.formSave)) {
        return;
      } else {
        this.empArmyProposedService.saveOrUpdate(this.formSave.value)
          .subscribe(res => {
            if (this.empArmyProposedService.requestIsSuccess(res)) {
              this.helperService.reloadHeaderNotification('complete');
              this.activeModal.close(res);
            }
          });
      } () => {

      }
    }, () => {
      // on rejected
    });
  }

  private buildForms(data?: any): void {
    this.formSave = this.buildForm(data, this.formConfig);
  }

  get f() {
    return this.formSave.controls;
  }
}