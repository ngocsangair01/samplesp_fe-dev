import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {EmployeeResolver} from "@app/shared/services/employee.resolver";
import {CurriculumVitaeService} from "@app/core/services/employee/curriculum-vitae.service";
import {CommonUtils} from "@app/shared/services";
import {BaseComponent} from "@app/shared/components/base-component/base-component.component";

@Component({
    selector: 'insurance-salary-process-list',
    templateUrl: './insurance-salary-process-list.component.html'
})
export class InsuranceSalaryProcessListComponent extends BaseComponent implements OnInit {

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
        this.curriculumVitaeService.getListEmpInsuranceSalaryProcessByEmployeeId(this.employeeId, event)
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
