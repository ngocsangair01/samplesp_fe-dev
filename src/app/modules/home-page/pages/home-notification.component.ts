import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { NotificationService } from '@app/core/services/notification/notification.service';
@Component({
  selector: 'home-notification',
  templateUrl: './home-notification.component.html',
})
export class HomeNotificationComponent implements OnInit, OnChanges {
  @Input() branch;
  resultList;
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
      }
    );
  }

  onChangeTime(data): boolean {
    const time = new Date(data);
    if (time.setHours(0, 0, 0, 0) ==  this.now.setHours(0, 0, 0, 0)) {
      return true;
    }
  }
}
