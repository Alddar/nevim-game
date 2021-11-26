import { Injectable } from '@angular/core';
import {Actions, createEffect} from '@ngrx/effects';
import {NakamaService} from "../../core/services/nakama.service";
import {EMPTY, merge, mergeMap, of} from "rxjs";
import {gameStateUpdate} from "./game.actions";
import {map} from 'ramda'
import {Action} from "@ngrx/store";
import {MatchDataState, OpCodes} from 'shared'
import {MatchDataSend} from "@heroiclabs/nakama-js/dist/.rpt2_cache/placeholder/socket";

@Injectable()
export class GameEffects {
  constructor(private actions$: Actions, private nakamaService: NakamaService) {
  }

  matchData$ = createEffect(() => this.nakamaService.matchData$.pipe(
    mergeMap((matchData) => {
      switch(matchData?.op_code) {
        case OpCodes.GAME_STATE_UPDATE:
          const gameState: MatchDataState = matchData?.data
          return of(gameStateUpdate({gameState}))
        default:
          return EMPTY
      }
    })
  ))
}
