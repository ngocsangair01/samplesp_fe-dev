import {AssessmentResultService} from './../../../../../core/services/employee/assessment-result.service';
import {FormGroup, FormControl, FormArray, AbstractControl} from '@angular/forms';
import { UrlConfig, Constants } from '@env/environment';
import {
    ALL_ASSESSMENT_EMPLOYEE_PAGE,
    ALL_RIGHT_MENU_TAB,
    AssessmentCriteriaGroup,
    AssessmentFormType,
    AssessmentPeriod,
    ASSESSMENT_FIELD_TYPE
} from './../assessment-interface';
import {AssessmentPeriodService} from '@app/core/services/assessmentPeriod/assessment-period.service';
import {Component, OnInit, HostListener, ViewChild, ElementRef} from '@angular/core';
import {BaseComponent} from '@app/shared/components/base-component/base-component.component';
import {ValidationService, CommonUtils} from '@app/shared/services';
import {
    CONFIG,
    APP_CONSTANTS,
    DEFAULT_MODAL_OPTIONS,
    ASSESSMENT_HISTORY_MODAL_OPTIONS,
    RESPONSE_TYPE
} from '@app/core/app-config';
import {environment} from '@env/environment';
import {AssessmentEmployeeService} from '@app/core/services/employee/assessment-employee.service';
import {CurriculumVitaeService} from '@app/core/services/employee/curriculum-vitae.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
    AssessmentEvaluateEmployeeAgainComponent
} from '../assessment-evaluate-employee-again/assessment-evaluate-employee-again.component';
import {AssessmentSignatureComponent} from '../../assessment-signature/assessment-signature.component';
import {AppComponent} from '@app/app.component';
import {MenuItem} from 'primeng/api';
import {TranslationService} from 'angular-l10n';
import {AssessmentNotificationComponent} from '../assessment-notification/assessment-notification.component';
import {HrStorage} from '@app/core/services/HrStorage';
import * as _ from 'lodash';
import {AssessmentHistoryLogComponent} from '../assessment-history-log/assessment-history-log.component';
import {AssessmentStatisticComponent} from '../../assessment-statistic/assessment-statistic.component';
import {Steps} from 'primeng/steps';
import {AutoComplete} from 'primeng/autocomplete';
import {AssessmentSignImageComponent} from '../../assessment-sign-image/assessment-sign-image.component';
import {
    AssessmentEmployeeLevelService
} from '@app/core/services/assessment-employee-level/assessment-employee-level.service';
import {ActivatedRoute, Router} from '@angular/router';
import {
    AssessmentHistoryLogV2Component
} from "@app/modules/employee/staff-assessment/assessment/assessment-history-log/assessment-history-log-v2.component";
import {
    AssessmentSignPreviewModalComponent
} from '../../assessment-sign-image/preview-modal-sign/assessment-sign-preview-modal.component';
import {EvaluationProcessComponent} from '../evaluation-process/evaluation-process.component';

@Component({
    selector: 'assessment-index',
    templateUrl: './assessment-index.component.html',
    styleUrls: ['./assessment-index.component.css']
})
export class AssessmentIndexComponent extends BaseComponent implements OnInit {
    @ViewChild('assessmentStatistics') assessmentStatisticsChild: AssessmentStatisticComponent;
    @ViewChild('downloadFile') downloadFile;
    // @ViewChild('headerEmployeeRef') headerEmployeeRef: ElementRef;
    @ViewChild('autoCompleteAssessmentEmployee') private autoCompleteAssessmentEmployee: AutoComplete;
    items: MenuItem[];
    @ViewChild('stepper') stepper: Steps;
    public activeIndex = 0;
    viewHeight = 0;
    public ICON_API_URL = environment.serverUrl['assessment'] + CONFIG.API_PATH['settingIcon'] + '/icon/'
    public AVATAR_API_URL = environment.serverUrl['political'] + CONFIG.API_PATH['employee-image'] + '/'
    staffCode = HrStorage.getUserToken().userId;
    assessmentFieldType = ASSESSMENT_FIELD_TYPE
    json: JSON = JSON
    formAssessment: FormGroup
    formSearch: FormGroup
    formRotateSearch: FormGroup
    formSearchRank: FormGroup
    formAssessmentPeriod: FormGroup
    lstEvaluatedType: any
    lstAssessmentCompleteType: any
    formStatistics: FormGroup
    // tab menu hiển thị
    tabSideRightMenuActive: string = ''
    // thông tin nhân viên
    employeeInfo: any = null
    // boolean ẩn hiện header search
    isShowRotateSearch = false
    yearCurrent: number;
    LIST_YEAR = [];
    // boolean ẩn hiện tab menu
    isShowSideRightMenu = false
    // boolean ẩn hiện danh sách đợt đánh giá
    isShowSideLeftMenu = false
    // trang hiển thị
    currentPage: string = ALL_ASSESSMENT_EMPLOYEE_PAGE.ASSESSMENT_PERIOD_PAGE
    ASSESSMENT_EMPLOYEE_PAGE = ALL_ASSESSMENT_EMPLOYEE_PAGE.EMPLOYEE_PAGE
    ASSESSMENT_PAGE = ALL_ASSESSMENT_EMPLOYEE_PAGE.ASSESSMENT_PAGE
    // danh sách kỳ đánh giá
    assessmentPeriodList: AssessmentPeriod[] = []
    assessmentPeriodListNew: AssessmentPeriod[] = []
    // vị trí lấy nhân viên
    pageOffset = 0
    // danh sách nhân viên hiển thị slide
    employeeShowList = []
    // danh sach ket qua danh gia
    assessmentResultList: any[] = []
    // id kỳ đánh giá
    assessmentPeriodId: number = null
    assessmentPeriodName: string = null
    // danh sách nhóm tiêu chí đánh giá
    assessmentCriteriaGroupList: AssessmentCriteriaGroup[]
    // thông tin nhân viên đang được đánh giá
    evaluateEmployeeInfo: any = {}
    assessmentEmployeeList: any[] = []
    assessmentEmployeeAllList: any[] = []
    resultRankList: any = {};
    resultPeriodOldList: any = {};
    disableButton = false;
    currentEvaluate = 0;
    currentTab = 0;
    activeTab = 0;
    formStatisticsConfig = {
        assessmentStatisticType: [1],
        organizationId: [null]
    }
    formSearchConfig = {
        assessmentPeriodId: [null, [ValidationService.required]],
        fullName: [null, [ValidationService.maxLength(200)]],
        employeeCode: [null, [ValidationService.maxLength(100)]],
        email: [null, [ValidationService.maxLength(200)]],
        isEvaluated: [null],
        gender: [null],
        assessmentStatisticType: [1],
        evaluatedType: [null],
        assessmentCompleteType: [null],
        organizationId: [null],
        assessmentResult: [null],
        year: [null]
    }
    formRotateSearchConfig = {
        assessmentPeriodId: [null, [ValidationService.required]],
        keySearch: [null, [ValidationService.maxLength(200)]]
    }
    formSearchRankConfig = {
        assessmentPeriodId: [null, [ValidationService.required]],
        sortRankType: [0]
    }
    formAssessmentPeriodConfig = {
        employeeId: [null]
    }
    evaluateEmployeeData: any = {}
    listAssessmentCriterias: any = []
    assessmentCriteria: any[] = []
    assessmentCriteriaDisableIds: any[] = []
    isHaveInTheFormula: any[] = []
    assessmentStatusStatistics: boolean = true
    resultOfAssessment: boolean = false
    assessmentStatisticTypeList = APP_CONSTANTS.ASSESSMENT_STATISTIC_TYPELIST
    sortRankTypelist = APP_CONSTANTS.SORT_TYPE
    //rootId = APP_CONSTANTS.ORG_ROOT_ID
    isHasEvaluating: boolean = false
    haveClose: number;
    evaluatingLevel: number
    hasSignature: boolean = false
    hasRecord: boolean = true
    result: any = {}
    // Value of Dynamic From To
    from: any
    to: any
    assessmentCriteriaRankColor: any
    fnCalculateAssessment
    scrWidth: any
    assessmentLevelName: string
    isValidForm: boolean = false
    hasAdminAssessment: boolean = false
    assessmentType: any
    assessmentCriteriaValueError: boolean = false
    isDisplayBtnHistory: boolean = false
    isDisplayBtnExport: boolean = false
    modalRefNotification: any
    modalRefHistory: any
    modalRefSignature: any
    modalRefReEvaluate: any
    disableBtnBackEmp = false;
    elem: any;
    disableBtnBackPeriod = false;
    currPeriod: AssessmentPeriod;
    totalEmployee = 0;
    perPage = 10;
    listTab: any;
    tabActive: any;
    managerId: any;
    assessmentLevelInfoList: any;
    disableLatch = false;
    templateFileList: any[] = []
    public userInfo: any;
    showListDetail = false;
    userLogin = HrStorage.getUserToken().userInfo.employeeId;
    assessmentEmployeeLevelStatus: any;
    showMoreAction = false;
    listMoreAction = [];
    mapActionControl = {};
    limit = 10;
    moreData = false;
    listActionControl = {
        SAVE: false,
        SUBMIT: false,
        SIGNING: false,
        REEVALUATE: false,
        EXPORT_RESULT_EVALUATE: false,
        HISTORY_EVALUATE: false
    };

    constructor(
        private actRou: ActivatedRoute,
        private el: ElementRef,
        private assessmentPeriodService: AssessmentPeriodService,
        private assessmentEmployeeService: AssessmentEmployeeService,
        private assessmentResultService: AssessmentResultService,
        private curriculumVitaeService: CurriculumVitaeService,
        private modalService: NgbModal,
        private app: AppComponent,
        public translation: TranslationService,
        private router: Router,
        private assessmentEmployeeLevelService: AssessmentEmployeeLevelService,
    ) {
        super(null, "STAFF_ASSESSMENT");
        this.lstEvaluatedType = APP_CONSTANTS.SIGN_STATUS_TYPE;
        this.lstAssessmentCompleteType = APP_CONSTANTS.ASSESSMENT_COMPLETE_STATUS_TYPE;
        this.getAllAssessmentPeriodList();
        this.formSearch = this.buildForm({}, this.formSearchConfig);
        this.formAssessment = new FormGroup({formAssessmentArray: this.buildFormsAssessmentArray(1)})
        this.formRotateSearch = this.buildForm({}, this.formRotateSearchConfig);
        this.formSearchRank = this.buildForm({}, this.formSearchRankConfig);
        this.formAssessmentPeriod = this.buildForm({}, this.formAssessmentPeriodConfig);
        this.formStatistics = this.buildForm({}, this.formStatisticsConfig);
        document.body.className = document.body.className + " assessment-body";
        const userToken = HrStorage.getUserToken();
        this.userInfo = userToken ? userToken.userInfo : {};
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        if (this.scrWidth != window.innerWidth) {
            if (this.currentPage === ALL_ASSESSMENT_EMPLOYEE_PAGE.ASSESSMENT_PAGE) {

            } else if (this.currentPage === ALL_ASSESSMENT_EMPLOYEE_PAGE.EMPLOYEE_PAGE) {
                this.onChosePeriod(this.currPeriod);
            }
        }
        this.scrWidth = window.innerWidth;
    }

