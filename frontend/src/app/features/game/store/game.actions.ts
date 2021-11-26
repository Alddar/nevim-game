import {createAction, props} from "@ngrx/store";
import { MatchDataState } from "shared";

// gameState

export const gameStateUpdate = createAction('game/gameStateUpdate', props<{gameState: MatchDataState}>())

