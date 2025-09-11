import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DEFAULT_MODAL_OPTIONS } from '@app/core/app-config';
import { EmpTypeProcessService } from '@app/core/services/emp-type-process/emp-type-process.service';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmpTypeProcessFormComponent } from '../emp-type-process-form/emp-type-process-form.component';
import { PartyMemebersService } from '@app/core/services/party-organization/party-members.service';

@Component({
  selector: 'emp-type-process-search',
  templateUrl: './emp-type-process-search.component.html',
  styleUrls: ['./emp-type-process-search.component.css']
})
export class EmpTypeProcessSearchComponent extends BaseComponent implements OnInit {
  employeeId: number;
  empId: { employeeId: any };
  hideListContractProcess: boolean = false;
  @ViewChild('pTable') dataTable: any;
  constructor(public actr: ActivatedRoute
    , private modalService: NgbModal
    , private empTypeProcessService: EmpTypeProcessService
    , private employeeResolver: EmployeeResolver
    , private fileStorage: FileStorageService
    , private partyMemebersService: PartyMemebersService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.empTypeProcess"));
    this.setMainService(empTypeProcessService);
    this.employeeResolver.EMPLOYEE.subscribe(
      data => {
        if (data) {
          this.employeeId = data;
          this.empId = { employeeId: data };
          this.formSearch = this.buildForm(this.empId, { employeeId: [''] });
          this.processSearch();
        }
      }
    );
  }

  /**
   * ngOnInit
   */
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
   * prepareUpdate
   * param item
   */
  prepareSaveOrUpdate(item) {
    if (item && item.empTypeProcessId > 0) {
      this.empTypeProcessService.findOne(item.empTypeProcessId)
        .subscribe(res => {
          this.activeModal(res.data);
        });
    } else {
      this.activeModal({ employeeId: this.employeeId });
    }
  }

  /**
   * show model
   * data
   */
  private activeModal(data?: any) {
    const modalRef = this.modalService.open(EmpTypeProcessFormComponent, DEFAULT_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.setFormValue(data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.empTypeProcessService.requestIsSuccess(result)) {
        this.employeeResolver.EMP_TYPE_PROCESS.next(this.employeeId);
        this.processSearch();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }

  /**
   * Xu ly download file trong danh sach
   */
  public downloadFile(fileData) {
    this.fileStorage.downloadFile(fileData.secretId).subscribe(res => {
      saveAs(res, fileData.fileName);
    });
  }

  public processDeletes(item): void {
    if (item && item.empTypeProcessId > 0) {
      this.empTypeProcessService.confirmDelete({
        messageCode: null,
        accept: () => {
          this.empTypeProcessService.deleteById(item.empTypeProcessId)
            .subscribe(res => {
              if (this.empTypeProcessService.requestIsSuccess(res)) {
                this.employeeResolver.EMP_TYPE_PROCESS.next(item.employeeId);
                this.processSearch();
              }
            });
        }
      });
    }
  }
}
