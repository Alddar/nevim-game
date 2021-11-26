import {
  ActionReducerMap, createReducer,
  MetaReducer, on
} from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import {chatMessage, chatMessages, gameStateUpdate} from "./game.actions";
import {GameStateToClient, ChatMessage} from 'shared'

export const gameStateFeatureKey = 'gameState';

export interface GameState {
  gameState: GameStateToClient | null,
  chatMessages: ChatMessage[]
}

const gameStateReducer = createReducer<GameStateToClient | null>(
  null,
  on(gameStateUpdate, (_, {gameState}) => gameState)
)

const chatMessagesReducer = createReducer<ChatMessage[]>(
  [],
  on(chatMessages, (_, {messages}) => messages),
  on(chatMessage, (state, {message}) => [...state, message])
)

export const reducers: ActionReducerMap<GameState> = {
  gameState: gameStateReducer,
  chatMessages: chatMessagesReducer
};

export const metaReducers: MetaReducer<GameState>[] = !environment.production ? [] : [];
