import { EnumeratePipe } from './pipes/enumerate.pipe';
import { DisplayDateMonthPipe } from './pipes/display-date-month.pipe';
import { MultiSelectModule } from 'primeng/multiselect';
import { MenuTreeComponent } from './components/menu-tree/menu-tree.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LayoutModule } from './layout/layout.module';
import { TableModule, TableHeaderCheckbox } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, DialogService, TreeDragDropService } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { CalendarModule } from 'primeng/calendar';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DialogModule } from 'primeng/dialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { StepsModule } from 'primeng/steps';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { SelectButtonModule } from 'primeng/selectbutton';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PickListModule } from 'primeng/picklist';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OrderListModule } from 'primeng/orderlist';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ProgressBarModule } from 'primeng/progressbar';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { InputSwitchModule } from 'primeng/inputswitch'

import { InternationalPhoneModule } from 'ng4-intl-phone';

import { ControlMessagesComponent } from './components/control-messages/control-messages.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { OrgSelectorComponent } from './components/org-selector/org-selector.component';
import { PartyOrgSelectorComponent } from './components/party-org-selector/party-org-selector.component';
import { MassOrgSelectorComponent } from './components/mass-org-selector/mass-org-selector.component';
import { MassOrgSelectorModalComponent } from './components/mass-org-selector/mass-org-selector-modal/mass-org-selector-modal.component';
import { PartyOrgSelectorModalComponent } from './components/party-org-selector/party-org-selector-modal/party-org-selector-modal.component';
import { TranslationModule } from 'angular-l10n';
import { OrgSelectorModalComponent } from './components/org-selector/org-selector-modal/org-selector-modal.component';
import { SelectFilterComponent } from './components/select-filter/select-filter.component';
import { SelectFilterIconComponent } from './components/select-filter-icon/select-filter-icon.component';
import { DataPickerComponent } from './components/data-picker/data-picker.component';
import { DataPickerModalComponent } from './components/data-picker/data-picker-modal/data-picker-modal.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { OrgTreeComponent } from './components/org-tree/org-tree.component';
import { PartyOrgTreeComponent } from './components/party-org-tree/party-org-tree.component';
import { FileChooserComponent } from './components/file-chooser/file-chooser.component';
import { DisplayHelperPipe } from './pipes/display-helper.pipe';
import { InputSpecialDirective } from './directive/input-special.directive';
import { InputTrimDirective } from './directive/input-trim.directive';
import { MultiFileChooserComponent } from './components/file-chooser/multi-file-chooser.component';
import { AutoFocusDirective } from './directive/auto-focus.directive';
import { FocusFirstInput } from './directive/focus-first-input';
import { FocusInvalidInput } from './directive/focus-invalid-input';
import { RemoveWrapperDirective } from './directive/remove-wrapper';
import { DisplayDatePipe } from './pipes/display-date.pipe';
import { DisplayDateTimePipe } from './pipes/display-date-time.pipe';
import { ButtonBackComponent } from './components/button-back/button-back.component';
import { DiagramAllModule, SymbolPaletteAllModule, OverviewAllModule } from '@syncfusion/ej2-ng-diagrams';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DiagramModule } from '@syncfusion/ej2-ng-diagrams';
import { DynamicDialogModule } from 'primeng/dynamicdialog';


import { MultiSelectFilterComponent } from './components/multi-select-filter/multi-select-filter.component';

import { CalendarMonthComponent } from './components/calendar-month/calendar-month.component';
// start thanhlq6 bo sung gon song khi click
import { RippleModule } from '@progress/kendo-angular-ripple';
// end thanhlq6

import { ImportErrorComponent } from './components/import-error/import-error.component';
import { FormatCurrencyPipe, FindByPipe } from './pipes/format-currency.pipe';
import { TableFooterComponent } from './components/table-footer/table-footer.component';
import { AutoCompleteComponent } from './components/auto-complete/auto-complete.component';
import { DashboardTableComponent } from './components/dashboard-table-component/dashboard-table-component';
import { dashboardCardComponent } from './components/dashboard-card-component/dashboard-card.component';
import { EditorModule, RatingModule, SliderModule, RadioButtonModule, ButtonModule, PanelModule, InputMask, InputMaskModule } from 'primeng/primeng';
import { AccordionModule } from 'primeng/accordion';
import { DynamicInputComponent } from './components/dynamic-input/dynamic-input.component';
import { SafePipe } from './pipes/safe.pipe';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PropertyResolver } from './services/property.resolver';

