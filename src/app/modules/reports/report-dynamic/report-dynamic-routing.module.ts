import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonUtils } from '@app/shared/services';
import { PropertyResolver } from '@app/shared/services/property.resolver';
import { ReportDynamicExportNewComponent } from './report-dynamic-export-new/report-dynamic-export-new.component';
import { ReportDynamicExportComponent } from './report-dynamic-export/report-dynamic-export.component';
import { ReportDynamicFormComponent } from './report-dynamic-form/report-dynamic-form.component';
import { ReportDynamicIndexComponent } from './report-dynamic-index/report-dynamic-index.component';

const routes: Routes = [
  {
    path: '',
    component: ReportDynamicIndexComponent,
    resolve: {
      props: PropertyResolver
    },
    data: {
      resource: CommonUtils.getPermissionCode("resource.reportDynamic")
    }
  },
  {
    path: 'add',
    component: ReportDynamicFormComponent,
    resolve: {
      props: PropertyResolver
    },
    data: {
      resource: CommonUtils.getPermissionCode("resource.reportDynamic")
    }
  },
  {
    path: 'edit/:id',
    component: ReportDynamicFormComponent,
    resolve: {
      props: PropertyResolver
    },
    data: {
      resource: CommonUtils.getPermissionCode("resource.reportDynamic")
    }
  },
  {
    path: 'export-manager/:menuCode',
    component: ReportDynamicExportComponent,
    resolve: {
      props: PropertyResolver
    },
    data: {
      resource: CommonUtils.getPermissionCode("resource.reportDynamic")
    }
  },
  {
    path: 'export/:id',
    component: ReportDynamicExportComponent,
    resolve: {
      props: PropertyResolver
    },
    data: {
      resource: CommonUtils.getPermissionCode("resource.reportDynamic")
    }
  },
  {
    path: 'export',
    component: ReportDynamicExportComponent,
    resolve: {
      props: PropertyResolver
    },
    data: {
      resource: CommonUtils.getPermissionCode("resource.reportDynamic")
    }
  },
  {
    path: 'export-new',
    component: ReportDynamicExportNewComponent,
    resolve: {
      props: PropertyResolver
    },
    data: {
      resource: CommonUtils.getPermissionCode("resource.reportDynamic")
    }
  },
  {
    path: 'report-dynamic-special/:reportName/:id',
    component: ReportDynamicExportComponent,
    resolve: {
      props: PropertyResolver
    },
    data: {
      resource: CommonUtils.getPermissionCode("resource.reportDynamic")
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportDynamicRoutingModule { }