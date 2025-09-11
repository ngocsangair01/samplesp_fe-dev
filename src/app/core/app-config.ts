export const CONFIG: any = {
    API_PATH: {
        /********************OAUTH SERVICE*****************/
        'oauthToken': '/',
        /********************File SYSTEM****************/
        'fileStorage': '/file',
        /********************Political SYSTEM*****************/
        'employeeInfo': '/v1/employee/employee-infos',
        'homeEmployee': '/v1/homes',
        'dataPicker': '/v1/data-pickers',
        'orgSelector': '/v1/org-selectors',//done
        'organization': '/v1/organizations',
        'partyOrgSelector': '/v1/party-org-selectors',//done
        'managerPartyOrg': '/v1/party-organization/manager-party-organizations',
        'partyPosition': '/v1/party-organization/party-positions',
        'partyMembers': '/v1/party-organization/party-members',
        'partyReport': '/v1/party-reports',
        'groupOrgPositionReport': '/v1/group-org-position-reports',
        'curriculum-vitae': '/v1/employee/curriculum-vitae',
        'education-process': '/v1/education-process',
        'retired-contact': '/v1/employee/retired-contact',
        'app-params': '/v1/app-params',
        'notification': '/v1/notifications',
        'emp-types': '/v1/emp-types',
        'dashboard': '/v1/dash-board',
        'document': '/v1/documents',
        'document-types': '/v1/document-types',
        'sys-cat': '/v1/sys-cats',
        'nation': '/v1/nations',
        'province': '/v1/provinces',
        'district': '/v1/districts',
        'partyTermination': '/v1/party-organization/party-terminations',
        'empTypeProcess': '/v1/employee/emp-type-process',
        'category': '/v1/category',
        'cateType': '/v1/category-types',
        'emailSmsDynamic': '/v1/email-sms-dynamic',
        'account': '/v1/account',
        'employee-profile': '/v1/emp-files',
        'group-org-position': '/v1/group-org-positions',
        'email-sms-history': '/v1/email-sms-history',
        'email-sms-log': '/v1/email-sms-log',
        'email-sms-history-bk': '/v1/email-sms-history-bk',
        'labourContractType': '/v1/labour-contract-types',
        'labourContractDetail': '/v1/labour-contract-details',
        'employee-t63-infomation': '/v1/employee/employee-t63-infomations',
        'organization-tree': '/v1/organizations',
        'employee-image': '/v1/employee/curriculum-vitae/employee-image',
        'massOrgSelector': '/v1/mass-org-selectors',//done
        'managerMassOrg': '/v1/mass-organization/manager-mass-organizations',
        'transferPartyMember': '/v1/transfer-party-member',
        'transferPartyMemberWarning': '/v1/transfer-party-member-warning',
        'partyMemberConcurrentProcess': '/v1/party-member-concurrent-process',
        'requestResolutionMonth': '/v1/party-organization/request-resolution-month',
        'responseResolutionMonth': '/v1/response-resolution-month',
        'sign-document': '/v1/sign-manager',
        'religionReport': '/v1/religion-reports',
        'resolutionQuarterYear': '/v1/request-resolutions',
        'criteriaPlan': '/v1/criteria-plan',
        'requestProcessTree': '/v1/request-process-tree',
        'requestOrgTree': '/v1/request-org-tree',
        'retirementReport': '/v1/retirement-reports',
        'employeeReport': '/v1/employee-report',
        'deathGratuityReport': '/v1/death-gratuity-report',
        'empTypePolicyReport': '/v1/emp-type-policy-report',
        'managerMassPosition': '/v1/mass-positions',
        'assessment': '/v1/employee/assessment',
        'requestDemocraticMeeting': '/v1/request-democratic-meeting',
        'democraticMeeting': '/v1/democratic-meeting',
        'receiveNotificationGroup': '/v1/receive-notification-group',
        'employeeMembers': '/v1/mass-members',
        'massRequest': '/v1/mass-request',
        'massCriteria': '/v1/mass-criteria',
        'rewardProposal': '/v1/propaganda-reward-proposal',
        'rewardForm': '/v1/propaganda-reward-form',
        'employeeLongLeaveReport': '/v1/employee-long-leave-report',
        'orgDemocraticMeetingReport': '/v1/org-democratic-meeting-report',
        'qualityAnalysisPartyOrg': '/v1/quality-analysis-party-org',
        'qualityAnalysisPartyMember': '/v1/quality-analysis-party-member',
        'rewarDecide': '/v1/propaganda-reward-decide',
        'rewardPartyOrganization': '/v1/reward-party-organizations',
        'rewardPartyMember': '/v1/reward-party-members',
        'rewardPartyReport': '/v1/reward-party-reports',
        'qualityAnalysisPartyReport': '/v1/quality-analysis-party',
        'partyMemberReport': '/v1/party-organization/party-member-report',
        'employeePolicy': '/v1/employee-policy',
        'questionAndAnswer': '/v1/question-answer',
        'partyCongress': '/v1/party-congress-employee',
        'employeeAssessmentReport': '/v1/employee-assessment-report',
        'partyCriticize': '/v1/party-criticize',
        'transferEmployee': '/v1/transfer-employee',
        'generalStandardPositionGroup': '/v1/general-standard-position-group',
        'privateStandardPositionGroup': '/v1/private-standard-position-group',
        'vicinityPositionPlan': '/v1/vicinity-position-plan',
        'vicinityEmployeePlan': '/v1/vicinity-employee-plan',
        'massCriteriaResponse': '/v1/mass-criteria-response',
        'requestPolicyProgram': '/v1/request-policy-program',
        'responsePolicyProgram': '/v1/response-policy-program',
        'importResponsePolicyProgram': '/v1/import-response-policy-program',
        'workProcess': '/v1/work-process',
        'keyProjectEmployee': '/v1/key-project-employee',
        'studyAbroad': '/v1/study-abroad',
        'workedAbroad': '/v1/worked-abroad',
        'relativeAbroad': '/v1/relative-abroad',
        'politicsQuality': '/v1/politics-quality',
        'personnelKey': '/v1/personnel-key',
        'keyProject': '/v1/key-projects',
        'empManagementVertical': '/v1/emp-management-vertical',
        'disciplineViolationReport': '/v1/discipline-violations',
        'securityPermisstion': '/v1/security-protection-permisstion',
        'partyPunishment': '/v1/party-punishments',
        'personalPunishment': '/v1/punishments',
        'reportPunishment': '/v1/report-punishments',
        'reportWorkWarningSecurity': '/v1/report-work-warnings',
        'reportDynamic': '/v1/report-dynamics',
        'sysProperty': '/v1/sys-properties',
        'rewardThought': '/v1/propaganda-reward-thought',
        'rewardThoughtReport': '/v1/propaganda-reward-usecase-process',
        'rewardThoughtReportResult': '/v1/reward-thought-report/process-result',
        'warningManager': '/v1/warning-manager',
        'staffAssessmentCriteriaGroup': '/v1/assessment-criteria-group',
        'staffAssessmentCriteria': '/v1/assessment-criteria',
        'assessmentFormula': '/v1/assessment-formula',
        //settings
        'settingIcon': '/v1/setting-icon',
        'objRemindConfig': '/v1/obj-remind-config',
        'settingVersCtrl': '/v1/version-control',
        //end setting
        'assessmentEmployee': '/v1/assessment-employee',
        'assessmentEmployeeLevel': '/v1/assessment-employee-level',
        'assessmentResult': '/v1/assessment-results',
        'assessmentPeriod': '/v1/assessment-period',
        'inspectionPlan': '/v1/inspection-plan',
        'letterDenunciation': '/v1/letter-denunciation',
        'handlingLetterDenunciation': '/v1/handling-letter-denunciation',
        'ideologicalExpressionReport': '/v1/ideological-expression-report',
        'partyHome': '/v1/party-organization/home', // 203
        'partyMemberDecision': '/v1/party-member-decisions',
        // d2t start 06092021
        'partyMemberProfileType': '/v1/party-member-profile-type',
        'partyMemberProfile': '/v1/party-member-profile',
        'request-report': '/v1/report/request-report',
        'request-periodic-reporting': '/v1/report/request-periodic-reporting',
        'report-config': '/v1/report/report-config',
        'dynamic-api': '/v1/dynamic-api',
        // d2t end
        'template-notify': '/v1/admin/template-notify',
        'report-submission': '/v1/report/report-submission',
        'report-manager': '/v1/report/report-manager',
        'fundManagement': '/v1/fund/fund-management', // 203
        'fundContribution': '/v1/fund/fund-contribution', // 203
        'fundActivity': '/v1/fund/fund-activity', // 214
        'assessmentPartyOrganization': '/v1/assessment-party-organization',
        'assessmentPartySigner': '/v1/assessment-party-signer',
        'rewardPropose': '/v1/reward/reward-propose',
        'rewardProposeSign': '/v1/reward/reward-propose-sign',
        'adScheduler': '/v1/ad-scheduler',
        'adTable': '/v1/ad-table',
        'assessmentReport': '/v1/assessment/report',
        'rewardGeneral': '/v1/reward/reward-general',
        'rewardCategory': '/v1/reward/reward-category',
        'rewardCategoryFunding': '/v1/reward/reward-category-funding',
        'rewardCategoryCentificate': '/v1/reward/reward-category-certificate',
        'massGroup': '/v1/mass-group',
        'cat-allowance': '/v1/allowance-category',
        'export-dynamic': '/v1/export-dynamics',
        'emp-allowance': '/v1/emp-allowance',
        'empArmyProposed': '/v1/employee/emp-army-proposed',
        'empArmyProposedReport': '/v1/employee/emp-army-proposed/report',
        'empArmyProposedDetail': '/v1/employee/army-proposed-detail',
        'configArmyCondition': '/v1/employee/config-army-condition',
        'armyProposedTemplate': '/v1/employee/army-proposed-template',
// #225 start
        'subsidizedPeriod': '/v1/subsidized/subsidized-period',
        'subsidizedInfo': '/v1/subsidized/subsidized-info',
        'subsidizedBeneficiary': '/v1/subsidized/subsidized-beneficiary',
        'catAllowance': '/v1/subsidized/cat-allowance',
        // #225 end
        // #239 start
        'assessmentSumary': '/v1/assessment-sumary',
        'expressionReportRecored': '/v1/expression-request-report',
        'vfs-invoice': '/v1/reward/vfs-invoice',
        'vfs-reimbursement': '/v1/reward/reward-reimbursement',
        'vfs-pit-appendix': '/v1/reward/vfs-pit-appendix',
        // #239 end
        'competition-program': '/competition-program',
        'competition': '/competition',
        'competition-result': '/competition/result',
        'accepted-employee': '/accepted-employee',
        // welfare policy
        'welfare-policy-category': '/v1/welfare-policy-category',
        'welfare-policy-request': '/v1/welfare-policy-request',
        'welfare-policy-proposal': '/v1/welfare-policy-proposal',
        'allowance-period': '/v1/allowance-period',
        'allowance-proposal-sign': '/v1/allowance-proposal-sign',
        'allowance-proposal': '/v1/allowance-proposal',
        'allowance-proposal-approval': '/v1/allowance-proposal-approval',
        'emp-allowance-request': '/v1/emp-allowance-request',
        'mobile-config': '/v1/mobile-config',

        'thorough-content': '/v1/thorough-content',
        'exam-question-set': '/v1/exam-question-set',
        'emp-thorough-content': '/v1/emp-thorough-content',
        'task': '/v1/task',
        'training-topic': '/v1/training-topic',
        // import party_report_detail
        'partyReportDetail': '/v1/party_report_detail',
        // Quản lý kết nạp
        'partyCandidate': '/v1/party-candidate'
    }
};
export const ICON_MENU: any = {
    //--------------------- Tuyên huấn ---------------------//

    'CTCT_TH_DB': 'icon-dashboard.svg',
    'CTCT_TH_QTKT': 'icon-reward.svg',
    'CTCT_BHTT': 'icon-ideological-work.svg',
    'CTCT_TH_QT': 'icon-ideological-work.svg',
    'CTCT_TH_QLBCKH': 'icon-plan-report.svg',
    'CTCT_TH_QLTĐ': 'icon-competition.svg',
    'bao-cao-tuyen-huan': 'icon-report.svg',
    'CTCT_TH_TLHDNV': 'icon-document.svg',
    //---------------- BOLD ----------------//
    'CTCT_TH_DB_BOLD': 'icon-dashboard-bold.svg',
    'CTCT_TH_QTKT_BOLD': 'icon-reward-bold.svg',
    'CTCT_BHTT_BOLD': 'icon-ideological-work-bold.svg',
    'CTCT_TH_QT_BOLD': 'icon-ideological-work-bold.svg',
    'CTCT_TH_QLBCKH_BOLD': 'icon-plan-report-bold.svg',
    'CTCT_TH_QLTĐ_BOLD': 'icon-competition-bold.svg',
    'bao-cao-tuyen-huan_BOLD': 'icon-report-bold.svg',
    'CTCT_TH_TLHDNV_BOLD': 'icon-document-bold.svg',

    //--------------------- Tổ chức Đảng ---------------------//

    'CTCT_TCD_HOME': 'icon-dashboard.svg',
    'CTCT_TCD_QLDV': 'icon-member.svg',
    'CTCT_TCD_QLTCD': 'icon-party-organization.svg',
    'CTCT_TCD_RNQT2': 'icon-resolution.svg',
    'TCĐ-bc': 'icon-plan-report.svg',
    'CTCT_TCD_QLCL': 'icon-manage-result.svg',
    'CTCT_TCD_QLKT': 'icon-reward.svg',
    'CTCT_TCD_QLDV_DGDV_QLKQDG': 'icon-assess.svg',
    'CTCT_TCD_NXDGDV': 'icon-assess.svg',
    'app.settings.menu.export.dynamic.template': 'icon-report.svg',
    //---------------- BOLD ----------------//

    'CTCT_TCD_HOME_BOLD': 'icon-dashboard-bold.svg',
    'CTCT_TCD_QLDV_BOLD': 'icon-member-bold.svg',
    'CTCT_TCD_QLTCD_BOLD': 'icon-party-organization-bold.svg',
    'CTCT_TCD_RNQT2_BOLD': 'icon-resolution-bold.svg',
    'TCĐ-bc_BOLD': 'icon-plan-report-bold.svg',
    'CTCT_TCD_QLCL_BOLD': 'icon-manage-result-bold.svg',
    'CTCT_TCD_QLKT_BOLD': 'icon-reward-bold.svg',
    'CTCT_TCD_QLDV_DGDV_QLKQDG_BOLD': 'icon-assess-bold.svg',
    'CTCT_TCD_NXDGDV_BOLD': 'icon-assess.svg',
    'app.settings.menu.export.dynamic.template_BOLD': 'icon-report-bold.svg',

    //--------------------- Kiểm tra Giám sát ---------------------//

    'CTCT_KTGS_DB': 'icon-dashboard.svg',
    'KTL_KTGS': 'icon-document.svg',
    'ktgs-bc': 'icon-plan-report.svg',
    'INSPECTION_PLAN': 'icon-letter.svg',
    'ky-luat': 'icon-jugde.svg',
    'bao-cao-kiem-tra-giam-sat': 'icon-report.svg',
    //---------------- BOLD ----------------//

    'CTCT_KTGS_DB_BOLD': 'icon-dashboard-bold.svg',
    'KTL_KTGS_BOLD': 'icon-document-bold.svg',
    'ktgs-bc_BOLD': 'icon-plan-report-bold.svg',
    'INSPECTION_PLAN_BOLD': 'icon-letter.svg',
    'ky-luat_BOLD': 'icon-jugde.svg',
    'bao-cao-kiem-tra-giam-sat_BOLD': 'icon-report-bold.svg',
    //--------------------- Cán bộ ---------------------//

    'CTCT_CB_HOME': 'icon-dashboard.svg',
    'CTCT_CB_HSCB': 'icon-file.svg',
    'CTCT_CB_QHCB': 'icon-file.svg',
    'nang-quan-ham': 'icon-ideological-work.svg',
    'CTCT_CB_DGCB': 'icon-assess.svg',
    'CTCT_CB_NLSLCB': 'icon-schedule.svg',
    'CTCT_CB_QLBCKH': 'icon-plan-report.svg',
    'CTCT_CB_BC': 'icon-report.svg',
    'CTCT_CB_TLHDNV': 'icon-document.svg',
    //---------------- BOLD ----------------//
    'CTCT_CB_HOME_BOLD': 'icon-dashboard-bold.svg',
    'CTCT_CB_HSCB_BOLD': 'icon-file.svg',
    'CTCT_CB_QHCB_BOLD': 'icon-file.svg',
    'CTCT_CB_DGCB_BOLD': 'icon-assess-bold.svg',
    'CTCT_CB_NLSLCB_BOLD': 'icon-schedule.svg',
    'nang-quan-ham_BOLD': 'icon-ideological-work-bold.svg',
    'CTCT_CB_QLBCKH_BOLD': 'icon-plan-report-bold.svg',
    'CTCT_CB_BC_BOLD': 'icon-report-bold.svg',
    'CTCT_CB_TLHDNV_BOLD': 'icon-document-bold.svg',

    //--------------------- Bảo vệ an ninh ---------------------//

    'CTCT_BVAN_CLCT': 'icon-filter-domestic.svg',
    'CTCT_BVAN_VTTY': 'icon-file.svg',
    'CTCT_BVAN_DATD': 'icon-main-point.svg',
    'CTCT_BVAN_BC': 'icon-report.svg',
    'CTCT_BVAN_TTNN': 'icon-overseas.svg',
    'BVAN_YCBC': 'icon-plan-report.svg',
    //---------------- BOLD ----------------//

    'CTCT_BVAN_CLCT_BOLD': 'icon-filter-domestic.svg',
    'CTCT_BVAN_VTTY_BOLD': 'icon-file.svg',
    'CTCT_BVAN_DATD_BOLD': 'icon-main-point.svg',
    'CTCT_BVAN_BC_BOLD': 'icon-report-bold.svg',
    'CTCT_BVAN_TTNN_BOLD': 'icon-overseas.svg',
    'BVAN_YCBC_BOLD': 'icon-plan-report-bold.svg',

    //--------------------- Chính sách dân vận ---------------------//

    'CTCT_DV_HOME': 'icon-dashboard.svg',
    'CTCT_CTDV': 'icon-public-relations.svg',
    'QLKH_bc': 'icon-plan-report.svg',
    'CTCT_CTCSPL': 'icon-welfare.svg',
    'CTCT_CTCSCB': 'icon-social-policy.svg',
    'CTCT_CTCS': 'icon-poor-insurance.svg',
    'CTCT_CBNH': 'icon-retire.svg',
    //---------------- BOLD ----------------//

    'CTCT_DV_HOME_BOLD': 'icon-dashboard-bold.svg',
    'CTCT_CTDV_BOLD': 'icon-public-relations.svg',
    'QLKH_bc_BOLD': 'icon-plan-report-bold.svg',
    'CTCT_CTCSPL_BOLD': 'icon-welfare.svg',
    'CTCT_CTCSCB_BOLD': 'icon-social-policy.svg',
    'CTCT_CTCS_BOLD': 'icon-poor-insurance.svg',
    'CTCT_CBNH_BOLD': 'icon-retire.svg',
    //--------------------- Quần chúng ---------------------//

    'CTCT_MASS_DB': 'icon-dashboard.svg',
    'CTCT_CTQC_DSTC_HPN': 'icon-public-relations.svg',
    'CTCT_SUBSIDIZED': 'icon-plan-report.svg',
    'CTCT_ĐNT': 'icon-welfare.svg',
    'CTCT_CTQC_DSTC_HCD': 'icon-social-policy.svg',
    'DTN_QLBCKH': 'icon-poor-insurance.svg',
    'FUND': 'icon-retire.svg',
    'ctqc-bao-cao': 'icon-retire.svg',
    //---------------- BOLD ----------------//

    'CTCT_MASS_DB_BOLD': 'icon-dashboard-bold.svg',
    'CTCT_CTQC_DSTC_HPN_BOLD': 'icon-public-relations.svg',
    'CTCT_SUBSIDIZED_BOLD': 'icon-plan-report-bold.svg',
    'CTCT_ĐNT_BOLD': 'icon-welfare.svg',
    'CTCT_CTQC_DSTC_HCD_BOLD': 'icon-social-policy.svg',
    'DTN_QLBCKH_BOLD': 'icon-poor-insurance.svg',
    'FUND_BOLD': 'icon-retire.svg',
    'ctqc-bao-cao_BOLD': 'icon-retire.svg',

    //--------------------- Tài liệu ---------------------//
    'CTCT_KTL_QLTL': 'icon-document.svg',
    'CTCT_KTL_DMTL': 'icon-document.svg',
    //---------------- BOLD ----------------//
    'CTCT_KTL_QLTL_BOLD': 'icon-document-bold.svg',
    'CTCT_KTL_DMTL_BOLD': 'icon-document-bold.svg',

};
export const DEFAULT_MODAL_OPTIONS: any = {
    size: 'lg',
    backdrop: 'static'
};
export const ASSESSMENT_HISTORY_MODAL_OPTIONS: any = {
    size: 'assessment-history',
    backdrop: 'static'
};
export const SMALL_MODAL_OPTIONS: any = {
    size: 'md',
    keyboard: true,
};
export const MEDIUM_MODAL_OPTIONS: any = {
    size: 'md',
    keyboard: true,
    backdrop: 'static'
};
export const LARGE_MODAL_OPTIONS: any = {
    size: 'lg',
    backdrop: 'static',
    windowClass: 'modal-xxl',
    keyboard: false
};
export const MODAL_XL_OPTIONS: any = {
    size: 'lg',
    backdrop: 'static',
    windowClass: 'modal-xl',
    keyboard: false
};
export const PERMISSION_CODE: any = {
    // action tac dong
    'action.view': 'VIEW'
    , 'action.insert': 'INSERT'
    , 'action.update': 'UPDATE'
    ,'action.updateStatus': 'UPDATE_STATUS'
    , 'action.delete': 'DELETE'
    , 'action.import': 'IMPORT'
    , 'action.export': 'EXPORT'
    , 'action.approval': 'APPROVAL'
    , 'action.unApproval': 'UN_APPROVE'
    , 'action.decide': 'DECIDE'
    , 'action.unDecide': 'UN_DECIDE'
    , 'action.unApproveAll': 'UN_APPROVE_ALL'
    , 'action.approveAll': 'APPROVE_ALL'
    , 'action.removeEmp': 'REMOVE_EMP'
    , 'action.addEmp': 'ADD_EMP'
    , 'action.unApprove': 'UN_APPROVE'
    , 'action.unLock': 'UN_LOCK'
    , 'action.lock': 'LOCK'
    , 'action.calculate': 'CALCULATE'
    , 'action.viewHistory': 'VIEW_HISTORY'
    , 'action.enable': 'ENABLE'
    , 'action.disable': 'DISABLE'
    , 'action.issueAgain': 'ISSUE_AGAIN'
    , 'action.issueChange': 'ISSUE_CHANGE'
    , 'action.quickImport': 'QUICK_IMPORT'
    , 'action.transfer': 'TRANSFER'
    , 'action.manage': 'MANAGE'
    , 'action.viewAll': 'VIEW_ALL'
    , 'action.payrollCalculate': 'PAYROLL_CALCULATE'
    , 'action.payrollDestroy': 'DESTROY_PAYROLL'
    , 'action.reevaluation': 'REEVALUATION'
    , 'action.sign': 'SIGN'
    , 'action.changData': 'CHANGE_DATA'
    // resource tai nguyen he thong
    , 'resource.employeeManager': 'CTCT_EMPLOYEE_MANAGER'
    , 'resource.partyOrganization': 'PARTY_ORGANIZATION'
    , 'resource.partyManager': 'PARTY_MANAGER'
    , 'resource.groupOrgPosition': 'GROUP_ORG_POSITION'
    , 'resource.notification': 'NOTIFICATION'
    , 'resource.partyPosition': 'PARTY_POSITION'
    , 'resource.categoryType': 'CATEGORY'
    , 'resource.document': 'DOCUMENT'
    , 'resource.rewardGeneral': 'REWARD_GENERAL'
    , 'resource.rewardPropose': 'REWARD_PROPOSE'
    , 'resource.allowancePeriod': 'ALLOWANCE_PERIOD'
    , 'resource.allowanceProposal': 'CTCT_ALLOWANCE_PROPOSAL'
    , 'resource.allowanceProposalSign': 'CTCT_ALLOWANCE_PROPOSAL_SIGN'
    , 'resource.allowanceProposalApproval': 'CTCT_ALLOWANCE_PROPOSAL_APPROVAL'
    , 'resource.empAllowanceRequest': 'CTCT_EMP_ALLOWANCE_REQUEST'
    , 'resource.welfarePolicyProposal': 'CTCT_WELFARE_POLICY_PROPOSAL'
    , 'resource.welfarePolicyRequest': 'CTCT_WELFARE_POLICY_REQUEST'
    , 'resource.welfarePolicyCategory': 'CTCT_WELFARE_POLICY_CATEGORY'
    , 'resource.subsidized': 'SUBSIDIZED'
    , 'resource.empFile': 'EMPLOYEE_PROFILE'
    , 'resource.employeeT63Information': 'EMPLOYEE_T63INFOMATION'
    , 'resource.empTypeProcess': 'EMP_TYPE_PROCESS'
    , 'resource.massOrganization': 'MASS_ORGANIZATION'
    , 'resource.transferPartyMember': 'TRANSFER_PARTY_MEMBER'
    , 'admin.autoTransfer': 'ADMIN_AUTO_TRANSFER'
    , 'admin.genRewardFile': 'ADMIN_GEN_REWARD_FILE'
    , 'resource.partyMemberProcess': 'PARTY_MEMBER_PROCESS'
    , 'resource.partyMember': 'PARTY_MEMBER'
    , 'resource.responseResolutionMonth': 'RESPONSE_RESOLUTION_MONTH'
    , 'resource.requestResolutionQuarterYear': 'REQUEST_RESOLUTION_QUARTER_YEAR'
    , 'resource.signDocument': 'SIGN_DOCUMENT'
    , 'resource.political': 'POLITICAL_BRANCH' // Quyen tab nganh chinh tri
    , 'resource.propaganda': 'PROPAGANDA' // Quyen nganh tuyen huan
    , 'resource.monitoring': 'MONITORING' // Quyen nganh Kiem tra giam sat
    , 'resource.population': 'POPULATION' // Quyen nganh dan van
    , 'resource.congress': 'PARTY_CONGRESS' // Quyen to chuc dai hoi
    , 'resource.partyCriticize': 'PARTY_CRITICIZE' // Quyen quan ly phe binh Dang
    , 'resource.securityProtection': 'SECURITY_PROTECTION' // Quyen nganh bao ve an ninh
    , 'resource.massPosition': 'MASS_POSITION' // Quyen chuc vu quan chung
    , 'resource.receiveNotificationGroup': 'RECEIVE_NOTIFICATION_GROUP' // Nhóm nhân viên nhận thông báo
    , 'resource.massRequestCriteria': 'MASS_REQUEST_CRITERIA' // Nghiệp vụ công tác quần chúng
    , 'resource.requestDemocraticMeeting': 'REQUEST_DEMOCRATIC_MEETING' // Nghiệp vụ công tác quần chúng
    , 'resource.propagandaRewardForm': 'REWARD_FORM' // Hình thức khen thưởng (Tuyên Huấn)
    // , 'resource.propagandaRewardProposal': 'REWARD_PROPOSAL' // Quản lý tờ trình (Tuyên huấn)
    , 'resource.questionAndAnswer': 'QUESTION_AND_ANSWER' // Hình thức khen thưởng (Tuyên Huấn)
    , 'resource.partyCongressEmployee': 'PARTY_CONGRESS_EMPLOYEE'
    , 'resource.transferEmployee': 'TRANSFER_EMPLOYEE'
    , 'resource.generalStandardPositionGroup': 'GENERAL_STANDARD_POSITION_GROUP'
    , 'resource.qualityAnalysisParty': 'QUALITY_ANALYSIS_PARTY'
    , 'resource.rewardParty': 'REWARD_PARTY'
    , 'resource.politicsQuality': 'POLITICS_QUALITY'
    , 'resource.personnelKey': 'PERSONNEL_KEY'
    , 'resource.empManagementVertical': 'EMP_MANAGEMENT_VERTICAL'
    , 'resource.employee360Information': 'EMPLOYEE_360_INFORMATION'
    , 'resource.disciplineViolationReport': 'DISCIPLINE_VIOLATION_REPORT'
    , 'resource.partyPunishment': 'PARTY_PUNISHMENT'
    , 'resource.punishment': 'PERSONAL_PUNISHMENT'
    , 'resource.disciplineIncreaseDecreaseReport': 'DISCIPLINE_INCREASE_DECREASE_REPORT'
    , 'resource.massMember': 'MASS_MEMBER'
    , 'resource.reportDynamic': 'REPORT_DYNAMIC'
    , 'resource.propagandaRewardThought': 'REWARD_THOUGHT'
    , 'resource.propagandaRewardThoughtReport': 'REWARD_THOUGHT_REPORT'
    , 'resource.propagandaRewardThoughtHandling': 'REWARD_THOUGHT_HANDLING'
    , 'resource.warningManager': 'WARNING_MANAGER'
    , 'resource.requestResolutionMonth': 'REQUEST_RESOLUTION_MONTH'
    , 'resource.requestPolicyProgram': 'REQUEST_POLICY_PROGRAM'
    , 'resource.projectsForm': 'PROJECTS_FORM'
    , 'resource.inspectionPlan': 'INSPECTION_PLAN'
    , 'resource.receiveLetterDenunciation': 'RECEIVE_LETTER_DENUNCIATION'
    , 'resource.handlePartyLetterDenunciation': 'HANDLE_PARTY_LETTER_DENUNCIATION'
    , 'resource.ideologicalExpressionReport': 'IDEOLOGICAL_EXPRESSION_REPORT'
    /* Report Dynamic Code */
    , 'resource.reportMassMember': 'REPORT_MASS_MEMBER'
    , 'resource.annualPlanReport': 'CTCT-CB-BCKH'
    , 'resource.assessmentEmployee': 'ASSESSMENT_EMPLOYEE' // Đánh giá cán bộ
    , 'resource.assessmentResultHistory': 'ASSESSMENT_RESULT_HISTORY' // Lich su ket qua danh gia can bo
    , 'resource.assessmentCriteria': 'ASSESSMENT_CRITERIA'
    , 'resource.assessmentCriteriaGroup': 'ASSESSMENT_CRITERIA_GROUP'
    , 'resource.assessmentFormula': 'ASSESSMENT_FORMULA' // Công thức đánh giá
    , 'resource.assessmentPeriod': 'ASSESSMENT_PERIOD' // Quản lý kỳ đánh giá
    , 'resource.assessmentMonitor': 'ASSESSMENT_MONITOR' // Báo cáo, theo dõi
    , 'resource.settingIcon': 'SETTING_ICON' // Công thức đánh giá
    , 'resource.versionControl': 'VERSION_CONTROL'
    , 'resource.employeeMapping': 'ASSESSMENT_EMPLOYEE_MAPPING' // Cán bộ được mapping trong kỳ đánh giá
    , 'resource.inspectionPlanReport': 'INSPECTION_PLAN_REPORT' // Báo cáo kế hoạch năm Nghành KTGS
    , 'resource.inspectionPlanList': 'INSPECTION_PLAN_LIST' // Danh sách kế hoạch KTGS theo tổ chức đảng, từ ngày - đến ngày
    , 'resource.partyMemberDecision': 'PARTY_MEMBER_DECISION'
    , 'resource.partyMemberProfileType': 'PARTY_MEMBER_PROFILE_TYPE'
    , 'resource.partyMemberProfile': 'PARTY_MEMBER_PROFILE'
    , 'resource.assessmentPartyOrganization': 'ASSESSMENT_PARTY_ORGANIZATION'
    , 'resource.massGroup': 'MASS_GROUP'
    , 'resource.assessmentLevelPartyOrganization': 'ASSESSMENT_LEVEL_PARTY_ORGANIZATION'
    // #214 start
    , 'resource.fundManagement': 'FUND_MANAGEMENT'
    , 'resource.fundContribution': 'FUND_CONTRIBUTION'
    , 'resource.fundActivity': 'FUND_ACTIVITY'
    , 'resource.admin_nqh': 'ADMIN_NQH'
    // #214 end
    // #239 start
    , 'resource.assessmentSumary': 'ASSESSMENT_SUMARY'
    , 'resource.expressionReportRecorded': 'EXPRESSION_REPORT_RECORDED'
    , 'resource.empArmyProposed': 'EMP_ARMY_PROPOSED'
    , 'resource.managerOrganization': 'CTCT_ORGANIZATION'
    , 'resource.competitionProgram': 'CTCT_COMPETITION_PROGRAM'
    , 'resource.unitRegistration': 'COMPETITION_UNIT_REGISTRATION'
    , 'resource.competitionResult': 'COMPETITION_RESULT'
    // #239 end
    , 'resource.rewardProposeDang ': 'REWARD_PROPOSE_DANG'
    , 'resource.rewardProposeCongdoan ': 'REWARD_PROPOSE_CONGDOAN'
    , 'resource.rewardProposePhunu ': 'REWARD_PROPOSE_PHUNU'
    , 'resource.rewardProposeThanhnien ': 'REWARD_PROPOSE_THANHNIEN'
    , 'resource.rewardProposeChinhquyen ': 'REWARD_PROPOSE_CHINHQUYEN'
    , 'resource.emailSmsHistory': 'EMAIL_SMS_HISTORY'
    , 'resource.adScheduler': 'AD_SCHEDULER'
    , 'resource.adTable': 'AD_TABLE'
    , 'resource.educationProcess': 'CTCT_EDUCATION_PROCESS'
    , 'resource.assessmentSign': 'CTCT_ASSESSMENT_SIGN'
    , 'resource.assessmentSignAll': 'CTCT_ASSESSMENT_SIGN_ALL'
    , 'resource.assessmentPeriodMember': 'ASSESSMENT_PERIOD_MEMBER'

    , 'resource.thoroughContentToChucDang': 'CTCT_THOROUGH_CONTENT_TOCHUCDANG'
    , 'resource.thoroughContentTuyenHuan': 'CTCT_THOROUGH_CONTENT_TUYENHUAN'
    , 'resource.thoroughContentBaoVeAnNinh': 'CTCT_THOROUGH_CONTENT_BAOVEANNINH'
    , 'resource.thoroughContentKiemTraGiamSat': 'CTCT_THOROUGH_CONTENT_KIEMTRAGIAMSAT'
    , 'resource.thoroughContentCongTacQuanChung': 'CTCT_THOROUGH_CONTENT_CONGTACQUANCHUNG'
    , 'resource.thoroughContentChinhSachDanVan': 'CTCT_THOROUGH_CONTENT_CHINHSACHDANVAN'
    , 'resource.thoroughContentCanBo': 'CTCT_THOROUGH_CONTENT_CANBO'


    , 'resource.trainingTopic': 'CTCT_TRAINING_TOPIC'
    , 'resource.trainingClass': 'CTCT_TRAINING_CLASS',
    'resource.militaryRankCeiling': 'CTCT_MILITARY_RANK_CEILING'
    , 'resource.admissionManagement': 'ADMISSION_MANAGEMENT' // quản lý đợt kết nạp
};

