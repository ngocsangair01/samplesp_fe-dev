import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SysPropertyDetailBean } from '@app/core/models/sys-property-details.model';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { ValidationService } from '@app/shared/services/validation.service';

@Component({
  selector: 'dashboard-table-component',
  templateUrl: './dashboard-table-component.html',
  styleUrls: ['./dashboard-table-component.css']
})
export class DashboardTableComponent implements OnInit {
 
  constructor() {
  }

  ngOnInit() {
  }


}
