import { SettingIconIndexComponent } from './setting-icon/setting-icon-index/setting-icon-index.component';
import { CategoryIndexComponent } from './category/category-index/category-index.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupOrgPositionFormComponent } from './group-org-position/group-org-position-form/group-org-position-form.component';
import { GroupOrgPositionIndexComponent } from './group-org-position/group-org-position-index/group-org-position-index.component';
import { ReceiveNotificationGroupIndexComponent } from './receive-notification-group/receive-notification-group-index/receive-notification-group-index.component';
import { ReceiveNotificationGroupFormComponent } from './receive-notification-group/receive-notification-group-form/receive-notification-group-form.component';
import { ReceiveNotificationGroupImportComponent } from './receive-notification-group/receive-notification-group-import/receive-notification-group-import.component';
import { GroupOrgPositionAddComponent } from './group-org-position/group-org-position-add/group-org-position-add.component';
import { PrivateStandardPositionGroupFormComponent } from './group-org-position/private-standard-position-group-form/private-standard-position-group-form.component';
import {AccountIndexComponent} from "@app/modules/settings/account/account-index/account-index.component";
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
  EmailSmsLogIndexComponent
} from "@app/modules/settings/email-sms-log/email-sms-log-index/email-sms-log-index.component";
import {
  EmailSmsHistoryBkFormComponent
} from "@app/modules/settings/email-sms-history-bk/email-sms-history-bk-form/email-sms-history-bk-form.component";
import { AdSchedulerIndexComponent } from './scheduler/ad-scheduler-index/ad-scheduler-index.component';
import { AdSchedulerFormComponent } from './scheduler/ad-scheduler-form/ad-scheduler-form.component';
import { VersionControlIndexComponent } from './version-control/version-control-index/version-index.component';
import {
  MobileConfigIndexComponent
} from "@app/modules/settings/mobile-config/mobile-config-index/mobile-config-index.component";
import {
  SettingObjRemindIndexComponent
} from "@app/modules/settings/setting-obj-remind/setting-obj-remind-index/setting-obj-remind-index.component";


export const routes: Routes = [
  {
    path: '',
    redirectTo: '/settings',
    pathMatch: 'full'
  },
  {
    path: 'category',
    loadChildren: './category/category.module#CategoryModule'
  },
  {
    path: 'general-standard-position-group',
    loadChildren: './general-standard-position-group/general-standard-position-group.module#GeneralStandardPositionGroupModule'
  },
  {
    path: 'email-sms-dynamic',
    loadChildren:'./email-sms-dynamic/email-sms-dynamic.module#EmailSmsDynamicModule'
  },
  {
    path: 'group-org-position',
    component:GroupOrgPositionIndexComponent
  },
  {
    path: 'version-control',
    component:VersionControlIndexComponent
  },
  {
    path: 'group-org-position-add',  
    component:GroupOrgPositionAddComponent  
  },
  {
    path: 'group-org-position-edit/:id',
    component:GroupOrgPositionAddComponent  
  },
  {
    path: 'private-standard-edit/:id',
    component:GroupOrgPositionFormComponent  
  },
  {
    path: 'group-org-position-view/:id',
    component:GroupOrgPositionFormComponent  
  },
  {
    path: 'receive-notification-group',
    component:ReceiveNotificationGroupIndexComponent  
  },
  {
    path: 'receive-notification-group-add',
    component:ReceiveNotificationGroupFormComponent  
  },
  {
    path: 'receive-notification-group-edit/:id',
    component:ReceiveNotificationGroupFormComponent  
  },
  {
    path: 'receive-notification-group-import',
    component:ReceiveNotificationGroupImportComponent  
  },
  {
    path: 'setting-icon',
    component:SettingIconIndexComponent  
  },
  {
    path: 'setting-obj-remind',
    component:SettingObjRemindIndexComponent
  },
  {
    path: 'mobile-config',
    component:MobileConfigIndexComponent
  },
  {
    path: 'account',
    component:AccountIndexComponent
  },
  {
    path: 'email-sms-history',
    component:EmailSmsHistoryIndexComponent
  },
  {
    path: 'email-sms-history-bk',
    component:EmailSmsHistoryBkIndexComponent
  },
  {
    path: 'email-sms-history-add',
    component:EmailSmsHistoryFormComponent
  },
  {
    path: 'email-sms-history-edit/:id',
    component:EmailSmsHistoryFormComponent
  },
  {
    path: 'email-sms-history-view/:id',
    component:EmailSmsHistoryFormComponent
  },{
    path: 'email-sms-history-bk-view/:id',
    component:EmailSmsHistoryBkFormComponent
  },
  {
    path: 'email-sms-log',
    component:EmailSmsLogIndexComponent
  },
  {
    path: 'ad-scheduler',
    component:AdSchedulerIndexComponent
  },
  {
    path: 'ad-scheduler/add-scheduler',
    component: AdSchedulerFormComponent,
  },
  {
    path: 'ad-scheduler/view-scheduler/:id',
    component: AdSchedulerFormComponent
  },
  {
    path: 'ad-scheduler/edit-scheduler/:id',
    component: AdSchedulerFormComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
