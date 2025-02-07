import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PointsService {
  private readonly POINTS_RATES = {
    plastic: 2,
    glass: 1,
    paper: 1,
    metal: 5
  };

  private readonly VOUCHERS = {
    100: 50,
    200: 120,
    500: 350
  };

  calculatePoints(materials: { type: string; weight: number }[]): number {
    return materials.reduce((total, material) => {
      return total + (this.POINTS_RATES[material.type] * material.weight);
    }, 0);
  }

  convertToVoucher(points: number): number {
    if (points >= 500) return 350;
    if (points >= 200) return 120;
    if (points >= 100) return 50;
    return 0;
  }

  updateUserPoints(userId: string, points: number): Observable<number> {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].points = (users[userIndex].points || 0) + points;
      localStorage.setItem('users', JSON.stringify(users));
      return of(users[userIndex].points);
    }
    return of(0);
  }
} 