export enum LOAI_KHEN_THUONG {
    TO_CHUC_DANG = 1,
    TO_CHUC_DOAN = 2,
    TO_CHUC_PHU_NU = 3,
    TO_CHUC_THANH_NIEN = 4,
    CHINH_QUYEN = 5
}

export enum OBJECT_TYPE_LIST {
    CHINH_QUYEN = 1,
    TO_CHUC_DANG = 2,
    TO_CHUC_PHU_NU = 3,
    TO_CHUC_DOAN = 4,
    TO_CHUC_THANH_NIEN = 5
}

export enum BRANCH_KHEN_THUONG {
    TO_CHUC_DANG = 0,
    TO_CHUC_DOAN = 3,
    TO_CHUC_PHU_NU = 1,
    TO_CHUC_THANH_NIEN = 2,
    TO_CHUC_CHINH_QUYEN = 5
}

export enum LOAI_DOI_TUONG_KHEN_THUONG {
    CA_NHAN = 1,
    TAP_THE = 2,
    CHI_PHI = 3
}

export enum LOAI_KHEN_THUONG_CHI_TIET {
    TAP_THE_TRONG_VT = 1,
    KHEN_THUONG_CBNV = 2,
    TAP_THE_NGOAI_VT = 3,
    CA_NHAN_NGOAI_VT = 4,
    CHI_PHI = 5,
}

