import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { DemandComponent } from './demand.component';

@NgModule({
  declarations: [DemandComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule
  ],
  exports: [DemandComponent]
})
export class DemandModule { } 