    @HostListener('orientationchange', ['$event'])
    orientationChange(event?) {
        if (this.currentPage === ALL_ASSESSMENT_EMPLOYEE_PAGE.ASSESSMENT_PAGE) {
            this.showEmployeeInfo(this.employeeInfo);
        } else if (this.currentPage === ALL_ASSESSMENT_EMPLOYEE_PAGE.EMPLOYEE_PAGE) {
            this.onChosePeriod(this.currPeriod);
        }
    }


    // @HostListener('mouseleave', ['$event'])
    // onHover(event?) {
    //   this.openFullscreen();
    // }

    // @HostListener('click', ['$event'])
    // onClick(event?) {
    //   this.openFullscreen();
    // }

    @HostListener('touchmove', ['$event'])
    onClick(event?) {
        event.stopPropagation();
    }

    touchmove

    ngOnInit() {
        const userAgent = window.navigator.userAgent.toLowerCase();
        if (userAgent.indexOf('msie') > -1 || userAgent.indexOf('trident') > -1) {
            alert('Hệ thống chạy ổn định trên trình duyệt Chrome hoặc SFive, đề nghị đồng chí sử dụng thay đổi trình duyệt để thực hiện thao tác.');
        }
        this.innitYears();
        this.items = [];
        this.elem = document.documentElement;
        this.getScreenSize();
        if (this.assessmentPeriodList.length === 1) {
            this.onChosePeriod(this.assessmentPeriodList[0]);
        }
        this.formStatistics.controls.organizationId.valueChanges.subscribe(val => {
            this.assessmentStatisticsChild.onChangeData(val);
        })
    }

    ngDoCheck() {
        if (this.showListDetail || this.evaluatingLevel > 0) {
            this.mapActionControl = {}
            this.mapActionControl["process-evaluate"] = "processEvaluateEmployee(true)";
            this.mapActionControl["confirm-evaluate"] = "processEvaluateEmployee(false)";
            this.mapActionControl["sign"] = "processEvaluateEmployee(false)";
            this.mapActionControl["re-evaluate"] = "processReEvaluateEmployee";
            this.mapActionControl["download-file"] = "exportAssessmentResult($event)";
            this.mapActionControl["signature"] = "signature";
            this.mapActionControl["history-log"] = "showHistoryLog";
            this.mapActionControl["logout"] = "logout";
            this.listMoreAction = []
            const listButton = Array.from(document.querySelectorAll(".btn-dt"))
            listButton.forEach((item: any, index: number) => {
                if (index > 2 && this.scrWidth <= 768 && listButton.length > 4) {
                    item.hidden = true;
                    this.listMoreAction.push({
                        id: item.id,
                        name: item.innerText,
                        action: this.mapActionControl[item.id]
                        // action: "checkFunc2($event)"
                    });
                } else {
                    item.hidden = false
                }
            })
            this.showMoreAction = this.listMoreAction.length > 0 ? true : false;

        }
    }

    ngOnDestroy() {
        document.body.className = '';
        if (this.modalRefNotification !== undefined) {
            this.modalRefNotification.close()
        }
        if (this.modalRefHistory !== undefined) {
            this.modalRefHistory.close()
        }
        if (this.modalRefSignature !== undefined) {
            this.modalRefSignature.close(null)
        }
        if (this.modalRefReEvaluate !== undefined) {
            this.modalRefReEvaluate.close(null)
        }
    }

    get formAssessmentArray(): FormArray {
        return <FormArray>this.formAssessment.get('formAssessmentArray');
    }

    get fAssessmentArray(): FormGroup[] {
        return <FormGroup[]>this.formAssessmentArray.controls;
    }

    get fSearchRotate() {
        return this.formRotateSearch.controls;
    }

    get fSearch() {
        return this.formSearch.controls;
    }

    get fSearchRank() {
        return this.formSearchRank.controls;
    }

    get fStatistics() {
        return this.formStatistics.controls;
    }

    private nextForm() {
        const invalidControl = this.el.nativeElement.querySelector('#detail-page');
        invalidControl.scrollTo(0, 0);
        this.activeIndex++
        this.stepper.activeIndexChange.emit(this.activeIndex);
        setTimeout(() => {
            const ele = document.getElementsByClassName("ui-state-highlight")[0]
            ele.scrollIntoView({behavior: "smooth"})
        }, 100)
    }

    private nextFormV2(index) {
        const invalidControl = this.el.nativeElement.querySelector('#detail-page');
        invalidControl.scrollTo(0, 0);
        // this.activeIndex = index;
        console.log(this.stepper)
        this.stepper.activeIndexChange.emit(index);
        setTimeout(() => {
            const ele = document.getElementsByClassName("ui-state-highlight")[0]
            ele.scrollIntoView({behavior: "smooth"})
        }, 100)
    }

    public backForm() {
        this.activeIndex--
        this.stepper.activeIndexChange.emit(this.activeIndex);
        setTimeout(() => {
            const ele = document.getElementsByClassName("ui-state-highlight")[0]
            ele.scrollIntoView({behavior: "smooth"})
        }, 100)
    }

    movePageBack() {
        if (this.currentPage === ALL_ASSESSMENT_EMPLOYEE_PAGE.ASSESSMENT_PAGE) {
            if (this.assessmentEmployeeAllList.length === 1) {
                this.currentPage = ALL_ASSESSMENT_EMPLOYEE_PAGE.ASSESSMENT_PERIOD_PAGE
                this.employeeShowList = []
                this.assessmentEmployeeList = []
                this.assessmentEmployeeAllList = []
                this.isShowSideRightMenu = false
                this.isShowSideLeftMenu = false
                this.listAssessmentCriterias = []
            } else {
                this.currentPage = ALL_ASSESSMENT_EMPLOYEE_PAGE.EMPLOYEE_PAGE;
            }
            this.evaluateEmployeeData = {}
            // this.formAssessment = new FormGroup({formAssessmentArray: this.buildFormsAssessmentArray(1)})
            this.assessmentCriteriaGroupList = []
            this.assessmentCriteria = []
            this.assessmentCriteriaDisableIds = []
            this.listAssessmentCriterias = []
        } else if (this.currentPage === ALL_ASSESSMENT_EMPLOYEE_PAGE.EMPLOYEE_PAGE) {
            this.currentPage = ALL_ASSESSMENT_EMPLOYEE_PAGE.ASSESSMENT_PERIOD_PAGE
            this.employeeShowList = []
            this.assessmentEmployeeList = []
            this.listAssessmentCriterias = []
            this.assessmentEmployeeAllList = []
            this.isShowSideRightMenu = false
            this.isShowSideLeftMenu = false
        }
        this.showListDetail = false;
    }

    /**
     * Local search assessment employee like by name, code and email
     *
     * @param event
     */
    assessmentEmployeeSuggestSearch(event) {
        if (event.query.trim().length > 0) {
            this.processSearchForSuggest({
                searchValue: event.query.trim(),
                assessmentPeriodId: this.assessmentPeriodId
            });
            // this.assessmentEmployeeList = this.assessmentEmployeeAllList.filter(
            //   item => this.filterAssessmentEmployee(item, event.query.trim())
            // )
            // console.log('this.assessmentEmployeeList', this.assessmentEmployeeList);
        }
    }

    /**
     * Filter employee by name, code and email
     * @param employee
     * @param keySearch
     */
    private filterAssessmentEmployee(employee: any, keySearch: string): boolean {
        const filterByName = employee.employeeFullName !== null && employee.employeeFullName.toLowerCase().includes(keySearch.toLowerCase())
        const filterByCode = employee.employeeCode !== null && employee.employeeCode.toLowerCase().includes(keySearch.toLowerCase())
        const filterByEmail = employee.email !== null && employee.email.toLowerCase().includes(keySearch.toLowerCase())
        return filterByName || filterByCode || filterByEmail
    }

    /**
     * Selected assessment employee from suggest search
     *
     * @param emp employee selected
     */
    onSelectAssessmentEmployee(emp) {
        this.fSearchRotate['keySearch'].setValue('')
        this.isShowRotateSearch = false
        this.prepareEvaluateEmployee(emp)
    }

    /**
     * Summit suggest search
     */
    processSuggestSearch() {
        this.pageOffset = 0
        this.employeeShowList = []
        if (this.fSearchRotate['keySearch'].value.trim().length > 0) {
            const results = this.assessmentEmployeeAllList.filter(
                item => this.filterAssessmentEmployee(item, this.fSearchRotate['keySearch'].value.trim())
            )
            this.hasRecord = results && results.length > 0
            this.pagingEmployeeList(results)
            if (this.hasRecord) {
                this.setActiveEmployee(results[0])
            } else {
                this.employeeInfo = null
                this.formAssessmentPeriod.controls['employeeId'].setValue(null)
                this.resultPeriodOldList = []
                this.getListAssessmentPeriodName()
                if (this.tabSideRightMenuActive === ALL_RIGHT_MENU_TAB.PROFILE_TAB) {
                    this.tabSideRightMenuActive = ALL_RIGHT_MENU_TAB.ADVANCE_SEARCH_TAB
                }
            }
        } else {
            this.processSearchEmployeeV2(null);
            // this.hasRecord = this.assessmentEmployeeAllList && this.assessmentEmployeeAllList.length > 0
            // this.pagingEmployeeList(this.assessmentEmployeeAllList)
        }
        this.isShowRotateSearch = false
    }

    /**
     * Get list assessment period
     */
    getAllAssessmentPeriodList() {
        const that = this;
        const params = this.actRou.snapshot.params;
        this.disableBtnBackPeriod = false;
        if (params.assessmentPeriodId) {
            if (params.employeeId) {
                this.currentPage = ALL_ASSESSMENT_EMPLOYEE_PAGE.ASSESSMENT_PAGE;
                let paramSearch = {assessmentPeriodId: params.assessmentPeriodId, employeeCode: params.employeeId}
                this.assessmentPeriodService.findOne(params.assessmentPeriodId).subscribe(res => {
                    this.assessmentPeriodList.push(res.data);
                })
                this.assessmentEmployeeService.search(paramSearch).subscribe(res => {
                    if (res.data && res.data.length) {
                        this.prepareEvaluateEmployee(res.data[0]);
                    }
                })
                this.assessmentPeriodId = params.assessmentPeriodId;
            } else {
                this.currentPage = ALL_ASSESSMENT_EMPLOYEE_PAGE.EMPLOYEE_PAGE;
                this.assessmentPeriodService.findOne(params.assessmentPeriodId).subscribe(res => {
                    this.assessmentPeriodList.push(res.data);
                    that.disableBtnBackPeriod = true;
                    this.onChosePeriod(this.assessmentPeriodList[0]);
                })
                this.assessmentPeriodId = params.assessmentPeriodId;
            }
        } else {
            this.assessmentPeriodService.getAllAssessmentPeriodList().subscribe(res => {
                that.assessmentPeriodList = res;
                that.assessmentPeriodListNew = res;
                // if (that.assessmentPeriodList.length === 1) {
                //   that.disableBtnBackPeriod = true;
                //   that.onChosePeriod(this.assessmentPeriodList[0]);
                // }
            });
        }
    }

