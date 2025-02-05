import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../model/user.model';
import { Router } from '@angular/router';
import * as bcrypt from 'bcryptjs';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  standalone:false
})
export class SignupComponent {
  signUpForm: FormGroup;
  minAge = 18;
  
  constructor(private fb: FormBuilder,private router: Router) {
    this.signUpForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      city: ['', Validators.required],
      address: ['', Validators.required],
      birthday: ['', [Validators.required, this.validateAge.bind(this)]] 
    }, { validator: this.passwordMatchValidator });
  }
  validateAge(control: any) {
    if (!control.value) return null;
    const birthDate = new Date(control.value);
    const age = this.calculateAge(birthDate);
    return age < this.minAge ? { ageInvalid: true } : null;
  }
  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  passwordMatchValidator(group: FormGroup) {
    return group.get('password')?.value === group.get('confirmPassword')?.value
      ? null : { passwordMismatch: true };
  }
  onSubmit() {
    console.log(this.signUpForm.value);
    if (this.signUpForm.valid) {
      const hashedPassword = bcrypt.hashSync(this.signUpForm.value.password, 10);
      const user = new User(
        this.signUpForm.value.fullName,
        this.signUpForm.value.email,
        hashedPassword,
        this.signUpForm.value.city,
        this.signUpForm.value.address,
        this.signUpForm.value.birthday,
        'particulier'
      );

        
      let users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));

      alert('Account successfully created!');
      this.signUpForm.reset();
      this.router.navigate(['/demand']);
    }
  }

}
