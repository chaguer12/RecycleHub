import { AuthenticatedUser } from './auth.model';
import { Demand } from '../../model/demand.model';

export interface AppState {
  auth: AuthState;
  demands: DemandState;
  points: PointsState;
}

export interface AuthState {
  user: AuthenticatedUser | null;
  loading: boolean;
  error: string | null;
  
}

export interface DemandState {
  demands: Demand[];
  loading: boolean;
  error: string | null;
}

export interface PointsState {
  points: number;
  loading: boolean;
  error: string | null;
} 