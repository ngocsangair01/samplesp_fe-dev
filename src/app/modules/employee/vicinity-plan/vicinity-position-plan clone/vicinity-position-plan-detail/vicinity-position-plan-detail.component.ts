import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { AssessmentResultService } from '@app/core/services/employee/assessment-result.service';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { VicinityPositionPlanService } from '@app/core/services/vicinityPlan/vicinity-position-plan.service';
import { ReportDynamicService } from '@app/modules/reports/report-dynamic/report-dynamic.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { TranslationService } from 'angular-l10n';
import { saveAs } from "file-saver";

@Component({
  selector: 'vicinity-position-plan-detail-clone',
  templateUrl: './vicinity-position-plan-detail.component.html'
})
export class VicinityPositionPlanDetailCloneComponent extends BaseComponent implements OnInit {
  positionList: any;
  listPositions: any;
  formDetail: FormGroup;
  lstDetail: FormArray;
  vicinityPositionPlanId: any;
  listAssessmentPeriod: any;
  transferEmployee: any;
  listExport = ["BM_2A"];
  mapExport: any;
  documentId: any;
  organizationId: any;
  positionId: any;
  setColor: any;

  formConfig = {
    organizationName: [''],
    documentNumber: [''],
    documentName: [''],
  };
  educate: any;
  rotate: any;
  classEmployees = [
    { label: this.translation.translate("common.label.cboSelectAll"), value: null },
    { label: "Nhân sự hiện tại", value: "Nhân sự hiện tại" },
    { label: "Nhân sự kế cận", value: "Nhân sự kế cận" },
    { label: "Nhân sự kế tiếp", value: "Nhân sự kế tiếp" }
  ]
  statusVicinities = [
    { label: this.translation.translate("common.label.cboSelectAll"), value: null },
    { label: "Đưa ra khỏi quy hoạch", value: "Đưa ra khỏi quy hoạch" },
    { label: "Đã phê duyệt", value: "Đã phê duyệt" }
  ]

