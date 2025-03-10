import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CollectorLoginComponent } from './collector-login.component';
import { CollectorDashboardComponent } from './collector-dashboard.component';

@NgModule({
  declarations: [
    CollectorLoginComponent,
    CollectorDashboardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class CollectorModule { } 