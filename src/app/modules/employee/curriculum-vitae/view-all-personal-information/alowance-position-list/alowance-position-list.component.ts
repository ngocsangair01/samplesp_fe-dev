import { Component, OnInit, ViewChild } from '@angular/core';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { TableFooterComponent } from '@app/shared/components/table-footer/table-footer.component';
import { CommonUtils } from '@app/shared/services';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';

@Component({
  selector: 'alowance-position-list',
  templateUrl: './alowance-position-list.component.html',
  styleUrls: ['./alowance-position-list.component.css']
})
export class AlowancePositionListComponent extends BaseComponent implements OnInit {

  employeeId: number;
  resultList: any;
  @ViewChild('ptable') dataTable: any;
  @ViewChild('tableFooter') tableFooter: TableFooterComponent; // gọi đến table footer
  first = 0;

  constructor(
    private employeeResolver: EmployeeResolver,
    private curriculumVitaeService: CurriculumVitaeService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employee360Information"));
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

  processSearch(event?: any) {
    this.curriculumVitaeService.getListEmpAllowancePostitionByEmployeeId(this.employeeId, event)
      .subscribe(res => {
        this.resultList = res;
      });

    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }

  // reset pagination và hiển thị số lượng bản ghi
  resetPagination(): void {
    this.first = 0;
    this.tableFooter.resetDropdown();
  }
}
