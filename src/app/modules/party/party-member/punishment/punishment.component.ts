import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { PartyMemebersService } from '@app/core/services/party-organization/party-members.service';
import { PersonalPunishmentService } from '@app/core/services/punishment/personal-punishment.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';

@Component({
  selector: 'punishment',
  templateUrl: './punishment.component.html',
  styleUrls: ['./punishment.component.css']
})
export class PunishmentComponent extends BaseComponent implements OnInit {

  formSave: FormGroup;
  employeeId: number;
  hidePersonalPunishment: boolean = false;
  empId: { employeeId: any };

  constructor(
    private app: AppComponent,
    private employeeResolver: EmployeeResolver,
    private personalPunishmentService: PersonalPunishmentService,
    private router: Router,
    private partyMemebersService: PartyMemebersService) {
    super(null, CommonUtils.getPermissionCode("resource.partyMember"));
    this.setMainService(personalPunishmentService);
    this.formSearch = this.buildForm({}, { employeeId: [''] });
  }
  ngOnInit() {
    this.employeeResolver.EMPLOYEE.subscribe(
      data => {
        if (data) {
          this.employeeId = data;
          this.empId = { employeeId: data };
          this.formSearch = this.buildForm(this.empId, { employeeId: [] });
          this.processSearchPunishmentForEmployee(this.employeeId);
        }
      }
    );
    this.partyMemebersService.selectMenuItem.subscribe(res => {
      let element = document.getElementById(res);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    })
  }
  public processSearch(event?): void {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const params = this.formSearch ? this.formSearch.value : null;
    // Xu ly trong truong hop click search thi lay them thong tin cau hinh datatable
    // if (!event) {
    //   event = this.getEventDatatable(this.dataTable);
    // }
  }

  public processSearchPunishmentForEmployee(employeeId?: any, event?: any) {
    this.personalPunishmentService.processSearchPunishmentForEmployee(employeeId, event).subscribe(res => {
      this.resultList = res;
    });
  }

  public processDelete(item) {
    if (item && item.punishmentId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.personalPunishmentService.deleteById(item.punishmentId)
          .subscribe(res => {
            if (this.personalPunishmentService.requestIsSuccess(res)) {
              this.processSearchPunishmentForEmployee(this.employeeId);
            }
          });
      }, () => {// on rejected
      });
    }
  }

  public prepareSaveOrUpdate(item?: any) {
    this.personalPunishmentService.isEmployee = true;
    this.router.navigate(['/monitoring-inspection/personal-punishment-managerment/edit/', item.punishmentId]);
  }
}
