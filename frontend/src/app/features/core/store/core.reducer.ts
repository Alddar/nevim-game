import {
  ActionReducerMap, createReducer,
  MetaReducer, on
} from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import {Client} from "@heroiclabs/nakama-js";
import {authenticateUser} from "./core.actions";
import {Presence} from "@heroiclabs/nakama-js/socket";

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
