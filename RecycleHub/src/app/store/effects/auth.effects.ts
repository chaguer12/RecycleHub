import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as AuthActions from '../actions/auth.actions';
import { CollectorService } from '../../services/collector.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap((action: { email: string; password: string }) => {
        // Vérifier d'abord si c'est un collecteur
        const collector = this.collectorService
          .getAllCollectors()
          .find(c => c.email === action.email && c.password === action.password);

        if (collector) {
          const { password, ...userWithoutPassword } = collector;
          return of(AuthActions.loginSuccess({ 
            user: { ...userWithoutPassword, role: 'collecteur' as const } 
          }));
        }

        // Si ce n'est pas un collecteur, vérifier les utilisateurs normaux
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: { email: string; password: string }) => u.email === action.email);

        if (user && bcrypt.compareSync(action.password, user.password)) {
          const { password, ...userWithoutPassword } = user;
          return of(AuthActions.loginSuccess({ 
            user: { ...userWithoutPassword, role: 'particulier' as const } 
          }));
        }

        return of(AuthActions.loginFailure({ error: 'Invalid credentials' }));
      })
    )
  );

  constructor(
    private actions$: Actions,
    private collectorService: CollectorService
  ) {}
} 