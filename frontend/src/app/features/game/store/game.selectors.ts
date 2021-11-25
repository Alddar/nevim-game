import {createFeatureSelector, createSelector} from "@ngrx/store";
import {GameState, gameStateFeatureKey} from "./game.reducer";

const selectGame = createFeatureSelector<GameState>(gameStateFeatureKey)

export const selectPlayerList = createSelector(
  selectGame,
  (game) => game.playerList
)
