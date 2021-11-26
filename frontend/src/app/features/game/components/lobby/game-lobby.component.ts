import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NakamaService, State} from "../../../core/services/nakama.service";
import {map, merge, mergeMap, of, startWith, Subject, switchMap, tap, timer} from "rxjs";
import {Store} from "@ngrx/store";
import {selectGameState} from "../../store/game.selectors";
import {ToastrService} from "ngx-toastr";
import {NgxTippyProps} from "ngx-tippy-wrapper";
import {Placement} from "@popperjs/core";

@Component({
  selector: 'app-game-lobby',
  templateUrl: './game-lobby.component.html',
  styleUrls: ['./game-lobby.component.sass']
})
export class GameLobbyComponent implements OnInit {

  matchId: string = ""
  gameState$ = this.store.select(selectGameState)

  copyClickedSubj = new Subject<boolean>()
  copyText$ = this.copyClickedSubj.pipe(
    mergeMap(() => merge(
      of('Link copied!'),
      timer(1000).pipe(
        map(() => 'Click to copy!')
      ))),
    startWith('Click to copy!')
  )

  copyTextTippyProps: NgxTippyProps = (() => {
    const copyText$ = this.copyText$
    return {
      onShow(instance: any): void | false {
        copyText$.subscribe((text) => {
          instance.setContent(text)
        })
      },
      hideOnClick: false,
      placement: 'bottom' as Placement,
    }
  })()

  userId$ = this.nakamaService.userId$

  constructor(private route: ActivatedRoute,
              private nakamaService: NakamaService,
              private store: Store,
              private toastr: ToastrService,
              private router: Router) {

    this.nakamaService.waitForState(State.AUTHENTICATED, () => {
      this.nakamaService.getAccount()?.subscribe((acc) => console.log('acc', acc))
      this.route.params.pipe(
        map((params): string => params['id']),
        tap((matchId) => this.matchId = matchId),
        switchMap((matchId) => {
          return this.nakamaService.joinMatch(matchId)
        })
      ).subscribe({
        error: (err) => {
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
    this.router.navigate(['game', 'create-or-join'])
  }

  get link() {
    const host = window.location.host
    return `${host}/join/${this.matchId}`
  }

  copyLink() {
    this.copyClickedSubj.next(true)
  }
}
