import {
  ActionReducerMap, createReducer,
  MetaReducer, on
} from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import {Presence} from "@heroiclabs/nakama-js/socket";
import {playerJoined, playerLeft, resetPresences} from "./game.actions";
import {filter} from "ramda";

export const gameStateFeatureKey = 'gameState';

export interface GameState {
  playerList: Presence[]
}

const playerListReducer = createReducer<Presence[]>(
  [],
  on(playerJoined, (state, {presence}) => [...state, presence]),
  on(playerLeft, (state, {presence}) => filter((p) => p.user_id !== presence.user_id, state)),
  on(resetPresences, () => [])
)

export const reducers: ActionReducerMap<GameState> = {
  playerList: playerListReducer
};

export const metaReducers: MetaReducer<GameState>[] = !environment.production ? [] : [];
