import { OnChanges, SimpleChanges } from '@angular/core';
import { OnInit, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
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
