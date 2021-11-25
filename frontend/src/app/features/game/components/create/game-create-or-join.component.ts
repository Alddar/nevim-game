import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {NakamaService, State} from "../../../core/services/nakama.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {switchMap, throwError} from "rxjs";
import {playerJoined} from "../../store/game.actions";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-game-create',
  templateUrl: './game-create-or-join.component.html',
  styleUrls: ['./game-create-or-join.component.sass']
})
export class GameCreateOrJoinComponent implements OnInit {

  joinGameForm = this.fb.group({
    matchId: ['', Validators.required]
  })

  constructor(private fb: FormBuilder,
              private nakamaService: NakamaService,
              private toastr: ToastrService,
              private router: Router,
              private store: Store) {
  }

  ngOnInit(): void {
  }

  createMatch() {
    this.nakamaService.waitForState(State.AUTHENTICATED, () => {
      this.nakamaService.createMatch().pipe(switchMap((match) => {
        if (match) {
          return this.nakamaService.joinMatch(match.matchId)
        } else {
          return throwError(() => 'Couldn\'t join match!')
        }
      })).subscribe({
          next: (match) => {
            this.router.navigate(['game', 'lobby', match.match_id])
          },
          error: (error) => {
            console.error(error)
            this.toastr.error(error)
          }
        }
      )
    })
  }

  joinMatch() {
    const form = this.joinGameForm.value
    this.nakamaService.waitForState(State.AUTHENTICATED, () => {
      this.nakamaService.joinMatch(form.matchId).subscribe({
        next: (match) => {
          match.presences.forEach((presence) => {
            this.store.dispatch(playerJoined({presence}))
          })

          this.router.navigate(['game', 'lobby', match.match_id])
        },
        error: (error) => {
          console.log(error)
          this.toastr.error(error)
        }
      })
    })
  }
}
