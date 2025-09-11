import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from '@app/shared';
import { GroupOrgPositionSearchComponent } from './group-org-position/group-org-position-search/group-org-position-search.component';
import { GroupOrgPositionIndexComponent } from './group-org-position/group-org-position-index/group-org-position-index.component';
import { ReceiveNotificationGroupIndexComponent } from './receive-notification-group/receive-notification-group-index/receive-notification-group-index.component';
import { ReceiveNotificationGroupSearchComponent } from './receive-notification-group/receive-notification-group-search/receive-notification-group-search.component';
import { ReceiveNotificationGroupFormComponent } from './receive-notification-group/receive-notification-group-form/receive-notification-group-form.component';
import { ReceiveNotificationGroupImportComponent } from './receive-notification-group/receive-notification-group-import/receive-notification-group-import.component';
import { GroupOrgPositionFormComponent } from './group-org-position/group-org-position-form/group-org-position-form.component';
import { GroupOrgPositionAddComponent } from './group-org-position/group-org-position-add/group-org-position-add.component';
import { PrivateStandardPositionGroupFormComponent } from './group-org-position/private-standard-position-group-form/private-standard-position-group-form.component';
import { SettingIconIndexComponent } from './setting-icon/setting-icon-index/setting-icon-index.component';
import { SettingIconSearchComponent } from './setting-icon/setting-icon-search/setting-icon-search.component';
import { SettingIconFormComponent } from './setting-icon/setting-icon-form/setting-icon-form.component';
import {
  GroupOrgPositionImportComponent
} from "@app/modules/settings/group-org-position/group-org-position-search/file-import-group-org-position/file-import-group-org-position.component";
import { AccountIndexComponent } from "@app/modules/settings/account/account-index/account-index.component";
import { AccountSearchComponent } from "@app/modules/settings/account/account-search/account-search.component";
import { AccountFormComponent } from "@app/modules/settings/account/account-form/account-form.component";
import {
  EmailSmsHistorySearchComponent
} from "@app/modules/settings/email-sms-history/email-sms-history-search/email-sms-history-search.component";
import {
  EmailSmsHistoryIndexComponent
} from "@app/modules/settings/email-sms-history/email-sms-history-index/email-sms-history-index.component";
import {
  EmailSmsHistoryFormComponent
} from "@app/modules/settings/email-sms-history/email-sms-history-form/email-sms-history-form.component";
import {
  EmailSmsHistoryBkIndexComponent
} from "@app/modules/settings/email-sms-history-bk/email-sms-history-bk-index/email-sms-history-bk-index.component";
import {
  EmailSmsHistoryBkFormComponent
} from "@app/modules/settings/email-sms-history-bk/email-sms-history-bk-form/email-sms-history-bk-form.component";
import {
  EmailSmsHistoryBkSearchComponent
} from "@app/modules/settings/email-sms-history-bk/email-sms-history-bk-search/email-sms-history-bk-search.component";
import {
  EmailSmsLogFormComponent
} from "@app/modules/settings/email-sms-log/email-sms-log-form/email-sms-log-form.component";
import {
  EmailSmsLogIndexComponent
} from "@app/modules/settings/email-sms-log/email-sms-log-index/email-sms-log-index.component";
import {
  EmailSmsLogSearchComponent
} from "@app/modules/settings/email-sms-log/email-sms-log-search/email-sms-log-search.component";
import { AdSchedulerIndexComponent } from './scheduler/ad-scheduler-index/ad-scheduler-index.component';
import { AdSchedulerSearchComponent } from './scheduler/ad-scheduler-search/ad-scheduler-search.component';
import { AdSchedulerFormComponent } from './scheduler/ad-scheduler-form/ad-scheduler-form.component';
import { AdSchedulerConfirmComponent } from './scheduler/ad-scheduler-confirm/ad-scheduler-confirm';
import { AdSchedulerLogComponent } from './scheduler/ad-scheduler-log/ad-scheduler-log.component';
import {VersionControlIndexComponent} from './version-control/version-control-index/version-index.component'
import {VersionControlSearchComponent} from './version-control/version-control-search/version-search.component'
import {VersionControlAddComponent} from './version-control/version-control-add/version-control-add.component'
import {
  MobileConfigIndexComponent
} from "@app/modules/settings/mobile-config/mobile-config-index/mobile-config-index.component";
import {
  MobileConfigSearchComponent
} from "@app/modules/settings/mobile-config/mobile-config-search/mobile-config-search.component";
import {MobileConfigFormComponent} from "@app/modules/settings/mobile-config/mobile-config-form/mobile-config-form.component";
import {
  SettingObjRemindIndexComponent
} from "@app/modules/settings/setting-obj-remind/setting-obj-remind-index/setting-obj-remind-index.component";
import {
  SettingObjRemindSearchComponent
} from "@app/modules/settings/setting-obj-remind/setting-obj-remind-search/setting-obj-remind-search.component";
import {
  SettingObjRemindFormComponent
} from "@app/modules/settings/setting-obj-remind/setting-obj-remind-form/setting-obj-remind-form.component";
@NgModule({
  declarations: [
    VersionControlAddComponent,
    VersionControlIndexComponent,
    VersionControlSearchComponent,
    GroupOrgPositionSearchComponent,
    GroupOrgPositionFormComponent,
    GroupOrgPositionIndexComponent,
    ReceiveNotificationGroupIndexComponent,
    ReceiveNotificationGroupSearchComponent,
    ReceiveNotificationGroupFormComponent,
    ReceiveNotificationGroupImportComponent,
    GroupOrgPositionAddComponent,
    PrivateStandardPositionGroupFormComponent,
    SettingIconIndexComponent,
    SettingIconSearchComponent,
    SettingIconFormComponent,
    SettingObjRemindIndexComponent,
    SettingObjRemindSearchComponent,
    SettingObjRemindFormComponent,
    MobileConfigIndexComponent,
    MobileConfigSearchComponent,
    MobileConfigFormComponent,
    GroupOrgPositionImportComponent,
    AccountIndexComponent,
    AccountSearchComponent,
    AccountFormComponent,
    EmailSmsHistoryIndexComponent,
    EmailSmsHistoryFormComponent,
    EmailSmsHistorySearchComponent,
    EmailSmsHistoryBkIndexComponent,
    EmailSmsHistoryBkFormComponent,
    EmailSmsHistoryBkSearchComponent,
    EmailSmsLogFormComponent,
    EmailSmsLogIndexComponent,
    EmailSmsLogSearchComponent,
    AdSchedulerIndexComponent,
    AdSchedulerSearchComponent,
    AdSchedulerFormComponent,
    AdSchedulerConfirmComponent,
    AdSchedulerLogComponent,
    VersionControlIndexComponent,
    VersionControlAddComponent,
    VersionControlSearchComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SettingsRoutingModule,
  ],
  entryComponents: [
    PrivateStandardPositionGroupFormComponent,
    SettingIconFormComponent,
    MobileConfigFormComponent,
    GroupOrgPositionImportComponent, 
    VersionControlAddComponent,
    SettingObjRemindFormComponent
  ],
})
export class SettingsModule { }
