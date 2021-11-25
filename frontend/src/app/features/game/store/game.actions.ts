import {createAction, props} from "@ngrx/store";
import {Presence} from "@heroiclabs/nakama-js";

export const playerJoined = createAction('game/playerJoined', props<{presence: Presence}>())
export const playerLeft = createAction('game/playerLeft', props<{presence: Presence}>())