    /**
     * Get list assessment result
     */
    getAssessmentResultList() {
        this.assessmentResultService.getListAssessmentResult(this.assessmentPeriodId).subscribe(res => {
            if (res.data && res.data.length > 0) {
                res.data.forEach(element => {
                    const item = {
                        label: element,
                        value: element
                    }
                    this.assessmentResultList.push(item)
                })
            }
        })
    }
    innitYears() {
        const range = 20;
        const yearCurrent = new Date().getFullYear();
        this.yearCurrent = yearCurrent;
        for(let i = yearCurrent; i > yearCurrent - range; i--) {
            this.LIST_YEAR.push({id: i, name: i});
        }
    }

    /**
     * xử lý chọn kỳ đánh giá
     * @param period
     */
    onChosePeriod(period: AssessmentPeriod) {
        if (period) {
            console.log(period)
            const currentDate = new Date();
            if (period.expiredDate != null && period.expiredDate < currentDate) {
                this.disableButton = true;
            }
            else this.disableButton = false
            this.currPeriod = period;
            this.formSearch = this.buildForm({}, this.formSearchConfig);
            this.formRotateSearch = this.buildForm({}, this.formRotateSearchConfig);
            this.assessmentPeriodId = period.assessmentPeriodId;
            this.assessmentPeriodName = period.assessmentPeriodName
            this.fSearchRotate['assessmentPeriodId'].setValue(period.assessmentPeriodId);
            this.fSearch['assessmentPeriodId'].setValue(period.assessmentPeriodId);
            this.fSearchRank['assessmentPeriodId'].setValue(period.assessmentPeriodId);
            this.fSearchRank['sortRankType'].setValue(0);
            this.assessmentResultList = []
            this.getAssessmentResultList()
            this.hasRecord = true
            this.processSearchEmployee(null)
            this.tabSideRightMenuActive = ALL_RIGHT_MENU_TAB.ADVANCE_SEARCH_TAB;
            this.employeeInfo = null;
            //this.getListAssessmentRankings();
            this.isShowSideRightMenu = false
            this.assessmentStatusStatistics = true
            this.resultOfAssessment = false
            // if (period.isPartyMemberAssessment === 1) {
            //   this.items = [
            //     {label: 'Kiểm điểm cá nhân năm ' + period.assessmentYear},
            //     {label: 'Cam kết tu dưỡng, rèn luyện, phấn đầu năm ' + (period.assessmentYear + 1)},
            //     {label: 'Khai bổ sung thay đổi hồ sơ năm ' + period.assessmentYear}
            //   ];
            // }
        }
    }

    /**
     * Xu ly hien thi tab ranking
     */
    public getListAssessmentRankings(event?): void {
        this.assessmentEmployeeService.getAssessmentRankings(this.formSearchRank.value, event).subscribe(res => {
            this.resultRankList = res;
        });
        if (!event) {
            if (this.dataTable) {
                this.dataTable.first = 0;
            }
        }
    }

    /**
     * Xử lý hiển thị header search
     */
    showHideSearch() {
        this.isShowRotateSearch = !this.isShowRotateSearch;
        if (this.isShowRotateSearch) {
            this.autoCompleteAssessmentEmployee.focusInput();
        }
    }

    /**
     * xử lý hiển thị tab menu
     */
    showSideRightMenu() {
        this.isShowSideRightMenu = !this.isShowSideRightMenu;
        if (!this.tabSideRightMenuActive || this.tabSideRightMenuActive.length === 0) {
            this.tabSideRightMenuActive = ALL_RIGHT_MENU_TAB.ADVANCE_SEARCH_TAB;
        }
    }

    /**
     * xử lý hiển thị danh sách đợt đánh gái trên mobile
     */
    showSideLeftMenu() {
        this.isShowSideLeftMenu = !this.isShowSideLeftMenu;
    }

    /**
     * xử lý hiển thị danh sách đợt đánh gái trên mobile
     */
    closeLeftMenu() {
        this.isShowSideLeftMenu = !this.isShowSideLeftMenu;
    }

    /**
     * xử lý hiển thị thông tin nhân viên
     * @param employee
     */
    showEmployeeInfo(employee) {
        this.employeeInfo = employee
        this.formAssessmentPeriod.controls['employeeId'].setValue(this.employeeInfo.employeeId)

        this.getListAssessmentPeriodName()
        this.tabSideRightMenuActive = ALL_RIGHT_MENU_TAB.PROFILE_TAB
        this.isShowSideRightMenu = true
    }

    /**
     * Set active employee
     */
    private setActiveEmployee(employee) {
        this.employeeInfo = employee
        this.formAssessmentPeriod.controls['employeeId'].setValue(this.employeeInfo.employeeId)
        //this.getListAssessmentPeriodName();
        this.tabSideRightMenuActive = this.tabSideRightMenuActive != '' ? this.tabSideRightMenuActive : ALL_RIGHT_MENU_TAB.PROFILE_TAB;
    }

    /**
     * Xu ly hien thi thong tin cac ki danh gia
     */
    public getListAssessmentPeriodName(event?): void {
        this.assessmentResultService.getListAssessmentPeriodName(this.formAssessmentPeriod.value, event).subscribe(res => {
            this.resultPeriodOldList = res;

        });
        if (!event) {
            if (this.dataTable) {
                this.dataTable.first = 0;
            }
        }
    }

    /**
     * Xu ly chon tab
     */
    public selectTab(tab: string) {
        this.tabSideRightMenuActive = tab;
    }

    /**
     * Xu ly chia danh sach tong employee
     * @param employeeList
     */
    private pagingEmployeeList(employeeList) {
        if (employeeList.length > 0) {
            let i: number, j: number, splitEmployeeList = [], pagingEmployeeList = [], chunk = 10;
            this.perPage = 10;
            if (this.scrWidth === 768) {
                chunk = 10;
                this.perPage = 10;
            }
            for (i = 0, j = employeeList.length; i < j; i += chunk) {
                splitEmployeeList = employeeList.slice(i, i + chunk);
                pagingEmployeeList.push(splitEmployeeList);
                this.employeeShowList = pagingEmployeeList;
            }
        } else {
            this.employeeShowList = [];
        }
    }

    /**
     * Xử lý chuyển trang employee
     * @param action
     */
    public changePageEmployee(action: string) {
        if (action === 'next' && this.pageOffset < this.totalEmployee - 1) {
            this.pageOffset += 1;
            this.processSearchEmployeeV2(null);
        } else if (action === 'prev' && this.pageOffset > 0) {
            this.pageOffset -= 1;
            this.processSearchEmployeeV2(null);
        }
    }

    /**
     * build assessment dynamic form
     * @param employeeId
     */
    public async prepareEvaluateEmployee(employee) {
        this.employeeInfo = employee;
        this.currentEvaluate = employee.currentOrder ? employee.currentOrder : employee.assessmentNextOrder;
        if (!this.currentEvaluate) {
            this.currentEvaluate = employee.maxOrder;
        }
        this.evaluateEmployeeData = {
            assessmentPeriodId: this.assessmentPeriodId,
            employeeId: employee.employeeId
        };
        this.activeIndex = 0;
        await this.getHistory();
    }

    /**
     * signature
     * @param employeeId
     */
    public signature() {
        this.modalRefSignature = this.modalService.open(AssessmentSignatureComponent, DEFAULT_MODAL_OPTIONS);
        this.modalRefSignature.componentInstance.setFormValue(this.evaluateEmployeeData['assessmentResultId'], this.assessmentPeriodId, this.evaluateEmployeeInfo.employeeId);
        this.modalRefSignature.result.then((result) => {
            this.prepareEvaluateEmployee(this.evaluateEmployeeInfo);
        });
    }

    /**
     * signature
     * @param employeeId
     */
    public signatureV2(info) {
        this.modalRefSignature = this.modalService.open(AssessmentSignatureComponent, DEFAULT_MODAL_OPTIONS);
        this.modalRefSignature.componentInstance.setFormValue(info.assessmentResultId, info.assessmentPeriodId, info.employeeId);
        this.modalRefSignature.result.then((result) => {
            //this.prepareEvaluateEmployee(this.evaluateEmployeeInfo.employeeId);
        });
    }

    /**
     * Check is Disable Criteria
     * @param criteria
     */
    public isDisableCriteria(criteria: any): boolean {
        if (!this.assessmentCriteriaDisableIds || this.assessmentCriteriaDisableIds.length === 0) {
            return false;
        }
        return (criteria.assessmentLevelMappingCriteriaAgain !== APP_CONSTANTS.HAS_ASSESSMENT_AGAIN
            && this.assessmentCriteriaDisableIds.includes(criteria.assessmentCriteriaId))
    }

    /**
     * Check is Disable button duplicate criteria
     * @param criteriaId
     */
    public isDisableButtonDuplicateCriteria(criteriaGroup: any): boolean {
        if (!this.assessmentCriteriaDisableIds || this.assessmentCriteriaDisableIds.length === 0) {
            return false;
        }
        let isDisable = false
        criteriaGroup.groupChildList[0].listAssessmentCriterias.forEach(criteria => {
            if (criteria.assessmentLevelMappingCriteriaAgain !== APP_CONSTANTS.HAS_ASSESSMENT_AGAIN
                && this.assessmentCriteriaDisableIds.includes(criteria.assessmentCriteriaId)) {
                isDisable = true
            }
        })
        return isDisable
    }

    private buildAssessmentDynamicForm(formType: number) {
        let validateFieldFromToList = []
        this.assessmentCriteriaGroupList.forEach(criteriaGroup => {
            if (criteriaGroup.assessmentCriteriaGroupFormType === formType) {
                criteriaGroup.groupChildList.forEach(groupChild => {
                    this.buildAssessmentCriteriaForm(validateFieldFromToList, groupChild.listAssessmentCriterias, formType)
                })
                if (validateFieldFromToList.length > 0) {
                    let frm = this.formAssessmentArray.controls[formType - 1] as FormGroup
                    frm.setValidators(validateFieldFromToList);
                    frm.updateValueAndValidity()
                }
            }
        })
    }