export enum LOAI_DANH_MUC_KHEN_THUONG {
    CAP_KHEN_THUONG = 1,
    DANH_HIEU_KHEN_THUONG = 2,
    HINH_THUC_KHEN_THUONG = 3
}

export enum NHOM_KHEN_THUONG {
    TRONG_TAP_DOAN = 1,
    NGOAI_TAP_DOAN = 2
}

export enum REWARD_PROPOSE_STATUS {
    SOAN_DE_XUAT = 1,
    CHO_DE_XUAT = 2,
    TU_CHOI_XET_DUYET = 3,
    DA_DUYET_XET_DUYET = 4,
    SOAN_TRINH_KY = 5,
    DANG_TRINH_KY = 6,
    DA_DUYET_TRINH_KY = 7,
    TU_CHOI_TRINH_KY = 8
}

export enum REWARD_PROPOSE_APPROVAL_STATUS {
    CHO_DE_XUAT = 2,
    TU_CHOI_XET_DUYET = 3,
    DA_DUYET_XET_DUYET = 4
}

export enum REWARD_PROPOSE_SIGN_STATUS {
    SOAN_TRINH_KY = 1,
    DANG_TRINH_KY = 2,
    TU_CHOI_TRINH_KY = 3,
    DA_DUYET_TRINH_KY = 4
}

