import { Injectable } from '@angular/core';
import {Actions, createEffect} from '@ngrx/effects';
import {NakamaService} from "../../core/services/nakama.service";
import {EMPTY, merge, mergeMap, of} from "rxjs";
import {chatMessage, chatMessages, gameStateUpdate} from "./game.actions";
import {map} from 'ramda'
import {Action} from "@ngrx/store";
import {ChatMessage, GameStateToClient, OpCodes} from 'shared'
import {MatchDataSend} from "@heroiclabs/nakama-js/dist/.rpt2_cache/placeholder/socket";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class GameEffects {
  constructor(private actions$: Actions, private nakamaService: NakamaService, private toastrService: ToastrService) {
  }

  matchData$ = createEffect(() => this.nakamaService.matchData$.pipe(
    mergeMap((matchData) => {
      switch(matchData?.op_code) {
        case OpCodes.GAME_STATE_UPDATE:
          const gameState: GameStateToClient = matchData?.data
          return of(gameStateUpdate({gameState}))
        case OpCodes.CHAT_MESSAGES:
          const messages: ChatMessage[] = matchData?.data
          return of(chatMessages({messages}))
        case OpCodes.SEND_CHAT_MESSAGE:
          const message: ChatMessage = matchData?.data
          return of(chatMessage({message}))
        case OpCodes.ERROR:
          this.toastrService.error(matchData?.data)
          return EMPTY
        default:
          return EMPTY
      }
    })
  ))
}