    private buildAssessmentCriteriaForm(validateFieldFromToList, listAssessmentCriterias, formType: number) {
        let frm = this.formAssessmentArray.controls[formType - 1] as FormGroup
        listAssessmentCriterias.forEach(criteria => {
            if ((criteria.fieldType === APP_CONSTANTS.FIELD_TYPE.COMBOBOX || criteria.fieldType === APP_CONSTANTS.FIELD_TYPE.RADIO_BUTTON)
                && criteria.fieldItems) {
                criteria.fieldItems = JSON.parse(criteria.fieldItems)
            }
            // get value
            let defaultValue: any = criteria.fieldDefaultValue;
            let exited: boolean = false
            for (const item of this.assessmentCriteria) {
                if (item.assessmentCriteriaCode === criteria.assessmentCriteriaCode) {
                    defaultValue = item.assessmentCriteriaValue
                    exited = true
                    break;
                }
            }
            if (!exited) {
                this.assessmentCriteria.push({
                    assessmentCriteriaCode: criteria.assessmentCriteriaCode,
                    assessmentCriteriaValue: defaultValue,
                    assessmentCriteriaLabel: this.getAssessmentCriteriaLabel(criteria, defaultValue)
                })
            }
            if (!isNaN(defaultValue)) {
                if (criteria.fieldType === ASSESSMENT_FIELD_TYPE.DATE
                    || criteria.fieldType === ASSESSMENT_FIELD_TYPE.DATE_TIME
                    || criteria.fieldType === ASSESSMENT_FIELD_TYPE.TIME
                    || criteria.fieldType === ASSESSMENT_FIELD_TYPE.STAR) {
                    defaultValue = Number(defaultValue)
                } else if (criteria.fieldType === ASSESSMENT_FIELD_TYPE.SPINNER) {
                    defaultValue = parseFloat(defaultValue)
                }
            } else if (criteria.fieldType === ASSESSMENT_FIELD_TYPE.FROM_TO) {
                defaultValue = JSON.parse(defaultValue)
                validateFieldFromToList.push(ValidationService.notAffter(criteria.assessmentCriteriaCode + "From", criteria.assessmentCriteriaCode + "To", 'assessmentResult.to'))
            }

            if (criteria.fieldType === ASSESSMENT_FIELD_TYPE.FROM_TO) {
                // add controls
                frm.addControl(criteria.assessmentCriteriaCode + "From", new FormControl(Number(defaultValue.from) ? Number(defaultValue.from) : ''));
                frm.addControl(criteria.assessmentCriteriaCode + "To", new FormControl(Number(defaultValue.to) ? Number(defaultValue.to) : ''));
            } else {
                const formDisabled = !this.isHasEvaluating || this.isDisableCriteria(criteria);
                frm.addControl(criteria.assessmentCriteriaCode, new FormControl({
                    value: defaultValue ? defaultValue : '',
                    disabled: formDisabled
                }));
                this.listAssessmentCriterias.push(criteria);
            }
        })
    }

    /**
     * Build assessment dynamic form
     *
     * @param data
     */
    private rebuildForm(data): void {
        if (data.listAssessmentCriteriaGroups !== null) {
            this.assessmentCriteriaGroupList = data.listAssessmentCriteriaGroups
            for (let index = 0; index < this.items.length; index++) {
                this.buildAssessmentDynamicForm(index + 1);
            }
        }
    }

    /**
     * Xử lý search danh sách nhân viên theo kỳ đánh giá
     * @param formSearch
     */
    public processSearchEmployee(formSearch: FormGroup) {
        let paramSearch = {assessmentPeriodId: this.assessmentPeriodId, first: 0, limit: this.limit}
        if (formSearch) {
            if (!CommonUtils.isValidForm(formSearch)) {
                return;
            }
            paramSearch = formSearch.value
        }
        this.pageOffset = 0;
        this.assessmentEmployeeAllList = [];
        this.employeeShowList = [];
        this.disableBtnBackEmp = false;
        this.assessmentEmployeeService.search(paramSearch).subscribe(res => {
            this.assessmentEmployeeAllList = res.data
            const employeeList = res.data
            this.totalEmployee = res.recordsTotal * 1;
            this.moreData = (this.pageOffset + 1) * this.limit < this.totalEmployee;
            this.hasRecord = employeeList && this.totalEmployee > 0
            this.pagingEmployeeList(employeeList);
            // if (this.assessmentEmployeeAllList.length === 1 && this.assessmentEmployeeAllList[0].employeeCode === this.staffCode) {
            //   // if(this.assessmentPeriodList.length === 1){
            //   //   this.disableBtnBackEmp = true;
            //   // }
            //   this.prepareEvaluateEmployee(this.assessmentEmployeeAllList[0].employeeId);
            // } else {

            // }
            if (this.hasRecord) {
                this.setActiveEmployee(this.assessmentEmployeeAllList[0])
            }
            // di chuyen sang man hinh danh sach can bo duoc danh gia
            this.currentPage = ALL_ASSESSMENT_EMPLOYEE_PAGE.EMPLOYEE_PAGE
        })
        this.isShowRotateSearch = false
    }

    /**
     * Search v2
     * @param formSearch
     */
    public processSearchEmployeeV2(object?: any) {
        let paramSearch = {assessmentPeriodId: this.assessmentPeriodId, first: 0, limit: 10}
        const keyword = this.fSearchRotate['keySearch'].value;
        if (keyword && keyword.trim().length > 0) {
            paramSearch['searchValue'] = keyword.trim();
        }
        if (object) {
            paramSearch = {...paramSearch, ...object};
        }
        this.pageOffset = this.pageOffset ? this.pageOffset : 0;
        paramSearch.first = this.pageOffset * paramSearch.limit;
        this.assessmentEmployeeAllList = [];
        this.employeeShowList = [];
        this.disableBtnBackEmp = false;
        this.assessmentEmployeeService.search(paramSearch).subscribe(res => {
            this.assessmentEmployeeAllList = res.data
            const employeeList = res.data
            this.totalEmployee = res.recordsTotal * 1;
            this.moreData = (this.pageOffset + 1) * this.limit < this.totalEmployee;
            this.hasRecord = employeeList && this.totalEmployee > 0
            this.pagingEmployeeList(employeeList);
            if (this.assessmentEmployeeAllList.length === 1 && this.assessmentEmployeeAllList[0].employeeCode === this.staffCode) {
                // if(this.assessmentPeriodList.length === 1){
                //   this.disableBtnBackEmp = true;
                // }
                this.prepareEvaluateEmployee(this.assessmentEmployeeAllList[0]);
            } else {
                if (this.hasRecord) {
                    this.setActiveEmployee(this.assessmentEmployeeAllList[0])
                }
                // di chuyen sang man hinh danh sach can bo duoc danh gia
                this.currentPage = ALL_ASSESSMENT_EMPLOYEE_PAGE.EMPLOYEE_PAGE
            }
        })
        this.isShowRotateSearch = false
    }

    /**
     * Filter for suggest input
     * @param object
     */
    public processSearchForSuggest(object?: any) {
        this.pageOffset = 0;
        const formData = {
            ...object,
            first: this.pageOffset,
            limit: this.limit
        }
        this.assessmentEmployeeService.search(formData).subscribe(res => {
            this.totalEmployee = res.recordsTotal * 1;
            this.moreData = (this.pageOffset + 1) * this.limit < this.totalEmployee;
            this.hasRecord = this.totalEmployee > 0;
            this.assessmentEmployeeList = res.data;
            this.pagingEmployeeList(res.data);
        });
    }

    /**
     * lưu nháp
     * @param evaluateEmployeeData
     * @param isAutoSaveAssessmentResult
     */
    private saveDraft(evaluateEmployeeData: any, isDraft: boolean, isAutoSaveAssessmentResult?: boolean) {
        return new Promise((resolve, reject) => {
            this.assessmentResultService.saveOrUpdateAssessmentResult(evaluateEmployeeData, isAutoSaveAssessmentResult).subscribe(res => {
                if (!isDraft) {
                    resolve(res);
                }
            })
        });


    }

    private openAssessmentSignImage(evaluateEmployeeData: any) {
        this.modalRefSignature = this.modalService.open(AssessmentSignImageComponent, {
            size: 'lg',
            backdrop: 'static',
            windowClass: 'dialog-assessment-custom sign-image'
        });
        const formData = {
            employeeId: this.evaluateEmployeeData['evaluatingLevel'] === 1 ? this.evaluateEmployeeInfo.employeeId : this.managerId,
            evaluateEmployeeData: evaluateEmployeeData
        }
        this.modalRefSignature.componentInstance.setFormValue(formData);
        this.modalRefSignature.result.then((result) => {
            if (result) {
                evaluateEmployeeData['signImageId'] = result.signImageId;
                evaluateEmployeeData['isDraft'] = false;
                this.assessmentResultService.saveOrUpdate(evaluateEmployeeData).subscribe(res => {
                    if (this.assessmentResultService.requestIsSuccess(res)) {
                        if (this.staffCode === this.evaluateEmployeeInfo.employeeCode) {
                            let paramSearch = {
                                assessmentPeriodId: this.assessmentPeriodId,
                                assessmentEmployeeId: this.employeeInfo.assessmentEmployeeId,
                                first: 0, limit: 1
                            }
                            this.assessmentEmployeeService.search(paramSearch).subscribe(res2 => {
                                this.prepareEvaluateEmployee(res2.data[0]);
                            })
                        } else {
                            this.movePageBack()
                            this.processSearchEmployee(null)
                        }
                    }
                })
            }
        });
    }

    /**
     * Save or update evaluate employee
     *
     * @param evaluateEmployeeData
     * @param isDraft
     */
    private processConfirmEvaluateEmployee(evaluateEmployeeData: any, isDraft: any, isAutoSaveAssessmentResult?: boolean) {
        if (isDraft) {
            return this.saveDraft(evaluateEmployeeData, true, isAutoSaveAssessmentResult).then(res => {
            });
        }
        const isCaNhanDanhGia = this.evaluateEmployeeData['evaluatingLevel'] === 1;
        const isCapTrucTiepLaNguoiKy = this.evaluateEmployeeData['evaluatingLevel'] === 2 && this.managerId === HrStorage.getUserToken().userInfo.employeeId;
        // nếu là cá nhân chốt hoặc cấp trực tiếp đánh giá nhưng người chốt cấp trực tiếp không phải là người ký: >> thực hiện chọn ảnh ký
        if (isCaNhanDanhGia || isCapTrucTiepLaNguoiKy) {
            return this.openAssessmentSignImage(evaluateEmployeeData);
        }
        this.saveDraft(evaluateEmployeeData, false, isAutoSaveAssessmentResult).then((ressave: any) => {
            this.router.navigate(['sign-manager/multiple-sign'], {
                queryParams: {
                    listId: [ressave.data.assessmentEmployeeLevelBO.assessmentEmployeeLevelId],
                    employeeId: this.managerId,
                    assessmentPeriodId: ressave.data.assessmentPeriodId,
                    isDraft: true
                }
            });
        })
    }

