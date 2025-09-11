import { Component, OnInit } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { EmployeeProfileService } from '@app/core/services/employee/employee_profile.service';
import { WorkProcessService } from '@app/core/services/employee/work-process.service';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { CommonUtils } from '@app/shared/services';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';
import { BaseComponent } from './../../../../shared/components/base-component/base-component.component';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';

@Component({
  selector: 'work-process-member',
  templateUrl: './work-process-member.component.html',
  styleUrls: ['./work-process-member.component.css']
})
export class WorkProcessMemberComponent extends BaseComponent implements OnInit {
  selectedGop: [];
  employeeId: number;
  hideCurriculumvitaesecurity: boolean = false;
  empId: { employeeId: any };
  constructor(
    private employeeResolver: EmployeeResolver,
    private workProcessService: WorkProcessService,
    private employeeProfileService: EmployeeProfileService,
    private fileStorage: FileStorageService,
    private app: AppComponent,
    private curriculumVitaeService: CurriculumVitaeService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
    // this.setMainService(workProcessService);
    // this.formSearch = this.buildForm({}, { employeeId: [''] });
    this.employeeResolver.EMPLOYEE.subscribe(
      data => {
        if (data) {
          this.employeeId = data;
          this.empId = { employeeId: data };
          // this.formSearch = this.buildForm(this.empId, { employeeId: [''] });
          this.processSearchSynchronized();
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

  /**
   * Lưu thay đổi là vị trí trọng yếu
   */
  public processSaveKeyPosition() {
    this.app.confirmMessage('updateKeyPosition.comfirm', () => {// on accepted
      // data
      let dataUpdate = [];
      this.resultList.data.forEach(gop => {
        dataUpdate.push({ workProcessId: gop.workProcessId });
      });
      dataUpdate.forEach(gop => {
        let isKeyPosition = 0;
        this.selectedGop.forEach(item => {
          if (item['workProcessId'] == gop.workProcessId) {
            isKeyPosition = 1;
          }
        });
        gop.isKeyPosition = isKeyPosition;
      });
      this.workProcessService.processChangeKeyPosition(dataUpdate).subscribe(res => {
        this.processSearchSynchronized(null);
      });
    }, () => {// on rejected
    });
  }
  public processSearchSynchronized(event?: any) {
    this.workProcessService.processSearchSynchronized(this.employeeId, event).subscribe(
      res => {
        this.resultList = res;
        this.selectedGop = res.data.filter(gop => {
          return gop.isKeyPosition == 1;
        });
      });
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
