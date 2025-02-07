import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-profile-modal',
  templateUrl: './update-profile-modal.component.html',
  styleUrls: ['./update-profile-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class UpdateProfileModalComponent {
  updateForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UpdateProfileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public user: any,
    private fb: FormBuilder
  ) {
    this.updateForm = this.fb.group({
      fullName: [user.fullName, Validators.required],
      email: [user.email, [Validators.required, Validators.email]],
      city: [user.city, Validators.required],
      address: [user.address, Validators.required],
    });
  }

  onUpdate() {
    if (this.updateForm.valid) {
      const updatedUser = {
        ...this.user,
        ...this.updateForm.value
      };
      
      // Get all users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Find and update the user
      const userIndex = users.findIndex((u: any) => u.email === this.user.email);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        // Update localStorage with modified users array
        localStorage.setItem('users', JSON.stringify(users));
      }
      
      this.dialogRef.close(updatedUser);
    } else {
      console.log("Form is invalid!");
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