export enum REWARD_APPROVE_STATUS {
    XET_DUYET = 1,
    TU_CHOI = 2
}

export enum DOI_TUONG_HUONG {
    BAN_THAN = 1,
    THAN_NHAN = 2,
    CA_HAI = 3,
}

export enum SUBSIDIZED_STATUS {
    SOAN_THAO = 0,
    CHO_XET_DUYET = 1,
    DA_PHE_DUYET = 2,
    DA_TU_CHOI_PHE_DUYET = 3,
    DANG_TRINH_KY = 5,
    DA_DUYET_TRINH_KY = 6,
    DA_TU_CHOI_KY = 7,
}

export enum SUBSIDIZED_APPROVE_STATUS {
    CHO_XET_DUYET = 1,
    DA_PHE_DUYET = 2,
    DA_TU_CHOI_PHE_DUYET = 3,
    DANG_TRINH_KY = 5,
    DA_DUYET_TRINH_KY = 6,
    DA_TU_CHOI_KY = 7,
}

export enum REWARD_CATEGORY_TYPE {
    CAP_KHEN_THUONG = 1,
    DANH_HIEU_KHEN_THUONG = 2,
    HINH_THUC_KHEN_THUONG = 3,
}

export enum SCHEDULE_TYPE {
    DOT_XUAT = 1,
    THEO_TUAN = 2,
    THEO_THANG = 3,
    THEO_QUY = 4,
    THEO_NAM = 5,
}

export enum PROPOSE_STATUS {
    DU_THAO = 1,
    CHO_KY_DUYET = 2,
    TU_CHOI_DUYET = 3,
    CHO_XET_CHON = 4,
    DANG_XET_CHON = 5,
    DA_XET_CHON = 6
}

export enum SELECTION_STATUS {
    CHO_XET_CHON = 4,
    DANG_XET_CHON = 5,
    DA_XET_CHON = 6,
    BI_TU_CHOI = 7
}

export enum PROPOSE_SIGN_STATUS {
    DU_THAO = 1,
    CHO_KY_DUYET = 2,
    DA_KY_DUYET = 3,
    TU_CHOI_KY_DUYET = 4,
    HUY_QUYET_DINH = 6
}

export enum AD_SCHEDULER_ACTIVESTATUS {
    ACTIVE = "Y",
    NONEACTIVE = "N"
}

export enum SAP_STATEMENT_STATUS {
    KHOI_TAO = '00',
    BAN_HANH = '05',
    HUY_LUONG = '06',
    HOAN_THANH = '99'
}

export enum FROM_SOURCE {
    QD_DE_XUAT = 1,
    QD_NGOAI = 2,
}

export enum SCHEDULER_PROCESSING_STATUS_VLUE {
    PROCESSING = 'Y',
    DONE = 'N',
}


export enum ASSESSMENT_OBJECT {
    CAN_BO = 1,
    DANG_VIEN = 2,
    DIEN_CAN_BO_QUAN_LY = 3
}

//thaida
export enum ASSESSMENT_LEVEL_TYPE {
    THUONG = 1,//Loại thưởng
    DAC_BIET = 2 //Loại đặc biệt dành cho kỳ đánh giá mới đến cấp DBTD
}

