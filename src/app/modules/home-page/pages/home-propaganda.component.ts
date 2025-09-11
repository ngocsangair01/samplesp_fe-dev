import { OnChanges, SimpleChanges } from '@angular/core';
import { OnInit, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { WarningManagerService } from '../../reports/warning-manager/warning-manager.service';
import { MessageService } from 'primeng/api';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { CommonUtils, ValidationService } from '@app/shared/services';



@Component({
  selector: 'home-propaganda',
  templateUrl: './home-propaganda.component.html'
})
export class PropagandaComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() branch;
  listWarning: any;
  constructor(
    private router: Router,
    private warningManagerService: WarningManagerService,
    private message: MessageService,
    private fileStorage: FileStorageService
  ) {
    super();
    // this.getWarning('PROPAGANDA');
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.branch.currentValue) {
      this.branch = changes.branch.currentValue;
    }

  }

  ngOnInit(): void {
    this.getWarning('PROPAGANDA');
  }

  getWarning(warningType: String) {
    this.warningManagerService.getWarning(warningType).subscribe(res => {
      if (res.data) {
        this.listWarning = res.data;
        // let contentHtml = document.getElementById("homePropaganda");
        // let content = "";
        // this.listWarning.forEach(e => {
        //   content += '<div class="col-sm-4 col-md-4 col-xs-2 warning-block" style="line-height: 25px; border: ridge;">';
        //   content += '<a id="'+ e.warningManagerId +'" class="display-table w100 " style= "padding: 10px;">';
        //   content += 'onClick="exportOrMoveUrl()">';
        //   content += e.tableCellWarningInfo;
        //   content += "</a>";
        //   content += "</div>";
        //   // var index = document.getElementById(e.warningManagerId)
        //   // contentHtml.onclick = () =>{ this.exportOrMoveUrl(e.warningManagerId)}
        // })
        // contentHtml.innerHTML = content;
      }else{
        this.message.add({severity: 'error', detail: res.message});
      }

    })

  }

  exportOrMoveUrl(warningType: number,fileAttachment: any, url: string) {
    if(warningType != null){
      if(warningType == 1){
        this.fileStorage.downloadFile(fileAttachment.warningManagerFile[0].id)
        .subscribe(res => {
          saveAs(res, fileAttachment.warningManagerFile.get(0).fileName);
        });
       }else if(!CommonUtils.isNullOrEmpty(url)){
        this.router.navigate([url]);
       }
    }
  }
}
