import {
  ActionReducerMap, createReducer,
  MetaReducer, on
} from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import {gameStateUpdate} from "./game.actions";
import {MatchDataState} from 'shared'

export const gameStateFeatureKey = 'gameState';

export interface GameState {
  gameState: MatchDataState | null,
}

const gameStateReducer = createReducer<MatchDataState | null>(
  null,
  on(gameStateUpdate, (_, {gameState}) => gameState)
)

export const reducers: ActionReducerMap<GameState> = {
  gameState: gameStateReducer
};

export const metaReducers: MetaReducer<GameState>[] = !environment.production ? [] : [];
