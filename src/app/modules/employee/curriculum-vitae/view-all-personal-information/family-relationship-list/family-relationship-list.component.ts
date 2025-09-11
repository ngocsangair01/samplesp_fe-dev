import { Component, OnInit, ViewChild } from '@angular/core';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';

@Component({
  selector: 'family-relationship-list',
  templateUrl: './family-relationship-list.component.html'
})
export class FamilyRelationshipListComponent extends BaseComponent implements OnInit {

  employeeId: number;
  resultList: any;
  @ViewChild('ptable') dataTable: any;
  constructor(
    private employeeResolver: EmployeeResolver,
    private curriculumVitaeService: CurriculumVitaeService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeT63Information"));
    this.employeeResolver.EMPLOYEE.subscribe(
      data => {
        if (data) {
          this.employeeId = data;
        }
      }
    );
  }

  ngOnInit() {
  }

  processSearch(event?) {
    this.curriculumVitaeService.getEmpFamilyRelationshipByEmpoyeeId(this.employeeId, event)
      .subscribe(res => {
        this.resultList = res;
      });

    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }
}
