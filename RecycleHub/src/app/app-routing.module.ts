import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { DemandComponent } from './demand/demand.component';
import { AuthGuard } from './guards/auth.guard';
import { CollectorDashboardComponent } from './collector/collector-dashboard.component';
import { CollectorGuard } from './guards/collector.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sign-up', component: SignupComponent },
  { path: 'sign-in', component: SigninComponent },
  { path: 'demand', component: DemandComponent, canActivate: [AuthGuard] },
  { 
    path: 'collector/dashboard', 
    component: CollectorDashboardComponent,
    canActivate: [AuthGuard, CollectorGuard]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