//start thangdt upate mutidata
import { MultiInputTextComponent } from './components/mutil-input-text/multi-input-text.component';
import { TooltipModule } from 'primeng/tooltip';
//end thangdt
import { FormatCurrencyDirective } from './directive/format-currency.directive';
import { OrgMultiSelectorComponent } from './components/org-multi-selector/org-multi-selector.component';
import { OrgMultiSelectorModalComponent } from './components/org-multi-selector/org-multi-selector-modal/org-multi-selector-modal.component';
import { PartyTreeSelectorComponent } from './components/party-tree-selector/party-tree-selector.component';
import { ImageDirective } from './directive/image.directive';
import { ToastModule } from 'primeng/toast';
import { RewardGeneralModalComponent } from './components/reward-general-modal/reward-general-modal.component';
import { RewardPartyOrganizationComponent } from './components/reward-party-organization/reward-party-organization.component';
import { MultiDataPickerComponent } from './components/multi-data-picker/multi-data-picker.component';
import { MultiDataPickerModalComponent } from './components/multi-data-picker/multi-data-picker-modal/multi-data-picker-modal.component';
import { MultiOrgSelectorComponent } from './components/multi-org-selector/multi-org-selector.component';
import { MultiOrgSelectorModalComponent } from './components/multi-org-selector/multi-org-selector-modal/multi-org-selector-modal.component';
import { MultiPartyOrgSelectorComponent } from './components/multi-party-org-selector/multi-party-org-selector.component';
import { MultiPartyOrgSelectorModalComponent } from './components/multi-party-org-selector/multi-party-org-selector-modal/multi-party-org-selector-modal.component';
import { HasPermissionDirective } from './directive/has-permission.directive';
import { ScheduleSelectorComponent } from './components/schedule-selector/schedule-selector.component';
import { TableInputComponent } from './components/table-input/table-input.component';
import { TableViewComponent } from './components/table-view/table-view.component';
import { RadioButtonComponent } from './components/radio-button-component/radio-button.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { EmployeeAutoCompleteComponent } from './components/employee-auto-complete/employee-auto-complete.component';
import { SelectIconFilterComponent } from './components/select-icon-filter/select-icon-filter.component';
import { UnitOrgTreeComponent } from './components/unit-org-tree/unit-org-tree.component';
import { ReportPreviewCertificateComponentS } from './components/reward-general-preview-S/report-preview-certificate-S';
import {EmployeeSelectorComponent} from "@app/shared/components/employee-selector/employee-selector.component";
import {
  EmployeeSelectorModalComponent
} from "@app/shared/components/employee-selector/employee-selector-modal/employee-selector-modal.component";
import { ReportMultiOrgSelectorComponent } from './components/report-multi-org-selector/report-multi-org-selector.component';
import { ReportMultiOrgSelectorModalComponent } from './components/report-multi-org-selector/report-multi-org-selector-modal/report-multi-org-selector-modal.component';
import { ReportMultiPartyOrgSelectorModalComponent } from './components/report-multi-party-org-selector/report-multi-party-org-selector-modal/report-multi-party-org-selector-modal.component';
import { ReportMultiPartyOrgSelectorComponent } from './components/report-multi-party-org-selector/report-multi-party-org-selector.component';
import { ReportMultiMassOrgSelectorModalComponent } from './components/report-multi-mass-org-selector/report-multi-mass-org-selector-modal/report-multi-mass-org-selector-modal.component';
import { ReportMultiMassOrgSelectorComponent } from './components/report-multi-mass-org-selector/report-multi-mass-org-selector.component';
import { ApprovalHistoryModalComponent } from './components/approval-history/approval-history.component';
import { FollowOrgTreeComponent } from './components/follow-org-tree/follow-org-tree.component';
import { MultiFileChooserV2Component } from './components/file-chooser/multi-file-chooser-v2.component';
import {
  ParentThoroughContentPickerComponent
} from "@app/shared/components/parent-thorough-content-picker/parent-thorough-content-picker.component";
import {
  ParentThoroughContentPickerModalComponent
} from "@app/shared/components/parent-thorough-content-picker/parent-thorough-content-picker-modal/parent-thorough-content-picker-modal.component";
import {
  ParentTrainingTopicPickerComponent
} from "@app/shared/components/parent-traing-topic-picker/parent-training-topic-picker.component";
import {
  ParentTrainingTopicPickerModalComponent
} from "@app/shared/components/parent-traing-topic-picker/parent-training-topic-picker-modal/parent-training-topic-picker-modal.component";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    /**
     * prime
     */
    LayoutModule,
    TableModule,
    PaginatorModule,
    ConfirmDialogModule,
    TreeModule,
    CalendarModule,
    ScrollPanelModule,
    StepsModule,
    BreadcrumbModule,
    TabMenuModule,
    DropdownModule,
    TabViewModule,
    FieldsetModule,
    ContextMenuModule,
    ColorPickerModule,
    MultiSelectModule,
    TriStateCheckboxModule,
    InputSwitchModule,
    RatingModule,
    SliderModule,
    RadioButtonModule,
    // FullCalendarModule,
    /**
     * EJ2
     */
    DiagramAllModule,
    SymbolPaletteAllModule,
    OverviewAllModule,
    DiagramModule,
    /**
     * Others
     */
    OrganizationChartModule,
    InternationalPhoneModule,
    TranslationModule,
    NgbModule.forRoot(),
    OverlayPanelModule,
    PickListModule,
    RippleModule,
    DragDropModule,
    OrderListModule,
    CheckboxModule,
    AutoCompleteModule,
    ProgressBarModule,
    DialogModule,
    EditorModule,
    AccordionModule,
    PdfViewerModule,
    TriStateCheckboxModule,
    ButtonModule,
    PanelModule,
    ToastModule,
    TooltipModule,
    InputMaskModule,
    DynamicDialogModule,


  ],
  providers: [
    ConfirmationService,
    TreeDragDropService,
    FormatCurrencyPipe,
    SafePipe,
    PropertyResolver,
    DialogService
  ],
  declarations: [
    ControlMessagesComponent,
    SpinnerComponent,
    OrgSelectorComponent,
    OrgSelectorModalComponent,
    EmployeeSelectorComponent,
    EmployeeSelectorModalComponent,
    OrgMultiSelectorComponent,
    OrgMultiSelectorModalComponent,
    PartyOrgSelectorComponent,
    MassOrgSelectorComponent,
    MassOrgSelectorModalComponent,
    PartyOrgSelectorModalComponent,
    SelectFilterComponent,
    SelectFilterIconComponent,
    DataPickerComponent,
    DataPickerModalComponent,
    ParentThoroughContentPickerComponent,
    ParentThoroughContentPickerModalComponent,
    ParentTrainingTopicPickerComponent,
    ParentTrainingTopicPickerModalComponent,
    DatePickerComponent,
    OrgTreeComponent,
    PartyOrgTreeComponent,
    FollowOrgTreeComponent,
    UnitOrgTreeComponent,
    RewardGeneralModalComponent,
    RewardPartyOrganizationComponent,
    FileChooserComponent,
    MultiFileChooserComponent,
    MultiFileChooserV2Component,
    DisplayHelperPipe,
    MenuTreeComponent,
    InputSpecialDirective,
    InputTrimDirective,
    ImageDirective,
    // BaseComponent,
    AutoFocusDirective,
    FocusFirstInput,
    FocusInvalidInput,
    RemoveWrapperDirective,
    DisplayDatePipe,
    DisplayDateTimePipe,
    DisplayDateMonthPipe,
    ButtonBackComponent,
    HasPermissionDirective,
    MultiSelectFilterComponent,
    EnumeratePipe,

    CalendarMonthComponent,

    // DiagramDashboardComponent,

    ImportErrorComponent,

    FormatCurrencyDirective,
    FormatCurrencyPipe, FindByPipe,

    TableFooterComponent,
    AutoCompleteComponent,
    PartyTreeSelectorComponent,
    dashboardCardComponent,
    DashboardTableComponent,
    DynamicInputComponent,
    SafePipe,
    MultiInputTextComponent,
    MultiDataPickerComponent,
    MultiDataPickerModalComponent,
    MultiPartyOrgSelectorComponent,
    MultiPartyOrgSelectorModalComponent,
    MultiOrgSelectorComponent,
    MultiOrgSelectorModalComponent,
    ReportMultiOrgSelectorComponent,
    ReportMultiOrgSelectorModalComponent,
    ReportMultiPartyOrgSelectorModalComponent,
    ReportMultiPartyOrgSelectorComponent,
    ReportMultiMassOrgSelectorModalComponent,
    ReportMultiMassOrgSelectorComponent,
    ApprovalHistoryModalComponent,

    // Component prevew file tr�nh k�
    ScheduleSelectorComponent,
    TableInputComponent,
    TableViewComponent,
    RadioButtonComponent,
    DynamicFormComponent,
    EmployeeAutoCompleteComponent,
    SelectIconFilterComponent,
    ReportPreviewCertificateComponentS
  ],
  exports: [
    /**
     * Shared module
     */
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    LayoutModule,

    NgbModule,
    FontAwesomeModule,

    TranslationModule,
    /**
     * prime
     */
    EditorModule,
    TableModule,
    PaginatorModule,
    ConfirmDialogModule,
    CalendarModule,
    StepsModule,
    BreadcrumbModule,
    TabMenuModule,
    DropdownModule,
    TabViewModule,
    FieldsetModule,
    SelectButtonModule,
    ContextMenuModule,
    OrganizationChartModule,
    OverlayPanelModule,
    ScrollPanelModule,
    PickListModule,
    TreeModule,
    ColorPickerModule,
    MultiSelectModule,
    DragDropModule,
    OrderListModule,
    CheckboxModule,
    AutoCompleteModule,
    ProgressBarModule,
    TriStateCheckboxModule,
    InputSwitchModule,
    DynamicDialogModule,

    // FullCalendarModule,
    /**
     * EJ2
     */
    DiagramAllModule,
    SymbolPaletteAllModule,
    OverviewAllModule,
    DiagramModule,
    /**
     * Shared Component
     */
    ControlMessagesComponent,
    SpinnerComponent,
    OrgSelectorComponent,
    OrgMultiSelectorComponent,
    OrgMultiSelectorModalComponent,
    PartyOrgSelectorComponent,
    MassOrgSelectorComponent,
    SelectFilterComponent,
    SelectFilterIconComponent,
    DataPickerComponent,
    DatePickerComponent,
    ParentThoroughContentPickerComponent,
    ParentThoroughContentPickerModalComponent,
    ParentTrainingTopicPickerComponent,
    ParentTrainingTopicPickerModalComponent,
    OrgTreeComponent,
    PartyOrgTreeComponent,
    EmployeeSelectorComponent,
    FollowOrgTreeComponent,
    UnitOrgTreeComponent,
    RewardGeneralModalComponent,
    RewardPartyOrganizationComponent,
    FileChooserComponent,
    MultiFileChooserComponent,
    MultiFileChooserV2Component,
    DisplayHelperPipe,
    MenuTreeComponent,
    InternationalPhoneModule,
    InputSpecialDirective,
    InputTrimDirective,
    ImageDirective,
    AutoFocusDirective,
    FocusFirstInput,
    FocusInvalidInput,
    HasPermissionDirective,
    DynamicInputComponent,
    RatingModule,
    SliderModule,
    RadioButtonModule,
    // BaseComponent,
    DisplayDatePipe,
    DisplayDateTimePipe,
    DisplayDateMonthPipe,
    EnumeratePipe,
    ButtonBackComponent,
    MultiSelectFilterComponent,
    CalendarMonthComponent,
    AutoCompleteComponent,
    MultiDataPickerComponent,
    MultiPartyOrgSelectorComponent,
    MultiPartyOrgSelectorModalComponent,
    MultiOrgSelectorComponent,
    MultiOrgSelectorModalComponent,
    ReportMultiOrgSelectorComponent,
    ReportMultiOrgSelectorModalComponent,
    ReportMultiPartyOrgSelectorModalComponent,
    ReportMultiPartyOrgSelectorComponent,
    ReportMultiMassOrgSelectorModalComponent,
    ReportMultiMassOrgSelectorComponent,
    // DiagramDashboardComponent,

    RippleModule,
    ImportErrorComponent,
    FormatCurrencyDirective,
    FormatCurrencyPipe, FindByPipe,
    TableFooterComponent,
    DialogModule,

    // dashBoardComponent
    dashboardCardComponent,
    DashboardTableComponent,
    AccordionModule,
    TableHeaderCheckbox,
    SafePipe,
    PdfViewerModule,
    MultiInputTextComponent,
    TooltipModule,
    TriStateCheckboxModule,
    PartyTreeSelectorComponent,
    ScheduleSelectorComponent,
    TableInputComponent,
    TableViewComponent,
    RadioButtonComponent,
    DynamicFormComponent,
    EmployeeAutoCompleteComponent,
    SelectIconFilterComponent,
  ],
  entryComponents: [
    OrgSelectorModalComponent,
    OrgMultiSelectorModalComponent,
    EmployeeSelectorModalComponent,
    PartyOrgSelectorModalComponent,
    DataPickerModalComponent,
    ParentThoroughContentPickerModalComponent,
      ParentTrainingTopicPickerModalComponent,
    MassOrgSelectorModalComponent,
    MultiDataPickerModalComponent,
    MultiPartyOrgSelectorModalComponent,
    MultiOrgSelectorModalComponent,
    ReportMultiOrgSelectorModalComponent,
    ReportMultiPartyOrgSelectorModalComponent,
    ReportMultiPartyOrgSelectorComponent,
    ReportMultiMassOrgSelectorModalComponent,
    ReportMultiMassOrgSelectorComponent,
    ApprovalHistoryModalComponent,
    RewardGeneralModalComponent,
    RewardPartyOrganizationComponent,
    ReportPreviewCertificateComponentS,
  ]
})
export class SharedModule {
}
