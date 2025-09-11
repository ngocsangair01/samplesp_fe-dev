import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PartyMemberConcurrentProcessService } from '@app/core/services/party-organization/party-member-concurrent-process.service';
import { PartyMemebersService } from '@app/core/services/party-organization/party-members.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PartyMemberConcurrentProcessFormComponent } from '../party-member-concurrent-process-form/party-member-concurrent-process-form.component';
import { DEFAULT_MODAL_OPTIONS } from './../../../../../core/app-config';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';

@Component({
  selector: 'party-member-concurrent-process-search',
  templateUrl: './party-member-concurrent-process-search.component.html',
  styleUrls: ['./party-member-concurrent-process-search.component.css']
})
export class PartyMemberConcurrentProcessSearchComponent extends BaseComponent implements OnInit {
  employeeId;
  formSearch: FormGroup;
  listPartyProcess = this.resultList;
  listConcurrentProcess = this.resultList;
  hidePartyMemberProcess: boolean = false;
  hidePartyConcurrentProcess: boolean = false;

  constructor(
    private employeeResolver: EmployeeResolver,
    private partyMemberConcurrentProcessService: PartyMemberConcurrentProcessService,
    private partyMemebersService: PartyMemebersService,
    private modalService: NgbModal,
    private curriculumVitaeService: CurriculumVitaeService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyMemberProcess"));
    this.setMainService(partyMemberConcurrentProcessService);
    this.employeeResolver.EMPLOYEE.subscribe(
      data => {
        if (data) {
          this.employeeId = data;
          this.formSearch = this.buildForm({ employeeId: this.employeeId }, { employeeId: [''] });

          this.partyMemebersService.findProcessByEmployeeId(this.employeeId).subscribe(res => {
            this.listPartyProcess = res;
          });

          this.partyMemberConcurrentProcessService.findProcessByEmployeeId(this.employeeId).subscribe(res => {
            this.listConcurrentProcess = res;
          });

          // this.processSearch();
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

  prepareInsertPartyMemberProcess(isPartyMemberProcess) {
    this.activeModal({ employeeId: this.employeeId, isPartyMemberProcess:isPartyMemberProcess });
  }

  prepareSaveOrUpdate(item, isPartyMemberProcess) {
    if (!isPartyMemberProcess) {
      this.partyMemberConcurrentProcessService.findOne(item.itemId)
        .subscribe(res => {
          if (res.data) {
            res.data.isPartyMemberProcess = isPartyMemberProcess;
            this.activeModal(res.data);
          }
        });
    } else {
      this.partyMemebersService.findByPartyMemberProcessId(item.partyMemberProcessId)
        .subscribe(res => {
          if (res.data) {
            res.data.isPartyMemberProcess = isPartyMemberProcess;
            this.activeModal(res.data);
          }
        });
    }
  }

  processSearch(){
    this.formSearch = this.buildForm({ employeeId: this.employeeId }, { employeeId: [''] });

    this.partyMemebersService.findProcessByEmployeeId(this.employeeId).subscribe(res => {
      this.listPartyProcess = res;
    });

    this.partyMemberConcurrentProcessService.findProcessByEmployeeId(this.employeeId).subscribe(res => {
      this.listConcurrentProcess = res;
    });
  }

  processDeleteProcess(id, isPartyMemberProcess){
    if (id && id > 0) {
      if(isPartyMemberProcess){
        this.partyMemebersService.confirmDelete({
          messageCode: null,
          accept: () => {
            this.partyMemebersService.deleteByProcessId(id)
              .subscribe(res => {
                if (this.partyMemebersService.requestIsSuccess(res)) {
                  this.processSearch();
                }
              });
          }
        });
      } else {
        this.partyMemberConcurrentProcessService.confirmDelete({
          messageCode: null,
          accept: () => {
            this.partyMemberConcurrentProcessService.deleteById(id)
              .subscribe(res => {
                if (this.partyMemberConcurrentProcessService.requestIsSuccess(res)) {
                  this.processSearch();
                }
              });
          }
        });
      }
    }
  }

  private activeModal(data?: any) {
    const modalRef = this.modalService.open(PartyMemberConcurrentProcessFormComponent, DEFAULT_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.setFormValue(data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.partyMemberConcurrentProcessService.requestIsSuccess(result)) {
        this.processSearch();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }
}
