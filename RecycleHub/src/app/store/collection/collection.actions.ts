import { createAction, props } from '@ngrx/store';
import { CollectionRequest } from '../../models/collection.model';

export const createRequest = createAction(
  '[Collection] Create Request',
  props<{ request: CollectionRequest }>()
);

export const createRequestSuccess = createAction(
  '[Collection] Create Request Success',
  props<{ request: CollectionRequest }>()
);

export const loadCollections = createAction(
  '[Collection] Load Collections'
);

export const loadCollectionsSuccess = createAction(
  '[Collection] Load Collections Success',
  props<{ collections: CollectionRequest[] }>()
); 