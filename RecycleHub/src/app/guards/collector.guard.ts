import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CollectorGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.role === 'collecteur') {
      return true;
    }
    
    this.router.navigate(['/collector/login']);
    return false;
  }

  canNotActivate():boolean {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if(currentUser.role == "collecteur"){
      return false;
    }
    this.router.navigate(['/collector/dashboard'])
    return true;
  }
} 