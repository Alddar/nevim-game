import {
  ActionReducerMap, createReducer,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../../../environments/environment';

export const coreStateFeatureKey = 'coreState';

export interface CoreState {
}

const clientInitialState = {}
const clientReducer = createReducer(
  clientInitialState
  )

export const reducers: ActionReducerMap<CoreState> = {
};

export const metaReducers: MetaReducer<CoreState>[] = !environment.production ? [] : [];
