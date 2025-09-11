import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';
import * as moment from 'moment';
import { AssessmentListComponent } from '../assessment-list/assessment-list.component';
import { EducationProcessListComponent } from '../education-process-list/education-process-list.component';
import { EmpTypeProcessListComponent } from '../emp-type-process-list/emp-type-process-list.component';
import { EmployeeProfileListComponent } from '../employee-profile-list/employee-profile-list.component';
import { FamilyRelationshipListComponent } from '../family-relationship-list/family-relationship-list.component';
import { IdeaInnoListComponent } from '../idea-inno-list/idea-inno-list.component';
import { InsuranceProcessListComponent } from '../insurance-process-list/insurance-process-list.component';
import { PartyMemberConcurrentProcessListComponent } from '../party-member-concurrent-process-list/party-member-concurrent-process-list.component';
import { PartyMemberRewardListComponent } from '../party-member-reward-list/party-member-reward-list.component';
import { RelicFeaturedListComponent } from '../relic-featured-list/relic-featured-list.component';
import { WorkProcessListComponent } from '../work-process-list/work-process-list.component';
import { AssessmentService } from './../../../../../core/services/employee/assessment.service';
import { EmployeeProfileService } from './../../../../../core/services/employee/employee_profile.service';
import { FileStorageService } from './../../../../../core/services/file-storage.service';
import {
  InsuranceSalaryProcessListComponent
} from "@app/modules/employee/curriculum-vitae/view-all-personal-information/insurance-salary-process-list/insurance-salary-process-list.component";
import { AlowancePositionListComponent } from '../alowance-position-list/alowance-position-list.component';

@Component({
  selector: 'view-all-personal-info-index',
  templateUrl: './view-all-personal-info-index.component.html',
  styleUrls: ['./view-all-personal-info-index.component.css'],
  providers: [EmployeeResolver],
})
export class ViewAllPersonalInfoIndex extends BaseComponent implements OnInit {
  isViewMore: boolean = false;
  isOpenSalaryProcess: boolean = false;
  isOpenInsuranceProcess: boolean = false;
  isOpenAllowanceProcess: boolean = false;
  isOpenInsuranceProcess2: boolean = false;
  isOpenWorkProcess: boolean = false;
  isOpenEducationProcess: boolean = false;
  isOpenEmpTypeProcess: boolean = false;
  isOpenPartyProcess: boolean = false;
  isOpenReward: boolean = false;
  isOpenIdea: boolean = false;
  isOpenProfile: boolean = false;
  isOpenFamilyRelationship: boolean = false;
  isOpenAssessment: boolean = false;
  isOpenRelicFeature: boolean = false;
  // List detail data
  empTypeName: string = '';
  partyPositionName: string = '';
  workingProcess: string = '';
  empInsurance: string = '';
  educationLevel: string = '';
  partyProcess: string = '';
  rewardOrDiscipline: string = '';
  numberOfEmpFamilyRelationship: string = '';
  relicName: string = '';
  empFileName: any;
  empFileFromVHR: any;
  strEmpFileName: string = '';
  ideaInno: string = '';
  employeeAssessment: string = '';
  vtCriticalId: string = '';

  @ViewChild('workProcessList')
  workProcessList: WorkProcessListComponent;

  @ViewChild('empTypeList')
  empTypeProcessList: EmpTypeProcessListComponent;

  @ViewChild('insuranceProcessList')
  insuranceProcessList: InsuranceProcessListComponent;
  @ViewChild('insuranceSalaryProcessList')
  insuranceSalaryProcessList: InsuranceSalaryProcessListComponent;

  @ViewChild('partyMemberConcurrentProcessList')
  partyMemberConcurrentProcessList: PartyMemberConcurrentProcessListComponent;

  @ViewChild('partyMemberRewardlist')
  partyMemberRewardList: PartyMemberRewardListComponent;

  @ViewChild('educationProcessList')
  educationProcessList: EducationProcessListComponent;

