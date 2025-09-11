import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { FileAttachment, FileControl } from '@app/core/models/file.control';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { CommonUtils } from '@app/shared/services';
import { TranslationService } from 'angular-l10n';
;

@Component({
  selector: 'multi-file-chooser-v2',
  templateUrl: './multi-file-chooser-v2.component.html',
})
export class MultiFileChooserV2Component implements OnInit, OnChanges {
  @Input()
  property: FileControl;
  @Input()
  fileName = '';
  public files: any;
  @Input()
  private validMaxSize = -1;
  @Input()
  private validType: string;
  @Input()
  private maxFile = -1;
  @Output()
  public onFileChange: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  disabled: boolean = false;
  public emptyFile = new File([''], '-', { type: 'vhr_stored_file' });
  @Input()
  downLoadFile: boolean = true;
  @Input()
  moveFile: boolean = false;
  @Input()
  disabledDelete: boolean = false;
  /**
   * constructor
   */
  constructor(private app: AppComponent
    , private fileStorage: FileStorageService
    , private translation: TranslationService
  ) { }

  /**
   * ngOnChanges
   */
  ngOnChanges() {
    this.ngOnInit();
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    // tạo giá trị mặc định cho fileAttachment
    if (this.property) {
      if (!this.property.fileAttachment || this.property.fileAttachment.length === 0) {
        this.property.fileAttachment = [this.makeEmptyFileAttach()];
      } else {
        for (const fileAttr of this.property.fileAttachment) {
          if (!fileAttr.isTemp) {
            fileAttr.file = this.emptyFile;
          }
        }
        this.onFileChanged();
      }
    }
  }

  /**
   * onChange
   */
  public onChange(event, fileAttr: FileAttachment) {
    // const files = this.multiple ? event.target.files : event.target.files[0];
    const file = event.target.files[0];
    fileAttr.target = event.target;
    if (!this.isValidFile(file, fileAttr)) {
      fileAttr.fileName = this.translation.translate('controls.noFile');
      fileAttr.target.value = '';
      return;
    } else {
      this.setFileTemp(fileAttr, file);
      this.onFileChanged();
    }
  }

  /**
   * setFileTemp
   */
  private setFileTemp(fileAttr, file) {
    fileAttr.file = file;
    if (file === null) {
      fileAttr.fileName = this.translation.translate('controls.noFile');
      if (fileAttr.target) {
        fileAttr.target.value = '';
      }
    } else {
      fileAttr.fileName = file.name;
    }
  }

  /**
   * onFileChanged
   */
  public onFileChanged() {
    const files = [];
    if(this.moveFile) {
      this.property.fileAttachment.forEach((item , index) => {
        item['orderFile'] = index + 1;
      })
    }
    for (const fileAttr of this.property.fileAttachment) {
      if ((fileAttr as any).isClone) {
        this.fileStorage.downloadFile(fileAttr.secretId)
          .subscribe(res => {
            files.push(new File([res], fileAttr.fileName));
            this.property.setValue(files);
          });
      } else {
        if (fileAttr.file) {
          files.push(fileAttr.file);
        }
      }
    }
    if (files.length > 0) {
      this.property.setValue(files);
    } else {
      this.property.setValue(null);
    }
  }

  /**
   * delete
   */
  public delete(fileAttr: FileAttachment) {
    if (fileAttr.isTemp === false || fileAttr.isTemp === undefined) {
      this.app.confirmDelete('common.message.confirm.deleteFile', () => {// on accepted
        this.fileStorage.deleteFile(fileAttr.secretId)
          .subscribe(res => {
            if (this.fileStorage.requestIsSuccess(res)) {
              this.setFileTemp(fileAttr, null);
              fileAttr.id = null;
              fileAttr.length = null;
              fileAttr.chunkSize = null;
              fileAttr.uploadDate = null;
              fileAttr.file = null;
              fileAttr.isTemp = true;
              fileAttr.secretId = null;
              this.onFileChanged();
            }
          });
      }, () => {// on rejected

      });
    } else {
      this.setFileTemp(fileAttr, null);
      this.onFileChanged();
    }
  }

  /**
   * isValidFile
   */
  public isValidFile(file, fileAttr): boolean {
    if (!file) {
      return true;
    }
    if (this.validMaxSize > 0) {
      if (CommonUtils.tctGetFileSize(file) > this.validMaxSize) {
        fileAttr.errorKey = 'controls.maxFileSize';
        return false;
      }
    }
    if (!CommonUtils.isNullOrEmpty(this.validType)) {
      const fileName = file.name;
      const temp = fileName.split('.');
      const ext = temp[temp.length - 1].toLowerCase();
      const ruleFile = ',' + this.validType;
      if (ruleFile.toLowerCase().indexOf(ext) === -1) {
        fileAttr.errorKey = 'controls.fileType';
        return false;
      }
    }

    fileAttr.errorKey = null;
    return true;
  }

  /**
   * downloadFile
   */
  public downloadFile(file) {
    if (this.downLoadFile) {
      this.fileStorage.downloadFile(file.secretId)
        .subscribe(res => {

          saveAs(res, file.fileName);
        });
    }
  }

  /**
   * makeEmptyFileAttach
   */
  private makeEmptyFileAttach(): FileAttachment {
    return {
      id: null,
      fileName: this.translation.translate('controls.noFile'),
      length: null,
      chunkSize: null,
      uploadDate: null,
      isTemp: true,
      file: null,
      target: null,
      errorKey: null,
      secretId: null
    };
  }

  /**
   * addItem
   */
  public addItem(item) {
    if (this.maxFile > 0 && this.property.fileAttachment.length >= this.maxFile) {
      return;
    }
    this.property.fileAttachment.push(this.makeEmptyFileAttach());
    this.onFileChanged();
  }

  /**
   * removeItem
   */
  public removeItem(item) {
    this.property.fileAttachment.splice(this.property.fileAttachment.indexOf(item), 1);
    if (this.property.fileAttachment.length === 0) {
      this.property.fileAttachment.push(this.makeEmptyFileAttach());
    }
    this.onFileChanged();
  }

  public upMoveFile(index) {
    if (index === 0) {
      return;
    }
    const formArray = this.property.fileAttachment;
    const signerTemp = formArray[index];
    formArray[index] = formArray[index - 1];
    formArray[index - 1] = signerTemp;
    this.onFileChanged();
  }

  public downMoveFile(index) {
    const formArray = this.property.fileAttachment;
    if (index === formArray.length) {
      return;
    }
    const signerTemp = formArray[index];
    formArray[index] = formArray[index + 1];
    formArray[index + 1] = signerTemp;
    this.onFileChanged();
  }
}
