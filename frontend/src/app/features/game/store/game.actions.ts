import {createAction, props} from "@ngrx/store";
import {ChatMessage, GameStateToClient } from "shared";

// gameState

export const gameStateUpdate = createAction('game/gameStateUpdate', props<{gameState: GameStateToClient}>())

// chatMessages

export const chatMessages = createAction('game/chatMessages', props<{messages: ChatMessage[]}>())
export const chatMessage = createAction('game/chatMessage', props<{message: ChatMessage}>())
