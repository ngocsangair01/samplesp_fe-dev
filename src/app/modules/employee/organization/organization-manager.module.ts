
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from '@app/shared';
import { ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { OrganizationManagerIndexComponent } from './organization-manager-index/organization-manager-index.component';
import { OrganizationManagerSearchComponent } from './organization-manager-search/organization-manager-search.component';
import { OrganizationManagerRoutingModule } from './organization-manager-routing.module';
import { OrganizationManagerComponent } from './organization-manager.component';

@NgModule({
  declarations: [
    OrganizationManagerComponent,
    OrganizationManagerIndexComponent,
    OrganizationManagerSearchComponent,
  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AccordionModule,
    OrganizationManagerRoutingModule

  ],
})
export class OrganizationManagerModule {}
