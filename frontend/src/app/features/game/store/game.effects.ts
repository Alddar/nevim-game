import { Injectable } from '@angular/core';
import {Actions, createEffect} from '@ngrx/effects';
import {NakamaService} from "../../core/services/nakama.service";
import {EMPTY, merge, mergeMap, of} from "rxjs";
import {playerJoined, playerLeft} from "./game.actions";
import {map} from 'ramda'
import {Action} from "@ngrx/store";

@Injectable()
export class GameEffects {



  constructor(private actions$: Actions, private nakamaService: NakamaService) {
  }

  matchPresence$ = createEffect(() => this.nakamaService.matchPresence$.pipe(
    mergeMap((presences) => {
      const result: Action[] = []
      if(presences?.joins) {
        result.push(...map((presence) => playerJoined({presence}), presences.joins))
      }
      if(presences?.leaves) {
        result.push(...map((presence) => playerLeft({presence}), presences.leaves))
      }
      return of(...result)
    })
  ))

}
