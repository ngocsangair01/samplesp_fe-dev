import { Component, OnInit } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { EmployeeProfileService } from '@app/core/services/employee/employee_profile.service';
import { WorkProcessService } from '@app/core/services/employee/work-process.service';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { PartyMemebersService } from '@app/core/services/party-organization/party-members.service';
import { CommonUtils } from '@app/shared/services';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';
import { BaseComponent } from './../../../../shared/components/base-component/base-component.component';

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
    private partyMemebersService: PartyMemebersService,
    private app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyMember"));
    this.setMainService(workProcessService);
    // this.formSearch = this.buildForm({}, { employeeId: [''] });
    this.employeeResolver.EMPLOYEE.subscribe(
      data => {
        if (data) {
          this.employeeId = data;
          this.empId = { employeeId: data };
          this.formSearch = this.buildForm(this.empId, { employeeId: [''] });
          this.processSearchSynchronized();
        }
      }
    );
  }

  ngOnInit() {
    this.partyMemebersService.selectMenuItem.subscribe(res => {
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
  public processSaveKeyPosition(workProcessId) {
    // this.app.confirmMessage('updateKeyPosition.comfirm', () => {// on accepted
    //   // data
    //   let dataUpdate = [];
    //   dataUpdate.push({workProcessId: workProcessId, isKeyPosition: 1})
    //   this.workProcessService.processChangeKeyPosition(dataUpdate).subscribe(res => {
    //     this.processSearchSynchronized(null);
    //   });
    // }, () => {// on rejected
    // });
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

  processExportDeadPartyMember(item) {
    if (item.workProcessId && item.workProcessId > 0) {
      this.partyMemebersService.exportDeadPartyMember(item.workProcessId).subscribe(res => {
        saveAs(res, 'Phieu_bao_tu_tran_Dang_vien_' + item.fullName + '.docx');
      });
    }
  }
}
