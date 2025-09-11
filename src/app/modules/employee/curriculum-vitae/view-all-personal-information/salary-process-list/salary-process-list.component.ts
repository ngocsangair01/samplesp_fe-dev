import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'salary-process-list',
  templateUrl: './salary-process-list.component.html'
})
export class SalaryProcessListComponent implements OnInit {

  @Input()
  resultList: any;

  constructor() {
    this.resultList = {};
  }

  ngOnInit() {
  }
}
