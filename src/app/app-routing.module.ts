import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PlanManagementComponent } from './pages/planmanagement/plan-management.component';
import { CreatePlan } from './pages/plan/create-plan.component';
import { Sign } from './pages/sign/sign.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'plan-management', component: PlanManagementComponent },
  { path: 'plan/create', component: CreatePlan },
  { path: 'sign', component: Sign }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
