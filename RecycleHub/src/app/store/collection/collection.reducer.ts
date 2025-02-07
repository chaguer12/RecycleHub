import { createReducer, on } from '@ngrx/store';
import { CollectionRequest } from '../../models/collection.model';
import * as CollectionActions from './collection.actions';

export interface CollectionState {
  collections: CollectionRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: CollectionState = {
  collections: [],
  loading: false,
  error: null
};

export const collectionReducer = createReducer(
  initialState,
  on(CollectionActions.createRequest, state => ({
    ...state,
    loading: true
  })),
  on(CollectionActions.createRequestSuccess, (state, { request }) => ({
    ...state,
    collections: [...state.collections, request],
    loading: false
  }))
); 