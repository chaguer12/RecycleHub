import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
  standalone: false
})
export class SigninComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin() {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      const user = users.find((u: any) => u.email === email);

      setTimeout(() => {
        this.isLoading = false;
        
        if (user && bcrypt.compareSync(password, user.password)) {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.successMessage = '✅ Login successful! Redirecting...';
          setTimeout(() => this.router.navigate(['/demand']), 1000);
        } else {
          this.errorMessage = '❌ Invalid email or password.';
        }
      }, 1000);
    } else {
      this.isLoading = false;
      this.errorMessage = '❗ Please fill in all fields correctly.';
    }
  }
}
