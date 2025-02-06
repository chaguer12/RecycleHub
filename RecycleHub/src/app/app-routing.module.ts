import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './auth/signin/signin.component';
import { DemandComponent } from './demand/demand.component';

const routes: Routes = [
  {path: '',component:HomeComponent},
  {path: 'sign-up',component:SignupComponent},
  {path:'log-in', component:SigninComponent},
  {path:'demand',component:DemandComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
