import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CollectorService } from '../services/collector.service';

@Component({
  selector: 'app-collector-login',
  templateUrl: './collector-login.component.html',
  standalone: false
})
export class CollectorLoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private collectorService: CollectorService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const collector = this.collectorService.getAllCollectors()
        .find(c => c.email === email && c.password === password);

      setTimeout(() => {
        this.isLoading = false;
        
        if (collector) {
          const { password, ...collectorWithoutPassword } = collector;
          localStorage.setItem('currentUser', JSON.stringify(collectorWithoutPassword));
          this.successMessage = '✅ Login successful! Redirecting...';
          setTimeout(() => this.router.navigate(['/collector/dashboard']), 1000);
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