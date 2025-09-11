import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonUtils } from '@app/shared/services';
import { FileControl } from '@app/core/models/file.control';
import { AppComponent } from '@app/app.component';
import { FileStorageService } from '@app/core/services/file-storage.service';
;
import { HelperService } from '@app/shared/services/helper.service';


@Component({
  selector: 'file-chooser-proposal',
  templateUrl: './file-chooser-proposal.component.html',
})
export class FileChooserProposalComponent implements OnInit, OnChanges {
  @Input()
  property: FileControl;
  @Input()
  disabled: false;
  @Input()
  isChangeFile: 'complete';
  @Input()
  htmlId = 'fileitem';
  public fileName: string;
  public files: any;
  @ViewChild('file')
  file: ElementRef;
  // validate
  @Input()
  private validMaxSize = -1;
  @Input()
  private validType: string;
  @Output()
  public onFileChange: EventEmitter<any> = new EventEmitter<any>();
  public isError = false;
  public fileErrorText: string;
  public emptyFile = new File([''], '-', { type: 'vhr_stored_file' });

  /**
   * constructor
   */
  constructor(
    private app: AppComponent,
    private fileStorage: FileStorageService,
    private helperService: HelperService) { }

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
    if (this.property && this.property.fileAttachment && this.property.fileAttachment.length > 0) {
      this.fileName = this.property.fileAttachment[0].fileName;
      this.files = this.emptyFile;
      this.onFileChanged();
    } else if (this.property && this.property.value) {
      return;
    } else {
      this.fileName = null;
      this.files = null;
    }
  }

  /**
   * onChange
   */
  public onChange(event) {
    // const files = this.multiple ? event.target.files : event.target.files[0];
    const files = event.target.files[0];
    if (!this.isValidFile(files)) {
      this.fileName = null;
      this.file.nativeElement.value = '';
      return;
    }
    this.isError = false;
    this.files = files;
    this.onFileChanged();
    this.helperService.changFile(this.isChangeFile);
  }

  /**
   * onFileChanged
   */
  public onFileChanged() {
    this.property.setValue(this.files);
    if (this.files === this.emptyFile) {// file stored
      // this.property.setValue( null );
      return;
    }
    this.onFileChange.emit(this.files);
    if (!this.files) {
      this.fileName = null;
      this.file.nativeElement.value = '';
      return;
    }
    const fNames = [];
    // if (this.multiple) {
    //   for (const i in this.files) {
    //     fNames.push(this.files[i].name);
    //   }
    // } else {
    //   fNames.push(this.files.name);
    // }
    fNames.push(this.files.name);
    this.fileName = fNames.join(', ');
  }

  /**
   * delete
   */
  public delete() {
    if (this.files === this.emptyFile) {
      this.app.confirmDelete('common.message.confirm.deleteFile', () => {// on accepted
        this.fileStorage.deleteFile(this.property.fileAttachment[0].secretId)
          .subscribe(res => {
            if (this.fileStorage.requestIsSuccess(res)) {
              this.property.fileAttachment.splice(0, 1);
              this.property.setValue(null);
              this.ngOnInit();
              this.helperService.changFile('delete');
            }
          });
      }, () => {// on rejected

      });
    } else {
      this.files = null;
      this.isError = false;
      this.onFileChanged();
    }
  }

  /**
   * isValidFile
   */
  public isValidFile(files): boolean {
    if (!files) {
      return true;
    }
    if (this.validMaxSize > 0) {
      const maxSize = +this.validMaxSize;
      if (CommonUtils.tctGetFileSize(files) > maxSize) {
        this.showError('controls.maxFileSize');
        return false;
      }
    }
    if (!CommonUtils.isNullOrEmpty(this.validType)) {
      const fileName = files.name;
      const temp = fileName.split('.');
      const ext = temp[temp.length - 1].toLowerCase();
      const ruleFile = ',' + this.validType;
      if (ruleFile.toLowerCase().indexOf(ext) === -1) {
        this.showError('controls.fileType');
        return false;
      }
    }
    return true;
  }

  /**
   * showError
   * param str
   */
  private showError(str: string) {
    this.isError = true;
    this.fileErrorText = str;
  }
  public downloadFile() {
    this.fileStorage.downloadFile(this.property.fileAttachment[0].secretId)
      .subscribe(res => {
        saveAs(res, this.property.fileAttachment[0].fileName);
      });
  }
}
