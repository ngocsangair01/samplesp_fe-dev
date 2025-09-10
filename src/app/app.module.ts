import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PlanManagementComponent } from './pages/planmanagement/plan-management.component';
import { CreatePlan } from './pages/plan/create-plan.component';

@NgModule({
  declarations: [
    AppComponent,
    PlanManagementComponent,
    HomeComponent,
    ContactComponent,
    CreatePlan
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