export const APP_CONSTANTS = {
    IMPORT_TYPE: [
        {value: "1_row", name: "Một dòng dữ liệu"},
        {value: "m_row", name: "Theo nghiệp vụ"},
        {value: "matrix", name: "Dạng matrix"},
        {value: "multi_row", name: "Nhiều dòng dữ liệu"},
    ],
    DATA_TYPE: [
        {value: "string", name: "string"},
        {value: "numeric", name: "numeric"},
        {value: "employee", name: "employee"}
    ],
    STATUS_SEND: [
        {label: 'Chưa gửi', id: 0},
        {label: 'Đã gửi', id: 1},
        {label: 'Gửi lỗi', id: 2},
        {label: 'Đã hủy', id: 3},
        {label: 'Chờ duyệt', id: -1},
    ],
    TYPE_SEND: [
        {label: 'Email', id: 'email'},
        {label: 'Sms', id: 'sms'}
    ],
    ACTION_LOG: [
        {label: 'GUI_TC', id: 'GUI_TC'},
        {label: 'HUY', id: 'HUY'},
        {label: 'DUYET', id: 'DUYET'}
    ],
    ORG_LEVEL_REAL: [
        {label: 'N', id: 0},
        {label: 'N-1', id: 1},
        {label: 'N-2', id: 2},
        {label: 'N-3', id: 3},
        {label: 'N-4', id: 4},
        {label: 'N-5', id: 5},
        {label: 'N-6', id: 6}
    ],
    MANAGEMENT_TYPE: [
        {label: 'positionCareer.managementType.1', id: 1},
        {label: 'positionCareer.managementType.2', id: 2},
    ],
    BRANCH_WITH_LOAI_KHEN_THUONG: [
        {branch: BRANCH_KHEN_THUONG.TO_CHUC_DANG, loai: LOAI_KHEN_THUONG.TO_CHUC_DANG},
        {branch: BRANCH_KHEN_THUONG.TO_CHUC_DOAN, loai: LOAI_KHEN_THUONG.TO_CHUC_DOAN},
        {branch: BRANCH_KHEN_THUONG.TO_CHUC_PHU_NU, loai: LOAI_KHEN_THUONG.TO_CHUC_PHU_NU},
        {branch: BRANCH_KHEN_THUONG.TO_CHUC_THANH_NIEN, loai: LOAI_KHEN_THUONG.TO_CHUC_THANH_NIEN},
    ],
    ORG_EXPIRED_TYPE: [],
    ORG_RELATION_TYPE: [],
    GENDERS: [
        {label: 'app.gender.male', id: 1},
        {label: 'app.gender.female', id: 0},
    ],
    TOTAL_EMPLOYEE: [
        {labels: 'Tổng số', datasets: 0},
        {labels: 'Nhân viên đã được đánh giá', datasets: 1},
    ],
    PLAN_TYPE: [],
    PLAN_STATUS: [],
    STATUS: [
        {label: 'app.organization.status.active', id: 1},
        {label: 'app.organization.status.inactive', id: 2}
    ],
    WORKING_STATUS: [
        {label: 'employee.isWorking', id: 1},
        {label: 'employee.notWorking', id: 2}
    ],
    EDU_LANGUAGE_TYPE: [],
    EMP_FILE_FIXEDEMPFILE: [
        {label: 'app.empFile.saved', id: 1},
        {label: 'app.empFile.notSaved', id: 2},
    ],
    EMP_FILE_STATUS: [
        // { label: 'app.empFile.pendingForApproval', id: 1 },
        // { label: 'app.empFile.approved', id: 2 },
        // { label: 'app.empFile.rejected', id: 3 },
        {label: 'app.empFile.acceptHardCopy', id: 4},
        {label: 'app.empFile.hasBeenStored', id: 5},
        {label: 'app.empFile.individualHandover', id: 6}
    ],
    SYS_CAT_TYPE_COCE: {
        RECRUITMENT_TYPE: 'TTHN',
    },
    KEY_EMPLOYEE_BE_ASSESSMENT: {
        KEY: '3',
    },
    ASSESSMENT_STATUS: {
        HAVE_ASSESSMENT: 'Đã hoàn thành đánh giá',
        NOT_YET_ASSESSMENT: 'Chưa hoàn thành đánh giá'
    },
    NATION_CONFIG_TYPE: {
        ETHNIC: 'ETHNIC'
    },
    EMP_TYPE_PROCESS: {},
    WORK_PROCESS: {},
    POLITICAL_LEVEL: [
        {id: 1, name: 'Sơ cấp'},
        {id: 2, name: 'Trung cấp'},
        {id: 3, name: 'Cao cấp'}
    ],
    RETIREMENT_REPORT_TYPE: [
        {id: 1, name: 'Danh sách nghỉ chờ hưu'},
        {id: 2, name: 'Danh sách nghỉ hưu trong kỳ'}
    ],
    COMPETITION_RESULT_STATUS: [
        {id: 1, name: 'Mới'},
        {id: 2, name: 'Chờ duyệt'},
        {id: 2, name: 'Đã duyệt'},
        {id: 2, name: 'Từ chối'}
    ],
    TRANSFER_PARTY_MEMBER_STATUS: [
        {id: 0, name: "Chờ phê duyệt"},
        {id: 1, name: "Đang duyệt"},
        {id: 2, name: "Đã duyệt"},
        {id: 3, name: "Từ chối"},
        {id: 4, name: "Đã tiếp nhận"},
        {id: 5, name: "Đã nghỉ việc"},
    ],

    TRANSFER_PARTY_MEMBER_WARNING_TYPE: [
        {id: 1, name: "Đảng viên chưa được đưa về chi bộ"}
        // {id: 2, name: "Đảng viên có đơn vị được gán ở 2 chi bộ"}
    ],
    NOTIFYBRANCHLIST: [
        {code: 1, name: "Tổ chức Đảng"},
        {code: 2, name: "Cán bộ"},
        {code: 3, name: "Tuyên huấn"},
        {code: 4, name: "Quần chúng"},
        {code: 5, name: "Kiểm tra giám sát"},
        {code: 6, name: "Dân vận"},
        {code: 7, name: "Bảo vệ an ninh"},
        {code: 8, name: "Tổ chức Đại hội"},
        {code: 9, name: "Công tác chính sách"}
    ],
    REWARDCATEGORYLIST: [
        {id: 1, name: "Ngân sách nhà nước"},
        {id: 2, name: "Khen thưởng tập đoàn"},
        {id: 3, name: "Khác"},
    ],
    TYPE_COMPETITION_RESULT: [
        {code: 1, name: "FINAL_RESULT"},
        {code: 2, name: "Cán bộ"},
        {code: 3, name: "Tuyên huấn"},
        {code: 4, name: "Quần chúng"},
        {code: 5, name: "Kiểm tra giám sát"},
        {code: 6, name: "Dân vận"},
        {code: 7, name: "Bảo vệ an ninh"},
        {code: 8, name: "Tổ chức Đại hội"},
        {code: 9, name: "Công tác chính sách"}
    ],
    TYPEORGANIZATION: [
        {code: 1, name: "Hội phụ nữ cơ sở"},
        {code: 2, name: "Chi hội"},
        {code: 3, name: "Tổ"}
    ],
    DOCUMENT_STATUS_LIST: [{id: 1, name: "Sử dụng"}, {id: 2, name: "Không sử dụng"}],
    TRAINING_RESULT: [
        {resultId: 1, name: "Đạt"},
        {resultId: 2, name: "Khá"},
        {resultId: 3, name: "Giỏi"},
    ],
    SYS_CAT_TYPE_ID: {
        SPECIALIZE_TRAINING: 2,
        CLL_ILL: 3,
        DEGREE: 4,
        ETHNIC: 8,
        FAMILY_TYPE: 10,
        RELIGION: 11,
        SOLDIER_LEVEL: 13,
        MANAGEMENT_TYPE: 14,
        RELATION_SHIP: 17,
        ORGANIZATION_CONTROLLER_TYPE: 23,
        GOV_PUNISHMENT_FORM: 29,
        EMPLOYEE_PROFILE_TYPE: 44,
        RECUIT: 70,
        DECISSION_LEVEL: 71,
        OFFICER_TYPE: 89,
        PUNISHMENT_FORM: 91,
        PARTY_PUNISHMENT: 101,
        PUNISHMENT_TYPE: 102,
        STAFF_TYPE: 103,
        POLITICAL_CLASS: 123,
        EMPLOYEE_NOTE_TYPE: 125,
        VIOLATE_YOUR: 138,
        VIOLATE_FAMILY: 139,
        WORKING_TIME: 204
    },
    CATEGORY_ID: {
        CBCS_CBTT: '6,15'
    },
    PROPAGANDA_REWARD_DECIDE_STATUS: [
        {id: 0, name: "Soạn thảo"},
        {id: 1, name: "Đang trình ký"},
        {id: 2, name: "Từ chối phê duyệt"},
        {id: 3, name: "Đã phê duyệt"}
    ],
    CATEGORY_TYPE_CODE: {
        POSITION_GROUP: 'NHOM_CHUC_DANH',
        TO_CHUC_PHU_NU: 'TO_CHUC_PHU_NU',
        TO_CHUC_THANH_NIEN: 'TO_CHUC_THANH_NIEN',
        TO_CHUC_CONG_DOAN: 'TO_CHUC_CONG_DOAN',
        QUALITY_RATING_PARTY_ORG: 'QUALITY_RATING_PARTY_ORG',
        QUALITY_RATING_PARTY_MEMBER: 'QUALITY_RATING_PARTY_MEMBER',
        EMP_TYPE_FILE: 'EMP_TYPE_FILE',
        TENURE: 'DSNK',
        BUSINESS_GROUP: 'BUSINESS_GROUP',
        INSPECTION_PLAN_TASK_GROUP: 'INSPECTION_PLAN_TASK_GROUP',
        DOCUMENT_TYPE: 'DOCUMENT_TYPE',
        CONFIDENTIALITY: 'CONFIDENTIALITY',
        ASSESSMENT_PERIOD_TYPE: 'ASSESSMENT_PERIOD_TYPE',
        LY_DO_CHAM_DUT_DANG: 'LY_DO_CHAM_DUT_DANG',
        LOAI_HINH_TO_CHUC_DANG: 'LOAI_HINH_TO_CHUC_DANG',
        LOAI_CHINH_SACH: 'LOAI_CHINH_SACH',
        CHUCVU_TOCHUC_HOPDANCHU: 'CHUCVU_TOCHUC_HOPDANCHU',
        CHUCVU_BCH_HOPDANCHU: 'CHUCVU_BCH_HOPDANCHU',
        GENERAL_STANDARD_TYPE: 'GENERAL_STANDARD_TYPE',
        NHOM_CHUC_DANH: 'NHOM_CHUC_DANH',
        PRIVATE_STANDARD_TYPE: 'PRIVATE_STANDARD_TYPE',
        SETTING_ICON_TYPE: 'SETTING_ICON_TYPE',
        THOI_GIAN_LUAN_CHUYEN: 'THOI_GIAN_LUAN_CHUYEN',
        DOI_TUONG_SU_DUNG: 'DOI_TUONG_SU_DUNG',
        // d2t start 05092021
        PARTY_MEMBER_PROFILE_TYPE_GROUP_TYPE: 'NTLHSDV',
        // d2t end
        //d2t #214 start
        ACTIVITY_TYPE: 'ACTIVITY_TYPE',
        //d2t #214 end
        MASS_GROUP: 'MASS_GROUP_TYPE',
        URGENT_LEVEL_TYPE: 'URGENT_LEVEL_TYPE',
        TYPE_THOROUGHT_CONTENT: 'TYPE_THOROUGHT_CONTENT'
    },
    YOUTHBRANCH: [
        {id: 0, name: "Trong ngành"},
        {id: 1, name: "Ra khỏi ngành"}
    ],
    PARTY_MEMBER_TYPE: [
        {id: 1, name: 'Đảng viên dự bị'},
        {id: 2, name: 'Đảng viên chính thức'},
        {id: 3, name: 'Đảng viên hết thời gian dự bị'},
        {id: 4, name: 'Đảng viên mới'}
    ],
    TRANSFER_PARTY_MEMBER_TYPE: [
        {id: 1, name: 'Chuyển sinh hoạt nội bộ'},
        {id: 2, name: 'Chuyển sinh hoạt ra ngoài Tập đoàn'},
        {id: 3, name: 'Chuyển sinh hoạt từ ngoài vào'}
    ],
    ASSESSMENT_OBJECT: [
        {id: ASSESSMENT_OBJECT.CAN_BO, name: 'Cán bộ'},
        {id: ASSESSMENT_OBJECT.DANG_VIEN, name: 'Đảng viên'},
        {id: ASSESSMENT_OBJECT.DIEN_CAN_BO_QUAN_LY, name: 'Diện cán bộ quản lý'},
    ],
    PARTY_ORG_TYPE: {
        CBCS: 15,
        CBTT: 6,
        TTQUTU: 19,
        DBCTTTCS: 20,
        DBCS: 21,
        DBBP: 22,
    },
    PERSONAL_PUNISHMENT: {
        CQD: 71,
        LP: 102,
        KLCQ: 29,
        KLD: 101,

    },
    ASSESSMENT_CRITERIAGROUP_STATUS: {
        NHAP: 1,
        HIEULUC: 2,
        HETHIEULUC: 3,
    },
    FIELD_TYPE: {
        COMBOBOX: 1,
        TEXTBOX: 2,
        DATE: 3,
        DATETIME: 4,
        TIME: 5,
        SPINNER: 6,
        TEXTAREA: 7,
        STAR: 8,
        RADIO_BUTTON: 9,
        FROM_TO: 10,
        TY_LE: 11
    },
    VHR: {
        BASE_URL: 'http://quanlynhansu.sangnn.vn',
        URL_VIEW_EMPLOYEE: 'http://quanlynhansu.sangnn.vn/viewEmployeeService.do?employeeCode=',
        POLICY_MANAGEMENT: 'http://phanmemnganhdoc.sangnn.vn:8989/pmnd'
    },
    APP_PARAM_CODE: {
        VIP: 'VIP',
        EMP_TYPE_REGULAR_1: 'EMP_TYPE_REGULAR_1',
        CTCT_THOROUGH_CONTENT_REPORT: 'CTCT_THOROUGH_CONTENT_REPORT',
    },
    APP_PARAM_TYPE: {
        PARTY_ORG_ROOT_ID: 'PARTY_ORG_ROOT_ID',
        BASE_SALARY: 'BASE_SALARY',
        CEO_GROUP: 'CEO_GROUP',
        LABOUR_CONTRACT_DETAIL_REGULAR: 'LABOUR_CONTRACT_DETAIL_REGULAR',
        LABOUR_CONTRACT_TYPE_REGULAR: 'LABOUR_CONTRACT_TYPE_REGULAR',
        MANAGEMENT_POSITION_TYPE: 'MANAGEMENT_POSITION_TYPE',
        LEAVE_PROCESS_TYPE: 'LEAVE_PROCESS_TYPE'
    },
    RESOLUTION_MONTH_STATUS: [
        {id: 0, name: "app.response.status.notYet"},
        {id: 1, name: "app.response.status.doing"},
        {id: 2, name: "app.response.status.waiting"},
        {id: 3, name: "app.response.status.refuse"},
        {id: 4, name: "app.response.status.approved"},
        {id: 5, name: "app.response.status.reject"},
    ],
    PIE_CHART_COLOR: {
        0: 'rgba(0, 204, 153, 1)',
        1: 'rgba(51, 153, 255, 1)',
        2: 'rgba(255, 206, 86, 1)',
        3: 'rgba(255, 99, 132, 1)',
        4: 'rgba(255, 0, 0, 1)',
        5: 'rgba(204, 153, 255, 1)',
        6: 'rgba(255, 102, 153, 1)',
        7: 'rgba(204, 255, 153, 1)',
        8: 'rgba(51, 204, 204, 1)',
        9: 'rgba(153, 204, 255, 1)',

    },
    QUARTER_LIST: [
        {value: 1, label: "employee.report.quarter1"},
        {value: 2, label: "employee.report.quarter2"},
        {value: 3, label: "employee.report.quarter3"},
        {value: 4, label: "employee.report.quarter4"},
    ],
    POLITICAL_FEATURE: {
        BASE_URL: 'http://nganhchinhtri.sangnn.vn'
    },
    REWARD_PROPOSAL_TYPE: {
        BRANCH: 'BRANCH',
        GROUP: 'GROUP',
        CORPORATIONS: 'CORPORATIONS'
    },
    REWARD_TYPE_LIST: [
        {value: 1, label: "propaganda.rewardGrouplevel"},
        {value: 2, label: "propaganda.rewardCompanylevel"},
        {value: 3, label: "propaganda.rewardDepartmentlevel"},
    ],
    REWARD_TYPE_GROUP_LIST: [
        {value: 1, label: "propaganda.rewardGrouplevel"},
    ],
    REWARD_TYPE_COMPANY_LIST: [
        {value: 2, label: "propaganda.rewardCompanylevel"},
    ],
    RESIDENT_STATUS_LIST: [
        {value: 1, label: "Cư trú"},
        {value: 2, label: "Không cư trú"}
    ],
    REWARD_STATUS_LIST: [
        {value: 0, label: "Soạn thảo"},
        {value: 1, label: "Đang trình ký"},
        {value: 2, label: "Từ chối phê duyệt"},
        {value: 3, label: "Đã phê duyệt"}
    ],
    PAYMENT_MODE_LIST: [
        {value: 'UNC', label: "Ủy nhiệm chi"},
        {value: 'TM', label: "Tiền mặt"},
        {value: 'LC', label: "LC"},
        {value: 'CMTND', label: "CMTND"}
    ],
    POLICY_REPORT_TYPE_LIST: [
        {value: 'BC_DTCS', label: "Danh sách chi tiết CBCNV là đối tượng chính sách"},
        {value: 'BC_DTCS_CTTN', label: "Danh sách chi tiết thân nhân CBCNV là đối tượng chính sách"},
        {value: 'BC_TH_DTCS', label: "Báo cáo tổng hợp đối tượng chính sách"},
        {value: 'BC_CBCNV_DT', label: "Danh sách CBCNV là dân tộc ít người"},
        {value: 'BC_CBCNV_DTTH', label: "Tổng hợp CBCNV là người dân tộc ít người"},
    ], DEATH_LIFE_LIST: [
        {value: 1, label: "Còn sống"},
        {value: 5778, label: "Đã chết"}
    ],
    PARTY_MEMBER_REPORT_TYPE_LIST: [
        {value: 1, label: "partyMemberReport.detailPartyMemberReport"},
        {value: 2, label: "partyMemberReport.totalDetailPartyMemberReport"}
    ],
    REPORT_REWARD_TYPE_LIST: [
        {value: 1, label: "Báo cáo khen thưởng tổ chức Đảng"},
        {value: 2, label: "Báo cáo khen thưởng Đảng viên"},
        {value: 3, label: "Báo cáo tổng hợp"}
    ],
    QUESTION_AND_ANSWER_STATUS_LIST: [
        {value: 0, label: "Chưa được trả lời"},
        {value: 1, label: "Đã được trả lời"}
    ],
    REPORT_TYPE_LIST: [
        {value: 1, label: "Đánh giá, xếp loại tổ chức Đảng"},
        {value: 2, label: "Đánh giá, xếp loại Đảng viên"},
        {value: 3, label: "Tổng hợp xếp loại tổ chức Đảng"},
        {value: 4, label: "Tổng hợp xếp loại Đảng viên"},
        {value: 5, label: "Phân loại tổ chức Đảng, Đảng viên"}
    ],
    REPORT_GROUP_ORG_TYPE_LIST: [
        {value: 1, label: "Báo cáo tổng hợp nhóm chức danh theo đơn vị"},
        {value: 2, label: "Báo cáo chi tiết nhóm chức danh theo đơn vị"}
    ],
    REPORT_WARNING_SECURITY_TYPE_LIST: [
        {value: 1, label: "Báo cáo Danh sách CBNV cần chú ý về chính trị"},
        {value: 2, label: "Báo cáo Danh sách nhân sự trọng yếu thay đổi công tác"},
        {value: 3, label: "Báo cáo Danh sách vị trị trọng yếu thiếu hồ sơ"}
    ],
    TRANSFER_TYPE_LIST: [
        {value: 1, label: "Bổ nhiệm"},
        {value: 2, label: "Bổ nhiệm lại"},
        {value: 3, label: "Điều động"},
        {value: 4, label: "Điều động, bổ nhiệm"},
        {value: 5, label: "Luân chuyển"},
        {value: 6, label: "Giao quyền"},
    ],
    VICINITY_PLAN_TYPE: {
        VICINITY_EMPLOYEE: 1,
        NEXT_EMPLOYEE: 2
    },
    CRITICIZE_TYPE: [
        {value: 1, label: "Số lượng thuộc đối tượng kiểm điểm tự phê bình và phê bình"},
        {value: 2, label: "Số lượng đã kiểm điểm tự phê bình và phê bình"},
        {value: 3, label: "Số lượng chưa kiểm điểm tự phê bình và phê bình"},
        {value: 4, label: "Số được miễn công tác, sinh hoạt"},
        {value: 5, label: "Thuộc diện Ban Thường vụ Đảng ủy TĐ quản lý"},
        {value: 6, label: "Thuộc diện Ban Thường vụ Đảng ủy VTT quản lý (trên cơ sở)"},
        {value: 7, label: "Thuộc diện Đảng ủy cơ sở quản lý"},
        {value: 8, label: "Thuộc diện Đảng bộ bộ phận, chi bộ quản lý"}
    ],
    EVALUATE_TYPE: [
        {value: 1, label: "Đạt"},
        {value: 2, label: "Không đạt"},
    ],
    KEY_PROJECT_TYPE: [
        {value: 1, label: "Dân sự"},
        {value: 2, label: "Quân sự"}
    ],
    KEY_PROJECT_STATUS_TYPE: [
        {value: 1, label: "Đơn vị mới tạo"},
        {value: 2, label: "Đã phê duyệt"},
        {value: 3, label: "Từ chối phê duyệt"},
        {value: 4, label: "Đã hủy"}
    ],
    MASS_CRITERIA_RESPONSE_TYPE: [
        {value: 0, label: "Chưa thực hiện"},
        {value: 1, label: "Dự thảo"},
        {value: 2, label: "Đang trình ký"},
        {value: 3, label: "Từ chối phê duyệt"},
        {value: 4, label: "Đã hoàn thành"}
    ],
    SELECT_IS_PARTY: [
        {id: 1, name: " Là đảng viên "},
        {id: 2, name: " Không phải đảng viên "}
    ],
    SELECT_YES_NO: [
        {id: 1, name: " Có "},
        {id: 2, name: " Không "}
    ],
    SELECT_NATION: [
        {id: 1, name: " Dân tộc Kinh "},
        {id: 2, name: " Dân tộc thiểu số "}
    ],
    SELECT_JOIN_KEY_PROJECT: [
        {id: 1, name: " Hiện tại đang tham gia "},
        {id: 2, name: " Có tham gia "},
        {id: 3, name: " Hiện tại không tham gia "},
        {id: 4, name: " Không tham gia "}
    ],
    SELECT_BVAN: [
        {id: 1, name: " Cấp ủy viên "},
        {id: 2, name: " Chiến sỹ bảo vệ "}
    ],
    CLASSIFY_TYPE: [
        {id: 1, name: 'Dân sự'},
        {id: 2, name: 'Quân sự'},
    ],
    REPORT_INCREASE_DECREASE: [
        {id: 1, name: 'Báo cáo xu hướng tăng giảm theo năm'},
        {id: 2, name: 'So sánh số liệu giữa 2 thời điểm'},
        {id: 3, name: 'So sánh số liệu cùng kỳ trước, cùng kỳ sau'},
    ],
    SELECT_STAFF_ASSESSMENT_CRITERIA_GROUP_STATUS: [
        {id: 1, name: "Nháp"},
        {id: 2, name: "Hiệu lực"},
        {id: 3, name: "Hết hiệu lực"}
    ],
    SELECT_STAFF_ASSESSMENT_CRITERIA_GROUP_STATUS_2: [
        {id: 2, name: "Hiệu lực"},
        {id: 3, name: "Hết hiệu lực"}
    ],
    SELECT_STAFF_ASSESSMENT_CRITERIA_GROUP_TYPE: [
        {id: 1, name: "Mặc định"},
        {id: 2, name: "Danh sách"}
    ],
    ICON_TYPE_LIST: [
        {id: 1, name: "Icon 1"},
        {id: 2, name: "Icon 2"},
        {id: 3, name: "Icon 3"}
    ],
    FIELD_TYPE_LIST: [
        {id: 1, name: "Combobox"},
        {id: 2, name: "Textbox"},
        {id: 3, name: "Date"},
        {id: 4, name: "DateTime"},
        {id: 5, name: "Time"},
        {id: 6, name: "Spinner"},
        {id: 7, name: "TextArea"},
        {id: 8, name: "Star"},
        {id: 9, name: "Radio Button"},
        {id: 10, name: "From To"},
        {id: 11, name: "Tỷ lệ"}
    ],
    ASSESSMENT_STATISTIC_TYPELIST: [
        {id: 1, name: "Thống kê tỷ lệ hoàn thành đánh giá"},
        {id: 2, name: "Thống kê tỷ lệ kết quả đánh giá"},
    ],
    SIGN_STATUS_TYPE: [
        {value: 0, label: "Chưa đánh giá"},
        {value: 1, label: "Đã đánh giá"}

    ],
    ASSESSMENT_COMPLETE_STATUS_TYPE: [
        {value: 0, label: "Chưa hoàn thành đánh giá"},
        {value: 1, label: "Đã hoàn thành đánh giá"}

    ],
    SIGN_IMAGE: [
        {id: 1, name: "Chính quyền"},
        {id: 2, name: "Đảng"}
    ],
    ASSESSMENT_VALUE_DEFAULT: {
        index: "Mặc định",
        assessmentLevelName: "Cá nhân đánh giá",
        hasSign: 1,
        joinAssessment: 1,
        displaySignImage: 1,
        signImage: 1,
        orderAssessment: 1
    },
    ASSESSMENT_EXPRESSION_TYPE: [
        {value: 1, label: "Kết quả đánh giá"},
        {value: 2, label: "Điểm đánh giá"},
        {value: 3, label: "Cấp đang đánh giá"},
        {value: 4, label: "Trạng thái cấp đang đánh giá"}
    ],
    HAS_ASSESSMENT_AGAIN: 1, // cho phep danh gia lai o cac cap danh gia tiep theo
    SORT_TYPE: [
        {value: 0, label: "Điểm giảm dần"},
        {value: 1, label: "Điểm tăng dần"}
    ],
    ORG_ROOT_ID: 148842,
    PARTY_ORG_ROOT_ID: 1,
    WOMEN_ORG_ID: 1,
    YOUTH_ORG_ID: 48,
    UNION_ORG_ID: 8,
    WOMEN_LIST_OBJECT: [
        {id: 1, name: "Cán bộ HPN"},
        {id: 2, name: "Hội viên phụ nữ"},
        {id: 3, name: "PN là cán bộ công đoàn"},
        {id: 4, name: "PN là cán bộ Đoàn"},
        {id: 5, name: "PN là cán bộ quản lý"},
        {id: 6, name: "PN là Đảng viên"},
        {id: 7, name: "PN tham gia cấp ủy trên cơ sở"},
        {id: 8, name: "PN tham gia cấp ủy các cấp"}
    ],
    YOUTH_LIST_OBJECT: [
        {id: 9, name: "Cán bộ đoàn"},
        {id: 10, name: "Thanh niên"},
        {id: 11, name: "Đoàn viên"},
        {id: 12, name: "ĐVTN là cán bộ Công đoàn"},
        {id: 13, name: "ĐVTN là cán bộ Phụ nữ"},
        {id: 14, name: "ĐVTN là cán bộ quản lý"},
        {id: 15, name: "ĐVTN là Đảng viên"},
        {id: 16, name: "ĐVTN tham gia cấp ủy trên cơ sở"},
        {id: 17, name: "ĐVTN tham gia cấp ủy các cấp"}
    ],
    UNION_LIST_OBJECT: [
        {id: 18, name: "Cán bộ công đoàn"},
        {id: 19, name: "Công đoàn viên"},
        {id: 20, name: "CĐV là cán bộ Hội PN"},
        {id: 21, name: "CĐV là cán bộ Đoàn"},
        {id: 22, name: "CĐV là cán bộ quản lý"},
        {id: 23, name: "CĐV là Đảng viên"},
        {id: 24, name: "CĐV tham gia cấp ủy trên cơ sở"},
        {id: 25, name: "CĐV tham gia cấp ủy các cấp"}
    ],
    MASS_MEMBER_AGE_TYPE_LIST: [
        {value: 1, label: "<= 30 tuổi"},
        {value: 2, label: "<= 35 tuổi"},
        {value: 3, label: "> 35 tuổi"},
    ],
    ASSESSMENT_PERIOD_STATUS_LIST: [
        {id: 0, name: "Chưa ban hành"},
        {id: 1, name: "Đã ban hành"},
    ],
    IS_PARTY_MEMBER_ASSESSMENT_LIST: [
        {id: 1, name: "Đảng viên"},
        {id: 2, name: "Cán bộ"},
        {id: 3, name: "Diện cán bộ quản lý"},
    ],
    REWARD_OBJECT_LIST: [
        {id: LOAI_DOI_TUONG_KHEN_THUONG.CA_NHAN, name: "Khen thưởng cá nhân"},
        {id: LOAI_DOI_TUONG_KHEN_THUONG.TAP_THE, name: "Khen thưởng tập thể"},
        {id: LOAI_DOI_TUONG_KHEN_THUONG.CHI_PHI, name: "Chi phí khen thưởng"},
    ],
    REWARD_GENERAL_TYPE_LIST: [
        {id: LOAI_KHEN_THUONG.TO_CHUC_DANG, name: "Tổ chức Đảng"},
        {id: LOAI_KHEN_THUONG.TO_CHUC_DOAN, name: "Tổ chức Công đoàn"},
        {id: LOAI_KHEN_THUONG.TO_CHUC_PHU_NU, name: "Tổ chức Phụ nữ"},
        {id: LOAI_KHEN_THUONG.TO_CHUC_THANH_NIEN, name: "Tổ chức Thanh niên"},
        {id: LOAI_KHEN_THUONG.CHINH_QUYEN, name: "Chính quyền"}
    ],
    EMPLOYEE_STATUS: [
        {id: 1, name: "Đang làm việc"},
        {id: 2, name: "Đã nghỉ hưu"},
        {id: 3, name: "Tất cả"}
    ],
    WELFARE_CATEGORY_LEVEL: [
        {id: 1, name: "Mức 1"},
        {id: 2, name: "Mức 2"},
        {id: 3, name: "Mức 3"},
        {id: 4, name: "Mức 4"},
        {id: 5, name: "Mức 5"}
    ],
    RECEIVER_TYPE: [
        {id: 1, name: "Đầu mối đơn vị"},
        {id: 2, name: "Cá nhân"}
    ],
    REWARD_GROUP_LIST: [
        {id: 1, name: "Trong tập đoàn"},
        {id: 2, name: "Ngoài tập đoàn"},
    ],

    REWARD_PERIOD_TYPE_LIST: [
        {id: 1, name: "Định kỳ"},
        {id: 2, name: "Đột xuất"},
    ],
    REWARD_FUN_CATEGORY_LIST: [
        {id: 'F04', name: "F04 - Quỹ khen thưởng (Năm trước)"},
        {id: 'F03', name: "F03 - Qũy khen thưởng"},
    ],
    REWARD_FUN_CATEGORY_LIST_OTHER: [
        {id: 'F72', name: "F72 - Đảng phí"},
    ],
    REWARD_CATEGORY: [
        {id: 1, name: "Danh hiệu"},
        {id: 2, name: "Hình thức"},
        {id: 3, name: "Nội dung khác"}
    ],
    STATUS_REWARD_THOUGHT_REPORT: [
        {id: 1, name: "Chờ giải trình và xử lý"},
        {id: 2, name: "Đã giải trình và xử lý"}
    ],
    /** D2T- De xuat khen thuong - start */
    REWARD_PROPOSE_STATUS: [
        {id: 1, name: "Soạn đề xuất"},
        {id: 2, name: "Chờ xét duyệt"},
        {id: 3, name: "Từ chối xét duyệt"},
        {id: 4, name: "Đã duyệt xét duyệt"},
        {id: 5, name: "Soạn trình ký"},
        {id: 6, name: "Đang trình ký"},
        {id: 7, name: "Đã duyệt trình ký"},
        {id: 8, name: "Từ chối trình ký"}
    ],
    REWARD_PROPOSE_STATUS2: [
        {id: 1, name: "Dự thảo"},
        {id: 2, name: "Chờ ký duyệt"},
        {id: 3, name: "Từ chối duyệt"},
        {id: 4, name: "Chờ xét chọn"},
        {id: 5, name: "Đang xét chọn"},
        {id: 6, name: "Đã xét chọn"},
        {id: 7, name: "Bị từ chối"},
    ],
    /** D2T- De xuat khen thuong - end */
    /** D2T- De xuat trinh ky khen thuong - start */
    REWARD_PROPOSE_SIGN_STATUS: [
        {id: 0, name: "Soạn trình ký"},
        {id: 1, name: "Đang trình ký"},
        {id: 3, name: "Đã duyệt trình ký"},
        {id: 4, name: "Từ chối trình ký"}
    ],
    /** D2T- De xuat trinh ky khen thuong - end */
    /** D2T- Phe duyet de xuat khen thuong - start */
    REWARD_PROPOSE_APPROVAL_STATUS: [
        {id: 1, name: "Chờ xét duyệt"},
        {id: 2, name: "Từ chối xét duyệt"},
        {id: 3, name: "Đã duyệt xét duyệt"}
    ],
    /** D2T- Phe duyet de xuat khen thuong - end */
    REWARD_PROPOSE_TYPE_LIST: [
        {id: LOAI_KHEN_THUONG.TO_CHUC_DANG, name: "Tổ chức Đảng"},
        {id: LOAI_KHEN_THUONG.TO_CHUC_DOAN, name: "Tổ chức Công đoàn"},
        {id: LOAI_KHEN_THUONG.TO_CHUC_PHU_NU, name: "Tổ chức Phụ nữ"},
        {id: LOAI_KHEN_THUONG.TO_CHUC_THANH_NIEN, name: "Tổ chức Thanh niên"},
        {id: LOAI_KHEN_THUONG.CHINH_QUYEN, name: "Chính quyền"}
    ],

    OBJECT_TYPE: [
        {id: OBJECT_TYPE_LIST.CHINH_QUYEN, name: "Tổ chức chính quyền"},
        {id: OBJECT_TYPE_LIST.TO_CHUC_DANG, name: "Tổ chức Đảng"},
        {id: OBJECT_TYPE_LIST.TO_CHUC_PHU_NU, name: "Tổ chức Phụ nữ"},
        {id: OBJECT_TYPE_LIST.TO_CHUC_DOAN, name: "Tổ chức Công đoàn"},
        {id: OBJECT_TYPE_LIST.TO_CHUC_THANH_NIEN, name: "Tổ chức Thanh niên"}
    ],

    REWARD_PROPOSE_PERIOD_TYPE_LIST: [
        {id: 1, name: "Định kỳ"},
        {id: 2, name: "Đột xuất"},
    ],
    /** D2T- De xuat trinh ky khen thuong - end */
    LETTER_DENUNCIATION_TYPE: [
        {value: 1, label: "Khiếu nại về kỷ luật Đảng viên"},
        {value: 2, label: "Khiếu nại về kỷ luật tổ chức Đảng"},
        {value: 3, label: "Tố cáo Đảng viên"},
        {value: 4, label: "Tố cáo tổ chức Đảng"}
    ],
    LETTER_DENUNCIATION_STATUS: [
        {value: 1, label: "Khởi tạo"},
        {value: 2, label: "Đề xuất xử lý"},
        {value: 3, label: "Bị từ chối"},
        {value: 4, label: "Đã giải quyết"}
    ],
    LETTER_DENUNCIATION_ACTION_TYPE: {
        RECEIVE: 0, // Tiếp nhận
        HANDLE_PARTY: 1 // Xử lý Đảng
    },
    CATEGORY_TYPE_GROUP: {
        LVDT: 1, // Linh vuc dao tao
        BHTT: 2, // Bieu hien tu tuong
        KTGS_KN: 3, // Kiem tra giam sat _ khieu nai
        KTGS_TC: 4 // Kiem tra giam sat _ to cao
    },
    DECISION_TYPE: {
        KNDV: {label: "partyMemberDecision.decisionType.1", value: 1, code: "KNDV", symbol: "/KNĐV"},
        CNDV: {label: "partyMemberDecision.decisionType.2", value: 2, code: "CNDV", symbol: "/CNĐV"},
        XTDV: {label: "partyMemberDecision.decisionType.3", value: 3, code: "XTDV", symbol: "/XTĐV"},
        CRKD: {label: "partyMemberDecision.decisionType.4", value: 4, code: "CRKD", symbol: "/CRKĐ"},
        MSHD: {label: "partyMemberDecision.decisionType.5", value: 5, code: "MSHD", symbol: "/MSH"}
    },
    DECISION_TYPE_SIGN_STATUS: [
        {value: 0, label: "partyMemberDecision.signStatus.0"},
        {value: 1, label: "partyMemberDecision.signStatus.1"},
        {value: 2, label: "partyMemberDecision.signStatus.2"},
        {value: 3, label: "partyMemberDecision.signStatus.3"},
        {value: 4, label: "partyMemberDecision.signStatus.4"},
        {value: 5, label: "partyMemberDecision.signStatus.5"},
    ],

    PERIOD_TYPE_LIST: [
        {id: 1, name: "Tháng"},
        {id: 2, name: "Quý"},
        {id: 3, name: "Năm"},
    ],
    PARTY_MEMBER_TYPE_LIST: [
        {id: 1, name: "Tất cả"},
        {id: 2, name: "Chính thức"},
        {id: 3, name: "Dự bị"},
        {id: 4, name: "Hết thời hạn dự bị"},
    ],
    MONTH_TYPE_LIST: [
        {id: 1, name: "Tháng này"},
        {id: 2, name: "Tuần này"},
    ],
    EMP_TYPE_LIST: [
        {id: 1, name: "Diện đối tượng"},
        {id: 2, name: "Cấp bậc"},
        {id: 3, name: "Loại hợp đồng"},
    ],
    STRUCTURE_TYPE_LIST: [
        {id: 1, name: "Độ tuổi"},
        {id: 2, name: "Tuổi đảng"},
        {id: 3, name: "Chuyên ngành đào tạo"},
        {id: 4, name: "Trình độ đào tạo"},
        {id: 5, name: "Giới tính"},
        {id: 6, name: "Dân tộc"},
        {id: 7, name: "Quốc tịch"},
        {id: 8, name: "Tôn giáo"},
        {id: 9, name: "Tình trạng hôn nhân"},
    ],
    REPEAT_CYCLE_ORDER: [
        {id: 1, name: "Đầu tiên", value: "FIRST"},
        {id: 2, name: "Thứ hai", value: "SECOND"},
        {id: 3, name: "Thứ ba", value: "THIRD"},
        {id: 4, name: "Thứ tư", value: "FOURTH"},
        {id: 5, name: "Cuối cùng", value: "LAST"},
    ],
    MONTH_OF_YEAR: [
        {id: 1, name: "Tháng một"},
        {id: 2, name: "Tháng hai"},
        {id: 3, name: "Tháng ba"},
        {id: 4, name: "Tháng tư"},
        {id: 5, name: "Tháng năm"},
        {id: 6, name: "Tháng sáu"},
        {id: 7, name: "Tháng bảy"},
        {id: 8, name: "Tháng tám"},
        {id: 9, name: "Tháng chín"},
        {id: 10, name: "Tháng mười"},
        {id: 11, name: "Tháng mười một"},
        {id: 12, name: "Tháng mười hai"},
    ],
    PERIOD_TYPE: {
        THANG: 1,
        QUY: 2,
        NAM: 3
    },
    DISPLAY_TYPE: {
        SO_LUONG: 1,
        TI_LE: 2
    },
    SEND_METHOD: [
        {id: 1, name: "TO"},
        {id: 2, name: "CC"},
    ],
    TRANSFER_DOCUMENT_TYPE: {
        CA_NHAN: 1,
        TO_CHUC: 2,
        NHOM: 3
    },
    LEVEL_ROLE: [
        {id: 1, name: "Không"},
        {id: 2, name: "Bí thư"},
        {id: 3, name: "Phó bí thư"},
        {id: 9, name: "Ủy viên thường vụ"},
        {id: 4, name: "Trợ lý"},
        {id: 5, name: "TP chính trị"},
        {id: 6, name: "Quản lý trực tiếp"},
        {id: 7, name: "Trợ lý QLTT cấp đơn vị"},
        {id: 8, name: "Trợ lý QLTT cấp TĐ"},
        {id: 11, name: "Chi ủy viên"},
        {id: 10, name: "Đảng ủy viên"},
    ],
    RESOLUTION_MONTH_DOCUMENT_STATUS: [
        {value: 0, lable: "Dự thảo", transCode: 'assessmentPartyOrganization.titleStatus.draft'},
        {value: 1, lable: "Đang trình ký", transCode: 'assessmentPartyOrganization.titleStatus.signing'},
        {value: 2, lable: "Từ chối", transCode: 'assessmentPartyOrganization.titleStatus.cancel'},
        {value: 3, lable: "Đã ký duyệt", transCode: 'assessmentPartyOrganization.titleStatus.approval'},
        {value: 4, lable: "Huỷ luồng", transCode: 'assessmentPartyOrganization.titleStatus.refuse'},
        {value: 5, lable: "Đã ban hành", transCode: 'assessmentPartyOrganization.titleStatus.promulgate'},
    ],
    ASSESSMENT_PARTY_ORGANIZATION_STATUS: [
        {value: 1, lable: "Chưa thực hiện", transCode: 'assessmentPartyOrganization.status.noActive'},
        {value: 2, lable: "Đang thực hiện", transCode: 'assessmentPartyOrganization.status.doing'},
        {value: 3, lable: "Đã hoàn thành", transCode: 'assessmentPartyOrganization.status.completed'},
        {
            value: 4,
            lable: "Hoàn thành nhưng quá hạn",
            transCode: 'assessmentPartyOrganization.status.completedButExprired'
        },
    ],
    PROPOSAL_REWARD_DECIDE_STATUS: [
        {id: REWARD_PROPOSE_STATUS.SOAN_DE_XUAT, name: "Soạn đề xuất"},
        {id: REWARD_PROPOSE_STATUS.CHO_DE_XUAT, name: "Chờ đề xuất"},
        {id: REWARD_PROPOSE_STATUS.TU_CHOI_XET_DUYET, name: "Từ chối đề duyệt"},
        {id: REWARD_PROPOSE_STATUS.DA_DUYET_XET_DUYET, name: "Đã duyệt xét duyệt"},
        {id: REWARD_PROPOSE_STATUS.SOAN_TRINH_KY, name: "Soạn trình ký"},
        {id: REWARD_PROPOSE_STATUS.DANG_TRINH_KY, name: "Đang trình ký"},
        {id: REWARD_PROPOSE_STATUS.DA_DUYET_TRINH_KY, name: "Đã duyệt trình ký"},
        {id: REWARD_PROPOSE_STATUS.TU_CHOI_TRINH_KY, name: "Từ chối trình ký"}
    ],
    REWARD_PROPOSE_SIGN_DECIDE_STATUS: [
        {id: REWARD_PROPOSE_SIGN_STATUS.SOAN_TRINH_KY, name: "Soạn trình ký"},
        {id: REWARD_PROPOSE_SIGN_STATUS.DANG_TRINH_KY, name: "Đang trình ký"},
        {id: REWARD_PROPOSE_SIGN_STATUS.DA_DUYET_TRINH_KY, name: "Đã duyệt trình ký"},
        {id: REWARD_PROPOSE_SIGN_STATUS.TU_CHOI_TRINH_KY, name: "Từ chối trình ký"}
    ],
    REWARD_PROPOSE_APPROVAL_DECIDE_STATUS: [
        {id: REWARD_PROPOSE_APPROVAL_STATUS.CHO_DE_XUAT, name: "Chờ xét duyệt"},
        {id: REWARD_PROPOSE_APPROVAL_STATUS.TU_CHOI_XET_DUYET, name: "Đã từ chối xét duyệt"},
        {id: REWARD_PROPOSE_APPROVAL_STATUS.DA_DUYET_XET_DUYET, name: "Đã duyệt xét duyệt"}
    ],
    CONFIG_ARMY_CONDITION_DATA_TYPE: [
        {label: 'label.empArmyProposed.ok', value: 1},
        {label: 'label.empArmyProposed.notOk', value: 2}
    ],
    CONFIG_ARMY_CONDITION_GROUP_TYPE: [
        {label: 'label.config.army.condition.evaluate', value: 1},
        {label: 'label.config.army.condition.explanation', value: 2},
        {label: 'label.config.army.condition.evaluateCQ', value: 3}
    ],
    SUB_TEMPLATE_PRINT_LAYOUT: [
        {label: 'label.armyProposedTemplate.A3', value: 'A3'},
        {label: 'label.armyProposedTemplate.A4', value: 'A4'}
    ],
    REWARD_CATEGORY_TYPE_LIST: [
        {id: REWARD_CATEGORY_TYPE.CAP_KHEN_THUONG, name: "Cấp khen thưởng"},
        {id: REWARD_CATEGORY_TYPE.DANH_HIEU_KHEN_THUONG, name: "Danh hiệu/hình thức khen thưởng"},
    ],
    BENEFCIARY_TYPE_LIST: [
        {id: DOI_TUONG_HUONG.BAN_THAN, name: "Bản thân CBNV"},
        {id: DOI_TUONG_HUONG.THAN_NHAN, name: "Thân nhân CBNV"},
        {id: DOI_TUONG_HUONG.CA_HAI, name: "Cả hai"},
    ],
    SUBSIDIZED_STATUS_LIST: [
        {id: SUBSIDIZED_STATUS.SOAN_THAO, name: "Soạn thảo"},
        {id: SUBSIDIZED_STATUS.CHO_XET_DUYET, name: "Chờ xét duyệt"},
        {id: SUBSIDIZED_STATUS.DA_PHE_DUYET, name: "Đã phê duyệt"},
        {id: SUBSIDIZED_STATUS.DA_TU_CHOI_PHE_DUYET, name: "Đã từ chối phê duyệt"},
        {id: SUBSIDIZED_STATUS.DANG_TRINH_KY, name: "Đang trình ký"},
        {id: SUBSIDIZED_STATUS.DA_DUYET_TRINH_KY, name: "Đã duyệt trình ký"},
        {id: SUBSIDIZED_STATUS.DA_TU_CHOI_KY, name: "Đã từ chối ký"},
    ],
    SUBSIDIZED_APPROVE_STATUS_LIST: [
        {id: SUBSIDIZED_APPROVE_STATUS.CHO_XET_DUYET, name: "Chờ xét duyệt"},
        {id: SUBSIDIZED_APPROVE_STATUS.DA_PHE_DUYET, name: "Đã phê duyệt"},
        {id: SUBSIDIZED_APPROVE_STATUS.DA_TU_CHOI_PHE_DUYET, name: "Đã từ chối phê duyệt"},
        {id: SUBSIDIZED_APPROVE_STATUS.DANG_TRINH_KY, name: "Đang trình ký"},
        {id: SUBSIDIZED_APPROVE_STATUS.DA_DUYET_TRINH_KY, name: "Đã duyệt trình ký"},
        {id: SUBSIDIZED_APPROVE_STATUS.DA_TU_CHOI_KY, name: "Đã từ chối ký"},
    ],
    PROPOSE_STATUS_LIST: [
        {id: PROPOSE_STATUS.DU_THAO, name: "Dự thảo"},
        {id: PROPOSE_STATUS.CHO_KY_DUYET, name: "Chờ ký duyệt"},
        {id: PROPOSE_STATUS.TU_CHOI_DUYET, name: "Từ chối duyệt"},
        {id: PROPOSE_STATUS.CHO_XET_CHON, name: "Chờ xét chọn"},
        {id: PROPOSE_STATUS.DANG_XET_CHON, name: "Đang xét chọn"},
        {id: PROPOSE_STATUS.DA_XET_CHON, name: "Đã xét chọn"},
    ],
    SELECTION_STATUS_LIST: [
        {id: SELECTION_STATUS.CHO_XET_CHON, name: "Chờ xét chọn"},
        {id: SELECTION_STATUS.DANG_XET_CHON, name: "Đang xét chọn"},
        {id: SELECTION_STATUS.DA_XET_CHON, name: "Đã xét chọn"},
    ],
    PROPOSE_SIGN_LIST_STATUS: [
        {id: PROPOSE_SIGN_STATUS.DU_THAO, name: "Dự thảo"},
        {id: PROPOSE_SIGN_STATUS.CHO_KY_DUYET, name: "Chờ ký duyệt"},
        {id: PROPOSE_SIGN_STATUS.DA_KY_DUYET, name: "Đã ký duyệt"},
        {id: PROPOSE_SIGN_STATUS.TU_CHOI_KY_DUYET, name: "Từ chối ký duyệt"}
    ],
    AD_SCHEDULER_LIST_ACTIVESTATUS: [
        {id: AD_SCHEDULER_ACTIVESTATUS.ACTIVE, name: "Hoạt động"},
        {id: AD_SCHEDULER_ACTIVESTATUS.NONEACTIVE, name: "Không hoạt động"}
    ],
    SAP_STATEMENT_STATUS: [
        {id: SAP_STATEMENT_STATUS.KHOI_TAO, name: "Khởi tạo"},
        {id: SAP_STATEMENT_STATUS.BAN_HANH, name: "Ban hành"},
        {id: SAP_STATEMENT_STATUS.HUY_LUONG, name: "Huỷ luồng"},
        {id: SAP_STATEMENT_STATUS.HOAN_THANH, name: "Hoàn tất"}
    ],
    SCHEDULER_PROCESSING_STATUS: [
        {id: SCHEDULER_PROCESSING_STATUS_VLUE.PROCESSING, name: "Đang thực hiện"},
        {id: SCHEDULER_PROCESSING_STATUS_VLUE.DONE, name: "Hoàn thành"}

    ],
    EXPRESSION_REPORT_TYPE: {
        TUAN: 1,
        THANG: 2,
        QUY: 3,
        NAM: 4
    },
    ASSESSMENT_LEVEL_TYPE_LIST: [
        {id: ASSESSMENT_LEVEL_TYPE.THUONG, name: "Kì đánh giá thường"},
        {id: ASSESSMENT_LEVEL_TYPE.DAC_BIET, name: "Kì đánh giá đặc biệt"}
    ],
    OBJ_TYPE: [
        {id: 1, name: "Theo điều kiện sql"},
        {id: 2, name: "Theo phân quyền vps"}
    ]
} as any;

