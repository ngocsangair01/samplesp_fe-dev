import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER  } from '@angular/core';

import { CoreModule, AuthGuard } from '@app/core';
import { SharedModule } from '@app/shared';
import { ToastModule } from 'primeng/toast';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { L10nConfig, L10nLoader, TranslationModule, StorageStrategy, ProviderType } from 'angular-l10n';
import { MessageService } from 'primeng/api';

import { NgxWebstorageModule} from 'ngx-webstorage';
// start thanhlq6 bo sung gon song khi click
import { RippleModule } from '@progress/kendo-angular-ripple';
import { AuthSsoModule } from './modules/auth-sso/auth-sso.module';
import { MassOrganizationModule } from './modules/mass-organization/mass-organization.module';
import { AssessmentLayoutComponent } from './layouts/assessment-layout/assessment-layout.component';
import { AssessmentPeriodModule } from './modules/employee/staff-assessment/assessment-period/assessment-period.module';
import { AssessmentSignatureComponent } from './modules/employee/staff-assessment/assessment-signature/assessment-signature.component';
import { AssessmentSignImageComponent } from './modules/employee/staff-assessment/assessment-sign-image/assessment-sign-image.component';
import { AssessmentEvaluateEmployeeAgainComponent } from './modules/employee/staff-assessment/assessment/assessment-evaluate-employee-again/assessment-evaluate-employee-again.component';
import {AssessmentHistoryLogComponent} from "@app/modules/employee/staff-assessment/assessment/assessment-history-log/assessment-history-log.component";
import {AssessmentHistoryLogComponent2} from "@app/modules/employee/staff-assessment/assessment/assessment-history-log2/assessment-history-log2.component";
import {
    AssessmentHistoryLogV2Component
} from "@app/modules/employee/staff-assessment/assessment/assessment-history-log/assessment-history-log-v2.component";
import { AssessmentSignPreviewModalComponent } from './modules/employee/staff-assessment/assessment-sign-image/preview-modal-sign/assessment-sign-preview-modal.component';
import { AssessmentSignPreviewModalComponent2 } from './modules/employee/staff-assessment/assessment/evaluation-process/preview-modal-sign2/assessment-sign-preview-modal2.component';
import { EvaluationProcessComponent } from './modules/employee/staff-assessment/assessment/evaluation-process/evaluation-process.component';
import { AssessmentSignSyntheticModal } from './modules/employee/staff-assessment/assessment-monitor/assessment-monitor-form/assessment-sign-synthetic-modal.component';
import { HomeMenuComponent } from './layouts/home-menu/home-menu.component';
import {EmployeeResolver} from "@app/shared/services/employee.resolver";
// end thanhlq6

const l10nConfig: L10nConfig = {
    logger: {
        // level: LogLevel.Warn
    },
    locale: {
        languages: [
            { code: 'vi', dir: 'ltr' }
        ],
        language: 'vi',
        storage: StorageStrategy.Cookie
    },
    translation: {
        providers: [
            { type: ProviderType.Static, prefix: './assets/locale/locale-' }
        ],
        caching: true,
        // composedKeySeparator: '.',
        missingValue: 'No key'
    }
};
export function initL10n(l10nLoader: L10nLoader): Function {
  return () => l10nLoader.load();
}


@NgModule({
  declarations: [
    AppComponent,
    ContentLayoutComponent,
    AuthLayoutComponent,
    AssessmentLayoutComponent,
    AssessmentSignatureComponent,
    AssessmentSignImageComponent,
    AssessmentEvaluateEmployeeAgainComponent,
    AssessmentHistoryLogComponent,
    AssessmentHistoryLogComponent2,
    AssessmentHistoryLogV2Component,
    AssessmentSignPreviewModalComponent,
    AssessmentSignPreviewModalComponent2,
    EvaluationProcessComponent,
    AssessmentSignSyntheticModal,
    HomeMenuComponent
  ],
  imports: [
    // angular
    BrowserModule,
    BrowserAnimationsModule,

    // localStorageService & sessionStorageService
    NgxWebstorageModule.forRoot(),

    // 3rd party
    AuthSsoModule,
    ToastModule,
    BlockUIModule,

    // core & shared
    CoreModule,
    SharedModule,
    ProgressSpinnerModule,
    RippleModule,
    // app
    AppRoutingModule,
    TranslationModule.forRoot(l10nConfig),
    MassOrganizationModule,
    AssessmentPeriodModule,
  ],
  providers: [
      EmployeeResolver,
    AuthGuard,
    {
      provide: APP_INITIALIZER,
      useFactory: initL10n,
      deps: [L10nLoader],
      multi: true,
    }, AppComponent, MessageService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AssessmentSignatureComponent,
    AssessmentSignImageComponent,
    AssessmentEvaluateEmployeeAgainComponent,
    AssessmentHistoryLogComponent,
    AssessmentHistoryLogComponent2,
    AssessmentHistoryLogV2Component,
    EvaluationProcessComponent,
    AssessmentSignPreviewModalComponent,
    AssessmentSignPreviewModalComponent2,
    AssessmentSignSyntheticModal
  ]
})
export class AppModule {
  constructor(public l10nLoader: L10nLoader) {
    this.l10nLoader.load();
  }
}
