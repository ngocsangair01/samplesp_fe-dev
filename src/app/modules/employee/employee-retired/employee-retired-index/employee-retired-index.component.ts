import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonUtils } from '@app/shared/services';


@Component({
  selector: 'employee-retired-index',
  templateUrl: './employee-retired-index.component.html'
})
export class EmployeeRetiredIndexComponent extends BaseComponent implements OnInit {

  constructor(
    private router: Router,
    public actr: ActivatedRoute
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));

  }

  ngOnInit() {
  }
}
