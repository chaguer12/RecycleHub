import { Injectable } from '@angular/core';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] =  JSON.parse(localStorage.getItem('users') || '[]');

  register(user: User): boolean {
    if(this.users.some(u => u.email === user.email)){
      return false;
    }
    this.users.push(user);
    localStorage.setItem('users', JSON.stringify(this.users));
    return true;
  }
  login(email: string, password: string): boolean {
    return this.users.some(user => user.email === email && user.password === password);
  }
}
