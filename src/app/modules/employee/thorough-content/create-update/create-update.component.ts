import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BaseComponent} from '@app/shared/components/base-component/base-component.component';
import {CommonUtils, ValidationService} from '@app/shared/services';
import {
    ACTION_FORM, APP_CONSTANTS, LARGE_MODAL_OPTIONS, MEDIUM_MODAL_OPTIONS, PartyOrganizationService, RESOURCE,
} from '@app/core';
import {AppComponent} from '@app/app.component';
import {DialogService} from 'primeng/api';
import {HelperService} from '@app/shared/services/helper.service';
import {FileStorageService} from '@app/core/services/file-storage.service';
import {FileControl} from '@app/core/models/file.control';
import {Router} from '@angular/router';
import {TranslationService} from 'angular-l10n';
import {ThoroughContentService} from '@app/core/services/thorough-content/thorough-content.service';
import {ExamQuestionSetService} from '@app/core/services/thorough-content/exam-question-set.service';
import {HrStorage} from '@app/core/services/HrStorage';
import {PartyMemebersService} from '@app/core/services/party-organization/party-members.service';
import {MultiFileChooserV2Component} from '@app/shared/components/file-chooser/multi-file-chooser-v2.component';
import {PartyOrgSelectorComponent} from '@app/shared/components/party-org-selector/party-org-selector.component';
import {CategoryService} from '@app/core/services/setting/category.service';
import {
    PreviewFileThoroughContentModalComponent
} from "@app/modules/employee/thorough-content/preview-modal/preview-file-thorough-content-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'create-update',
    templateUrl: './create-update.component.html',
    styleUrls: ['./create-update.component.css']
})
export class CreateOrUpdateComponent extends BaseComponent implements OnInit {
    @ViewChild('partyThoroughOrgSelector') partyThoroughOrgSelector: PartyOrgSelectorComponent;
    @ViewChild('multiFileChooser') multiFileChooser: MultiFileChooserV2Component;
    @ViewChild('multiFileAttachedChooser') multiFileAttachedChooser: MultiFileChooserV2Component;
    @ViewChild('multiFileInfographicChooser') multiFileInfographicChooser: MultiFileChooserV2Component;
    viewMode = false;
    editableThoroughed = false;
    notIsSecretary = true;
    hasApproveEmployee = false;
    hasParentThoroughContent = false;
    formGroup: FormGroup;
    header;
    isCreate = false;
    isMobileScreen: boolean = false;
    isShowMassThough = false;

    formConfig = {
        thoroughContentId: [null],  // id văn bản quán triệt
        parentId: [''], // id quán triệt cấp trên
        title: [null, ValidationService.required], // tiêu đề
        branch: ['', ValidationService.required], // lĩnh vực
        issueLevel: ['', ValidationService.required], // cấp ban hành
        formOfConfirmation: ['', ValidationService.required], // hình thức xác nhận
        typeThorough: ['', ValidationService.required], // đối tượng quán triệt
        thoroughDate: [null, [ValidationService.required, ValidationService.afterCurrentDate]], // ngày quán triệt
        endDate: [null, ValidationService.required], // hạn quán triệt
        targetTypeThorough: [null, ValidationService.required], // đối tượng quán triệt chính
        requiredThorough: [false], // yêu cầu quán triệt đơn vị
        examQuestionSetId: [null], // đề thi
        type: [null, ValidationService.required], // loại văn bản
        // turnNumber: [null, [ValidationService.required, Validators.max(100), Validators.min(1)]], // số lần thi
        questionAmount: [null], // số câu hỏi
        // testTime: [null, [ValidationService.required, Validators.min(1)]], // thời gian làm
        passScore: [null],  // yêu cầu tối thiểu
        summaryContent: [null], // nội dung tóm tắt
        summaryContentAudio:[null], // nội dung tóm tắt audio
        detailContent: [null],  // nội dung đầy đủ
        htmlSummaryContent: [null], // nội dung tóm tắt
        htmlDetailContent: [null],  // nội dung đầy đủ
        videoLink: [null],  // link video
        status: [0], // trạng thái
        thoroughLevel: [null, ValidationService.required],
        approveEmployeeId: [null],
        thoroughContentOrgIds: [],
        isActive: [0],                               // có hiệu lực
        massThorough: [0]
    };
    formConfigThoroughed = {
        thoroughContentId: [null],  // id văn bản quán triệt
        parentId: [null], // id quán triệt cấp trên
        title: [null, ValidationService.required], // tiêu đề
        branch: [null], // lĩnh vực
        thoroughLevel: [null, ValidationService.required],
        issueLevel: [null], // cấp ban hành
        formOfConfirmation: [null], // hình thức xác nhận
        typeThorough: [null, ValidationService.required], // đối tượng quán triệt
        thoroughDate: [null, [ValidationService.required, ValidationService.afterCurrentDate]], // ngày quán triệt
        endDate: [null, ValidationService.required], // hạn quán triệt
        targetTypeThorough: [null, ValidationService.required], // đối tượng quán triệt chính
        requiredThorough: [false], // yêu cầu quán triệt đơn vị
        examQuestionSetId: [null], // đề thi
        type: [null, ValidationService.required], // loại văn bản
        // turnNumber: [null, [ValidationService.required, Validators.max(100), Validators.min(1)]], // số lần thi
        questionAmount: [null], // số câu hỏi
        // testTime: [null, [ValidationService.required, Validators.min(1)]], // thời gian làm
        passScore: [null],  // yêu cầu tối thiểu
        summaryContent: [null], // nội dung tóm tắt
        summaryContentAudio: [null], // nội dung tóm tắt audio
        detailContent: [null],  // nội dung đầy đủ
        htmlSummaryContent: [null], // nội dung tóm tắt
        htmlDetailContent: [null],  // nội dung đầy đủ
        videoLink: [null],  // link video
        status: [0], // trạng thái
        approveEmployeeId: [null],
        thoroughContentOrgIds: [],

        isActive: [0],                               // có hiệu lực
        massThorough: [0]
    };

    branchOptions = [{value: 1, label: this.translation.translate('label.thorough-content.branch-1'), disabled: false},
        {value: 2, label: this.translation.translate('label.thorough-content.branch-2'), disabled: false},
        {value: 3, label: this.translation.translate('label.thorough-content.branch-3'), disabled: false},
        {value: 4, label: this.translation.translate('label.thorough-content.branch-4'), disabled: false},
        {value: 5, label: this.translation.translate('label.thorough-content.branch-5'), disabled: false},
        {value: 6, label: this.translation.translate('label.thorough-content.branch-6'), disabled: false},
        {value: 7, label: this.translation.translate('label.thorough-content.branch-7'), disabled: false}];

    typeThoroughOptions = [
        {id: 2, name: this.translation.translate('label.thorough-content.type-thorough-2')},
        {id: 3, name: this.translation.translate('label.thorough-content.type-thorough-3')},
        {id: 4, name: this.translation.translate('label.thorough-content.type-thorough-4')},
        {id: 5, name: this.translation.translate('label.thorough-content.type-thorough-5')},
        {id: 6, name: this.translation.translate('label.thorough-content.type-thorough-6')},
        {id: 8, name: this.translation.translate('label.thorough-content.type-thorough-8')},
        {id: 7, name: this.translation.translate('label.thorough-content.type-thorough-7')}];

