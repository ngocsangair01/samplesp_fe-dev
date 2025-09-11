import { FormControl } from '@angular/forms';
export class FileAttachment {
  id: string;
  fileName: string;
  length: number;
  chunkSize: number;
  uploadDate: number;
  isTemp: boolean;
  file: any;
  target: any;
  errorKey: string;
  // huynq73: file depend on language
  sysLanguageCode?: string;
  languageObj?: any;
  secretId: any;
}
export class FileControl extends FormControl {
  public fileAttachment: Array<FileAttachment>;
  public setFileAttachment(fileAttachment: any) {
    this.fileAttachment = fileAttachment;
  }
  public getFileAttachment(): Array<FileAttachment> {
    return this.fileAttachment;
  }
}
