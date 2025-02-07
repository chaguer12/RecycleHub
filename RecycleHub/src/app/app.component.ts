import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UpdateProfileModalComponent } from './update-profile-modal/update-profile-modal.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent {
  title = 'RecycleHub';
  user: any;

  constructor(private dialog: MatDialog) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }

  openUpdateProfileModal() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find((u: any) => u.email === this.user.email) || {};
    
    const dialogRef = this.dialog.open(UpdateProfileModalComponent, {
      data: currentUser
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.user = result;
      }
    });
  }
}
