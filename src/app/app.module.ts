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
import { AssessmentLayoutComponent } from './layouts/assessment-layout/assessment-layout.component';
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
    TranslationModule.forRoot(l10nConfig)
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
  ]
})
export class AppModule {
  constructor(public l10nLoader: L10nLoader) {
    this.l10nLoader.load();
  }
}