export enum INPUT_TYPE {
    TEXT = 'text',
    NUMBER = 'number',
    TEXT_AREA = 'text-area',
    CURRENCY = 'currency',
    DATE = 'date',
    URL = 'url'
}

export enum ACTION_FORM {
    INSERT = 'INSERT',
    UPDATE = 'UPDATE',
    IMPORT = 'IMPORT',
    VIEW = 'VIEW',
    DELETE = 'DELETE'
}

export enum RESOURCE {
    SYS_PROPERTY = 'SYS_PROPERTY',
    REPORT_DYNAMIC = 'REPORT_DYNAMIC',
    MASS_ORGANIZATION = 'MASS_ORGANIZATION',
    MASS_MEMBER = 'MASS_MEMBER',
    
    CTCT_THOROUGH_CONTENT_TOCHUCDANG = 'CTCT_THOROUGH_CONTENT_TOCHUCDANG',
    CTCT_THOROUGH_CONTENT_TUYENHUAN = 'CTCT_THOROUGH_CONTENT_TUYENHUAN',
    CTCT_THOROUGH_CONTENT_BAOVEANNINH = 'CTCT_THOROUGH_CONTENT_BAOVEANNINH',
    CTCT_THOROUGH_CONTENT_KIEMTRAGIAMSAT = 'CTCT_THOROUGH_CONTENT_KIEMTRAGIAMSAT',
    CTCT_THOROUGH_CONTENT_CONGTACQUANCHUNG = 'CTCT_THOROUGH_CONTENT_CONGTACQUANCHUNG',
    CTCT_THOROUGH_CONTENT_CHINHSACHDANVAN = 'CTCT_THOROUGH_CONTENT_CHINHSACHDANVAN',
    CTCT_THOROUGH_CONTENT_CANBO = 'CTCT_THOROUGH_CONTENT_CANBO'
}