    /**
     * check Validate Field Dynamic
     * @param assessmentCriteriaGroupList
     * @param isDraft
     */
    private checkValidateFieldDynamic(assessmentCriteriaGroupList: AssessmentCriteriaGroup[], isDraft: any, formType: number) {
        let frm = this.formAssessmentArray.controls[formType - 1] as FormGroup
        assessmentCriteriaGroupList.forEach(criteriaGroup => {
            if (criteriaGroup.assessmentCriteriaGroupFormType === formType) {
                criteriaGroup.groupChildList.forEach(groupChild => {
                    groupChild.listAssessmentCriterias.forEach(criteria => {
                        const validateFn = []
                        if (!isDraft && criteria.required > 0) {
                            validateFn.push(ValidationService.required);
                        }
                        if (criteria.maxLength && criteria.maxLength > 0) {
                            validateFn.push(ValidationService.maxLength(criteria.maxLength))
                        }
                        if (criteria.fieldType === ASSESSMENT_FIELD_TYPE.FROM_TO) {
                            frm.controls[criteria.assessmentCriteriaCode + "From"].setValidators(validateFn)
                            frm.controls[criteria.assessmentCriteriaCode + "To"].setValidators(validateFn)
                            frm.controls[criteria.assessmentCriteriaCode + "From"].updateValueAndValidity()
                            frm.controls[criteria.assessmentCriteriaCode + "To"].updateValueAndValidity()
                            frm.controls[criteria.assessmentCriteriaCode + "From"].markAsTouched()
                            frm.controls[criteria.assessmentCriteriaCode + "To"].markAsTouched()

                        } else {
                            frm.controls[criteria.assessmentCriteriaCode].setValidators(validateFn)
                            frm.controls[criteria.assessmentCriteriaCode].updateValueAndValidity()
                            frm.controls[criteria.assessmentCriteriaCode].markAsTouched()
                        }
                    })
                })
            }
        })
    }

    /**
     * processEvaluateEmployee
     * @param isDraft
     */
    public processEvaluateEmployee(isDraft: boolean, isAutoSaveAssessmentResult?: boolean, isActionNext?: boolean) {
        for (let i = 0; i < this.assessmentCriteria.length; i++) {
            this.onChangeAssessmentSpecialV2(this.assessmentCriteria[i]);
        }
        if (!this.result.isUpdateSelfStaffEvaluate) {
            if (this.currentTab != this.activeTab) {
                if (isActionNext) {
                    this.nextForm();
                    return;
                }
                this.app.warningMessage('assessmentResult.invalidEvaluate');
                return;
            }
        }

        this.assessmentCriteriaValueError = false
        this.evaluateEmployeeData['isDraft'] = isDraft

        if (isActionNext) {
            // check validate
            const formType = this.getFormType();
            this.checkValidateFieldDynamic(this.assessmentCriteriaGroupList, isDraft, formType)
            // validateFieldTypeTyle
            if (!isDraft) {
                this.validateFieldTypePercent(formType)
            }
            const frm = this.formAssessmentArray.controls[formType - 1] as FormGroup
            if (CommonUtils.isValidForm(frm) && !this.assessmentCriteriaValueError) {
                this.nextForm();
            } else {
                this.app.errorMessage('input.assessment.criteria.code', '', 1500);
            }
            return;
        } else {
            let invalid = false;
            for (let index = 0; index < this.formAssessmentArray.controls.length; index++) {
                // check validate
                const formType = index + 1;
                this.checkValidateFieldDynamic(this.assessmentCriteriaGroupList, isDraft, formType)
                // validateFieldTypeTyle
                if (!isDraft) {
                    this.validateFieldTypePercent(formType)
                }
                const frm = this.formAssessmentArray.controls[index] as FormGroup
                if (!CommonUtils.isValidForm(frm)) {
                    invalid = true;
                    // if (index > this.activeIndex) {
                    //   this.nextForm();
                    // }
                    this.items[index]['isCheck'] = -1;
                    this.app.warningMessage('validation.assessment', '', 1500);
                    break;
                }
                this.items[index]['isCheck'] = 1;
            }
            if (invalid || this.assessmentCriteriaValueError) {
                return;
            }
        }

        // updateValueOfDynamicField
        for (let index = 0; index < this.formAssessmentArray.controls.length; index++) {
            const formType = index + 1;
            const frm = this.formAssessmentArray.controls[index] as FormGroup
            this.updateValueOfDynamicField(frm.value, formType)
            this.updateValueFromToComponent(formType)
        }
        this.evaluateEmployeeData.listCriteria = this.assessmentCriteria
        // get evaluating level for assessment_order
        if (this.isHasEvaluating) {
            this.evaluateEmployeeData['evaluatingLevel'] = this.evaluatingLevel;
        }
        this.evaluateEmployeeData['assessmentLevelName'] = this.assessmentLevelName
        // Confirm Evaluate Employee
        this.processConfirmEvaluateEmployee(this.evaluateEmployeeData, isDraft, isAutoSaveAssessmentResult)
    }


    private buildAssessmentDynamicFormv2(formType: number) {
        let validateFieldFromToList = []
        this.assessmentCriteriaGroupList.forEach(criteriaGroup => {
            if (criteriaGroup.assessmentCriteriaGroupFormType === formType) {
                criteriaGroup.groupChildList.forEach(groupChild => {
                    this.buildAssessmentCriteriaForm(validateFieldFromToList, groupChild.listAssessmentCriterias, formType)
                })
                if (validateFieldFromToList.length > 0) {
                    let frm = this.formAssessmentArray.controls[formType - 1] as FormGroup
                    frm.setValidators(validateFieldFromToList);
                    frm.updateValueAndValidity()
                }
            }
        })
        // const element = document.getElementsByClassName('collapse');
        // element.classList.add('show');
    }

    public processEvaluateEmployeeV2(event?: any, isDraft?: boolean, isAutoSaveAssessmentResult?: boolean, isActionNext?: boolean, item?: number) {
        for (let i = 0; i < this.assessmentCriteria.length; i++) {
            this.onChangeAssessmentSpecialV2(this.assessmentCriteria[i]);
        }

        this.assessmentCriteriaValueError = false
        this.evaluateEmployeeData['isDraft'] = isDraft

        if (isActionNext) {
            // check validate
            const formType = item;
            this.checkValidateFieldDynamic(this.assessmentCriteriaGroupList, isDraft, formType)
            // validateFieldTypeTyle
            if (!isDraft) {
                this.validateFieldTypePercent(formType)
            }
            if (formType > 0) {
                const frm = this.formAssessmentArray.controls[formType - 1] as FormGroup
                if (CommonUtils.isValidForm(frm) && !this.assessmentCriteriaValueError) {
                    this.nextFormV2(formType);
                }
            } else {
                this.nextFormV2(formType);
            }
            return;
        } else {
            let invalid = false;
            for (let index = 0; index < this.formAssessmentArray.controls.length; index++) {
                // check validate
                const formType = index + 1;
                this.checkValidateFieldDynamic(this.assessmentCriteriaGroupList, isDraft, formType)
                // validateFieldTypeTyle
                if (!isDraft) {
                    this.validateFieldTypePercent(formType)
                }
                const frm = this.formAssessmentArray.controls[index] as FormGroup
                if (!CommonUtils.isValidForm(frm)) {
                    invalid = true;
                    if (index > item) {
                        this.nextForm();
                    }
                    break;
                }
            }
            if (invalid || this.assessmentCriteriaValueError) {
                return;
            }
        }

        // updateValueOfDynamicField
        for (let index = 0; index < this.formAssessmentArray.controls.length; index++) {
            const formType = index + 1;
            const frm = this.formAssessmentArray.controls[index] as FormGroup
            this.updateValueOfDynamicField(frm.value, formType)
            this.updateValueFromToComponent(formType)
        }
        this.evaluateEmployeeData.listCriteria = this.assessmentCriteria
        // get evaluating level for assessment_order
        if (this.isHasEvaluating) {
            this.evaluateEmployeeData['evaluatingLevel'] = this.evaluatingLevel;
        }
        this.evaluateEmployeeData['assessmentLevelName'] = this.assessmentLevelName
        // Confirm Evaluate Employee
        this.processConfirmEvaluateEmployee(this.evaluateEmployeeData, isDraft, isAutoSaveAssessmentResult)
    }

    public processEvaluateEmployeeV3(isDraft?: boolean, isAutoSaveAssessmentResult?: boolean, isActionNext?: boolean, item?: number, items?: any) {
        for (let i = 0; i < this.assessmentCriteria.length; i++) {
            this.onChangeAssessmentSpecialV2(this.assessmentCriteria[i]);
        }

        this.assessmentCriteriaValueError = false
        this.evaluateEmployeeData['isDraft'] = isDraft
        if (isActionNext) {
            // check validate
            if (item == 0) {
                if (!document.getElementById("collapse" + item).classList.contains("show")) {
                    for (let i = 0; i < items.length; i++) {
                        if (i != item) {
                            if (document.getElementById("collapse" + i).classList.contains("show")) {
                                document.getElementById("collapse" + i).classList.remove("show");
                            }
                        }
                    }
                    this.stepper.activeIndexChange.emit(item);
                }
            } else {
                if (!document.getElementById("collapse" + item).classList.contains("show")) {
                    const formType = item;
                    this.checkValidateFieldDynamic(this.assessmentCriteriaGroupList, isDraft, formType)
                    // validateFieldTypeTyle
                    if (!isDraft) {
                        this.validateFieldTypePercent(formType)
                    }
                    const frm = this.formAssessmentArray.controls[formType - 1] as FormGroup
                    for (let i = 0; i < items.length; i++) {
                        if (i != item) {
                            if (document.getElementById("collapse" + i).classList.contains("show")) {
                                document.getElementById("collapse" + i).classList.remove("show");
                            }
                        }
                    }
                }
            }
            return;
        } else {
            let invalid = false;
            for (let index = 0; index < this.formAssessmentArray.controls.length; index++) {
                // check validate
                const formType = index + 1;
                this.checkValidateFieldDynamic(this.assessmentCriteriaGroupList, isDraft, formType)
                // validateFieldTypeTyle
                if (!isDraft) {
                    this.validateFieldTypePercent(formType)
                }
                const frm = this.formAssessmentArray.controls[index] as FormGroup
                if (!CommonUtils.isValidForm(frm)) {
                    invalid = true;
                    if (index > item) {
                        this.nextFormV2(item);
                    }
                    break;
                }
            }
            if (invalid || this.assessmentCriteriaValueError) {
                return;
            }
        }

        // updateValueOfDynamicField
        for (let index = 0; index < this.formAssessmentArray.controls.length; index++) {
            const formType = index + 1;
            const frm = this.formAssessmentArray.controls[index] as FormGroup
            this.updateValueOfDynamicField(frm.value, formType)
            this.updateValueFromToComponent(formType)
        }
        this.evaluateEmployeeData.listCriteria = this.assessmentCriteria
        // get evaluating level for assessment_order
        if (this.isHasEvaluating) {
            this.evaluateEmployeeData['evaluatingLevel'] = this.evaluatingLevel;
        }
        this.evaluateEmployeeData['assessmentLevelName'] = this.assessmentLevelName
        // Confirm Evaluate Employee
        this.processConfirmEvaluateEmployee(this.evaluateEmployeeData, isDraft, isAutoSaveAssessmentResult)
    }

