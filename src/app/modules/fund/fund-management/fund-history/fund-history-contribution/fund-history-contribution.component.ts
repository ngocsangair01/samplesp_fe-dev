import { Component, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ACTION_FORM } from '@app/core';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { FundContributionService } from '@app/core/services/fund/fund-contribution.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'fund-history-contribution',
  templateUrl: './fund-history-contribution.component.html',
})
export class FundHistoryContributionComponent extends BaseComponent implements OnInit {
  @Input()
  fundManagementId
  @Input()
  searchKeyWord
  constructor(
    private fileStorage: FileStorageService,
    private fundContributionService: FundContributionService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.fundContribution"));
  }

  ngOnInit() {
    this.onSearch();
  }

  get f() {
    return this.formSearch.controls;
  }
  
  /**
   * Hàm search
   */
  public onSearch(event?: any) {
    const formSearch = {
      fundManagementId: this.fundManagementId,
      searchKeyWord: this.searchKeyWord
    }
    this.fundContributionService.search(formSearch, event).subscribe(res => {
      this.resultList = res;
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
}