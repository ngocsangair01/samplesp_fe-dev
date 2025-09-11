import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PlanManagementComponent } from './pages/planmanagement/plan-management.component';
import { CreatePlan } from './pages/plan/create-plan.component';
import { Sign } from './pages/sign/sign.component';

@NgModule({
  declarations: [
    AppComponent,
    PlanManagementComponent,
    HomeComponent,
    ContactComponent,
    CreatePlan,
    Sign
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
