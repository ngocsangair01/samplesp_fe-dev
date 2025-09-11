import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslationModule} from 'angular-l10n';
import {SlideMenuModule} from 'primeng/slidemenu';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {PanelMenuModule} from 'primeng/panelmenu';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {DialogModule} from 'primeng/dialog';

import {NavComponent} from './nav/nav.component';
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';
import {HeaderSearchComponent} from './header/header-search.component';
import {HeaderNotificationComponent} from './header/header-notification/header-notification.component';
import {DisplayDatePipeNotification} from '../pipes/display-date-notification.pipe';
import {HelpComponent} from './header/help/help.component';
import {HeaderSearchCustomComponent} from './header/header-search-custom.component';
import {MultiSelectModule} from "primeng/multiselect";
import {DropdownModule} from "primeng/dropdown";


@NgModule({
    declarations: [
        NavComponent,
        FooterComponent,
        HeaderComponent,
        HeaderSearchComponent,
        HeaderNotificationComponent,
        DisplayDatePipeNotification,
        HelpComponent,
        HeaderSearchCustomComponent,
    ],
    imports: [
        CommonModule,
        FormsModule, ReactiveFormsModule,
        RouterModule,
        TranslationModule,
        PanelMenuModule, SlideMenuModule,
        NgbModule,
        AutoCompleteModule,
        ScrollPanelModule,
        DialogModule, MultiSelectModule, DropdownModule,

    ],
    exports: [
        HeaderComponent,
        NavComponent,
        HeaderSearchComponent,
        FooterComponent,
        DisplayDatePipeNotification,
        HelpComponent,
        HeaderSearchCustomComponent
    ],
})
export class LayoutModule {
  constructor() {}
}
