import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  constructor(private fb: FormBuilder, private authService: AuthService){
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      birthDate: ['', Validators.required],
      role: ['particulier']
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const success = this.authService.register(this.registerForm.value);
      if (success) {
        this.successMessage = 'Inscription réussie !';
        this.registerForm.reset();
      } else {
        this.errorMessage = 'Cet email est déjà utilisé.';
      }
    }
  }

}
