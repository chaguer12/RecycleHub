import { User } from '../../model/user.model';

export type AuthenticatedUser = Omit<User, 'password'>;

export interface AuthState {
  user: AuthenticatedUser | null;
  loading: boolean;
  error: string | null;
} 