import { Component, OnInit } from '@angular/core';
import { PartyMemberConcurrentProcessService } from '@app/core/services/party-organization/party-member-concurrent-process.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';

@Component({
  selector: 'party-member-concurrent-process-list',
  templateUrl: './party-member-concurrent-process-list.component.html'
})
export class PartyMemberConcurrentProcessListComponent extends BaseComponent implements OnInit {

  employeeId: number;
  empId: { employeeId: any };
  constructor(
    private employeeResolver: EmployeeResolver,
    private partyMemberConcurrentProcessService: PartyMemberConcurrentProcessService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeT63Information"));
    this.setMainService(partyMemberConcurrentProcessService);
    this.employeeResolver.EMPLOYEE.subscribe(
      data => {
        if (data) {
          this.employeeId = data;
          this.empId = { employeeId: data };
          this.formSearch = this.buildForm(this.empId, { employeeId: [''] });
        }
      }
    );
  }

  ngOnInit() {
  }

}
