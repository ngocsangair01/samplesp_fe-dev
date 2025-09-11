import { Component, OnInit, ViewChildren, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '@app/app.component';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { PartyMemberConcurrentProcessService } from '@app/core/services/party-organization/party-member-concurrent-process.service';
import { PartyMemebersService } from '@app/core/services/party-organization/party-members.service';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { CategoryService } from '@app/core/services/setting/category.service';
import * as moment from 'moment';
import { MassPositionService } from '@app/core/services/mass-organization/mass-position.service';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';
import { ManagementEmployeeService } from '@app/core/services/mass-organization/management-employee.service';

@Component({
  selector: 'population-member-process-form',
  templateUrl: './population-member-process-form.component.html',
})
export class PopulationMemberProcessFormComponent extends BaseComponent implements OnInit {
  employeeId;
  branch;
  formPosition: FormGroup;
  isMobileScreen: boolean = false;
  filterCondition;
  nameData;
  formConfig = {
    employeeId: [null],
    branch: [null],
    massMemberId: [null],
    massOrganizationId: [null, [Validators.required]],
    massPositionId: [null, [Validators.required]],
    effectiveDate: [null, [Validators.required, ValidationService.beforeCurrentDate]],
    expiredDate: [null],
    isHighest: [0]
  }

  constructor(
    public activeModal: NgbActiveModal,
    private app: AppComponent,
    private partyMemebersService: PartyMemebersService,
    private categoryService: CategoryService,
    private massPositionService: MassPositionService,
    private employeeResolver: EmployeeResolver,
    private managementEmployeeService: ManagementEmployeeService
  ) {
    super();
    this.employeeResolver.EMPLOYEE.subscribe(
      data => {
        if (data) {
          this.employeeId = data;
        }
      }
    );
    this.buildForms({});
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
  }

  setFormValue(data) {
    if (data) {
      this.branch = data.branch;
      this.filterCondition = ` AND obj.branch = ${data.branch}`;
      if (data.branch === 1) {
        this.nameData = 'women';
      } else if (data.branch === 2) {
        this.nameData = 'young';
      } else if (data.branch === 3) {
        this.nameData = 'union';
      }
      this.buildForms(data);
    } else {
      this.buildForms(data);
    }
  }

  buildForms(data) {
    this.formPosition = this.buildForm(data, this.formConfig, ACTION_FORM.UPDATE,
      [ValidationService.notAffter('effectiveDate', 'expiredDate', 'generalStandard.expiredDate')]);
  }

  get f() {
    return this.formPosition.controls;
  }

  processUpdate() {
    if (!CommonUtils.isValidForm(this.formPosition)) {
      return;
    }
    this.app.confirmMessage('', () => { // accept
      this.formPosition.get('branch').setValue(this.branch);
      this.managementEmployeeService.saveMassMember([this.formPosition.value])
        .subscribe(res => {
          if (this.managementEmployeeService.requestIsSuccess(res)) {
            this.activeModal.close(res);
          }
        })
    }, () => { // reject

    });
  }

  /**
   * onChangeUnit
   */
  onChangeUnit(event, partyOrgSelector) {
    if (event.partyOrganizationId) {
      if (this.f.partyMemberProcessId.value) {
        if (event.type !== APP_CONSTANTS.PARTY_ORG_TYPE.CBCS && event.type !== APP_CONSTANTS.PARTY_ORG_TYPE.CBTT) {
          this.app.errorMessage('partyOrgnization.notLeafPartyOrg');
          partyOrgSelector.delete();
        }
      }
      const currentDate = new Date();
      if (event.expiredDate === null) {
        const effectiveDate = new Date(event.effectiveDate);
        if (effectiveDate > currentDate) {
          this.app.errorMessage('partymember.partyOrganizationNotEffectYet');
          partyOrgSelector.delete();
        }
      } else {
        const expiredDate = new Date(event.expiredDate);
        if (expiredDate < currentDate) {
          this.app.errorMessage('partymember.partyOrganizationExpired');
          partyOrgSelector.delete();
        }
      }
    }
  }

  public onChangeMassOrg(data, massOrgSelector) {
    if (data.massOrganizationId) {
      const currentDate = moment(new Date(), 'DD/MM/YYYY');
      if (data.expritedDate === null) {
        const effectiveDate = moment(new Date(data.effectiveDate), 'DD/MM/YYYY');
        if (effectiveDate.isAfter(currentDate)) {
          this.app.errorMessage('partymember.partyOrganizationNotEffectYet');
          massOrgSelector.delete();
        }
      } else {
        const expiredDate = moment(new Date(data.expritedDate), 'DD/MM/YYYY');
        if (expiredDate.isSameOrBefore(currentDate)) {
          this.app.errorMessage('partymember.partyOrganizationExpired');
          massOrgSelector.delete();
        }
      }
    }
  }

  onChangePosition(event, item) {
    if (event.selectField) {
      this.massPositionService.findOne(event.selectField).subscribe(res => {
        item.controls.isHighest.setValue(res.data.isHighestPosition);
        // this.setHighest(item);
      });
    }
  }

  // setHighest(item) {
  //   if (item.controls.isHighest.value == 1) { // Neu set highest thi cap nhat truong isHighest cua cac ban ghi con lai = 0
  //     for (const i of this.formPosition.controls) {
  //       if (i['controls'].massOrganizationId.value == item.controls.massOrganizationId.value && i['controls'].massPositionId.value != item.controls.massPositionId.value) {
  //         i['controls'].isHighest.setValue(0);
  //       }
  //     }
  //   }
  // }
}