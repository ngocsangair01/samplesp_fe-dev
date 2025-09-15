import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS } from '@app/core';
import { FileControl } from '@app/core/models/file.control';
import { EmpTypesService } from '@app/core/services/emp-type.service';
import { PersonalPunishmentService } from '@app/core/services/punishment/personal-punishment.service';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import {any} from "codelyzer/util/function";

@Component({
  selector: 'personal-punishment-form',
  templateUrl: './plan-work-form.component.html',
  styleUrls: ['./plan-work-form.component.css']
})
export class PlanWorkFormComponent extends BaseComponent implements OnInit {
  employerId: number;

  demoData: any;

  empTypeList: any;
  formSave: FormGroup;
  punishmentId: any;
  isEdit: Boolean;
  empId: any;
  basicTargetTaskBean:[];
  transformationTaskBean:[];
  additionalKeyTasksBean:[];
  formConfig = {
    planName:[''],
    planType:[''],
    employerId: ['', [ValidationService.required]],
    employerUnit: [''],
    startDate: ['', [ValidationService.required, ValidationService.beforeCurrentDate]],
    endDate: ['', [ValidationService.required, ValidationService.beforeCurrentDate]],
    creator:[''],
    files:['']
  };

  constructor(
    private router: Router,
    public actr: ActivatedRoute,
    private app: AppComponent,
  ) {
    // super(null, CommonUtils.getPermissionCode("resource.punishment"));
    super(null);

    const params = this.actr.snapshot.params;
    if (params) {
      this.punishmentId = params.id;
    }
    this.buildForms({});
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length >= 3) {
      if (subPaths[3] === 'add') {
        this.isEdit = false;
      } else if (subPaths[3] === 'edit') {
        this.isEdit = true;
      }
    }
    this.loadDemoData();
  }
  loadDemoData(): void {
    this.demoData = {
      "type": "SUCCESS",
      "code": null,
      "message": null,
      "data": {
        "planId": 23,
        "planName": "Tuấn Anh gió tai abcdef",
        "planType": "Annual",
        "assignerId": "12345",
        "assignerUnit": "Unit A",
        "startDate": "2023-10-01T00:00:00.000+0000",
        "endDate": "2023-12-31T00:00:00.000+0000",
        "status": "DRAFT",
        "basicTargetTaskBean": [
          {
            "basicTargetTaskId": 87,
            "planId": null,
            "targetGroup": "Group A1",
            "targetName": "Target 1",
            "kpiIndicator": "KPI-001",
            "measurementMethod": "Survey",
            "measurementUnit": "Percentage",
            "weightPercent": 50.0,
            "minValue": "10",
            "expectedValue": "20",
            "challengeValue": "30",
            "startDate": "2023-10-01T00:00:00.000+0000",
            "endDate": "2023-12-31T00:00:00.000+0000",
            "executionUnit": "Unit B",
            "executionFocalPoint": "John Doe",
            "status": "In Progress",
            "progress": 25.0,
            "executionResult": 15.0,
            "createdDate": "2025-09-12T10:12:33.000+0000",
            "createdBy": "",
            "updatedDate": null,
            "updatedBy": null,
            "deleted": false
          },
          {
            "basicTargetTaskId": 88,
            "planId": null,
            "targetGroup": "Group A2",
            "targetName": "Target 1",
            "kpiIndicator": "KPI-001",
            "measurementMethod": "Survey",
            "measurementUnit": "Percentage",
            "weightPercent": 50.0,
            "minValue": "10",
            "expectedValue": "20",
            "challengeValue": "30",
            "startDate": "2023-10-01T00:00:00.000+0000",
            "endDate": "2023-12-31T00:00:00.000+0000",
            "executionUnit": "Unit B",
            "executionFocalPoint": "John Doe",
            "status": "In Progress",
            "progress": 25.0,
            "executionResult": 15.0,
            "createdDate": "2025-09-12T10:12:33.000+0000",
            "createdBy": "",
            "updatedDate": null,
            "updatedBy": null,
            "deleted": false
          }
        ],
        "transformationTaskBean": [
          {
            "transformationTaskId": 87,
            "planId": null,
            "taskType": "Type A",
            "targetGroup": "Group B1",
            "content": "Transformation Task Content",
            "objective": "Improve Efficiency",
            "solutionAction": "Implement New Process",
            "executionTimeQ1": 1,
            "executionTimeQ2": 0,
            "executionTimeQ3": 0,
            "executionTimeQ4": 1,
            "responsibleLeader": null,
            "status": "Planned",
            "executionResult": "Pending",
            "createdDate": "2025-09-12T10:12:33.000+0000",
            "createdBy": "",
            "updatedDate": null,
            "updatedBy": null,
            "units": [
              {
                "createdDate": "2025-09-09T08:34:06.000+0000",
                "createdBy": "1",
                "updatedDate": null,
                "updatedBy": null,
                "organizationId": 1,
                "name": "Viễn thông quân đội"
              },
              {
                "createdDate": "2025-09-09T08:34:06.000+0000",
                "createdBy": "1",
                "updatedDate": null,
                "updatedBy": null,
                "organizationId": 2,
                "name": "Đơn vị 1"
              }
            ],
            "deleted": false
          }
        ],
        "additionalKeyTasksBean": [
          {
            "additionalKeyTasksId": 84,
            "planId": null,
            "taskType": "Type B",
            "targetGroup": "Group C1",
            "content": "Additional Task Content",
            "objective": "Expand Coverage",
            "solutionAction": "Deploy Resources",
            "executionTimeQ1": 1,
            "executionTimeQ2": 0,
            "executionTimeQ3": 1,
            "executionTimeQ4": 1,
            "responsibleLeader": "Jane Smith",
            "status": "Not Started",
            "executionResult": "Pending",
            "createdDate": "2025-09-12T10:12:33.000+0000",
            "createdBy": "",
            "updatedDate": null,
            "updatedBy": null,
            "units": [
              {
                "createdDate": "2025-09-09T08:34:06.000+0000",
                "createdBy": "1",
                "updatedDate": null,
                "updatedBy": null,
                "organizationId": 1,
                "name": "Viễn thông quân đội"
              },
              {
                "createdDate": "2025-09-09T08:34:06.000+0000",
                "createdBy": "1",
                "updatedDate": null,
                "updatedBy": null,
                "organizationId": 2,
                "name": "Đơn vị 1"
              },
              {
                "createdDate": "2025-09-09T08:34:06.000+0000",
                "createdBy": "1",
                "updatedDate": null,
                "updatedBy": null,
                "organizationId": 3,
                "name": "Công nghệ thông tin"
              }
            ],
            "deleted": false
          },
          {
            "additionalKeyTasksId": 85,
            "planId": null,
            "taskType": "Type B",
            "targetGroup": "Group C2",
            "content": "Additional Task Content",
            "objective": "Expand Coverage",
            "solutionAction": "Deploy Resources",
            "executionTimeQ1": true,
            "executionTimeQ2": true,
            "executionTimeQ3": true,
            "executionTimeQ4": true,
            "responsibleLeader": "Jane Smith",
            "status": "Not Started",
            "executionResult": "Pending",
            "createdDate": "2025-09-12T10:12:33.000+0000",
            "createdBy": "",
            "updatedDate": null,
            "updatedBy": null,
            "units": [
              {
                "createdDate": "2025-09-09T08:34:06.000+0000",
                "createdBy": "1",
                "updatedDate": null,
                "updatedBy": null,
                "organizationId": 2,
                "name": "Đơn vị 1"
              }
            ],
            "deleted": false
          }
        ],
        "createdDate": "2025-09-12T10:12:33.000+0000",
        "createdBy": "",
        "updatedDate": null,
        "updatedBy": null
      }
    };
    this.formConfig.planName[0] = this.demoData.data.planName;
    this.formConfig.planType[0] = this.demoData.data.planType;
    this.formConfig.employerId[0] = this.demoData.data.assignerId;
    this.formConfig.employerUnit[0] = this.demoData.data.assignerUnit;
    this.formConfig.startDate[0] = this.demoData.data.startDate;
    this.formConfig.endDate[0] = this.demoData.data.endDate;
    this.formConfig.creator[0] = this.demoData.data.assignerId;
    this.additionalKeyTasksBean = this.demoData.data.additionalKeyTasksBean;
    this.transformationTaskBean = this.demoData.data.transformationTaskBean;
    this.basicTargetTaskBean = this.demoData.data.basicTargetTaskBean;
  }


  public buildForms(data) {
    this.formSave = this.buildForm(data, this.formConfig);
    const filesControl = new FileControl(null);
    // if (data) {
    //   if (data.fileAttachment && data.fileAttachment.personalPunishmentFiles) {
    //     filesControl.setFileAttachment(data.fileAttachment.personalPunishmentFiles);
    //   }
    // }
    this.formSave.addControl('files', filesControl);
  }

  public goBack() {

      this.router.navigate(['/plan-management/plan-work-management']);

  }



  get f() {
    return this.formSave.controls;
  }

  public hello(){}


}
