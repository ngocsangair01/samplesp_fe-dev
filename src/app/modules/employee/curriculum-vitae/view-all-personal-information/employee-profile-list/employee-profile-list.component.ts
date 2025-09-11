import { Component, OnInit } from '@angular/core';
import { EmployeeProfileService } from '@app/core/services/employee/employee_profile.service';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';

@Component({
  selector: 'employee-profile-list',
  templateUrl: './employee-profile-list.component.html'
})
export class EmployeeProfileListComponent extends BaseComponent implements OnInit {
  employeeId: number;
  empId: { employeeId: any };
  
  constructor(
    private employeeProfileService: EmployeeProfileService,
    private employeeResolver: EmployeeResolver,
    private fileStorage: FileStorageService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeT63Information"));
    this.setMainService(employeeProfileService);
    this.formSearch = this.buildForm({}, { employeeId: [''] });
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

  /**
   * ngOnInit
   */
  ngOnInit() {
  }

  /**
   * Xu ly download file trong danh sach
   */
  public downloadFile(fileData, item) {
    if (item && item.isFromVHR !== 1) {
      this.fileStorage.downloadFile(fileData.secretId).subscribe(res => {
        saveAs(res, fileData.fileName);
      });
    } else {
      this.employeeProfileService.downloadFileFromTTNS(fileData.attachmentFileId).subscribe(res => {
        saveAs(res, fileData.fileName);
      });
    }
  }
}
