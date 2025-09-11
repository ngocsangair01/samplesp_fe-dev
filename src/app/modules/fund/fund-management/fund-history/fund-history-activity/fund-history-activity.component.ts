import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { FundActivityService } from '@app/core/services/fund/fund-activity.service';
import { FileStorageService } from '@app/core/services/file-storage.service';

@Component({
  selector: 'fund-history-activity',
  templateUrl: './fund-history-activity.component.html',
})
export class FundHistoryActivityComponent extends BaseComponent implements OnInit {
  @Input()
  fundManagementId
  @Input()
  searchKeyWord
  constructor(
    private fileStorage: FileStorageService,
    private fundActivityService: FundActivityService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.fundActivity"));
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
    this.fundActivityService.searchHistory(formSearch, event).subscribe(res => {
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