    targetTypeThoroughOptions = [
        {id: 2, name: this.translation.translate('label.thorough-content.type-thorough-2')},
        {id: 3, name: this.translation.translate('label.thorough-content.type-thorough-3')},
        {id: 4, name: this.translation.translate('label.thorough-content.type-thorough-4')},
        {id: 5, name: this.translation.translate('label.thorough-content.type-thorough-5')},
        {id: 6, name: this.translation.translate('label.thorough-content.type-thorough-6')},
        {id: 8, name: this.translation.translate('label.thorough-content.type-thorough-8')},
        {id: 7, name: this.translation.translate('label.thorough-content.type-thorough-7')}];

    statusOptions = [{id: 0, name: this.translation.translate('label.thorough-content.status-0')},
        {id: 1, name: this.translation.translate('label.thorough-content.status-1')},
        {id: 2, name: this.translation.translate('label.thorough-content.status-2')}];

    issueLevelOptions = [{id: 1, name: this.translation.translate('label.thorough-content.issue-level-1')},
        {id: 2, name: this.translation.translate('label.thorough-content.issue-level-2')},
        {id: 3, name: this.translation.translate('label.thorough-content.issue-level-3')},
        {id: 4, name: this.translation.translate('label.thorough-content.issue-level-4')}
    ];

    thoroughLevelOptions = [];

    formOfConfirmationOptions = [{
        id: 1,
        name: this.translation.translate('label.thorough-content.form-of-confirmation-1')
    },
        {id: 2, name: this.translation.translate('label.thorough-content.form-of-confirmation-2')}];

    examQuestionSetOptions = [];

    typeOptions = [];

    // typeOptions = [{ id: 1, name: this.translation.translate('label.thorough-content.type-1') },
    //   { id: 2, name: this.translation.translate('label.thorough-content.type-2') }];

    emptyFilterMessage = this.translation.translate('selectFilter.emptyFilterMessage');

    userInfo = {employeeId: null};

    filterCondition = "AND 0=1 ORDER BY obj.created_date DESC";
    filterConditionThoroughLevel = " ";

    parentThoroughDate;
    resourceCode = 'CTCT_THOROUGH_CONTENT';
    userDomain;


    progressStatus = '';
    PROGRESS = {
        WAITING: 'WAITING',
        INPROGRESS: 'INPROGRESS',
        ENDED: 'ENDED'
    }
    filterConditionApprover = "AND obj.status = 1 AND EXISTS\n" +
        "                            ( SELECT pm.employee_id FROM party_member_concurrent_process pm\n" +
        "                            WHERE pm.employee_id = obj.employee_id AND CURRENT_DATE BETWEEN pm.effective_date AND COALESCE(pm.expired_date, CURRENT_DATE) ) ";

    resBranch;

    constructor(
        private app: AppComponent,
        public dialogService: DialogService,
        public helperService: HelperService,
        private partyOrgService: PartyOrganizationService,
        private router: Router,
        private service: ThoroughContentService,
        private examQuestionSetService: ExamQuestionSetService,
        private partyMemebersService: PartyMemebersService,
        private partyOrganizationService: PartyOrganizationService,
        private categoryService: CategoryService,
        public translation: TranslationService,
        private fb: FormBuilder,
        private modalService: NgbModal
    ) {
        super();
        this.setMainService(this.service);
        // this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;

        this.userInfo = HrStorage.getUserToken().userInfo;
        this.userDomain = HrStorage.getUserToken().userPermissionList.find(item => item.resourceCode == this.resourceCode);

        const filesControl = new FileControl(null, ValidationService.required);
        // bo required file dinh kem
        const filesAttachedControl = new FileControl(null);
        const filesInfographicControl = new FileControl(null);
        this.viewMode = this.router.url == '/employee/thorough-content/view';

        this.formGroup = this.buildForm({}, this.formConfig, ACTION_FORM.INSERT);
        this.formGroup.controls['thoroughContentOrgIds'] = new FormArray([]);

        this.service.getBranchList().subscribe(resBranch => {
            this.branchOptions.forEach(item => {
                if (!resBranch.data.includes(item.value)) {
                    item.disabled = true;
                }
            });

            this.resBranch = resBranch;
        });
        this.examQuestionSetService.getListByDomain().subscribe(
            resQuestion => {
                this.examQuestionSetOptions = resQuestion.data;
            })

        this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.TYPE_THOROUGHT_CONTENT).subscribe(res => {
            this.typeOptions = res.data;
        })

