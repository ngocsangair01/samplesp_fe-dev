import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "@app/shared/components/base-component/base-component.component";
import {CommonUtils, ValidationService} from "@app/shared/services";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS, OrganizationService} from "@app/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AssessmentFormulaService} from "../../../core/services/assessment-formula/assessment-formula.service";
import {CompetitionProgramService} from "@app/core/services/competition-program/competition-program.service";
import {AppParamService} from "../../../core/services/app-param/app-param.service";
import {DialogService} from "primeng/api";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
    EmployeesRegistrationListService
} from "@app/core/services/employee-registration-list/employees-registration-list.service";
import {FileControl} from "../../../core/models/file.control";
import {AppComponent} from "@app/app.component";
import {UnitRegistrationService} from "@app/core/services/unit-registration/unit-registration.service";
import {RewardProposeService} from "@app/core/services/reward-propose/reward-propose.service";
import {
    VofficeSigningPreviewModalComponent
} from "@app/modules/voffice-signing/preview-modal/voffice-signing-preview-modal.component";
import {
    VofficeSigningPreviewModalComponentWithoutWatermark
} from "@app/modules/voffice-signing/preview-modal-without-watermark/voffice-signing-preview-modal.component-without-watermark";
import {
    CommitToComplyTetFormSendComponent
} from "@app/modules/commit-to-comply-tet/commit-to-comply-tet-form-send/commit-to-comply-tet-form-send.component";

@Component({
    selector: 'commit-to-comply-tet-form',
    templateUrl: './commit-to-comply-tet-form.component.html',
    styleUrls: ['./commit-to-comply-tet-form.component.css']
})
export class CommitToComplyTetFormComponent extends BaseComponent implements OnInit {
    formSave: FormGroup;
    view: boolean;
    update: boolean;
    firstTitle: any;
    lastTitle: any;
    searchTitle: any;
    requiredTab: any;
    competitionProgramType: any;
    competitionProgramSubject: any;
    listApplicableUnit: any;
    competitionProgramCriteria: any;
    rewardTypeList: any;
    rewardTypeListByUser: any;
    applicableOrgCss: boolean;
    applicableTypeAnnual: boolean;
    applicableSubjectCss: boolean;
    type: String;
    listYear: any;
    checkTypeCP: boolean;
    formConfig = {
        competitionId: [''],
        competitionCode: [''],
        competitionName: ['', Validators.required],
        competitionType: [''],
        messageCompetition: ['', Validators.required],
        publisherUnitCode: ['', Validators.required],
        competitionTitleCode: [''],
        subjectType: ['', Validators.required],
        rewardType: [''],
        competitionMethodCode: [''],
        applicableOrg: [''],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
        applicableSubject: [''],
        content: [''],
        target: [''],
        emulationQuota: [''],
        implementationOrganization: [''],
        missionOfOrganization: [''],
        subjectCode: [''],
        subjectCodeType: [''],
        year: ['', Validators.required],
    }
    // khai báo cho tab Đối tượng cần đăng ký thi đua
    formSearch: FormGroup;
    competitionProgramStatusEmp: any;
    checkedId: string[] = [];
    checkedIdLead: string[] = [];
    checkAll = false;
    eventLoad: any;
    formConfigEmpSearch = {
        organizationId: [''],
        employeeId: [''],
        statusEmp: [''],
        applicableOrg: [''],
        competitionCode: [''],
        checkLead: [''],
        subjectCode: [''],
        subjectCodeType: [''],
        isLongLeave: [''],
        startTime: [''],
        endTime: [''],
        orgSelection: [''],
        competitionProgramId: [''],
    }

