import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './auth/signin/signin.component';
import { DemandComponent } from './demand/demand.component';
import { FormsModule } from '@angular/forms';
import{ MatDialogModule } from '@angular/material/dialog';
import { UpdateProfileModalComponent } from './update-profile-modal/update-profile-modal.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { DemandModule } from './demand/demand.module';
import { UpdateProfileModalModule } from './update-profile-modal/update-profile-modal.module';
import { HomeModule } from './home/home.module';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({}),
    CommonModule,
    DemandModule,
    UpdateProfileModalModule,
    HomeModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