  constructor(
    private curriculumVitaeService: CurriculumVitaeService,
    public actr: ActivatedRoute,
    private router: Router,
    private app: AppComponent,
    private vicinityPositionPlanService: VicinityPositionPlanService,
    private reportDynamicService: ReportDynamicService,
    private translation: TranslationService,
    private assessmentResultService: AssessmentResultService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
    this.formDetail = this.buildForm({}, this.formConfig);
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params.vicinityPositionPlanId) {
          this.vicinityPositionPlanId = params.vicinityPositionPlanId;
        }
        const queries = this.actr.snapshot.queryParams;
        if (queries.positionId) {
          this.positionId = queries.positionId;
        }
      }
    });
  }

  ngOnInit() {
    this.buildFormsDetail();
  }

  get f() {
    return this.formDetail.controls;
  }

  public goBack() {
    this.router.navigate(['/employee/vicinity-position-plan-clone']);
  }

  /**
   * Lấy thông tin nhân viên
   * @param event 
   * @param item 
   */
  public loadUserInfo(event, item: FormGroup) {
    if (event && event.selectField > 0) {
      this.curriculumVitaeService.getEmployeeMainPositionInfo(event.selectField).subscribe(res => {
        item.controls['mainPositionName'].setValue(res.data.mainPositionName);
      })
    } else {
      item.controls['mainPositionName'].setValue(null);
    }
  }
  //dunglv add

  private buildFormsDetail() {
    this.vicinityPositionPlanService.getDetaiLById(this.vicinityPositionPlanId).subscribe(res => {
      if (res.data && res.data.length > 0) {
        const index = res.data.findIndex(x => x.vicinityPositionPlanId == this.vicinityPositionPlanId);
        if (index >= 0) {
          const temp = res.data[index];

          this.documentId = temp.documentId;
          this.organizationId = temp.organizationId;
          this.formDetail = this.buildForm(temp, this.formConfig);
          this.listPositions = res.data;
          this.getDetailPostion(temp.positionId);
        }
      }
    });
  }

  public prepareSaveOrUpdate(item?: any) {
    this.router.navigateByUrl(`${'/employee/vicinity-position-plan-clone/edit'}/${item.vicinityPositionPlanId}/${item.vicinityPlanMappingId}`);
  }

  public getDetailPostion(positionId?: any) {
    this.positionId = positionId;
    this.listPositions.forEach(item => {
      if (positionId && positionId === item.positionId) {
        item['activeClass'] = true;
      } else {
        item['activeClass'] = false;
      }
    });
    this.vicinityPositionPlanService.getDetailPostion(this.vicinityPositionPlanId, positionId)
      .subscribe(res => {
        if (res.data) {
          this.positionList = res.data;
          for (var i = 0; i < this.positionList.length; i++) {
            var nameEducate = "";
            var nameEmploy = "";
            this.educate = this.positionList[i].vicinityEducationPlanBeans;
            this.transferEmployee = this.positionList[i].vicinityTransferEmployeePlanBeans;
            for (var j = 0; j < this.educate.length; j++) {
              let decription = !CommonUtils.isNullOrEmpty(this.educate[j].description) ? this.educate[j].description : "";
              let yearStartPlan = !CommonUtils.isNullOrEmpty(this.educate[j].yearStartPlan) ? this.educate[j].yearStartPlan : "";
              nameEducate += decription + (yearStartPlan ? "(" + yearStartPlan + ");" : "");
              if (j === (this.educate.length - 1) && yearStartPlan) {
                nameEducate = nameEducate.slice(0, -1);
              }
            }
            this.positionList[i]["name"] = nameEducate;
            for (var k = 0; k < this.transferEmployee.length; k++) {
              let positionName = !CommonUtils.isNullOrEmpty(this.transferEmployee[k].positionName) ? this.transferEmployee[k].positionName : "";
              let organizationName = !CommonUtils.isNullOrEmpty(this.transferEmployee[k].organizationName) ? this.transferEmployee[k].organizationName : "";
              let yearStartPlan = !CommonUtils.isNullOrEmpty(this.transferEmployee[k].yearStartPlan) ? this.transferEmployee[k].yearStartPlan : "";
              nameEmploy += positionName + (positionName ? "-" : "")
                + organizationName + (yearStartPlan ? "(" + yearStartPlan + ");" : "");
              if (k === (this.transferEmployee.length - 1) && yearStartPlan) {
                nameEmploy = nameEmploy.slice(0, -1);
              }
            }
            this.positionList[i]["nameEmploy"] = nameEmploy;
          }
        }
      })
  }

  public getDetailRotation(item?: any) {
    this.vicinityPositionPlanService.getDetailRotation(item.vicinityPlanMappingId)
      .subscribe(res => {
        if (res != null) {
          this.router.navigate(['/employee/vicinity-position-plan-clone/rotation/', item.vicinityPlanMappingId]);
        }
      });
  }

  public getEmployeeAssessmentByEmployeeId(item: any) {
    this.assessmentResultService.getListFileSigned(item.employeeId)
      .subscribe(res => {
        this.listAssessmentPeriod = res;
      })
  }

  public downloadTemplate(item: any) {
    this.assessmentResultService.downloadFile(item.transCode).subscribe(res => {
      saveAs(res, `${item.assessmentPeriodName}.pdf`);
    });
  }

  public export(item: string) {
    if (item === "BM_2A") {
      this.vicinityPositionPlanService.exportBM2A(this.organizationId).subscribe(res => {
        saveAs(res, '2A_BM_DSQHCB.xlsx');
      });
    }
  }

  public putPlanning() {
    this.router.navigate(
      ['/employee/vicinity-position-plan-clone/add'],
      {
        queryParams: {
          'documentId': this.documentId,
          'organizationId': this.organizationId,
          'positionId': this.positionId,
          'vicinityPositionPlanId': this.vicinityPositionPlanId
        }
      }
    );
  }

  public removeRotation(item?: any) {
    if (item && item.vicinityPlanMappingId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.vicinityPositionPlanService.removeRotation(item.vicinityPlanMappingId)
          .subscribe(res => {
            if (this.vicinityPositionPlanService.requestIsSuccess(res)) {
              this.getDetailPostion(this.positionId);
            }
          });
      }, () => {// on rejected

      });
    }
  }

}