    /**
     * Update value of dynamic field
     *
     * @param valueOfDynamicField
     */
    private updateValueOfDynamicField(valueOfDynamicField: any, formType: number) {
        const assessmentCriteriaCodeList = Object.keys(valueOfDynamicField)
        assessmentCriteriaCodeList.forEach(code => {
            if (valueOfDynamicField.hasOwnProperty(code)) {
                this.assessmentCriteria.forEach(criteria => {
                    if (criteria.assessmentCriteriaCode === code) {
                        const frm = this.formAssessmentArray.controls[formType - 1] as FormGroup
                        criteria.assessmentCriteriaValue = frm.controls[code].value
                    }
                })
            }
        })
    }

    /**
     * Update value of from-to component
     *
     * @param valueOfDynamicField
     */
    private updateValueFromToComponent(formType: number) {
        let frm = this.formAssessmentArray.controls[formType - 1] as FormGroup
        this.assessmentCriteriaGroupList.forEach(criteriaGroup => {
            if (criteriaGroup.assessmentCriteriaGroupFormType === formType) {
                criteriaGroup.groupChildList.forEach(groupChild => {
                    groupChild.listAssessmentCriterias.forEach(criteria => {
                        this.assessmentCriteria.forEach(item => {
                            if (item.assessmentCriteriaCode === criteria.assessmentCriteriaCode && criteria.fieldType === ASSESSMENT_FIELD_TYPE.FROM_TO) {
                                const fromToValue = {
                                    from: frm.controls[criteria.assessmentCriteriaCode + "From"].value,
                                    to: frm.controls[criteria.assessmentCriteriaCode + "To"].value
                                }
                                item.assessmentCriteriaValue = JSON.stringify(fromToValue)
                            }
                        })
                    })
                })
            }
        })
    }

    /**
     * validate Field Type Ty le
     *
     * @param valueOfDynamicField
     */
    private validateFieldTypePercent(formType: number) {
        const frm = this.formAssessmentArray.controls[formType - 1] as FormGroup
        let criteriaPercentInvalidList: any[] = []
        this.assessmentCriteriaGroupList.forEach(criteriaGroup => {
            if (criteriaGroup.assessmentCriteriaGroupType === 2 && criteriaGroup.assessmentCriteriaGroupFormType === formType) {
                criteriaGroup.groupChildList.forEach(groupChild => {
                    groupChild.listAssessmentCriterias.forEach(criteria => {
                        if (criteria.fieldType === ASSESSMENT_FIELD_TYPE.PERCENT) {
                            const codes = criteria.assessmentCriteriaCode.split("_")
                            const prefix = codes[codes.length - 1]
                            const code = criteria.assessmentCriteriaCode.replace("_" + prefix, "")
                            let criteriaPercent = criteriaPercentInvalidList.find(item => item.assessmentCriteriaCode === code)
                            let criteriaValue = Number(frm.controls[criteria.assessmentCriteriaCode].value);
                            if (!criteriaPercent) {
                                criteriaPercent = {
                                    assessmentCriteriaCode: criteria.assessmentCriteriaCode,
                                    assessmentCriteriaName: criteria.assessmentCriteriaName,
                                    assessmentCriteriaValue: criteriaValue
                                }
                                criteriaPercentInvalidList.push(criteriaPercent)
                            } else {
                                criteriaPercent.assessmentCriteriaValue = criteriaPercent.assessmentCriteriaValue + criteriaValue
                            }
                        }
                    })
                })
            }
        })
        if (criteriaPercentInvalidList.length > 0) {
            criteriaPercentInvalidList.forEach(item => {
                if (!item) {
                    return;
                }
                if (item.assessmentCriteriaValue > 100) {
                    this.app.warningMessage('assessmentResult.Percent');
                    this.assessmentCriteriaValueError = true
                }
            })
        }
    }

    /**
     * Get assessment criteria label
     *
     * @param criteria assessment criteria
     * @param value value of criteria
     */
    private getAssessmentCriteriaLabel(criteria: any, value: any): string {
        let label = ''
        if ((criteria.fieldType === APP_CONSTANTS.FIELD_TYPE.COMBOBOX || criteria.fieldType === APP_CONSTANTS.FIELD_TYPE.RADIO_BUTTON)
            && criteria.fieldItems) {

            const items = criteria.fieldItems
            items.forEach(item => {
                if (value === item.value) {
                    label = item.label
                    return
                }
            })
        } else if ((criteria.fieldType === APP_CONSTANTS.FIELD_TYPE.SPINNER || criteria.fieldType === APP_CONSTANTS.FIELD_TYPE.STAR)
            && criteria.assessmentCriteriaRanks) {
            const rankList = JSON.parse(criteria.assessmentCriteriaRanks)
            rankList.forEach(rank => {
                if (value >= rank.startValue && value <= rank.endValue) {
                    label = rank.assessmentCriteriaRankName
                    return
                }
            })
        }
        return label
    }

    public exportCurriculumVitae() {
        if (this.employeeInfo && this.employeeInfo.employeeId) {
            this.curriculumVitaeService.exportCurriculumVitae(this.employeeInfo.employeeId).subscribe(res => {
                saveAs(res, 'So_yeu_ly_lich.docx');
            })
        }
    }

    public async exportAssessmentResult($event: any) {
        const formData = {
            assessmentPeriodId: this.assessmentPeriodId,
            employeeId: this.evaluateEmployeeData.employeeId || this.employeeInfo.employeeId,
            evaluatingLevel: this.result.viewAssessmentOrder ? this.result.viewAssessmentOrder : 1,
        }
        const modalRef = this.modalService.open(AssessmentSignPreviewModalComponent, {
            size: 'lg',
            backdrop: 'static',
            windowClass: 'dialog-preview-file modal-xxl',
            keyboard: false
        });
        modalRef.componentInstance.evaluateEmployeeData = formData;
        modalRef.componentInstance.showAction = false;
    }

    public pageLoad() {
        const pageOffset = this.pageOffset + 1
        const totalPages = Math.ceil(this.totalEmployee / this.perPage)
        return pageOffset <= totalPages ? pageOffset + '/' + totalPages : '0 / 0';
    }

    public exportOtherFormResult(employeeId: number, filePathName: string, offsetForm: number) {
        const assessmentEmployeeForm = {
            assessmentPeriodId: this.assessmentPeriodId,
            employeeId: employeeId,
            isFileSign: true,
            offsetForm: offsetForm
        }
        if (offsetForm == 0) {
            this.assessmentResultService.exportAssessmentResult(assessmentEmployeeForm).subscribe(res => {
                saveAs(res, filePathName.split(".")[0] + '.pdf');
            })
        } else {
            this.assessmentResultService.exportOtherFormResult(assessmentEmployeeForm).subscribe(res => {
                if (res.type === 'application/json') {
                    const reader = new FileReader();
                    reader.addEventListener('loadend', (e) => {
                        const text = e.srcElement['result'];
                        const json = JSON.parse(text);
                        this.assessmentResultService.processReturnMessage(json);
                    });
                    reader.readAsText(res);
                } else {
                    saveAs(res, filePathName.split(".")[0] + '.pdf')
                }
            })
        }
    }

    public exportAssessmentResult2(employeeId: number, fileInfo: any, index: number) {
        let assessmentEmployeeForm = {
            assessmentPeriodId: this.assessmentPeriodId,
            employeeId: employeeId,
            assessmentOrder: this.result.viewAssessmentOrder,
            fileIndex: index
        }
        this.assessmentEmployeeLevelService.exportFile(assessmentEmployeeForm).subscribe(res => {
            saveAs(res, fileInfo.fileName);
        })
    }

    public makeFileName(filePathName: string) {
        return filePathName.split(".")[0];
    }

    /**
     * onChangeAssessmentStatisticType
     * @param event
     */
    public exportAssessmentResultFromVoffice(assessmentResultId: number) {
        const assessmentEmployeeForm = {
            assessmentResultId: assessmentResultId
        }
        this.assessmentResultService.exportAssessmentResultFromVoffice(assessmentEmployeeForm).subscribe(res => {
            saveAs(res, 'Ket_qua_trinh_ky.pdf')
        })
    }

    public onChangeAssessmentStatisticType(event?) {
        if (event && event === 1) {
            this.assessmentStatusStatistics = true
            this.resultOfAssessment = false
        } else if (event && event === 2) {
            this.resultOfAssessment = true
            this.assessmentStatusStatistics = false
        }
    }

    /**
     * assessment evaluate again
     */
    public processReEvaluateEmployee() {
        this.modalRefReEvaluate = this.modalService.open(AssessmentEvaluateEmployeeAgainComponent, {
            size: 'lg',
            backdrop: 'static',
            windowClass: 'dialog-assessment-custom'
        })
        this.modalRefReEvaluate.componentInstance.isNewTheme = true;
        this.modalRefReEvaluate.componentInstance.setData({
            assessmentResultId: this.evaluateEmployeeData.assessmentResultId,
            employeeId: this.evaluateEmployeeData.employeeId,
            assessmentPeriodId: this.evaluateEmployeeData.assessmentPeriodId,
            assessmentOrder: this.evaluatingLevel
        });
        this.modalRefReEvaluate.result.then((result) => {
            if (!result) {
                return;
            } else {
                this.app.successMessage('assessmentResult.reEvaluate');
                this.movePageBack()
            }
        });
    }

    /**
     * update Rank Label
     *
     * @param event
     * @param criteria
     */
    public updateRankLabel(event, criteria: any) {
        if (criteria.assessmentCriteriaRanks &&
            (criteria.fieldType === APP_CONSTANTS.FIELD_TYPE.SPINNER || criteria.fieldType === APP_CONSTANTS.FIELD_TYPE.STAR)) {
            const rankList = JSON.parse(criteria.assessmentCriteriaRanks)
            let rankLabel = ''
            let rankColor = ''
            rankList.forEach(rank => {
                if (rank.startValue <= event.value && event.value <= rank.endValue) {
                    rankLabel = rank.assessmentCriteriaRankName
                    rankColor = rank.colorPicker
                    return
                }
            })
            criteria.assessmentCriteriaRankLabel = rankLabel
            criteria.assessmentCriteriaRankColor = rankColor
            //this.disableLatch = false;
        }
    }

    private findCriteria(code, formType: number) {
        for (let i = 0; i < this.assessmentCriteriaGroupList.length; i++) {
            if (this.assessmentCriteriaGroupList[i].assessmentCriteriaGroupFormType === formType) {
                let groupChild = this.assessmentCriteriaGroupList[i].groupChildList;
                for (let j = 0; j < groupChild.length; j++) {
                    let listAssessmentCriterias = groupChild[j].listAssessmentCriterias;
                    for (let t = 0; t < listAssessmentCriterias.length; t++) {
                        if (listAssessmentCriterias[t].assessmentCriteriaCode === code) {
                            return listAssessmentCriterias[t];
                        }
                    }
                }
            }
        }
    }