    constructor(
        private router: Router,
        public actr: ActivatedRoute,
        private activatedRoute: ActivatedRoute,
        public a: AssessmentFormulaService,
        private competitionProgramService: CompetitionProgramService,
        private appParamService: AppParamService,
        private unitRegistrationService: UnitRegistrationService,
        public dialogService: DialogService,
        private modalService: NgbModal,
        private employeesRegistrationListService: EmployeesRegistrationListService,
        private organizationService: OrganizationService,
        private app: AppComponent,
        private fb: FormBuilder,
        private rewardProposeService: RewardProposeService,
    ) {
        // Check quyền cho component
        super(null, CommonUtils.getPermissionCode("CTCT_BVAN_TET_COMMIT"));
        const params = this.activatedRoute.snapshot.params;
        if (params && CommonUtils.isValidId(params.type)) {
            this.type = params.type;
        }
        // check type
        const function1 = this.activatedRoute.snapshot.routeConfig.path.split('/')[0];
        if (function1 == 'edit') {
            this.update = true;
            this.view = false;
        } else if (function1 == 'view') {
            this.view = true;
            this.update = false;
        } else if (function1 == 'create') {
            this.view = false;
            this.update = false;
        }

        this.applicableTypeAnnual = true;

        this.setMainService(employeesRegistrationListService)

        //lấy danh sách lĩnh vực khen thưởng
        this.rewardTypeList = APP_CONSTANTS.REWARD_GENERAL_TYPE_LIST;

        // get loại chương trình thi đua
        this.appParamService.appParams('COMPETITION_TYPE').subscribe(res => {
            this.competitionProgramType = res.data
        })

        // get loại đối tượng
        this.appParamService.appParams('OBJECT_TYPE').subscribe(res => {
            this.competitionProgramSubject = res.data
        })

        // get bộ lọc trạng thái ( tab Đối tượng cần đăng ký thi đua )
        this.competitionProgramStatusEmp = [
            {
                itemValue: 1,
                itemName: 'Dự Thảo',
            },
            {
                itemValue: 0,
                itemName: 'Chưa đăng ký'
            },
            {
                itemValue: 2,
                itemName: 'Chờ duyệt'
            },
            {
                itemValue: 3,
                itemName: 'Bị từ chối'
            },
            {
                itemValue: 4,
                itemName: 'Đã duyệt'
            }
        ]

        this.listYear = this.getYearList();
        this.checkTypeCP = false;
        this.searchTitle = "ui-g-12 ui-lg-1 control-label vt-align-right";


        // check data form
        if (this.view || this.update) {
            this.competitionProgramService.findOne(Number(this.activatedRoute.snapshot.paramMap.get('competitionId'))).subscribe(res => {
                this.buildForms(res.data);
                if(res.data.subjectType === "ORGANIZATION"){
                    this.checkTypeCP = true;
                    this.searchTitle = "ui-g-12 ui-lg-2 control-label vt-align-right";
                }

                this.applicableTypeAnnual = !(res.data.competitionType && res.data.competitionType == 'UNEXPECTED_COMPETITION');
            });
        } else {
            this.buildForms({});
        }
        this.formSearch = this.buildForm({}, this.formConfigEmpSearch);
        this.formSearch.controls['organizationId'] = new FormArray([]);
    }

    ngOnInit() {
        if (this.view) {
            this.firstTitle = 'ui-g-12 ui-md-6 ui-lg-2 control-label vt-align-right';
            this.lastTitle = 'ui-g-12 ui-md-6 ui-lg-3 control-label vt-align-right';
        } else {
            this.firstTitle = 'ui-g-12 ui-md-6 ui-lg-2 control-label vt-align-right required';
            this.lastTitle = 'ui-g-12 ui-md-6 ui-lg-3 control-label vt-align-right required';
            this.requiredTab = 'required';
        }

        this.rewardProposeService.getRewardTypeListForCompetition().subscribe(res => {
            this.rewardTypeListByUser = this.rewardTypeList.filter((item) => {
                return res.includes(item.id)
            })
        })
    }

    // tab Đối tượng cần đăng ký thi đua
    get f_emp() {
        return this.formSearch.controls;
    }

    get f() {
        return this.formSave.controls;
    }

    private getYearList() {
        this.listYear = [];
        const currentYear = new Date().getFullYear();
        for (let i = (currentYear - 2); i <= (currentYear + 10); i++) {
            const obj = {
                year: i
            };
            this.listYear.push(obj);
        }
        return this.listYear;
    }

