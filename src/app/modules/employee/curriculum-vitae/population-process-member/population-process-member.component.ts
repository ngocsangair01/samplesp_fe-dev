import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormArray, FormGroup } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ACTION_FORM } from '@app/core';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { SortEvent } from 'primeng/api';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { MassPositionService } from '@app/core/services/mass-organization/mass-position.service';
import * as moment from 'moment';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';

@Component({
  selector: 'population-process-member',
  templateUrl: './population-process-member.component.html',
  styleUrls: ['./population-process-member.component.css']
})
export class PopulationProcessMemberComponent extends BaseComponent implements OnInit {
  empInfo: any;
  constructor(
    private curriculumVitaeService: CurriculumVitaeService,
    private employeeResolver: EmployeeResolver
  ) {
    super();
    this.employeeResolver.EMPLOYEE.subscribe(
      data => {
        if (data) {
          this.curriculumVitaeService.findOne(data).subscribe(res => {
            this.empInfo = res.data;
          });
        }
      }
    );
  }

  ngOnInit() {
    this.curriculumVitaeService.selectMenuItem.subscribe(res => {
      console.log(res);
      let element = document.getElementById(res);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    })
  }
}
