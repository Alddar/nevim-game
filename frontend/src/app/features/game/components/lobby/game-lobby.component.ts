import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NakamaService, State} from "../../../core/services/nakama.service";
import {map, switchMap, tap} from "rxjs";
import {Store} from "@ngrx/store";
import {selectPlayerList} from "../../store/game.selectors";
import {ToastrService} from "ngx-toastr";
import {playerJoined, resetPresences} from "../../store/game.actions";

@Component({
  selector: 'app-game-lobby',
  templateUrl: './game-lobby.component.html',
  styleUrls: ['./game-lobby.component.sass']
})
export class GameLobbyComponent implements OnInit {

  matchId: string = ""
  playerList$ = this.store.select(selectPlayerList)

  constructor(private route: ActivatedRoute,
              private nakamaService: NakamaService,
              private store: Store,
              private toastr: ToastrService,
              private router: Router) {

    this.nakamaService.waitForState(State.AUTHENTICATED, () => {
      this.route.params.pipe(
        map((params): string => params['id']),
        tap((matchId) => this.matchId = matchId),
        switchMap((matchId) => {
          return this.nakamaService.joinMatch(matchId)
        })
      ).subscribe({
        next: (match) => {
          match.presences?.forEach((presence) => {
            this.store.dispatch(playerJoined({presence}))
          })
        }, error: (err) => {
          this.toastr.error(JSON.stringify(err))
          this.router.navigate(['game', 'create-or-join'])
        }
      })
    })
  }

  ngOnInit(): void {

  }

  leaveMatch() {
    this.nakamaService.leaveMatch(this.matchId)
    this.store.dispatch(resetPresences())
    this.router.navigate(['game', 'create-or-join'])
  }
}