    public buildForms(data?: any) {
        if (data.subjectType === 'ORGANIZATION') {
            this.applicableOrgCss = true;
        } else if (data.subjectType === 'INDIVIDUAL') {
            this.applicableSubjectCss = true;
        } else if (data.subjectType === 'ALL') {
            this.applicableOrgCss = true;
            this.applicableSubjectCss = true;
        }
        this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT);
        this.formSave.controls['applicableSubject'] = new FormArray([]);
        if (this.view || this.update) {

            // get danh sách hình thức khen thưởng
            this.unitRegistrationService.geRewards({
                rewardObjectType: this.formSave.get('subjectType').value,
                rewardType: this.formSave.get('rewardType').value
            }).subscribe(res => {
                this.competitionProgramCriteria = res
            })
            // get danh sách danh hiệu thi đua
            this.unitRegistrationService.getTitles({
                rewardObjectType: this.formSave.get('subjectType').value,
                rewardType: this.formSave.get('rewardType').value
            }).subscribe(res => {
                this.listApplicableUnit = res.data
            })
            if (data.applicableOrg && data.applicableOrg.length != 0) {
                this.formSave.controls['applicableOrg'].setValue(data.applicableOrg, FormArray)
                this.formSave.setControl('applicableOrg', this.fb.array(data.applicableOrg.map(item => item) || []));
            } else {
                this.formSave.controls['applicableOrg'] = new FormArray([]);
            }
            if (!data.subject) {
                data.subject = [];
                data.subject[0] = {};
            }
            data.subject[0]['startTime'] = data.startTime;
            data.subject[0]['endTime'] = data.endTime;
            this.formSave.setControl('applicableSubject', this.fb.array(data.subject.map(item => item) || []));
            if (data.subjectCodeType && data.subjectCodeType.length != 0) {
                if (data.subjectCodeType[0] != 'imported') { // truong hop khong phai la import
                    data.subject = [];
                    data.subject[0] = {};
                }
                const convertSubjectCodeType = []
                for (let rec in data.subjectCodeType) {
                    if (data.subjectCodeType[rec] == 481) {
                        convertSubjectCodeType.push('HSQ/BS')
                    } else if (data.subjectCodeType[rec] == 482) {
                        convertSubjectCodeType.push('SQ')
                    } else if (data.subjectCodeType[rec] == 483) {
                        convertSubjectCodeType.push('SQDB')
                    } else if (data.subjectCodeType[rec] == 484) {
                        convertSubjectCodeType.push('CN')
                    } else if (data.subjectCodeType[rec] == 485) {
                        convertSubjectCodeType.push('CNVQP')
                    } else if (data.subjectCodeType[rec] == 486) {
                        convertSubjectCodeType.push('Hợp đồng')
                    } else if (data.subjectCodeType[rec] == 'imported') {
                        convertSubjectCodeType.push('imported')
                    }
                }
                data.subject[0]['subjectSelectionType'] = convertSubjectCodeType;
                data.subject[0]['startTime'] = data.startTime;
                data.subject[0]['endTime'] = data.endTime;
                data.subject[0]['isLongLeave'] = data.isLongLeave;
                data.subject[0]['orgSelection'] = data.orgSelection;
                this.formSave.setControl('applicableSubject', this.fb.array(data.subject.map(item => item) || []));
            }
            // else {
            //   this.formSave.controls['applicableSubject'] = new FormArray([]);
            // }
            // get đơn vị ban hành
            // this.organizationService.findById(this.formSave.get('publisherUnitCode').value).subscribe(res => {
            //     this.publisherOrgId = this.formSave.get('publisherUnitCode').value;
            //     this.formSave.get('publisherUnitCode').setValue(res.data.name);
            // })
            if (this.view || this.update) {
                // this.setListEmployee()
                this.searchEmployeeAccepted()
            }
        } else {
            // get đơn vị ban hành
            // const userToken = HrStorage.getUserToken();
            // this.publisherOrgId = userToken.userInfo.organizationId;
            // this.organizationService.findById(this.publisherOrgId).subscribe(res => {
            //     this.formSave.get('publisherUnitCode').setValue(res.data.name);
            // })

            this.formSave.controls['applicableOrg'] = new FormArray([]);
            this.formSave.controls['applicableSubject'] = new FormArray([]);
        }
        const fileAttachment = new FileControl(null);
        if (data && data.fileAttachment) {
            if (data.fileAttachment.fileAttachment) {
                fileAttachment.setFileAttachment(data.fileAttachment.fileAttachment);
            }
        }
        this.formSave.addControl('fileAttachment', fileAttachment);
        const fileTemplate = new FileControl(null);
        if (data && data.fileAttachment) {
            if (data.fileAttachment.fileTemplate) {
                fileTemplate.setFileAttachment(data.fileAttachment.fileTemplate);
            }
        }
        this.formSave.addControl('fileTemplate', fileTemplate);
    }

    public goBack() {
        this.router.navigate(['/commit-to-comply-tet']);
    }

    public goView(competitionId: any) {
        debugger
        this.router.navigate([`/commit-to-comply-tet/view/commit-to-comply-tet/${competitionId}`]);
    }

    // link sang màn đăng ký cuả đơn vị
    // viewDetailUnitRegistration(item: any) {
    //     this.router.navigate(['/competition-unit-registration', 'view', item.competitionRegistrationId])
    // }

    handleBr5(): boolean {

        let isInvalid = false;

        if (!this.applicableTypeAnnual && CommonUtils.isNullOrEmpty(this.formSave.get('competitionMethodCode').value)) {
            // this.formSave.controls['competitionMethodCode'].setErrors({requiredOneOrAllHandleBr5: true});
            this.formSave.controls['competitionMethodCode'].setErrors({required: true});
            isInvalid = true;
        } else {
            this.formSave.get('competitionTitleCode').setErrors(null);
            this.formSave.get('competitionMethodCode').setErrors(null);
        }

        this.formSave.controls['competitionTitleCode'].markAsTouched();
        this.formSave.controls['competitionMethodCode'].markAsTouched();

        return isInvalid;
    }

    handleBr8(): boolean {
        let isInvalid = false;
        if (this.formSave.get('subjectType').value === "ALL") {
            if ((this.formSave.get('applicableSubject').value.length > 0 && this.formSave.get('applicableSubject').value[0].subjectSelectionType != undefined && this.formSave.get('applicableSubject').value[0].subjectSelectionType.length > 0)
                || this.formSave.get('applicableOrg').value.length > 0) {
                this.formSave.get('applicableSubject').setErrors(null);
                this.formSave.get('applicableOrg').setErrors(null);
            } else {
                isInvalid = true;
                this.formSave.controls['applicableSubject'].setErrors({requiredOneOrAllHandleBr8: true});
                this.formSave.controls['applicableOrg'].setErrors({requiredOneOrAllHandleBr8: true});
            }
            this.formSave.controls['applicableSubject'].markAsTouched();
            this.formSave.controls['applicableOrg'].markAsTouched();
        }
        return isInvalid;
    }

    requiredRewardAndSubject(): boolean {

        let isInvalid = false;

        if (CommonUtils.isNullOrEmpty(this.formSave.get('rewardType').value)) {
            this.formSave.controls['competitionTitleCode'].setErrors({requiredRewardAndSubject: true});
            isInvalid = true;
        } else if (CommonUtils.isNullOrEmpty(this.formSave.get('subjectType').value)) {
            this.formSave.controls['competitionMethodCode'].setErrors({requiredRewardAndSubject: true});
            isInvalid = true;
        } else {
            this.formSave.get('competitionTitleCode').setErrors(null);
            this.formSave.get('competitionMethodCode').setErrors(null);
        }

        this.formSave.controls['competitionTitleCode'].markAsTouched();
        this.formSave.controls['competitionMethodCode'].markAsTouched();

        return isInvalid;
    }

    public processSaveOrUpdate() {
        let isInvalid = false;
        this.onChangeSubjecTypeNoResetData()
        if (this.update) {
            if (this.formSave.get('subjectType').value == 'INDIVIDUAL' && this.formSave.get('applicableSubject').value[0].subjectSelectionType == undefined) {
                isInvalid = true
            }
        }

        if (this.formSave.get('subjectType').value == 'INDIVIDUAL') {
            if (this.formSave.get('applicableSubject').value[0] &&
                this.formSave.get('applicableSubject').value[0]['subjectSelectionType'] &&
                this.formSave.get('applicableSubject').value[0]['subjectSelectionType'].length > 0) {
                this.formSave.controls['applicableSubject'].setErrors(null);
            } else {
                this.formSave.controls['applicableSubject'].setErrors({required: true});
                isInvalid = true;
            }
            this.formSave.controls['applicableSubject'].markAsTouched();
        }

        if (!this.view
            && !this.update
            && this.formSave.get('subjectType').value == 'INDIVIDUAL'
            && (this.formSave.get('applicableSubject').value[0] == undefined
                || this.formSave.get('applicableSubject').value[0].subjectSelectionType == undefined)) {
            isInvalid = true
        }

        if ((this.formSave.get('endTime').value - this.formSave.get('startTime').value) < 0) {
            isInvalid = true
            this.app.warningMessage('competitionProgram.checkStartTimeEndTime');
        }
        // validate BR5 & BR8
        if (this.handleBr5()) {
            isInvalid = true;
        }

        if (this.handleBr8()) {
            isInvalid = true;
        }

        if (!CommonUtils.isValidForm(this.formSave)) {
            isInvalid = true;
        }

        if (!this.formSave.get('fileTemplate').value) {
            isInvalid = true
            this.formSave.controls['fileTemplate'].setErrors({required: true});
        }

        if (isInvalid) return;

        this.formSave.value['applicableOrg'] = this.formSave.get('applicableOrg').value;
        this.formSave.value['applicableSubject'] = this.formSave.get('applicableSubject').value;
        const convertSubjectCodeType = []
        if (this.formSave.get('applicableSubject').value.length > 0 && this.formSave.get('applicableSubject').value[0]['subjectSelectionType'] != null) {
            for (let rec in this.formSave.get('applicableSubject').value[0]['subjectSelectionType']) {
                if (this.formSave.get('applicableSubject').value[0]['subjectSelectionType'][rec] == 'HSQ/BS') {
                    convertSubjectCodeType.push(481)
                } else if (this.formSave.get('applicableSubject').value[0]['subjectSelectionType'][rec] == 'SQ') {
                    convertSubjectCodeType.push(482)
                } else if (this.formSave.get('applicableSubject').value[0]['subjectSelectionType'][rec] == 'SQDB') {
                    convertSubjectCodeType.push(483)
                } else if (this.formSave.get('applicableSubject').value[0]['subjectSelectionType'][rec] == 'CN') {
                    convertSubjectCodeType.push(484)
                } else if (this.formSave.get('applicableSubject').value[0]['subjectSelectionType'][rec] == 'CNVQP') {
                    convertSubjectCodeType.push(485)
                } else if (this.formSave.get('applicableSubject').value[0]['subjectSelectionType'][rec] == 'Hợp đồng') {
                    convertSubjectCodeType.push(486)
                } else if (this.formSave.get('applicableSubject').value[0]['subjectSelectionType'][rec] == 'imported') {
                    convertSubjectCodeType.push('imported')
                }
            }
        }
        this.app.confirmMessage(null, () => { // on accepted
            let data = {
                competitionId: this.formSave.get('competitionId').value ? this.formSave.get('competitionId').value : '', // Id chương trình thi đua
                competitionCode: this.formSave.get('competitionCode').value ? this.formSave.get('competitionCode').value : '', // Code chương trình thi đua
                competitionName: this.formSave.get('competitionName').value ? this.formSave.get('competitionName').value : '', // Tên chương trình thi đua
                competitionType: this.formSave.get('competitionType').value ? this.formSave.get('competitionType').value : '', // Loại chương trình thi đua
                messageCompetition: this.formSave.get('messageCompetition').value ? this.formSave.get('messageCompetition').value : '', // Chủ đề thi đua
                publisherUnitCode: this.formSave.get('publisherUnitCode').value ? this.formSave.get('publisherUnitCode').value : '', // Đon vị ban hành
                competitionTitle: this.formSave.get('competitionTitleCode').value ? this.formSave.get('competitionTitleCode').value : '', // Danh hiệu thi đua
                subjectType: this.formSave.get('subjectType').value ? this.formSave.get('subjectType').value : '', // Loại đối tượng
                methodCode: this.formSave.get('competitionMethodCode').value ? this.formSave.get('competitionMethodCode').value : '', // Hình thức
                rewardType: this.formSave.get('rewardType').value ? this.formSave.get('rewardType').value : '', // Lĩnh vực khen thưởng
                startTime: this.formSave.get('startTime').value ? this.formSave.get('startTime').value : '', // Thời gian bắt đầu của chương trình thi đua
                endTime: this.formSave.get('endTime').value ? this.formSave.get('endTime').value : '', // Thời gian kết thúc của chương trình thi đua
                unitCode: this.formSave.get('applicableOrg').value ? this.formSave.get('applicableOrg').value : '', // Đon vị áp dụng
                subject: this.formSave.get('applicableSubject').value ? this.formSave.get('applicableSubject').value : '', // Object đối tượng áp dụng
                subjectCodeType: this.formSave.get('applicableSubject').value.length > 0 && this.formSave.get('applicableSubject').value[0]['subjectSelectionType'] != null ? convertSubjectCodeType : '', // Loại đối tượng áp dụng
                isLongLeave: this.formSave.get('applicableSubject').value.length > 0 && this.formSave.get('applicableSubject').value[0]['isLongLeave'] != null ? this.formSave.get('applicableSubject').value[0]['isLongLeave'] : '', // Bao gom nghi dai ngay
                orgSelection: this.formSave.get('applicableSubject').value.length > 0 && this.formSave.get('applicableSubject').value[0]['orgSelection'] != null ? this.formSave.get('applicableSubject').value[0]['orgSelection'] : '', // Đơn vị áp dụng trong đối tượng áp dụng
                content: this.formSave.get('content').value ? this.formSave.get('content').value : '', // Nội dung thi đua
                target: this.formSave.get('target').value ? this.formSave.get('target').value : '', // Mục tiêu
                emulationQuota: this.formSave.get('emulationQuota').value ? this.formSave.get('emulationQuota').value : '', // Chỉ tieu thi đua
                implementationOrganization: this.formSave.get('implementationOrganization').value ? this.formSave.get('implementationOrganization').value : '', // Tổ chức thục hiện
                missionOfOrganization: this.formSave.get('missionOfOrganization').value ? this.formSave.get('missionOfOrganization').value : '', // Nhiệm vu cua to chuc
                year: this.formSave.get('year').value ? this.formSave.get('year').value : '',
                programType: 2, //  Cam kết chấp hành quy định Tết
            }

            if (this.formSave.get('fileAttachment').value) {
                data['files'] = this.formSave.get('fileAttachment').value; // file attachment
            }

            if (this.formSave.get('fileTemplate').value) {
                data['fileTemplate'] = this.formSave.get('fileTemplate').value; // file template
            }

            const function1 = this.activatedRoute.snapshot.routeConfig.path.split('/')[0]
            if (function1 == 'edit') {
                Object.assign(data, {competitionId: Number(this.activatedRoute.snapshot.paramMap.get('competitionId'))});
            }
            this.competitionProgramService.saveOrUpdateFormFile(data)
                .subscribe(res => {
                    this.goView(res.data.competitionId);
                });
        }, () => {

        });

    }

    // gán giá trị cho params
    setValueFormSearch() {
        this.formSearch.get('checkLead').setValue(this.checkAll ? 1 : 0)
        this.formSearch.get('employeeId').setValue(this.formSearch.get('employeeId') && this.formSearch.get('employeeId').value !== "" ? this.formSearch.get('employeeId').value : null)
        this.formSearch.get('statusEmp').setValue(this.formSearch.get('statusEmp') && this.formSearch.get('statusEmp').value !== "" ? this.formSearch.get('statusEmp').value : null)
        this.formSearch.get('applicableOrg').setValue((this.formSave.get('applicableOrg').value) as string)
        this.formSearch.get('competitionCode').setValue(this.formSave.get('competitionCode').value)
        this.formSearch.get('subjectCode').setValue((this.formSave.get('subjectCode').value) as string)
        this.formSearch.get('subjectCodeType').setValue((this.formSave.get('subjectCodeType').value) as string)
        this.formSearch.get('isLongLeave').setValue(this.formSave.get('applicableSubject').value.length > 0 && this.formSave.get('applicableSubject').value[0]['isLongLeave'] != null ? this.formSave.get('applicableSubject').value[0]['isLongLeave'] : 0,)
        this.formSearch.get('orgSelection').setValue(this.formSave.get('applicableSubject').value.length > 0 && this.formSave.get('applicableSubject').value[0]['orgSelection'] != null ? this.formSave.get('applicableSubject').value[0]['orgSelection'] : null,)
        this.formSearch.get('startTime').setValue(this.formSave.get('startTime').value)
        this.formSearch.get('endTime').setValue(this.formSave.get('endTime').value)
        this.formSearch.get('competitionProgramId').setValue(this.formSave.get('competitionId').value)
    }

    // search đối tượng cần đăng ký
    searchEmployeeAccepted(event?) {
        this.setListEmployee()
        this.formSearch.get('organizationId').setValue((this.formSearch.get('organizationId').value) as string)
        this.setValueFormSearch()
        this.processSearch(event)
    }

    previewFileIcon(item) {
        if (item.competitionRegistrationStatus === 'APPROVE') {
            const modalRef = this.modalService.open(VofficeSigningPreviewModalComponentWithoutWatermark,
                {size: 'lg', backdrop: 'static', windowClass: 'modal-xxl2', keyboard: false});
            modalRef.componentInstance.id = item.signDocumentId;
        } else {
            const modalRef = this.modalService.open(VofficeSigningPreviewModalComponent,
                {size: 'lg', backdrop: 'static', windowClass: 'modal-xxl2', keyboard: false});
            modalRef.componentInstance.id = item.signDocumentId;
        }
    }

    setListEmployee() {
        this.employeesRegistrationListService.sendListEmployeeChecked({
            listEmployeeLeadChecked: this.checkedIdLead,
            listEmployeeChecked: this.checkedId,
            checkedAll: this.checkAll ? 1 : 0
        }).subscribe(res => {
        })
    }

    // change checkbox in thead
    changeLeadSendMessage(event) {
        var emp_checked
        if (event.currentTarget.checked) {
            emp_checked = 1
            this.checkAll = true
        } else {
            emp_checked = 0
            this.checkAll = false
        }
        if (this.checkAll) {
            for (let property in this.resultList.data) {
                if (emp_checked && !this.checkedId.includes(this.resultList.data[property].employeeCode) && this.resultList.data[property].type == "Cá nhân") {
                    this.checkedId.push(this.resultList.data[property].employeeCode)
                } else if (emp_checked && !this.checkedIdLead.includes(this.resultList.data[property].employeeCode) && this.resultList.data[property].type == "Tập thể") {
                    this.checkedIdLead.push(this.resultList.data[property].employeeCode)
                }
            }
        } else {
            for (let property in this.resultList.data) {
                if (this.resultList.data[property].type == "Cá nhân") {
                    var index = this.checkedId.indexOf(this.resultList.data[property].employeeCode)
                    if (index > -1) {
                        this.checkedId.splice(index, 1)
                    }
                } else if (this.resultList.data[property].type == "Tập thể") {
                    this.checkedIdLead.push(this.resultList.data[property].employeeCode)
                    var index = this.checkedIdLead.indexOf(this.resultList.data[property].employeeCode)
                    if (index > -1) {
                        this.checkedIdLead.splice(index, 1)
                    }
                }
            }
        }
        this.searchEmployeeAccepted()
    }

    // change checkbox in tbody
    changeMessage(event, item) {
        if (item.type == "Cá nhân") {
            if (event.currentTarget.checked && !this.checkedId.includes(item.employeeCode)) {
                item.checkedEmp = 1
                this.checkedId.push(item.employeeCode)
            } else {
                this.checkAll = false
                item.checkedEmp = 0
                this.checkedId.splice(this.checkedId.indexOf(item.employeeCode), 1)
            }
        } else {
            if (event.currentTarget.checked && !this.checkedIdLead.includes(item.employeeCode)) {
                item.checkedEmp = 1
                this.checkedIdLead.push(item.employeeCode)
            } else {
                this.checkAll = false
                item.checkedEmp = 0
                this.checkedIdLead.splice(this.checkedIdLead.indexOf(item.employeeCode), 1)
            }
        }
    }

    // mở popup
    sendMessage() {
        if (new Date().getTime() < this.formSave.get('startTime').value || new Date().getTime() > new Date(new Date(this.formSave.get('endTime').value).getTime() + (1000 * 60 * 60 * 24)).getTime()) {
            this.app.warningMessage('', 'Không trong thời gian đăng ký!');
        } else if (this.checkAll && this.checkedId.concat(this.checkedIdLead).length == 0) {
            this.app.warningMessage('', 'Hệ thống đang xử lý, xin hãy chờ!');
        } else if (this.checkedId.concat(this.checkedIdLead).length == 0) {
            this.app.warningMessage('', 'Bạn phải chọn nhân viên để gửi thông báo!');
        } else {
            const ref = this.dialogService.open(CommitToComplyTetFormSendComponent, {
                header: 'GỬI NHẮC NHỞ ĐĂNG KÝ THI ĐUA',
                width: '50%',
                baseZIndex: 2000,
                contentStyle: {"padding": "0"},
                data: {
                    'checkedId': this.checkedId.concat(this.checkedIdLead),
                    'competitionProgramId': Number(this.activatedRoute.snapshot.paramMap.get('competitionId'))
                }
            });
            ref.onClose.subscribe((isChange) => {
                if (isChange) {
                    this.checkedId = []
                    this.checkedIdLead = []
                    this.checkAll = false
                    this.searchEmployeeAccepted()
                }
            });
        }
    }

    public onChangeCompetitionType() {

        this.applicableTypeAnnual = !(this.formSave.get('competitionType').value && this.formSave.get('competitionType').value == 'UNEXPECTED_COMPETITION');

        // xóa dữ liệu đã chọn khi đổi loại chương trình
        if (this.applicableTypeAnnual) {
            this.formSave.get('competitionMethodCode').setValue(null)
        } else {
            this.formSave.get('competitionTitleCode').setValue(null)
        }
    }

    public onChangeRewardType(){
        // xóa dữ liệu đã chọn khi đổi loại đối tượng
        this.formSave.get('competitionTitleCode').setValue(null)
        this.formSave.get('competitionMethodCode').setValue(null)

        this.formSave.get('competitionTitleCode').setErrors(null);
        this.formSave.get('competitionMethodCode').setErrors(null);

        this.listApplicableUnit = []
        this.competitionProgramCriteria = []

        if (this.formSave.get('subjectType').value) {

            if (this.formSave.get('rewardType').value) {

                // get danh sách danh hiệu thi đua
                this.unitRegistrationService.getTitles({
                    rewardObjectType: this.formSave.get('subjectType').value,
                    rewardType: this.formSave.get('rewardType').value
                }).subscribe(res => {
                    this.listApplicableUnit = res.data
                })

                // get danh sách hình thức khen thưởng
                this.unitRegistrationService.geRewards({
                    rewardObjectType: this.formSave.get('subjectType').value,
                    rewardType: this.formSave.get('rewardType').value
                }).subscribe(res => {
                    this.competitionProgramCriteria = res
                })
            }

            this.onChangeSubjecTypeNoResetData()
        }
    }

    public onChangeSubjectType() {
        this.onChangeRewardType();
        this.resultList = {
            data : []
        }

    }

    public onChangeSubjecTypeNoResetData() {
        if (this.formSave.get('subjectType').value == 'INDIVIDUAL') {
            // BR6
            if (!this.view && !this.update) {
                this.formSave.get('applicableSubject').setValidators([Validators.required]);
            } else if (this.formSave.get('applicableSubject').value &&
                this.formSave.get('applicableSubject').value.length > 0 &&
                this.formSave.get('applicableSubject').value[0].subjectSelectionType == undefined) {
                this.formSave.get('applicableSubject').setValidators([Validators.required]);
            }
            this.applicableSubjectCss = true;
            this.applicableOrgCss = false;
            this.formSave.get('applicableOrg').setValidators(null);
            CommonUtils.clearFormArray(this.formSave.get('applicableOrg') as FormArray);
        } else if (this.formSave.get('subjectType').value == 'ORGANIZATION') {
            // BR 7
            this.applicableSubjectCss = false;
            this.formSave.get('applicableSubject').setValidators(null);
            this.applicableOrgCss = true;
            this.formSave.get('applicableOrg').setValidators([Validators.required]);
            this.formSave.setControl('applicableSubject', this.fb.array([{}]));
            this.formSave.get('applicableSubject').value[0].startTime = this.formSave.get('startTime').value
            this.formSave.get('applicableSubject').value[0].endTime = this.formSave.get('endTime').value
        } else if (this.formSave.get('subjectType').value == 'ALL') {
            this.applicableSubjectCss = true;
            this.formSave.get('applicableSubject').setValidators(null);
            this.applicableOrgCss = true;
            this.formSave.get('applicableOrg').setValidators(null);
        }
        this.formSave.controls['applicableSubject'].updateValueAndValidity();
        this.formSave.controls['applicableOrg'].updateValueAndValidity();
    }

    handleChangeTime() {
        if (this.formSave.get('applicableSubject').value.length == 0) {
            this.formSave.setControl('applicableSubject', this.fb.array([{}]));
        }
        this.formSave.get('applicableSubject').value[0].startTime = this.formSave.get('startTime').value
        this.formSave.get('applicableSubject').value[0].endTime = this.formSave.get('endTime').value
    }

    setValueFromImport(event?){
        let dataApplicationSubject = []
        if (this.formSave.get('applicableSubject').value[0]['subjectSelectionType'][0] === 'imported'){
            for (let item in this.formSave.get('applicableSubject').value ){
                dataApplicationSubject.push(
                    {
                        "competitionRegistrationId": null,
                        "competitionRegistrationCode": null,
                        "type": "Cá nhân",
                        "organizationName": null,
                        "employeeCode": this.formSave.get('applicableSubject').value[item]['objectCode'],
                        "nameEmployee": this.formSave.get('applicableSubject').value[item]['objectName'],
                        "phoneEmployee": null,
                        "emailEmployee": null,
                        "statusEmployeeAccepted": "Chưa đăng ký",
                        "dateEmployeeAccepted": null,
                        "signDocumentId": null,
                        "competitionRegistrationStatus": null,
                        "checkedEmp": 0,
                        "organizationId": null
                    }
                )
            }
        }
        this.resultList = {
            data : dataApplicationSubject
        }
    }
}