  @ViewChild('familyRelationshipList')
  familyRelationshipList: FamilyRelationshipListComponent;

  @ViewChild('relicFeaturedList')
  relicFeaturedList: RelicFeaturedListComponent;

  @ViewChild('assessmentList')
  assessmentList: AssessmentListComponent;

  @ViewChild('employeeProfileList')
  employeeProfileList: EmployeeProfileListComponent;

  @ViewChild('ideaInnoList')
  ideaInnoList: IdeaInnoListComponent;

  // danh sách phụ cấp lương
  @ViewChild('alowancePositionList')
  alowancePositionList: AlowancePositionListComponent;

  employeeBean;
  private _employeeId;
  navigationSubscription;
  isMobileScreen: boolean = false;
  
  constructor(
    private router: Router,
    private employeeResolver: EmployeeResolver,
    private activatedRoute: ActivatedRoute,
    private curriculumVitaeService: CurriculumVitaeService,
    private employeeProfileService: EmployeeProfileService,
    private fileStorage: FileStorageService,
    private assessmentService: AssessmentService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeT63Information"));
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.activatedRoute.snapshot.params;
        if (this._employeeId !== params.empOverallInfoId) {
          this.curriculumVitaeService.getEmployeeInfo(params.empOverallInfoId).subscribe(
            res => {
              if (res.type === 'SUCCESS') {
                this._employeeId = params.empOverallInfoId;
                this.employeeResolver.resolve(res.data.employeeId);
                this.employeeBean = res.data;
                this.resetViewDetail();
                // Api lấy thông tin về nhân viên: diện đối tượng, chức danh Đảng, khen thưởng kỷ luật,...
                this.curriculumVitaeService.getTotalInfo(params.empOverallInfoId).subscribe(
                  res => {
                    if (res.data) {
                      this.buildDetailTitle(res.data);
                    }
                  }
                );
              } else {
                this.router.navigate(['/employee/curriculum-vitae']);
              }
            }
          );
        }
      }
    });
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
  }

  /**
   * Hiển thị chi tiết
   */
  processShowDetail(viewDetail: any) {
    switch (viewDetail) {
      // Chi tiết diễn biến lương chức danh
      case 'salaryProcess': {
        if (!this.isOpenSalaryProcess) {
          this.isOpenInsuranceProcess = false;
          this.isOpenSalaryProcess = true;
        }
        break;
      }
      // Chi tiết diễn biến lương bảo hiểm
      case 'insuranceProcess': {
        if (!this.isOpenInsuranceProcess) {
          this.insuranceSalaryProcessList.processSearch();
          this.isOpenSalaryProcess = false;
          this.isOpenInsuranceProcess = true;
        }
        break;
      }
      // Chi tiết quá trình phụ cấp lương
      case 'allowanceProcess': {
        if (!this.isOpenAllowanceProcess) {
          this.isOpenInsuranceProcess2 = false;
          this.isOpenAllowanceProcess = true;
          this.alowancePositionList.processSearch();
        }
        break;
      }
      // Chi tiết quá trình tham gia BHXH
      case 'insuranceProcess2': {
        if (!this.isOpenInsuranceProcess2) {
          this.insuranceProcessList.processSearch();
          this.isOpenAllowanceProcess = false;
          this.isOpenInsuranceProcess2 = true;
        }
        break;
      }
      // Chi tiết quá trình công tác
      case 'workProcess': {
        if (!this.isOpenWorkProcess) {
          this.workProcessList.processSearch();
          this.isOpenEducationProcess = false;
          this.isOpenWorkProcess = true;
        }
        break;
      }
      // Chi tiết quá trình đào tạo và nghiên cứu
      case 'educationProcess': {
        if (!this.isOpenEducationProcess) {
          this.educationProcessList.processSearch();
          this.isOpenWorkProcess = false;
          this.isOpenEducationProcess = true;
        }
        break;
      }
      // Chi tiết quá trình diện đối tượng
      case 'empTypeProcess': {
        if (!this.isOpenEmpTypeProcess) {
          this.empTypeProcessList.processSearch();
          this.isOpenPartyProcess = false;
          this.isOpenEmpTypeProcess = true;
        }
        break;
      }
      // Chi tiết quá trình công tác Đảng
      case 'partyProcess': {
        if (!this.isOpenPartyProcess) {
          this.partyMemberConcurrentProcessList.processSearch();
          this.isOpenEmpTypeProcess = false;
          this.isOpenPartyProcess = true;
        }
        break;
      }
      // Khen thưởng kỷ luật
      case 'reward': {
        if (!this.isOpenReward) {
          this.partyMemberRewardList.processSearchDetail();
          this.isOpenRelicFeature = false;
          this.isOpenReward = true;
        }
        break;
      }
      // Chi tiết thành tích nổi bật
      case 'relicFeature': {
        if (!this.isOpenRelicFeature) {
          this.relicFeaturedList.processSearch();
          this.isOpenReward = false;
          this.isOpenRelicFeature = true;
        }
        break;
      }
      // Chi tiết sáng kiến ý tưởng
      case 'idea': {
        if (!this.isOpenIdea) {
          this.ideaInnoList.processSearch();
          this.isOpenProfile = false;
          this.isOpenIdea = true;
        }
        break;
      }
      // Chi tiết hồ sơ lèm theo
      case 'profile': {
        if (!this.isOpenProfile) {
          this.employeeProfileList.processSearch();
          this.isOpenIdea = false;
          this.isOpenProfile = true;
        }
        break;
      }
      // Chi tiết quan hệ gia đình
      case 'familyRelationship': {
        if (!this.isOpenFamilyRelationship) {
          this.familyRelationshipList.processSearch();
          this.isOpenAssessment = false;
          this.isOpenFamilyRelationship = true;
        }
        break;
      }
      // Chi tiết đánh giá cán bộ năm
      case 'assessment': {
        if (!this.isOpenAssessment) {
          this.assessmentList.processSearch();
          this.isOpenFamilyRelationship = false;
          this.isOpenAssessment = true;
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  /**
   * Ẩn chi tiết
   */
  processCloseDetail(viewDetail: any) {
    switch (viewDetail) {
      // Diễn biến lương chức danh
      case 'salaryProcess': {
        if (this.isOpenSalaryProcess) {
          this.isOpenSalaryProcess = false;
        }
        break;
      }
      // Diễn biến lương bảo hiểm
      case 'insuranceProcess': {
        if (this.isOpenInsuranceProcess) {
          this.isOpenInsuranceProcess = false;
        }
        break;
      }
      // Quá trình phụ cấp lương
      case 'allowanceProcess': {
        if (this.isOpenAllowanceProcess) {
          this.isOpenAllowanceProcess = false;
          this.alowancePositionList.changeRow = 10; // reset về mặc định khi đóng table phụ cấp lương
          this.alowancePositionList.resetPagination(); // reset pagination về 0 khi đóng table phụ cấp lương
        }
        break;
      }
      // Quá trình tham gia BHXH
      case 'insuranceProcess2': {
        if (this.isOpenInsuranceProcess2) {
          this.isOpenInsuranceProcess2 = false;
        }
        break;
      }
      // Quá trình công tác
      case 'workProcess': {
        if (this.isOpenWorkProcess) {
          this.isOpenWorkProcess = false;
        }
        break;
      }
      // Quá trình đào tạo và nghiên cứu
      case 'educationProcess': {
        if (this.isOpenEducationProcess) {
          this.isOpenEducationProcess = false;
        }
        break;
      }
      // Quá trình diện đối tượng
      case 'empTypeProcess': {
        if (this.isOpenEmpTypeProcess) {
          this.isOpenEmpTypeProcess = false;
        }
        break;
      }
      // Quá trình công tác Đảng
      case 'partyProcess': {
        if (this.isOpenPartyProcess) {
          this.isOpenPartyProcess = false;
        }
        break;
      }
      // Khen thưởng/kỷ luật
      case 'reward': {
        if (this.isOpenReward) {
          this.isOpenReward = false;
        }
        break;
      }
      // Thành tích nổi bật
      case 'relicFeature': {
        if (this.isOpenRelicFeature) {
          this.isOpenRelicFeature = false;
        }
        break;
      }
      // Sáng kiến ý tưởng
      case 'idea': {
        if (this.isOpenIdea) {
          this.isOpenIdea = false;
        }
        break;
      }
      // Hồ sơ kèm thao
      case 'profile': {
        if (this.isOpenProfile) {
          this.isOpenProfile = false;
        }
        break;
      }
      // Quan hệ gia đình
      case 'familyRelationship': {
        if (this.isOpenFamilyRelationship) {
          this.isOpenFamilyRelationship = false;
        }
        break;
      }
      // Đánh giá cán bộ năm
      case 'assessment': {
        if (this.isOpenAssessment) {
          this.isOpenAssessment = false;
        }
        break;
      }
    }
  }

  viewMore() {
    if (!this.isViewMore) {
      this.isViewMore = true;
    } else {
      this.isViewMore = false;
      this.isOpenSalaryProcess = false;
      this.isOpenInsuranceProcess = false;
      this.isOpenAllowanceProcess = false;
      this.isOpenInsuranceProcess2 = false;
      this.isOpenWorkProcess = false;
      this.isOpenEducationProcess = false;
      this.isOpenEmpTypeProcess = false;
      this.isOpenPartyProcess = false;
      this.isOpenReward = false;
      this.isOpenIdea = false;
      this.isOpenProfile = false;
      this.isOpenFamilyRelationship = false;
      this.isOpenAssessment = false;
      this.isOpenRelicFeature = false;
    }
  }

  /**
   * Quay lại màn hình tìm kiếm
   */
  goBack() {
    this.router.navigate(['/employee/curriculum-vitae']);
  }

  private convertDateToString(date: any): string {
    if (date) {
      return moment(new Date(date)).format('DD/MM/YYYY');
    }
    return '';
  }

  public buildDetailTitle(data: any) {
    // Diện đối tượng
    if (data.empTypeName || data.empTypeEffectiveDate || data.empTypeExpiredDate) {
      this.empTypeName = data.empTypeName;
      let date1 = data.empTypeEffectiveDate !== null ? " - " + this.convertDateToString(data.empTypeEffectiveDate) : "";
      let date2 = data.empTypeExpiredDate !== null ? " - " + this.convertDateToString(data.empTypeExpiredDate) : "";
      this.empTypeName += date1 + date2;
    }

    // Quá trình tham gia BHXH
    if (data.empInsuranceInOut || data.empInsuranceFromMonth || data.empInsuranceToMonth) {
      let date1 = data.empInsuranceFromMonth !== null ? " - " + this.convertDateToString(data.empInsuranceFromMonth) : "";
      let date2 = data.empInsuranceToMonth !== null ? " - " + this.convertDateToString(data.empInsuranceToMonth) : "";
      let str = data.empInsuranceInOut == 1 ? "Ngoài" : "Trong";
      this.empInsurance = str + date1 + date2;
    }

    // Quá trình công tác
    if (data.workProcessEffectiveStartDate || data.workProcessEffectiveEndDate || data.workProcessPosition) {
      let date1 = data.workProcessEffectiveStartDate !== null ? " - " + this.convertDateToString(data.workProcessEffectiveStartDate) : "";
      let date2 = data.workProcessEffectiveEndDate !== null ? " - " + this.convertDateToString(data.workProcessEffectiveEndDate) : "";
      this.workingProcess = data.workProcessPosition + date1 + date2;
    }

    // Quá trình đào tạo vào nghiên cứu
    this.educationLevel = data.levelEducation;

    // Quá trình công tác Đảng
    if (data.partyPositionName || data.partyOrganizationName || data.partyProEffectiveDate || data.partyProExpiredDate) {
      let date1 = data.partyProEffectiveDate !== null ? " - " + this.convertDateToString(data.partyProEffectiveDate) : "";
      let date2 = data.partyProExpiredDate !== null ? " - " + this.convertDateToString(data.partyProExpiredDate) : "";
      this.partyProcess = data.partyPositionName + " - " + data.partyOrganizationName + date1 + date2;
    }

    // Khen thưởng/ kỷ luật
    if (data.rwType || data.rwForm || data.rwSignDate) {
      let date1 = this.convertDateToString(data.rwSignDate);
      let strEff = date1 != null ? date1 : "";
      this.rewardOrDiscipline = data.rwPuType + " - " + data.rwType + " - " + data.rwForm + " - " + strEff;
    }

    // Quan hệ gia đình
    this.numberOfEmpFamilyRelationship = data.numberOfEmpFamilyRelationship;
    // Thành tích nổi bật
    this.relicName = data.relicName;
    // Hồ sơ kèm theo
    this.empFileName = data.empFileName;
    this.empFileFromVHR = data.isFromVHR;

    this.strEmpFileName = data.empFileName.fileName !== null ? data.empFileName.fileName : "";
    // Sáng kiến ý tưởng
    if (data.ideaInnoName || data.ideaInnoCreateDate) {
      let date1 = this.convertDateToString(data.ideaInnoCreateDate);
      this.ideaInno = data.ideaInnoName + " - " + date1;
    }
    // Thông tin đánh giá cán bộ năm
    if (data.vtCriticalId) {
      this.vtCriticalId = data.vtCriticalId;
      this.employeeAssessment = data.vtCriticalId + ".pdf";
    }
  }
  /**
   * Xu ly download file trong danh sach
   */
  public downloadFile() {
    if (this.empFileName.secretId != null && this.empFileFromVHR !== 1) {
      this.fileStorage.downloadFile(this.empFileName.secretId).subscribe(res => {
        saveAs(res, this.empFileName.fileName);
      });
    } else {
      this.employeeProfileService.downloadFileFromTTNS(this.empFileName.attachmentFileId).subscribe(res => {
        saveAs(res, this.empFileName.fileName);
      });
    }
  }
  /**
   * download file thong tin can bo nam
   */
  public processDownloadFile() {
    this.assessmentService.processDownloadFile(this.vtCriticalId).subscribe(res => {
      saveAs(res, this.employeeAssessment);
    });
  }

  public resetViewDetail() {
    this.isViewMore = false;
    this.isOpenSalaryProcess = false;
    this.isOpenInsuranceProcess = false;
    this.isOpenAllowanceProcess = false;
    this.isOpenInsuranceProcess2 = false;
    this.isOpenWorkProcess = false;
    this.isOpenEducationProcess = false;
    this.isOpenEmpTypeProcess = false;
    this.isOpenPartyProcess = false;
    this.isOpenReward = false;
    this.isOpenIdea = false;
    this.isOpenProfile = false;
    this.isOpenFamilyRelationship = false;
    this.isOpenAssessment = false;
    this.isOpenRelicFeature = false;
    this.empTypeName = '';
    this.partyPositionName = '';
    this.workingProcess = '';
    this.empInsurance = '';
    this.educationLevel = '';
    this.partyProcess = '';
    this.rewardOrDiscipline = '';
    this.numberOfEmpFamilyRelationship = '';
    this.relicName = '';
    this.empFileName = '';
    this.empFileFromVHR = '';
    this.strEmpFileName = '';
    this.ideaInno = '';
    this.employeeAssessment = '';
    this.vtCriticalId = '';
  }
}
