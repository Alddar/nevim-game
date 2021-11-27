import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {NakamaService, State} from "../../../core/services/nakama.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
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
      this.nakamaService.createMatch().subscribe({
          next: (match) => {
            this.router.navigate(['game', 'lobby', match.matchId])
          },
          error: (error) => {
            console.error(error)
            this.toastr.error(JSON.stringify(error))
          }
        }
      )
    })
  }

  joinMatch() {
    const form = this.joinGameForm.value
    this.router.navigate(['game', 'lobby', form.matchId])
  }
}
