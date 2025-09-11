import { PartyMemberProfileTypeService } from './../../../../../core/services/party-member-profile-type/party-member-profile-type.service';
import { DEFAULT_MODAL_OPTIONS } from '@app/core/app-config';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { CommonUtils } from '@app/shared/services';
import { PartyMemberProfileService } from '@app/core/services/party-member-profile/party-member-profile.service';
import { ProfileFormComponent } from '../profile-form/profile-form.component';
import { PartyMemebersService } from '@app/core/services/party-organization/party-members.service';
import { PartyMemberDecisionService } from '@app/core/services/party-organization/party-member-decision.service';

@Component({
  selector: 'profile-search',
  templateUrl: './profile-search.component.html',
  styleUrls: ['./profile-search.component.css']
})
export class ProfileSearchComponent extends BaseComponent implements OnInit {
  employeeId: number;
  empId: {employeeId: any};
  fileHardCopyUploadLst = [];
  hideFileHardCopyUploadLst: boolean = false;
  hideResultList: boolean = false;

  @ViewChild('pTable') dataTable: any;
  constructor(public actr: ActivatedRoute
            , private modalService: NgbModal
            , private partyMemberProfileService: PartyMemberProfileService
            , private partyMemberProfileTypeService: PartyMemberProfileTypeService
            , private employeeResolver: EmployeeResolver
            , private fileStorage: FileStorageService
            , private partyMemebersService: PartyMemebersService
            , private partyMemberDecisionService: PartyMemberDecisionService
            ) {
    super(actr, CommonUtils.getPermissionCode("resource.partyMemberProfile"));
    this.setMainService(partyMemberProfileService);
    this.formSearch = this.buildForm({}, {employeeId: ['']});
    this.employeeResolver.EMPLOYEE.subscribe(
      data => {
        if (data) {
          this.employeeId = data;
          this.empId = {employeeId: data};
          this.formSearch = this.buildForm(this.empId, {employeeId: ['']});
          this.getProfileTypeHardCopy();
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
   * prepare save or update
   * @param partyMemberProfileType 
   * @param id 
   */
  prepareSaveOrUpdate(partyMemberProfileType?: any, id?: any) {
    if (id > 0) {
      this.partyMemberProfileService.findOne(id)
        .subscribe(res => {
          const data = {...res.data, ...{employeeId: this.employeeId}}
          this.activeModal(data);
      });
    } else {
      this.activeModal({
        partyMemberProfileTypeId: partyMemberProfileType.partyMemberProfileTypeId,
        employeeId: this.employeeId
      });
    }
  }

  /**
   * show model
   * data
   */
  private activeModal(data?: any) {
    const modalRef = this.modalService.open(ProfileFormComponent, DEFAULT_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.setFormValue(data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.partyMemberProfileService.requestIsSuccess(result)) {
        this.getProfileTypeHardCopy();
        this.processSearch();
      }
    });
  }

  /**
   * Xu ly download file trong danh sach
   */
  public downloadFile(fileData, item) {
    if (item && item.isFromVO == 2) {
      this.fileStorage.downloadFile(fileData.secretId).subscribe(res => {
          saveAs(res , fileData.fileName);
      });
    } else {
      // call api download file Voffice
      if (item.signDocumentId) {
        this.partyMemberDecisionService.exportDecision(item.signDocumentId).subscribe(res => {
          saveAs(res, "File quyết định.zip")
        })
      }
    }
  }

  public processDeletes(item): void {
    if (item && item.partyMemberProfileId > 0) {
      this.partyMemberProfileService.confirmDelete({
        messageCode: null,
        accept: () => {
          this.partyMemberProfileService.deleteById(item.partyMemberProfileId)
          .subscribe(res => {
            this.processSearch();
            this.getProfileTypeHardCopy();
          });
        }
      });
    }
  }

  getProfileTypeHardCopy() {
    this.partyMemberProfileTypeService.getProfileTypeHardCopy(this.employeeId).subscribe(
      res => {
        this.fileHardCopyUploadLst = res.data;
      }
    );
  }
}