export enum SYSTEM_PARAMETER_CODE {
    TEMPLATE_DYNAMIC_FORM_TYPE = 'TEMPLATE_DYNAMIC_FORM_TYPE',
    REPORT_DYNAMIC_CONDITION_TYPE = 'REPORT_DYNAMIC_CONDITION_TYPE',
    REPORT_DYNAMIC_FORMAT_REPORT = 'REPORT_DYNAMIC_FORMAT_REPORT',
    REPORT_DYNAMIC_DATA_TYPE = 'REPORT_DYNAMIC_DATA_TYPE'
}

export enum REPORT_DYNAMIC_CONDITION_TYPE {
    LONG = 'CON_LONG',
    DATE = 'CON_DATE',
    DOUBLE = 'CON_DOUBLE',
    COMBOBOX = 'CON_COMBOBOX',
    COMBOBOX_CONDITION = 'CON_COMBOBOX_CONDITION',
    GENDER = 'CON_GENDER',
    ORGANIZATION_PERMISSION = 'CON_ORGANIZATION_PERMISSION',
    PARTY_ORGANIZATION = 'CON_PARTY_ORGANIZATION',
    WOMEN_ORGANIATION = 'CON_WOMEN_ORGANIZATION',
    YOUTH_ORGANIZATION = 'CON_YOUTH_ORGANIZATION',
    UNION_ORGANIZATION = 'CON_UNION_ORGANIZATION',
    UNION_ORGANIZATION_NO_PERMISSION = 'CON_UNION_ORGANIZATION_NO_PERMISSION',
    POSITION = 'CON_POSITION',
    PARTY_POSITION = 'CON_PARTY_POSITION',
    MASS_POSITION_WOMEN = 'CON_MASS_POSITION_WOMEN',
    MASS_POSITION_YOUTH = 'CON_MASS_POSITION_YOUTH',
    MASS_POSITION_UNION = 'CON_MASS_POSITION_UNION',
    EMPLOYEE = 'CON_EMPLOYEE',
    EMPLOYEE_MANAGER = 'CON_EMPLOYEE_MANAGER',
    PARTY_MEMBER = 'CON_PARTY_MEMBER',
    MASS_MEMBER_WOMEN = 'CON_MASS_MEMBER_WOMEN',
    MASS_MEMBER_YOUTH = 'CON_MASS_MEMBER_YOUTH',
    MASS_MEMBER_UNION = 'CON_MASS_MEMBER_UNION',
    ORGANIZATION_TREE = 'CON_ORGANIZATION_TREE'
}

