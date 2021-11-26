import {createFeatureSelector, createSelector} from "@ngrx/store";
import {GameState, gameStateFeatureKey} from "./game.reducer";

const selectGame = createFeatureSelector<GameState>(gameStateFeatureKey)

export const selectGameState = createSelector(
  selectGame,
  (game) => game.gameState
)

export const selectChatMessages = createSelector(
  selectGame,
  (game) => game.chatMessages
)
