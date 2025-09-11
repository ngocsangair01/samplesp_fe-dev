export interface AssessmentPeriod {
  assessmentPeriodId: number,
  assessmentPeriodName: string,
  formulaId: number,
  assessmentTypeId: number,
  sendEmail: number,
  sendSms: number,
  effectiveDate: Date,
  expiredDate: Date,
  description: string,
  staffAssessmentedEmployee: number,
  countAssessmentedEmployee: number,
  settingIconId: number,
  isPartyMemberAssessment: number,
  assessmentYear: number,
  countAssessmented:number
}
export interface AssessmentFormType {
  assessmentFormTypeId: number,
  formTypeName: string,
  assessmentLevelId: number,
  formType: number
}
export enum ALL_ASSESSMENT_EMPLOYEE_PAGE {
  ASSESSMENT_PERIOD_PAGE = 'assessment-period-page',
  EMPLOYEE_PAGE = 'employee-page',
  ASSESSMENT_PAGE = 'assessment-page'
}
export enum ALL_RIGHT_MENU_TAB {
  PROFILE_TAB = 'profile-tab',
  ADVANCE_SEARCH_TAB = 'advance-search-tab',
  STATISTIC_TAB = 'statistic-tab',
  RANKING_TAB = 'ranking-tab'
}
export interface AssessmentCriteriaGroup {
  assessmentCriteriaGroupId: number;
  assessmentCriteriaGroupName: string;
  assessmentCriteriaGroupType: number;
  assessmentCriteriaGroupFormType: number;
  index: number;
  groupChildList: ListAssessmentCriterias[],
}
export interface ListAssessmentCriterias {
  listAssessmentCriterias: AssessmentCriteria[];
}
export interface AssessmentCriteria {
  assessmentCriteriaId: number;
  assessmentCriteriaGroupId: number;
  assessmentCriteriaGroupType: number;
  settingIconId: number;
  assessmentCriteriaCode: string;
  assessmentCriteriaName: string;
  fieldType: number;
  fieldItems: string;
  fieldDefaultValue: any;
  fieldPlaceholderValue: string;
  assessmentCriteriaExplain: string;
  maxLength: number;
  assessmentMinValue: number;
  assessmentMaxValue: number;
  step: number;
  scoringGuide: string;
  note: string;
  iconName: string;
  assessmentCriteriaRanks: string;
  required: number;
  resultFinal: number;
  assessmentCriteriaRankColor: string;
  assessmentCriteriaRows: number;
  assessmentCriteriaRankLabel: string;
}
export interface AssessmentCriteriaRank {
  assessmentCriteriaRankId: number;
  assessmentCriteriaId: number;
  assessmentCriteriaRankName: string;
  startValue: number;
  endValue: number;
}
export enum ASSESSMENT_FIELD_TYPE {
  COMBO_BOX = 1,
  TEXT_BOX = 2,
  DATE = 3,
  DATE_TIME = 4,
  TIME = 5,
  SPINNER = 6,
  TEXTAREA = 7,
  STAR = 8,
  RADIO_BUTTON = 9,
  FROM_TO = 10,
  PERCENT = 11
}