export enum WARNING_MANAGER_TYPE {
    EXPORT_REPORT = 1,
    NEXT_PAGE = 2
}

export enum RESPONSE_TYPE {
    SUCCESS = 'SUCCESS',
    WARNING = 'WARN',
    ERROR = 'ERROR',
}

export enum REPORT_SUBMISSION_TYPE {
    KHONG_KY_VO = "KHONG_KY_VO",
    CO_KY_VO_KHONG_DUYET = "CO_KY_VO_KHONG_DUYET",
    CO_KY_VO_CO_DUYET = "CO_KY_VO_CO_DUYET",
}

export enum REPORT_SUBMISSION_STATUS {
    CHUA_THUC_HIEN = "CHUA_THUC_HIEN",
    DU_THAO = "DU_THAO",
    CHO_XET_DUYET = "CHO_XET_DUYET",
    DOT_XUAT = "DOT_XUAT",
    DA_NOP = "DA_NOP",
    DANG_TRINH_KY = "DANG_TRINH_KY",
    BI_TU_CHOI_DUYET = "BI_TU_CHOI_DUYET",
    BI_TU_CHOI_KY_DUYET = "BI_TU_CHOI_KY_DUYET",
    DA_NOP_BK = "DA_NOP_BK",
    CHUA_TRINH_KY = "CHUA_TRINH_KY",
    DA_XET_DUYET = "DA_XET_DUYET",
}

export const HELP_MAPPING_MENU = [
    {url: '/reward/reward-general', url_help: 'http://10.60.133.34:8000/ctct/Khen_Thuong/#45-ket-qua-khen-thuong'},
    {url: '/reward/reward-propose', url_help: 'http://10.60.133.34:8000/ctct/Khen_Thuong/#42-lap-e-xuat-khen-thuong'},
    {
        url: '/reward/reward-propose-approval',
        url_help: 'http://10.60.133.34:8000/ctct/Khen_Thuong/#43-xet-chon-khen-thuong'
    },
    {
        url: '/reward/reward-propose-sign/add-sign',
        url_help: 'http://10.60.133.34:8000/ctct/Khen_Thuong/#44-quyet-inh-khen-thuong'
    },
    {
        url: '/reward/reward-propose-sign',
        url_help: 'http://10.60.133.34:8000/ctct/Khen_Thuong/#44-quyet-inh-khen-thuong'
    },
    {url: '/reward/reward-category', url_help: 'http://10.60.133.34:8000/'},
    {url: '/subsidized/subsidized-period', url_help: 'http://10.60.133.34:8000/'},
    {
        url: '/employee/assessment/manager-field/assessment-period/member',
        url_help: 'http://10.60.133.34:8000/ctct/Danh_gia/'
    },
    {url: '/employee/assessment/manager-field/assessment-period', url_help: 'http://10.60.133.34:8000/ctct/Danh_gia/'},
    {url: '/employee/assessment-criteria', url_help: 'http://10.60.133.34:8000/ctct/Danh_gia/'},
    {url: '/employee/assessment-criteria-group', url_help: 'http://10.60.133.34:8000/ctct/Danh_gia/'},
    {
        url: '/employee/assessment/manager-field/assessment-period/member',
        url_help: 'http://10.60.133.34:8000/ctct/Danh_gia/'
    },
    {url: '/employee/assessment-formula', url_help: 'http://10.60.133.34:8000/ctct/Danh_gia/'},
    {url: '/competition-unit-registration', url_help: 'http://10.60.133.34:8000/ctct/Thi_dua_don_vi/'},
    {url: '/competition-program', url_help: 'http://10.60.133.34:8000/ctct/Thi_dua_ca_nhan/'},
]

export const MAP_YCBC_OBJECT_TYPE = {
    "YCBC_TUYEN_HUAN": 1,
    "YCBC_KIEM_TRA_GIAM_SAT": 1,
    "YCBC_BVAN": 1,
    "YCBC_CSDV": 1,
    "YCBC_CANBO": 1,
    "YCBC_TO CHUC DANG": 2,
    "YCBC_PHUNU": 3,
    "YCBC_CONGDOAN": 4,
    "YCBC_THANH NIÊN": 5,
}
