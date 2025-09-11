import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'calendar-month',
  templateUrl: './calendar-month.component.html'
})
export class CalendarMonthComponent implements OnInit {

  @Input()
  public events: string;

  constructor() { }

  ngOnInit() {
  }

}
