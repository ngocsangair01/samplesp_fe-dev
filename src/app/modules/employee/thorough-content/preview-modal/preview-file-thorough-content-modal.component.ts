import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ElementRef,
    Input, NgZone,
    OnChanges,
    OnInit, QueryList,
    SimpleChanges,
    ViewChild, ViewChildren
} from "@angular/core";
import { FileStorageService } from "@app/core/services/file-storage.service";
import { SignDocumentService } from "@app/core/services/sign-document/sign-document.service";
import { BaseComponent } from "@app/shared/components/base-component/base-component.component";
import {CommonUtils, ValidationService} from "@app/shared/services";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ReportManagerService } from '@app/core/services/report/report-manager.service';
import { AssessmentEmployeeLevelService } from "@app/core/services/assessment-employee-level/assessment-employee-level.service";
import {ThoroughContentService} from "@app/core/services/thorough-content/thorough-content.service";
import {FileControl} from "@app/core/models/file.control";
import {MultiFileChooserV2Component} from "@app/shared/components/file-chooser/multi-file-chooser-v2.component";
import {ACTION_FORM} from "@app/core";
import {FormGroup} from "@angular/forms";
import {AppComponent} from "@app/app.component";
import {Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
declare var $: any;
@Component({
    selector: 'preview-file-thorough-content-modal',
    templateUrl: './preview-file-thorough-content-modal.component.html',
    styleUrls: ['./preview-file-thorough-content-modal.component.css']
})
export class PreviewFileThoroughContentModalComponent extends BaseComponent implements OnInit, AfterViewChecked {
    @ViewChild('audioSumPlayer') audioSumPlayer!: ElementRef<HTMLAudioElement>;
    @ViewChild('audioFullPlayer') audioFullPlayer!: ElementRef<HTMLAudioElement>;
    @ViewChild('multiFileChooser') multiFileChooser: MultiFileChooserV2Component;
    @ViewChild('multiFileAttachedChooser') multiFileAttachedChooser: MultiFileChooserV2Component;
    @ViewChild('multiFileInfographicChooser') multiFileInfographicChooser: MultiFileChooserV2Component;
    @Input() public thoroughContentId;
    isPlaying =  [];
    progress= [0,0];

    currentTime = [];
    duration = [];
    playbackRate = [1,1];
    speedOptions = [0.75,0.5,1,1.25,1.5,2];
    showSpeedOptions = [false, false];
    viewCheckedOnceSumAudio = false;
    viewCheckedOnceFullAudio = false;
    animationFrameId = null;
    hasApproveEmployee = false;
    questions= [
    ]
    audioSumURL = null;
    audioFullURL = null;
    formGroup: FormGroup;
    files = null;
    formType = 1;
    file = null;
    index = null;
    url = '';
    formConfig = {
        thoroughContentId: [null],  // id văn bản quán triệt
        parentId: [''], // id quán triệt cấp trên
        title: [null], // tiêu đề
        branch: [''], // lĩnh vực
        issueLevel: [''], // cấp ban hành
        formOfConfirmation: [''], // hình thức xác nhận
        typeThorough: [''], // đối tượng quán triệt
        thoroughDate: [null], // ngày quán triệt
        endDate: [null], // hạn quán triệt
        targetTypeThorough: [null], // đối tượng quán triệt chính
        requiredThorough: [false], // yêu cầu quán triệt đơn vị
        examQuestionSetId: [null], // đề thi
        type: [null], // loại văn bản
        // turnNumber: [null, [ValidationService.required, Validators.max(100), Validators.min(1)]], // số lần thi
        questionAmount: [null], // số câu hỏi
        // testTime: [null, [ValidationService.required, Validators.min(1)]], // thời gian làm
        passScore: [null],  // yêu cầu tối thiểu
        summaryContent: [null], // nội dung tóm tắt
        detailContent: [null],  // nội dung đầy đủ
        htmlSummaryContent: [null], // nội dung tóm tắt
        htmlDetailContent: [null],  // nội dung đầy đủ
        videoLink: [null],  // link video
        status: [0], // trạng thái
        thoroughLevel: [null],
        approveEmployeeId: [null],
        thoroughContentOrgIds: [],
        isActive: [0],                               // có hiệu lực
    };
    constructor(
        public activeModal: NgbActiveModal,
        private signDocumentService: SignDocumentService,
        private thoroughContentService : ThoroughContentService,
        private ngZone: NgZone,
        private app: AppComponent,
        private router: Router,
        private sanitizer: DomSanitizer,
        private fileStorage: FileStorageService
    ) {
        super();
    }

    ngOnInit() {
        this.getFile();

    }

     ngAfterViewChecked() {
            if(this.audioSumPlayer && this.audioSumURL && !this.viewCheckedOnceSumAudio) {
                 this.setupAudioPlayers(this.audioSumPlayer.nativeElement,1);
            }
           if(this.audioFullPlayer && this.audioFullURL && !this.viewCheckedOnceFullAudio) {
                 this.setupAudioPlayers(this.audioFullPlayer.nativeElement,0);
           }

    }

    setupAudioPlayers(audio, index) {
            this.currentTime[index] ='0:00';
            this.duration[index] = '0:00';
            this.isPlaying[index] = false;
            audio.addEventListener('loadedmetadata', () => {
                this.duration[index] = this.formatTime(audio.duration)
                if(index == 1) {
                    this.viewCheckedOnceSumAudio = true
                }else if(index == 0) {
                    this.viewCheckedOnceFullAudio = true
                }
            })
            audio.addEventListener('ended', () => {
                this.isPlaying[index] = false;
                cancelAnimationFrame(this.animationFrameId);
            })

    }



    updateProgressSmoothly(index) {
        let audio;
        if(index == 0) {
            audio = this.audioFullPlayer.nativeElement
        }else if(index ==1) {
            audio = this.audioSumPlayer.nativeElement
        }
        const update= () => {
            const percent = (audio.currentTime /audio.duration) * 100;
            this.ngZone.run(() => {
                this.progress[index] = percent;
                this.currentTime[index] = this.formatTime(audio.currentTime)
            })
            this.animationFrameId = requestAnimationFrame(update)
        }
        this.animationFrameId = requestAnimationFrame(update);
    }

   async togglePlay(index:number) {
        let audio;
        if(index == 0) {
            audio = this.audioFullPlayer.nativeElement
        }else if(index ==1) {
            audio = this.audioSumPlayer.nativeElement
        }
        try {
            if(audio.paused) {
                await audio.play();
                this.isPlaying[index] = true;
                this.updateProgressSmoothly(index);
            }else {
                audio.pause();
                this.isPlaying[index] = false;
                cancelAnimationFrame(this.animationFrameId);
            }
        }
        catch (error) {
            console.log('Audio play error: ' + error);
        }
    }

    seek(event: MouseEvent, index) {
        let audio;
        if(index == 0) {
            audio = this.audioFullPlayer.nativeElement
        }else if(index ==1) {
            audio = this.audioSumPlayer.nativeElement
        }
        const bar = (event.currentTarget as HTMLElement).getBoundingClientRect();
        const clickX = event.clientX - bar.left;
        const percentage = clickX / bar.width;
        const newTime = percentage * audio.duration;
        audio.currentTime = newTime;
        this.progress[index] = percentage * 100;
        this.currentTime[index] = this.formatTime(newTime);
        if(!audio.paused) {
            cancelAnimationFrame(this.animationFrameId);
            this.updateProgressSmoothly(index);
        }
    }

    setSpeed(speed: number, index) {
        let audio;
        if(index == 0) {
            audio = this.audioFullPlayer.nativeElement
        }else if(index ==1) {
            audio = this.audioSumPlayer.nativeElement
        }
        this.playbackRate[index] = speed;
        audio.playbackRate = speed;
        this.showSpeedOptions[index] = false;
    }
    toggleSpeedOptions(index) {
        this.showSpeedOptions[index] = !this.showSpeedOptions[index];
    }

    getFile() {
        let param = {
            thoroughContentId: this.thoroughContentId,
          }
        const filesControl = new FileControl(null);
        // bo required file dinh kem
        const filesAttachedControl = new FileControl(null);
        const filesInfographicControl = new FileControl(null);
        this.thoroughContentService.previewInfo(param.thoroughContentId).subscribe(res => {
            if (res.data) {
                this.files = res.data;
                if(res.data.fileAttachment.fileInfographicList && res.data.fileAttachment.fileInfographicList.length >0){
                    this.file = res.data.fileAttachment.fileInfographicList[0];

                    this.fileStorage.downloadFile(this.file.secretId)
                        .subscribe(res => {
                            this.url = URL.createObjectURL(res);
                        });
                } else if (res.data.fileAttachment.fileList && res.data.fileAttachment.fileList.length >0){
                    this.file = res.data.fileAttachment.fileList[0];

                    this.fileStorage.downloadFile(this.file.secretId)
                        .subscribe(res => {
                            this.url = URL.createObjectURL(res);
                        });
                } else if(res.data.fileAttachment.attachmentFileList && res.data.fileAttachment.attachmentFileList.length >0){
                    this.file = res.data.fileAttachment.attachmentFileList[0];

                    this.fileStorage.downloadFile(this.file.secretId)
                        .subscribe(res => {
                            this.url = URL.createObjectURL(res);
                        });
                }

                if(res.data.approveEmployeeId != null){
                    this.hasApproveEmployee = true;
                }
                this.formGroup = this.buildForm(res.data, this.formConfig, ACTION_FORM.VIEW);
                if(res.data.fileAttachment.fileList) {
                    filesControl.setFileAttachment(res.data.fileAttachment.fileList);
                }
                if(res.data.fileAttachment.attachmentFileList) {
                    filesAttachedControl.setFileAttachment(res.data.fileAttachment.attachmentFileList);
                }
                if (res.data.fileAttachment.fileInfographicList) {
                    filesInfographicControl.setFileAttachment(res.data.fileAttachment.fileInfographicList);
                }
                if(res.data.examQuestionSetBean) {
                    this.questions = res.data.examQuestionSetBean.examQuestionBeanList;
                }
                this.formGroup.addControl('fileList', filesControl);
                this.formGroup.addControl('fileAttachedList', filesAttachedControl);
                this.formGroup.addControl('fileInfographicList', filesInfographicControl);
            }
            if(res.data.summaryContent) {
                this.thoroughContentService.getAudioSumContent(this.formGroup.value["thoroughContentId"])
                    .subscribe(res => {
                            const url = URL.createObjectURL(res);
                            this.audioSumURL = this.sanitizer.bypassSecurityTrustUrl(url);

                    });
            }
            if(res.data.detailContent) {
                this.thoroughContentService.getAudioFullContent(this.formGroup.value["thoroughContentId"])
                    .subscribe(res => {

                            const url = URL.createObjectURL(res);
                            this.audioFullURL = this.sanitizer.bypassSecurityTrustUrl(url);

                    });
            }
        });


    }



    get f() {
        return this.formGroup.controls;
    }

    formatTime(time: number)  {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const formatSeconds = seconds < 10 ? '0' + seconds : seconds;
        return `${minutes}:${formatSeconds}`
    }

    submitToApprove() {
        this.app.confirmMessage('thorough-content.message.confirm.submit',
            () => {
                this.thoroughContentService.submitToApprove(this.formGroup.value["thoroughContentId"])
                    .subscribe(res => {
                        if (res.code == "success") {
                            this.activeModal.close(res);
                        }
                    });
            },
            () => {
            }
        )
    }

    submitToThorough() {
        this.app.confirmMessage('thorough-content.message.confirm.thorough',
            () => {
                this.thoroughContentService.submitToThorough(this.formGroup.value["thoroughContentId"])
                    .subscribe(res => {
                        if (res.code == "success") {
                            this.router.navigateByUrl('/employee/thorough-content');
                        }
                    });
            },
            () => {
            }
        )
    }
    switchHeaders(event){
        if(event.index == 0){
            if(this.files.fileAttachment.fileInfographicList && this.files.fileAttachment.fileInfographicList.length >0){
                this.file = this.files.fileAttachment.fileInfographicList[0];

                this.fileStorage.downloadFile(this.file.secretId)
                    .subscribe(res => {
                        this.url = URL.createObjectURL(res);
                    });
            } else if (this.files.fileAttachment.fileList && this.files.fileAttachment.fileList.length >0){
                this.file = this.files.fileAttachment.fileList[0];

                this.fileStorage.downloadFile(this.file.secretId)
                    .subscribe(res => {
                        this.url = URL.createObjectURL(res);
                    });
            } else if(this.files.fileAttachment.attachmentFileList && this.files.fileAttachment.attachmentFileList.length >0){
                this.file = this.files.fileAttachment.attachmentFileList[0];

                this.fileStorage.downloadFile(this.file.secretId)
                    .subscribe(res => {
                        this.url = URL.createObjectURL(res);
                    });
            }
        } else {
            if(this.files.fileAttachment.fileList && this.files.fileAttachment.fileList.length >0){
                this.file = this.files.fileAttachment.fileList[0];

                this.fileStorage.downloadFile(this.file.secretId)
                    .subscribe(res => {
                        this.url = URL.createObjectURL(res);
                    });
            } else if (this.files.fileAttachment.attachmentFileList && this.files.fileAttachment.attachmentFileList.length >0){
                this.file = this.files.fileAttachment.attachmentFileList[0];

                this.fileStorage.downloadFile(this.file.secretId)
                    .subscribe(res => {
                        this.url = URL.createObjectURL(res);
                    });
            } else if(this.files.fileAttachment.fileInfographicList && this.files.fileAttachment.fileInfographicList.length >0){
                this.file = this.files.fileAttachment.fileInfographicList[0];

                this.fileStorage.downloadFile(this.file.secretId)
                    .subscribe(res => {
                        this.url = URL.createObjectURL(res);
                    });
            }
        }
    }

    preview(item: any, index: number) {
        this.file = item

        this.fileStorage.downloadFile(this.file.secretId)
            .subscribe(res => {
                this.url = URL.createObjectURL(res);
            });
    }

}
