import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PartyMemberConcurrentProcessService } from '@app/core/services/party-organization/party-member-concurrent-process.service';
import { PartyMemebersService } from '@app/core/services/party-organization/party-members.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { EducationProcessService } from '@app/core/services/employee/education-process.service';

@Component({
  selector: 'education-process-member-search',
  templateUrl: './education-process-member-search.component.html',
  styleUrls: ['./education-process-member-search.component.css']
})
export class EductionProcessMemberSearchComponent extends BaseComponent implements OnInit {
  employeeId;
  // formSearch: FormGroup;
  listEducationProcess = this.resultList;
  hideEducationProcess: boolean = false;

  constructor(
    private employeeResolver: EmployeeResolver,
    private partyMemberConcurrentProcessService: PartyMemberConcurrentProcessService,
    private modalService: NgbModal,
    private curriculumVitaeService: CurriculumVitaeService,
    private educationProcessService: EducationProcessService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.educationProcess"));
    this.setMainService(partyMemberConcurrentProcessService);
    this.employeeResolver.EMPLOYEE.subscribe(
      data => {
        if (data) {
          this.employeeId = data;
          this.processSearch();
        }
      }
    );
  }

  ngOnInit() {
    this.curriculumVitaeService.selectMenuItem.subscribe(res => {
      let element = document.getElementById(res);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    })
  }

  processSearch(event?: any){
    if(this.employeeId){
      this.educationProcessService.search2({ employeeId: this.employeeId }, event).subscribe(res => {
        this.listEducationProcess = res;
      });
    }

    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }
}
