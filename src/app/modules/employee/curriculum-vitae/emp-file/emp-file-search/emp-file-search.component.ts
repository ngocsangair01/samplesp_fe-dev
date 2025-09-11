
import { DEFAULT_MODAL_OPTIONS } from '@app/core/app-config';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { EmployeeProfileService } from '@app/core/services/employee/employee_profile.service';
import { EmpFileFormComponent } from '../emp-file-form/emp-file-form.component';
import { EmpFileImportFormComponent } from '../emp-file-import-form/emp-file-import-form.component';
import { CommonUtils } from '@app/shared/services';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';

@Component({
  selector: 'emp-file-search',
  templateUrl: './emp-file-search.component.html',
  styleUrls: ['./emp-file-search.component.css']
})
export class EmpFileSearchComponent extends BaseComponent implements OnInit {
  employeeId: number;
  empId: {employeeId: any};
  listRequire = [];
  hideFileHardCopyUploadLst: boolean = false;
  hideResultList: boolean = false;
  isMobileScreen: boolean = false;

  @ViewChild('pTable') dataTable: any;
  constructor(public actr: ActivatedRoute
            , private modalService: NgbModal
            , private employeeProfileService: EmployeeProfileService
            , private employeeResolver: EmployeeResolver
            , private fileStorage: FileStorageService
            , private curriculumVitaeService: CurriculumVitaeService
            ) {
    super(actr, CommonUtils.getPermissionCode("resource.empFile"));
    this.setMainService(employeeProfileService);
    this.formSearch = this.buildForm({}, {employeeId: ['']});
    this.employeeResolver.EMPLOYEE.subscribe(
      data => {
        if (data) {
          this.employeeId = data;
          this.empId = {employeeId: data};
          this.formSearch = this.buildForm(this.empId, {employeeId: ['']});
          this.getRequireEmpFileType();
          this.processSearch();
        }
      }
    );
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }
  /**
   * ngOnInit
   */
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
   * prepareUpdate
   * param item
   */
  prepareSaveOrUpdate(item?: any) {
    if (item && item.empFileId > 0) {
      this.employeeProfileService.findOne(item.empFileId)
        .subscribe(res => {
          this.activeModal(res.data);
        });
    } else {
      this.activeModal({employeeId: this.employeeId});
    }
  }

  /**
   * show model
   * data
   */
  private activeModal(data?: any) {
    const modalRef = this.modalService.open(EmpFileFormComponent, DEFAULT_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.employeeProfileService.requestIsSuccess(result)) {
        this.employeeResolver.EMP_TYPE_PROCESS.next(this.employeeId);
        this.processSearch();
        this.getRequireEmpFileType();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }

    /**
   * prepareUpdate
   * param item
   */
  importProfile(item?: any) {
    this.activeImportModal({employeeId: this.employeeId});
  }

  /**
   * show model
   * data
   */
  private activeImportModal(data?: any) {
    const modalRef = this.modalService.open(EmpFileImportFormComponent, DEFAULT_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.employeeProfileService.requestIsSuccess(result)) {
        this.employeeResolver.EMP_TYPE_PROCESS.next(this.employeeId);
        this.processSearch();
        this.getRequireEmpFileType();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }

  /**
   * Xu ly download file trong danh sach
   */
  public downloadFile(fileData, item) {
    if (item && item.isFromVHR !== 1) {
      this.fileStorage.downloadFile(fileData.secretId).subscribe(res => {
          saveAs(res , fileData.fileName);
      });
    } else {
      this.employeeProfileService.downloadFileFromTTNS(fileData.attachmentFileId).subscribe(res => {
        saveAs(res , fileData.fileName);
      });
    }
  }

  public processDeletes(item): void {
    if (item && item.empFileId > 0) {
      this.employeeProfileService.confirmDelete({
        messageCode: null,
        accept: () => {
          this.employeeProfileService.deleteById(item.empFileId)
          .subscribe(res => {
            if (this.employeeProfileService.requestIsSuccess(res)) {
              this.employeeResolver.EMP_TYPE_PROCESS.next(item.employeeId);
              this.processSearch();
              this.getRequireEmpFileType();
            }
          });
        }
      });
    }
  }

  getRequireEmpFileType() {
    this.employeeProfileService.getListRequireEmpFileType(this.formSearch.value).subscribe(
      res => {
        this.listRequire = res.data;
      }
    );
  }

  /**
   * Xuất hồ sơ cán bộ (Túi hồ sơ)
   */
  public processExportProfile() {
    this.employeeProfileService.export(this.employeeId).subscribe(res => {
      saveAs(res, 'emp-profile.docx');
    });
  }
}
