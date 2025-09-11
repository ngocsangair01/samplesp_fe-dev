import { SignDocumentService } from "@app/core/services/sign-document/sign-document.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "@app/shared/components/base-component/base-component.component";
import { FileStorageService } from "@app/core/services/file-storage.service";
import { PartyMemberDecisionService } from "@app/core/services/party-organization/party-member-decision.service";
import { EBUSY } from "constants";

@Component({
  selector: "party-member-deciSion-sign-file",
  templateUrl: "./party-member-decision-sign-file.component.html"
})
export class PartyMemberDecisionSignFileComponent extends BaseComponent implements OnInit {
  fileTypeList
  constructor(
    public activeModal: NgbActiveModal,
    private fileStorage: FileStorageService,
    private partyMemberDecisionService: PartyMemberDecisionService,
  ) {
    super();
  }

  ngOnInit() {
  }

  public downloadFile(fileData) {
    this.fileStorage.downloadFile(fileData.secretId).subscribe(res => {
      saveAs(res, fileData.fileName);
    });
  }

  getSignFileTable(partyMemberDecisionId) {
    this.partyMemberDecisionService.findOne(partyMemberDecisionId).subscribe(res => {
      this.fileTypeList = Object.keys(res.data.fileAttachment).map(key => {
        return { fileType: key, fileList: res.data.fileAttachment[key] }
      })
    })
  }

}
