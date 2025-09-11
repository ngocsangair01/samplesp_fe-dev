import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {BaseComponent} from '@app/shared/components/base-component/base-component.component';
import {CommonUtils, ValidationService} from '@app/shared/services';
import {
    ACTION_FORM,
    APP_CONSTANTS,
    DEFAULT_MODAL_OPTIONS,
    LARGE_MODAL_OPTIONS,
    MEDIUM_MODAL_OPTIONS,
    PartyOrganizationService,
    RESOURCE,
} from '@app/core';
import {AppComponent} from '@app/app.component';
import {DialogService} from 'primeng/api';
import {HelperService} from '@app/shared/services/helper.service';
import {FileStorageService} from '@app/core/services/file-storage.service';
import {FileControl} from '@app/core/models/file.control';
import {Router} from '@angular/router';
import {TranslationService} from 'angular-l10n';
import {TrainingTopicService} from '@app/core/services/training-topic/training-topic.service';
import {HrStorage} from '@app/core/services/HrStorage';
import {PartyMemebersService} from '@app/core/services/party-organization/party-members.service';
import {MultiFileChooserV2Component} from '@app/shared/components/file-chooser/multi-file-chooser-v2.component';
import {PartyOrgSelectorComponent} from '@app/shared/components/party-org-selector/party-org-selector.component';
import {CategoryService} from '@app/core/services/setting/category.service';

