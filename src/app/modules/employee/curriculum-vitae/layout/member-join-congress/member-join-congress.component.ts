import { Component, OnInit } from '@angular/core';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { PartyCongressEmployeeService } from '@app/core/services/party-organization/party-congress-employee.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';

@Component({
  selector: 'member-join-congress',
  templateUrl: './member-join-congress.component.html',
  styleUrls: ['./member-join-congress.component.css']
})
export class MemberJoinCongressComponent extends BaseComponent implements OnInit {
  employeeId: number;
  hideInfoHeader: boolean = false;

  constructor(private employeeResolver: EmployeeResolver,
    private fileStorage: FileStorageService,
    private partyCongressEmployeeService: PartyCongressEmployeeService,
    private curriculumVitaeService: CurriculumVitaeService) {
    super(null, CommonUtils.getPermissionCode("resource.partyMemberProcess"));
    this.setMainService(partyCongressEmployeeService);
  }

  ngOnInit() {
    this.employeeResolver.EMPLOYEE.subscribe(
      data => {
        if (data) {
          this.employeeId = data;
          this.formSearch = this.buildForm({ employeeId: this.employeeId }, { employeeId: [''] });
          // get data
          this.processSearch();
        }
      }
    );
    this.curriculumVitaeService.selectMenuItem.subscribe(res => {
      let element = document.getElementById(res);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    })
  }
  /**
   * Xu ly download file trong danh sach
   */
  public downloadFile(fileData) {
    this.fileStorage.downloadFile(fileData.secretId).subscribe(res => {
      saveAs(res, fileData.fileName);
    });
  }
}