        // this.partyMemebersService.findLoginPartyMember().subscribe(resUserData => {
        if (history.state.thoroughContentId) {
            this.header = "Thông tin văn bản quán triệt";

            this.service.findOne(history.state.thoroughContentId).subscribe(res => {
                if(res.data.targetTypeThorough == 2){
                    this.isShowMassThough = true;
                }
                if(res.data.approveEmployeeId != null){
                    this.hasApproveEmployee = true;
                }

                if (this.router.url == '/employee/thorough-content/quick-deploy') {
                    res.data.parentId = res.data.thoroughContentId;
                    res.data.thoroughContentId = null;
                    // res.data.thoroughOrganizationId = resUserData.data.partyOrganizationId;
                    this.parentThoroughDate = res.data.thoroughDate;
                    res.data.thoroughDate = new Date().getTime();
                    // res.data.status = this.statusOptions[1];
                } else if (this.router.url == '/employee/thorough-content/clone') {
                    res.data.thoroughContentId = null;
                    res.data.status = this.statusOptions[0].id;
                } else {
                    if (res.data.status == this.statusOptions[1].id) {
                        this.editableThoroughed = true;
                        this.viewMode = false;
                    }
                    // res.data.status = this.statusOptions.find(e => { return e.id == res.data.status });
                }
                // this.formGroup.value.thoroughLevel = res.data.thoroughLevel
                if (this.router.url == '/employee/thorough-content/quick-deploy') {
                    let defaultDomain = HrStorage.getDefaultDomainByCode(CommonUtils.getPermissionCode('action.view')
                        , CommonUtils.getPermissionCode('CTCT_THOROUGH_CONTENT'));
                    if (!CommonUtils.isNullOrEmpty(defaultDomain)) {
                        partyOrganizationService.findChildByPartyOrgId(res.data.thoroughLevel, defaultDomain).subscribe(resOrgData => {
                            res.data.thoroughLevel = resOrgData.data;
                            this.formGroup = this.buildForm(res.data, this.formConfig, ACTION_FORM.UPDATE);
                            this.formGroup.setControl('thoroughContentOrgIds', this.fb.array([res.data.thoroughLevel]));
                            this.initFormGroupAfter();
                            if (res.data && res.data.fileAttachment) {
                                if (res.data.fileAttachment.attachmentFileList) {
                                    if (this.router.url == '/employee/thorough-content/quick-deploy') {
                                        filesAttachedControl.setFileAttachment(res.data.fileAttachment.attachmentFileList.map(
                                            item => {
                                                item['isTemp'] = true;
                                                item['isClone'] = true;
                                                return item;
                                            }
                                        ));
                                        this.hasParentThoroughContent = true;
                                    } else if(this.router.url == '/employee/thorough-content/clone'){
                                        // filesAttachedControl.setFileAttachment(null);
                                        filesAttachedControl.setFileAttachment(res.data.fileAttachment.attachmentFileList.map(
                                            item => {
                                                item['isTemp'] = false;
                                                item['isClone'] = true;
                                                return item;
                                            }
                                        ));
                                    }
                                    else {
                                        filesAttachedControl.setFileAttachment(res.data.fileAttachment.attachmentFileList);
                                    }
                                }

                                if (res.data.fileAttachment.fileInfographicList) {
                                    if (this.router.url == '/employee/thorough-content/quick-deploy') {
                                        filesInfographicControl.setFileAttachment(res.data.fileAttachment.fileInfographicList.map(
                                            item => {
                                                item['isTemp'] = true;
                                                item['isClone'] = true;
                                                return item;
                                            }
                                        ));
                                        this.hasParentThoroughContent = true;
                                    } else if(this.router.url == '/employee/thorough-content/clone'){
                                        // filesAttachedControl.setFileAttachment(null);
                                        filesInfographicControl.setFileAttachment(res.data.fileAttachment.fileInfographicList.map(
                                            item => {
                                                item['isTemp'] = false;
                                                item['isClone'] = true;
                                                return item;
                                            }
                                        ));
                                    }
                                    else {
                                        filesInfographicControl.setFileAttachment(res.data.fileAttachment.fileInfographicList);

                                    }
                                }
                            }
                            this.formGroup.addControl('fileAttachedList', filesAttachedControl);
                            this.formGroup.addControl('fileInfographicList',filesInfographicControl);
                            if (res.data && res.data.fileList) {
                                if (res.data.fileAttachment.fileList) {
                                    if (this.router.url == '/employee/thorough-content/quick-deploy') {
                                        filesControl.setFileAttachment(res.data.fileAttachment.fileList.map(
                                            item => {
                                                item['isTemp'] = true;
                                                item['isClone'] = true;
                                                return item;
                                            }
                                        ));
                                        this.hasParentThoroughContent = true;
                                    } else if(this.router.url == '/employee/thorough-content/clone'){
                                        // filesControl.setFileAttachment(null);
                                        filesControl.setFileAttachment(res.data.fileAttachment.fileList.map(
                                            item => {
                                                item['isTemp'] = false;
                                                item['isClone'] = true;
                                                return item;
                                            }
                                        ));

                                    } else {
                                        filesControl.setFileAttachment(res.data.fileAttachment.fileList);
                                    }
                                }
                            }
                            this.formGroup.addControl('fileList', filesControl);
                        });
                    }
                } else {
                    this.formGroup = this.buildForm(res.data, this.formConfigThoroughed, ACTION_FORM.UPDATE);
                    this.formGroup.controls['thoroughContentOrgIds'] = new FormArray([]);
                    //load danh sach don vi can nop
                    if (res.data.thoroughContentOrgIds && res.data.thoroughContentOrgIds.length > 0) {
                        this.formGroup.setControl('thoroughContentOrgIds', this.fb.array(res.data.thoroughContentOrgIds.map(item => item) || []));
                    }
                    if (this.router.url == '/employee/thorough-content/create-update' && res.data.status == this.statusOptions[1].id) {
                        let controlNames = [];
                        var endDateCheck = new Date(res.data.endDate);
                        endDateCheck.setHours(0, 0, 0, 0);
                        endDateCheck.setDate(endDateCheck.getDate() + 1);
                        if (res.data.thoroughDate > new Date().getTime()) {
                            this.progressStatus = this.PROGRESS.WAITING;
                        } else if (res.data.thoroughDate <= new Date().getTime() && new Date().getTime() < endDateCheck.getTime()) {
                            controlNames = ['typeThorough', 'thoroughDate', 'endDate', 'targetTypeThorough'];
                            this.progressStatus = this.PROGRESS.INPROGRESS;
                        } else {
                            controlNames = ['title', 'typeThorough', 'thoroughDate', 'endDate', 'targetTypeThorough'];
                            this.progressStatus = this.PROGRESS.ENDED;
                        }
                        this.clearValidate(controlNames);
                    }

                    this.initFormGroupAfter();

                    if (res.data && res.data.fileAttachment) {
                        if (res.data.fileAttachment.fileList) {
                            if (this.router.url == '/employee/thorough-content/quick-deploy') {
                                filesControl.setFileAttachment(res.data.fileAttachment.fileList.map(
                                    item => {
                                        item['isTemp'] = true;
                                        // item['isClone'] = true;
                                        return item;
                                    }
                                ));
                                this.hasParentThoroughContent = true;
                            } else if(this.router.url == '/employee/thorough-content/clone'){
                                // filesControl.setFileAttachment(null);
                                const listClone = res.data.fileAttachment.fileList.map(
                                    item => {
                                        item['isTemp'] = true;
                                        item['isClone'] = true;
                                        return item;
                                    }
                                )
                                filesControl.clearValidators();
                                filesControl.setErrors(null);
                                filesControl.setValue(listClone)
                                filesControl.setFileAttachment(listClone);
                            } else {
                                filesControl.setFileAttachment(res.data.fileAttachment.fileList);
                            }
                        }

                        this.formGroup.addControl('fileList', filesControl);
                        // this.multiFileChooser.ngOnChanges()
                        if (res.data.fileAttachment.attachmentFileList) {
                            if (this.router.url == '/employee/thorough-content/quick-deploy') {
                                filesAttachedControl.setFileAttachment(res.data.fileAttachment.attachmentFileList.map(
                                    item => {
                                        item['isTemp'] = true;
                                        // item['isClone'] = true;
                                        return item;
                                    }
                                ));
                                this.hasParentThoroughContent = true;
                            } else if(this.router.url == '/employee/thorough-content/clone'){
                                // filesAttachedControl.setFileAttachment(null);
                                const listClone = res.data.fileAttachment.attachmentFileList.map(
                                    item => {
                                        item['isTemp'] = true;
                                        item['isClone'] = true;
                                        return item;
                                    }
                                )
                                filesControl.clearValidators();
                                filesControl.setErrors(null);
                                 filesAttachedControl.setFileAttachment(listClone);
                                filesAttachedControl.setValue(listClone)

                            } else {
                                filesAttachedControl.setFileAttachment(res.data.fileAttachment.attachmentFileList);
                            }
                        }
                        this.formGroup.addControl('fileAttachedList', filesAttachedControl);
                        if (res.data.fileAttachment.fileInfographicList) {
                            if (this.router.url == '/employee/thorough-content/quick-deploy') {
                                filesInfographicControl.setFileAttachment(res.data.fileAttachment.fileInfographicList.map(
                                    item => {
                                        item['isTemp'] = true;
                                        // item['isClone'] = true;
                                        return item;
                                    }
                                ));
                                this.hasParentThoroughContent = true;
                            } else if(this.router.url == '/employee/thorough-content/clone'){
                                // filesAttachedControl.setFileAttachment(null);
                                const listClone = res.data.fileAttachment.fileInfographicList.map(
                                    item => {
                                        item['isTemp'] = true;
                                        item['isClone'] = true;
                                        return item;
                                    }
                                );
                                filesControl.clearValidators();
                                filesControl.setErrors(null);
                                filesInfographicControl.setFileAttachment(listClone);
                                filesInfographicControl.setValue(listClone)

                            } else {
                                filesInfographicControl.setFileAttachment(res.data.fileAttachment.fileInfographicList);
                            }
                        }
                        this.formGroup.addControl('fileInfographicList', filesInfographicControl);
                    }
                }

                this.initValueChange();
                this.handleOnchangeBranch();
            });
        } else {
            this.header = "Thông tin thêm mới";
            this.isCreate = true;

            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            this.formGroup.get('thoroughDate').reset(new Date());
            this.formGroup.get('endDate').reset(tomorrow);
            this.formGroup.get('formOfConfirmation').reset(this.formOfConfirmationOptions[1].id);
            this.formGroup.get('examQuestionSetId').setValidators([ValidationService.required]);
            this.formGroup.addControl('fileList', filesControl);
            this.formGroup.addControl('fileAttachedList', filesAttachedControl);
            this.formGroup.addControl('fileInfographicList',filesInfographicControl)
            this.initValueChange();
        }
    }

    clearValidate(controlNames: any[]) {
        controlNames.forEach(name => {
            this.formGroup.get(name).clearValidators();
            this.formGroup.get(name).setErrors(null);
        });
    }

    clearForm() {
        this.formGroup = this.buildForm({}, this.formConfig, ACTION_FORM.INSERT);
        this.formGroup.controls['thoroughContentOrgIds'].setValue([]);
        this.typeThoroughOptions = this.targetTypeThoroughOptions;
        this.hasParentThoroughContent = false;
        this.formGroup.addControl('fileList', new FileControl(null, ValidationService.required));
        //bo required file dinh kem
        this.formGroup.addControl('fileAttachedList', new FileControl(null));
        this.formGroup.addControl('fileInfographicList', new FileControl(null));
    }

    initFormGroupAfter() {
        if (this.formGroup.value.formOfConfirmation && this.formGroup.value.formOfConfirmation.id == this.formOfConfirmationOptions[1].id) {
            this.formGroup.get('examQuestionSetId').setValidators([ValidationService.required]);
        }
        if (this.formGroup.value['examQuestionSetId'] && this.formGroup.value['examQuestionSetId'].totalQuestion) {
            this.formGroup.get('questionAmount').setValidators([ValidationService.required, ValidationService.positiveInteger, Validators.min(1), Validators.max(this.formGroup.value['examQuestionSetId'].totalQuestion)]);
        }
        if(this.formGroup.value['questionAmount']) {
            this.formGroup.get('passScore').setValidators([ValidationService.required, ValidationService.positiveInteger, Validators.min(1), Validators.max(this.formGroup.value['questionAmount'])]);
        }
    }

    initValueChange() {
        this.formGroup.get('thoroughLevel').valueChanges.subscribe(value => {
            if (value) {
                if (value == 1 ) {
                    this.formGroup.controls['approveEmployeeId'].setValidators([Validators.required]);
                    this.formGroup.controls['approveEmployeeId'].updateValueAndValidity();
                } else {
                    this.formGroup.controls['approveEmployeeId'].clearValidators();
                    this.formGroup.controls['approveEmployeeId'].updateValueAndValidity();
                }
                if (this.resBranch.data.length > 0) {
                    this.filterCondition = `AND obj.status = 1 AND obj.required_thorough = 1
          AND CURDATE() BETWEEN obj.thorough_date AND obj.end_date
          AND obj.branch IN (${this.formGroup.value.branch ? this.formGroup.value.branch : this.resBranch.data.join(",")})
          AND obj.thorough_level IN (
            SELECT po.parent_id FROM party_organization po
            WHERE po.party_organization_id = ${value}
          )
           ORDER BY obj.created_date DESC`;
                    this.filterConditionApprover = `AND obj.status = 1 AND EXISTS (SELECT e.employee_id, e.employee_code, e.full_name, e.email FROM employee e
                        WHERE e.employee_id = (SELECT po.secretary_id FROM party_organization po WHERE po.party_organization_id = ${value}) AND e.status = 1 and e.employee_id = obj.employee_id
                        UNION ALL
                        SELECT e.employee_id, e.employee_code, e.full_name, e.email FROM employee e
                        WHERE e.employee_id = (SELECT po.authorization_id FROM party_organization po WHERE po.party_organization_id = ${value}) AND e.status = 1 and e.employee_id = obj.employee_id
                        UNION ALL
                        SELECT e.employee_id, e.employee_code, e.full_name, e.email FROM employee e
                        WHERE e.employee_id IN (
                        SELECT pmcp.employee_id FROM party_member_concurrent_process pmcp WHERE pmcp.party_organization_id = ${value}
                        AND NOW() BETWEEN pmcp.effective_date AND nvl(pmcp.expired_date, NOW())
                        ) AND e.status = 1 and e.employee_id = obj.employee_id
                        UNION ALL
                        SELECT e.employee_id, e.employee_code, e.full_name, e.email FROM employee e
                        INNER JOIN work_process wp ON wp.employee_id = e.employee_id AND NOW() BETWEEN wp.effective_start_date AND nvl(wp.effective_end_date, NOW())
                        INNER JOIN position p ON p.position_id = wp.main_position_id
                        WHERE 1= 1
                        AND p.position_id = 601741 and e.employee_id = obj.employee_id
                        AND e.status = 1)`;
                }
                //phan quyen
                this.partyThoroughOrgSelector.rootId = value;
                this.filterConditionThoroughLevel = ` org_path like '%/${value}/%'`;
                this.partyThoroughOrgSelector.ngOnChanges();
            } else {
                this.filterCondition = "AND 0=1 ORDER BY obj.created_date DESC";
                this.filterConditionApprover = "AND obj.status = 1 AND EXISTS ( SELECT pm.employee_id FROM party_member pm INNER JOIN party_member_process pmp ON pm.party_member_id = pmp.party_member_id WHERE pm.employee_id = obj.employee_id AND CURRENT_DATE BETWEEN pmp.effective_date AND COALESCE(pmp.expired_date, CURRENT_DATE))";
            }

        });

        this.formGroup.get('parentId').valueChanges.subscribe(value => {
            //fix bug thay doi noi dung quan triet cap tren thi khong thay doi cap trien khai
            let thoroughLevel = this.formGroup.controls['thoroughLevel'].value;
            let filesControl = new FileControl(null, ValidationService.required);
            // bo required file dinh kem
            let filesAttachedControl = new FileControl(null);
            let filesInfographicControl = new FileControl(null);
            if (value) {
                this.service.findOne(value).subscribe(res => {
                    this.formGroup = this.buildForm(res.data, this.formConfigThoroughed)
                    this.hasParentThoroughContent = true;
                    this.formGroup.controls['thoroughContentId'].setValue(null)
                    this.formGroup.controls['thoroughLevel'].setValue(thoroughLevel)
                    this.formGroup.setControl('thoroughContentOrgIds', this.fb.array([this.formGroup.value.thoroughLevel]));
                    //thay doi noi dung quan triet cap tren -> de trong don vi trien khai
                    // this.formGroup.controls['thoroughContentOrgIds'].setValue(null)
                    //luu quan triet cap tren
                    this.formGroup.controls['parentId'].setValue(value)
                    this.formGroup.controls['approveEmployeeId'].setValue(null)
                    if(res.data.targetTypeThorough) {
                        this.formGroup.controls['typeThorough'].setValue(res.data.targetTypeThorough);
                    }
                    if(this.formGroup.controls['typeThorough'].value != 4) {
                        this.formGroup.controls['requiredThorough'].setValue(false);
                        this.notIsSecretary = true;
                    }else {
                        this.notIsSecretary = false;
                    }
                    if(this.thoroughLevelOptions) {
                        let selectOption = this.thoroughLevelOptions.find(option => option.partyOrganizationId == thoroughLevel);
                        if(selectOption && selectOption.type != 15 && selectOption.type!=6) {
                            this.typeThoroughOptions = [{id: 4, name: this.translation.translate('label.thorough-content.type-thorough-4')}]
                            if(this.formGroup.controls['typeThorough'].value != 4) {
                                this.typeThoroughOptions.push(this.targetTypeThoroughOptions.find(option => option.id ==  this.formGroup.controls['typeThorough'].value))
                            }
                        }else {
                            this.typeThoroughOptions = [];
                            this.typeThoroughOptions.push(this.targetTypeThoroughOptions.find(option => option.id ==  this.formGroup.controls['typeThorough'].value))
                        }
                    }
                    // this.formGroup.addControl('fileList', new FileControl(null, ValidationService.required));
                    // //bo required file dinh kem
                    // this.formGroup.addControl('fileAttachedList', new FileControl(null));
                    if (res.data && res.data.fileAttachment) {
                        if (res.data.fileAttachment.attachmentFileList) {
                            const listClone = res.data.fileAttachment.attachmentFileList.map(
                                item => {
                                    item['isTemp'] = true;
                                    item['isClone'] = true;
                                    return item;
                                }
                            );
                            filesAttachedControl.setValue(listClone)
                            filesAttachedControl.setFileAttachment(listClone)
                            this.formGroup.addControl('fileAttachedList',filesAttachedControl);


                            // (this.formGroup.controls['fileAttachedList'] as FileControl).setFileAttachment(listClone)
                            // (this.formGroup.controls['fileAttachedList'] as FileControl).setValue( filesAttachedControl);
                            this.multiFileAttachedChooser.ngOnChanges();

                        }
                        if (res.data.fileAttachment.fileList) {
                            const listClone = res.data.fileAttachment.fileList.map(
                                item => {
                                    item['isTemp'] = true;
                                    item['isClone'] = true;
                                    return item;
                                }
                            );
                            filesControl.setValue(listClone);
                            filesControl.setFileAttachment(listClone);
                            filesControl.setValidators(ValidationService.required);
                            // (this.formGroup.controls['fileList'] as FileControl).setFileAttachment(listClone);
                            this.formGroup.addControl('fileList', filesControl);
                            this.multiFileChooser.ngOnChanges();
                        }
                        if (res.data.fileAttachment.fileInfographicList) {
                            const listClone = res.data.fileAttachment.fileInfographicList.map(
                                item => {
                                    item['isTemp'] = true;
                                    item['isClone'] = true;
                                    return item;
                                }
                            );
                            filesInfographicControl.setValue(listClone);
                            filesInfographicControl.setFileAttachment(listClone);
                            // filesControl.setValidators(ValidationService.required);
                            // (this.formGroup.controls['fileList'] as FileControl).setFileAttachment(listClone);
                            this.formGroup.addControl('fileInfographicList', filesInfographicControl);
                            this.multiFileInfographicChooser.ngOnChanges();
                        }
                    }
                });
                // });
            }
        });

        this.formGroup.get('formOfConfirmation').valueChanges.subscribe(value => {
            if (value != undefined && value == this.formOfConfirmationOptions[1].id) {
                this.formGroup.controls['examQuestionSetId'].setValidators([ValidationService.required]);
                this.formGroup.controls['examQuestionSetId'].updateValueAndValidity();
            } else {
                this.formGroup.get('examQuestionSetId').setValue(null);
                this.formGroup.get('examQuestionSetId').clearValidators();
                this.formGroup.get('examQuestionSetId').setErrors(null);
                this.formGroup.controls['examQuestionSetId'].updateValueAndValidity();
                this.formGroup.get('questionAmount').setValue(null);
                this.formGroup.get('questionAmount').clearValidators();
                this.formGroup.get('questionAmount').setErrors(null);
                this.formGroup.controls['questionAmount'].updateValueAndValidity();
                this.formGroup.get('passScore').setValue(null);
                this.formGroup.get('passScore').clearValidators();
                this.formGroup.get('passScore').setErrors(null);
                this.formGroup.controls['passScore'].updateValueAndValidity();
            }
        });



        this.formGroup.get('typeThorough').valueChanges.subscribe(value => {
            if (value != undefined && value == this.typeThoroughOptions[2].id) {
                if (this.progressStatus != this.PROGRESS.WAITING) {
                    this.formGroup.get('requiredThorough').setValue(true);
                    if (!this.formGroup.get('parentId').value) {
                        this.formGroup.get('targetTypeThorough').setValue(null);
                    }
                }
            } else {
                if (this.progressStatus != this.PROGRESS.WAITING) {
                    this.formGroup.get('requiredThorough').setValue(false);
                    if (!this.formGroup.get('parentId').value) {
                        this.formGroup.get('targetTypeThorough').setValue(value);
                    }
                }
            }
        });

        this.formGroup.get('requiredThorough').valueChanges.subscribe(value => {
            if (!this.formGroup.get('parentId').value) {
                if (value) {
                    this.formGroup.get('targetTypeThorough').setValue(null);
                } else {
                    this.formGroup.get('targetTypeThorough').setValue(this.formGroup.get('typeThorough').value);
                }
            }
        });

        this.formGroup.get('examQuestionSetId').valueChanges.subscribe(value => {
            if (value) {
                this.formGroup.get('questionAmount').clearValidators();
                this.formGroup.get('questionAmount').setErrors(null);
                this.formGroup.get('questionAmount').setValidators([ValidationService.required, ValidationService.positiveInteger, Validators.min(1), Validators.max(value.totalQuestion)]);
            } else {
                this.formGroup.get('questionAmount').clearValidators();
                this.formGroup.get('questionAmount').setErrors(null);
                this.formGroup.get('questionAmount').setValidators([ValidationService.required, ValidationService.positiveInteger, Validators.min(1)]);
            }
            this.formGroup.get('questionAmount').updateValueAndValidity();
        });


        this.formGroup.get('questionAmount').valueChanges.subscribe(value => {
            if (value != undefined && value > 0) {
                this.formGroup.get('passScore').clearValidators();
                this.formGroup.get('passScore').setErrors(null);
                this.formGroup.get('passScore').setValidators([ValidationService.required, ValidationService.positiveInteger, Validators.min(1), Validators.max(value)]);
            } else {
                this.formGroup.get('passScore').clearValidators();
                this.formGroup.get('passScore').setErrors(null);
                this.formGroup.get('passScore').setValidators([ValidationService.required, ValidationService.positiveInteger, Validators.min(1)]);
            }
            this.formGroup.get('passScore').updateValueAndValidity();
        });
    }

    ngOnInit() {
        this.initValueChange();
    }

    previous() {
        this.router.navigateByUrl('/employee/thorough-content');
    }

    get f() {
        return this.formGroup.controls;
    }

    onChangeThoroughLevel() {
        let value = this.formGroup.controls['thoroughLevel'].value;
        let branch = this.formGroup.controls['branch'].value;
        if (value) {
            if (value == 1 ) {
                this.formGroup.controls['approveEmployeeId'].setValidators([Validators.required]);
                this.formGroup.controls['approveEmployeeId'].updateValueAndValidity();
            } else {
                this.formGroup.controls['approveEmployeeId'].clearValidators();
                this.formGroup.controls['approveEmployeeId'].updateValueAndValidity();
            }
            if(this.formGroup.controls['parentId'].value) {
                this.clearForm();
                this.formGroup.controls['branch'].setValue(branch);
                this.formGroup.controls['thoroughLevel'].setValue(value)
            }
            if (this.resBranch.data.length > 0) {
                this.filterCondition = `AND obj.status = 1 AND obj.required_thorough = 1
          AND CURDATE() BETWEEN obj.thorough_date AND obj.end_date
          AND obj.branch IN (${this.formGroup.value.branch ? this.formGroup.value.branch : this.resBranch.data.join(",")})
          AND obj.thorough_level IN (
            SELECT po.parent_id FROM party_organization po
            WHERE po.party_organization_id = ${value}
          )
           ORDER BY obj.created_date DESC`;
                this.filterConditionApprover = `AND obj.status = 1 AND EXISTS (SELECT e.employee_id, e.employee_code, e.full_name, e.email FROM employee e
                        WHERE e.employee_id = (SELECT po.secretary_id FROM party_organization po WHERE po.party_organization_id = ${value}) AND e.status = 1 and e.employee_id = obj.employee_id
                        UNION ALL
                        SELECT e.employee_id, e.employee_code, e.full_name, e.email FROM employee e
                        WHERE e.employee_id = (SELECT po.authorization_id FROM party_organization po WHERE po.party_organization_id = ${value}) AND e.status = 1 and e.employee_id = obj.employee_id
                        UNION ALL
                        SELECT e.employee_id, e.employee_code, e.full_name, e.email FROM employee e
                        WHERE e.employee_id IN (
                        SELECT pmcp.employee_id FROM party_member_concurrent_process pmcp WHERE pmcp.party_organization_id = ${value}
                        AND NOW() BETWEEN pmcp.effective_date AND nvl(pmcp.expired_date, NOW())
                        ) AND e.status = 1 and e.employee_id = obj.employee_id
                        UNION ALL
                        SELECT e.employee_id, e.employee_code, e.full_name, e.email FROM employee e
                        INNER JOIN work_process wp ON wp.employee_id = e.employee_id AND NOW() BETWEEN wp.effective_start_date AND nvl(wp.effective_end_date, NOW())
                        INNER JOIN position p ON p.position_id = wp.main_position_id
                        WHERE 1= 1
                        AND p.position_id = 601741 and e.employee_id = obj.employee_id
                        AND e.status = 1)`;
            }
            //phan quyen
            this.partyThoroughOrgSelector.rootId = value;
            this.filterConditionThoroughLevel = ` org_path like '%/${value}/%'`;
            this.partyThoroughOrgSelector.ngOnChanges();
        } else {
            this.filterCondition = "AND 0=1 ORDER BY obj.created_date DESC";
            this.filterConditionApprover = "AND obj.status = 1 AND EXISTS ( SELECT pm.employee_id FROM party_member pm INNER JOIN party_member_process pmp ON pm.party_member_id = pmp.party_member_id WHERE pm.employee_id = obj.employee_id AND CURRENT_DATE BETWEEN pmp.effective_date AND COALESCE(pmp.expired_date, CURRENT_DATE))";
        }
    }

    onChangeParent() {
        //fix bug thay doi noi dung quan triet cap tren thi khong thay doi cap trien khai
        let value = this.formGroup.controls['parentId'].value;
        let thoroughLevel = this.formGroup.controls['thoroughLevel'].value;
        let filesControl = new FileControl(null, ValidationService.required);
        // bo required file dinh kem
        let filesAttachedControl = new FileControl(null);
        let filesInfographicControl = new FileControl(null);
        if (value) {
            this.service.findOne(value).subscribe(res => {
                this.formGroup = this.buildForm(res.data, this.formConfigThoroughed)
                this.hasParentThoroughContent = true;
                this.formGroup.controls['thoroughContentId'].setValue(null)
                this.formGroup.controls['thoroughLevel'].setValue(thoroughLevel)
                this.formGroup.setControl('thoroughContentOrgIds', this.fb.array([this.formGroup.value.thoroughLevel]));
                //thay doi noi dung quan triet cap tren -> de trong don vi trien khai
                // this.formGroup.controls['thoroughContentOrgIds'].setValue(null)
                //luu quan triet cap tren
                this.formGroup.controls['parentId'].setValue(value)
                this.formGroup.controls['approveEmployeeId'].setValue(null)
                if(res.data.targetTypeThorough) {
                    this.formGroup.controls['typeThorough'].setValue(res.data.targetTypeThorough);
                }
                if(this.formGroup.controls['typeThorough'].value != 4) {
                    this.formGroup.controls['requiredThorough'].setValue(false);
                    this.notIsSecretary = true;
                }else {
                    this.notIsSecretary = false;
                }
                if(this.thoroughLevelOptions) {
                    let selectOption = this.thoroughLevelOptions.find(option => option.partyOrganizationId == thoroughLevel);
                    if(selectOption && selectOption.type != 15 && selectOption.type!=6) {
                        this.typeThoroughOptions = [{id: 4, name: this.translation.translate('label.thorough-content.type-thorough-4')}]
                        if(this.formGroup.controls['typeThorough'].value != 4) {
                            this.typeThoroughOptions.push(this.targetTypeThoroughOptions.find(option => option.id ==  this.formGroup.controls['typeThorough'].value))
                        }
                    }else {
                        this.typeThoroughOptions = [];
                        this.typeThoroughOptions.push(this.targetTypeThoroughOptions.find(option => option.id ==  this.formGroup.controls['typeThorough'].value))
                    }
                }
                // this.formGroup.addControl('fileList', new FileControl(null, ValidationService.required));
                // //bo required file dinh kem
                // this.formGroup.addControl('fileAttachedList', new FileControl(null));
                if (res.data && res.data.fileAttachment) {
                    if (res.data.fileAttachment.attachmentFileList) {
                        const listClone = res.data.fileAttachment.attachmentFileList.map(
                            item => {
                                item['isTemp'] = true;
                                item['isClone'] = true;
                                return item;
                            }
                        );
                        filesAttachedControl.setValue(listClone)
                        filesAttachedControl.setFileAttachment(listClone)
                        this.formGroup.addControl('fileAttachedList',filesAttachedControl);


                        // (this.formGroup.controls['fileAttachedList'] as FileControl).setFileAttachment(listClone)
                        // (this.formGroup.controls['fileAttachedList'] as FileControl).setValue( filesAttachedControl);
                        this.multiFileAttachedChooser.ngOnChanges();

                    }
                    if (res.data.fileAttachment.fileInfographicList) {
                        const listClone = res.data.fileAttachment.fileInfographicList.map(
                            item => {
                                item['isTemp'] = true;
                                item['isClone'] = true;
                                return item;
                            }
                        );
                        filesInfographicControl.setValue(listClone)
                        filesInfographicControl.setFileAttachment(listClone)
                        this.formGroup.addControl('fileInfographicList',filesInfographicControl);

                        this.multiFileInfographicChooser.ngOnChanges();

                    }
                    if (res.data.fileAttachment.fileList) {
                        const listClone = res.data.fileAttachment.fileList.map(
                            item => {
                                item['isTemp'] = true;
                                item['isClone'] = true;
                                return item;
                            }
                        );
                        filesControl.setValue(listClone);
                        filesControl.setFileAttachment(listClone);
                        filesControl.setValidators(ValidationService.required);
                        // (this.formGroup.controls['fileList'] as FileControl).setFileAttachment(listClone);
                        this.formGroup.addControl('fileList', filesControl);
                        this.multiFileChooser.ngOnChanges();
                    }
                }
            });
            // });
        }else {
            this.typeThoroughOptions = this.targetTypeThoroughOptions;
            this.hasParentThoroughContent = false;
        }
    }

    onChangeTypeThorough() {
        let typeThorough = this.formGroup.controls['typeThorough'].value;
        if(typeThorough != null && typeThorough ==4 ) {
            this.notIsSecretary = false;
        }else if(typeThorough != null && typeThorough != 4){
            this.notIsSecretary = true;
            this.formGroup.controls['requiredThorough'].setValue(false);
        }
        if(typeThorough != null && typeThorough ==2 ) {
            this.isShowMassThough = true;
        }else if(typeThorough != null && typeThorough != 2){
            this.isShowMassThough = false;
        }
    }
    onChangeTargetTypeThorough() {
        let targetTypeThorough = this.formGroup.controls['targetTypeThorough'].value;

        if(targetTypeThorough != null && targetTypeThorough ==2 ) {
            this.isShowMassThough = true;
        }else if(targetTypeThorough != null && targetTypeThorough != 2){
            this.isShowMassThough = false;
        }
    }

    submitToApprove() {
        this.app.confirmMessage('thorough-content.message.confirm.submit',
            () => {
                this.service.submitToApprove(this.formGroup.value["thoroughContentId"])
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

    submitToThorough() {
        this.app.confirmMessage('thorough-content.message.confirm.thorough',
            () => {
                this.service.submitToThorough(this.formGroup.value["thoroughContentId"])
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

    save() {
        let isCheck = false;
        if (!CommonUtils.isValidForm(this.formGroup) || isCheck || this.customValidateDate() || this.customValidateThoroughDate()) {
            return;
        }
        if (!this.formGroup.value.summaryContent && !this.formGroup.value.detailContent) {
            this.app.warningMessage("thorough-content.summary-detail-required");
            return;
        }
        this.formGroup.value.endDate = this.formGroup.value['endDate'] instanceof Date ? this.formGroup.value['endDate'].getTime() : this.formGroup.value['endDate'];
        this.formGroup.value.thoroughDate = this.formGroup.value['thoroughDate'] instanceof Date ? this.formGroup.value['thoroughDate'].getTime() : this.formGroup.value['thoroughDate'];
        if (this.formGroup.value.parentId) {
            this.service.getChildOrganziation(this.formGroup.value.parentId, this.formGroup.value.thoroughContentId ? this.formGroup.value.thoroughContentId : -1).subscribe(res => {
                if (res.data) {
                    res.data = res.data.map(item => item.toString());
                    const listOrg = this.formGroup.value.thoroughContentOrgIds;
                    for (let i = 0; i < listOrg.length; i++) {
                        const element = listOrg[i];
                        if (res.data.includes(element.toString())) {
                            this.app.warningMessage("thorough-content.duplicate-org");
                            return;
                        }
                    }

                    this.saveData();
                }
            });
        } else {
            this.saveData();
        }
    }

    saveData() {
        // const copiedForm = this.cloneFormGroup(this.formGroup);
        // copiedForm.controls['branch'].setValue(this.formGroup.value['branch'] ? this.formGroup.value['branch'].value : null);
        // copiedForm.controls['issueLevel'].setValue(this.formGroup.value['issueLevel'] ? this.formGroup.value['issueLevel'].id : null);
        // copiedForm.controls['formOfConfirmation'].setValue(this.formGroup.value['formOfConfirmation'] ? this.formGroup.value['formOfConfirmation'].id : null);
        // copiedForm.controls['typeThorough'].setValue(this.formGroup.value['typeThorough'] ? this.formGroup.value['typeThorough'].id : null);
        // copiedForm.controls['targetTypeThorough'].setValue(this.formGroup.value['targetTypeThorough'] ? this.formGroup.value['targetTypeThorough'].id : null);
        // copiedForm.controls['requiredThorough'].setValue(this.formGroup.value['requiredThorough'] ? 1 : 0);
        // copiedForm.controls['examQuestionSetId'].setValue(this.formGroup.value['examQuestionSetId'] ? this.formGroup.value['examQuestionSetId'].examQuestionSetId : null);
        // copiedForm.controls['type'].setValue(this.formGroup.value['type'] ? this.formGroup.value['type'].categoryId : null);
        // copiedForm.controls['status'].setValue(this.formGroup.value['status'] ? this.formGroup.value['status'].id : null);
        // copiedForm.controls['approveEmployeeId'].setValue(this.formGroup.value['approveEmployeeId'] ? this.formGroup.value['approveEmployeeId'] : null);
        //
        // copiedForm.controls['thoroughDate'].setValue(this.formGroup.value['thoroughDate']
        //   && this.formGroup.value['thoroughDate'] instanceof Date
        //   ? this.formGroup.value['thoroughDate'].getTime() : this.formGroup.value['thoroughDate']);
        //
        // copiedForm.controls['endDate'].setValue(this.formGroup.value['endDate']
        //   && this.formGroup.value['endDate'] instanceof Date
        //   ? this.formGroup.value['endDate'].getTime() : this.formGroup.value['endDate']);
        // if (thorough) {
        //   // Quám triệt
        //   this.app.confirmMessage('thorough-content.message.confirm.thorough',
        //     () => {
        //       this.service.thoroughFormFile(copiedForm.value)
        //         .subscribe(res => {
        //           if (res.code == "success") {
        //             this.router.navigateByUrl('/employee/thorough-content');
        //           }
        //         });
        //     },
        //     () => {
        //     }
        //   )
        // } else {
        // Lưu lại
        this.app.confirmMessage(null,
            () => {
                this.service.saveOrUpdateFormFile(this.formGroup.value)
                    .subscribe(res => {
                        // if (res.code == "success" && history.state.thoroughContentId) {
                        //   this.router.navigateByUrl('/employee/thorough-content/view', { state: this.formGroup.value });
                        // } else if (res.code == "success") {
                        //   this.router.navigateByUrl('/employee/thorough-content');
                        // }
                        if (res.code == "success") {
                            this.router.navigateByUrl('/employee/thorough-content/view', {state: res.data})
                        }
                    });
            },
            () => {
            }
        )
        // }
    }

    navigate() {
        this.router.navigateByUrl('/employee/thorough-content/create-update', {state: this.formGroup.value});
    }

    cloneFormGroup(formGroup: FormGroup): FormGroup {
        const copiedControls = {};
        Object.keys(formGroup.controls).forEach(controlName => {
            const control = formGroup.controls[controlName];
            copiedControls[controlName] = new FormControl(control.value);
        });
        return new FormGroup(copiedControls);
    }

    customValidateThoroughDate() {
        if (this.progressStatus == this.PROGRESS.INPROGRESS || this.progressStatus == this.PROGRESS.ENDED) {
            return false;
        }
        if (!this.parentThoroughDate) {
            return false;
        }
        const thoroughDate = this.formGroup.value['thoroughDate'] instanceof Date ? this.formGroup.value['thoroughDate'].getTime() : this.formGroup.value['thoroughDate'];
        const isCheck = thoroughDate >= this.parentThoroughDate;
        return !isCheck;
    }

    customValidateDate() {
        if (!this.formGroup.value['endDate']) {
            return false;
        }
        const endDate = this.formGroup.value['endDate'] instanceof Date ? this.formGroup.value['endDate'].getTime() : this.formGroup.value['endDate'];
        const thoroughDate = this.formGroup.value['thoroughDate'] instanceof Date ? this.formGroup.value['thoroughDate'].getTime() : this.formGroup.value['thoroughDate'];
        const isCheck = endDate > (thoroughDate ? thoroughDate : new Date());
        return !isCheck;
    }
    handleOnchangeBranch(){
        let grantedDomain = null;
        let value = this.formGroup.controls['branch'].value
        if (value != undefined) {
            if (value == this.branchOptions[0].value) {
                grantedDomain = HrStorage.getGrantedDomainByCode(ACTION_FORM.VIEW
                    , RESOURCE.CTCT_THOROUGH_CONTENT_TOCHUCDANG);
            } else if (value == this.branchOptions[1].value) {
                grantedDomain = HrStorage.getGrantedDomainByCode(ACTION_FORM.VIEW
                    , RESOURCE.CTCT_THOROUGH_CONTENT_TUYENHUAN);
            } else if (value == this.branchOptions[2].value) {
                grantedDomain = HrStorage.getGrantedDomainByCode(ACTION_FORM.VIEW
                    , RESOURCE.CTCT_THOROUGH_CONTENT_BAOVEANNINH);
            } else if (value == this.branchOptions[3].value) {
                grantedDomain = HrStorage.getGrantedDomainByCode(ACTION_FORM.VIEW
                    , RESOURCE.CTCT_THOROUGH_CONTENT_KIEMTRAGIAMSAT);
            } else if (value == this.branchOptions[4].value) {
                grantedDomain = HrStorage.getGrantedDomainByCode(ACTION_FORM.VIEW
                    , RESOURCE.CTCT_THOROUGH_CONTENT_CONGTACQUANCHUNG);
            } else if (value == this.branchOptions[5].value) {
                grantedDomain = HrStorage.getGrantedDomainByCode(ACTION_FORM.VIEW
                    , RESOURCE.CTCT_THOROUGH_CONTENT_CHINHSACHDANVAN);
            } else if (value == this.branchOptions[6].value) {
                grantedDomain = HrStorage.getGrantedDomainByCode(ACTION_FORM.VIEW
                    , RESOURCE.CTCT_THOROUGH_CONTENT_CANBO);
            }
            if (value == this.branchOptions[0].value && !this.formGroup.controls['typeThorough'].value) {
                this.formGroup.controls['typeThorough'].setValue(this.typeThoroughOptions[0].id);
            }
            if(grantedDomain) {
                this.partyOrgService.findAllByDomain(grantedDomain).subscribe(res => {
                    this.thoroughLevelOptions = res.data
                    // this.formGroup.get('thoroughLevel').setValue(res.data.partyOrganizationId);
                    console.log("this.thoroughLevelOptions",this.thoroughLevelOptions)
                })
            }

            if (!this.formGroup.value.parentId) {
                    if (this.formGroup.value.thoroughLevel) {
                        this.filterCondition = `AND obj.status = 1 AND obj.required_thorough = 1
          AND CURDATE() BETWEEN obj.thorough_date AND obj.end_date
          AND obj.branch = ${value}
          AND obj.thorough_level IN (
            SELECT po.parent_id FROM party_organization po
            WHERE po.party_organization_id = ${this.formGroup.value.thoroughLevel}
          )
          ORDER BY obj.created_date DESC`;
                    } else {
                        this.filterCondition = "AND 0=1 ORDER BY obj.created_date DESC";
                    }
            }
        } else {
            if (this.formGroup.value.thoroughLevel) {
                this.filterCondition = `AND obj.status = 1 AND obj.required_thorough = 1
      AND CURDATE() BETWEEN obj.thorough_date AND obj.end_date
      AND obj.branch IN (${this.resBranch.data.join(",")})
      AND obj.thorough_level IN (
        SELECT po.parent_id FROM party_organization po
        WHERE po.party_organization_id = ${this.formGroup.value.thoroughLevel}
      )
       ORDER BY obj.created_date DESC`;
            } else {
                this.filterCondition = "AND 0=1 ORDER BY obj.created_date DESC";
            }
        }
    }

    onChangeBranch() {
        let grantedDomain = null;
        let value = this.formGroup.controls['branch'].value
        if (value != undefined) {
            if (value == this.branchOptions[0].value) {
                grantedDomain = HrStorage.getGrantedDomainByCode(ACTION_FORM.VIEW
                    , RESOURCE.CTCT_THOROUGH_CONTENT_TOCHUCDANG);
            } else if (value == this.branchOptions[1].value) {
                grantedDomain = HrStorage.getGrantedDomainByCode(ACTION_FORM.VIEW
                    , RESOURCE.CTCT_THOROUGH_CONTENT_TUYENHUAN);
            } else if (value == this.branchOptions[2].value) {
                grantedDomain = HrStorage.getGrantedDomainByCode(ACTION_FORM.VIEW
                    , RESOURCE.CTCT_THOROUGH_CONTENT_BAOVEANNINH);
            } else if (value == this.branchOptions[3].value) {
                grantedDomain = HrStorage.getGrantedDomainByCode(ACTION_FORM.VIEW
                    , RESOURCE.CTCT_THOROUGH_CONTENT_KIEMTRAGIAMSAT);
            } else if (value == this.branchOptions[4].value) {
                grantedDomain = HrStorage.getGrantedDomainByCode(ACTION_FORM.VIEW
                    , RESOURCE.CTCT_THOROUGH_CONTENT_CONGTACQUANCHUNG);
            } else if (value == this.branchOptions[5].value) {
                grantedDomain = HrStorage.getGrantedDomainByCode(ACTION_FORM.VIEW
                    , RESOURCE.CTCT_THOROUGH_CONTENT_CHINHSACHDANVAN);
            } else if (value == this.branchOptions[6].value) {
                grantedDomain = HrStorage.getGrantedDomainByCode(ACTION_FORM.VIEW
                    , RESOURCE.CTCT_THOROUGH_CONTENT_CANBO);
            }
            if (value == this.branchOptions[0].value) {
                this.formGroup.controls['typeThorough'].setValue(this.typeThoroughOptions[0].id);

                this.isShowMassThough = true;
            }
            if(grantedDomain) {
                this.partyOrgService.findAllByDomain(grantedDomain).subscribe(res => {
                    this.thoroughLevelOptions = res.data
                    // this.formGroup.get('thoroughLevel').setValue(res.data.partyOrganizationId);
                    console.log("this.thoroughLevelOptions",this.thoroughLevelOptions)
                })
            }

            if (!this.formGroup.value.parentId) {
                if (this.formGroup.value.thoroughLevel) {
                    this.filterCondition = `AND obj.status = 1 AND obj.required_thorough = 1
          AND CURDATE() BETWEEN obj.thorough_date AND obj.end_date
          AND obj.branch = ${value}
          AND obj.thorough_level IN (
            SELECT po.parent_id FROM party_organization po
            WHERE po.party_organization_id = ${this.formGroup.value.thoroughLevel}
          )
          ORDER BY obj.created_date DESC`;
                } else {
                    this.filterCondition = "AND 0=1 ORDER BY obj.created_date DESC";
                }
            }else {
                this.clearForm();
                this.formGroup.controls['branch'].setValue(value);
            }
        } else {
            if (this.formGroup.value.thoroughLevel) {
                this.filterCondition = `AND obj.status = 1 AND obj.required_thorough = 1
      AND CURDATE() BETWEEN obj.thorough_date AND obj.end_date
      AND obj.branch IN (${this.resBranch.data.join(",")})
      AND obj.thorough_level IN (
        SELECT po.parent_id FROM party_organization po
        WHERE po.party_organization_id = ${this.formGroup.value.thoroughLevel}
      )
       ORDER BY obj.created_date DESC`;
            } else {
                this.filterCondition = "AND 0=1 ORDER BY obj.created_date DESC";
            }
        }
    }

    preview() {
        // if (!this.validateBeforeSave()) {
        //   return;
        // }
        const modalRef = this.modalService.open(PreviewFileThoroughContentModalComponent, MEDIUM_MODAL_OPTIONS);
        modalRef.componentInstance.thoroughContentId = history.state.thoroughContentId;

        modalRef.result.then((result) => {
            if (!result) {
                return;
            }
            this.router.navigateByUrl('/employee/thorough-content');
        });
    }
}