import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
    RewardProcessLoadModalComponent
} from "@app/modules/reward/reward-propose/reward-process-load-modal/reward-process-load-modal.component";
import {Subject} from "rxjs";
import {
    RewardImportManageComponent
} from "@app/modules/reward/reward-general-form/file-import-management/reward-import-manage.component";
import {
    FileImportPopupComponent
} from "@app/modules/employee/training-topic/create-update/file-import-popup/file-import-popup.component";

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
    saveDataImport: Subject<boolean> = new Subject<boolean>();
    loadDataIntoForm: Subject<any> = new Subject<any>();
    dataToLoadIntoForm: any;
    form;
    resetFormSubject: Subject<any> = new Subject<any>();
    editableThoroughed = false;
    notIsSecretary = true;
    isQuickDeploy = false;
    hasApproveEmployee = false;
    hasParentTrainingTopic = false;
    isBranch = false;
    formGroup: FormGroup;
    header;
    isCreate = false;
    isMobileScreen: boolean = false;
    parentEndDate;
    parentFinishNumberDate;
    trainingTopicId;
    formConfig = {
        trainingTopicId: [null],  // id chuong trinh dao tao
        parentId: [''], // id dao tao cap tren,
        year: [null], //nam dao tao
        title: [null, ValidationService.required], // tiêu đề
        thoroughLevel: [null, ValidationService.required], // cap trien khai
        issueLevel: [null,ValidationService.required], //phan nhom
        objectType: [null, ValidationService.required], //Doi tuong dao tao
        startDate: [null, [ValidationService.required]], // ngay bat dau
        endDate: [null, ValidationService.required], // ngay ket thuc
        objectTypeTraining: [null, ValidationService.required], // ten nhom doi tuong
        requiredThorough: [false], // yêu cầu don vi trien khai
        finishNumberDate: [null, ValidationService.required], // ngay chot quan so dao tao
        totalTime: [null, [ValidationService.required,ValidationService.positiveInteger]], // tong so gio dao tao
        content: [null], // noi dung chuong trinh
        solution: [null],  // chi tieu, bien phap
        guideline: [null], // co quan huong dan, dam bao tai lieu
        status: [0], // trạng thái
        approveEmployeeId: [null],
        kpiAverage: [null, [ValidationService.number, Validators.min(0), Validators.max(100)]],
        kpiNumber: [null, [ValidationService.required, ValidationService.number,Validators.min(0), Validators.max(100)]],
        kpiGood: [null, [ValidationService.number, Validators.min(0), Validators.max(100)]],
        kpiExcellent: [null, [ValidationService.number, Validators.min(0), Validators.max(100)]],
        trainingTopicOrgIds: [],
        fileAttachedList: [],
        isActive: [0],                              // có hiệu lực
        classMemberBeanList: []
    };
    formConfigThoroughed = {
        trainingTopicId: [null],  // id chuong trinh dao tao
        parentId: [''], // id dao tao cap tren,
        year: [null], //nam dao tao
        title: [null, ValidationService.required], // tiêu đề
        thoroughLevel: [null, ValidationService.required], // cap trien khai
        issueLevel: [null,ValidationService.required], //phan nhom
        objectType: [null, ValidationService.required], //Doi tuong dao tao
        startDate: [null, [ValidationService.required]], // ngay bat dau
        endDate: [null, ValidationService.required], // ngay ket thuc
        objectTypeTraining: [null, ValidationService.required], // ten nhom doi tuong
        requiredThorough: [false], // yêu cầu don vi trien khai
        finishNumberDate: [null, ValidationService.required], // ngay chot quan so dao tao
        totalTime: [null, [ValidationService.required, ValidationService.positiveInteger]], // tong so gio dao tao
        content: [null], // noi dung chuong trinh
        solution: [null],  // chi tieu, bien phap
        guideline: [null], // co quan huong dan, dam bao tai lieu
        status: [0], // trạng thái
        approveEmployeeId: [null],
        trainingTopicOrgIds: [],
        kpiAverage: [null, [ ValidationService.number, Validators.min(0), Validators.max(100)]],
        kpiNumber: [null, [ValidationService.required, ValidationService.number,Validators.min(0), Validators.max(100)]],
        kpiGood: [null, [ ValidationService.number,Validators.min(0), Validators.max(100)]],
        kpiExcellent: [null, [ ValidationService.number,Validators.min(0), Validators.max(100)]],
        fileAttachedList: [],
        isActive: [0],                               // có hiệu lực
        classMemberBeanList: []
    };

    issueLevelOptions = [{value: 1, label: this.translation.translate('label.training-topic.issue.issue-level-1')},
        {value: 2, label: this.translation.translate('label.training-topic.issue.issue-level-2')},
        {value: 3, label: this.translation.translate('label.training-topic.issue.issue-level-3')}];

    objectOptions = [{id: 1, name: this.translation.translate('label.training-topic.object-type.1')},
        {id: 2, name: this.translation.translate('label.training-topic.object-type.2')},]
    objectTypeOptions = [
        {id: "482", name: this.translation.translate('label.training-topic.object-type-1')},
        {id: "483", name: this.translation.translate('label.training-topic.object-type-2')},
        {id: "484", name: this.translation.translate('label.training-topic.object-type-3')},
        {id: "485", name: this.translation.translate('label.training-topic.object-type-4')},
        {id: "486", name: this.translation.translate('label.training-topic.object-type-5')},
        {id: "481", name: this.translation.translate('label.training-topic.object-type-6')},
    ];

    statusOptions = [{id: 0, name: this.translation.translate('label.training-topic.status-0')},
        {id: 1, name: this.translation.translate('label.training-topic.status-1')},
        {id: 2, name: this.translation.translate('label.training-topic.status-2')},
        {id: 3, name: this.translation.translate('label.training-topic.status-3')},
    ];

    trainingYearOptions = [];
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

    filterCondition = " AND obj.required_thorough = 1 and obj.status = 1  ORDER BY obj.created_date DESC";
    filterConditionThoroughLevel = " ";

    parentStartDate;
    resourceCode = 'CTCT_TRAINING_TOPIC';
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
        private service: TrainingTopicService,
        private partyMemebersService: PartyMemebersService,
        private partyOrganizationService: PartyOrganizationService,
        private categoryService: CategoryService,
        public translation: TranslationService,
        private fb: FormBuilder,
    ) {
        super(null, CommonUtils.getPermissionCode("resource.trainingTopic"));
        this.setMainService(this.service);
        // this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
        this.userInfo = HrStorage.getUserToken().userInfo;


        const filesAttachedControl = new FileControl(null);
        this.viewMode = this.router.url.includes('/employee/training-topic/view');

        this.formGroup = this.buildForm({}, this.formConfig, ACTION_FORM.INSERT);
        this.formGroup.controls['trainingTopicOrgIds'] = new FormArray([]);
        const currentYear = new Date().getFullYear();
        this.formGroup.controls["year"].setValue(currentYear);
        this.trainingYearOptions = Array.from({length: 11}, (_, i) => ({value: currentYear + i}))
        this.formGroup.controls["objectType"].setValue(1);
        const subPaths = this.router.url.split('/');
        if (subPaths.length > 4) {
            this.trainingTopicId = subPaths[4]
        }
        this.service.getThoroughLevelByPermission().subscribe(res => {
            this.thoroughLevelOptions = res.data
            if (this.thoroughLevelOptions) {
                this.formGroup.get('thoroughLevel').setValue(this.thoroughLevelOptions[0].partyOrganizationId);
            }
            console.log("this.thoroughLevelOptions", this.thoroughLevelOptions)
            if (this.trainingTopicId) {
                this.header = "Thông tin chương trình đào tạo";

                this.service.findOne(this.trainingTopicId).subscribe(res => {
                    this.dataToLoadIntoForm = res.data.listClassMember;
                    this.loadDataIntoForm.next(res.data.listClassMember);
                    if (res.data.approveEmployeeId != null) {
                        this.hasApproveEmployee = true;
                    }
                    if(res.data.parentId) {
                        this.hasParentTrainingTopic = true;
                    }
                    if (this.router.url.includes('/employee/training-topic/quick-deploy')) {
                        res.data.parentId = res.data.trainingTopicId;
                        res.data.trainingTopicId = null;
                        // res.data.thoroughOrganizationId = resUserData.data.partyOrganizationId;
                        this.parentStartDate = res.data.startDate;
                        this.parentEndDate = res.data.endDate;
                        res.data.startDate = new Date().setHours(0,0,0,0);
                        this.hasParentTrainingTopic = true;
                        this.isQuickDeploy = true;
                        // res.data.status = this.statusOptions[1];
                    } else if (this.router.url.includes('/employee/training-topic/clone')) {
                        res.data.trainingTopicId = null;
                        res.data.status = this.statusOptions[0].id;
                    } else if(this.router.url.includes('/employee/training-topic/create-update')){
                        if (res.data.status == this.statusOptions[1].id) {
                            this.editableThoroughed = true;
                            this.viewMode = false;
                        }
                        // res.data.status = this.statusOptions.find(e => { return e.id == res.data.status });
                    }
                    // this.formGroup.value.thoroughLevel = res.data.thoroughLevel
                    if (this.router.url.includes('/employee/training-topic/quick-deploy')) {
                        partyOrganizationService.findChildByThoroughLevel(res.data.thoroughLevel, this.thoroughLevelOptions[0].partyOrganizationId).subscribe(resOrgData => {
                            res.data.thoroughLevel = Number(resOrgData.data);
                            this.formGroup = this.buildForm(res.data, this.formConfig, ACTION_FORM.UPDATE);
                            this.formGroup.setControl('trainingTopicOrgIds', this.fb.array([res.data.thoroughLevel]));
                            this.initFormGroupAfter();
                            if (res.data && res.data.fileAttachment) {
                                if (res.data.fileAttachment.attachmentFileList) {
                                    if (this.router.url.includes('/employee/training-topic/quick-deploy')) {
                                        {{debugger}}
                                        filesAttachedControl.setFileAttachment(res.data.fileAttachment.attachmentFileList.map(
                                            item => {
                                                item['isTemp'] = true;
                                                item['isClone'] = true;
                                                return item;
                                            }
                                        ));
                                        this.hasParentTrainingTopic = true;
                                    } else if (this.router.url.includes('/employee/training-topic/clone')) {
                                        // filesAttachedControl.setFileAttachment(null);
                                        filesAttachedControl.setFileAttachment(res.data.fileAttachment.attachmentFileList.map(
                                            item => {
                                                item['isTemp'] = false;
                                                item['isClone'] = true;
                                                return item;
                                            }
                                        ));
                                    } else {
                                        filesAttachedControl.setFileAttachment(res.data.fileAttachment.attachmentFileList);
                                    }
                                }

                            }
                            this.formGroup.setControl("fileAttachedList", filesAttachedControl);
                        })
                    } else {
                        this.formGroup = this.buildForm(res.data, this.formConfigThoroughed, ACTION_FORM.UPDATE);
                        this.formGroup.controls['trainingTopicOrgIds'] = new FormArray([]);
                        //load danh sach don vi can nop
                        if (res.data.trainingTopicOrgIds && res.data.trainingTopicOrgIds.length > 0) {
                            this.formGroup.setControl('trainingTopicOrgIds', this.fb.array(res.data.trainingTopicOrgIds.map(item => item) || []));
                        }
                        this.initFormGroupAfter();
                        if (this.router.url.includes('/employee/training-topic/create-update') && res.data.status == this.statusOptions[1].id) {
                            let controlNames = [];
                            var endDateCheck = new Date(res.data.endDate);
                            endDateCheck.setHours(0, 0, 0, 0);
                            endDateCheck.setDate(endDateCheck.getDate() + 1);
                            if (res.data.startDate > new Date().getTime()) {
                                this.progressStatus = this.PROGRESS.WAITING;
                            } else if (res.data.startDate <= new Date().getTime() && new Date().getTime() < endDateCheck.getTime()) {
                                controlNames = ['title', 'endDate'];
                                this.progressStatus = this.PROGRESS.INPROGRESS;
                            } else {
                                controlNames = ['endDate'];
                                this.progressStatus = this.PROGRESS.ENDED;
                            }
                        }



                        if (res.data && res.data.fileAttachment) {
                            {{debugger}}
                            // this.multiFileChooser.ngOnChanges()
                            if (res.data.fileAttachment.attachmentFileList) {
                                if (this.router.url.includes('/employee/training-topic/quick-deploy')) {
                                    filesAttachedControl.setFileAttachment(res.data.fileAttachment.attachmentFileList.map(
                                        item => {
                                            item['isTemp'] = true;
                                            item['isClone'] = true;
                                            return item;
                                        }
                                    ));
                                    this.hasParentTrainingTopic = true;
                                } else if (this.router.url.includes('/employee/training-topic/clone')) {
                                    // filesAttachedControl.setFileAttachment(null);
                                    const listClone = res.data.fileAttachment.attachmentFileList.map(
                                        item => {
                                            item['isTemp'] = true;
                                            item['isClone'] = true;
                                            return item;
                                        }
                                    )
                                    filesAttachedControl.setFileAttachment(listClone);
                                    filesAttachedControl.setValue(listClone)

                                } else {
                                    filesAttachedControl.setFileAttachment(res.data.fileAttachment.attachmentFileList);
                                }
                            }
                            this.formGroup.setControl('fileAttachedList', filesAttachedControl);
                            this.multiFileAttachedChooser.ngOnChanges();
                        }
                    }

                    this.initValueChange();
                });
            } else {
                this.header = "Thông tin thêm mới";
                this.isCreate = true;
                this.formGroup.get('startDate').reset(new Date().setHours(0,0,0,0));
                this.formGroup.addControl('fileAttachedList', filesAttachedControl);
                this.initValueChange();
            }
        })
        // let grantedDomain = HrStorage.getGrantedDomainByCode(CommonUtils.getPermissionCode('action.insert')
        //     , CommonUtils.getPermissionCode('CTCT_TRAINING_TOPIC'));
        // if (grantedDomain) {
        //     this.partyOrgService.findAllByDomain(grantedDomain).subscribe(res => {
        //
        //     })
        // }
        // this.partyMemebersService.findLoginPartyMember().subscribe(resUserData => {
    }



    clearForm() {
        //bo required file dinh kem
        this.formGroup.setControl('fileAttachedList', new FileControl(null));
        this.formGroup.controls['parentId'].setValue(null);
        this.hasParentTrainingTopic = false;
        this.formGroup.get('startDate').reset(new Date().setHours(0,0,0,0));
        this.initValueChange()

    }

    initFormGroupAfter() {
        let selectOption = this.thoroughLevelOptions.find(option => option.partyOrganizationId == this.formGroup.controls['thoroughLevel'].value);
        if (selectOption.type == 15 || selectOption.type == 6) {
            this.isBranch = true
            this.formGroup.controls['requiredThorough'].setValue(false)
        }else {
            this.isBranch = false
        }
        // this.onChangeThoroughLevel()
        this.onChangeTargetThorough()
    }

    initValueChange() {
        this.formGroup.get('thoroughLevel').valueChanges.subscribe(value => {
            if (value) {
                //phan quyen
                this.filterCondition = ` AND obj.required_thorough = 1 and obj.status = 1 and obj.thorough_level in (
            SELECT po.parent_id FROM party_organization po
            WHERE po.party_organization_id = ${value}
          ) AND CURRENT_DATE() BETWEEN obj.start_date AND obj.end_date
            and exists ( SELECT 1 FROM training_topic tp
INNER JOIN training_topic_org tpo ON tpo.training_topic_id = tp.training_topic_id
INNER JOIN party_organization po ON po.parent_id = tp.thorough_level AND po.org_path LIKE CONCAT('%/',tpo.party_organization_id,'/%') WHERE  po.party_organization_id = ${value} and tp.training_topic_id = obj.training_topic_id
)  ORDER BY obj.created_date DESC`
                if( this.partyThoroughOrgSelector) {
                    this.partyThoroughOrgSelector.rootId = value;
                }
                this.filterConditionThoroughLevel = ` org_path like '%/${value}/%'`;
                this.filterConditionApprover = `AND obj.status = 1 AND EXISTS\n` +
                    `                            ( SELECT e.employee_id, e.employee_code, e.full_name, e.email FROM employee e
                        WHERE e.employee_id = (SELECT po.secretary_id FROM party_organization po WHERE po.party_organization_id = ${value}) AND e.status = 1 and e.employee_id = obj.employee_id
                        UNION ALL
                        SELECT e.employee_id, e.employee_code, e.full_name, e.email FROM employee e
                        WHERE e.employee_id = (SELECT po.authorization_id FROM party_organization po WHERE po.party_organization_id = ${value}) AND e.status = 1 and e.employee_id = obj.employee_id
                        UNION ALL
                        SELECT e.employee_id, e.employee_code, e.full_name, e.email FROM employee e
                        WHERE e.employee_id IN (
                        SELECT pmcp.employee_id FROM party_member_concurrent_process pmcp WHERE pmcp.party_organization_id = ${value}
                        AND NOW() BETWEEN pmcp.effective_date AND nvl(pmcp.expired_date, NOW())
                        ) AND e.status = 1 and e.employee_id = obj.employee_id)  `;

                if(value == 1) {
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
                if(this.router.url.includes("/employee/training-topic/create-update") && this.trainingTopicId == null) { this.formGroup.setControl('trainingTopicOrgIds', this.fb.array([value]));}
            } else {
                this.filterCondition = " ORDER BY obj.created_date DESC";
                this.filterConditionApprover = "AND obj.status = 1 AND EXISTS ( SELECT pm.employee_id FROM party_member pm INNER JOIN party_member_process pmp ON pm.party_member_id = pmp.party_member_id WHERE pm.employee_id = obj.employee_id AND CURRENT_DATE BETWEEN pmp.effective_date AND COALESCE(pmp.expired_date, CURRENT_DATE))";
            }

        });

        this.formGroup.get('parentId').valueChanges.subscribe(value => {
            //fix bug thay doi noi dung quan triet cap tren thi khong thay doi cap trien khai
            let thoroughLevel = this.formGroup.controls['thoroughLevel'].value;
            let filesAttachedControl = new FileControl(null);
            if (value) {
                this.service.findOne(value).subscribe(res => {
                    this.formGroup = this.buildForm(res.data, this.formConfigThoroughed)
                    this.hasParentTrainingTopic = true;
                    this.formGroup.controls['trainingTopicId'].setValue(null)
                    this.formGroup.controls['thoroughLevel'].setValue(thoroughLevel)
                    this.formGroup.setControl('trainingTopicOrgIds', this.fb.array([this.formGroup.value.thoroughLevel]));
                    //thay doi noi dung quan triet cap tren -> de trong don vi trien khai
                    // this.formGroup.controls['thoroughContentOrgIds'].setValue(null)
                    //luu quan triet cap tren
                    this.formGroup.controls['parentId'].setValue(value)
                    this.formGroup.controls['approveEmployeeId'].setValue(null)
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
                            this.formGroup.setControl('fileAttachedList', filesAttachedControl);
                            this.multiFileAttachedChooser.ngOnChanges();

                            // (this.formGroup.controls['fileAttachedList'] as FileControl).setFileAttachment(listClone)
                            // (this.formGroup.controls['fileAttachedList'] as FileControl).setValue( filesAttachedControl);

                        }
                    }
                    if(res.data.objectType == 2) {
                        this.dataToLoadIntoForm = res.data.listClassMember;
                        this.loadDataIntoForm.next(res.data.listClassMember);
                    }
                });
                // });
            }
        });


        this.formGroup.get('requiredThorough').valueChanges.subscribe(value => {
            if (!this.formGroup.get('parentId').value) {
                // if (value) {
                //     this.formGroup.get('targetTypeThorough').setValue(null);
                // } else {
                //     this.formGroup.get('targetTypeThorough').setValue(this.formGroup.get('typeThorough').value);
                // }
            }
        });

    }

    ngOnInit() {
        this.initValueChange();
    }

    previous() {
        this.router.navigateByUrl('/employee/training-topic');
    }

    get f() {
        return this.formGroup.controls;
    }

    onChangeThoroughLevel() {
        let value = this.formGroup.controls['thoroughLevel'].value;
        if (value) {
            this.clearForm()
            {{debugger}}
            let selectOption = this.thoroughLevelOptions.find(option => option.partyOrganizationId == value);
            if (selectOption.type == 15 || selectOption.type == 6) {
                this.isBranch = true
                this.formGroup.controls['requiredThorough'].setValue(false)
            }else {
                this.isBranch = false
            }
            //phan quyen
            this.filterCondition = ` AND obj.required_thorough = 1 and obj.status = 1 and obj.thorough_level in (
            SELECT po.parent_id FROM party_organization po
            WHERE po.party_organization_id = ${value}
          ) AND CURRENT_DATE() BETWEEN obj.start_date AND obj.end_date
            and exists ( SELECT 1 FROM training_topic tp
INNER JOIN training_topic_org tpo ON tpo.training_topic_id = tp.training_topic_id
INNER JOIN party_organization po ON po.parent_id = tp.thorough_level AND po.org_path LIKE CONCAT('%/',tpo.party_organization_id,'/%') WHERE  po.party_organization_id = ${value} and tp.training_topic_id = obj.training_topic_id
)  ORDER BY obj.created_date DESC`
            if(this.partyThoroughOrgSelector) {
                this.partyThoroughOrgSelector.rootId = value;
            }
            this.filterConditionThoroughLevel = ` org_path like '%/${value}/%'`;
            this.filterConditionApprover = `AND obj.status = 1 AND EXISTS\n` +
                `                            ( SELECT e.employee_id, e.employee_code, e.full_name, e.email FROM employee e
                        WHERE e.employee_id = (SELECT po.secretary_id FROM party_organization po WHERE po.party_organization_id = ${value}) AND e.status = 1 and e.employee_id = obj.employee_id
                        UNION ALL
                        SELECT e.employee_id, e.employee_code, e.full_name, e.email FROM employee e
                        WHERE e.employee_id = (SELECT po.authorization_id FROM party_organization po WHERE po.party_organization_id = ${value}) AND e.status = 1 and e.employee_id = obj.employee_id
                        UNION ALL
                        SELECT e.employee_id, e.employee_code, e.full_name, e.email FROM employee e
                        WHERE e.employee_id IN (
                        SELECT pmcp.employee_id FROM party_member_concurrent_process pmcp WHERE pmcp.party_organization_id = ${value}
                        AND NOW() BETWEEN pmcp.effective_date AND nvl(pmcp.expired_date, NOW())
                        ) AND e.status = 1 and e.employee_id = obj.employee_id) `;

            if(value == 1) {
                this.filterConditionApprover = `AND obj.status = 1 and exists (SELECT e.employee_id, e.employee_code, e.full_name, e.email FROM employee e
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
            this.formGroup.setControl('trainingTopicOrgIds', this.fb.array([value]));
            this.onChangeTargetThorough()

        } else {
            this.filterCondition = " AND obj.required_thorough = 1 and obj.status = 1  ORDER BY obj.created_date DESC";
            this.filterConditionApprover = "AND obj.status = 1 AND EXISTS ( SELECT pm.employee_id FROM party_member pm INNER JOIN party_member_process pmp ON pm.party_member_id = pmp.party_member_id WHERE pm.employee_id = obj.employee_id AND CURRENT_DATE BETWEEN pmp.effective_date AND COALESCE(pmp.expired_date, CURRENT_DATE))";
        }
    }

    onChangeParent() {

        let value = this.formGroup.controls['parentId'].value;
        let thoroughLevel = this.formGroup.controls['thoroughLevel'].value;
        let startDate = this.formGroup.controls['startDate'].value;
        let filesAttachedControl = new FileControl(null);
        if (value) {
            this.service.findOne(value).subscribe(res => {
                this.formGroup = this.buildForm(res.data, this.formConfigThoroughed)
                this.hasParentTrainingTopic = true;
                this.parentEndDate = this.formGroup.controls['endDate'].value;
                this.parentFinishNumberDate = this.formGroup.controls['finishNumberDate'].value
                this.formGroup.controls['trainingTopicId'].setValue(null)
                this.formGroup.controls['thoroughLevel'].setValue(thoroughLevel)
                this.formGroup.controls['startDate'].setValue(startDate)
                this.formGroup.setControl('trainingTopicOrgIds', this.fb.array([this.formGroup.value.thoroughLevel]));
                //luu chuyen de cap tren
                this.formGroup.controls['parentId'].setValue(value)
                this.formGroup.controls['approveEmployeeId'].setValue(null)
                let selectOption = this.thoroughLevelOptions.find(option => option.partyOrganizationId == thoroughLevel);
                this.formGroup.controls['requiredThorough'].setValue(false)
                if (selectOption.type == 15 || selectOption.type == 6) {
                    this.isBranch = true
                }else {
                    this.isBranch = false
                }
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
                        this.formGroup.setControl('fileAttachedList',filesAttachedControl);


                        // (this.formGroup.controls['fileAttachedList'] as FileControl).setFileAttachment(listClone)
                        // (this.formGroup.controls['fileAttachedList'] as FileControl).setValue( filesAttachedControl);
                        this.multiFileAttachedChooser.ngOnChanges();

                    }
                }
                this.onChangeTargetThorough()
                // this.formGroup.addControl('fileList', new FileControl(null, ValidationService.required));
                // //bo required file dinh kem
                // this.formGroup.addControl('fileAttachedList', new FileControl(null));
            });
            // });
        } else {
            this.hasParentTrainingTopic = false;
        }
    }

    onChangeTargetThorough() {
        if(this.formGroup.value.objectType == 2 && this.hasParentTrainingTopic) {
            this.service.findImportByTargetThorough(this.formGroup.value).subscribe(res => {
                if(res.data) {
                    this.dataToLoadIntoForm = res.data;
                    this.loadDataIntoForm.next(res.data);
                }
            })
        }
    }
    submitToApprove() {
        this.app.confirmMessage('training-topic.message.confirm.submit',
            () => {
                this.service.submitToApprove(this.formGroup.value["trainingTopicId"])
                    .subscribe(res => {
                        if (res.code == "success") {
                            this.router.navigateByUrl('/employee/training-topic');
                        }
                    });
            },
            () => {
            }
        )
    }

    submitToThorough() {
        this.app.confirmMessage('training-topic.message.confirm.thorough',
            () => {
                this.service.submitToThorough(this.formGroup.value["trainingTopicId"])
                    .subscribe(res => {
                        if (res.code == "success") {
                            this.router.navigateByUrl('/employee/training-topic');
                        }
                    });
            },
            () => {
            }
        )
    }

    save() {
        this.formGroup.value.trainingTopicOrgIds = this.formGroup.controls['trainingTopicOrgIds'].value
        this.formGroup.value.fileAttachedList = this.formGroup.controls['fileAttachedList'].value
        this.formGroup.value.objectTypeTraining = this.formGroup.controls['objectTypeTraining'].value
        if (!CommonUtils.isValidForm(this.formGroup) || this.validateStartDate() || this.validateFinishNumberDate() || this.validateEndDate() || this.validateStartDateForQuickDeploy() ||  !this.formGroup.controls['objectTypeTraining']) {
            return;
        }
        if (this.formGroup.value.kpiGood && this.formGroup.value.kpiAverage && this.formGroup.value.kpiExcellent) {
            if(parseFloat(this.formGroup.value.kpiGood) + parseFloat(this.formGroup.value.kpiExcellent) > parseFloat(this.formGroup.value.kpiAverage)) {
                this.app.warningMessage("training-topic.kpi");
                return;
            }
        }

        this.formGroup.value.endDate = this.formGroup.value['endDate'] instanceof Date ? this.formGroup.value['endDate'].getTime() : this.formGroup.value['endDate'];
        this.formGroup.value.startDate = this.formGroup.value['startDate'] instanceof Date ? this.formGroup.value['startDate'].getTime() : this.formGroup.value['startDate'];
        this.formGroup.value.finishNumberDate = this.formGroup.value['finishNumberDate'] instanceof Date ? this.formGroup.value['finishNumberDate'].getTime() : this.formGroup.value['finishNumberDate'];
        if (this.formGroup.value.parentId) {
            this.service.getChildOrganziation(this.formGroup.value.parentId, this.formGroup.value.trainingTopicId ? this.formGroup.value.trainingTopicId : -1).subscribe(res => {
                if (res.data) {
                    res.data = res.data.map(item => item.toString());
                    const listOrg = this.formGroup.value.trainingTopicOrgIds;
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
                if(this.formGroup.value.objectType != 2) {
                    this.service.saveOrUpdateFormFile(this.formGroup.value)
                        .subscribe(res => {
                            // if (res.code == "success" && history.state.thoroughContentId) {
                            //   this.router.navigateByUrl('/employee/thorough-content/view', { state: this.formGroup.value });
                            // } else if (res.code == "success") {
                            //   this.router.navigateByUrl('/employee/thorough-content');
                            // }
                            if (res.code == "success") {
                                if (this.formGroup.value.objectType != 2) {
                                    this.router.navigateByUrl(`/employee/training-topic/view/${res.data.trainingTopicId}`)
                                } else {
                                    this.saveDataImport.next(res);
                                }
                            }
                        });
                } else {
                    this.saveDataImport.next(this.formGroup.value);
                }
            },
            () => {
            }
        )
        // }
    }

    onChangeObjectType() {
        this.formGroup.controls['objectTypeTraining'].setValue([]);
    }

    navigate(trainingTopicId) {
        this.router.navigateByUrl(`/employee/training-topic/create-update/${trainingTopicId}`);
    }

    cloneFormGroup(formGroup: FormGroup): FormGroup {
        const copiedControls = {};
        Object.keys(formGroup.controls).forEach(controlName => {
            const control = formGroup.controls[controlName];
            copiedControls[controlName] = new FormControl(control.value);
        });
        return new FormGroup(copiedControls);
    }


    validateStartDate() {
            const startDate = this.formGroup.value['startDate'];
            const year = this.formGroup.get('year').value;
            const firstDayOfYear = new Date(year, 0, 1);  // January
            const lastDayOfYear = new Date(year, 11, 31);  // December

            if (startDate < firstDayOfYear.getTime() || startDate >= lastDayOfYear.getTime()) {
                return true;
            }
            return false;
    }

    validateEndDate() {
            if(this.formGroup.value['endDate']) {
                const endDate =  this.formGroup.value['endDate'];
                const year = this.formGroup.get('year').value;
                const startDate = this.formGroup.get('startDate').value
                const lastDayOfYear = new Date(year, 11, 31);  // December

                if (endDate <startDate|| endDate > lastDayOfYear.getTime()) {
                    return true;
                }
            }
            return false;
    }

    validateEndDateHaveParent() {
        if(this.parentEndDate && this.hasParentTrainingTopic && this.formGroup.value['endDate']) {
            const endDate =  this.formGroup.value['endDate'];
            if (endDate > this.parentEndDate) {
                return true;
            }
        }
        return false;
    }

    validateStartDateForQuickDeploy() {
        if(this.router.url.includes('/employee/training-topic/quick-deploy') && this.formGroup.get('startDate').value) {
            const startDate = this.formGroup.get('startDate').value
            if(startDate < this.parentStartDate) {
                return true;
            }
        }
        return false;
    }
    validateFinishNumberDate() {
        if( this.formGroup.get('finishNumberDate').value) {
            const finishNumberDate =  this.formGroup.get('finishNumberDate').value;
            const endDate = this.formGroup.get('endDate').value;
            const startDate = this.formGroup.get('startDate').value
            if (endDate <finishNumberDate|| startDate > finishNumberDate) {
                return true;
            }
        }

        return false;
    }
    validateFinishNumberDateHaveParent() {
        if(this.parentFinishNumberDate && this.hasParentTrainingTopic && this.formGroup.value['finishNumberDate']) {
            const finishNumberDate =  this.formGroup.value['finishNumberDate'];
            if (finishNumberDate > this.parentFinishNumberDate) {
                return true;
            }
        }
        return false;
    }

    public setDataToForm(res) {
        this.dataToLoadIntoForm = res;
        this.loadDataIntoForm.next(res.data);
    }


}
