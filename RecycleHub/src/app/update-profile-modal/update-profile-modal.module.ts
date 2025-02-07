import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateProfileModalComponent } from './update-profile-modal.component';

@NgModule({
  declarations: [UpdateProfileModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [UpdateProfileModalComponent]
})
export class UpdateProfileModalModule { } 