    /**
     * update Rank Label
     *
     * @param event
     * @param criteria
     */
    private updateRankLabelForEval(criteria, item, formType: number) {
        if (criteria && criteria.assessmentCriteriaRanks
            && (criteria.fieldType === APP_CONSTANTS.FIELD_TYPE.SPINNER
                || criteria.fieldType === APP_CONSTANTS.FIELD_TYPE.STAR)) {
            const rankList = JSON.parse(criteria.assessmentCriteriaRanks)
            let rankLabel = ''
            const frm = this.formAssessmentArray.controls[formType - 1] as FormGroup
            item.assessmentCriteriaValue = frm.controls[item.assessmentCriteriaCode].value;
            rankList.forEach(rank => {
                if (rank.startValue <= item.assessmentCriteriaValue && item.assessmentCriteriaValue <= rank.endValue) {
                    rankLabel = rank.assessmentCriteriaRankName;
                    return
                }
            })
            item.assessmentCriteriaLabel = rankLabel;
            //this.disableLatch = false;
        }
    }

    /**
     * On change value of assessment criteria special (ComboBox, Radio-button, Spinner, Star, TextBox)
     *
     * @param event
     * @param criteria assessment criteria
     */
    public onChangeAssessmentSpecial(event, criteria: any, j?, value?) {
        //this.disableLatch = true;
        if (j !== undefined) {
            this.fAssessmentArray[j].controls[criteria.assessmentCriteriaCode].setValue(value);
        }
        this.updateRankLabel(event, criteria)
        for (let index = 0; index < this.formAssessmentArray.controls.length; index++) {
            const formType = index + 1;
            const frm = this.formAssessmentArray.controls[formType - 1] as FormGroup
            this.assessmentCriteria.forEach(item => {
                if (item.assessmentCriteriaCode === criteria.assessmentCriteriaCode) {
                    item.assessmentCriteriaLabel = this.getAssessmentCriteriaLabel(criteria, frm.value[criteria.assessmentCriteriaCode])
                }
            })
            this.updateValueOfDynamicField(frm.value, formType)
            this.evaluateEmployeeData.listCriteria = this.assessmentCriteria
            if (this.isHaveInTheFormula.includes(criteria.assessmentCriteriaCode)) {
                //this.processCalculateAssessmentTimeout()
            }
        }
    }

    /**
     * On change value of assessment criteria special (ComboBox, Radio-button, Spinner, Star, TextBox)
     *
     * @param event
     * @param criteria assessment criteria
     */
    public onChangeAssessmentSpecialV2(data) {
        for (let index = 0; index < this.formAssessmentArray.controls.length; index++) {
            const formType = index + 1;
            const criteria = this.findCriteria(data.assessmentCriteriaCode, formType);
            if (!criteria) {
                continue;
            }
            //this.disableLatch = true;
            this.updateRankLabelForEval(criteria, data, formType);
            const frm = this.formAssessmentArray.controls[formType - 1] as FormGroup
            this.assessmentCriteria.forEach(item => {
                if (item.assessmentCriteriaCode === criteria.assessmentCriteriaCode && frm.controls[criteria.assessmentCriteriaCode]) {
                    item.assessmentCriteriaLabel = this.getAssessmentCriteriaLabel(criteria, frm.controls[criteria.assessmentCriteriaCode].value)
                }
            })
            this.updateValueOfDynamicField(frm.value, formType)
            //this.evaluateEmployeeData.listCriteria = this.assessmentCriteria
            // if (this.isHaveInTheFormula.includes(criteria.assessmentCriteriaCode)) {
            //   this.processCalculateAssessmentTimeout()
            // }
        }
    }

    /**
     * processCalculateAssessmentTimeout
     */
    // public processCalculateAssessmentTimeout() {
    //   if (this.fnCalculateAssessment) {
    //     clearTimeout(this.fnCalculateAssessment);
    //   }
    //   this.disableButton = true;
    //   this.fnCalculateAssessment = setTimeout(() => {
    //     this.assessmentResultService.calculateAssessment(this.evaluateEmployeeData).subscribe(res => {
    //       if (this.assessmentResultService.requestIsSuccess(res)) {
    //         this.disableButton = false;
    //         this.result = res.data
    //         if (this.result) {
    //           this.result.assessmentPoint = this.result.assessmentPoint.toFixed(1);
    //           //this.disableLatch = false;
    //         }
    //
    //       }
    //     })
    //   }, 1000);
    // }

    /**
     * prepare send notification
     */
    public prepareSendNotification(employeeId: number) {
        // show popup
        this.modalRefNotification = this.modalService.open(AssessmentNotificationComponent, {
            size: 'lg',
            backdrop: 'static',
            windowClass: 'dialog-assessment-custom'
        })
        // TODO send few data can user.
        this.modalRefNotification.componentInstance.setData(this.assessmentPeriodId, employeeId)
    }

    public addPlusCircle(criteriaGroup: any) {
        let newGroupChild = _.cloneDeep(criteriaGroup.groupChildList[criteriaGroup.groupChildList.length - 1])
        let idx: number = 0
        if (criteriaGroup.groupChildList.length > 1) {
            const codes = newGroupChild.listAssessmentCriterias[0].assessmentCriteriaCode.split("_")
            idx = Number(codes[codes.length - 1].replace("COPY", ""))
        }
        newGroupChild.listAssessmentCriterias.forEach((criteria) => {
            if (idx === 0) {
                criteria.assessmentCriteriaCode = criteria.assessmentCriteriaCode + "_COPY" + 1
            } else {
                criteria.assessmentCriteriaCode = criteria.assessmentCriteriaCode.replace("_COPY" + idx, "_COPY" + (idx + 1))
            }
        })
        criteriaGroup.groupChildList.push(newGroupChild)
        this.reBuildAssessmentCriteriaListForm(newGroupChild.listAssessmentCriterias, this.getFormType())
    }

    public removeCircle(criteriaGroup: any, index: number) {
        const groupChildDelete = criteriaGroup.groupChildList[index]
        criteriaGroup.groupChildList.splice(index, 1)
        const criteriaCodeDeleteList: any[] = []
        groupChildDelete.listAssessmentCriterias.forEach(item => {
            criteriaCodeDeleteList.push(item.assessmentCriteriaCode)
        });
        this.assessmentCriteria = this.assessmentCriteria.filter(criteria => !criteriaCodeDeleteList.includes(criteria.assessmentCriteriaCode))
        this.buildAssessmentDynamicForm(this.getFormType())
    }

    private getFormType(): number {
        return this.activeIndex + 1;
    }

    private reBuildAssessmentCriteriaListForm(listAssessmentCriterias, formType: number) {
        let validateFieldFromToList = []
        this.buildAssessmentCriteriaForm(validateFieldFromToList, listAssessmentCriterias, formType)
        if (validateFieldFromToList.length > 0) {
            let frm = this.formAssessmentArray.controls[formType - 1] as FormGroup
            frm.setValidators(validateFieldFromToList);
            frm.updateValueAndValidity();
        }
    }

    /**
     * action unlatch
     */
    public unlatch() {
        this.app.confirmMessage('assessmentResult.confirmUnlatch', () => {
            // accept
            this.assessmentResultService.unlatch({
                assessmentResultId: this.evaluateEmployeeData.assessmentResultId
            }).subscribe(res => {
                if (this.assessmentResultService.requestIsSuccess(res)) {
                    this.app.successMessage('assessmentResult.unlatch');
                    this.prepareEvaluateEmployee(this.evaluateEmployeeInfo);
                }
            })
        }, (
            // reject
        ) => {
        })
    }

    /**
     * action show history log
     */
    public showHistoryLog() {
        this.modalRefHistory = this.modalService.open(AssessmentHistoryLogV2Component, {
            size: 'lg',
            backdrop: 'static',
            windowClass: 'dialog-assessment-custom'
        });
        const requestData = {
            assessmentPeriodId: this.assessmentPeriodId,
            employeeId: this.evaluateEmployeeInfo.employeeId,
        }
        this.modalRefHistory.componentInstance.setParamsRequest(requestData);
    }

    public ShowValueJudgment() {
        this.modalRefHistory = this.modalService.open(EvaluationProcessComponent, {
            size: 'lg',
            backdrop: 'static',
            windowClass: 'dialog-assessment-custom'
        });
        const requestData = {
            assessmentPeriodId: this.assessmentPeriodId,
            employeeId: this.evaluateEmployeeInfo.employeeId,
            assessmentObject: this.result.assessmentObject
        }
        this.modalRefHistory.componentInstance.setParamsRequest(requestData);
    }

    getHistory() {
        var temp = this.evaluatingLevel;
        if (this.employeeInfo.assessmentNextOrder == 0) {
            temp += 1;
        }
        if (!this.employeeInfo.assessmentNextOrder) {
            temp = this.employeeInfo.maxOrder ? this.employeeInfo.maxOrder : 1;
        }
        let paramsRequest = {
            assessmentPeriodId: this.assessmentPeriodId,
            employeeId: this.evaluateEmployeeData.employeeId,
            isAdmin: this.result.hasAdminAssessment ? this.result.hasAdminAssessment : 0,
            maxOrder: this.employeeInfo.maxOrder ? this.employeeInfo.maxOrder : 1,
            evaluatingLevel: this.employeeInfo.evaluatingLevel ? this.employeeInfo.evaluatingLevel : 1,
            employeeCode: this.employeeInfo.employeeCode
        }
        let evaluatingLevelCurrent = this.employeeInfo.evaluatingLevel
        if (evaluatingLevelCurrent == null) {
            evaluatingLevelCurrent = 0;
        }

        this.assessmentPeriodService.getAssessmentLevelListV2(paramsRequest).subscribe(res => {
                this.assessmentLevelInfoList = res
                let index = this.assessmentLevelInfoList.findIndex(x => x.assessmentOrder === this.currentEvaluate);
                if (index < 0) {
                    index = 0;
                }
                this.currentTab = index;
                // danh sach tieu tri danh gia
                this.processGetInfoByLevel(index, this.assessmentLevelInfoList[index].formTypeList)
                // danh sach dot danh gia
                if (res) {
                    let data = [];
                    res.forEach((element, idx) => {
                        let icon = null;
                        if (element.assessmentOrder <= evaluatingLevelCurrent) {
                            icon = 'pi pi-check-circle';
                        }
                        data.push({
                            icon: icon,
                            label: (idx + 1) + ". " + element.assessmentLevelName,
                            command: (event) => {
                                this.processGetInfoByLevel(idx, element.formTypeList)
                            }
                        })
                    });
                    this.tabActive = data[index];
                    this.listTab = data;
                    this.showListDetail = true;
                }
            }
        )
    }

