import { createAction, props } from '@ngrx/store';
import { Demand } from '../../model/demand.model';

export const loadDemands = createAction('[Demand] Load Demands');

export const loadDemandsSuccess = createAction(
  '[Demand] Load Demands Success',
  props<{ demands: Demand[] }>()
);

export const loadDemandsFailure = createAction(
  '[Demand] Load Demands Failure',
  props<{ error: string }>()
);

export const createDemand = createAction(
  '[Demand] Create Demand',
  props<{ demand: Demand }>()
);

export const updateDemandStatus = createAction(
  '[Demand] Update Demand Status',
  props<{ demandId: string; status: string; collectorId?: string }>()
); 