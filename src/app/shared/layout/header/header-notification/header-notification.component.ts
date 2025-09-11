import { Component, OnInit, OnChanges, SimpleChanges, Input, ViewChild } from '@angular/core';
import { NotificationService } from '@app/core/services/notification/notification.service';

@Component({
  selector: 'header-notification',
  templateUrl: './header-notification.component.html',
})
export class HeaderNotificationComponent implements OnInit, OnChanges {

  @Input() branch;
  resultList:[];
  totolNotification;
  now : any;

  constructor(
    private notificationService: NotificationService,
  ) {
    this.now = new Date();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.branch.currentValue) {
      this.branch = changes.branch.currentValue;
    }
  }
  ngOnInit() {
    this.processSearch();
  }

  processSearch() {
    this.notificationService.getHomeNotification().subscribe(
      res => {
        this.resultList = res.data;
        this.totolNotification=this.resultList.length;
      }
    );
  }

  public actionInitAjax() {
    this.processSearch();
  }

  onChangeTime(data): boolean {
    const time = new Date(data);
    if (time.setHours(0, 0, 0, 0) ==  this.now.setHours(0, 0, 0, 0)) {
      return true;
    }
  }
}