    processGetInfoByLevel(index, formTypeList: AssessmentFormType[]) {//TODO
        this.items = [];
        formTypeList.forEach(formType => {
            this.items.push({label: formType.formTypeName})
        });
        this.formAssessment = new FormGroup({formAssessmentArray: this.buildFormsAssessmentArray(formTypeList.length)});
        this.activeIndex = 0;
        this.activeTab = index;
        var temp = this.evaluatingLevel;
        if (this.result.assessmentNextOrder == 0) {
            temp += 1;
        }
        let paramsRequestFirst = {
            assessmentPeriodId: this.assessmentPeriodId
            , employeeId: this.employeeInfo.employeeId
            , assessmentOrder: this.employeeInfo.assessmentNextOrder ? this.employeeInfo.assessmentNextOrder : temp
            , isAdmin: this.result.hasAdminAssessment ? this.result.hasAdminAssessment : 0
            , employeeCodeLevel: this.assessmentLevelInfoList[index].employeeCodeLevel
            , assessmentLevelId: this.assessmentLevelInfoList[index].assessmentLevelId
        };
        if (!paramsRequestFirst.assessmentOrder) {
            paramsRequestFirst.assessmentOrder = this.assessmentLevelInfoList[index].assessmentOrder;
        }

        // if(this.currentEvaluate == paramsRequestFirst.assessmentOrder){
        //   delete paramsRequestFirst.showHistory;
        // }
        this.assessmentResultService.getAssessmentEmployeeInfo(paramsRequestFirst).subscribe(res => {
            this.assessmentLevelName = res.data.assessmentLevelName
            this.result = res.data
            if (this.result) {
                if (this.result.assessmentPoint) {
                    this.result.assessmentPoint = this.result.assessmentPoint.toFixed(1)
                }
            }
            if (this.result.assessmentType) {
                this.assessmentType = this.result.assessmentType
            }
            if (this.employeeInfo.employeeCode === this.staffCode) {
                //cá nhân
                this.isHasEvaluating = this.currentTab === this.activeTab
                    && (this.result.assessmentNextOrder === 1 || this.result.assessmentNextOrder === this.result.assessmentOrder);
            } else {//người khác vào đánh giá
                // có đang view tại tab cá nhân tự đánh giá hay không?
                const selfUpdate = this.result.viewAssessmentOrder == 1;// là đang xem cấp cá nhân tự đánh giá
                const hasPermissionSelfUpdate = this.result.isUpdateSelfStaffEvaluate && selfUpdate;
                this.isHasEvaluating = (this.currentTab === this.activeTab && res.data.assessmentNextOrder === res.data.assessmentOrder) || hasPermissionSelfUpdate;
            }
            this.haveClose = res.data.haveClose
            this.evaluatingLevel = res.data.assessmentOrder
            if (res.data.assessmentCriteria) {
                this.assessmentCriteria = JSON.parse(res.data.assessmentCriteria)
            }
            if (res.data.assessmentCriteriaDisableIds) {
                this.assessmentCriteriaDisableIds = res.data.assessmentCriteriaDisableIds

            }
            if (res.data.isHaveInTheFormula) {
                this.isHaveInTheFormula = res.data.isHaveInTheFormula
            }
            if (res.data['assessmentResultId']) {
                this.evaluateEmployeeData['assessmentResultId'] = res.data['assessmentResultId']
            }
            this.evaluateEmployeeInfo = res.data.employeeGeneralInfo;
            this.managerId = res.data.managerId;
            this.hasSignature = (res.data.signStatus === 0 || res.data.signStatus === 2)
                && res.data.assessmentNextOrder === 0 && (!this.currPeriod || this.currPeriod.isPartyMemberAssessment !== 1)
            this.hasAdminAssessment = (res.data.signStatus === 0 || res.data.signStatus === 2)
                && res.data.assessmentNextOrder === 0 && res.data.hasAdminAssessment
            this.isDisplayBtnHistory = true;
            // this.isDisplayBtnHistory = res.data.evaluatingLevel !== null && (res.data.assessmentOrder > 1 || res.data.hasAdminAssessment)
            this.isDisplayBtnExport = res.data.evaluatingLevel !== null;
            this.rebuildForm(res.data);
            this.currentPage = ALL_ASSESSMENT_EMPLOYEE_PAGE.ASSESSMENT_PAGE;
            const that = this;
            setTimeout(function () {
                // that.viewHeight = that.headerEmployeeRef.nativeElement.offsetHeight + 10;
            }, 100);
            this.assessmentEmployeeLevelStatus = res.data.assessmentEmployeeLevelBO.assessmentResultStatus;
            this.handleCheckAction();
        })
    }

    handleCheckAction() {
        const allowSave = (this.isHasEvaluating && (this.assessmentEmployeeLevelStatus == null || this.assessmentEmployeeLevelStatus == 0 || this.assessmentEmployeeLevelStatus == 2 || this.assessmentEmployeeLevelStatus == 4));
        const allowSubmit = this.isHasEvaluating && this.haveClose
            && (this.evaluatingLevel === 1 || (this.evaluatingLevel === 2 && this.managerId === this.userLogin));
        const allowSign = this.isHasEvaluating && ((this.evaluatingLevel === 2 && this.managerId !== this.userLogin) ||
                this.evaluatingLevel === 3 || this.evaluatingLevel === 4 || this.evaluatingLevel === 5 || this.evaluatingLevel === 6 || this.evaluatingLevel === 7)
            && (this.assessmentEmployeeLevelStatus == null || this.assessmentEmployeeLevelStatus == 0 || this.assessmentEmployeeLevelStatus == 2 || this.assessmentEmployeeLevelStatus == 4);
        const allowReEvaluate = allowSave && this.evaluatingLevel !== 1;
        let allowExportResult = false;
        if (this.result && this.result.assessmentEmployeeLevelBO) {
            allowExportResult = this.result.assessmentEmployeeLevelBO.status != 0;
        }
        const allowHistoryEvaluate = this.isDisplayBtnHistory;

        this.listActionControl['SAVE'] = allowSave;
        this.listActionControl['SUBMIT'] = allowSubmit;
        this.listActionControl['SIGNING'] = allowSign;

//Hiển thị button Yêu cầu đánh giá lại khi :
//User login có quyền đánh giá tại cấp đang focus.
//Cấp tương ứng có trạng thái khác: Đang trình ký, Đã nộp, Đã ký (assessment_result_status khác 1, 3, 4)
        this.listActionControl['REEVALUATE'] = this.result.allowReEvaluate;
        this.listActionControl['EXPORT_RESULT_EVALUATE'] = allowExportResult;
        this.listActionControl['HISTORY_EVALUATE'] = allowHistoryEvaluate;
    }

    /**
     * Build form assessment array
     */
    private buildFormsAssessmentArray(formSize: number): FormArray {
        let controls = new FormArray([])
        for (let index = 0; index < formSize; index++) {
            controls.push(this.buildForm({}, {}));
        }
        return controls;
    }

    /**
     * action show history assessment result of employee
     */
    public showAssessmentResultHistory(employee: any) {
        this.modalRefHistory = this.modalService.open(AssessmentHistoryLogComponent, ASSESSMENT_HISTORY_MODAL_OPTIONS);
        const requestData = {
            evaluateEmployeeInfo: {
                employeeCode: employee.employeeCode,
                employeeFullName: employee.employeeFullName,
                positionName: employee.positionName,
                empTypeName: employee.empTypeName

            },
            result: {
                assessmentPoint: employee.assessmentPoint,
                assessmentResult: employee.assessmentResult
            },
            paramsRequest: {
                assessmentPeriodId: this.assessmentPeriodId,
                employeeId: employee.employeeId,
                assessmentOrder: employee.evaluatingLevel,
                isAdmin: true
            }
        }
        this.modalRefHistory.componentInstance.setParamsRequest(requestData);
    }

    public getLength(val) {
        return val.replace(/\n/g, '\r\n').length
    }

    openFullscreen() {
        if (this.elem.requestFullscreen) {
            this.elem.requestFullscreen();
        } else if (this.elem.mozRequestFullScreen) {
            /* Firefox */
            this.elem.mozRequestFullScreen();
        } else if (this.elem.webkitRequestFullscreen) {
            /* Chrome, Safari and Opera */
            this.elem.webkitRequestFullscreen();
        } else if (this.elem.msRequestFullscreen) {
            /* IE/Edge */
            this.elem.msRequestFullscreen();
        }
    }

    logout() {
        CommonUtils.logoutAssessmentSystem();
        //this.router.navigate(['/home-page']);
    }

    scrollToTop() {
        document.getElementById("bodyFormAssessment").scrollIntoView({behavior: "smooth"})
    }

    checkFunc2(args) {
        console.log(">>>>>> here: ", args);
    }

    clickAction(event, item: any) {
        if (item && item.action) {
            CommonUtils.executeFunctionByName(item.action, this, event);
        }
    }

    hanldeCollapsed() {
        const formAssessment = document.getElementById('formAssessment');
        formAssessment.classList.toggle("collapsed")
    }

    async downloadAssessmentResult(event, employee) {
        if (employee) {
            this.employeeInfo = employee;
            this.evaluateEmployeeData = {
                assessmentPeriodId: this.assessmentPeriodId,
                employeeId: employee.employeeId
            };
            await this.exportAssessmentResult(event);
        }
    }

    suggestCriticalList(posiTem) {
        // if (this.assessmentType && this.assessmentType == "DGCB") {
        //     let en = UrlConfig.clientAddress
        //     this.assessmentPeriodService.getPreviousPartyAssessmentPeriod().subscribe(res => {
        //         if(res){
        //             let id = res
        //             let url = `${en}/assessment/detail/${id}/${this.employeeInfo.employeeCode}`
        //             window.open(url,'_blank')
        //         }
        //     })
        //
        // } else {
            let listAssessmentCriteriasCode = [];
            for (let index = 0; index < this.formAssessmentArray.controls.length; index++) {
                const formType = index + 1;
                const frm = this.formAssessmentArray.controls[index] as FormGroup
                if (index == posiTem) {
                    for (let index1 = 0; index1 < this.listAssessmentCriterias.length; index1++) {
                        if (this.listAssessmentCriterias[index1].assessmentCriteriaGroupFormType == posiTem + 1) {
                            listAssessmentCriteriasCode.push(this.listAssessmentCriterias[index1].assessmentCriteriaCode)
                        }
                    }
                    const formRequest = {
                        assessmentPeriodId: this.assessmentPeriodId,
                        employeeId: this.employeeInfo.employeeId,
                        assessmentCriteria: listAssessmentCriteriasCode.join(",")
                    };
                    this.app.confirmMessageNoCode("Đ/c có muốn tham khảo nội dung NXDG kỳ trước không ?", () => {
                        this.assessmentResultService.getPreviousResult(formRequest).subscribe(res => {
                            res.forEach((item: any, index: number) => {
                                if (item.value != null) {
                                    frm.controls[item.assessmentCriteria].setValue(item.value)
                                }
                            })
                        })
                    }, () => {
                    });
                }
            }
        // }
    }
    onChangeYear() {
        this.assessmentPeriodList = this.assessmentPeriodListNew.filter(e=> new Date(e.effectiveDate).getFullYear() == this.fSearch['year'].value)
    }
}
