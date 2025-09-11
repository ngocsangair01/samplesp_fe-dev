import { FileStorageService } from './../../../core/services/file-storage.service';
import { DocumentService } from './../../../core/services/document/document.service';
import { APP_CONSTANTS } from '@app/core';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../service/dash-board-service';

@Component({
  selector: 'home-congress',
  templateUrl: './home-congress.component.html',
})
export class HomeCongressComponent implements OnInit {
  resultList: any;
  baseUrl: string = APP_CONSTANTS.POLITICAL_FEATURE.BASE_URL;
  constructor(private dashboardService: DashboardService,
    private documentService: DocumentService,
    private fileStorage: FileStorageService ) {
    // this.dashboardService.getPoliticalFeature().subscribe(res => {
    //   this.resultList = res;
    // })
  }

  ngOnInit() {
    this.documentService.getListCongress().subscribe(res =>{
      this.resultList = res;
  });
  }
    /**
   * Xu ly download file trong danh sach
   */
  public downloadFile(fileData) {
    this.fileStorage.downloadFile(fileData.secretId).subscribe(res => {
        saveAs(res , fileData.fileName);
    });
}
}
