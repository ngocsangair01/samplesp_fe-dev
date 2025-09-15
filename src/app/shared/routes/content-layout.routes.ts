import { Routes } from '@angular/router';

export const CONTENT_ROUTES: Routes = [
  {
    path: 'home-page',
    loadChildren: './modules/home-page/home-page.module#HomePageModule'
  },
  {
    path: 'employee',
    loadChildren: './modules/employee/employee.module#EmployeeModule'
  },
  {
    path: 'notification',
    loadChildren: './modules/notification/notification.module#NotificationModule'
  },
  {
    path: 'sign-manager',
    loadChildren: './modules/sign-manager/sign.module#SignModule'
  },
  {
    path: 'send-notification',
    loadChildren: './modules/send-notification/send-notification.module#SendNotificationModule'
  },
  {
    path: 'reports',
    loadChildren: './modules/reports/reports.module#ReportsModule'
  },
  {
    path: 'report',
    loadChildren: './modules/report/report.module#ReportModule'
  },
  {
    path: 'admin',
    loadChildren: './modules/admin/admin.module#AdminModule'
  }
];
